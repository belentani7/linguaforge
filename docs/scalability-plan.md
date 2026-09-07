# Plan masivo de escalabilidad de LinguaForge

## Principio rector

La escala se consigue separando **contenido verificable**, **motor de aprendizaje**, **artefactos multimedia revisados** y **operación**. El producto no debe generar ni publicar cursos en masa a partir de un modelo sin revisar. La plataforma ya modela rutas ordenadas, módulos, lecciones, ejercicios, SRS y progreso; la ampliación debe usar ese modelo, no crear diez aplicaciones distintas por idioma.

## Arquitectura de contenido

| Capa               | Contrato                                                                          | Escala prevista                                  | Control obligatorio                                              |
| ------------------ | --------------------------------------------------------------------------------- | ------------------------------------------------ | ---------------------------------------------------------------- |
| Fuente             | Dataset o contenido editorial con URL, versión, licencia, atribución y hash       | Varias fuentes por idioma                        | Rechazar fuente o artefacto con licencia ambigua                 |
| Normalización      | Dirección `origen → destino`, texto, ejemplos, tema, nivel, contexto, procedencia | Lotes pequeños y reproducibles                   | Validación de idioma, duplicados, caracteres, enlaces y licencia |
| Revisión editorial | Objetivo pedagógico, dificultad, explicación y distractores                       | Revisión por muestreo y cola de incidencias      | Ningún lote pasa a publicado sin estado aprobado                 |
| Curso              | Nivel → módulo → lección → ejercicio                                              | Diez idiomas, 90 direcciones y seis niveles CEFR | Manifiesto de cobertura por ruta, nivel y tema                   |
| Aprendizaje        | Progreso, SRS, diagnóstico, feedback y búsqueda                                   | Datos por usuario, aislados por autorización     | Pruebas de acceso, paginación, límites de consulta y migraciones |

## Plan de materiales A0–C2

El mapa curricular es la fuente de verdad conceptual. Cada paquete de curso debe contener objetivos observables, competencias, pre-requisitos, ejercicios, respuestas y explicaciones. A0 permanece como onboarding interno pre-A1. Los niveles A1–C2 se organizan en módulos de vocabulario, gramática, pronunciación, comprensión, conversación y escritura cuando existan datos y evaluación apropiados.

| Artefacto             | Estado                                           | Próximo paso seguro                                                                     |
| --------------------- | ------------------------------------------------ | --------------------------------------------------------------------------------------- |
| Vocabulario y frases  | Pilotos trazables y pipeline preparado           | Ingerir lotes completos con frases y enlaces; no solo un corpus de oraciones aisladas   |
| Traducciones          | Rutas y modelo disponibles                       | Requerir par validado, fuente URL y licencia por ítem                                   |
| Ejercicios            | Cuatro tipos funcionales                         | Añadir nuevos tipos solo junto con contrato de respuesta, explicación, teclado y prueba |
| Lectura y escucha     | Arquitectura definida, sin material publicado    | Añadir texto/audio solo tras licencia, metadatos y revisión humana                      |
| Pronunciación y habla | Plan de evaluación definido, sin modelo activado | Piloto opt-in de transcripción o TTS fuera del runtime público                          |
| Vídeo e imagen        | Política y almacenamiento con metadatos          | Producción editorial offline; no generar artefactos en cada visita                      |

## Asistente IA educativo

El asistente debe ser un servicio de servidor con alcance limitado: explicar un concepto con base en una lección existente, proponer práctica adicional marcada como borrador, ayudar a interpretar feedback y reconocer límites. No puede afirmar certificación, inventar fuentes, diagnosticar, publicar contenido, enviar correo, operar pagos ni cambiar el perfil sin acción explícita del usuario.

El primer modo recomendado usa un modelo económico y se activa solo para solicitudes manuales. Cada llamada debe guardar la tarea, idioma, longitud, resultado, coste estimado, fecha, versión de modelo y un botón de feedback. La interfaz debe indicar que el asistente puede equivocarse y remitir al contenido con procedencia cuando exista.

La primera implementación usa el modelo `gpt-5-mini`, confirmado en el catálogo disponible el 22 de agosto de 2026, en una mutación protegida de servidor. La solicitud admite hasta 800 caracteres, limita la salida a 700 tokens y mantiene una cuota de 12 consultas diarias por usuario mediante `aiCoachRequests`. El registro conserva usuario, idioma, tarea, longitud, modelo y fecha, pero no el texto de la pregunta ni la respuesta. El asistente solo permite explicar, proponer práctica marcada como borrador o revisar una respuesta aportada; no puede enviar, publicar, pagar, modificar perfiles ni presentarse como autoridad pedagógica.

## Voz, imagen y vídeo

La web conserva salida textual por defecto. Voz, imágenes y vídeo se elaboran en lotes editoriales con una ficha de procedencia: herramienta/modelo, versión, licencia de código y pesos, prompt, dataset cuando aplique, autoría, consentimiento, hash, fecha y estado de revisión. Los modelos pesados no entran en el bundle ni se ejecutan por visita. El primer piloto de voz se limita a frases cortas y evaluadas por revisores competentes del idioma.

## Rendimiento y coste

El frontend debe seguir entregando rutas y contenido sin depender de IA o multimedia. La búsqueda y las listas se paginan; la importación se procesa por lotes; los archivos van a almacenamiento de objetos y el servidor conserva solo metadatos. El bundle React actual justifica evaluar carga diferida de vistas secundarias antes de añadir más dependencias. El coste de IA se controla por cuota, límite de entrada, caché de resultados aprobados y fallback textual.

## Hoja de ruta de transformación de diez horas de ingeniería

Esta secuencia es una planificación estimada, no una garantía de completar material editorial masivo o revisión legal en diez horas.

| Bloque | Entregable verificable                                    | Dependencia                                 |
| ------ | --------------------------------------------------------- | ------------------------------------------- |
| 1      | Auditoría, criterios y riesgos                            | Completado en documentación                 |
| 2      | Manifiesto curricular y cobertura por ruta                | Dataset validado                            |
| 3      | Asistente IA acotado con contrato, límites y tests        | Catálogo de modelos y presupuesto           |
| 4      | Mejoras de búsqueda, feedback y explicaciones             | Datos existentes                            |
| 5      | Importador versionado y reportes de calidad               | Corpus con frases y enlaces                 |
| 6      | Piloto de audio/voz offline con manifiesto                | Licencias, consentimiento y revisión humana |
| 7      | División de bundle, límites de consultas y observabilidad | Medición de uso                             |
| 8      | QA accesible, privacidad y revisión de seguridad          | Entorno de prueba y revisión externa        |
| 9      | ZIP portable, README, changelog y GitHub                  | Checkpoint estable                          |
| 10     | Validación publicada, rollback y entrega Drive            | Cuenta Drive y publicación correcta         |

## Criterio de salida

LinguaForge podrá presentarse como una plataforma open source sólida cuando el repositorio, ZIP, documentación, pruebas, rutas públicas y contenido piloto estén verificables. Para afirmar que todos los cursos, todas las traducciones y toda la multimedia están listos se necesitarán los artefactos completos, los manifiestos de cobertura, la revisión editorial y la operación estable descritos en este plan.
