# Matriz de QA visual y responsive

## Evidencia disponible

La página principal se capturó en escritorio de 1280×720 y móvil de 390×844 después de conectar catálogo, progreso, módulos, perfil y SRS. Ambas capturas muestran el dashboard sin pantalla de error y con navegación responsive; la vista móvil mantiene la acción primaria, métricas y mapa de progreso dentro del viewport.

La captura de escritorio confirma la jerarquía de resumen, progreso y siguiente lección. La captura móvil confirma el ajuste de la navegación horizontal, las métricas en dos columnas y la legibilidad de los controles principales. Los auditores estáticos cubren también contratos de dashboard, idiomas, práctica, repaso y perfil.

## Matriz de recorridos pendientes

| Vista | Escritorio | Móvil | Claro | Oscuro | Recorrido manual pendiente |
|---|---:|---:|---:|---:|---|
| Dashboard | Verificado | Verificado | Verificado | Pendiente | Tab completo y foco tras cambiar idioma |
| Idiomas | Verificado (`/languages`, 1280×720) | Verificado (`/languages`, 375×812) | Verificado | Pendiente | Revisar manualmente apertura del diagnóstico y cambio de origen/destino |
| Práctica | Pendiente | Pendiente | Parcial | Pendiente | Probar los cuatro tipos con contenido importado |
| Repaso SRS | Pendiente | Pendiente | Parcial | Pendiente | Revelar tarjeta, valorar y comprobar cola |
| Perfil | Pendiente | Pendiente | Parcial | Pendiente | Editar nombre, idioma nativo y varios objetivos |
| Lección | Pendiente | Pendiente | Parcial | Pendiente | Completar lección y revisar progreso |
| Ejercicio | Pendiente | Pendiente | Parcial | Pendiente | Texto, matching, traducción y selección |

La vista de idiomas dispone ahora de una ruta reproducible (`/languages`) y fue capturada en escritorio de 1280×720 y móvil de 375×812. Las capturas muestran las diez tarjetas del catálogo, el selector de origen/destino y el contador real de entradas; el lote español→inglés permanece con cinco entradas y las demás rutas muestran estado vacío sin simular cobertura. La prueba visual confirma que las tarjetas se apilan en móvil y que la llamada a diagnóstico sigue visible.

La matriz distingue evidencia visual real de contratos estáticos. Las celdas pendientes requieren recorridos interactivos en el preview o en el sitio publicado; no se sustituyen por afirmaciones basadas únicamente en código.

La captura desktop actualizada posterior a la eliminación de fallbacks muestra el estado real `CONTENIDO PENDIENTE` en la tarjeta “Para hoy” cuando la base no tiene módulos/lecciones importados. Esto confirma que el dashboard ya no simula una lección recomendada. La evidencia sigue limitada al dashboard; las vistas secundarias y el modo oscuro requieren recorridos específicos.

La captura móvil de 390×844 posterior a la conexión de progreso y estados vacíos conserva el encabezado, navegación horizontal, CTA principal, métricas en cuadrícula y mapa de progreso dentro del viewport. No se observan desbordamientos en la zona capturada. Esta evidencia no cubre todavía los estados interactivos de lección, ejercicio, repaso, perfil ni modo oscuro.
