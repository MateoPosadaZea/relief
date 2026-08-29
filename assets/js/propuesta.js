/* ------------------------------------------------------------------
   RELIEF — escena de la propuesta.

   Aquí el modelo es el protagonista, no el fondo: va centrado, grande, y
   ocupa la pantalla que el wordmark va dejando libre al encogerse.

   Reutiliza el mismo modelo paramétrico de gafas.js; lo único propio es
   la puesta en escena.
------------------------------------------------------------------ */
import * as THREE from './vendor/three.module.min.js';
import { construirGafas, ANCLAS } from './gafas.js';

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
    o.material.transparent = true;
    mallas.push({ objeto: o, plena: o.material.opacity, atenuacion: 1 });
  });

  escena.add(new THREE.AmbientLight(0xffffff, 0.5));
  const key = new THREE.DirectionalLight(0xfff2e0, 2.8);
  key.position.set(-2.2, 3.0, 2.6); escena.add(key);
  const rim = new THREE.DirectionalLight(0xbcd4ff, 3.6);
  rim.position.set(1.8, 1.4, -2.6); escena.add(rim);
  const relleno = new THREE.DirectionalLight(0xffffff, 0.55);
  relleno.position.set(2.4, -1.2, 1.8); escena.add(relleno);

  /* Giro de reposo del modelo y cuánto más lo abre el paralaje del cursor.
     Van juntas y arriba porque las usan tanto el giro como el encuadre. */
  const GIRO = 0.72, PARALAJE = 0.13;

  const colorAmbar = new THREE.Color(AMBAR);
  const colorRojo  = new THREE.Color(ROJO);
  const colorActual = new THREE.Color(AMBAR);

  const marco3D = canvas.parentElement;
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
  const anchoModelo = Math.max(anchoEn(GIRO - PARALAJE), anchoEn(GIRO + PARALAJE));
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
  let panelPrevio = null;

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

    /* Historia: en ancho comparte la pantalla con el texto —una mitad cada
       uno— y en angosto se queda arriba mientras el texto baja. */
    angosto = w < 900;
    escalaHistoria = angosto ? encuadre(w * 0.86, h * 0.34)
                             : encuadre(w * 0.42, h * 0.62);
    desplazX  = angosto ? 0 : (w * 0.25) / porUnidad;
    subeHist  = angosto ? (h / 2 - h * 0.23) / porUnidad : 0;
  }

  function leerProgreso() {
    if (!contenedor) return 0;
    const r = contenedor.getBoundingClientRect();
    const recorrido = r.height - window.innerHeight;
    if (recorrido <= 0) return 0;
    return Math.min(1, Math.max(0, -r.top / recorrido));
  }

  /* El panel que se esté leyendo manda dos cosas: qué lente lleva el cristal
     y a qué pieza mira la cámara. */
  function panelActual() {
    if (!paneles || !paneles.length) return null;
    const medio = window.innerHeight / 2;
    let elegido = null, cerca = Infinity;
    for (const p of paneles) {
      const r = p.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) continue;
      const d = Math.abs((r.top + r.bottom) / 2 - medio);
      if (d < cerca) { cerca = d; elegido = p; }
    }
    return elegido;
  }

  function colorDelPanel(p) {
    if (!p) return colorActual;
    return p.dataset.lente === 'rojo' ? colorRojo : colorAmbar;
  }

  function apuntar(p) {
    if (p === panelPrevio) return;
    panelPrevio = p;
    const a = anclaDelPanel(p);
    focoObj.set(a.punto[0], a.punto[1], a.punto[2]);
    giroPiezaObj = a.giroY; inclinaObj = a.giroX; zoomObj = a.zoom;
    for (const m of mallas) {
      m.atenuacion = !a.piezas || a.piezas.includes(m.objeto.name) ? 1 : 0.3;
    }
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
      m.objeto.material.opacity += (meta - m.objeto.material.opacity) * kPieza;
      if (m.objeto.name.startsWith('cristal')) {
        m.objeto.material.color.copy(colorActual);
        m.objeto.material.emissive.copy(colorActual);
      }
    }

    /* Ya instalado en su mitad, el lienzo se recorta ahí: acercarse a una pieza
       hace que el resto del modelo se salga de cuadro, y sin recorte ese
       derrame cae encima del texto. */
    if (marco3D) marco3D.dataset.mitad = dentro > 0.98 ? 'si' : 'no';

    renderer.render(escena, camara);
  }

  function marco(ahora) {
    if (!animando) return;
    const actual = panelActual();
    apuntar(actual);
    objetivoColor = colorDelPanel(actual);
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
  const primero = panelActual();
  colorActual.copy(colorDelPanel(primero));
  objetivoColor = colorDelPanel(primero);
  apuntar(primero);
  foco.copy(focoObj); giroPieza = giroPiezaObj; inclina = inclinaObj; zoom = zoomObj;
  dibujar();

  if (quietud.matches) {
    window.addEventListener('scroll', () => {
      progreso = leerProgreso();
      const p = panelActual();
      colorActual.copy(colorDelPanel(p));
      objetivoColor = colorDelPanel(p);
      apuntar(p);
      dibujar();
    }, { passive: true });
  } else {
    arrancar();
  }

  canvas.dataset.listo = 'true';
}

