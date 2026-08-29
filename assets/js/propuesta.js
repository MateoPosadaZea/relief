/* ------------------------------------------------------------------
   RELIEF — escena de la propuesta.

   Aquí el modelo es el protagonista, no el fondo: va centrado, grande, y
   ocupa la pantalla que el wordmark va dejando libre al encogerse.

   Reutiliza el mismo modelo paramétrico de gafas.js; lo único propio es
   la puesta en escena.
------------------------------------------------------------------ */
import * as THREE from './vendor/three.module.min.js';
import { construirGafas } from './gafas.js';

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

  const { gafas, cristal } = construirGafas();
  escena.add(gafas);

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

  let escalaBanda = 1, escalaPlena = 1, subida = 0;

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
    const encuadre = alto =>
      Math.max(0.35, Math.min((w * 0.86) / (anchoModelo * porUnidad),
                              (alto * 0.62) / (altoModelo * porUnidad)));
    escalaBanda = encuadre(util);
    escalaPlena = encuadre(h);

    /* Cuánto hay que subir el modelo desde el centro de la pantalla hasta el
       centro de la banda. */
    subida = (h / 2 - (techo + piso) / 2) / porUnidad;
  }

  function leerProgreso() {
    if (!contenedor) return 0;
    const r = contenedor.getBoundingClientRect();
    const recorrido = r.height - window.innerHeight;
    if (recorrido <= 0) return 0;
    return Math.min(1, Math.max(0, -r.top / recorrido));
  }

  /* Cada panel dice qué lente le toca; el cristal persigue al del panel
     que se esté leyendo, en vez de interpolar a lo largo de todo el scroll. */
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

  function dibujar() {
    manualSuave.x += (manual.x - manualSuave.x) * 0.1;
    manualSuave.y += (manual.y - manualSuave.y) * 0.1;
    /* 1 mientras la palabra ocupa la pantalla, 0 cuando ya es logotipo. */
    const cede = 1 - (window.__morfo || 0);
    const escala = escalaPlena + (escalaBanda - escalaPlena) * cede;
    gafas.scale.setScalar(escala);
    /* El modelo no está centrado en su origen: se compensa su propio centro
       antes de subirlo a la banda. */
    gafas.position.y = -centro.y * escala + subida * cede;
    ratonSuave.x += (raton.x - ratonSuave.x) * 0.06;
    ratonSuave.y += (raton.y - ratonSuave.y) * 0.06;
    gafas.rotation.y = -0.72 + progreso * 0.72 + manualSuave.y + ratonSuave.y;
    gafas.rotation.x = 0.20 - progreso * 0.14 + manualSuave.x + ratonSuave.x;
    gafas.rotation.z = 0.05 - progreso * 0.05;
    cristal.color.copy(colorActual);
    cristal.emissive.copy(colorActual);
    renderer.render(escena, camara);
  }

  function marco() {
    if (!animando) return;
    progreso += (leerProgreso() - progreso) * 0.08;
    colorActual.lerp(colorDelPanel(), 0.05);
    dibujar();
    requestAnimationFrame(marco);
  }
  function arrancar(){ if (!animando && visible) { animando = true; requestAnimationFrame(marco); } }
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
    new IntersectionObserver(e => { visible = e[0].isIntersecting; visible ? arrancar() : parar(); },
      { threshold: 0 }).observe(canvas);
  }
  window.addEventListener('resize', () => { medir(); dibujar(); });
  /* La palabra avisa cuando cambia de tamaño (carga de la fuente, banco de
     pruebas, rotación): la banda libre es otra y hay que recomponer. */
  window.addEventListener('relief:banda', () => { medir(); dibujar(); });

  medir();
  progreso = leerProgreso();
  colorActual.copy(colorDelPanel());
  dibujar();

  if (quietud.matches) {
    window.addEventListener('scroll', () => {
      progreso = leerProgreso();
      colorActual.copy(colorDelPanel());
      dibujar();
    }, { passive: true });
  } else {
    arrancar();
  }

  canvas.dataset.listo = 'true';
}
