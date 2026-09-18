# capotte — casa de gafas de autor, Bogotá

## Qué es esto
Una casa de objetos personales que envejecen bien. Hoy vende **gafas con lente
protector, sin fórmula**, en Colombia. Proyecto de Mateo + socio.
Proveedor: Alibaba. Referente de advertencia: Warblue (ver Posicionamiento).

⚠ **Este archivo se podó el 18 de septiembre de 2026.** Todo lo que describía la
dirección «noche» —el recorrido de la home, el modelo 3D, el cursor, los cuatro
modos, el router por hash y el checkout de cuatro pasos— salió de aquí. Ese
trabajo no se borró: vive en `propuesta.html` y en el historial de git. Si
alguien lo necesita, se lee ahí; **no se documenta aquí porque ya no es el
sitio.**

## ⚠ El manual de marca manda (`MANUAL-DE-MARCA.md`)
Desde septiembre de 2026 la fuente de verdad de paleta, tipografía, tono,
nombres de producto y prohibiciones es **`MANUAL-DE-MARCA.md`**, no este
archivo ni el criterio de nadie. `CLAUDE.md` guarda las razones y lo medido;
si los dos se contradicen, manda el manual.

**Definición de marca (manual §1.1):** capotte es una **casa de objetos
personales que envejecen bien**. No es una marca de gafas, ni de la noche, ni
de bienestar — las tres la encierran. Frase de nivel marca: *objetos para las
horas que uno no le debe a nadie.*
- **La regla de los dos niveles.** Nivel **marca** (sello, pie, «la casa»,
  papelería) nunca nombra la categoría. Nivel **producto** (hero, fichas,
  anuncios) es todo lo específico que haga falta, porque es lo que vende.

## El sitio de Fase 1 (`index.html`)
Un solo archivo, vanilla, sin build, abre con `file://` — verificado.
- **La base es crema, no oscura.** El manual §4.2 dice «modo oscuro único»
  pero §3.5 lo deroga: crema para toda la página, tinta solo para el bloque de
  El par. §3.5 es lo vigente.
- **Ninguna regla de CSS escribe un hex**: todo sale de una variable, y el
  bloque oscuro solo redefine los roles. Auditado.
- ⚠ **Dos colores del manual no pasan AA sobre crema y hubo que derivarlos.**
  La paleta de §3.5 está escrita para fondo tinta:
  - `--tenue #8C8579` da **3,02** sobre crema (sobre tinta da 5,16 y ahí sí
    sirve). Los eyebrows sobre crema usan `--texto2 #5C564C` = **6,01**.
  - El ámbar de marca da **1,79** sobre crema: no se puede usar como texto.
    `#B07A1F` da **3,07**, tampoco llega. Mismo tono (36°) y saturación con
    luminosidad al 32 % → **`#935E10` = 4,51**, que es el `--ambar-texto`.
- ✅ **Gambetta está y carga — verificado el 16 de septiembre de 2026.** Mateo
  mandó los diez `.otf` desde fuera (Fontshare sigue bloqueado desde aquí) y se
  convirtieron a `woff2`. Medido con `document.fonts.load()` y `measureText`
  sobre `capotte Hamburgefonstiv` a 100 px: redonda **1115**, itálica **1015**,
  500 **1128**, 500 itálica **1035**, contra **1012** de Georgia y de
  Newsreader. Las cuatro caras cargan y las cuatro son distintas.
  ⚠ **`measureText` no dispara la carga de una cara que la página aún no usó**:
  medido a secas, el 500 daba exactamente el ancho de Georgia y parecía no
  cargar. Hay que pedir cada cara con `document.fonts.load()` antes de medir.
  Es la segunda trampa de medición de fuentes que paga este proyecto, después
  de `document.fonts.check()`.
- **Ya no queda ningún CDN de tipografía en `index.html`.** Los dos `<link>`
  —Fontshare y Google Fonts— se reemplazaron por las ocho `@font-face`
  vendorizadas. Verificado que **`file://` sigue funcionando** con los `.woff2`
  locales, que era el riesgo real de vendorizar.
- Trampa pagada: `.hero h1 span{display:block}` alcanzaba también al punto
  final y lo mandaba a su propia línea. Hijos **directos**.

## Qué archivo es qué
| Archivo | Qué es | Estado |
|---|---|---|
| `capotte.html` | **El sitio.** Casa de autor: leopardo, sello, dos planchas. | vivo |
| `index.html` | La Fase 1: catálogo, bolsa y pago por enlace de Wompi. | vivo |
| `manual.html` | El manual de marca, compilado desde los mismos valores. | vivo |
| `propuesta.html` | La dirección «noche». Cuatro modos, checkout de cuatro pasos, visor 3D. | **archivo** |

`propuesta.html` y `assets/js/` (three.js, `gafas.js`, `propuesta.js`) **no se
desarrollan y no se documentan aquí**. Se quedan por si alguna vez hace falta
volver a mirarlos.

## El manual (`manual.html`)
El sistema de diseño vive en el repo, no en un PDF ni en un chat, **porque el
manual tiene que compilar**: los valores del manual SON los tokens de
`capotte.html`. Tres capas y un orden de mando claro:
`capotte.html` (los valores) → `CLAUDE.md` (las razones) → `manual.html` (la
vista). Si los tres dejan de coincidir, mandan los tokens.
- **Tiene una sección del sello (`iv · el sello`), que es donde se define el
  logotipo.** Antes no había ninguna, y el sello *es* la marca. Lo que aporta y
  que no estaba escrito en ningún otro sitio: el aire mínimo alrededor del
  sello es **la altura de un lóbulo del festón**, de valle a cresta — igual que
  con la palabra, el respiro sale de la propia pieza y crece con ella, así que
  no hay un número que se quede viejo.
  **La escalera de tamaños va a tamaño real**, no a escala relativa: los cinco
  peldaños miden 300, 120, 92, 54 y 32 px de verdad. El umbral hay que poder
  verlo, no leerlo — a 32 px el sello es un borrón y eso es justo la regla.
  Los dos sellos se incrustan **una vez** como `<symbol>` y se usan con `<use>`
  a cada cuerpo: repetir `sello.svg` cinco veces eran 635 kB.
