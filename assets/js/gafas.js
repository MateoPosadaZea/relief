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

/* Perfil del lente: rectángulo de esquinas redondeadas. */
function formaLente(ancho, alto, radio) {
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

function construirGafas() {
  const gafas = new THREE.Group();

  const ANCHO = 1.02, ALTO = 0.60, RADIO = 0.16, GROSOR = 0.055;
  const SEPARACION = 0.60;

  const montura = new THREE.MeshPhysicalMaterial({
    color: 0x2A2A2E, roughness: 0.42, metalness: 0.25, clearcoat: 0.5
  });

  /* El material del lente es compartido: cambiarle el color mueve los dos
     lentes a la vez cuando avanza la historia. */
  const cristal = new THREE.MeshPhysicalMaterial({
    color: AMBAR, roughness: 0.08, metalness: 0,
    transmission: 0.9, thickness: 0.45, ior: 1.52,
    transparent: true, opacity: 0.62, side: THREE.DoubleSide,
    emissive: AMBAR, emissiveIntensity: 0.16, specularIntensity: 1
  });

  for (const lado of [-1, 1]) {
    const x = lado * SEPARACION;

    /* Aro: la forma exterior con la interior como hueco. */
    const aro = formaLente(ANCHO, ALTO, RADIO);
    aro.holes.push(formaLente(ANCHO - GROSOR * 2, ALTO - GROSOR * 2, RADIO - GROSOR));
    const mallaAro = new THREE.Mesh(
      new THREE.ExtrudeGeometry(aro, {
        depth: 0.10, bevelEnabled: true,
        bevelThickness: 0.012, bevelSize: 0.012, bevelSegments: 2, curveSegments: 24
      }),
      montura
    );
    mallaAro.position.set(x, 0, -0.05);
    gafas.add(mallaAro);

    const mallaCristal = new THREE.Mesh(
      new THREE.ExtrudeGeometry(formaLente(ANCHO - GROSOR * 1.6, ALTO - GROSOR * 1.6, RADIO - GROSOR), {
        depth: 0.02, bevelEnabled: false, curveSegments: 24
      }),
      cristal
    );
    mallaCristal.position.set(x, 0, -0.01);
    gafas.add(mallaCristal);

    /* Varilla: curva suave hacia atrás, con la caída final sobre la oreja. */
    const inicio = new THREE.Vector3(lado * (SEPARACION + ANCHO / 2 - 0.02), 0.16, 0.0);
    const varilla = new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3([
        inicio,
        new THREE.Vector3(lado * (SEPARACION + ANCHO / 2 + 0.05), 0.17, -0.30),
        new THREE.Vector3(lado * (SEPARACION + ANCHO / 2 + 0.02), 0.15, -1.05),
        new THREE.Vector3(lado * (SEPARACION + ANCHO / 2 - 0.04), 0.02, -1.42)
      ]),
      42, 0.028, 12, false
    );
    gafas.add(new THREE.Mesh(varilla, montura));
  }

  /* Puente. */
  const puente = new THREE.TubeGeometry(
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(-SEPARACION + ANCHO / 2 - 0.03, 0.02, 0),
      new THREE.Vector3(0, 0.15, 0.01),
      new THREE.Vector3(SEPARACION - ANCHO / 2 + 0.03, 0.02, 0)
    ]),
    28, 0.030, 12, false
  );
  gafas.add(new THREE.Mesh(puente, montura));

  return { gafas, cristal };
}

export function iniciarGafas(canvas, contenedorProgreso) {
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
      gafas.position.x = -0.02;
      baseY = 1.12;
      gafas.scale.setScalar(0.48);
      camara.position.z = 5.6;
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
    cristal.color.copy(colorAmbar).lerp(colorRojo, progreso);
    cristal.emissive.copy(colorAmbar).lerp(colorRojo, progreso);
    renderer.render(escena, camara);
  }

  function marco() {
    if (!animando) return;
    const objetivo = leerProgreso();
    /* Suavizado: el giro persigue al scroll en vez de pegarse a él. */
    progreso += (objetivo - progreso) * 0.08;
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
  dibujar();

  const quietud = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (quietud.matches) {
    /* Sin movimiento: se dibuja una vez por scroll, sin bucle. */
    window.addEventListener('scroll', () => {
      progreso = leerProgreso();
      dibujar();
    }, { passive: true });
  } else {
    arrancar();
  }

  canvas.dataset.listo = 'true';
  return { medir, dibujar };
}
