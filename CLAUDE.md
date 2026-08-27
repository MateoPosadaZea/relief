# RELIEF (RLF) — Ecommerce de gafas protectoras

## Qué es esto
Tienda online de gafas con lente protector (sin fórmula) para el mercado colombiano.
Proyecto de Mateo + socio. Proveedor: Alibaba.
Referentes: ROKA (roka.com) para diseño/producto, Warblue (thewarblue.com) para
arquitectura de catálogo — y como advertencia (ver Posicionamiento).

## Catálogo (DEFINIDO)
Público objetivo: gente que trabaja de noche frente a pantallas (teletrabajo, turnos,
gamers, estudiantes). El ángulo de venta es la rutina nocturna completa.

1. **RLF Ámbar** — lente naranja/amarillo. Para las horas de trabajo nocturno frente
   a pantalla. Filtra parte de la luz azul manteniendo visibilidad y color utilizable.
2. **RLF Rojo** — lente rojo. Para la última hora antes de dormir. Filtra azul y verde
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
- **Modo oscuro por defecto.** La marca vive de noche; el cliente navega de noche.
- **Todo lo inmersivo es una capa encima, nunca un requisito.** El 3D se carga solo
  si el navegador puede; sin WebGL, sin JS o con el módulo caído, la página vende
  igual. Nada de la compra depende de la escena.

## La historia (estructura de la home)
La home es un recorrido de una noche, con el modelo 3D fijo detrás y los paneles
pasando por encima. El lente del modelo va de ámbar a rojo según el scroll: el
arco visual *es* el arco del catálogo.

| Panel | Qué dice |
|---|---|
| Hero | Wordmark + "Trabajas de noche. Tus ojos también." |
| 11:47 PM | El problema, sin prometer nada: llevas seis horas y te faltan dos. |
| Somos RELIEF | Dos lentes, uno para trabajar, uno para parar. Nada más. |
| 12:30 AM | El ámbar: el del turno. |
| 2:10 AM | El rojo: el del final. |
| Mañana, 9:00 AM | Sale de Bogotá, no de Shenzhen. La tesis del negocio. |

- El reloj no es decoración: encierra la noche del cliente y aterriza en la entrega,
  que es la única ventaja competitiva real.
- **El copy describe el problema, nunca promete la cura.** "Llevas seis horas frente
  a la pantalla" es seguro y pega más fuerte que cualquier claim de salud.

## Posicionamiento (la tesis del negocio)
Warblue vende el mismo producto genérico con pauta pagada, y su Trustpilot está destruido:
esperas de hasta 2 meses, envíos desde China, soporte que no responde. **La categoría entera
pierde por logística y servicio, no por producto.**

RELIEF gana ahí: stock propio en Bogotá, entrega en 2-3 días por Interrapidísimo/Servientrega,
soporte por WhatsApp en español el mismo día. Eso va literal en el hero.
→ Implica **inventario propio, NO dropshipping.** Pedido inicial 50-100 unidades.
Es el único riesgo de capital aprobado del proyecto.

## Marca
- Nombre: **RELIEF** · Sigla/isotipo: **RLF** (cuadro rojo redondeado, sigla en blanco)
- **Los lentes SON la paleta.** No hay colores de marca aparte del producto.
  Ámbar = trabajo. Rojo = dormir. Nada más.

| Token | Hex | Uso |
|---|---|---|
| Noche | `#0B0B0C` | Fondo del sitio |
| Superficie | `#16161A` | Tarjetas, secciones |
| Hueso | `#EDEBE6` | Texto principal (NO blanco puro) |
| Ámbar | `#F2A93B` | Lente de trabajo, acentos diurnos |
| Rojo RLF | `#D91F26` | Logo, lente nocturno, botón comprar |
| Línea | `#26262B` | Divisores hairline |
| Texto tenue | `#8A8A90` | Secundario |

- ⚠ El rojo `#D91F26` es aproximado del JPEG. **Confirmar el hex exacto del SVG/AI del logo.**
- **Tipografía**: Geist Mono (display, títulos, precios, nav — mayúsculas con tracking abierto,
  pesos 200 y 500) + Geist Sans (body). Ambas SIL OFL, gratis para comercial, Google Fonts.
  Alternativa con más carácter: Martian Mono.
  ⚠ Supply Mono (Pangram Pangram) fue el referente visual pero es **de pago** para uso
  comercial. NO usar.
