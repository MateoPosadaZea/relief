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
function rectangulo(ancho, alto, radio) {
  const s = new THREE.Shape();
  const x = -ancho / 2, y = -alto / 2;
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
const ANCHO = 1.02, ALTO = 0.52, RADIO = 0.055, GROSOR = 0.038;
const SEPARACION = 0.575;
const FONDO = 0.095;                       // profundidad del frente
const MEDIO = SEPARACION + ANCHO / 2;      // borde exterior del frente

/* Cada ancla dice adónde mirar, desde qué giro y con cuánto acercamiento.
   `piezas` nombra las mallas que quedan encendidas; el resto se atenúa. */
export const ANCLAS = {
  conjunto: { punto:[0, 0, 0],                            giroY:-0.55, giroX: 0.16, zoom:1.00, piezas:null },
  montura:  { punto:[0, 0, 0],                            giroY:-0.34, giroX: 0.12, zoom:1.12, piezas:['aro-i','aro-d','barra','filo','puente'] },
  lente:    { punto:[SEPARACION, 0, 0],                   giroY:-0.08, giroX: 0.04, zoom:1.32, piezas:['cristal-d','aro-d'] },
  puente:   { punto:[0, ALTO/2 - 0.125, 0],               giroY:-0.12, giroX: 0.26, zoom:1.40, piezas:['puente','barra'] },
  bisagra:  { punto:[MEDIO - 0.02, ALTO/2 - 0.10, 0],     giroY:-1.00, giroX: 0.20, zoom:1.40, piezas:['bisagra-d','aro-d'] },
  varilla:  { punto:[MEDIO + 0.30, ALTO/2 - 0.28, -0.55], giroY:-1.35, giroX: 0.12, zoom:1.10, piezas:['varilla-d','bisagra-d'] }
};

export function construirGafas() {
  const gafas = new THREE.Group();

  const montura = new THREE.MeshPhysicalMaterial({
    color: 0x2F2F34, roughness: 0.45, metalness: 0.15, clearcoat: 0.5, clearcoatRoughness: 0.3
  });
  /* El canto claro del borde superior. No es un color de marca: es una
     característica física del producto, visible en las cuatro fotos. */
  const canto = new THREE.MeshPhysicalMaterial({
    color: 0xB9C9DE, roughness: 0.3, metalness: 0.1, clearcoat: 0.6
  });

  /* El material del lente es compartido: cambiarle el color mueve los dos
     lentes a la vez cuando avanza la historia. */
  const cristal = new THREE.MeshPhysicalMaterial({
    color: AMBAR, roughness: 0.06, metalness: 0,
    transmission: 0.92, thickness: 0.4, ior: 1.52,
    transparent: true, opacity: 0.6, side: THREE.DoubleSide,
    emissive: AMBAR, emissiveIntensity: 0.14, specularIntensity: 1
  });

  const extruir = (forma, prof, bisel) => new THREE.ExtrudeGeometry(forma, {
    depth: prof, bevelEnabled: bisel,
    bevelThickness: 0.006, bevelSize: 0.006, bevelSegments: 2, curveSegments: 18
  });

  for (const lado of [-1, 1]) {
    const x = lado * SEPARACION;

    const aro = rectangulo(ANCHO, ALTO, RADIO);
    aro.holes.push(rectangulo(ANCHO - GROSOR * 2, ALTO - GROSOR * 2, RADIO * 0.55));
    const mallaAro = new THREE.Mesh(extruir(aro, FONDO, true), montura);
    mallaAro.position.set(x, 0, -FONDO / 2);
    mallaAro.name = lado < 0 ? 'aro-i' : 'aro-d';
    gafas.add(mallaAro);

    const mallaCristal = new THREE.Mesh(
      extruir(rectangulo(ANCHO - GROSOR * 1.5, ALTO - GROSOR * 1.5, RADIO * 0.6), 0.018, false),
      cristal
    );
    mallaCristal.position.set(x, 0, -0.02);
    mallaCristal.name = lado < 0 ? 'cristal-i' : 'cristal-d';
    gafas.add(mallaCristal);

    /* Bisagra: el bloque que se ve en las fotos donde entra la varilla. */
    const bisagra = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.10, FONDO * 0.9), montura);
    bisagra.position.set(lado * (MEDIO - 0.02), ALTO / 2 - 0.10, -FONDO * 0.45);
    bisagra.name = lado < 0 ? 'bisagra-i' : 'bisagra-d';
    gafas.add(bisagra);

    /* Varilla plana, no un tubo: en las fotos es una lámina que adelgaza. */
    const varilla = new THREE.Mesh(extruir(perfilVarilla(1.42), 0.030, true), montura);
    /* +90°, no -90°: rotando al otro lado el perfil apuntaba hacia adelante
       y la varilla cruzaba por encima del lente. */
    varilla.rotation.y = Math.PI / 2;
    varilla.position.set(lado * (MEDIO - 0.008), ALTO / 2 - 0.105, -FONDO * 0.55);
    if (lado === -1) varilla.position.x -= 0.030;   // el grosor se extruye hacia +X
    varilla.name = lado < 0 ? 'varilla-i' : 'varilla-d';
    gafas.add(varilla);
  }

  /* Barra superior recta que cruza toda la frente, incluido el puente. */
  const barra = new THREE.Mesh(
    extruir(rectangulo(MEDIO * 2, 0.088, 0.022), FONDO, true), montura
  );
  /* Medio milímetro por delante del aro. Con la misma z sus caras frontales
     quedaban coplanares y el z-buffer las rayaba: ese era el glitch. */
  barra.position.set(0, ALTO / 2 - 0.016, -FONDO / 2 + 0.004);
  barra.name = 'barra';
  gafas.add(barra);

  /* El canto claro, encima de la barra. */
  const filo = new THREE.Mesh(
    extruir(rectangulo(MEDIO * 2 - 0.01, 0.020, 0.008), FONDO * 0.92, false), canto
  );
  /* El canto se apoya encima de la barra en vez de atravesarla: se cruzaban
     entre y=+0.020 e y=+0.028 y ahí también se rayaban. */
  filo.position.set(0, ALTO / 2 + 0.042, -FONDO * 0.46);
  filo.name = 'filo';
  gafas.add(filo);

  /* Puente: el arco corto que baja entre los dos aros. */
  const puente = new THREE.Mesh(
    new THREE.TorusGeometry(SEPARACION - ANCHO / 2 - 0.004, 0.020, 10, 24, Math.PI),
    montura
  );
  puente.position.set(0, ALTO / 2 - 0.125, -FONDO * 0.30);
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
  const camara = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camara.position.set(0, 0.05, 4.2);

  const { gafas, cristal } = construirGafas();
  escena.add(gafas);

  /* Luz de estudio: una key cálida arriba y un rim frío atrás, que es el
     mismo esquema que pedimos en las fotos de producto. */
  escena.add(new THREE.AmbientLight(0xffffff, 0.55));
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
  const camara = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camara.position.set(0, 0, 4.35);

  const { gafas, cristal } = construirGafas();
  escena.add(gafas);

  escena.add(new THREE.AmbientLight(0xffffff, 0.55));
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
