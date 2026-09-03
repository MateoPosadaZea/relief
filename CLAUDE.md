# malcolm — Ecommerce de gafas protectoras

## Qué es esto
Tienda online de gafas con lente protector (sin fórmula) para el mercado colombiano.
Proyecto de Mateo + socio. Proveedor: Alibaba.
Referentes: ROKA (roka.com) para diseño/producto, Warblue (thewarblue.com) para
arquitectura de catálogo — y como advertencia (ver Posicionamiento).

## Catálogo (DEFINIDO)
Público objetivo: gente que trabaja de noche frente a pantallas (teletrabajo, turnos,
gamers, estudiantes). El ángulo de venta es la rutina nocturna completa.

1. **Ámbar** — lente naranja/amarillo. Para las horas de trabajo nocturno frente
   a pantalla. Filtra parte de la luz azul manteniendo visibilidad y color utilizable.
2. **Rojo** — lente rojo. Para la última hora antes de dormir. Filtra azul y verde
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
| Hero | Wordmark + "Trabajas de noche. Tus ojos también." |
| 11:47 PM | El problema, sin prometer nada: llevas seis horas y te faltan dos. |
| Somos malcolm | Dos lentes, uno para trabajar, uno para parar. Nada más. |
| 12:30 AM | El ámbar: el del turno. |
| 2:10 AM | El rojo: el del final. |
| Mañana, 9:00 AM | Sale de Bogotá, no de Shenzhen. La tesis del negocio. |

- El reloj no es decoración: encierra la noche del cliente y aterriza en la entrega,
  que es la única ventaja competitiva real.
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
  cara, del peso y del tracking.
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

## ⚠ El nombre: RELIEF → recreo → malcolm (provisional)
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
- **Hoy la marca es `malcolm`, y es PROVISIONAL** — puesta para verla funcionando,
  no decidida. Ganó junto a `capote` y `wayne` en una exploración de apellidos:
  después de rechazar seis nombres-concepto quedó claro que el equipo no quiere
  un nombre que explique el producto, sino uno con pátina, que es además la
  convención del sector (Persol, Moscot, Oakley).
- ⚠ **La reserva sobre `malcolm`, anotada para que no se pierda**: si la
  referencia se lee, es Malcolm X, y sus gafas son icónicas por lo que él fue —
  una marca nueva usándolas se expone a una crítica difícil de responder. Si la
  referencia no se lee, es un nombre de pila sin significado. Legalmente sí está
  limpio: nadie posee un nombre de pila común. La decisión es del equipo y está
  tomada a conciencia.
- La alternativa con mejor argumento era `capote`: única que funciona en español
  y única que significa algo útil —lo que te echas encima—. Su riesgo es la
  asociación taurina.
- ⚠ **El quinto criterio sigue PENDIENTE**: falta verificar el nombre en SIPI,
  clases 9 y 35 — y lo mismo para `malcolm`, `capote` y `wayne`. Hasta que eso
  pase, no se compra dominio ni se abren cuentas.
  Verificar antes de enamorarse es justo la lección que costó el cambio.
- Descartados por el camino y por qué: **guiño** (la ñ no sirve para dominio, y
  con ese nombre el isotipo pasa a leerse como un ojo, que encierra el
  catálogo), **tregua** (solemne, supone una guerra), **trasnoche** (encierra
  la marca en la noche), **tranqui** (demasiado informal y poco distintiva),
  **Oculus** (es la marca de VR de Meta, y los visores son clase 9: colisión
  peor que la de Essilor), **solaz** (buena, quedó de tercera).

## Posicionamiento (la tesis del negocio)
Warblue vende el mismo producto genérico con pauta pagada, y su Trustpilot está destruido:
esperas de hasta 2 meses, envíos desde China, soporte que no responde. **La categoría entera
pierde por logística y servicio, no por producto.**

malcolm gana ahí: stock propio en Bogotá, entrega en 2-3 días por Interrapidísimo/Servientrega,
soporte por WhatsApp en español el mismo día. Eso va literal en el hero.
→ Implica **inventario propio, NO dropshipping.** Pedido inicial 50-100 unidades.
Es el único riesgo de capital aprobado del proyecto.

## El modelo 3D
Paramétrico, construido en código; no hay `.glb` que cargar. Se rehízo en
agosto de 2026 contra una referencia nueva del proveedor:

- **Aro panto, casi circular** (razón 1.07), no el rectangular de antes (1.45).
  Se dibuja con cuatro bezier para poder mover cada cuadrante por separado.
