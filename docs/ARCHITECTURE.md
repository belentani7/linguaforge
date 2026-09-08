# Arquitectura de Maos Abertas + LinguaForge

## Propósito y principio de diseño

**Maos Abertas + LinguaForge** es una institución digital de aprendizaje abierto que conecta idiomas, alfabetización digital, programación y uso responsable de inteligencia artificial. Su diseño no replica dos productos separados: ofrece un único recorrido que parte de un objetivo práctico, propone una ruta CEFR y conserva el contexto de idioma, nivel y actividad en toda la experiencia.

El Marco Común Europeo de Referencia organiza la competencia lingüística en seis niveles, de **A1 a C2**, mediante descriptores de desempeño. La plataforma usa esos niveles para orientar objetivos, no para emitir certificaciones ni sustituir evaluaciones oficiales.[1]

| Capa | Responsabilidad | Decisión inicial |
|---|---|---|
| Experiencia pública | Presentar misión, programas, catálogo de idiomas y accesos. | React con rutas explícitas y contenido traducible sin duplicación de pantallas. |
| Dominio curricular | Definir idiomas, niveles CEFR, programas, módulos, lecciones y objetivos. | Catálogo versionado en `shared/institution.ts`; el contenido ampliable puede migrarse a tablas con procedencia. |
| Cuenta y progreso | Guardar preferencias, diagnóstico, lecciones completas y próximos pasos. | Procedimientos tRPC protegidos con esquema Drizzle y mínimos datos personales. |
| Tutor IA | Adaptar explicaciones, práctica y correcciones al idioma, nivel y objetivo. | Llamada exclusivamente desde el servidor, alcance educativo acotado y límite diario. |
| Práctica oral | Capturar una respuesta voluntaria, transcribirla y compararla con el objetivo de la lección. | Grabación local en el navegador, subida temporal controlada y transcripción por servidor. |

## Modelo de internacionalización

La institución distingue tres conceptos: el **idioma de la interfaz**, el **idioma de apoyo** y el **idioma de estudio**. El catálogo integra 39 idiomas. La interfaz conserva diccionarios por claves y selecciona una traducción disponible; cuando no exista, utiliza español como respaldo visible. Por ello, añadir una nueva localización no exige bifurcar componentes ni rutas.

Los códigos de idioma se almacenan como BCP 47 o ISO de uso práctico y se emplean con `Intl` para el formato dependiente de la configuración regional. La API `Intl` está concebida precisamente para operaciones sensibles a idioma y cultura, como nombres de idioma, pluralización y formato.[2]

| Ámbito | Valor inicial | Persistencia |
|---|---|---|
| Interfaz | Español, inglés o portugués; respaldo español para los demás idiomas del catálogo. | Perfil del estudiante y `localStorage` para la elección pública. |
| Apoyo | Idioma preferido del estudiante. | Perfil protegido. |
| Estudio | Uno de los 39 idiomas, seleccionado desde el catálogo. | Perfil protegido. |
| Dirección | LTR por defecto; RTL preparado para árabe y urdu. | Metadato del catálogo. |

## Datos, privacidad y límites de IA

La cuenta solo conserva preferencias pedagógicas, progreso y una auditoría mínima de uso del tutor. El contenido de las conversaciones no se almacena como perfil. Para la práctica oral, la persona decide cuándo activar el micrófono; no se solicita acceso hasta esa acción, se valida tamaño y tipo, y la grabación se procesa para devolver una transcripción. `getUserMedia()` requiere un contexto seguro y permiso explícito de la persona usuaria.[3]

El tutor no declara niveles oficiales, no ofrece asesoramiento jurídico, sanitario o financiero personalizado, no solicita datos sensibles y recuerda que sus respuestas requieren verificación. La práctica oral entrega una comparación pedagógica, no una evaluación biométrica ni un diagnóstico de pronunciación clínica.

## Referencias

[1]: https://www.coe.int/en/web/common-european-framework-reference-languages/level-descriptions "Council of Europe — The CEFR Levels"
[2]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Internationalization "MDN — Internationalization"
[3]: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia "MDN — MediaDevices.getUserMedia()"