- ⚠ **Trampa pagada en `manual.html`: `.reglas li` era un grid de dos
  columnas.** Cualquier elemento inline dentro del `<li>` —un `<em>`, un
  `<code>`— se convertía en un **tercer ítem de grid** y caía en la columna de
  1,5 em, encima del punto. Se veía como dos palabras montadas. Arreglado con
  sangría francesa (`text-indent` negativo), que deja el `<li>` como texto
  corrido y da igual lo que lleve dentro. Vale para cualquier lista con marcador
  propio: **si el marcador es un elemento, no uses grid en el contenedor.**
- Decisiones que el manual cierra y antes estaban abiertas:
  - **Gambetta titula y firma; Instrument Sans se lee.** Dos caras y dos
    papeles: la serif para lo que se mira —titulares, el logotipo, los nombres
    de las piezas, la itálica de firma— y la sans para lo que se recorre:
    párrafos, bajadas, rótulos, fichas, precios, barra, botones y formularios.
    **Si dudas, es sans.**
    ⚠ Se probó **Gambetta sola en toda la página** y se revirtió a petición de
    Mateo, que la pidió tres veces. Lo que se aprendió y sigue valiendo: la
    serif sola da un resultado más editorial y menos tienda, pero la página
    además tiene que vender, y la sans en la barra, las fichas y los datos se
    recorre mejor. La serif gana como excepción, no como norma — en cuanto baja
    al párrafo deja de firmar.
  - **No se inventa un color de marca.** Negro y marfil son la identidad;
    arena, espresso y oliva son papel y tinta. El oliva es el único acento con
    color y **no ocupa nunca más que un filete, un punto o una palabra**. El
    color de verdad va a entrar por el acetato del primer lote: definirlo antes
    es decidir dos veces.
  - Contrastes **medidos**, no estimados. Dos consecuencias que hay que
    respetar: el arena es superficie y no texto (1,37 sobre marfil), y el oliva
    hay que aclararlo a `#8A9C7C` sobre negro (3,23 no pasa como texto).

## La casa de autor (`capotte.html`)
- **La ilustración del leopardo ya está**: `assets/img/leopardo-{640,1120,2048}.webp`,
  tinta negra y pelaje blanco sobre transparente. Se **recortó a la tinta**, así
  que el borde de la imagen es el borde del animal y colocarla no es adivinar.
  WebP con pérdida a q90: sin pérdida pesaba 1 MB y a q90 la trama del grabado
  aguanta el 100 % — verificado sobre la cabeza, que es lo más fino.
  Es la **segunda lámina**: la primera tenía la cabeza vuelta a cámara y esta va
  de perfil hacia adelante, que es lo que pedía el brief. La primera está en el
  commit `3e57fb3` si alguna vez hace falta una mirada de frente.
  ⚠ **Ojo con el alfa bajo.** Esta venía con el resplandor del fondo horneado
  en el RGB de píxeles transparentes, y 25 000 de ellos tenían alfa 1–40:
  invisible sobre negro y un halo gris sobre marfil. Se pone a cero por debajo
  de 30; por encima es antialias de verdad. Revisar esto en cualquier lámina
  nueva antes de darla por buena.
  ⚠ **No sustituirla por otra, no redibujarla y no usar imágenes de animales
  genéricas.** Va en la portada, en la sección del leopardo y como firma tenue
  del pie. En la ficha de producto no va: ahí manda la pieza.
- **En la plancha negra la ilustración se invierte** (`filter:invert(1)`). No es
  un filtro de adorno: es literalmente la otra plancha del mismo grabado, y sale
  del mismo archivo en vez de duplicarlo.
- ⚠ **Se probó dibujar el leopardo en SVG** mientras la ilustración no había
  llegado, y se descartó en tres intentos. Lo que se aprendió: la técnica de
  grabado sí se puede fabricar —trama de líneas recortada a la silueta, rosetas
  como anillos rotos con un punto dentro, y una segunda trama más densa
  enmascarada con un degradado para el tono del lomo—, pero la **anatomía** no:
  la cabeza salía leyendo a cánido. El código se borró al llegar la lámina
  buena; si alguien lo necesita, está en el historial.
- **El hueco de un activo que falta es parte de la dirección de arte.** Toda la
  fotografía que aún no existe son láminas con marco de borde irregular y trama
  tenue. Al soltar el `.webp` en `assets/img/` la lámina se monta sola y el
  hueco desaparece. Por eso la página se puede juzgar entera sin inventarse
  fotografía — y por eso la ilustración, que sí es una lámina, va **sin marco**:
  un grabado encerrado en un recuadro se convierte en stock.
- **Ni una tipografía sans en el documento.** Era justo lo que volvía cualquier
  casa de gafas una tienda. Gambetta hace de display, de texto y de rótulo; los
  rótulos van en minúscula con tracking corto, nunca en versalita.
- **Nada se escribe en mayúscula**, ni el logotipo ni los titulares, y a
  `capotte` no se le añade tracking: el comportamiento natural de la cara es
  parte de la identidad.
- **Los sellos y los marcos no son formas geométricas perfectas.** Se generan
  con un radio (o un perímetro) que ondula, con semilla fija: un sello que
  cambia en cada visita no es un sello. El marco de lámina tuvo que rehacerse
  como **rectángulo** que tiembla — una circunferencia estirada por
  `preserveAspectRatio="none"` salía convertida en burbuja.
- **Dos planchas, no cuatro modos**: marfil con tinta negra y su negativo. El
  negativo no es «modo oscuro», es la otra plancha del mismo grabado.
- **El sello está CONGELADO**, en dos escalas ópticas:
  `assets/img/sello.svg` (con la lámina dentro) y
  `assets/img/sello-reducido.svg` (sin ella, filete más grueso).
  Un logotipo no se genera en cada carga: se guarda. Si la curva puede cambiar
  entre visitas, no es una marca. El mismo trazado vive en los SVG y en las
  constantes `SELLO_FUERA`/`SELLO_DENTRO` del sitio: una sola fuente.
- **El festón es ritmo, no ruido.** Trece lóbulos —`R + A·cos(13θ)`— más un
  temblor mínimo. ⚠ La primera versión usaba solo ruido y salía un círculo mal
  dibujado, no un sello: **el ritmo es lo que lo hace un sello, y el temblor lo
  que evita que parezca troquelado a máquina.** Las dos cosas hacen falta.
