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
