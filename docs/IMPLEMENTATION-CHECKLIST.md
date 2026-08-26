# Linguaforge Bulk Import Implementation Checklist

## ✅ Phase 1: Content Bulk Import (Week 1-2)

### Infrastructure Setup
- [ ] Verify `DATABASE_URL` env var configured
- [ ] Test MySQL connection: `pnpm db:push`
- [ ] Create `logs/` directory for import logs
- [ ] Backup existing vocabulary (if any)

### Tatoeba Import
- [ ] Run: `pnpm scripts:bulk:tatoeba`
- [ ] Wait ~20 minutes (rate-limited to 1 req/sec)
- [ ] Verify files in `content/tatoeba-*.jsonl`
- [ ] Check counts: `wc -l content/tatoeba-*.jsonl | tail -1`
- [ ] Expected: ~1000 lines per file (language pair + level)

### Wiktionary Dictionary Import
- [ ] Run: `pnpm scripts:dict:wiktionary`
- [ ] Wait ~10 minutes (hits public word lists + API)
- [ ] Verify files: `ls -lh content/dictionary-*.jsonl`
- [ ] Sample check: `head -5 content/dictionary-en-bulk.jsonl`

### Audio Metadata
- [ ] Run: `pnpm scripts:audio:metadata`
- [ ] Verify: `cat content/audio-metadata-manifest.json` (human-readable)
- [ ] Check Forvo links are clickable (manual spot-check)

### Database Load
- [ ] Set `DATABASE_URL` if not already set
- [ ] Run: `DATABASE_URL="mysql://..." pnpm scripts:load:vocabulary`
- [ ] Watch for progress (updates every 50 entries)
- [ ] Expected output: "✅ Bulk load complete. Total: 10,000+ entries loaded"
- [ ] Verify in DB: `SELECT COUNT(*) FROM vocabularyEntries;`

### Validation
- [ ] Run: `pnpm content:validate`
- [ ] All checks pass ✅
- [ ] Run: `pnpm content:targets:verify`
- [ ] Coverage looks good (≥500 words per level per language pair)

---

## 🤖 Phase 2: AI Tutor Setup (Week 3-4)

### Ollama Installation
**macOS/Linux:**
```bash
# Download from https://ollama.ai
# Or via Homebrew (Mac)
brew install ollama

# Start server
ollama serve

# In another terminal, pull model
ollama pull mistral
```

**Docker (Any OS):**
```bash
docker run -d \
  --name ollama \
  -p 11434:11434 \
  ollama/ollama

docker exec ollama ollama pull mistral
```

**Cloud (Railway.app free tier):**
- [ ] Create Railway account (free $5/month)
- [ ] Deploy template: `railway/ollama`
- [ ] Get `OLLAMA_HOST` URL
- [ ] Update `.env`: `OLLAMA_HOST=https://yourapp.railway.app`

### Tutor Router Implementation
- [ ] Copy/paste tutor integration into `server/_core/trpc.ts`
- [ ] Create `server/tutor.ts` handler
- [ ] Test endpoint: `curl http://localhost:3000/trpc/tutor.feedback?input=...`
- [ ] Add UI component: `client/src/components/TutorChat.tsx`

### Testing
- [ ] Run: `pnpm test`
- [ ] All tests pass, especially `server/learning.test.ts`
- [ ] Tutor latency: should be <2s per response
- [ ] Memory usage: Ollama should use <4GB

---

## 🎤 Phase 3: Speech (Week 5-6)

### Whisper.cpp Setup
**Local (development):**
```bash
# Clone repo
git clone https://github.com/ggerganov/whisper.cpp
cd whisper.cpp
make

# Download model
bash ./models/download-ggml-model.sh tiny

# Test
./main -m ./models/ggml-tiny.bin -f test.wav
```

**Browser (production):**
- [ ] Download model: `models/ggml-tiny.bin` (75MB)
- [ ] Gzip: `gzip models/ggml-tiny.bin`
- [ ] Upload to Cloudinary (free tier)
- [ ] Add to `client/public/models/` with lazy-load
- [ ] Create hook: `client/src/hooks/useWhisper.ts`

### TTS Setup (Bark alternative)
**Option A: Bark (self-hosted)**
```bash
# Docker
docker run -d -p 5000:5000 gitmylo/bark

# Test
curl -X POST http://localhost:5000/api/tts \
  -d '{"text": "Hello"}' \
  -H "Content-Type: application/json"
```

**Option B: Coqui TTS (lightweight)**
```bash
pip install TTS
tts --text "Hello" --model_name tts_models/en/ljspeech/glow-tts
```

- [ ] Deploy to Railway/Render free tier (Docker)
- [ ] Update `BARK_API` env var
- [ ] Create `client/src/hooks/useTTS.ts`

### Speech UI Integration
- [ ] Add "Record" button to lesson exercises
- [ ] Wire Whisper recognition
- [ ] Show transcript + score
- [ ] Add "Play pronunciation" (native speaker sample)
- [ ] Add "Play your recording" (playback)

### Testing
- [ ] Record & transcribe test audio
- [ ] Verify accuracy ≥80%
- [ ] Check playback latency
- [ ] Test on mobile (microphone permissions)

---

## 🏆 Phase 4: Gamification (Week 7-8)

