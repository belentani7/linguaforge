import { InstitutionShell } from "@/components/InstitutionShell";
import { NextStepsQueue } from "@/components/NextStepsQueue";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getGoal } from "@shared/institution";
import { ArrowRight, CheckCircle2, ChevronLeft, Clock3, MessageCircle, Pause, PenLine, Video, Volume2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useRoute } from "wouter";

export default function Lesson() {
  const [, params] = useRoute("/lecciones/:id");
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAuth();
  const lessonId = params?.id === "presentarse-a1" ? "everyday-a1-introductions" : params?.id ?? "";
  const [answer, setAnswer] = useState("");
  const [checkAnswer, setCheckAnswer] = useState<number | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [completed, setCompleted] = useState(false);
  const lessonQuery = trpc.institution.lesson.useQuery({ id: lessonId }, { enabled: Boolean(lessonId) });
  const completion = trpc.learning.complete.useMutation({ onSuccess: () => setCompleted(true) });
  useEffect(() => () => { window.speechSynthesis?.cancel(); }, []);
  if (lessonQuery.isLoading) return <InstitutionShell compact><div className="loading-page">Abriendo lección…</div></InstitutionShell>;
  if (!lessonQuery.data) return <InstitutionShell compact><div className="loading-page">No encontramos esta lección. <Link href="/programas">Volver a programas</Link></div></InstitutionShell>;
  const lesson = lessonQuery.data;
  const goal = getGoal(lesson.goalId);
  const readAloud = () => { if (!("speechSynthesis" in window)) return; if (isSpeaking) { window.speechSynthesis.cancel(); setIsSpeaking(false); return; } const utterance = new SpeechSynthesisUtterance(`${lesson.title}. ${lesson.prompt}. Resultado esperado: ${lesson.expected}`); utterance.lang = "es-ES"; utterance.rate = 0.92; utterance.onend = () => setIsSpeaking(false); utterance.onerror = () => setIsSpeaking(false); window.speechSynthesis.speak(utterance); setIsSpeaking(true); };
  const action = () => { if (isAuthenticated) completion.mutate({ lessonId: lesson.id, score: checkAnswer === 0 && answer.trim().length > 12 ? 100 : 65 }); else navigate("/diagnostico"); };
  const checkOptions = [lesson.expected, "Responder sin relación con el objetivo de la actividad.", "Copiar una respuesta sin revisarla ni adaptarla al contexto."];
  return <InstitutionShell compact><section className="lesson-page"><Link href={`/programas?ruta=${lesson.goalId}`} className="back-link"><ChevronLeft size={16} /> Volver a la ruta</Link><div className="lesson-topline"><span>{goal?.shortTitle}</span><span>{lesson.level}</span><span><Clock3 size={14} /> {lesson.minutes} min</span></div><div className="lesson-layout"><article className="lesson-main"><p className="eyebrow">Actividad guiada</p><h1>{lesson.title}</h1><p className="lesson-objective"><CheckCircle2 size={18} /> Al terminar podrás: <strong>{lesson.objective}</strong></p><div className="lesson-instruction"><PenLine size={20} /><div><strong>Prueba</strong><p>{lesson.prompt}</p></div></div><section className="lesson-media-card"><div><p className="eyebrow">Material de apoyo</p><h2>Escucha o mira el proceso a tu ritmo.</h2><p>El audio se reproduce solo si lo eliges y se detiene cuando vuelves a pulsar el control.</p><Button variant="outline" className="soft-button" onClick={readAloud}>{isSpeaking ? <Pause size={16} /> : <Volume2 size={16} />}{isSpeaking ? "Detener lectura" : "Escuchar instrucciones"}</Button></div>{lesson.goalId === "digital-citizenship" && <figure className="video-capsule"><video controls playsInline preload="metadata" src="/manus-storage/maos-abertas-source-check-capsule_52d4f16a.mp4" /><figcaption><Video size={14} /> Cápsula visual: detenerse, comprobar origen y fecha, decidir.</figcaption></figure>}</section><label className="answer-field"><span>Tu respuesta</span><textarea value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="Escribe o prepara tu respuesta aquí…" rows={5} /></label><fieldset className="lesson-check"><legend>Comprobación de objetivo</legend><p>¿Qué debería aparecer en una respuesta adecuada para esta actividad?</p>{checkOptions.map((option, index) => <label key={option} className={checkAnswer === index ? "selected" : ""}><input type="radio" name="lesson-check" checked={checkAnswer === index} onChange={() => setCheckAnswer(index)} /><span>{option}</span></label>)}{checkAnswer !== null && <small className={checkAnswer === 0 ? "correct" : "retry"}>{checkAnswer === 0 ? "Correcto: has identificado la evidencia esperada. Revisa ahora tu respuesta antes de guardarla." : "Vuelve a leer el objetivo y el resultado esperado. Puedes cambiar la opción sin penalización."}</small>}</fieldset><div className="lesson-actions"><Button className="primary-cta" disabled={completion.isPending || !answer.trim() || checkAnswer === null} onClick={action}>{isAuthenticated ? "Guardar como completada" : "Diseñar mi ruta para guardar avance"} <ArrowRight size={16} /></Button><Link href="/tutor" className="text-cta"><MessageCircle size={16} /> Pedir apoyo al tutor</Link></div>{completed && <NextStepsQueue goalId={lesson.goalId} lessonId={lesson.id} />}</article><aside className="lesson-side"><p className="eyebrow">Resultado esperado</p><h2>{lesson.expected}</h2><div className="side-rule" /><p>Esta es una actividad formativa. El tutor puede aportar una explicación o práctica adicional, pero no certifica el resultado.</p><Link href={`/practica-oral/${lesson.id}`}><Button variant="outline" className="soft-button wide">Practicar respuesta oral</Button></Link></aside></div></section></InstitutionShell>;
}
