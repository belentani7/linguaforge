'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, Sparkles, AlertCircle, Play } from 'lucide-react';
import { useIaStore, type VoiceMode } from '@/store/iaStore';
import { useT } from '@/hooks/useLocale';
import { LOCALES, type Locale } from '@/content/types';
import { SPEECH_LANG, LOCALE_NAMES } from '@/lib/i18n';
import { RealtimeTutorSession } from '@/lib/voice/realtime';
import {
  canUseBrowserVoice,
  getRecognitionCtor,
  speak,
  stopSpeaking,
  type SpeechRecognitionLike,
} from '@/lib/voice/speech';
import { streamTutor } from '@/lib/tutor/client-stream';
import { usePrefsStore } from '@/store/prefsStore';
import { cn } from '@/lib/utils';

type Language = Locale;

interface VoiceTutorPanelProps {
  currentLessonId: string;
  defaultLang?: Language;
  /** Audio pregrabado con voz humana (introducción de la lección), por idioma. */
  introSrcs?: Partial<Record<Locale, string>>;
  /** Texto de introducción para la síntesis del navegador si no hay audio pregrabado. */
  introText?: Partial<Record<Locale, string>>;
}

/** Barras de la onda con alturas deterministas: sin Math.random en el render. */
const BAR_HEIGHTS = [28, 44, 20, 58, 36, 62, 24, 48, 30, 54, 22, 40];

