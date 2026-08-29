/* ------------------------------------------------------------------
   RELIEF — escena de la propuesta.

   Aquí el modelo es el protagonista, no el fondo: va centrado, grande, y
   ocupa la pantalla que el wordmark va dejando libre al encogerse.

   Reutiliza el mismo modelo paramétrico de gafas.js; lo único propio es
   la puesta en escena.
------------------------------------------------------------------ */
import * as THREE from './vendor/three.module.min.js';
import { construirGafas, ambiente, ANCLAS } from './gafas.js';

/* Suavizado por tiempo, no por cuadro: con un factor fijo por frame la
   transición dura lo que dure el frame rate, y en un equipo lento el modelo
   llegaba a su sitio segundos después de que se leyera el texto.
   `seg` es lo que tarda en recorrer el 99.9% del camino. */
const suavizar = (dt, seg) => 1 - Math.pow(0.001, dt / seg);

const AMBAR = 0xF2A93B;
const ROJO  = 0xD91F26;

export function iniciarEscena(canvas, contenedor, paneles) {
  const renderer = new THREE.WebGLRenderer({
    canvas, antialias: true, alpha: true, powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.18;

  const escena = new THREE.Scene();
  escena.environment = ambiente(renderer);
  const camara = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camara.position.set(0, 0, 4.2);

  const { gafas } = construirGafas();
  escena.add(gafas);

  /* Cada malla con su propio material: el modelo los comparte para ahorrar
     memoria, y así no se puede atenuar ni recolorear una pieza sola. */
  const mallas = [];
  gafas.traverse(o => {
    if (!o.isMesh) return;
    o.material = o.material.clone();
    /* Se recuerda si la pieza YA era translúcida (el cristal lo es). A las
       opacas no se les toca `transparent` mientras no estén atenuadas:
       marcarlas todas rompía el orden de dibujo y rayaba los bordes. */
    mallas.push({ objeto: o, plena: o.material.opacity,
                  translucida: o.material.transparent, atenuacion: 1 });
  });

  escena.add(new THREE.AmbientLight(0xffffff, 0.28));
  const key = new THREE.DirectionalLight(0xfff2e0, 1.7);
  key.position.set(-2.2, 3.0, 2.6); escena.add(key);
  const rim = new THREE.DirectionalLight(0xbcd4ff, 1.9);
  rim.position.set(1.8, 1.4, -2.6); escena.add(rim);
  const relleno = new THREE.DirectionalLight(0xffffff, 0.35);
  relleno.position.set(2.4, -1.2, 1.8); escena.add(relleno);

  /* Giro de reposo del modelo y cuánto más lo abre el paralaje del cursor.
     Van juntas y arriba porque las usan tanto el giro como el encuadre. */
  const GIRO = 0.72, PARALAJE = 0.13;

  const colorAmbar = new THREE.Color(AMBAR);
  const colorRojo  = new THREE.Color(ROJO);
  const colorActual = new THREE.Color(AMBAR);

  const quietud = window.matchMedia('(prefers-reduced-motion: reduce)');
  let progreso = 0;
  let visible = true, animando = false;

  /* Giro manual encima del giro por scroll: el usuario puede tomar el
     control sin perder la coreografía. */
  const manual = { x: 0, y: 0 };
  const manualSuave = { x: 0, y: 0 };
  let arrastrando = false, ultimoX = 0, ultimoY = 0;

  /* Paralaje de cursor: el modelo acompaña al puntero apenas unos grados, lo
     suficiente para que se sienta vivo antes de que nadie haga scroll. Se
     suma al giro por scroll y al arrastre, no los reemplaza. */
  const raton = { x: 0, y: 0 };
  const ratonSuave = { x: 0, y: 0 };
  const GIRO_RATON_Y = PARALAJE, GIRO_RATON_X = 0.08;

  /* Composición: las gafas arriba, la palabra abajo. La palabra publica en
     --palabra-cima dónde empieza su tinta; el modelo se ajusta a la banda que
     queda libre encima, y recupera el centro y su tamaño cuando la palabra se
     convierte en logotipo y le devuelve la pantalla.

     El tamaño no sale de constantes tanteadas sino de medir el modelo: se lee
     su caja una vez, sin girar ni escalar, y de ahí salen tanto el encuadre
     como el desplazamiento que lo centra. */
  gafas.scale.setScalar(1);
  gafas.rotation.set(0, 0, 0);
  gafas.updateMatrixWorld(true);
  const caja = new THREE.Box3().setFromObject(gafas);
  const dim  = caja.getSize(new THREE.Vector3());
  const centro = caja.getCenter(new THREE.Vector3());
  /* Girado sobre Y, el ancho aparente mezcla las dos dimensiones
     horizontales. Se encuadra por el giro más ancho que el modelo llega a
     tener: el de reposo (0.72 rad) más lo que le suma el paralaje del cursor.
     Usar el máximo de x y z sería encuadrar por un giro que nunca ocurre y
     dejaría el modelo innecesariamente chico. */
  const anchoEn = g => dim.x * Math.abs(Math.cos(g)) + dim.z * Math.abs(Math.sin(g));
  /* Se encuadra por el giro más abierto de todo el recorrido y no solo por el
     de reposo: las vistas de perfil y la de la varilla pasan del radián, y con
     el encuadre viejo el modelo se salía por los lados. */
  const anchoModelo = Object.values(ANCLAS).reduce(
    (peor, a) => Math.max(peor, anchoEn(Math.abs(a.giroY) - PARALAJE),
                                anchoEn(Math.abs(a.giroY) + PARALAJE)),
    Math.max(anchoEn(GIRO - PARALAJE), anchoEn(GIRO + PARALAJE)));
  const altoModelo  = dim.y;

  let escalaBanda = 1, escalaHistoria = 1, subida = 0;
  let desplazX = 0, subeHist = 0, angosto = false;
  /* El modelo no se mueve de lado a lado: solo gira y se acerca a la pieza que
     nombra el panel. Todo se persigue con lerp; los saltos se sienten como
     cortes de cámara. */
  const foco = new THREE.Vector3(), focoObj = new THREE.Vector3();
  const desplaz = new THREE.Vector3();
  let giroPieza = 0, giroPiezaObj = 0;
  let inclina = 0, inclinaObj = 0;
  let zoom = 1, zoomObj = 1;
  let objetivoColor = null;

  function medir() {
    const r = canvas.getBoundingClientRect();
    const w = Math.max(1, Math.round(r.width));
    const h = Math.max(1, Math.round(r.height));
    renderer.setSize(w, h, false);
    camara.aspect = w / h;
    camara.position.z = w / h < 1 ? 5.4 : 4.2;
    camara.updateProjectionMatrix();

    const raiz = getComputedStyle(document.documentElement);
    const cima = parseFloat(raiz.getPropertyValue('--palabra-cima'));
    /* La barra tampoco es espacio libre: la banda va del pie del nav al techo
       de la palabra. Sin palabra medida todavía llega hasta abajo, y la escena
       se compone como si el wordmark no existiera. */
    const techo = parseFloat(raiz.getPropertyValue('--alto-nav')) || 0;
    /* Entre las gafas y la palabra va el indicio de scroll: esa franja no es
       espacio de la escena. */
    const PISTA = 56;
    const piso  = (cima > 40 && cima < h) ? cima - PISTA : h;
    const util  = Math.max(80, piso - techo);

    const alturaMundo = 2 * Math.tan(camara.fov * Math.PI / 360) * camara.position.z;
    const porUnidad = h / alturaMundo;

    /* Cabe por lo ancho o por lo alto, lo que primero se agote. */
    const encuadre = (ancho, alto) =>
      Math.max(0.35, Math.min(ancho / (anchoModelo * porUnidad),
                              alto  / (altoModelo  * porUnidad)));

    /* Hero: el modelo tiene todo el ancho y la banda sobre la palabra. */
    escalaBanda = encuadre(w * 0.86, util * 0.62);
    subida = (h / 2 - (techo + piso) / 2) / porUnidad;

    /* Historia: el modelo va centrado y arriba, y el texto abajo. La banda
       alta es suya entera, así que puede ser bastante más grande de lo que era
       cuando compartía el ancho con el texto. */
    angosto = w < 900;
    /* La banda del modelo arranca al PIE del nav, no en el techo de la
       ventana: encuadrar contra la pantalla entera lo dejaba con la frente
       por debajo de la barra, y el nav se la comía. El pequeño respiro
       encima es para los pasos con zoom, que se salen del encuadre base.
       Abajo no pasa de la mitad larga de la pantalla, que es del texto.
       Y en pantallas muy altas la banda se limita en píxeles: el modelo no
       tiene por qué crecer hasta llenar un monitor de 1400 de alto. */
    const RESPIRO = angosto ? 18 : 28;
    const arriba  = techo + RESPIRO;
    const abajo   = Math.min(h * (angosto ? 0.56 : 0.60),
                             arriba + (angosto ? 340 : 400));
    const banda   = Math.max(120, abajo - arriba);
    escalaHistoria = encuadre(w * (angosto ? 0.78 : 0.44), banda * 0.82);
    desplazX = 0;
    subeHist = (h / 2 - (arriba + abajo) / 2) / porUnidad;
  }

  function leerProgreso() {
    if (!contenedor) return 0;
    const r = contenedor.getBoundingClientRect();
    const recorrido = r.height - window.innerHeight;
    if (recorrido <= 0) return 0;
    return Math.min(1, Math.max(0, -r.top / recorrido));
  }

  const lista = Array.prototype.slice.call(paneles || []);
  const mezclar = (u, v, k) => u + (v - u) * k;

  /* Entre qué dos paneles va el scroll, y cuánto. En vez de saltar de objetivo
     al cambiar el panel más cercano —que es lo que se sentía brusco—, el
     modelo interpola entre el panel que dejas y el que viene. */
  /* Se reutiliza el mismo arreglo en cada cuadro: esto corre 60 veces por
     segundo y no hace falta darle basura al recolector. */
  const centros = new Array(lista.length);

  function tramo() {
    if (!lista.length) return null;
    const medio = window.innerHeight / 2;
    for (let i = 0; i < lista.length; i++) {
      const r = lista[i].getBoundingClientRect();
      centros[i] = (r.top + r.bottom) / 2;
    }
    if (medio <= centros[0]) return { a: 0, b: 0, t: 0 };
    for (let i = 0; i < centros.length - 1; i++) {
      if (medio <= centros[i + 1]) {
        const hueco = centros[i + 1] - centros[i];
        return { a: i, b: i + 1, t: hueco > 0 ? (medio - centros[i]) / hueco : 0 };
      }
    }
    const u = lista.length - 1;
    return { a: u, b: u, t: 0 };
  }

  /* Con zona muerta: el modelo se queda quieto mientras el panel está centrado
     y se lee, y hace el viaje en el tramo del medio. Interpolar lineal lo
     tendría moviéndose todo el rato, que ya probamos y molesta. */
  function mezcla(t) {
    const x = Math.min(1, Math.max(0, (t - 0.20) / 0.62));
    return x * x * (3 - 2 * x);
  }

  function colorDelPanel(p) {
    if (!p) return colorActual;
    return p.dataset.lente === 'rojo' ? colorRojo : colorAmbar;
  }

  const encendida = (an, nombre) => !an.piezas || an.piezas.includes(nombre);
  /* Los dos lentes nunca se atenúan. Antes el paso del lente encendía solo el
     derecho y dejaba el izquierdo pálido: no se leía como "mira este", se leía
     como un lente descolorido, o sea como un defecto. El color del lente es la
     identidad del producto y va siempre entero en los dos. */
  const esLente = n => n.startsWith('cristal');
  function nivel(an, m) {
    if (esLente(m.objeto.name)) return 1;
    return encendida(an, m.objeto.name) ? 1 : 0.38;
  }

  function apuntar(paso) {
    if (!paso) return;
    const A = anclaDelPanel(lista[paso.a]), B = anclaDelPanel(lista[paso.b]);
    const k = mezcla(paso.t);

    focoObj.set(mezclar(A.punto[0], B.punto[0], k),
                mezclar(A.punto[1], B.punto[1], k),
                mezclar(A.punto[2], B.punto[2], k));
    giroPiezaObj = mezclar(A.giroY, B.giroY, k);
    inclinaObj   = mezclar(A.giroX, B.giroX, k);
    zoomObj      = mezclar(A.zoom,  B.zoom,  k);
    for (const m of mallas) m.atenuacion = mezclar(nivel(A, m), nivel(B, m), k);

    /* El color también se mezcla: el ámbar pasa a rojo durante el viaje y no
       de golpe al cruzar el centro de un panel. */
    objetivoColor = colorDelPanel(lista[paso.a]).clone()
                      .lerp(colorDelPanel(lista[paso.b]), k);
  }

  /* Adónde mirar. Sin pieza declarada, el conjunto. */
  function anclaDelPanel(p) {
    return ANCLAS[(p && p.dataset.pieza) || 'conjunto'] || ANCLAS.conjunto;
  }

  let ultimoCuadro = 0;

  function dibujar(ahora) {
    const t = typeof ahora === 'number' ? ahora : performance.now();
    const dt = ultimoCuadro ? Math.min(0.1, (t - ultimoCuadro) / 1000) : 1;
    ultimoCuadro = t;
    const kMano  = suavizar(dt, 0.35);
    const kPieza = suavizar(dt, 0.55);
    const kColor = suavizar(dt, 0.90);

    progreso += (leerProgreso() - progreso) * suavizar(dt, 0.35);
    if (objetivoColor) colorActual.lerp(objetivoColor, kColor);

    manualSuave.x += (manual.x - manualSuave.x) * kMano;
    manualSuave.y += (manual.y - manualSuave.y) * kMano;
    ratonSuave.x += (raton.x - ratonSuave.x) * kMano;
    ratonSuave.y += (raton.y - ratonSuave.y) * kMano;

    foco.lerp(focoObj, kPieza);
    giroPieza += (giroPiezaObj - giroPieza) * kPieza;
    inclina   += (inclinaObj   - inclina)   * kPieza;
    zoom      += (zoomObj      - zoom)      * kPieza;

    /* 1 mientras la palabra ocupa la pantalla, 0 cuando ya es logotipo. */
    const cede = 1 - (window.__morfo || 0);
    const dentro = 1 - cede;                    // 1 ya dentro del recorrido
    const escala = (escalaHistoria + (escalaBanda - escalaHistoria) * cede) * zoom;
    gafas.scale.setScalar(escala);

    /* El giro del hero cede el mando al de la pieza en cuanto la palabra suelta
       la pantalla. Encima van siempre el arrastre y el cursor. */
    gafas.rotation.y = (-0.72 + progreso * 0.72) * cede + giroPieza * dentro
                     + manualSuave.y + ratonSuave.y;
    gafas.rotation.x = (0.20 - progreso * 0.14) * cede + inclina * dentro
                     + manualSuave.x + ratonSuave.x;
    gafas.rotation.z = (0.05 - progreso * 0.05) * cede;

    /* En el hero va centrado sobre la palabra. Después se instala en la mitad
       derecha y no se mueve más de ahí: lo único que cambia es a qué pieza
       mira. El desplazamiento del foco va rotado —three.js posiciona en el
       espacio del padre pero gira alrededor del origen del objeto—, si no la
       pieza se sale de cuadro en cuanto hay giro. */
    desplaz.copy(foco).multiplyScalar(escala).applyEuler(gafas.rotation);
    gafas.position.x = (desplazX - desplaz.x) * dentro;
    gafas.position.y = (-centro.y * escala + subida) * cede
                     + (subeHist - desplaz.y) * dentro;
    gafas.position.z = -desplaz.z * dentro;

    for (const m of mallas) {
      /* La atenuación solo cuenta dentro del recorrido: en el hero se ve el
         modelo entero, sin piezas apagadas. */
      const meta = m.plena * (1 - (1 - m.atenuacion) * dentro);
      const mat = m.objeto.material;
      mat.opacity += (meta - mat.opacity) * kPieza;
      const conAlfa = m.translucida || mat.opacity < 0.995;
      if (mat.transparent !== conAlfa) { mat.transparent = conAlfa; mat.needsUpdate = true; }
      /* Se sigue escribiendo profundidad aunque haya alfa: sin esto las caras
         que se tocan (la barra sobre el aro) se dibujan en orden arbitrario. */
      mat.depthWrite = true;
      if (m.objeto.name.startsWith('cristal')) {
        mat.color.copy(colorActual);
        mat.emissive.copy(colorActual);
      }
    }

    renderer.render(escena, camara);
  }

  function marco(ahora) {
    if (!animando) return;
    apuntar(tramo());
    dibujar(ahora);
    requestAnimationFrame(marco);
  }
  function arrancar(){ if (!animando && visible) { animando = true; ultimoCuadro = 0; requestAnimationFrame(marco); } }
  function parar(){ animando = false; }

  canvas.addEventListener('pointerdown', ev => {
    arrastrando = true; ultimoX = ev.clientX; ultimoY = ev.clientY;
    canvas.setPointerCapture(ev.pointerId);
  });
  canvas.addEventListener('pointermove', ev => {
    if (!arrastrando) return;
    manual.y += (ev.clientX - ultimoX) * 0.008;
    manual.x += (ev.clientY - ultimoY) * 0.005;
    manual.x = Math.min(0.5, Math.max(-0.5, manual.x));
    ultimoX = ev.clientX; ultimoY = ev.clientY;
    if (quietud.matches) dibujar();
  });
  /* Solo donde hay puntero de verdad, y nunca con movimiento reducido: es
     movimiento decorativo y nadie lo pidió. En táctil, además, pointermove
     solo llega mientras se toca, que ya es el arrastre. */
  if (!quietud.matches && window.matchMedia('(hover: hover)').matches) {
    window.addEventListener('pointermove', ev => {
      if (arrastrando) return;
      raton.y = ((ev.clientX / window.innerWidth)  - 0.5) * 2 * GIRO_RATON_Y;
      raton.x = ((ev.clientY / window.innerHeight) - 0.5) * 2 * GIRO_RATON_X;
    }, { passive: true });
    /* Si el puntero se va de la ventana, el modelo vuelve a su sitio. */
    document.addEventListener('pointerleave', () => { raton.x = raton.y = 0; });
  }

  const soltar = () => { arrastrando = false; };
  canvas.addEventListener('pointerup', soltar);
  canvas.addEventListener('pointercancel', soltar);
  canvas.style.touchAction = 'pan-y';

  if ('IntersectionObserver' in window) {
    /* Se observa el contenedor de la historia y no el lienzo: el lienzo es
       fixed y siempre intersecta, así que la escena nunca se pausaba y seguía
       dibujando incluso con el despiece en pantalla. */
    new IntersectionObserver(e => { visible = e[0].isIntersecting; visible ? arrancar() : parar(); },
      { threshold: 0 }).observe(contenedor || canvas);
  }
  window.addEventListener('resize', () => { medir(); dibujar(); });
  /* La palabra avisa cuando cambia de tamaño (carga de la fuente, banco de
     pruebas, rotación): la banda libre es otra y hay que recomponer. */
  window.addEventListener('relief:banda', () => { medir(); dibujar(); });

  medir();
  progreso = leerProgreso();
  apuntar(tramo());
  if (objetivoColor) colorActual.copy(objetivoColor);
  foco.copy(focoObj); giroPieza = giroPiezaObj; inclina = inclinaObj; zoom = zoomObj;
  for (const m of mallas) m.objeto.material.opacity = m.plena * m.atenuacion;
  dibujar();

  if (quietud.matches) {
    window.addEventListener('scroll', () => {
      progreso = leerProgreso();
      apuntar(tramo());
      if (objetivoColor) colorActual.copy(objetivoColor);
      dibujar();
    }, { passive: true });
  } else {
    arrancar();
  }

  canvas.dataset.listo = 'true';
}

