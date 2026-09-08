import { InstitutionShell } from "@/components/InstitutionShell";
import { NextStepsQueue } from "@/components/NextStepsQueue";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { AlertCircle, CheckCircle2, CircleStop, Mic, Play, RotateCcw, ShieldCheck, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useRoute } from "wouter";

const mimeCandidates = ["audio/webm", "audio/ogg", "audio/mp4"] as const;
type SupportedMime = (typeof mimeCandidates)[number];

export default function VoicePractice() {
  const [, params] = useRoute("/practica-oral/:id");
  const { isAuthenticated } = useAuth();
  const lesson = trpc.institution.lesson.useQuery({ id: params?.id ?? "" }, { enabled: Boolean(params?.id) });
  const [status, setStatus] = useState<"idle" | "recording" | "ready">("idle");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audio, setAudio] = useState<{ base64: string; mimeType: SupportedMime } | null>(null);
  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const chunks = useRef<Blob[]>([]);
  const transcription = trpc.voice.transcribe.useMutation();
  useEffect(() => () => { stream.current?.getTracks().forEach((track) => track.stop()); if (audioUrl) URL.revokeObjectURL(audioUrl); }, [audioUrl]);
  const start = async () => {
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
    } catch { setStatus("idle"); }
  };
  const stop = () => recorder.current?.state === "recording" && recorder.current.stop();
  if (!isAuthenticated) return <InstitutionShell><section className="guest-dashboard tutor-guest"><p className="eyebrow">Práctica oral</p><h1>Tu voz también forma parte <em>del aprendizaje.</em></h1><p>Inicia sesión para grabar una respuesta voluntaria, procesar su transcripción y conservar el resultado de la práctica.</p><Button className="primary-cta" onClick={() => startLogin()}>Entrar para practicar</Button></section></InstitutionShell>;
  if (lesson.isLoading || !lesson.data) return <InstitutionShell compact><div className="loading-page">Preparando práctica oral…</div></InstitutionShell>;
  const send = () => { if (audio && params?.id) transcription.mutate({ lessonId: params.id, mimeType: audio.mimeType, base64Audio: audio.base64 }); };
  return <InstitutionShell compact><section className="voice-page"><Link href={`/lecciones/${lesson.data.id}`} className="back-link">← Volver a la lección</Link><div className="voice-heading"><p className="eyebrow">Práctica oral voluntaria</p><h1>Di tu respuesta <em>con tus propias palabras.</em></h1><p>{lesson.data.prompt}</p></div><div className="voice-layout"><article className="recorder-card"><div className={status === "recording" ? "mic-stage recording" : "mic-stage"}><div className="mic-rings" /><Mic size={35} /></div><h2>{status === "recording" ? "Grabando tu respuesta" : status === "ready" ? "Tu grabación está lista" : "Prepara una respuesta breve"}</h2><p>{status === "recording" ? "Cuando termines, detén la grabación. No se envía audio mientras hablas." : "La plataforma solicita el micrófono solo al pulsar Grabar. Puedes repetir antes de enviar."}</p><div className="record-actions">{status === "recording" ? <Button className="stop-button" onClick={stop}><CircleStop size={17} /> Detener</Button> : <Button className="primary-cta" onClick={start}><Mic size={17} /> Grabar respuesta</Button>}{status === "ready" && <Button variant="outline" className="soft-button" onClick={() => { setAudio(null); setStatus("idle"); }}> <RotateCcw size={15} /> Repetir</Button>}</div>{audioUrl && <audio className="voice-player" src={audioUrl} controls />}{status === "ready" && <Button className="primary-cta send-audio" disabled={transcription.isPending} onClick={send}>{transcription.isPending ? "Transcribiendo…" : "Transcribir y comparar"} <Play size={16} /></Button>}<div className="recording-note"><ShieldCheck size={16} /><p>La transcripción se crea para esta práctica. El sistema no identifica personas ni certifica pronunciación.</p></div></article><aside className="voice-reference"><Volume2 size={22} /><p className="eyebrow">Resultado esperado</p><h2>{lesson.data.expected}</h2><div /><p>Habla de forma clara y concéntrate en expresar la idea. El resultado compara tu texto transcrito con el objetivo pedagógico de la lección.</p></aside></div>{transcription.data && <section className="transcript-result"><div><p className="eyebrow">Transcripción</p><h2>{transcription.data.transcript || "No pudimos detectar texto en esta grabación."}</h2></div><div><p className="eyebrow">Comparación pedagógica</p><p>{transcription.data.comparison}</p><span><CheckCircle2 size={15} /> Idioma detectado: {transcription.data.language.toUpperCase()}</span></div></section>}{transcription.data && <NextStepsQueue goalId={lesson.data.goalId} lessonId={lesson.data.id} stage="voice" />}{transcription.error && <p className="voice-error"><AlertCircle size={16} /> {transcription.error.message}</p>}</section></InstitutionShell>;
}
