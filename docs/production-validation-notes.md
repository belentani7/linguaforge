# Notas de validación pública

- Dominio probado: https://linguaforg-8tplbmkn.manus.space
- El navegador obtiene el título `LinguaForge · Aprende idiomas con intención`.
- Tras dos comprobaciones, el viewport permanece en blanco y solo aparece el sello `Made with Manus`.
- No se observan el saludo, la navegación ni el dashboard.
- Estado: **fallo público pendiente de diagnóstico**; no declarar readiness ni cerrar validación de producción hasta revisar consola, red y logs publicados.
- La pantalla blanca puede deberse a un error de bundle/runtime, una carga incompleta o una diferencia entre el checkpoint publicado y el estado local; no se debe asumir la causa sin evidencia adicional.

## Comparación de build

La build local actual genera `assets/index-BxnaMDpB.js`, `assets/react-vendor-nTeWVWBt.js` y `assets/react-dom-vendor-O5B7ern2.js`. El dominio publicado cargó `assets/index-GvJtJVEq.js`, `assets/react-vendor-Bhq73eqw.js` y `assets/react-dom-vendor-BU73qf9Y.js`, mientras que el CSS coincide (`index-iXGY96Rb.css`). Esta diferencia confirma que el dominio no está sirviendo exactamente la build local actual; la publicación debe repetirse desde un checkpoint actual y verificarse por hashes antes de modificar la aplicación.

## Comprobación posterior al checkpoint eafe4cb4

Tras guardar el checkpoint de diagnóstico, se recargó `https://linguaforg-8tplbmkn.manus.space`. El dominio sigue mostrando el título correcto, pero el `#root` continúa sin interfaz visible y solo aparece el sello `Made with Manus`. El problema de publicación permanece abierto; no se marca como corregido.

## Verificación del checkpoint a739d97d

La recarga posterior a `a739d97d` no llegó al dominio público: el HTML sigue cargando `assets/index-GvJtJVEq.js`, el `#root` permanece vacío y la lista de scripts no contiene el marcador `data-lingua-forge-boot` del nuevo HTML. Por tanto, el dominio está congelado en una publicación anterior y todavía no es posible validar la corrección desde la URL pública.

## Publicación del checkpoint dd3c24f0

Después de que el usuario republicó, el dominio ya muestra el fallback `LinguaForge no pudo cargar`; esto confirma que el HTML actualizado sí llegó a producción. La interfaz React todavía no monta. La consola del navegador continúa sin salida visible, así que el fallo ocurre durante la evaluación temprana del bundle o en un módulo importado antes de `createRoot().render`.

## Captura de error de arranque

La recarga instrumentada confirma `data-boot-error="script-error"`, no `empty-root` ni `promise-rejection`. Esto demuestra que se dispara un error de script durante la carga/evaluación de la build pública. La consola accesible mediante la sesión automatizada no conserva el mensaje del error de módulo; el siguiente diagnóstico debe comparar dependencias/chunks y revisar imports que solo fallen en la build publicada.

## Evidencia pública automatizada — 2026-08-18

La URL `https://linguaforg-8tplbmkn.manus.space/` sigue mostrando `LinguaForge no pudo cargar`. La inspección del DOM confirma un módulo propio `https://linguaforg-8tplbmkn.manus.space/assets/index-BzEgZ_KU.js` con HTTP 200, MIME JavaScript y 77.812 bytes. El HTML también contiene JSON-LD, fallback de arranque, Umami, el editor de Manus y Plausible. Las cargas fallidas de `spaceEditor-DPV-_I11.js` y Plausible son recursos externos separados; el módulo propio responde, pero React no monta. La build local actual genera `index-BnzX9U43.js` de aproximadamente 142.86 kB, por lo que la publicación pública sigue sin coincidir con el artefacto local actual o está sirviendo un entrypoint distinto. No se declara resuelto.