- **Umbrales medidos, no estimados** (renderizados a 300/150/92/54/32 px en las
  dos planchas):
  - **de 120 px arriba** → sello completo, con la lámina dentro;
  - **de 54 a 120 px** → sello reducido, sin lámina;
  - **por debajo de 54 px no sirve ninguno de los dos.** Ahí hace falta una
    tercera pieza que todavía no existe — el favicon y el avatar caen en ese
    rango. Candidatos: la silueta del leopardo sola, el rombo, o la palabra.
  El sello de la portada subió de 92 a 120 px por esto.
  ⚠ **Descartada por medición: la «C» dentro de un anillo** (septiembre de 2026,
  glifo extraído con fonttools, tres grosores de anillo, control a 64/32/16 px).
  A 32 y a 64 px lee bien; **a 16 px no sirve ninguna variante** y engrosar el
  anillo lo empeora, porque le come radio a la letra: la más gruesa es la que
  menos aporta. A 16 px hay 8 px de radio y el dibujo gasta ~0,6 en el anillo
  grueso, ~0,5 en el hueco, ~0,2 en el fino y ~0,4 de aire — al asta de la C le
  quedan 1,5 px y nunca llega a negro. Medido: **la C aporta entre el 5,9 % y el
  7,3 % de la tinta** sobre el anillo solo; lo que se ve es un anillo con una
  mancha. Confirma por tercera vía el umbral de los 32 px, y de paso vuelve a
  cerrar la exploración de la C. **La pieza chica sigue pendiente.**
  De paso, dos cosas que sí sirven y valen para cualquier glifo en un sello:
  el centrado óptico se **mide** —centroide de la tinta contra centro de la
  caja: la C pesaba 5,0 px a la izquierda—, y la corrección completa **se pasa**,
  porque en una letra abierta la contraforma cuenta como territorio de la letra;
  la mitad lee mejor.
  ✅ **El sello ya es un archivo de imprenta** (17 de septiembre de 2026).
  `assets/img/sello-curvas.svg` y `assets/img/sello-reducido-curvas.svg` llevan
  las dos palabras **en curvas**, sacadas con fonttools de Gambetta Regular e
  Instrument Sans: no dependen de que el taller tenga la fuente. Los maestros de
  **pantalla** (`sello.svg`, `sello-reducido.svg`) se quedan con texto vivo,
  porque ahí heredar la cara y poder editar la palabra sí sirve. **Para cambiar
  una palabra se edita el maestro de pantalla y se vuelve a convertir** — en el
  de curvas ya no se puede.
  La disposición se reprodujo a mano (avances, tracking y `text-anchor`) y se
  **cotejó contra el render del maestro**: misma caja de tinta en los cuatro
  lados y misma masa dentro del 1 % en las dos palabras y en los dos sellos.
  ⚠ **Trampa de medición que costó un diagnóstico:** el primer cotejo dio 9,86 %
  de desvío y parecía un fallo de conversión. No lo era — el CSS con el que se
  renderizó la **referencia** se había construido antes de que llegara Gambetta,
  así que el «original» pintó `capotte` en Newsreader y se estaba comparando
  contra curvas de Gambetta. `bogota` calzaba perfecto porque Instrument Sans sí
  estaba en ese CSS, y esa asimetría fue la pista. **Un render de referencia
  solo es referencia si está pintando la cara correcta**: verificarlo antes de
  creerse el número.
  ⚠ El sello mezcla dos caras: `capotte` va en Gambetta y `bogota` en Instrument
  Sans. Está así desde que se congeló y la conversión lo respeta, pero para un
  logotipo es una decisión que conviene tomar a propósito, no heredar.

## El leopardo, vectorizado (`assets/img/leopardo-*.svg`)
Tres escalas ópticas del **mismo** animal, sacadas de la lámina con potrace.
No son tres dibujos: son un dibujo y dos reducciones, que era justo el problema
que había que cerrar.
- `leopardo-maestro.svg` — el grabado completo. 2497 subpaths, 724 kB. Es el
  archivo del que salen los otros dos; para web sigue siendo mejor el `.webp`.
- `leopardo-logotipo.svg` — 28 subpaths, 22 manchas, 120 kB.
- `leopardo-sello.svg` — 13 subpaths, 8 manchas, 109 kB.
- **Receta del trazado**, para poder repetirla: aplanar sobre blanco (el PNG es
  de fondo transparente, no blanco), gris, autocontraste, binarizar a **umbral
  150**, y `potrace -t 2 -a 1.0 -O 0.2`. Medido: `turdsize` 5 y 12 ya se comen
  el punteado fino del vientre; `alphamax` es indiferente porque el grabado es
  de manchas y no de esquinas.
- ⚠ **El grabado se traza como UNA malla conectada**: un contorno exterior con
  miles de huecos, y las manchas son islas dentro de esos huecos. Por eso el
  filtro de simplificación **no puede ser «quédate con las manchas grandes»** —
  tirar un hueco pequeño RELLENA de negro en vez de aclarar. Hay que ordenar
  por área absoluta.
- ⚠ **Y el orden por área global reparte mal.** Amontona las manchas en el
  flanco, que es donde el grabado las dibujó más grandes, y deja la paletilla
  desnuda. La derivación buena conserva la estructura por área y elige **una
  mancha por celda** de una retícula sobre el cuerpo.
- ⚠ **Dentro del sello va la versión de LOGOTIPO, no la de sello.** Medido a
  300/150/120/92 px: la de 8 manchas queda demasiado ligera dentro del filete y
  lee a contorno. El sello no es una pieza pequeña —va de 120 px arriba—, así
  que le toca la escala media. El nombre del archivo engaña; el uso manda.
- ⚠ **A 24 px no funciona ninguna de las tres.** Confirma por otro camino el
  umbral del sello: por debajo de ~32 px hace falta una pieza distinta, no un
  leopardo más simple.
- **Las dos planchas se cambian a mano, y el mando se ve.** Es texto —`marfil`
  y `negra`— en la barra y en la lámina del menú móvil, porque en un sitio sin
  una sola tipografía sans un sol y una luna serían los dos únicos dibujos de
  la página. Hay dos mandos y un solo estado: se sincronizan desde el atributo
  del documento, nunca desde el botón que se pulsó.
