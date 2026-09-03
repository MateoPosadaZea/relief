/* ------------------------------------------------------------------
   RELIEF — modelo 3D de las gafas.

   El modelo es paramétrico: se construye en código, no hay .glb que
   cargar. Eso lo hace liviano y permite que el lente cambie de color
   mientras se avanza por la historia (ámbar → rojo), que es justamente
   el arco que cuenta la página.

   Se carga en diferido y solo si el navegador puede: sin WebGL, o con
   prefers-reduced-motion, el hero se queda plano y no pasa nada.
------------------------------------------------------------------ */
import * as THREE from './vendor/three.module.min.js';

const AMBAR = 0xF2A93B;
const ROJO  = 0xD91F26;

/* Rectángulo de esquinas redondeadas, en el plano XY. */
function rectangulo(ancho, alto, radio, dy) {
  const s = new THREE.Shape();
  const x = -ancho / 2, y = -alto / 2 + (dy || 0);
  s.moveTo(x + radio, y);
  s.lineTo(x + ancho - radio, y);
  s.quadraticCurveTo(x + ancho, y, x + ancho, y + radio);
  s.lineTo(x + ancho, y + alto - radio);
  s.quadraticCurveTo(x + ancho, y + alto, x + ancho - radio, y + alto);
  s.lineTo(x + radio, y + alto);
  s.quadraticCurveTo(x, y + alto, x, y + alto - radio);
  s.lineTo(x, y + radio);
  s.quadraticCurveTo(x, y, x + radio, y);
  return s;
}

/* Perfil lateral de la varilla: recta que adelgaza y cae sobre la oreja.
   Se dibuja de lado (X = hacia atrás, Y = alto) y luego se rota. */
function perfilVarilla(largo) {
  const s = new THREE.Shape();
  const a0 = 0.085;            // alto en la bisagra
  const a1 = 0.052;            // alto donde empieza la caída
  const caida = 0.20;          // cuánto baja la punta
  s.moveTo(0, a0 / 2);
  s.lineTo(largo * 0.70, a1 / 2);
  s.quadraticCurveTo(largo * 0.94, a1 / 2 - caida * 0.45, largo, a1 / 2 - caida);
  s.lineTo(largo - 0.035, a1 / 2 - caida - 0.030);
  s.quadraticCurveTo(largo * 0.93, a1 / 2 - caida * 0.5 - a1, largo * 0.70, -a1 / 2);
  s.lineTo(0, -a0 / 2);
  s.closePath();
  return s;
}

/* Medidas leídas de las fotos del producto: aro bastante rectangular,
   barra superior recta que cruza toda la frente, y un canto claro encima
   — es la laminación de dos capas del acetato real.
   Viven fuera de la función porque de ellas salen también las anclas del
   despiece: los puntos a los que la cámara se acerca al explicar cada pieza. */
const ANCHO = 0.96, ALTO = 0.66, RADIO = 0.075, GROSOR = 0.030;
const SEPARACION = 0.545;
const FONDO = 0.072;                       // profundidad del frente
const MEDIO = SEPARACION + ANCHO / 2;      // borde exterior del frente
/* Curvatura del frente: los dos aros no están en un plano, se abren hacia
   atrás siguiendo la cara. Un frente plano es la señal más delatora de un
   modelo de juguete. */
const ENVOLVENTE = 0.20;                   // radianes que gira cada aro

/* Gira un punto alrededor del centro del puente para acompañar la envolvente.
   Lo usan tanto las piezas como las anclas: si las anclas no se envuelven con
   el modelo, la cámara apunta a donde la pieza ya no está. */
function envuelto(x, y, z, lado) {
  const t = lado * ENVOLVENTE;
  return [x * Math.cos(t) + z * Math.sin(t), y, -x * Math.sin(t) + z * Math.cos(t)];
}

/* Cada ancla dice adónde mirar, desde qué giro y con cuánto acercamiento.
   `piezas` nombra las mallas que quedan encendidas; el resto se atenúa. */
