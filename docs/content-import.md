# Importación de contenido lingüístico

El banco de contenido de LinguaForge se cargará por pares direccionales y no como una lista global de traducciones. Cada registro debe conservar `sourceText`, `targetText`, `exampleSource`, `exampleTarget`, `topic`, `levelCode`, `pronunciation` opcional, `license` y `sourceUrl`. El importador debe rechazar filas sin fuente o licencia, códigos de idioma no admitidos, niveles fuera de A1–C2 y duplicados dentro del mismo par.

La unidad de publicación será una versión de contenido asociada a `languagePaths.contentVersion`. Cada lote debe incluir un manifiesto con número de entradas por nivel, temática, autoría, licencia y URL de origen. La meta de producción es superar 1000 entradas por par direccional, pero no se debe rellenar el banco con traducciones generadas sin revisión humana ni con contenido cuya licencia no permita redistribución.

## Formato recomendado

```json
{
  "sourceCode": "pt",
  "targetCode": "es",
  "levelCode": "A1",
  "topic": "vida cotidiana",
  "sourceText": "bom dia",
  "targetText": "buenos días",
  "exampleSource": "Bom dia, Ana.",
  "exampleTarget": "Buenos días, Ana.",
  "license": "CC BY 4.0",
  "sourceUrl": "https://example.org/source"
}
```

Antes de insertar un lote, el equipo debe ejecutar validaciones de esquema, duplicados, atribución y revisión lingüística nativa. El contenido se insertará mediante migraciones o una herramienta de importación versionada; nunca se almacenarán archivos de corpus sin trazabilidad dentro de `client/public`.

## Fuente oficial y estrategia de ampliación — 15 de agosto de 2026