- **El comercio existe y no abre la página.** «shop» es una celda discreta de
  la barra y el carrito una lámina lateral. El precio no aparece en la
  colección: aparece en la ficha, que es cuando la pregunta tiene sentido.
- **Las caras están vendorizadas en `assets/fuentes/`** y no queda ningún CDN
  de tipografía en la página: Newsreader e Instrument Sans, solo los
  subconjuntos latin y latin-ext.
  ✅ **Gambetta ya está vendorizada**: `gambetta-400.woff2`,
  `gambetta-400-italica.woff2`, `gambetta-500.woff2` y
  `gambetta-500-italica.woff2` (22–25 kB cada una, 93 kB los cuatro). Entraron
  desde fuera porque `api.fontshare.com` está bloqueado por política de red
  desde aquí, no hay paquete en npm y jsDelivr también está bloqueado — eso no
  cambió, y si algún día hacen falta más pesos tienen que volver a entrar a
  mano. Cableado y entrada fueron automáticos: las `@font-face` ya la
  esperaban con esos nombres exactos.
  ⚠ **Gambetta trae 300, 400, 500, 600 y 700, cada uno con itálica real** —
  diez archivos, no dos. Este archivo decía «solo trae 400 y 500», y era falso.
  **Se puede pedir 600 y 700 de verdad**; lo que falta es convertirlos y
  cablearlos, porque hoy solo están vendorizados los cuatro que el sitio usa.
  Todos son `unitsPerEm` 1000 y ~354 codepoints.
  ⚠ **El rombo `◆` (U+25C6) no existe en Gambetta** — ni en Newsreader ni en
  Instrument Sans. O sea que el único signo del sistema lo está dibujando una
  cara del sistema operativo, distinta en cada máquina. Es el `<span
  class="rombo">&#9670;</span>` del bloqueo y del pie. Hay que sustituirlo por
  una forma propia (un `<svg>` diminuto o un cuadrado rotado por CSS): un signo
  de marca no puede depender de lo que tenga instalado el visitante.
  ⚠ **El respaldo pasó de Fraunces a Newsreader.** Fraunces es demasiado
  característica —contraste muy alto y una itálica con mucha personalidad— y
  hacía juzgar el diseño sobre una cara que no es la nuestra. Newsreader es más
  callada y está más cerca del registro de Gambetta. Sigue sin ser Gambetta: lo
  que se ve en cualquier vista previa es un sustituto, y conviene decirlo cada
  vez que se enseñe.
  ⚠ Las copias que se publican como artifact llevan las caras **incrustadas en
  base64**: ahí no hay carpeta `assets`. El script de publicación las mete y se
  salta las declaraciones cuyo archivo no exista, así que el día que Gambetta
  entre se incrusta sola. Vive en el directorio de trabajo de la sesión, no en
  el repo.
- Trampas ya pagadas en este archivo, todas de retícula y todas caras de
  encontrar:
  1. Un `margin:0 auto` en un ítem de grid **desactiva el estirado** y encoge la
     caja a su contenido. El hero salía centrado.
  2. Un `max-height` en **porcentaje** dentro de una fila `1fr` solo resuelve si
     la retícula tiene alto **definido**. Con `min-height` la lámina de la
     portada se salía por el pliegue; con `height` cabe.
  3. La **columna implícita** de una retícula se dimensiona a `max-content`.
     Hay que declararla.
  4. El mínimo automático de un ítem de flex con una imagen dentro es su tamaño
     intrínseco y **se come el `max-width`**: `min-width:0`.
  5. Y la que costó tres diagnósticos: una regla **huérfana** de una versión
     anterior del hero (`width:190vw` en una media query de móvil) sobrevivió a
     la reescritura del marcado. Al reestructurar un bloque, borrar su CSS en el
     mismo movimiento — o buscar el selector antes de dar nada por bueno.
  6. Un `id` repetido entre la sección y su lista hace que `getElementById`
     devuelva la sección y le borre el encabezado al escribirle dentro.
  7. La lámina del menú móvil tiene que ir **por debajo** de la barra o tapa su
     propio botón de cierre.

## Catálogo (DEFINIDO)
Los nombres salen de `MANUAL-DE-MARCA.md` §2.3 y son los que usa `index.html`:

1. **Lectura** (Ámbar) — para leer, para la pantalla, para las horas largas.
2. **Sobremesa** (Carmín) — para la última hora, cuando ya no se trabaja.
   No es para conducir.
3. **El par** — los dos, más barato que por separado. Sube el ticket promedio,
   que es lo que hace que el fee fijo de Wompi y el envío pesen menos.

Cada producto = 1 enlace de pago de Wompi en Fase 1 (3 enlaces en total).

⚠ El público **ya no es** «gente que trabaja de noche frente a pantallas». Eso
era la dirección vieja. El de ahora está en «El público de la casa de autor».
«Una hora antes de dormir» sigue permitido como descripción de uso; la rutina
nocturna como *ángulo de venta*, no.

## Principios (no negociables)
- **Costo fijo cero.** Cloudflare Pages + Wompi. Nada de Shopify, nada de
  mensualidades.
- **Radical simplicidad.** Pocas piezas, pocas variantes. Nada de features
  especulativos.
- **Vanilla HTML/CSS/JS.** Sin frameworks, sin build step. El HTML, el CSS y la
  lógica viven en el propio archivo. **Sin CDN**: todo vendorizado en el repo,
  tipografías incluidas. Verificado que abre con `file://`.
- **Sin backend en Fase 1.** Catálogo = objeto JS en el propio archivo.
  Bolsa = `localStorage`.
- **Claims de producto conservadoras.** Lenguaje de confort. **NUNCA** promesas
  de salud, sueño, cuidado ocular o concentración: es la frontera INVIMA/SIC que
  este proyecto lleva desde agosto esquivando a propósito. «Una hora antes de
  dormir» es descripción de uso y sí se permite.
- **Cero porcentajes sin certificado.** No publicar «bloquea 97 %» salvo que
  tengamos el reporte de transmitancia espectral del lote exacto que vendemos.
  Warblue publica 84/97/99 % — no copiar esos números.
- **Nada de urgencia inventada**: ni contadores, ni «quedan 3», ni «12 personas
  viendo esto». Es publicidad engañosa igual que una reseña falsa, y además no
  hace falta: lo que da confianza en esta categoría son hechos verificables, que
  es justo donde ganamos.
