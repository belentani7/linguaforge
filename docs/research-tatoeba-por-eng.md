# Investigación de fuente: Tatoeba portugués→inglés

Fecha de consulta: 15 de agosto de 2026.

## Fuentes oficiales

- [Using the Tatoeba Corpus for Your Own Projects](https://en.wiki.tatoeba.org/articles/show/using-the-tatoeba-corpus): el texto de las frases usa por defecto **CC BY 2.0 FR**; exige citar al autor. La página recomienda filtrar frases no aprobadas, revisar naturalidad y considerar etiquetas/calidad. También advierte que las licencias de audio son distintas y deben verificarse individualmente.
- [Tatoeba Terms of Use](https://tatoeba.org/en/terms_of_use): Tatoeba es una asociación sin ánimo de lucro; el reutilizador es responsable de sus contribuciones y reutilizaciones, y el contenido puede contener errores o material problemático. La atribución y la revisión humana siguen siendo necesarias.
- [Tatoeba API](https://api.tatoeba.org/): API pública de solo lectura; el OpenAPI está disponible en [https://api.tatoeba.org/openapi.json](https://api.tatoeba.org/openapi.json).

## Consulta y selección

Se consultó `https://api.tatoeba.org/v1/sentences` con `lang=por`, `limit=50`, `sort=words` y `showtrans=all`. El normalizador local seleccionó solo frases portuguesas no desaprobadas con licencia `CC BY 2.0 FR` y una traducción inglesa directa, no desaprobada y con la misma licencia. Se excluyeron registros vacíos o excesivamente largos. El resultado es un lote piloto A1 de cinco registros, no una afirmación de cobertura curricular completa.

IDs seleccionados: **13977761, 13977758, 13977756, 13977746 y 13977744**. El lote normalizado queda en `content/tatoeba-por-eng-a1.jsonl`, con `sourceUrl`, autor, licencia, atribución, fecha de importación y texto de origen/destino por registro. Antes de persistirlo deben ejecutarse `pnpm content:validate -- ...` o el comando equivalente del validador actual y una revisión humana de adecuación A1; no se importan audios automáticamente.
