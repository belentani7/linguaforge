# Linguaforge 8-Week Expansion Roadmap

**Objetivo:** Máxima funcionalidad + recursos 100% gratis

## Overview

```
Week 1-2: Content Bulk Import (Tatoeba, Wiktionary, Forvo metadata)
Week 3-4: AI Tutor Local (Ollama, grammar feedback)
Week 5-6: Speech Features (Whisper.cpp, Bark TTS)
Week 7-8: Gamification + Community
```

---

## Week 1-2: Content Explosion 📚

### Tatoeba Bulk Import
- ✅ Script: `bulk-tatoeba-importer.mjs` (creado)
- **Entradas objetivo:** 1000+ por par de idiomas, A1-C2
- **Pares:** es-en, en-es, pt-en, en-pt, fr-en, de-en, zh-en (+ variantes)
- **Validación:** Deduplicación, verificación de licencias CC BY 2.0 FR
- **Time:** 3-4 horas (scripts corren async)

### Wiktionary Dictionary
- ✅ Script: `wiktionary-definitions-ingester.mjs` (creado)
- **Palabras objetivo:** Top 500 por idioma
- **Incluye:** Definiciones, pronunciación IPA, ejemplos
- **Fuentes:** MediaWiki API + FrequencyWords lists (MIT)
- **Time:** 2 horas

### Audio Metadata
- ✅ Script: `forvo-audio-metadata.mjs` (creado)
- **Enfoque:** Links a Forvo + YouTube channels educativos
- **Ventaja:** Sin hosting de audio (usuario decide descargar)
- **Escalable:** Prepare para Bark TTS más tarde
- **Time:** 1 hora

### Database Load
- ✅ Script: `bulk-load-vocabulary.mjs` (creado)
- **Inserción:** Via Drizzle ORM + MySQL batch
- **Deduplicación:** Detecta y salta duplicados
- **Validación:** Integridad referencial (pathId, levelId)
- **Time:** 1 hora

**Week 1-2 Deliverable:** 10,000+ vocabulary entries, 6 idiomas, A1-C2

---

## Week 3-4: AI Tutor (Local, Offline) 🤖

### Ollama Integration
```typescript
// server/tutoring.ts
import { Ollama } from "ollama";

const tutor = new Ollama({ model: "mistral:latest" }); // 7B local

// Grammar feedback flow:
// User answer → Extract language → Prompt engineering → Feedback
```

**Features:**
- [ ] Grammar correction (vs. translation)
- [ ] Conjugation examples
- [ ] Pronunciation hints (IPA)
- [ ] Contextual explanations

**Model:** `mistral:latest` (7B, ~4GB RAM, free)
**Alternative:** `neural-chat` (9B, slightly better teaching)

**Deployment:**
- Local dev: `ollama run mistral`
- Docker: `docker run -d -p 11434:11434 ollama:latest`
- Cloud (free tier): Railway.app + Ollama container

### Tutor Router (tRPC)
```typescript
// server/_core/trpc.ts - add router
export const tutorRouter = t.router({
  feedback: t.procedure
    .input(z.object({ userAnswer: z.string(), lesson: z.string() }))
    .query(async ({ input, ctx }) => {
      return await tutor.generateResponse(input);
    }),
});
```

**Week 3-4 Deliverable:** Working tutor endpoint, 0 infrastructure costs

---

## Week 5-6: Speech Recognition & TTS 🎤

### Whisper.cpp (Speech-to-Text)
```typescript
// client/src/hooks/useWhisperRecognition.ts
import { WhisperCpp } from "whisper-cpp-js";

const recognizer = new WhisperCpp({
  model: "tiny", // English-only, 75MB
  // OR "base" for multilingual, 140MB
});

const transcript = await recognizer.transcribe(audioBlob);
```

**Setup:**
1. Download model: `wget https://huggingface.co/...tiny.bin`
2. Include in client bundle (gzipped, lazy-loaded)
3. Process audio locally (no upload)

**Privacy:** 100% client-side, no external API

### Bark TTS (Text-to-Speech)
```typescript
// Alternative: local synthesis via Bark
import { Bark } from "bark-js";

const bark = new Bark();
const audioBuffer = await bark.synthesize(
  text,
  "v2/en_speaker_0" // Multiple speaker voices
);
```

**Models:** 100MB each, self-hosted on Railway/Render free tier

**Or** use free Coqui TTS API if available.

### UI Integration
- [ ] Record button (lesson exercise)
- [ ] Playback native speaker sample (toggle)
- [ ] User can record & compare
- [ ] Accent scoring (via Ollama embeddings)

**Week 5-6 Deliverable:** Speech I/O in lessons

---

## Week 7-8: Gamification + Community 🏆