- Sin gradientes, sin sombras, sin bordes redondeados grandes. Hairlines y bloques planos.
- Favicon / app icon: isotipo RLF rojo.

### Modos de visualización
El catálogo son dos lentes; el sitio son los mismos dos modos. **El producto se
demuestra a sí mismo** — no es un toggle de preferencias, es una vitrina.

| Modo | Qué es | Fondo |
|---|---|---|
| **Noche** | Por defecto. Tokens exactos de la tabla de arriba. | `#0B0B0C` |
| **Día** | Para quien entra a las 2pm. Fondo hueso, nunca blanco puro. | `#EDEBE6` |
| **Trabajo** | Aproximación del lente ámbar: azules fuera, todo cálido. | `#100C07` |
| **Descanso** | Aproximación del lente rojo: la página baja de intensidad. | `#0D0708` |

- Se implementan como `:root[data-modo="..."]` redefiniendo los mismos siete
  tokens. Ninguna regla CSS conoce un hex.
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
- ⚠ El copy de los modos es **descriptivo, nunca clínico**. "Aproximación visual
  de cada lente", jamás "reduce la fatiga" ni "te ayuda a dormir".

## Arquitectura Fase 1
```
relief/
├── index.html      # landing + historia + producto + carrito (todo en uno)
├── assets/
│   ├── img/        # fotos de producto y de marca (webp)
│   └── js/
│       ├── gafas.js            # modelo 3D paramétrico, carga diferida
│       └── vendor/three.*.js   # three.js vendorizado, sin CDN
├── CLAUDE.md
└── deploy.sh       # git add . && git commit && git push (Pages publica solo)
```

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

## Pedidos (Fase 1)
- Sin base de datos. El comprobante de Wompi + un formulario de datos de envío.
- Datos de envío: Google Form o mensaje de WhatsApp pre-llenado con el pedido
  (wa.me con texto armado desde el carrito). Decidir cuál — WhatsApp es menos fricción
  y es como compra Colombia.
- Confirmación y seguimiento por WhatsApp. Envíos: Servientrega / Interrapidísimo.

## PENDIENTE (no bloquea el scaffold — usar placeholders)
- [ ] Hex exacto del rojo, desde el SVG/AI del logo.
- [ ] Nombres finales de los dos lentes (propuesta: Turno / Apagado, o dejar Ámbar / Rojo).
- [ ] Cotización del proveedor: precio unitario por volumen y MOQ.
- [ ] Precio de venta y costo landed (producto + flete + arancel + IVA).
- [ ] Reporte de transmitancia espectral del proveedor (habilita o no las claims técnicas).
- [ ] Fotos de producto (`ambar.webp`, `rojo.webp`, `combo.webp`) y de marca
      (`hero.webp`, `trabajo.webp`, `dormir.webp`, `og.png`). Los slots ya
      existen: soltar el archivo en `assets/img/` lo activa. Ojo: fondo negro
      exige fotos recortadas o de fondo limpio.
- [ ] Dominio (~$50.000 COP/año). Único gasto fijo aprobado.
- [ ] Nombre legal / quién factura (persona natural sirve para arrancar con Wompi).

## Reseñas y estudios (reglas duras)
- **Cero reseñas inventadas.** Testimonios falsos son sanción directa bajo el
  Estatuto del Consumidor (Ley 1480). La sección existe vacía y dice que estamos
  empezando, hasta que haya clientes reales que hayan recibido el pedido.
- **Cero estudios citados sin leer el estudio.** Si algún día se citan, se cita la
  fuente completa y jamás se traduce a una promesa ("dormirás mejor").
- La sección **"Lo que no vamos a decirte"** convierte esa restricción en
  posicionamiento: Warblue publica 84/97/99% sin respaldo; nosotros decimos por qué
  no publicamos nada todavía. La honestidad es el diferenciador, no un costo.

## Descartado
- Shopify, WooCommerce, Tiendanube o cualquier plataforma con mensualidad.
- React/Next.js en Fase 1.
- Pasarelas distintas de Wompi (no fragmentar).
- Multi-producto o categorías antes de validar el primero.
- Dropshipping desde China (mata la única ventaja competitiva real).
- Supply Mono y cualquier tipografía de pago.
- Publicar porcentajes de bloqueo sin certificado propio.

## División de trabajo
- Diseño, UI/UX, branding y copy: chat de Claude (proyecto RELIEF).
- Código, git, deploy: Claude Code en la máquina de Mateo.
- Secretos y llaves: nunca en el chat.