### Leaderboards Database Schema
- [ ] Add to Drizzle schema (if not already):
  ```sql
  CREATE TABLE leaderboardSnapshots (
    id INT PRIMARY KEY AUTO_INCREMENT,
    languageCode VARCHAR(8),
    weekStart DATE,
    userId INT,
    rank INT,
    xp INT,
    UNIQUE(languageCode, weekStart, userId)
  );
  ```
- [ ] Run migration: `pnpm db:push`

### Leaderboard Router
- [ ] Implement tRPC endpoint: `leaderboard.getWeekly`
- [ ] Implement tRPC endpoint: `leaderboard.getMonthly`
- [ ] Add caching (Redis or memory cache)
- [ ] Update every night (cron job)

### Challenges
- [ ] Database table: `userChallenges`
- [ ] Schema: id, userId, type (translation_sprint, streak, etc), status, reward
- [ ] Implement 4 challenge types (see ROADMAP)
- [ ] UI: Challenge cards on dashboard

### Achievements
- [ ] Database table: `userAchievements`
- [ ] Implement 5 badge types
- [ ] Award when conditions met (automatic trigger)
- [ ] Display on profile

### Community Submissions
- [ ] Table: `communitySubmissions` (text, sourceLanguage, targetLanguage, userId, status)
- [ ] Router: `community.submitExample`
- [ ] Moderation dashboard (admin-only)
- [ ] Queue system (3-vote approval)

### Testing
- [ ] Create mock users + complete lessons
- [ ] Verify leaderboard ranking
- [ ] Trigger achievements manually
- [ ] Test moderation flow

---

## 🔍 Quality Assurance

### Accessibility
- [ ] Run: `pnpm accessibility:verify`
- [ ] All keyboard navigation works
- [ ] ARIA labels present
- [ ] Color contrast verified

### Performance
- [ ] Lighthouse score ≥90
- [ ] Core Web Vitals: all green
- [ ] Bundle size: <500KB (gzipped)

### Security
- [ ] SQL injection tests (Drizzle parameterized)
- [ ] XSS prevention (React escaping)
- [ ] CSRF tokens (if forms present)
- [ ] Env vars never in client code

### Content Quality
- [ ] Spot-check 20 Tatoeba entries (translations look correct)
- [ ] Spot-check 10 Wiktionary definitions
- [ ] Verify license attribution visible
- [ ] Check for duplicates: none expected

---

## 📊 Metrics Collection

### Week-by-Week Tracking

**Week 1 (Tatoeba):**
- [ ] Total entries loaded: ______
- [ ] Language pairs: ______
- [ ] Levels covered: ______
- [ ] Avg. entries/pair: ______

**Week 2 (Wiktionary + Audio):**
- [ ] Dictionary entries: ______
- [ ] Audio metadata links: ______
- [ ] Unique languages: ______

**Week 3-4 (Tutor):**
- [ ] Tutor response latency (avg): ______ms
- [ ] Accuracy of corrections: ______ %
- [ ] User tests (if available): ______

**Week 5-6 (Speech):**
- [ ] Whisper accuracy: ______ %
- [ ] TTS quality rating (1-5): ______
- [ ] Mobile compat: YES / NO

**Week 7-8 (Gamification):**
- [ ] Leaderboard users: ______
- [ ] Challenges attempted: ______
- [ ] Community submissions: ______
- [ ] Approval rate: ______ %

---

## 🚨 Common Issues & Fixes

### "Languages not found: es, en"
```bash
# Seed languages table
mysql -u root < scripts/seed-languages.sql
# OR insert manually:
INSERT INTO languages (code, iso639_2, name, nativeName, script, isActive)
VALUES ('en', 'eng', 'English', 'English', 'Latin', 1);
```

### "Rate limit hit from Tatoeba"
- Already handled! Scripts wait 1 sec between requests
- If still hitting limits, increase `--timeout` flag

### "Database connection refused"
```bash
# Check MySQL running
mysql -u root -p -e "SELECT 1;"

# Or via Docker
docker run --name mysql -e MYSQL_ROOT_PASSWORD=root -d mysql
export DATABASE_URL="mysql://root:root@localhost:3306/linguaforge"
```

### "Ollama model too large"
```bash
# Use smaller model
ollama pull neural-chat  # Faster, smaller
# OR use quantized version
ollama pull mistral:q4_K_M  # Quantized 4-bit
```

### "Whisper.cpp compilation fails"
```bash
# macOS: need build tools
xcode-select --install

# Linux: install gcc
sudo apt-get install build-essential
```

---

## ✅ Final Checklist

### Pre-Launch
- [ ] All scripts tested locally
- [ ] Database backup taken
- [ ] Environment variables secured (.env.local not committed)
- [ ] Git branch created for feature
- [ ] All tests passing (`pnpm quality:check`)

### Deployment
- [ ] Frontend deployed (Vercel/Netlify)
- [ ] Backend deployed (Railway/Render)
- [ ] Database migrated
- [ ] Ollama service running
- [ ] Whisper model preloaded
- [ ] CDN caching configured

### Post-Launch
- [ ] Monitor error logs (first 24h)
- [ ] Check database growth (shouldn't spike unexpectedly)
- [ ] Verify leaderboards updating nightly
- [ ] Collect user feedback
- [ ] Document lessons learned

---

**Ready?** Start with ✅ Phase 1 above. Then let's go! 🚀