export const ANCLAS = {
  /* Vistas del conjunto. Son varias a propósito: con un solo "conjunto", los
     cuatro paneles de relato seguidos compartían anclaje y el modelo se
     quedaba quieto mientras pasaban tres textos. */
  conjunto: { punto:[0, 0, 0],                            giroY:-0.55, giroX: 0.16, zoom:1.00, piezas:null },
  frente:   { punto:[0, 0, 0],                            giroY:-0.10, giroX: 0.05, zoom:1.06, piezas:null },
  perfil:   { punto:[0, 0, 0],                            giroY:-0.98, giroX: 0.09, zoom:0.92, piezas:null },
  alto:     { punto:[0, 0, 0],                            giroY:-0.42, giroX: 0.44, zoom:1.02, piezas:null },
  bajo:     { punto:[0, 0, 0],                            giroY:-0.66, giroX:-0.14, zoom:1.00, piezas:null },
  montura:  { punto:[0, 0, 0],                            giroY:-0.34, giroX: 0.12, zoom:1.12, piezas:['aro-i','aro-d','filo-i','filo-d','puente'] },
  lente:    { punto:envuelto(SEPARACION, 0, 0, 1),        giroY:-0.08, giroX: 0.04, zoom:1.32, piezas:['cristal-d','aro-d'] },
  puente:   { punto:[0, ALTO/2 - 0.150, 0],               giroY:-0.12, giroX: 0.26, zoom:1.40, piezas:['puente','aro-i','aro-d'] },
  bisagra:  { punto:envuelto(MEDIO - 0.02, ALTO/2 - 0.12, 0, 1), giroY:-1.00, giroX: 0.20, zoom:1.40, piezas:['bisagra-d','aro-d'] },
  varilla:  { punto:envuelto(MEDIO + 0.28, ALTO/2 - 0.30, -0.55, 1), giroY:-1.35, giroX: 0.12, zoom:1.10, piezas:['varilla-d','bisagra-d'] }
};

/* Entorno de reflejo. Sin nada que reflejar, el acetato y el cristal se ven
   como plástico plano: es lo que más separa un render de una foto. En vez de
   cargar un HDRI —peso y una petición más— se pinta un degradado con una banda
   clara arriba, que hace de fuente de luz y deja el reflejo largo del borde. */
export function ambiente(renderer) {
  const lienzo = document.createElement('canvas');
  lienzo.width = 16; lienzo.height = 64;
  const g = lienzo.getContext('2d');
  const deg = g.createLinearGradient(0, 0, 0, 64);
  deg.addColorStop(0.00, '#33363F');
  deg.addColorStop(0.40, '#15161B');
  deg.addColorStop(0.58, '#0B0C0F');
  deg.addColorStop(1.00, '#050506');
  g.fillStyle = deg; g.fillRect(0, 0, 16, 64);
  g.fillStyle = '#A7AEBA'; g.fillRect(0, 5, 16, 9);   // la fuente

  const tex = new THREE.CanvasTexture(lienzo);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromEquirectangular(tex).texture;
  pmrem.dispose(); tex.dispose();
  return env;
}

