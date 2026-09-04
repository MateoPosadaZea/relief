# capotte — Ecommerce de gafas protectoras

## Qué es esto
Tienda online de gafas con lente protector (sin fórmula) para el mercado colombiano.
Proyecto de Mateo + socio. Proveedor: Alibaba.
Referentes: ROKA (roka.com) para diseño/producto, Warblue (thewarblue.com) para
arquitectura de catálogo — y como advertencia (ver Posicionamiento).

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
  pero §3.5 lo deroga: crema para la casa y el recorrido, tinta solo para el
  bloque de El par. §3.5 es lo vigente.
- **Ninguna regla de CSS escribe un hex**: todo sale de una variable, y el
  bloque oscuro solo redefine los roles. Auditado.
- ⚠ **Dos colores del manual no pasan AA sobre crema y hubo que derivarlos.**
  La paleta de §3.5 está escrita para fondo tinta:
  - `--tenue #8C8579` da **3,02** sobre crema (sobre tinta da 5,16 y ahí sí
    sirve). Los eyebrows sobre crema usan `--texto2 #5C564C` = **6,01**.
  - El ámbar de marca da **1,79** sobre crema: no se puede usar como texto.
    `#B07A1F` da **3,07**, tampoco llega. Mismo tono (36°) y saturación con
    luminosidad al 32 % → **`#935E10` = 4,51**, que es el `--ambar-texto`.
- ⚠ **Fontshare está bloqueado desde este entorno** y por eso **no se ha
  podido confirmar nunca que Gambetta cargue**. Medido: `Gambetta` y `Georgia`
  dan el mismo ancho, o sea que se está pintando el respaldo. Hay que
  verificarlo desde una máquina con acceso.
- Trampa pagada: `.hero h1 span{display:block}` alcanzaba también al punto
  final y lo mandaba a su propia línea. Hijos **directos**.

## ⚠ Dos direcciones vivas — leer esto antes de tocar nada
En septiembre de 2026 llegó un brief nuevo que **redefine la marca**: capotte
deja de ser «lentes filtrantes para trabajar de noche» y pasa a ser **una casa
de gafas de autor de Bogotá**, con un leopardo grabado del XIX como firma,
paleta negro + marfil y tono de libro de exploración. Vive en `capotte.html`.

**DECIDIDO (septiembre 2026): el sitio es `capotte.html`.** Mateo lo vio montado
y la dirección de casa de autor gana. `propuesta.html` se queda como archivo: no
se sigue desarrollando, pero tampoco se borra todavía, porque guarda el trabajo
de los cuatro modos, el checkout de cuatro pasos y el visor 3D.

Las dos siguen en el repo por eso:

| | Dirección «noche» | Dirección «casa de autor» |
|---|---|---|
| Archivo | `propuesta.html` | `capotte.html` |
| Producto | Dos lentes filtrantes, ámbar y carmín | Series cortas numeradas, sin fórmula |
| Paleta | Noche/día/trabajo/descanso, rojo y ámbar | Negro + marfil, arena/espresso/oliva de acento |
| Cara | Gambetta + Instrument Sans | Gambetta sola, sin ninguna sans |
| Firma | Isotipo «las manos» | El leopardo |

Lo que **sigue valiendo para las dos** y no se toca: el capítulo del nombre y la
SIC, la infraestructura (Cloudflare, Wompi, org de GitHub), las reglas duras de
reseñas y claims, y el modo maqueta.

## El manual (`manual.html`)
El sistema de diseño vive en el repo, no en un PDF ni en un chat, **porque el
manual tiene que compilar**: los valores del manual SON los tokens de
`capotte.html`. Tres capas y un orden de mando claro:
`capotte.html` (los valores) → `CLAUDE.md` (las razones) → `manual.html` (la
vista). Si los tres dejan de coincidir, mandan los tokens.
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
  ⚠ **Falta una cosa para que el sello sea un archivo de imprenta:** las dos
  palabras van como **texto vivo** y tienen que ir convertidas a curvas, y eso
  no se puede hacer sin los archivos de Gambetta. El bloqueo de la fuente no es
  solo estético: **impide cerrar el logotipo.** El leopardo ya es vectorial.

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
  ⚠ **Faltan los archivos de Gambetta.** `api.fontshare.com` está bloqueado
  por política de red desde aquí (403 en el CONNECT), no hay paquete en npm,
  jsDelivr también está bloqueado y la búsqueda de GitHub está limitada a este
  repo. **No se puede descargar desde una sesión**: los archivos tienen que
  entrar desde fuera. Sus cuatro `@font-face` ya están cableados y Gambetta va
  primera en la pila, así que basta con dejar en esa carpeta
  `gambetta-400.woff2`, `gambetta-400-italica.woff2`, `gambetta-500.woff2` y
  `gambetta-500-italica.woff2` — con esos nombres exactos— y entra sola.
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
Público objetivo: gente que trabaja de noche frente a pantallas (teletrabajo, turnos,
gamers, estudiantes). El ángulo de venta es la rutina nocturna completa.