- **El hueco de un activo que falta es parte de la dirección de arte.** La
  fotografía que no existe son láminas pendientes con marco irregular; los
  precios que no existen son `$ 000.000`, no un cero. Así la página se puede
  juzgar entera sin inventarse nada.
## ⚠ El nombre: RELIEF → recreo → malcolm → capote → Capotte
La marca se llamó **RELIEF** hasta agosto de 2026. Se cambió por una razón
concreta, no por gusto: la consulta de antecedentes marcarios en la SIC
encontró **I-RELIEF, de Essilor International, registrada y vigente hasta 2033
en clase 9** — la clase de gafas y lentes—, con una descripción de productos
que dice literalmente «cristales filtrantes, cristales tintados». Entre
`I-RELIEF` y `RELIEF`, para el mismo producto, la diferencia es una letra y un
guion: riesgo alto de negación y de oposición del titular.

- Usar RELIEF sin registrarlo no era ilegal. El problema era que **no lo
  podríamos registrar en nuestra clase**, o sea construir marca sobre algo
  indefendible. Se sumaban un tercero disputando el nombre en Colombia
  (GRUPO RELIEF SAS) y ocho razones sociales en el RUES.
- `recreo` se eligió contra cinco criterios y **duró poco**: Mateo objetó que un
  recreo es dejar de trabajar, y el lente ámbar es justo para seguir. El nombre
  describía media catálogo y contradecía la otra media.
- `malcolm` se probó puesto y **duró un día**. La reserva que lo tumbó: si la
  referencia se lee, es Malcolm X, y sus gafas son icónicas por lo que él fue —
  una marca nueva usándolas se expone a una crítica difícil de responder; si no
  se lee, es un nombre de pila sin significado. Legalmente estaba limpio.
- **Hoy la marca es `capotte`.** Salió de una exploración de apellidos: después
  de rechazar seis nombres-concepto quedó claro que el equipo no quiere un
  nombre que explique el producto, sino uno con pátina — que es además la
  convención del sector (Persol, Moscot, Oakley).
- **Por qué gana `capotte`**: es el único finalista que funciona **en español**,
  y el único que significa algo útil — un capotte es **lo que te echas encima**.
  Palabra de prenda, que le sirve a un lente hoy y a un antifaz mañana. Frente a
  `wayne`, que está limpio pero vacío y suena importado justo en la marca cuyo
  argumento es «sale de Bogotá, no de Shenzhen».
- **Se escribe con doble T: `Capotte`.** Es la grafía elegida sobre `capote`;
  aleja un punto la lectura literal de la palabra española —y con ella la
  asociación taurina— sin perder el sonido ni el significado.
- ⚠ **El riesgo de `capotte` es la asociación taurina**, cargada en Colombia por
  la prohibición reciente. Para el público de 20 a 35 pesa poco y nada en el
  sitio la invoca, pero está anotado. El Truman Capote Literary Trust tiene
  marca sobre el nombre completo, no sobre el apellido solo.
- ⚠ **El quinto criterio sigue PENDIENTE**: falta verificar el nombre en SIPI,
  clases 9 y 35 — empezando por `capotte`, que es el nombre puesto. Hasta que eso
  pase, no se compra dominio ni se abren cuentas.
  Verificar antes de enamorarse es justo la lección que costó el cambio.
- Descartados por el camino y por qué: **guiño** (la ñ no sirve para dominio, y
  con ese nombre el isotipo pasa a leerse como un ojo, que encierra el
  catálogo), **tregua** (solemne, supone una guerra), **trasnoche** (encierra
  la marca en la noche), **tranqui** (demasiado informal y poco distintiva),
  **Oculus** (es la marca de VR de Meta, y los visores son clase 9: colisión
  peor que la de Essilor), **solaz** (buena, quedó de tercera).

## Lo que trajo la tanda de imágenes (septiembre 2026)
Mateo pasó el brief de fotografía por un modelo de imagen y volvió con tres
láminas: contactos por bloque (catálogo, macro, puestas, contexto, packaging),
macros de marca sobre la pieza, y una hoja de brand book. **Son dirección, no
activos** — las monturas no son las reales y las láminas no están gestionadas
en color. Lo que sí resuelven:
- **El sello es la marca.** Doble filete ondulado —no un círculo—, `capotte`
  arriba, el leopardo, `bogota` abajo. Con eso **muere la exploración de la C**:
  el isotipo no es una letra, es el sello con el animal.
- **El rombo ◆ es el separador** del bloqueo (`capotte ◆ bogota`) y la trama del
  papel. Es el único signo del sistema: no dibuja nada, puntúa. Adoptado en la
  barra, en el pie y en el sello del sitio.
- **La montura es de acetato carey**, rectangular de esquinas redondeadas.
  ⚠ El catálogo del sitio dice «negro humo / arena traslúcido / oro viejo»: las
  imágenes y el copy no coinciden todavía.

⚠ **Divergencias medidas que hay que cerrar antes de que esto sea especificación:**
1. **Tres marfiles distintos.** El sistema usa `#F7F4EF`; la hoja de brand book
   se etiqueta `#F5F2EB` y **renderiza** `#EFEBE4`; la hoja de contactos corre a
   `#E0DAD1`. Ni siquiera coincide consigo misma.
2. El negro etiquetado `#000000` renderiza `#141414`.
3. **La tipografía de las láminas no es Gambetta**, y el brand book la rotula
   así. Su «alfabeto» además es inventado (`fguįksshoopcetãrwxyz`): es
   decoración, no un espécimen. No usar esa hoja como referencia de tipografía.
4. **Aparece dorado** en bisagra, grabado y lacre, y no está en la paleta.
   Criterio propuesto: el metal es **material**, no color — vive en la pieza
   física y no se convierte nunca en tinta sobre papel ni en color del sitio.
5. **Hay tres leopardos distintos** circulando: el de la lámina vendorizada
   (rosetas de anillo), el del brand book (manchas macizas) y el del sello.
   Hay que quedarse con uno y redibujar los otros dos a partir de él.
6. La iconografía propuesta (rombo, flor, estrella, **laurel**) contradice la
   regla de «nada de laurel, corona, guilloché ni festón». Se conserva **solo el
   rombo**, que ya hace trabajo real.