### Leaderboards (Ephemeral)
```typescript
// Redis free tier (Render, Supabase)
// Or PostgreSQL + Drizzle

export const leaderboardRouter = t.router({
  getWeekly: t.procedure
    .input(z.object({ languageCode: z.string() }))
    .query(({ input }) => {
      return db.query
        .from(userLanguages)
        .where(/* week filter + language */)
        .orderBy(desc(userLanguages.xp))
        .limit(100);
    }),
});
```

### Challenges
- **Translation Sprint:** Fastest to 10 correct translations
- **Pronunciation:** Record & match native speaker clarity
- **Streak:** Consecutive days (existing, expand)
- **Language Pairs:** Bonus XP for bidirectional learning

### Community Content
```typescript
// Moderated user submissions
export const communityRouter = t.router({
  submitExample: t.procedure
    .input(z.object({
      sourceText: z.string(),
      targetText: z.string(),
      languageCode: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Queue for review
      await db.insert(communitySubmissions).values({
        ...input,
        userId: ctx.user.id,
        status: "pending",
      });
    }),
});
```

### Achievements
- "Polyglot" (learn 3+ languages)
- "Streak Master" (30+ day streak)
- "Fluency Sprint" (reach B2 in 90 days)
- "Grammar Gamer" (95%+ accuracy)

**Week 7-8 Deliverable:** Full gamification + community backbone

---

## Tech Stack (100% Free)

| Layer | Tool | Cost | Notes |
|-------|------|------|-------|
| **Frontend** | React 19 + Tailwind | $0 | Existing |
| **Backend** | Express + tRPC | $0 | Existing |
| **Database** | Supabase PostgreSQL | $0 | 500MB free tier |
| **Storage** | Cloudinary | $0 | 1GB free, transformations |
| **Hosting (frontend)** | Vercel / Netlify | $0 | 100GB/month |
| **Hosting (backend)** | Railway / Render | $0 | 500 hours/month free |
| **LLM (tutor)** | Ollama (local) | $0 | Self-hosted |
| **Speech-to-Text** | Whisper.cpp | $0 | Offline, local |
| **Text-to-Speech** | Bark / Coqui | $0 | Self-hosted or free API |
| **Cache** | Redis Cloud | $0 | 30MB free tier |
| **Analytics** | Plausible (self-hosted) | $0 | On-premise option |
| **Monitoring** | Sentry free tier | $0 | 5k events/month |

**Total monthly cost:** $0 ✅

---

## Development Setup

### Prerequisites
```bash
pnpm install
export DATABASE_URL="postgresql://..."
export OLLAMA_HOST="http://localhost:11434"

# Download models (one-time)
ollama pull mistral
curl -L https://huggingface.co/.../whisper.tiny.bin -o models/whisper-tiny.bin
```

### Run all import scripts
```bash
pnpm import:full
# Generates 10k+ vocabulary entries in ~30 min
```

### Start dev stack
```bash
# Terminal 1
ollama serve

# Terminal 2
pnpm dev

# Frontend: http://localhost:5173
# API: http://localhost:3000
```

---

## Success Metrics

| Metric | Target | Current | Owner |
|--------|--------|---------|-------|
| Vocabulary entries | 10,000+ | ~100 | @belentani7 |
| Language pairs | 20+ | 3 | Import scripts |
| CEFR levels | 6 (A1-C2) | 1 (A1) | Content expansion |
| Tutor latency | <2s | N/A | Ollama tuning |
| Speech accuracy | 90%+ | N/A | Whisper model |
| Uptime | 99.9% | 95% | Infrastructure |
| Cost per user | $0 | $0 | 🎉 |

---

## Known Challenges & Mitigations

| Challenge | Mitigation |
|-----------|-----------|
| Wiktionary API rate limits | Use local dump + offline processing |
| Whisper model size (75MB+) | Lazy-load, gzip, differential download |
| Ollama memory usage | Quantized models (q4, q5 instead of full) |
| Audio storage (Bark TTS) | Generate on-demand, cache with long TTL |
| Moderation (community content) | Require 3+ reviewer votes before publish |
| Database scale (10k+ entries) | Indexing on pathId + levelId, pagination |

---

## Post-Week 8 (Stretch Goals)

- [ ] YouTube subtitle extraction (automated)
- [ ] Anki deck export (interop)
- [ ] Mobile app (React Native)
- [ ] Browser extension (dictionary hover)
- [ ] Open-source dataset export (CC0, for research)

---

## How to Track Progress

```bash
# Weekly check-in
pnpm test
pnpm accessibility:verify
pnpm quality:check

# Monitor imports
tail -f logs/import-$(date +%Y-%m-%d).log

# Database stats
sqlite3 < scripts/content-stats.sql
```

---

**Author:** Pedro Belentani (@belentani7)
**Updated:** 2026-08-26
**Next Review:** Week 2 (2026-09-09)