export function construirGafas() {
  const gafas = new THREE.Group();

  /* Acetato mate, no plástico barnizado: el brillo alto es lo que hace que un
     modelo parezca de juguete. Un punto de clearcoat basta para el reflejo
     largo del borde. */
  const montura = new THREE.MeshPhysicalMaterial({
    color: 0x25252A, roughness: 0.58, metalness: 0.05,
    clearcoat: 0.25, clearcoatRoughness: 0.45,
    /* El reflejo del entorno hace casi todo el trabajo; las luces directas
       pasan a acompañar. Al revés, el acetato se ve encerado. */
    envMapIntensity: 1.9
  });
  /* El canto claro del borde superior. No es un color de marca: es una
     característica física del producto, visible en las cuatro fotos. */
  const canto = new THREE.MeshPhysicalMaterial({
    color: 0x5E646E, roughness: 0.55, metalness: 0.10, clearcoat: 0.2,
    envMapIntensity: 1.6
  });

  /* El material del lente es compartido: cambiarle el color mueve los dos
     lentes a la vez cuando avanza la historia. */
  /* Lente teñido, no pantalla encendida: la emisión alta lo convertía en un
     filtro de cine. El color vive en la transmisión y en la atenuación. */
  const cristal = new THREE.MeshPhysicalMaterial({
    color: AMBAR, roughness: 0.04, metalness: 0,
    transmission: 0.96, thickness: 0.14, ior: 1.53,
    attenuationColor: AMBAR, attenuationDistance: 1.6,
    transparent: true, opacity: 0.38, side: THREE.DoubleSide,
    emissive: AMBAR, emissiveIntensity: 0.02, specularIntensity: 0.9,
    envMapIntensity: 1.5
  });

  const extruir = (forma, prof, bisel) => new THREE.ExtrudeGeometry(forma, {
    depth: prof, bevelEnabled: bisel,
    bevelThickness: 0.006, bevelSize: 0.006, bevelSegments: 2, curveSegments: 18
  });

  /* Cada lado se gira sobre el centro del puente, así el frente deja de ser
     una lámina plana y se abre siguiendo la cara. El puente queda en el
     centro, que es el eje del giro, y une las dos mitades. */
  const envolver = (malla, lado) => {
    const [x, y, z] = envuelto(malla.position.x, malla.position.y, malla.position.z, lado);
    malla.position.set(x, y, z);
    malla.rotation.y += lado * ENVOLVENTE;
  };

  for (const lado of [-1, 1]) {
    const x = lado * SEPARACION;

    /* El hueco va desplazado hacia abajo: el borde de arriba queda grueso —la
       ceja— y el de abajo fino, que es como está hecha la montura real. Con
       eso sobra la ceja recta cruzando la frente, que era lo más delator. */
    const aro = rectangulo(ANCHO, ALTO, RADIO);
    aro.holes.push(rectangulo(ANCHO - GROSOR * 2, ALTO - GROSOR * 2.4, RADIO * 0.62, -0.018));
    const mallaAro = new THREE.Mesh(extruir(aro, FONDO, true), montura);
    mallaAro.position.set(x, 0, -FONDO / 2);
    mallaAro.name = lado < 0 ? 'aro-i' : 'aro-d';
    envolver(mallaAro, lado);
    gafas.add(mallaAro);

    const mallaCristal = new THREE.Mesh(
      extruir(rectangulo(ANCHO - GROSOR * 1.6, ALTO - GROSOR * 1.6, RADIO * 0.68), 0.014, false),
      cristal
    );
    mallaCristal.position.set(x, 0, -0.016);
    mallaCristal.name = lado < 0 ? 'cristal-i' : 'cristal-d';
    envolver(mallaCristal, lado);
    gafas.add(mallaCristal);

    /* El canto claro: una línea sobre el borde superior de cada aro, del ancho
       del aro y no de toda la frente. */
    const filo = new THREE.Mesh(
      extruir(rectangulo(ANCHO - 0.10, 0.007, 0.003), FONDO * 0.62, false), canto);
    filo.position.set(x, ALTO / 2 - 0.006, -FONDO * 0.34);
    filo.name = lado < 0 ? 'filo-i' : 'filo-d';
    envolver(filo, lado);
    gafas.add(filo);

    /* Bisagra: el bloque donde entra la varilla. */
    const bisagra = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.085, FONDO * 0.85), montura);
    bisagra.position.set(lado * (MEDIO - 0.018), ALTO / 2 - 0.12, -FONDO * 0.45);
    bisagra.name = lado < 0 ? 'bisagra-i' : 'bisagra-d';
    envolver(bisagra, lado);
    gafas.add(bisagra);

    /* Varilla plana, no un tubo: en las fotos es una lámina que adelgaza. */
    const varilla = new THREE.Mesh(extruir(perfilVarilla(1.44), 0.024, true), montura);
    /* +90°, no -90°: rotando al otro lado el perfil apuntaba hacia adelante
       y la varilla cruzaba por encima del lente. */
    varilla.rotation.y = Math.PI / 2;
    varilla.position.set(lado * (MEDIO - 0.006), ALTO / 2 - 0.125, -FONDO * 0.55);
    if (lado === -1) varilla.position.x -= 0.024;   // el grosor se extruye hacia +X
    varilla.name = lado < 0 ? 'varilla-i' : 'varilla-d';
    envolver(varilla, lado);
    gafas.add(varilla);
  }


  /* Puente: un tramo de la propia montura, no un alambre. Va a la altura de la
     ceja y con el grosor del frente, que es lo que lo integra al aro. */
  const arco = new THREE.Shape();
  const rp = SEPARACION - ANCHO / 2 + 0.012;      // medio ancho del puente
  arco.moveTo(-rp, 0.050);
  arco.lineTo(rp, 0.050);
  arco.lineTo(rp, -0.004);
  arco.quadraticCurveTo(rp * 0.55, -0.056, 0, -0.056);
  arco.quadraticCurveTo(-rp * 0.55, -0.056, -rp, -0.004);
  arco.closePath();
  const puente = new THREE.Mesh(extruir(arco, FONDO * 0.86, true), montura);
  puente.position.set(0, ALTO / 2 - 0.050, -FONDO / 2 + 0.004);
  puente.name = 'puente';
  gafas.add(puente);

  return { gafas, cristal };
}