7. El bloqueo aparece **con tracking** en el sello y en la varilla, contra la
   regla de no añadirle tracking a `capotte`. Si se queda, que sea una excepción
   declarada para texto curvo o muy pequeño, no un accidente.
8. En «puestas» el reparto es mayoritariamente masculino. El pendiente de
   «masculina o unisex» sigue abierto y estas imágenes lo contestan sin querer.

## El público de la casa de autor (dirección tomada, copy sin cerrar)
No es el estudiante trasnochado —ese era el público de la dirección vieja—. Es
**la proyección de los socios a unos años**: alguien que sigue trabajando pero
ya no se quema, que se cuida y lo hace con gusto. Fotografía de estilo de vida
y de momentos, no de producto sobre fondo blanco.
- ⚠ **«Cuidarte con estilo» está sin decidir y tiene dos peros.** El primero es
  regulatorio: «cuidar» junto a unas gafas se lee como cuidado ocular, que es
  justo la frontera INVIMA que este proyecto lleva un año esquivando. El
  segundo es de registro: suena a bienestar, y la casa habla como un catálogo
  («hechas para usarse. pensadas para permanecer.»). Si la idea se queda, que
  viva en la sección de la casa, no como eslogan bajo la marca.

## Posicionamiento (la tesis del negocio)
Warblue vende el mismo producto genérico con pauta pagada, y su Trustpilot está destruido:
esperas de hasta 2 meses, envíos desde China, soporte que no responde. **La categoría entera
pierde por logística y servicio, no por producto.**

capotte gana ahí: stock propio en Bogotá, entrega en 2-3 días por Interrapidísimo/Servientrega,
soporte por WhatsApp en español el mismo día. Eso va literal en el hero.
→ Implica **inventario propio, NO dropshipping.** Pedido inicial 50-100 unidades.
Es el único riesgo de capital aprobado del proyecto.

## Marca
- Nombre: **capotte** · Wordmark en **minúscula**: `capotte`
- **La marca es el sello.** No es una letra ni un isotipo: doble filete ondulado,
  `capotte` arriba, el leopardo, `bogota` abajo. La definición completa —las dos
  escalas ópticas, los umbrales medidos, el aire y los usos— está en
  `manual.html` §iv y en «La casa de autor», arriba.
- **La marca no dibuja la categoría**, por la misma razón que el dominio: nada de
  gafas, ojos, pantallas, lunas ni zzz. El catálogo de mañana puede incluir
  antifaces o tapones, y una marca con el producto adentro lo contradice.
  ⚠ Murieron por esta regla dos exploraciones: la **«C»** —descartada además por
  medición, ver arriba— y el **isotipo «las manos»**, dos arcos sosteniendo un
  punto, que era la firma de la dirección vieja. Sus archivos siguen en
  `assets/img/` (`isotipo.svg`, `isotipo-reducido.svg`, `isotipo-*.png`) **sin
  usarse**: son candidatos a borrar, no a reutilizar.
- **Nada se escribe en mayúscula**, ni el logotipo ni los titulares, y a
  `capotte` no se le añade tracking: el comportamiento natural de la cara es
  parte de la identidad. La única excepción declarada es el texto curvo o muy
  pequeño del sello.
- **Tono: editorial mid-century.** Truman Capote, Don Draper de vacaciones,
  Esquire de los 60. Elegancia sin esfuerzo. Menos «protección», más «ritual».
- **Sin gradientes, sin sombras, sin bordes redondeados grandes.** Hairlines y
  bloques planos.

### Paleta
Negro y marfil **son** la identidad. Arena, espresso y oliva son papel y tinta,
no colores de marca.

| Token | Hex | Papel |
|---|---|---|
| `--negro` | `#000000` | tinta, y fondo de la plancha negra |
| `--marfil` | `#F7F4EF` | papel, y fondo de la plancha marfil |
| `--arena` | `#D8D2C4` | superficie — **nunca texto** (1,37 sobre marfil) |
| `--espresso` | `#2B231D` | texto secundario |
| `--oliva` | `#55624A` | el único acento con color |

- **No se inventa un color de marca.** El oliva no ocupa nunca más que un filete,
  un punto o una palabra. El color de verdad va a entrar por el acetato del
  primer lote: **definirlo antes es decidir dos veces.** Si alguien pregunta «qué
  paleta usamos», la respuesta no es «no sabemos» — es esta, y el aplazamiento
  del color es la decisión.
- Contrastes **medidos**, no estimados. El oliva hay que aclararlo a `#8A9C7C`
  sobre negro (3,23 no pasa como texto).
- ⚠ Hay **tres marfiles distintos** circulando entre el sistema y las láminas
  generadas; ver «Lo que trajo la tanda de imágenes».
- **Dos planchas, no modos.** Marfil con tinta negra, y su negativo. El negativo
  no es «modo oscuro»: es la otra plancha del mismo grabado.

### Tipografía
**Dos caras y dos papeles.** La serif firma y titula; la sans se lee.
- **Display y titulares: Gambetta** (Indian Type Foundry, Fontshare). Vendorizada
  en `assets/fuentes/`, pesos 400 y 500 con sus itálicas.
- **Texto, rótulos y formularios: Instrument Sans.** También vendorizada.
- **Si dudas, es sans.** La serif para lo que se mira —titulares, el logotipo,
  los nombres de las piezas, la itálica de firma—; la sans para lo que se
  recorre: párrafos, bajadas, rótulos, fichas, precios, barra, botones y
  formularios.
  ⚠ Se probó **Gambetta sola en toda la página** y se revirtió a petición de
  Mateo, que la pidió tres veces. Lo aprendido: la serif sola da un resultado más
  editorial y menos tienda, pero la página además tiene que vender, y la sans en
  la barra, las fichas y los datos se recorre mejor. **La serif gana como
  excepción, no como norma** — en cuanto baja al párrafo deja de firmar.
- **La itálica es la firma** y se usa con cuentagotas: el énfasis del título de
  sección y poco más. Gambetta en itálica es caligráfica; repartida por la página
  se vuelve decoración.
- Los precios llevan `font-variant-numeric: tabular-nums`.
- **Solo el wordmark va en minúscula forzada.** Los titulares de sección van en
  tipo oración.
