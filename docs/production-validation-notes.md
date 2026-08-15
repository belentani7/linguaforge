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