- **Acetato traslúcido** en vez de negro opaco, y la traslucidez va por **alfa,
  no por `transmission`**: la transmisión de three.js refracta lo que hay en la
  escena, y aquí la escena está vacía porque el lienzo va en `alpha:true` para
  que se vea la página detrás. Con transmisión sola el acetato salía gris
  plano. Queda un toque de transmisión que no atraviesa: solo enciende los
  cantos, que es de donde sale la lectura de material.
- **Puente de ojo de cerradura**: el acetato baja por el centro y se recorta con
  un semicírculo. Es el detalle que distingue un panto de acetato de una
  montura redonda cualquiera.
- Se fue el **canto claro laminado**: la referencia es una sola pieza.
- ⚠ **El modelo y las fotos de producto ya no coinciden.** Las fotos
  (`ambar.webp`, `rojo.webp`) siguen siendo de la montura rectangular negra.
  Al llegar el pedido real hay que rehacerlas, o el visor y la galería estarán
  mostrando dos productos distintos en la misma ficha.

## Marca
- Nombre: **malcolm** · Wordmark en **minúscula**: `malcolm`
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
  - **La sigla malcolm murió con el nombre viejo.** Los productos son «Ámbar» y
    «Rojo» a secas: la sección ya se llama «Los dos lentes» y una sigla nueva
    («RCR Ámbar») sería inventar un problema que no teníamos.
- **La palabra del recorrido no se queda como logotipo.** Al llegar a la barra
  se apaga y la releva la marca estática. La del recorrido llega ahí por
  `transform: scale()` desde un cuerpo enorme, y un texto escalado se rasteriza
  a un tamaño y se muestra en otro: se veía pastoso al lado del resto de la
  barra. La estática es texto de 26 px de verdad.
- **La barra lleva el conjunto: isotipo + palabra.** En móvil se queda solo el
  isotipo, porque a 26 px con el menú y el carrito a los lados `malcolm` compite
  por un ancho que no tiene. El isotipo va **en línea** en el HTML, no como
  `<img>`, para que herede el color del modo, y a ese tamaño usa el dibujo de
  la **versión reducida** —trazo grueso, punto grande—, que es la regla de los
  dos tamaños ópticos. Hay interruptor en el banco para volver a solo palabra.
- **El wordmark del recorrido no lleva isotipo.** Ahí la palabra llena la
  pantalla y es un gesto tipográfico, no una presentación de logo: un isotipo
  a esa escala sería enorme, y la medida del morfo está calculada sobre la
  tinta de una sola palabra. El conjunto se presenta en la barra, que es donde
  se ve en cada pantalla del sitio.
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
- **Tipografía**: **una sola familia, Epilogue** (SIL OFL, Google Fonts), en todos
  los pesos. Titulares supergrandes, titulares de sección, párrafos, rótulos en
  mayúscula, botones y formularios.
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
  - El **logotipo** va en Epilogue, minúscula: `malcolm`.
  - **Solo el wordmark va en minúscula.** Los titulares de sección van en tipo
    oración. Todo en minúscula leía a manifiesto y le quitaba jerarquía a la
    única palabra que de verdad se escribe así. El texto del recorrido sí
    conserva la minúscula: ahí es voz, no rótulo.
  ⚠ Descartadas por el camino: **Lora** (serif, se probó para los supergrandes —
  con la escena 3D encima, dos caras eran ruido de más), Archivo + Instrument
  Sans, Sora, y Geist. **Supply Mono** es de pago para uso comercial: NO usar.
- Sin gradientes, sin sombras, sin bordes redondeados grandes. Hairlines y bloques planos.
- Favicon / app icon: isotipo malcolm rojo.

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
malcolm/
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
- [ ] Dominio (~$50.000 COP/año). Único gasto fijo aprobado.
      **Criterio: el dominio NO puede nombrar la categoría.** Nada de `lentes`,
      `gafas`, `optica` ni `glasses`. El nombre no nombra la categoría; el catálogo de mañana puede incluir antifaces, tapones
      o luz de escritorio, y un dominio con la categoría adentro lo contradice.
      Solo la marca, o la marca con una palabra de voz (`soy`, `hola`) que
      tampoco nombre producto.
      ⚠ Verificar el nombre en SIPI (clases 9 y 35) ANTES de comprar dominio.
- [ ] Nombre legal / quién factura (persona natural sirve para arrancar con Wompi).

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
- Diseño, UI/UX, branding y copy: chat de Claude (proyecto malcolm).
- Código, git, deploy: Claude Code en la máquina de Mateo.
- Secretos y llaves: nunca en el chat.
