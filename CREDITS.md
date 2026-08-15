# Créditos y licencias de contenido

Este archivo registra las fuentes aprobadas para LinguaForge. **Ningún activo entra en producción sin una licencia y una URL de origen verificables.** El proyecto no usa material propietario ni dumps de plataformas cerradas.

| Fuente | Uso previsto | Licencia/condición verificada | Estado |
|---|---|---|---|
| [Tatoeba](https://tatoeba.org/en/terms_of_use) | Frases y traducciones textuales | Las frases textuales usan por defecto CC BY 2.0 France; exige atribución. El audio puede tener licencias distintas. | Aprobada para texto con licencia individual; audio pendiente de revisión |
| [Kaikki/Wiktextract](https://kaikki.org/dictionary/rawdata.html) | Datos léxicos extraídos de Wiktionary | Requiere conservar la procedencia de Wiktionary, la edición/dump y la licencia aplicable a cada tipo de dato. | Aprobada para lotes acotados tras validación; no descargar dumps completos en el MVP |
| [Mozilla Common Voice](https://commonvoice.mozilla.org/en/datasets) | Audio de pronunciación | Los datasets publicados en el catálogo consultado aparecen con licencia CC0-1.0; el tamaño y el locale deben registrarse. | Aprobada para lotes limitados y versionados; no almacenar audio masivo en el repositorio |
| [Project Gutenberg](https://www.gutenberg.org/policy/permission.html) | Textos clásicos para ejemplos de lectura | El dominio público depende de la jurisdicción; algunas obras siguen protegidas y la marca Project Gutenberg tiene condiciones propias. | Solo con comprobación de dominio público por obra y jurisdicción |
| [LibreLingo](https://github.com/kantord/LibreLingo) | Referencia de formatos y cursos comunitarios | El software es AGPLv3; cada curso/material creativo puede tener una licencia distinta. | Solo reutilizar cursos tras revisión individual; el código no se copia automáticamente |

## Reglas de importación

Cada lote debe incluir fuente, URL, licencia, versión o fecha de extracción, idioma, transformación aplicada y revisor. Las entradas sin licencia clara se rechazan. Las atribuciones deben aparecer en la documentación pública y permanecer asociadas a los registros importados. La publicación comercial futura no cambia estas obligaciones: una donación o suscripción no autoriza a reutilizar material incompatible.

## Estado actual

El 15 de agosto de 2026 se importó y validó un lote piloto de cinco entradas Tatoeba en español→inglés y cinco registros derivados en inglés→español. Ambas rutas están en versión de contenido `0.2.0`, con licencia `CC BY 2.0 FR`, URLs individuales, autoría y atribución conservadas. La transformación inversa solo intercambia los campos direccionales del mismo registro licenciado; no añade contenido propietario. El lote queda deliberadamente por debajo del umbral productivo de 1000 entradas por par y se muestra como cobertura piloto.

La arquitectura y el formato de importación están preparados, pero todavía no se ha cargado un lote masivo. El siguiente paso seguro es un lote pequeño de texto Tatoeba y/o léxico Wiktionary con procedencia completa, seguido de validación lingüística y revisión de duplicados. El audio queda separado hasta confirmar licencia y coste de almacenamiento.