⚠ Descartadas por el camino: **Lora**, **Fraunces** (demasiado característica:
hacía juzgar el diseño sobre una cara que no es la nuestra), Archivo, Sora y
Geist. **Newsreader** se queda solo como respaldo de Gambetta, y desde que
Gambetta entró ya no se ve. **Supply Mono** es de pago para uso comercial: NO
usar.
## Infraestructura (DECIDIDO)
| Qué | Dónde | Costo |
|---|---|---|
| Código | GitHub, en una **Organización**, no en una cuenta personal | $0 |
| Sitio | Cloudflare Pages, conectado al repo | $0 |
| DNS + dominio | Cloudflare (Registrar vende a precio de costo) | ~$11-35 USD/año |
| Worker de la firma Wompi (Fase 2) | Cloudflare Workers | $0 |
| Correo del dominio | Cloudflare Email Routing (solo recibe) | $0 |
| Analítica | Cloudflare Web Analytics (sin cookies, sin banner) | $0 |

- **Cloudflare y no GitHub Pages** por tres razones: el Worker de Wompi ya estaba
  previsto ahí, Pages gratis permite repo **privado** (GitHub Pages gratis obliga a
  repo público, y este repo tiene precios provisionales y estrategia), y Cloudflare
  tiene presencia en Bogotá.
- **Los activos los posee el negocio, no una persona.** Cuenta de Cloudflare con
  correo neutro que ambos socios controlan; repo en una Organización de GitHub con
  los dos como Owners. Quién pone la tarjeta es indiferente: pagar no es ser dueño.
- ⚠ **Crear la cuenta correcta ANTES de comprar el dominio.** Tras registrarlo hay
  bloqueo de transferencia de 60 días, y mover un dominio entre cuentas después es
  un dolor de cabeza evitable.
- ⚠ La cuenta de **Wompi es la excepción**: va a nombre de quien factura legalmente.
  Esa no se comparte de forma neutra (ver PENDIENTE: nombre legal).

## Pagos (Wompi)
- Plan agregador estándar: sin mensualidad, ~2.65% + $700 + IVA por transacción.
  Medios: tarjetas, PSE, Nequi, botón Bancolombia.
- **Fase 1 — Links de pago:** links creados manualmente en el dashboard de Wompi
  (un link por variante, monto fijo). El botón "Comprar" del sitio abre el link.
  Cero código de pago, cero secretos en el repo.
- **Fase 2 — Widget embebido:** el widget de Wompi exige firma de integridad, que
  requiere un secreto → NO puede vivir en el frontend. Solución: Cloudflare Worker
  gratuito que calcula la firma. Solo migrar cuando el volumen lo justifique.
- La llave pública de Wompi SÍ puede ir en el front. Llaves privadas/secretos: JAMÁS
  en este repo ni en este chat.

## Pedidos (Fase 1) — decidido, **no implementado todavía**
- Sin base de datos. **WhatsApp, no Google Form**: menos fricción y es como
  compra Colombia. La idea es que el pedido se arme con `wa.me` desde la bolsa.
- Si se implementa, los datos de envío viven en `localStorage` y **nunca salen a
  un servidor** — y eso hay que decirlo en el propio formulario.
- Confirmación y seguimiento por WhatsApp. Envíos: Servientrega / Interrapidísimo.
- ⚠ **Estado real hoy**: `index.html` no tiene `wa.me` ni checkout. La bolsa vive
  en `localStorage` y cada producto abre su enlace de pago de Wompi. El flujo de
  cuatro pasos que existió era de `propuesta.html`, el archivo.

## Arquitectura
```
capotte/
├── capotte.html          # el sitio: casa de autor
├── index.html            # Fase 1: catálogo, bolsa y pago por enlace
├── manual.html           # el manual, compilado
├── MANUAL-DE-MARCA.md    # la fuente de verdad
├── CLAUDE.md             # las razones y lo medido
├── deploy.sh
├── propuesta.html        # ARCHIVO — dirección «noche», no se toca
└── assets/
    ├── fuentes/          # Gambetta e Instrument Sans en woff2, sin CDN
    ├── img/              # el leopardo, el sello, las fotos
    └── js/               # ARCHIVO — solo lo usa propuesta.html
```
## Proveedor — lo que ofrece (de sus fichas, sin cotizar todavía)
- **Montura**: PC, TR90, CP, acetato, **bambú, madera**, metal, paja de trigo, RPCTG.
- **Lente**: PC, vidrio, nylon, resina, acrílico, TAC, CR-39.
- **Personalizable**: forma del frente, diseño de varilla, bisagras y apliques
  metálicos, color por **Pantone**, y logo impreso o grabado en la varilla.
  → La bisagra metálica con tornillo que promete el copy del sitio **sí es una
  opción real que hay que pedir**, no un supuesto.
  → El isotipo en la varilla es la primera aplicación física de la marca.
- **Cuatro tintes**, no dos: ámbar/naranja, amarillo, rojo y transparente.
  Nuestro catálogo de dos es una simplificación deliberada, no una limitación.

### ⚠ La ficha de tintes del proveedor NO se puede usar como copy
Trae porcentajes (20-40 / 40-60 / 80-99 / 99 %) **sin ensayo adjunto**, y frases
como «Melatonin Support», «promote natural sleep cycles» y «Medical Grade».
- Los porcentajes son la misma situación de Warblue: cifras del vendedor, no de
  un laboratorio. No se publican. Al cotizar, **pedir el reporte de
  transmitancia espectral por tinte**, no la ficha comercial.
- «Medical grade» y las promesas de sueño son justo lo que no podemos repetir
  (riesgo INVIMA/SIC). Ni citándolas como «según el fabricante».

### Madera y bambú — evaluado, no para el primer pedido
Diferencia de verdad en una categoría donde todo es TR90 negro, y fotografía
muy bien. Pero: **pesa más que el TR90**, y el argumento del producto es
aguantar seis horas seguidas — el conflicto es directo. Además sube MOQ y costo
unitario sobre un primer pedido de 50-100 sin demanda validada, y la veta varía
pieza a pieza, así que la foto de producto deja de coincidir con lo que llega.
→ Candidato fuerte para una **segunda serie limitada** cuando el primer lote se
venda, con precio más alto. Diferenciarse por material es más fácil de pagar
después de validar que antes.