export function iniciarGafas(canvas, contenedorProgreso, paneles) {
  const renderer = new THREE.WebGLRenderer({
    canvas, antialias: true, alpha: true, powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const escena = new THREE.Scene();
  escena.environment = ambiente(renderer);
  const camara = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camara.position.set(0, 0.05, 4.2);

  const { gafas, cristal } = construirGafas();
  escena.add(gafas);

  /* Luz de estudio: una key cálida arriba y un rim frío atrás, que es el
     mismo esquema que pedimos en las fotos de producto. */
  escena.add(new THREE.AmbientLight(0xffffff, 0.28));
  const key = new THREE.DirectionalLight(0xfff2e0, 2.6);
  key.position.set(-2.2, 3.0, 2.6);
  escena.add(key);
  const rim = new THREE.DirectionalLight(0xbcd4ff, 3.4);
  rim.position.set(1.8, 1.4, -2.6);
  escena.add(rim);
  const relleno = new THREE.DirectionalLight(0xffffff, 0.5);
  relleno.position.set(2.4, -1.2, 1.8);
  escena.add(relleno);

  const colorAmbar = new THREE.Color(AMBAR);
  const colorRojo  = new THREE.Color(ROJO);
  /* Color actual del cristal. Persigue al del panel que se esté leyendo. */
  const colorActual = new THREE.Color(AMBAR);

  /* El color NO se interpola a lo largo de todo el scroll: así, al llegar al
     panel del ámbar, el cristal ya iba a mitad de camino hacia el rojo. Cada
     panel declara su lente con data-lente y el cristal se adapta al que se
     esté leyendo. */
  function colorDelPanel() {
    if (!paneles || !paneles.length) return colorAmbar;
    const medio = window.innerHeight / 2;
    let elegido = null, cerca = Infinity;
    for (const p of paneles) {
      const r = p.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) continue;
      const d = Math.abs((r.top + r.bottom) / 2 - medio);
      if (d < cerca) { cerca = d; elegido = p; }
    }
    if (!elegido) return colorActual;
    return elegido.dataset.lente === 'rojo' ? colorRojo : colorAmbar;
  }

  let progreso = 0;      // 0 = arriba de la historia, 1 = al final
  let baseY = 0.05;      // altura del modelo, la fija colocar()
  let visible = true;
  let animando = false;

  /* Colocación responsiva: en pantallas anchas las gafas se van a la
     derecha para dejarle la columna izquierda al texto; en móvil suben,
     porque ahí el texto vive abajo. */
  function colocar(ancho, alto) {
    const anchoPantalla = window.innerWidth;
    if (anchoPantalla >= 900) {
      gafas.position.x = 0.78;
      baseY = 0.02;
      gafas.scale.setScalar(0.72);
      camara.position.z = 5.0;
    } else if (anchoPantalla >= 620) {
      gafas.position.x = 0.24;
      baseY = 0.72;
      gafas.scale.setScalar(0.58);
      camara.position.z = 5.4;
    } else {
      /* En vertical el campo horizontal es mucho más estrecho que el
         vertical: el modelo tiene que ser bastante más pequeño para no
         cortarse, y sube para dejarle la mitad de abajo al texto. */
      /* Ni tan arriba que quede media pantalla vacía entre el modelo y el
         texto, ni tan abajo que se le encime al titular. */
      /* Medido sobre la captura: el lente tiene que caer en la franja
         entre el nav y el titular. A 0.88 se encimaba al texto. */
      gafas.position.x = -0.02;
      baseY = 1.50;
      gafas.scale.setScalar(0.40);
      camara.position.z = 5.8;
    }
  }

  function medir() {
    const r = canvas.getBoundingClientRect();
    const ancho = Math.max(1, Math.round(r.width));
    const alto  = Math.max(1, Math.round(r.height));
    renderer.setSize(ancho, alto, false);
    camara.aspect = ancho / alto;
    colocar(ancho, alto);
    camara.updateProjectionMatrix();
  }

  function leerProgreso() {
    if (!contenedorProgreso) return 0;
    const r = contenedorProgreso.getBoundingClientRect();
    const recorrido = r.height - window.innerHeight;
    if (recorrido <= 0) return 0;
    return Math.min(1, Math.max(0, -r.top / recorrido));
  }

  function dibujar() {
    /* La montura gira de tres cuartos a frontal y se inclina, mientras el
       cristal pasa de ámbar a rojo: trabajar → parar. */
    gafas.rotation.y = (-0.62 + progreso * 0.62);
    gafas.rotation.x = (0.20 - progreso * 0.16);
    gafas.rotation.z = (0.06 - progreso * 0.06);
    gafas.position.y = baseY + progreso * 0.06;
    cristal.color.copy(colorActual);
    cristal.emissive.copy(colorActual);
    renderer.render(escena, camara);
  }

  function marco() {
    if (!animando) return;
    const objetivo = leerProgreso();
    /* Suavizado: el giro persigue al scroll en vez de pegarse a él. */
    progreso += (objetivo - progreso) * 0.08;
    /* El cambio de lente también se persigue, para que sea un fundido y no
       un salto al pasar de un panel al siguiente. */
    colorActual.lerp(colorDelPanel(), 0.05);
    dibujar();
    requestAnimationFrame(marco);
  }

  function arrancar() {
    if (animando || !visible) return;
    animando = true;
    requestAnimationFrame(marco);
  }
  function parar() { animando = false; }

  /* Sin animación cuando el canvas no está en pantalla: no quemamos
     batería renderizando algo que nadie ve. */
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entradas => {
      visible = entradas[0].isIntersecting;
      visible ? arrancar() : parar();
    }, { threshold: 0 }).observe(canvas);
  }

  window.addEventListener('resize', () => { medir(); dibujar(); });

  medir();
  progreso = leerProgreso();
  colorActual.copy(colorDelPanel());
  dibujar();

  const quietud = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (quietud.matches) {
    /* Sin movimiento: se dibuja una vez por scroll, sin bucle. */
    window.addEventListener('scroll', () => {
      progreso = leerProgreso();
      /* Sin animación: el color salta al del panel, sin fundido. */
      colorActual.copy(colorDelPanel());
      dibujar();
    }, { passive: true });
  } else {
    arrancar();
  }

  canvas.dataset.listo = 'true';
  /* `grupo` se expone para poder inspeccionar el modelo desde un banco de
     pruebas sin tocar la página. */
  return { medir, dibujar };
}

