# Matriz de QA visual y responsive

## Evidencia disponible

La página principal se capturó en escritorio de 1280×720 y móvil de 390×844 después de conectar catálogo, progreso, módulos, perfil y SRS. Ambas capturas muestran el dashboard sin pantalla de error y con navegación responsive; la vista móvil mantiene la acción primaria, métricas y mapa de progreso dentro del viewport.

La captura de escritorio confirma la jerarquía de resumen, progreso y siguiente lección. La captura móvil confirma el ajuste de la navegación horizontal, las métricas en dos columnas y la legibilidad de los controles principales. Los auditores estáticos cubren también contratos de dashboard, idiomas, práctica, repaso y perfil.

## Matriz de recorridos pendientes

| Vista | Escritorio | Móvil | Claro | Oscuro | Recorrido manual pendiente |
|---|---:|---:|---:|---:|---|
| Dashboard | Verificado | Verificado | Verificado | Pendiente | Tab completo y foco tras cambiar idioma |
| Idiomas | Verificado (`/languages`, 1280×720) | Verificado (`/languages`, 375×812) | Verificado | Pendiente | Revisar manualmente apertura del diagnóstico y cambio de origen/destino |
| Práctica | Verificado (`/practice`, 1280×720) | Verificado (`/practice`, 375×812) | Verificado | Verificado (`/qa-dark/practice`, 1280×720 y 375×812) | Recorrer los cuatro tipos con contenido importado |
| Repaso SRS | Verificado (`/review`, 1280×720) | Verificado (`/review`, 375×812) | Verificado | Verificado (`/qa-dark/review`, 1280×720 y 375×812) | Revelar tarjeta y valorar cuando exista una tarjeta persistida |
| Perfil | Verificado (`/profile`, 1280×720) | Verificado (`/profile`, 375×812) | Verificado | Verificado (`/qa-dark/profile`, 1280×720 y 375×812) | Editar nombre, idioma nativo y varios objetivos |
| Lección | Verificado (`/lesson`, 1280×720) | Verificado (`/lesson`, 375×812) | Verificado | Verificado (`/qa-dark/lesson`, 1280×720 y 375×812) | Completar lección y revisar progreso persistido |
| Ejercicio | Verificado (`/exercise`, 1280×720) | Verificado (`/exercise`, 375×812) | Verificado | Verificado (`/qa-dark/exercise`, 1280×720 y 375×812) | Recorrer fill_blank, matching, translation y multiple_choice con la cola persistida |

La vista de idiomas dispone ahora de una ruta reproducible (`/languages`) y fue capturada en escritorio de 1280×720 y móvil de 375×812. Las capturas muestran las diez tarjetas del catálogo, el selector de origen/destino y el contador real de entradas; el lote español→inglés permanece con cinco entradas y las demás rutas muestran estado vacío sin simular cobertura. La prueba visual confirma que las tarjetas se apilan en móvil y que la llamada a diagnóstico sigue visible.

La auditoría oscura inicial mostró texto casi invisible en títulos y contenido porque `.app-shell` no heredaba `var(--foreground)` y varias tarjetas conservaban fondos claros hardcodeados. Se corrigieron ambas causas y se repitieron las capturas desktop/móvil; ahora el contraste visual es legible y los estados vacíos se mantienen honestos.

La matriz distingue evidencia visual real de contratos estáticos. Las celdas pendientes requieren recorridos interactivos en el preview o en el sitio publicado; no se sustituyen por afirmaciones basadas únicamente en código.

La captura desktop actualizada posterior a la eliminación de fallbacks muestra el estado real `CONTENIDO PENDIENTE` en la tarjeta “Para hoy” cuando la base no tiene módulos/lecciones importados. Esto confirma que el dashboard ya no simula una lección recomendada. La evidencia sigue limitada al dashboard; las vistas secundarias y el modo oscuro requieren recorridos específicos.

La captura móvil de 390×844 posterior a la conexión de progreso y estados vacíos conserva el encabezado, navegación horizontal, CTA principal, métricas en cuadrícula y mapa de progreso dentro del viewport. Las capturas nuevas de `/lesson`, `/exercise` y `/review-session` en 375×812 confirman que la lección y el ejercicio real derivados de Tatoeba se adaptan al móvil y que la cola SRS vacía se comunica sin métricas inventadas. El modo oscuro y la activación por teclado siguen requiriendo recorrido manual específico.

## Ruta reproducible portuguesa→inglés — 15 de agosto de 2026

`/qa/pt-en` monta `initialNative="pt"` y `initialTarget="en"`. La consulta `learning.modules` filtra por idioma origen y destino, evitando mezclar módulos de otra ruta. La captura de escritorio muestra `English` como objetivo, nivel A1 y la lección persistida **Perguntas e reações básicas** del lote Tatoeba portugués→inglés. TypeScript, Vitest y `audit-interactions` pasan después del cambio. La ruta se mantiene como herramienta QA; no altera las preferencias persistidas del usuario.

## Cierre claro/oscuro de dashboard e idiomas — 15 de agosto de 2026

Se añadieron `/qa-dark/dashboard` y `/qa-dark/languages` para inspeccionar ambas vistas sin depender del control de tema. Las capturas de escritorio muestran contraste legible en shell, navegación, tarjetas, selectores y CTA. En `/qa-dark/languages` se corrigió además el estado inicial de `diagnosticStep`: el diálogo permanece cerrado al entrar y solo se abre mediante `Hacer diagnóstico`. La auditoría ampliada de foco cubre estas rutas junto con `/qa/pt-en` y `/404`; los recorridos pendientes de interacción sobre el sitio publicado siguen diferenciados de esta evidencia de preview.