## PENDIENTE
**Bloquean dinero o riesgo legal:**
- [ ] Cotización del proveedor: precio unitario por volumen y MOQ.
- [ ] Precio de venta y costo landed (producto + flete + arancel + IVA).
      Hoy **no hay ningún precio puesto**: `index.html` muestra `$ 000.000`, que
      es el hueco, no un cero.
- [ ] Reporte de transmitancia espectral del proveedor. Habilita o no las claims
      técnicas — y sin él no se publica ningún porcentaje.
- [ ] Nombre legal / quién factura (persona natural sirve para arrancar con Wompi).
- [ ] **Radicar la marca en la SIC**, clases 9 y 35. La búsqueda en SIPI ya se
      hizo y `capotte` no aparece registrado, pero ⚠ **buscar no es registrar**:
      a RELIEF lo tumbó una marca *parecida* (I-RELIEF), no una igual. Hasta
      radicar no hay derecho que oponer.
- [ ] Dominio: **capotte.com.co** (~$50.000 COP/año). Único gasto fijo aprobado.
      **Criterio: el dominio NO puede nombrar la categoría** — nada de `lentes`,
      `gafas`, `optica` ni `glasses`. Solo la marca, o la marca con una palabra
      de voz (`soy`, `hola`). ⚠ Crear la cuenta de Cloudflare correcta **antes**
      de comprar: después hay bloqueo de transferencia de 60 días.

**Identidad, lo que falta:**
- [ ] **El rombo `◆`**: no existe en Gambetta, ni en Newsreader, ni en Instrument
      Sans, así que hoy lo dibuja el sistema operativo del visitante. Hay que
      sustituirlo por una forma propia.
- [ ] **La pieza por debajo de 32 px** (favicon, avatar). Descartada por medición
      la «C» dentro de un anillo. Hay una propuesta de monograma en evaluación,
      pendiente de medir a 16 px.
- [ ] Decidir si el sello mezcla dos caras (`capotte` en Gambetta, `bogota` en
      Instrument Sans) o va todo en Gambetta.
- [ ] Quedarse con **un** leopardo: circulan tres (la lámina vendorizada, el del
      brand book, el del sello) y hay que redibujar los otros dos a partir de él.
- [ ] Definir si la marca es masculina o unisex — afecta copy y fotografía.
- [ ] Si se quieren 300, 600 o 700 de Gambetta, convertir esos `.otf` a `woff2`
      y cablearlos. Hoy solo están los cuatro que el sitio usa.

**Fotografía (toda bloqueada por el shooting):**
- [ ] `index.html` pide `lectura.webp`, `sobremesa.webp` y `par.webp`. Los tres
      slots existen y hoy muestran una lámina pendiente.
- [ ] `capotte.html` pide `og.png` (1200×630).
- [ ] Shooting propio: sillón, libro, luz de tarde. **No** usar imágenes de
      celebridades ni de series, ni publicar imagen generada como foto de
      producto.

**Limpieza pendiente en `assets/img/`:** quedaron huérfanos `ambar.webp`,
`rojo.webp`, `combo.webp`, `ambar-puesta.webp`, `rojo-puesta.webp`,
`isotipo.svg`, `isotipo-reducido.svg` e `isotipo-*.png`. **Ningún archivo vivo
los referencia** — son de la dirección vieja. Borrarlos cuando alguien confirme
que no hacen falta.
## Reseñas y estudios (reglas duras)
- **Cero reseñas inventadas.** Testimonios falsos son sanción directa bajo el
  Estatuto del Consumidor (Ley 1480). La sección existe vacía y dice que estamos
  empezando, hasta que haya clientes reales que hayan recibido el pedido.
- ⚠ Las reseñas del prototipo son inventadas y viven en el **modo maqueta**
  (ver más abajo). El texto de los ejemplos respeta igual las reglas de la
  marca —habla de comodidad, entrega y servicio, nunca de dormir ni de
  porcentajes—. Si la maqueta se permite claims, alguien los copia cuando
  lleguen los reales.
- **Cero estudios citados sin leer el estudio.** Si algún día se citan, se cita la
  fuente completa y jamás se traduce a una promesa ("dormirás mejor").
- La sección **"Lo que no vamos a decirte"** convierte esa restricción en
  posicionamiento: Warblue publica 84/97/99% sin respaldo; nosotros decimos por qué
  no publicamos nada todavía. La honestidad es el diferenciador, no un costo.

## Modo maqueta (`MAQUETA`, solo en `capotte.html`)
El prototipo tiene que **verse terminado** para poder juzgarlo: una página
sembrada de `[TBD]` no deja ver si el diseño funciona. Así que todo lo que
todavía no sabemos está inventado en un solo sitio —el bloque `MAQUETA` /
`MUESTRA` al inicio del script— y de ahí sale a la ficha técnica, al costo de
envío, a las respuestas del FAQ, a la garantía, a las devoluciones, al número
de WhatsApp, a las redes, al NIT y a las reseñas. Encendido, además, se calla
el aviso de precios provisionales y desaparecen las miniaturas de las fotos
que aún no existen.

- **`MAQUETA = false` antes de publicar.** Con eso cada dato vuelve a su
  `[TBD]` y la página dice la verdad otra vez. Es **un solo interruptor a
  propósito**: repartido en veinte sitios, alguno se queda encendido.
  Verificado que funciona en los dos sentidos.
- Los datos inventados son **plausibles, no confirmados**. Al llegar los
  reales se reemplazan; no se "verifican contra" lo que hay ahí.
- **Tres cosas no se inventan ni en maqueta**, porque son exactamente lo que
  costaría una sanción si se filtran al sitio real:
  1. porcentajes de bloqueo de luz azul,
  2. cualquier promesa de salud o de sueño,
  3. «grado médico» y familia.
  No están en el bloque y no deben entrar nunca.

## Descartado
- Shopify, WooCommerce, Tiendanube o cualquier plataforma con mensualidad.
- React/Next.js en Fase 1.
- Pasarelas distintas de Wompi (no fragmentar).
- Multi-producto o categorías antes de validar el primero.
- Dropshipping desde China (mata la única ventaja competitiva real).
- Supply Mono y cualquier tipografía de pago.
- Publicar porcentajes de bloqueo sin certificado propio.

## División de trabajo
- Diseño, UI/UX, branding y copy: chat de Claude (proyecto capotte).
- Código, git, deploy: Claude Code en la máquina de Mateo.
- Secretos y llaves: nunca en el chat.