/* ------------------------------------------------------------------
   Visor de producto.

   El mismo modelo, pero al servicio de la decisión de compra: centrado,
   con el color del lente de ESE producto y girable con el dedo. No hay
   scroll de por medio — acá el usuario manda.
------------------------------------------------------------------ */
export function iniciarVisor(canvas, opciones = {}) {
  const renderer = new THREE.WebGLRenderer({
    canvas, antialias: true, alpha: true, powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const escena = new THREE.Scene();
  escena.environment = ambiente(renderer);
  const camara = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camara.position.set(0, 0, 4.35);

  const { gafas, cristal } = construirGafas();
  escena.add(gafas);

  escena.add(new THREE.AmbientLight(0xffffff, 0.28));
  const key = new THREE.DirectionalLight(0xfff2e0, 2.6);
  key.position.set(-2.2, 3.0, 2.6); escena.add(key);
  const rim = new THREE.DirectionalLight(0xbcd4ff, 3.4);
  rim.position.set(1.8, 1.4, -2.6); escena.add(rim);
  const relleno = new THREE.DirectionalLight(0xffffff, 0.5);
  relleno.position.set(2.4, -1.2, 1.8); escena.add(relleno);

  /* Recibe el nombre del lente, no el hex: así el visor habla el mismo
     vocabulario que el catálogo ('ambar' | 'rojo') y quien lo llama no
     tiene que conocer los colores. Pasarle un hex directo haría que
     THREE.Color.set() no reconociera el valor y solo avisara por consola. */
  function pintarLente(cual) {
    const hex = cual === 'rojo' ? ROJO : AMBAR;
    cristal.color.set(hex);
    cristal.emissive.set(hex);
  }
  pintarLente(opciones.color);

  /* Estado del giro. `objetivo` es a dónde va; `actual` lo persigue, para
     que soltar el dedo no corte el movimiento en seco. */
  const objetivo = { x: 0.16, y: -0.55 };
  const actual   = { x: 0.16, y: -0.55 };
  let arrastrando = false, ultimoX = 0, ultimoY = 0, tocado = false;

  const quietud = window.matchMedia('(prefers-reduced-motion: reduce)');
  let visible = true, animando = false;

  function medir() {
    const r = canvas.getBoundingClientRect();
    const w = Math.max(1, Math.round(r.width));
    const h = Math.max(1, Math.round(r.height));
    renderer.setSize(w, h, false);
    camara.aspect = w / h;
    /* En vertical el campo horizontal se estrecha: el modelo encoge para
       no salirse por los lados. */
    gafas.scale.setScalar(w / h < 1.25 ? 0.74 : 0.92);
    camara.updateProjectionMatrix();
  }

  function dibujar() {
    actual.x += (objetivo.x - actual.x) * 0.12;
    actual.y += (objetivo.y - actual.y) * 0.12;
    gafas.rotation.x = actual.x;
    gafas.rotation.y = actual.y;
    renderer.render(escena, camara);
  }

  function marco() {
    if (!animando) return;
    /* Giro lento mientras nadie lo ha tocado: invita a agarrarlo. Se apaga
       apenas el usuario interviene, y nunca corre con reduced-motion. */
    if (!arrastrando && !tocado && !quietud.matches) objetivo.y += 0.0035;
    dibujar();
    requestAnimationFrame(marco);
  }
  function arrancar(){ if (!animando && visible) { animando = true; requestAnimationFrame(marco); } }
  function parar(){ animando = false; }

  canvas.addEventListener('pointerdown', ev => {
    arrastrando = true; tocado = true;
    ultimoX = ev.clientX; ultimoY = ev.clientY;
    canvas.setPointerCapture(ev.pointerId);
    canvas.style.cursor = 'grabbing';
  });
  canvas.addEventListener('pointermove', ev => {
    if (!arrastrando) return;
    objetivo.y += (ev.clientX - ultimoX) * 0.009;
    objetivo.x += (ev.clientY - ultimoY) * 0.006;
    /* Tope vertical: sin esto el modelo se puede voltear boca abajo. */
    objetivo.x = Math.min(0.75, Math.max(-0.55, objetivo.x));
    ultimoX = ev.clientX; ultimoY = ev.clientY;
    if (quietud.matches) dibujar();
  });
  const soltar = () => { arrastrando = false; canvas.style.cursor = 'grab'; };
  canvas.addEventListener('pointerup', soltar);
  canvas.addEventListener('pointercancel', soltar);
  canvas.style.cursor = 'grab';
  canvas.style.touchAction = 'pan-y';   // el scroll vertical sigue funcionando

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(e => { visible = e[0].isIntersecting; visible ? arrancar() : parar(); },
      { threshold: 0 }).observe(canvas);
  }
  window.addEventListener('resize', () => { medir(); dibujar(); });

  medir();
  dibujar();
  if (!quietud.matches) arrancar();
  canvas.dataset.listo = 'true';

  return { pintarLente, medir, dibujar };
}
