# Linguaforge Bulk Import Guide

Guía para importar masivamente contenido de fuentes gratis: Tatoeba, Wiktionary, Forvo y YouTube.

## Fases

### FASE 1: Tatoeba (oraciones traducidas)

**Tatoeba** proporciona millones de oraciones traducidas bajo licencia CC BY 2.0 FR.

```bash
# 1. Descargar y procesar lotes de Tatoeba
pnpm run scripts:bulk:tatoeba

# Genera archivos como:
# content/tatoeba-es-en-A1.jsonl
# content/tatoeba-es-en-A2.jsonl
# content/tatoeba-pt-en-B1.jsonl
# etc.
```

**Formato JSONL:**
```json
{
  "sourceCode": "es",
  "targetCode": "en",
  "levelCode": "A1",
  "topic": "vida cotidiana",
  "sourceText": "Bueno.",
  "targetText": "Good.",
  "exampleSource": "Bueno.",
  "exampleTarget": "Good.",
  "license": "CC BY 2.0 FR",
  "sourceUrl": "https://tatoeba.org/en/sentences/show/4656445",
  "author": "CandyFloss",
  "attribution": "Tatoeba sentence 4656445 by CandyFloss",
  "importedAt": "2026-08-26"
}
```

### FASE 2: Wiktionary (definiciones)

**Wiktionary** proporciona diccionarios multilingües bajo licencia CC BY-SA.

```bash
# Descargar definiciones de palabras comunes
pnpm run scripts:dict:wiktionary

# Genera:
# content/dictionary-en-bulk.jsonl
# content/dictionary-es-bulk.jsonl
# content/dictionary-pt-bulk.jsonl
# etc.
```

**Formato JSONL:**
```json
{
  "word": "hello",
  "language": "en",
  "definitions": [
    "used as a greeting or to begin a conversation"
  ],
  "exampleSentences": [],
  "pronunciation": null,
  "partOfSpeech": null,
  "url": "https://en.wiktionary.org/wiki/hello",
  "source": "wiktionary",
  "importedAt": "2026-08-26"
}
```

### FASE 3: Audio Metadata (Forvo + YouTube)

**Forvo** proporciona pronunciación de hablantes nativos (manual opt-in).
**YouTube** subtítulos abiertos para conversación auténtica.

```bash
# Generar metadatos de audio
pnpm run scripts:audio:metadata

# Genera:
# content/audio-metadata-es.jsonl
# content/audio-metadata-en.jsonl
# etc.
```

Cada entrada incluye:
- Enlace a búsqueda en Forvo (usuario decide descargar)
- Canales educativos de YouTube por nivel

### FASE 4: Cargar en Base de Datos

```bash
# Después de generar todos los JSONL, cargar en MySQL:
DATABASE_URL="mysql://user:pass@host:3306/linguaforge" \
pnpm run scripts:load:vocabulary

# Carga:
# ✓ Tatoeba batches
# ✓ Diccionarios Wiktionary
# ✓ Metadatos de audio
```

## Requisitos

```json
{
  "devDependencies": {
    "mysql2": "^3.x",
    "drizzle-orm": "^0.x"
  }
}
```

## Configuración

### Variables de entorno

```bash
# .env.local (nunca commitear)
DATABASE_URL=mysql://user:pass@localhost:3306/linguaforge
FORVO_API_KEY=optional_key  # Si tienes acceso a API de Forvo
YOUTUBE_API_KEY=optional_key # Si usas YouTube Data API
```

### Lenguajes soportados

| Código | Idioma |
|--------|--------|
| en | English |
| es | Spanish |
| pt | Portuguese |
| fr | French |
| de | German |
| zh | Chinese (Simplified) |
| hi | Hindi |
| ar | Arabic |
| ru | Russian |
| ja | Japanese |

## Cronograma recomendado

```
Semana 1: Tatoeba A1-A2 para pares principales (es-en, pt-en)
Semana 2: Tatoeba B1-B2, agregar otros idiomas
Semana 3: Wiktionary para todos los idiomas
Semana 4: Audio metadata + YouTube channel mapping
Semana 5: Verificación de cobertura, deduplicación
Semana 6: Tests de búsqueda y recomendación
Semana 7-8: Optimización, caché, benchmarks
```

## Validación

Cada script incluye validadores:

```bash
# Validar estructura JSONL
pnpm run validate:content content/tatoeba-es-en-*.jsonl

# Validar cobertura (% de palabras por nivel)
pnpm run validate:coverage

# Auditar licencias
pnpm run audit:licenses
```

## Fuentes gratis verificadas

| Fuente | Licencia | Formato | Actualizaciones |
|--------|----------|---------|-----------------|
| Tatoeba | CC BY 2.0 FR | API JSON | Semanal |
| Wiktionary | CC BY-SA 4.0 | MediaWiki | Continua |
| Forvo | CC BY (speaker) | Audio MP3 | Diaria |
| YouTube Subtitles | Varía | VTT | Diaria |
| FrequencyWords | MIT | TXT | Anual |

## Próximos pasos (Fase 2+)

- [ ] Ollama local: tutor IA (grammar feedback)
- [ ] Whisper.cpp: speech recognition (opt-in)
- [ ] Bark TTS: síntesis de voz
- [ ] Sentence Transformers: recomendación semántica
- [ ] Elasticsearch: búsqueda full-text

## Troubleshooting

**"Languages not found: es, en"**
- Asegúrate de que `languages` está poblada en la DB
- Run: `pnpm db:seed` (si existe script de seed)

**"Duplicate entry errors"**
- Normal. Script detecta duplicados y los salta
- Usa `--skip-duplicates` para acelerar

**"Rate limit hit"**
- Tatoeba permite ~1 req/sec
- Scripts respetan esto automáticamente
- Puedes aumentar `--timeout` si es necesario

## Contribuir contenido nuevo

Ver [CONTRIBUTING.md](../CONTRIBUTING.md) para procedimiento de verificación.
