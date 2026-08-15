# Plan maestro y mapa funcional de LinguaForge

## Objetivo de producto

LinguaForge será una aplicación web de aprendizaje progresivo y personalizado para que un usuario seleccione un idioma nativo, añada uno o varios idiomas objetivo y avance desde A1 hasta C2 mediante lecciones breves, práctica interactiva, flashcards SRS y seguimiento visible del progreso. Las rutas serán bidireccionales entre cualquier par del catálogo de diez idiomas.

## Catálogo lingüístico inicial

| Código | Idioma | Nombre visible | Escritura principal |
|---|---|---|---|
| es | Español | Español | Latina |
| en | Inglés | English | Latina |
| zh | Mandarín | 中文 / 普通话 | Han |
| hi | Hindi | हिन्दी | Devanagari |
| ar | Árabe | العربية | Árabe |
| pt | Portugués | Português | Latina |
| bn | Bengalí | বাংলা | Bengalí |
| ru | Ruso | Русский | Cirílica |
| ja | Japonés | 日本語 | Kanji/kana |
| fr | Francés | Français | Latina |

## Mapa de navegación

### Entrada y configuración

`/` presenta la propuesta de aprendizaje, el catálogo de idiomas y las acciones para comenzar sesión o iniciar una ruta. `/onboarding` permite seleccionar idioma nativo e idiomas objetivo. `/diagnostic/:targetLanguage` ejecuta la evaluación inicial para un idioma objetivo y `/diagnostic/:targetLanguage/result` muestra el nivel recomendado por destreza y la ruta sugerida.

### Área autenticada

`/app` muestra el panel principal con la racha diaria, XP, lecciones completadas y tarjetas pendientes. `/app/languages` administra los idiomas objetivo. `/app/languages/:targetLanguage` muestra el mapa de niveles A1–C2 y el avance del idioma seleccionado. `/app/lesson/:lessonId` contiene una lección y sus ejercicios. `/app/practice` ofrece práctica libre aleatoria con filtros de idioma y nivel. `/app/review` presenta la cola SRS. `/app/profile` permite editar nombre, idioma nativo e idiomas objetivo.

### Estructura de una ruta de aprendizaje

Cada idioma objetivo se descompone en seis niveles MCER. Cada nivel contiene módulos temáticos; cada módulo se divide en vocabulario, gramática, pronunciación y conversación. Cada lección mezcla actividades de completar frases, relacionar elementos, traducción y opción múltiple. La ruta se desbloquea por avance del usuario, pero la práctica libre puede seleccionar cualquier contenido permitido por los filtros.

## Widgets y componentes principales

| Widget | Propósito | Datos que consume | Estados obligatorios |
|---|---|---|---|
| Selector de idioma | Cambiar origen y destino | Idiomas y rutas | Vacío, selección, error |
| Diagnóstico | Medir el nivel inicial | Ítems, respuestas, resultados | Inicio, progreso, respuesta, resultado |
| Mapa MCER | Visualizar A1–C2 | Niveles, progreso | Bloqueado, activo, completado |
| Tarjeta de lección | Iniciar o continuar | Lección, porcentaje | Disponible, en curso, completada |
| Ejercicio interactivo | Resolver una actividad | Tipo, prompt, opciones | Sin responder, correcto, incorrecto |
| SRS Review Card | Recordar vocabulario | Tarjeta, intervalo, calificación | Nueva, pendiente, revisada |
| Resumen de progreso | Mostrar racha, XP y lecciones | Métricas del usuario | Cargando, datos, vacío |
| Filtros de práctica | Acotar contenido aleatorio | Idioma, nivel, temática | Aplicado, reiniciado |
| Perfil de idiomas | Configurar preferencias | Perfil y objetivos | Edición, guardado, error |
| Tema visual | Cambiar claro/oscuro | Preferencia local/usuario | Claro, oscuro, sistema |

## Plan de implementación por entregas

La primera entrega construirá el armazón completo de la experiencia: inicio, configuración, panel, catálogo de idiomas, mapa de niveles, diagnóstico, lecciones y práctica libre con datos estructurados. A continuación se integrarán el modelo de progreso y el SRS persistente. La última etapa de esta iteración se dedicará a validación visual, responsive, accesibilidad, pruebas automatizadas y documentación open source.

No se incorporarán mensajería, gamificación social, pagos, marketplace, videollamadas, tutor humano ni funcionalidades administrativas que no formen parte del alcance aprobado.