export const VoiceTutorPanel = ({ currentLessonId, defaultLang = 'es', introSrcs, introText }: VoiceTutorPanelProps) => {
  const { t } = useT();
  const [language, setLanguage] = useState<Language>(defaultLang);
  const [connecting, setConnecting] = useState(false);
  const [active, setActive] = useState(false);
  const [userText, setUserText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<VoiceMode>('browser');
  const [introPlaying, setIntroPlaying] = useState(false);

  const voiceStatus = useIaStore((s) => s.voiceStatus);
  const setVoiceStatus = useIaStore((s) => s.setVoiceStatus);
  const lastVoiceText = useIaStore((s) => s.lastVoiceText);
  const setLastVoiceText = useIaStore((s) => s.setLastVoiceText);
  const setVoiceMode = useIaStore((s) => s.setVoiceMode);

  const realtimeRef = useRef<RealtimeTutorSession | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const activeRef = useRef(false);
  const introRef = useRef<HTMLAudioElement | null>(null);
  const codeLocale = usePrefsStore((s) => s.codeLocale);

  // Detiene todo al desmontar el panel (cambio de lección, navegación).
  useEffect(() => {
    return () => {
      activeRef.current = false;
      void realtimeRef.current?.stop();
      recognitionRef.current?.abort();
      stopSpeaking();
      introRef.current?.pause();
    };
  }, []);

  async function stopSession() {
    activeRef.current = false;
    setActive(false);
    setConnecting(false);
    await realtimeRef.current?.stop();
    realtimeRef.current = null;
    recognitionRef.current?.abort();
    recognitionRef.current = null;
    stopSpeaking();
    setVoiceStatus('idle');
  }

  /** Respuesta del tutor en modo navegador: streaming de texto y lectura en voz alta. */
  async function answerInBrowserMode(question: string) {
    setVoiceStatus('speaking');
    let reply: string;
    try {
      reply = await streamTutor(
        {
          lessonId: currentLessonId,
          messages: [{ role: 'user', content: question }],
          chatLocale: language,
          theoryLocale: language,
          codeLocale,
        },
        (delta) => setLastVoiceText(useIaStore.getState().lastVoiceText + delta),
      );
    } catch {
      setError(t('voiceError'));
      setVoiceStatus('error');
      return;
    }
    speak(reply, language, () => {
      if (!activeRef.current) return;
      setVoiceStatus('listening');
      startRecognition();
    });
  }

  function startRecognition() {
    const Ctor = getRecognitionCtor();
    if (!Ctor || !activeRef.current) return;
    const rec = new Ctor();
    rec.lang = SPEECH_LANG[language];
    rec.continuous = false;
    rec.interimResults = true;
    rec.onresult = (e) => {
      let finalText = '';
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) finalText += r[0].transcript;
        else interim += r[0].transcript;
      }
      setUserText(finalText || interim);
      if (finalText.trim()) {
        rec.stop();
        setLastVoiceText('');
        void answerInBrowserMode(finalText.trim());
      }
    };
    rec.onerror = (e) => {
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        setError(t('voiceError'));
        void stopSession();
      }
    };
    rec.onend = () => {
      // Reinicio continuo mientras la sesión esté activa y el tutor no esté hablando.
      if (activeRef.current && useIaStore.getState().voiceStatus === 'listening') {
        try {
          rec.start();
        } catch {
          /* ya iniciado */
        }
      }
    };
    recognitionRef.current = rec;
    setVoiceStatus('listening');
    rec.start();
  }

  async function startRealtime(token: string, model: string) {
    const session = new RealtimeTutorSession(model, token, {
      onOpen: () => setVoiceStatus('listening'),
      onClose: () => {
        if (activeRef.current) void stopSession();
      },
      onError: (msg) => {
        setError(msg);
        setVoiceStatus('error');
      },
      onTextDelta: (delta) => {
        setVoiceStatus('speaking');
        setLastVoiceText(useIaStore.getState().lastVoiceText + delta);
      },
      onUserTranscript: (text) => setUserText(text),
      onSpeaking: (speaking) => setVoiceStatus(speaking ? 'speaking' : 'listening'),
    });
    realtimeRef.current = session;
    await session.start();
  }

  async function startSession() {
    setError(null);
    setConnecting(true);
    setLastVoiceText('');
    activeRef.current = true;
    try {
      const response = await fetch('/api/tutor/voice-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId: currentLessonId, locale: language }),
      });
      const data = (await response.json()) as { mode?: VoiceMode; token?: string; model?: string };

      if (data.mode === 'realtime' && data.token && data.model) {
        setMode('realtime');
        setVoiceMode('realtime');
        await startRealtime(data.token, data.model);
      } else {
        setMode('browser');
        setVoiceMode('browser');
        if (!canUseBrowserVoice()) {
          setError(t('voiceUnsupported'));
          activeRef.current = false;
          return;
        }
        startRecognition();
      }
      setActive(true);
    } catch {
      setError(t('voiceError'));
      setVoiceStatus('error');
      activeRef.current = false;
    } finally {
      setConnecting(false);
    }
  }

  function changeLanguage(next: Language) {
    setLanguage(next);
    if (active) {
      void stopSession().then(() => startSession());
    }
  }

  function playIntro() {
    const src = introSrcs?.[language];
    if (!src) {
      const text = introText?.[language];
      if (text) speak(text, language);
      return;
    }
    if (!introRef.current) introRef.current = new Audio();
    const audio = introRef.current;
    audio.src = src;
    setIntroPlaying(true);
    audio.onended = () => setIntroPlaying(false);
    // Si el audio pregrabado no existe para esta lección, se usa la síntesis del navegador.
    audio.onerror = () => {
      setIntroPlaying(false);
      const fallback = introText?.[language];
      if (fallback) speak(fallback, language);
    };
    void audio.play().catch(() => {
      setIntroPlaying(false);
    });
  }

  const statusLabel: Record<typeof voiceStatus, string> = {
    idle: t('voiceIdle'),
    connecting: t('voiceConnecting'),
    listening: t('voiceListening'),
    speaking: '…',
    error: t('voiceError'),
  };
  const isLive = active && (voiceStatus === 'listening' || voiceStatus === 'speaking');

  return (
    <div
      aria-labelledby="voice-title"
      className="rounded-3xl border border-white/10 bg-gradient-to-b from-neutral-900 to-black p-6 backdrop-blur-xl shadow-2xl"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="relative flex h-3 w-3" aria-hidden>
            {isLive && <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-emerald-400" />}
            <span className={cn('relative inline-flex rounded-full h-3 w-3', isLive ? 'bg-emerald-500' : 'bg-amber-500')} />
          </div>
          <h3 id="voice-title" className="text-lg font-semibold text-white tracking-wide flex items-center gap-2">
            {t('voiceTitle')} <Sparkles className="w-4 h-4 text-violet-400" aria-hidden />
          </h3>
        </div>

        {/* Selector de idioma de la voz */}
        <div role="radiogroup" aria-label={t('langChat')} className="flex gap-1.5 bg-white/5 p-1 rounded-xl border border-white/5">
          {LOCALES.map((lang) => (
            <button
              key={lang}
              type="button"
              role="radio"
              aria-checked={language === lang}
              title={LOCALE_NAMES[lang]}
              onClick={() => changeLanguage(lang)}
              disabled={connecting}
              className={cn(
                'px-3 py-1 text-xs font-medium rounded-lg transition-all duration-300 disabled:opacity-50',
                language === lang ? 'bg-violet-600 text-white shadow-lg' : 'text-neutral-400 hover:text-white',
              )}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Visualizador de onda reactivo al estado (sin aleatoriedad en el render) */}
      <div className="h-32 w-full bg-neutral-950 rounded-2xl border border-white/5 flex items-center justify-center p-4 mb-6 relative overflow-hidden">
        {isLive ? (
          <div className="flex items-center gap-1" aria-hidden>
            {BAR_HEIGHTS.map((h, i) => (
              <motion.div
                key={i}
                className="w-1 bg-gradient-to-t from-violet-500 to-fuchsia-500 rounded-full"
                animate={{ height: voiceStatus === 'speaking' ? [h * 0.4, h, h * 0.4] : [8, 14, 8] }}
                transition={{ duration: voiceStatus === 'speaking' ? 0.7 : 1.4, repeat: Infinity, delay: i * 0.05, ease: 'easeInOut' }}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-neutral-500 text-center">{statusLabel[voiceStatus]}</p>
        )}

        <AnimatePresence>
          {(lastVoiceText || userText) && (
            <motion.div
              key="bubble"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-3 left-4 right-4 bg-black/80 backdrop-blur-md p-2 rounded-xl border border-white/10 text-center"
              aria-live="polite"
            >
              {userText && <p className="text-[11px] text-neutral-500 truncate">{userText}</p>}
              {lastVoiceText && <p className="text-xs text-neutral-200 line-clamp-2 italic">&ldquo;{lastVoiceText}&rdquo;</p>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <p role="alert" className="mb-4 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
          <AlertCircle className="size-4" aria-hidden /> {error}
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={active ? stopSession : startSession}
          disabled={connecting}
          aria-pressed={active}
          className={cn(
            'w-full py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 transition-all duration-500 shadow-xl border disabled:opacity-60',
            active
              ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/20'
              : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white border-white/10',
          )}
        >
          {connecting ? (
            <>
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden />
              {t('voiceConnecting')}
            </>
          ) : active ? (
            <>
              <MicOff className="w-5 h-5" aria-hidden /> {t('voiceStop')}
            </>
          ) : (
            <>
              <Mic className="w-5 h-5" aria-hidden /> {t('voiceStart')}
            </>
          )}
        </button>

        <button
          type="button"
          onClick={playIntro}
          disabled={introPlaying}
          className="w-full py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 border border-white/10 bg-white/[0.03] text-zinc-200 hover:bg-white/[0.07] transition-colors disabled:opacity-60"
        >
          {introPlaying ? <Volume2 className="w-5 h-5 animate-pulse" aria-hidden /> : <Play className="w-5 h-5" aria-hidden />}
          {t('voiceIntro')}
        </button>
      </div>

      <p className="mt-4 text-[11px] text-neutral-500">
        {t('voiceMode')}: {mode === 'realtime' ? t('voiceModeRealtime') : t('voiceModeBrowser')}
      </p>
    </div>
  );
};