La ampliación prioritaria seguirá los descargas y exportaciones de [Tatoeba](https://tatoeba.org/en/downloads), cuyo texto se publica por defecto bajo **CC BY 2.0 FR** y cuya documentación recomienda atribución, filtrado de frases problemáticas, revisión humana y actualizaciones periódicas [1] [2]. La licencia del texto no se extiende automáticamente a los archivos de audio: cada grabación debe conservar la licencia específica declarada por su contribuyente [1] [2].

Para pares direccionales, la guía oficial del API v1 documenta filtros como `lang=`, `trans:lang=`, `showtrans:lang=`, `is_native=yes`, `is_unapproved=no`, `is_orphan=no`, `word_count` y enlaces de paginación [3]. La automatización de producción debe usar la exportación oficial o un contrato API confirmado, conservar identificadores y autores, filtrar duplicados y material no apto, y pasar revisión lingüística antes de publicar. No se debe marcar la meta de 1000 entradas como cumplida hasta disponer de lotes reales validados por par, nivel y temática.

En esta sesión, las consultas experimentales al endpoint público devolvieron HTTP 400 incluso después de aplicar los parámetros de la guía; por tanto, no se importaron datos nuevos ni se generaron frases de sustitución. El siguiente paso seguro es confirmar el formato actual mediante la descarga oficial o un endpoint verificado y añadir un manifiesto por lote antes de persistirlo.

### Referencias

[1]: https://en.wiki.tatoeba.org/articles/show/using-the-tatoeba-corpus "Using the Tatoeba Corpus for Your Own Projects"
[2]: https://tatoeba.org/en/downloads "Tatoeba Downloads"
[3]: https://en.wiki.tatoeba.org/articles/show/api-migration-v1 "Migration guide from API v0 to API v1"

## Cobertura del validador

`pnpm content:validate` ahora informa `counts`, `levelCounts` y `topicCounts`, además de licencia, duplicados y pares bajo el umbral. Los tres lotes piloto actuales validan cinco entradas cada uno: `es→en|A1|vida cotidiana`, `en→es|A1|vida cotidiana` y `pt→en|A1|vida cotidiana`, todos con **CC BY 2.0 FR**. El modo `--pilot` conserva el umbral de 1000 como señal de cobertura insuficiente y no convierte estos lotes en cobertura de producción.

## Unificación de lotes

Se añadió `scripts/merge-content-batches.mjs`, que combina varios JSONL, rechaza conflictos de procedencia para una misma identidad lingüística, elimina duplicados exactos y genera un manifest con entradas, pares, niveles, temáticas y licencias. La prueba con los tres lotes actuales produjo 15 entradas, distribuidas entre `es→en` (5), `en→es` (5) y `pt→en` (5), todas A1 y de vida cotidiana bajo CC BY 2.0 FR. Este resultado es infraestructura de importación; no satisface la meta de 1000 entradas por par.

## Fuente oficial para expansión masiva

La fuente prioritaria para ampliar el banco será la página oficial de [descargas de Tatoeba](https://tatoeba.org/en/downloads). Esta página ofrece exportaciones personalizadas de pares de frases y exportaciones semanales; describe los campos de las frases como `id`, idioma ISO 639-3 y texto, y publica los textos bajo **CC BY 2.0 FR**, con una parte adicional bajo CC0 1.0. La guía oficial de [uso del corpus](https://en.wiki.tatoeba.org/articles/show/using-the-tatoeba-corpus) recomienda filtrar frases que requieran corrección, que no sean naturales, que estén rechazadas, que sean demasiado largas o que tengan etiquetas de contenido inadecuado; también recomienda priorizar frases revisadas. El [documento de términos de uso](https://tatoeba.org/en/terms_of_use) deja claro que la reutilización y la selección siguen siendo responsabilidad del proyecto.

El alcance textual no se extiende automáticamente al audio. Tatoeba indica que la licencia de cada archivo de audio depende del contribuyente y debe verificarse individualmente; por eso LinguaForge continuará excluyendo audio de la importación textual hasta disponer de licencia y consentimiento verificables. La descarga masiva queda preparada técnicamente mediante el normalizador, el validador y el unificador, pero no se ejecuta todavía sobre un export grande ni se marca como cumplida la meta de 1000 entradas por par.

### Referencias

[1]: https://tatoeba.org/en/downloads "Tatoeba — Downloads"
[2]: https://en.wiki.tatoeba.org/articles/show/using-the-tatoeba-corpus "Tatoeba — Using the Corpus for Your Own Projects"
[3]: https://tatoeba.org/en/terms_of_use "Tatoeba — Terms of Use"

## Manifiesto de cobertura objetivo

`content/coverage-targets.json` define la expansión completa para los diez idiomas soportados: 90 pares bidireccionales, seis niveles CEFR y cinco temas, con un mínimo objetivo de 1000 entradas por par. `pnpm content:targets:verify` confirma `languages: 10`, `pairs: 90`, `perPairMinimum: 1000`, seis niveles, cinco temas y `failures: []`. Es un manifiesto de planificación y no una afirmación de que las 90 rutas ya tengan contenido; el estado real continúa siendo el de los tres pilotos documentados.

## Comprobación del export oficial masivo

El 15 de agosto de 2026 se verificaron las cabeceras oficiales de `sentences.tar.bz2` y `links.tar.bz2` en `downloads.tatoeba.org`. Los tamaños observados fueron aproximadamente **217.9 MB** y **149.2 MB**, respectivamente. La descarga temporal iniciada para evaluar la tasa del entorno fue cancelada después de avanzar lentamente y el archivo parcial fue eliminado; no se procesó ni importó ningún dato incompleto. La importación masiva permanece bloqueada hasta disponer de una descarga completa controlada o de los archivos oficiales entregados por el propietario. Esta decisión evita presentar un subconjunto accidental como cobertura de producción.

El export oficial `sentences_CC0.tar.bz2` está publicado en `https://downloads.tatoeba.org/exports/sentences_CC0.tar.bz2`. Su disponibilidad no elimina por sí sola el gate: para obtener pares traducidos se necesitan también relaciones completas de `links`, validación de idioma/dirección, deduplicación, asignación pedagógica y atribución. No se importará un archivo parcial ni se afirmará cobertura de producción hasta completar ese proceso.
