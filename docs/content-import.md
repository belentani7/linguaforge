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