1. **Lectura** (variante Ámbar) — lente ámbar. Para las horas de trabajo nocturno frente
   a pantalla. Filtra parte de la luz azul manteniendo visibilidad y color utilizable.
2. **Sobremesa** (variante Carmín) — lente carmín. Para la última hora antes de dormir. Filtra azul y verde
   (rango corto del espectro). No es para trabajar ni conducir.
3. **Combo Rutina Nocturna** — Ámbar + Rojo con descuento. **Producto héroe del sitio.**
   El combo sube el ticket promedio (el fee fijo de Wompi y el envío pesan menos) y
   cuenta la historia completa: "trabaja → transición → duerme".

Cada producto = 1 link de pago de Wompi en Fase 1 (3 links en total).

## Principios (no negociables)
- **Costo fijo cero.** GitHub Pages + Wompi. Nada de Shopify, nada de mensualidades.
- **Radical simplicidad.** Un producto, pocas variantes. Nada de features especulativos.
- **Vanilla HTML/CSS/JS.** Sin frameworks, sin build step. El HTML, el CSS y la
  lógica viven en `index.html`; three.js y el modelo 3D son módulos aparte porque
  se cargan en diferido. Sin CDN: todo vendorizado en el repo.
- **Sin backend en Fase 1.** Catálogo = objeto JS en el propio archivo. Carrito = localStorage.
- **Claims de producto conservadoras.** Lenguaje de confort ("reduce fatiga visual", "filtra
  luz azul"). NUNCA promesas de salud o sueño (riesgo regulatorio, no somos ROKA/Huberman).
- **Cero porcentajes sin certificado.** No publicar "bloquea 97%" salvo que tengamos el
  reporte de transmitancia espectral del lote exacto que vendemos. Warblue publica
  84/97/99% — no copiar esos números.
- **La marca vive de noche, pero el sitio abre de día.** El modo día es el
  defecto: el visitante llega a cualquier hora y un fondo negro de entrada le
  pide una decisión que no ha tomado. Noche queda a un clic, y es donde el
  producto se ve mejor.
- **El modelo se va con el recorrido.** La escena es fija, así que en cuanto
  el final del bloque sube por encima de la banda del modelo, la escena se
  desplaza hacia arriba lo mismo que él: el pie del modelo queda atado al
  borde de la sección y nunca lo cruza. Es esto y no un recorte —un corte duro
  partiría las gafas justo en la línea de la sección, que se ve peor.
- **El modelo va por encima del texto del recorrido**, no detrás: cuando el
  texto le pasaba por encima tapaba la pieza justo mientras el panel hablaba
  de ella. Sigue por debajo de la barra, del wordmark y de las láminas de menú
  y carrito. Como la escena es fija y ocupa la ventana, se **retira** al salir
  del recorrido: si no, se quedaba flotando sobre las secciones de abajo.
- **En el recorrido no se atenúa ninguna pieza.** Se probó bajar la opacidad de
  todo lo que no fuera la pieza del panel y no se lee como «mira esta»: se lee
  como un modelo a medio cargar —un aro gris y translúcido junto a uno negro y
  sólido es un defecto, no un énfasis—, y el cambio de opacidad entre pasos
  hacía que las piezas se acoplaran de golpe. La pieza la señalan el encuadre y
  el zoom, que es como lo hace una cámara: acercándose, no borrando el resto.
- **Todo lo inmersivo es una capa encima, nunca un requisito.** El 3D se carga solo
  si el navegador puede; sin WebGL, sin JS o con el módulo caído, la página vende
  igual. Nada de la compra depende de la escena.
- **Lo inmersivo se apuesta donde decide la compra, no como adorno.** En la home el
  modelo es ambiente; en la ficha de producto es un visor girable con el lente de
  ESE producto. La miniatura «3D» es una opción más de la galería, nunca la primera:
  la foto real va de primera porque es la que da confianza. El checkout no se toca.

## La historia (estructura de la home)
La home es un recorrido de una noche, con el modelo 3D fijo detrás y los paneles
pasando por encima. El lente del modelo va de ámbar a rojo según el scroll: el
arco visual *es* el arco del catálogo.

| Panel | Qué dice |
|---|---|
| Hero | Titular escalonado de tres líneas: «LA ÚLTIMA / HORA / DEL DÍA.» |
| 11:47 PM | El problema, sin prometer nada: llevas seis horas y te faltan dos. |
| Somos capotte | Dos lentes, uno para trabajar, uno para parar. Nada más. |
| 12:30 AM | El ámbar: el del turno. |
| 2:10 AM | El rojo: el del final. |
| Mañana, 9:00 AM | Sale de Bogotá, no de Shenzhen. La tesis del negocio. |

- El reloj no es decoración: encierra la noche del cliente y aterriza en la entrega,
  que es la única ventaja competitiva real.
- **El hero es tipografía y nada más.** Tres líneas escalonadas en MAYÚSCULAS
  —la única mayúscula de la página—, el punto final en rojo, el párrafo
  arrancando en la mitad del ancho y el CTA en dos celdas separadas por un
  filete. Sin botón rojo: el rojo es del botón de compra. El sello de entrega
  se va a la esquina de abajo. Mide una pantalla justa **menos la barra**: la
  barra es `sticky` y sigue ocupando su alto en el flujo, así que con `100svh`
  a secas el sello caía por debajo del pliegue.
- **El modelo no comparte pantalla con el titular.** Entra al irse el hero, no
  con la página. Ese avance lo publica el mismo contrato de antes
  —`window.__morfo`, que la escena lee para pasar del encuadre de entrada al
  del recorrido—; lo que cambió es quién lo escribe.
- ⚠ **Se retiró el wordmark que se volvía logotipo**, junto con el indicio
  «Desliza» y la primera pantalla de 190vh que le servía de escenario. Duró
  hasta septiembre de 2026. Lo que se aprendió y sigue valiendo: un texto que
  llega a su tamaño final por `transform: scale()` se rasteriza a un cuerpo y
  se muestra en otro, y se ve pastoso al lado de texto dibujado a su tamaño;
  y para apoyar una palabra sobre una línea hay que medir su **tinta**
  (`actualBoundingBox…`), no su caja.
- **El copy describe el problema, nunca promete la cura.** "Llevas seis horas frente
  a la pantalla" es seguro y pega más fuerte que cualquier claim de salud.

## Los dos lentes (donde se decide la compra)
Una sola sección en dos columnas: a la izquierda los datos, a la derecha el
modelo 3D pegado, girable, con el lente del producto.

- Cada lente es una **fila, no una tarjeta con foto**: la imagen de esa sección
  es el modelo de al lado, y repetirla en la columna la volvía redundante.
  Pulsar una fila cambia el lente del visor y marca la fila — es la misma
  decisión mirada desde los dos lados.
- **«Las medidas» dejó de tener sección propia** y vive en un acordeón de esa
  columna. Es el dato que se consulta al decidir, no un capítulo del recorrido:
  como sección aparte cortaba la historia justo después del scroll inmersivo.
  La ficha completa sigue estando en la página de producto.
- El recuadro tiene **dos vistas y dos lentes**: ámbar/rojo cambian el color
  del modelo y marcan la fila; 3D/Puestas alterna entre el modelo y la foto
  puesta de ESE lente. Así la sección tiene las dos cosas —el objeto girable y
  la prueba social de verlas puestas— sin duplicar tarjetas. Si a algún lente
  le falta la foto, el par de botones de vista desaparece entero: media opción
  no sirve de nada.
- Es el **segundo visor de la home**. No compite con la escena del recorrido:
  los dos se paran solos al salir de pantalla, así que solo hay uno dibujando.
  Se monta al acercarse la sección, no en la primera pantalla. Sin WebGL el
  bloque se retira y la columna de datos se queda con la sección entera.

## La ficha de producto (donde se convierte)
- La **columna de la imagen es pegajosa**: la foto sostiene la decisión y
  desaparecía en cuanto abrías un par de acordeones.
- Debajo de los botones van las **cuatro dudas** que frenan una compra en una
  tienda que nadie conoce —cuándo llega, si el pago es seguro, qué pasa si no
  me gustan, si hay alguien del otro lado—, en una línea cada una y **antes**
  de los acordeones: un acordeón cerrado no responde nada.
- ⚠ **Nada de urgencia inventada**: ni contadores, ni «quedan 3», ni «12
  personas viendo esto». Es publicidad engañosa igual que una reseña falsa, y
  además no hace falta: lo que da confianza en esta categoría son hechos
  verificables, que es justo donde ganamos.
- Las **reseñas van al final y a lo ancho**, no en la columna: quien llega ahí
  ya leyó el producto y lo que le falta es que otro se lo confirme.

## El cursor
El punto del centro del isotipo haciendo de puntero: punto lleno, y aro al
acercarse a algo pulsable —el mismo gesto de los arcos—. Sobre el botón de
compra el aro se pone rojo.
- **El punto persigue al ratón, no va pegado a él.** Va detrás y llega: es lo
  que lo hace sentir un objeto con peso y no un dibujo clavado al puntero. El
  seguimiento es por tiempo (`1 - k^dt`), no por cuadro, para que el retardo se
  sienta igual a 60 y a 120 Hz. Con «reducir movimiento» el retardo se apaga.
- **La flecha del sistema desaparece entera**, con `!important`: había una
  docena de `cursor:pointer` con selectores algo más específicos que la traían
  de vuelta justo sobre botones y enlaces, que es donde más se nota.
- Solo con **ratón fino**: en táctil no hay puntero que sustituir.
- El atributo que apaga el cursor del sistema **lo pone el JS**, así que si el
  script falla nadie se queda sin cursor. Los campos de formulario conservan
  el del sistema: ahí el cursor dice dónde va a caer lo que escribes.
- Interruptor en el banco para volver al del sistema.

## El cierre y el pie
- **«Elige el tuyo»** cierra el recorrido: los tres productos en fila, sin
  descripción —esa la da la sección de los lentes—, solo foto, momento y precio.
  Al pasar el cursor cruza la foto puesta y aparecen la píldora del momento y la
  flecha. En táctil, donde no hay cursor, las dos quedan puestas siempre: si no,
  el dedo nunca ve que la tarjeta lleva a alguna parte.
- **La cinta de reseñas va a sangre, pero su titular no**: se sale de la caja
  hasta el borde de la ventana solo la fila de tarjetas; el encabezado se queda
  alineado con el resto de la página. Sin difuminado en los extremos —cortaba
  la primera y la última tarjeta y parecía un fallo de carga—. La tarjeta usa
  `--tarjeta` y el borde se pone rojo al pasar el cursor.
- **El pie firma en rojo, no se pinta de rojo.** El bloque conserva el fondo de
  la página y el color lo lleva la palabra: el wordmark a tamaño de cartel, en
  rojo. Teñir la pantalla entera pesaba más de lo que decía. Después van los
  enlaces en una línea baja y al final la letra pequeña. El cuerpo de la
  palabra lo mide el JS para que llene el ancho exacto, porque depende de la
  cara, del peso y del tracking. **También mide el descendente**: con
  `line-height:.76` la caja se recorta por debajo de la línea base, y la `p` de
  «capotte» se montaba sobre los enlaces. Un valor fijo no servía —`relief`,
  `recreo` y `malcolm` no tienen ninguno—, así que el hueco sale de la tinta de
  la palabra que esté puesta.
- En el hueco del medio del pie va **«Volver arriba»**: es donde termina de
  leerse la página y donde ya no queda nada abajo. Va en una retícula de tres
  columnas y no en `space-between`, porque con flex se centraba en el hueco
  que dejaran los otros dos grupos y no en la página.
- Como ahora el rojo es **texto** y no fondo, usa el token `--rojo-marca` y sí
  participa de los modos: verificado que los cuatro pasan 3:1 de texto grande,
  y día pasa incluso 4.5:1. El hex fijo se queda solo en el botón de compra.
- La versión de **bloque rojo entero** sigue viva en `.footer[data-pie="rojo"]`,
  con su interruptor en el banco de pruebas, para poder comparar las dos sobre
  el sitio real antes de decidir.

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

## El modelo 3D
Paramétrico, construido en código; no hay `.glb` que cargar. Es la **montura
rectangular de acetato oscuro**, que es la que coincide con las fotos de
producto: aro de esquinas redondeadas con la ceja gruesa y el bajo fino, canto
claro laminado sobre el borde superior, puente ancho a la altura de la ceja, y
varillas planas que adelgazan.

- ⚠ **Se probó rehacerlo como panto redondo de acetato traslúcido** —contra una
  referencia del proveedor, en agosto de 2026— y **se revirtió**: el aro
  circular y el acetato transparente no se veían bien en la escena. Si alguien
  vuelve a intentarlo, dos cosas aprendidas que sirven igual:
  1. La traslucidez **no puede ir por `transmission`**. La transmisión de
     three.js refracta lo que hay en la escena, y aquí la escena está vacía
     porque el lienzo va en `alpha:true` para que se vea la página detrás; con
     transmisión sola el acetato sale gris plano. Va por **alfa**, y entonces
     lo que se ve a través del aro es la página.
  2. El aro redondo es más angosto que el rectangular, así que hay que subir la
     escala del visor o queda nadando en la caja.

## Marca
- Nombre: **capotte** · Wordmark en **minúscula**: `capotte`
- **Isotipo: «las manos»** — dos arcos que sostienen un punto sin tocarlo.
  Vocabulario de la marca: **punto, arco y línea recta**. Nada más.
  - Archivos: `assets/img/isotipo.svg` (principal, de 40 px en adelante)
    y `assets/img/isotipo-reducido.svg` (trazo grueso, de 40 px hacia
    abajo: favicon, bordado, grabado). Son el mismo dibujo en dos tamaños ópticos.
  - **El isotipo no dibuja la categoría**, por la misma razón que el dominio: nada
    de gafas, ojos, pantallas, lunas ni zzz. El catálogo de mañana puede incluir
    antifaces o tapones, y una marca con el producto adentro lo contradice. La luna
    y las zzz además son una promesa de sueño de contrabando.
  - «El punto que baja» (tres puntos decrecientes) queda como **elemento del
    sistema, no como marca**: viñeta, separador, patrón del papel de la caja.
    Comparte el átomo —el punto del centro de las manos— así que se lee de la
    misma familia. No se usa como logo: junto a WhatsApp lee a «escribiendo…»
    y en una barra lee a menú de tres puntos.
  - **La sigla RLF murió con el nombre viejo.** Los productos son «Ámbar» y
    «Rojo» a secas: la sección ya se llama «Los dos lentes» y una sigla nueva
    («RCR Ámbar») sería inventar un problema que no teníamos.
- **La marca vive en la barra y solo en la barra.** El hero es un titular, no
  una presentación de logotipo: la palabra a pantalla completa y la marca en la
  barra eran la misma palabra dos veces. Va centrada y en todas las vistas
  —antes se ganaba el sitio cuando el wordmark aterrizaba; ahora lo tiene—, en
  versalita chica y muy trackeada (`CAPOTTE`, 13 px, `.18em`), que es una firma
  y no compite con el titular. A ese cuerpo cabe también en un teléfono, que
  era lo que antes obligaba a dejar solo el isotipo.
- **La barra son tres celdas de texto del mismo peso**: `Lentes` · `Capotte` ·
  `Carrito (n)`. El carrito dejó de ser una bolsa dibujada con una píldora
  encima: entre dos palabras, un icono rompía la línea, y el número cabe en la
  propia etiqueta. Abierto, la celda dice `Cerrar`.
  ⚠ El coste: en escritorio la barra ya no lleva `Materiales` ni `Envíos`. Se
  llega por scroll y por el pie; en móvil el menú completo sigue en la lámina.
- El isotipo va **en línea** en el HTML, no como `<img>`, para que herede el
  color del modo, y usa el dibujo de la **versión reducida** —trazo grueso,
  punto grande—, que es la regla de los dos tamaños ópticos. Hay interruptor en
  el banco para dejar solo la palabra.
- **Tono: editorial mid-century.** Referencias: Truman Capote, Don Draper de
  vacaciones, Esquire de los 60. Elegancia sin esfuerzo. Menos «protección»,
  más «ritual». El público no es el trabajador de turno: es la persona de 30 a
  45 con gusto, que lee de noche y descansa bien.
- **Los lentes SON la paleta.** No hay colores de marca aparte del producto.
  Ámbar = trabajo. Rojo = dormir. Nada más.

| Token | Hex | Uso |
|---|---|---|
| Noche | `#0B0B0C` | Fondo del sitio |
| Superficie | `#16161A` | Tarjetas, secciones |
| Hueso | `#EDEBE6` | Texto principal en oscuro (NO blanco puro) |
| Ámbar | `#F2A93B` | Lente de trabajo, acentos diurnos |
| Rojo marca | `#D91F26` | Logo, lente nocturno, botón comprar |
| Línea | `#26262B` | Divisores hairline |
| Texto tenue | `#8A8A90` | Secundario |

- ⚠ El rojo `#D91F26` es aproximado del JPEG. **Confirmar el hex exacto del SVG/AI del logo.**
- **Tipografía**: **dos caras y dos papeles.** La serif firma y titula; la sans
  se lee. Sustituyó a Epilogue en solitario cuando el tono pasó a editorial.
  - **Display y titulares: Gambetta** (Indian Type Foundry), desde **Fontshare**,
    no desde Google Fonts. Pesos 400 y 500 más la itálica.
  - **Texto, rótulos y formularios: Instrument Sans** (Google Fonts).
  - ⚠ **Gambetta no carga en la vista previa publicada**: la política de
    contenido del visor de artifacts solo admite hojas de estilo de
    `fonts.googleapis.com`, y el entorno de desarrollo bloquea
    `api.fontshare.com` por política de red. Por eso la pila lleva **Fraunces**
    (Google Fonts) detrás: serif de contraste alto con itálica de verdad, para
    que la vista previa se vea deliberada y no caiga a Georgia. En el sitio
    real (Cloudflare Pages) Gambetta sí carga y manda. **Al vendorizar las
    fuentes —que es lo que pide el principio de «sin CDN»— el problema
    desaparece**, y es lo que hay que hacer antes de publicar.
  - **La itálica es la firma** y se usa con cuentagotas: solo el énfasis del
    título de sección y la frase de marca del hero. Gambetta en itálica es
    caligráfica; repartida por la página se vuelve decoración.
  - Gambetta solo trae 400 y 500: pedirle 600 lo sintetiza y sale sucio, así
    que `--peso-display` arranca en 500.
  - Se implementa en cuatro tokens por **rol** —`--display`, `--titulo`,
    `--etiqueta`, `--texto`— aunque hoy los cuatro apunten a la misma cara: eso
    deja cambiar de idea sin tocar una sola regla de CSS.
  - `--peso-display` calibra el grosor de los titulares grandes (300–700).
  - Los precios llevan `font-variant-numeric: tabular-nums` y son **la única
    excepción de peso**: van en 700 fijo, no en `--peso-display`, porque
    calibrar los titulares no debe adelgazar el precio. Lo que hacía que
    parecieran de otra tipografía era el peso, no la cara: los números de
    Epilogue son geométricos y anchos, y a 600 junto a un párrafo de 400 leen
    como otra cosa. Ahora la diferencia es deliberada.
  - El **logotipo** va en Epilogue, minúscula: `capotte`.
  - **Solo el wordmark va en minúscula.** Los titulares de sección van en tipo
    oración. Todo en minúscula leía a manifiesto y le quitaba jerarquía a la
    única palabra que de verdad se escribe así. El texto del recorrido sí
    conserva la minúscula: ahí es voz, no rótulo.
  ⚠ Descartadas por el camino: **Lora** (serif, se probó para los supergrandes —
  con la escena 3D encima, dos caras eran ruido de más), Archivo + Instrument
  Sans, Sora, y Geist. **Supply Mono** es de pago para uso comercial: NO usar.
- Sin gradientes, sin sombras, sin bordes redondeados grandes. Hairlines y bloques planos.
- Favicon / app icon: isotipo capotte rojo.

### Modos de visualización
El catálogo son dos lentes; el sitio son los mismos dos modos. **El producto se
demuestra a sí mismo** — no es un toggle de preferencias, es una vitrina.

| Modo | Qué es | Fondo |
|---|---|---|
| **Noche** | Tokens exactos de la tabla de arriba. | `#0B0B0C` |
| **Día** | **Por defecto.** Fondo blanco. | `#FFFFFF` |
| **Trabajo** | Aproximación del lente ámbar: azules fuera, todo cálido. | `#100C07` |
| **Descanso** | Aproximación del lente rojo: la página baja de intensidad. | `#0D0708` |

- Se implementan como `:root[data-modo="..."]` redefiniendo los mismos ocho
  tokens. Ninguna regla CSS conoce un hex. Las caras y las medidas van en
  `:root` a secas: un `data-modo` desconocido no puede dejar la página sin
  tipografía. La paleta de día va también ahí, porque es el defecto.
- `--tarjeta` es el octavo: el fondo de una tarjeta que tiene que despegarse
  del fondo de página. En los tres modos oscuros es idéntico a `--superficie`.
- ⚠ **El modo día pasó a fondo blanco** (`#FFFFFF`). La regla vieja decía
  «fondo hueso, nunca blanco puro»; se cambió a pedido, y con el fondo blanco
  la que se hunde un punto es `--superficie` en vez de la tarjeta. La versión
  hueso sigue viva en `:root[data-modo="dia"][data-claro="hueso"]` con su
  interruptor en el banco. **«Nunca blanco puro» sigue vigente para el
  texto**: `--hueso` es `#16161A` en día y `#EDEBE6` en noche.
  Contraste reverificado sobre blanco: texto 18.0, tenue 6.3, ámbar 5.9,
  rojo 6.0 — los cuatro pasan AA.
- Los nombres de token describen el **rol**, no el color literal: en modo día,
  `--noche` guarda el color de fondo claro y `--hueso` el texto oscuro.
- `--ambar-texto` es un token derivado: el ámbar de la tabla no alcanza 4.5:1
  como texto sobre fondo claro, así que en modo día se oscurece conservando el
  tono. En los tres modos oscuros es idéntico a `--ambar`.
- El rojo del botón de compra **no cambia** entre modos: el CTA tiene que seguir
  siendo reconocible.
- Toda combinación texto/fondo verificada contra WCAG AA (4.5:1) en los 4 modos.
- El modo se guarda en `localStorage` y se aplica en un script inline del
  `<head>`, antes del primer paint. Es el único JS que no vive al final.
- **El defecto respeta `prefers-color-scheme`.** Día es el defecto, pero no por
  encima del sistema: si el visitante ya puso su equipo en oscuro, esa decisión
  YA está tomada y la página la sigue. El orden es: lo que eligió aquí > lo que
  dice su sistema > día.
- ⚠ El copy de los modos es **descriptivo, nunca clínico**. "Aproximación visual
  de cada lente", jamás "reduce la fatiga" ni "te ayuda a dormir".

## Arquitectura Fase 1
```
capotte/
├── index.html      # landing + historia + producto + carrito (todo en uno)
├── assets/
│   ├── img/        # fotos de producto y de marca (webp)
│   └── js/
│       ├── gafas.js            # modelo 3D paramétrico, carga diferida
│       └── vendor/three.*.js   # three.js vendorizado, sin CDN
├── CLAUDE.md
└── deploy.sh       # git add . && git commit && git push (Pages publica solo)
```

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

## Pedidos (Fase 1) — DECIDIDO
- Sin base de datos. **WhatsApp, no Google Form**: menos fricción y es como compra
  Colombia. El checkout arma el mensaje con `wa.me` desde el carrito y los datos.
- Los datos de envío viven en `localStorage`, nunca salen a un servidor. Eso hay que
  decirlo en el formulario, y ya está dicho.
- Confirmación y seguimiento por WhatsApp. Envíos: Servientrega / Interrapidísimo.

## Vistas (router por hash)
Tres vistas sobre el mismo `index.html`, sin build step ni configuración de rutas
—el hash funciona en GitHub Pages tal cual:

| Ruta | Vista |
|---|---|
| *(sin hash)* | La home: historia, catálogo, envíos, FAQ |
| `#/producto/<id>` | Ficha completa: galería con visor 3D, precio, cantidad, acordeones |
| `#/checkout` | Compra en 4 pasos |

- Una ruta inválida cae a la home, no a una pantalla en blanco.
- Cambiar de vista cierra el panel del carrito y sube el scroll a cero.

## Checkout (4 pasos)
1. **Carrito** — líneas con cantidad editable y total.
2. **Envío** — nombre, WhatsApp, cédula, ciudad, dirección, indicaciones.
   Validación propia; los datos persisten en `localStorage`.
3. **Pago** — resumen + dirección + botón que abre el link de Wompi.
4. **Listo** — botón de WhatsApp con el pedido ya armado.

⚠ Sin link de Wompi el paso 3 avisa y deja seguir, en vez de romperse. Sin número
de WhatsApp el paso 4 lo marca `[TBD]`.

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

## PENDIENTE (no bloquea el scaffold — usar placeholders)
- [ ] Hex exacto del rojo, desde el SVG/AI del logo.
- [ ] Nombres finales de los dos lentes (propuesta: Turno / Apagado, o dejar Ámbar / Rojo).
- [ ] Cotización del proveedor: precio unitario por volumen y MOQ.
- [ ] Precio de venta y costo landed (producto + flete + arancel + IVA).
      ⚠ Hay precios **provisionales** puestos para probar el flujo
      (129.000 / 129.000 / 199.000 desde 258.000). NO salen de ningún costo real.
      Al ponerlos de verdad, bajar `PRECIOS_PROVISIONALES` a `false`: eso apaga
      el aviso que hoy corona el sitio.
- [ ] Reporte de transmitancia espectral del proveedor (habilita o no las claims técnicas).
- [ ] Fotos extra para la galería de cada producto (`*-frente`, `*-lateral`,
      `*-detalle`). La galería ya tiene los slots y cae al `[TBD]` sin ellas.
- [ ] Foto del combo puesto (`combo-puesta.webp`). Las de ámbar y rojo ya están:
      aparecen al pasar el cursor sobre la tarjeta, cruzándose con la foto de
      producto. El slot del combo existe y espera el archivo.
      ⚠ Las dos actuales son generadas: la montura no es la real. Sirven de
      ambiente, no de foto de producto. Rehacerlas con las gafas reales cuando
      llegue el pedido.
- [ ] Fotos de producto (`ambar.webp`, `rojo.webp`, `combo.webp`) y de marca
      (`hero.webp`, `trabajo.webp`, `dormir.webp`, `og.png`). Los slots ya
      existen: soltar el archivo en `assets/img/` lo activa. Ojo: fondo negro
      exige fotos recortadas o de fondo limpio.
- [x] ~~Verificar el nombre en SIPI (clases 9 y 35)~~ — hecho en septiembre de
      2026: `capotte` no aparece registrado. ⚠ **Buscar no es registrar**, y una
      búsqueda de idénticos no es un análisis de confundibilidad: a RELIEF lo
      tumbó una marca *parecida* (I-RELIEF), no una igual. Radicar la solicitud
      es el paso que falta; hasta entonces no hay derecho que oponer.
- [ ] Dominio: **capotte.com.co** (~$50.000 COP/año). Único gasto fijo aprobado.
      **Criterio: el dominio NO puede nombrar la categoría.** Nada de `lentes`,
      `gafas`, `optica` ni `glasses`. El nombre no nombra la categoría; el catálogo de mañana puede incluir antifaces, tapones
      o luz de escritorio, y un dominio con la categoría adentro lo contradice.
      Solo la marca, o la marca con una palabra de voz (`soy`, `hola`) que
      tampoco nombre producto.
      ⚠ Verificar el nombre en SIPI (clases 9 y 35) ANTES de comprar dominio.
- [ ] Nombre legal / quién factura (persona natural sirve para arrancar con Wompi).

- [ ] Definir si la marca es masculina o unisex — afecta copy y fotografía.
- [ ] Shooting propio: sillón, libro, luz de tarde. No usar imágenes de
      celebridades ni de series.
- [ ] Vendorizar Gambetta e Instrument Sans en el repo, y quitar los dos
      enlaces a CDN. Hasta que eso pase, Gambetta no se ve en la vista previa.

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

## Modo maqueta (`MAQUETA`)
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
