import { InstitutionShell } from "@/components/InstitutionShell";
import { NextStepsQueue } from "@/components/NextStepsQueue";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { CURRICULUM_LESSONS } from "@shared/institution";
import { trpc } from "@/lib/trpc";
import { AlertCircle, CheckCircle2, CircleStop, Mic, Play, RotateCcw, ShieldCheck, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useRoute } from "wouter";

const mimeCandidates = ["audio/webm", "audio/ogg", "audio/mp4"] as const;
type SupportedMime = (typeof mimeCandidates)[number];

export default function VoicePractice() {
  const [, params] = useRoute("/practica-oral/:id");
  const { isAuthenticated } = useAuth();
  const bundledLesson = CURRICULUM_LESSONS.find((entry) => entry.id === params?.id);
  const lesson = trpc.institution.lesson.useQuery({ id: params?.id ?? "" }, { enabled: Boolean(params?.id) && !bundledLesson });
  const [status, setStatus] = useState<"idle" | "recording" | "ready">("idle");
  const [microphoneError, setMicrophoneError] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audio, setAudio] = useState<{ base64: string; mimeType: SupportedMime } | null>(null);
  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const chunks = useRef<Blob[]>([]);
  const transcription = trpc.voice.transcribe.useMutation();
  useEffect(() => () => { stream.current?.getTracks().forEach((track) => track.stop()); if (audioUrl) URL.revokeObjectURL(audioUrl); }, [audioUrl]);
  const start = async () => {
    setMicrophoneError("");
    try {
      const selectedMime = mimeCandidates.find((mime) => MediaRecorder.isTypeSupported(mime)) ?? "audio/webm";
      stream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunks.current = [];
      const activeRecorder = new MediaRecorder(stream.current, { mimeType: selectedMime });
      recorder.current = activeRecorder;
      activeRecorder.ondataavailable = (event) => { if (event.data.size) chunks.current.push(event.data); };
      activeRecorder.onstop = () => {
        const blob = new Blob(chunks.current, { type: selectedMime });
        if (blob.size > 16 * 1024 * 1024) { setStatus("idle"); return; }
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        setAudioUrl(URL.createObjectURL(blob));
        const reader = new FileReader();
        reader.onload = () => { const result = String(reader.result); setAudio({ base64: result.split(",")[1] ?? "", mimeType: selectedMime }); setStatus("ready"); };
        reader.readAsDataURL(blob);
        stream.current?.getTracks().forEach((track) => track.stop());
      };
      activeRecorder.start(); setStatus("recording");
    } catch { setStatus("idle"); setMicrophoneError("No se pudo acceder al micrófono. Revisa los permisos del navegador y la conexión segura (HTTPS)."); }
  };
  const stop = () => recorder.current?.state === "recording" && recorder.current.stop();
  if (lesson.isLoading && !bundledLesson) return <InstitutionShell compact><div className="loading-page">Preparando práctica oral…</div></InstitutionShell>;
  const activeLesson = lesson.data ?? bundledLesson;
  if (!activeLesson) return <InstitutionShell compact><section className="loading-page"><p>No encontramos esta actividad.</p><Link href="/programas">Volver a programas</Link></section></InstitutionShell>;
  const send = () => { if (isAuthenticated && audio && params?.id) transcription.mutate({ lessonId: params.id, mimeType: audio.mimeType, base64Audio: audio.base64 }); };
  return <InstitutionShell compact><section className="voice-page"><Link href={`/lecciones/${activeLesson.id}`} className="back-link">← Volver a la lección</Link><div className="voice-heading"><p className="eyebrow">Práctica oral voluntaria</p><h1>Di tu respuesta <em>con tus propias palabras.</em></h1><p>{activeLesson.prompt}</p></div><div className="voice-layout"><article className="recorder-card"><div className={status === "recording" ? "mic-stage recording" : "mic-stage"}><div className="mic-rings" /><Mic size={35} /></div><h2>{status === "recording" ? "Grabando tu respuesta" : status === "ready" ? "Tu grabación está lista" : "Prepara una respuesta breve"}</h2><p>{status === "recording" ? "Cuando termines, detén la grabación. No se envía audio mientras hablas." : "La plataforma solicita el micrófono solo al pulsar Grabar. Puedes repetir y escuchar antes de decidir si quieres solicitar la transcripción."}</p><div className="record-actions">{status === "recording" ? <Button className="stop-button" onClick={stop}><CircleStop size={17} /> Detener</Button> : <Button className="primary-cta" onClick={start}><Mic size={17} /> Grabar respuesta</Button>}{status === "ready" && <Button variant="outline" className="soft-button" onClick={() => { setAudio(null); setAudioUrl(null); setStatus("idle"); }}> <RotateCcw size={15} /> Repetir</Button>}</div>{audioUrl && <audio className="voice-player" src={audioUrl} controls aria-label="Escuchar tu grabación" />}{microphoneError && <p role="alert" className="voice-error"><AlertCircle size={16} /> {microphoneError}</p>}{status === "ready" && isAuthenticated && <Button className="primary-cta send-audio" disabled={transcription.isPending} onClick={send}>{transcription.isPending ? "Transcribiendo…" : "Transcribir y comparar"} <Play size={16} /></Button>}<div className="recording-note"><ShieldCheck size={16} /><p>{isAuthenticated ? "Tu audio permanece en este dispositivo hasta que pulses Transcribir y comparar. La transcripción requiere un servidor disponible." : "La grabación se escucha en este dispositivo; no se envía al servidor. Este modo no produce transcripciones ni certificaciones."}</p></div></article><aside className="voice-reference"><Volume2 size={22} /><p className="eyebrow">Resultado esperado</p><h2>{activeLesson.expected}</h2><div /><p>Habla de forma clara y concéntrate en expresar la idea. El resultado compara tu texto transcrito con el objetivo pedagógico de la lección.</p></aside></div>{transcription.data?.status === "unavailable" && <section className="transcript-result"><p className="eyebrow">Sin transcripción</p><p>Este servidor no tiene un proveedor de voz configurado, así que no se genera texto ni comparación. Puedes leer el objetivo en voz alta y compararlo tú mismo con la lección.</p></section>}{transcription.data?.status === "ready" && <section className="transcript-result"><div><p className="eyebrow">Transcripción</p><h2>{transcription.data.transcript || "No pudimos detectar texto en esta grabación."}</h2></div><div><p className="eyebrow">Comparación pedagógica</p><p>{transcription.data.comparison}</p><span><CheckCircle2 size={15} /> Idioma detectado: {transcription.data.language.toUpperCase()}</span></div></section>}{((!isAuthenticated && status === "ready") || transcription.data?.status === "ready") && <NextStepsQueue goalId={activeLesson.goalId} lessonId={activeLesson.id} stage="voice" />}{transcription.error && <p className="voice-error"><AlertCircle size={16} /> {transcription.error.message}</p>}</section></InstitutionShell>;
}
