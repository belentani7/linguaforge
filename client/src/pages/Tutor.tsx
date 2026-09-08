import { AIChatBox, type Message } from "@/components/AIChatBox";
import { InstitutionShell } from "@/components/InstitutionShell";
import { NextStepsQueue } from "@/components/NextStepsQueue";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import type { LearningGoalId } from "@shared/institution";
import { BookOpen, CheckCircle2, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";

const initialMessage: Message = { role: "assistant", content: "Hola. Soy el tutor de Maos Abertas + LinguaForge. Puedo explicar, proponer una práctica breve o revisar una respuesta en el contexto de tu ruta." };

export default function Tutor() {
  const { isAuthenticated } = useAuth();
  const profile = trpc.profile.get.useQuery(undefined, { enabled: isAuthenticated });
  const [task, setTask] = useState<"explain" | "practice" | "review">("explain");
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [serviceState, setServiceState] = useState<"ai" | "demonstration-fallback" | null>(null);
  const tutor = trpc.tutor.respond.useMutation({ onSuccess: (result) => { setMessages((items) => [...items, { role: "assistant", content: result.answer }]); setServiceState(result.mode); } });
  const send = (content: string) => { setMessages((items) => [...items, { role: "user", content }]); tutor.mutate({ message: content, task }); };
  if (!isAuthenticated) return <InstitutionShell><section className="guest-dashboard tutor-guest"><p className="eyebrow">Tutor de aprendizaje</p><h1>Una conversación que <em>conoce tu ruta.</em></h1><p>Inicia sesión para que el tutor use tu idioma de apoyo, idioma de estudio, nivel CEFR y objetivo como contexto de aprendizaje.</p><Button className="primary-cta" onClick={() => startLogin()}>Entrar para usar el tutor</Button></section></InstitutionShell>;
  return <InstitutionShell compact><section className="tutor-page"><div className="tutor-header"><div><p className="eyebrow">Tutor conversacional</p><h1>Practica con una guía <em>que mantiene el contexto.</em></h1><p>{profile.data ? `Apoyo: ${profile.data.nativeLanguageCode.toUpperCase()} · Estudio: ${profile.data.targetLanguageCode.toUpperCase()} · ${profile.data.currentLevel}` : "Cargando el contexto de tu ruta…"}</p></div><div className="tutor-context"><span><BookOpen size={16} /> {profile.data?.learningGoal ?? "Ruta"}</span><span><ShieldCheck size={16} /> {serviceState === "demonstration-fallback" ? "Guía local" : "Apoyo educativo"}</span></div></div><div className="tutor-layout"><aside className="tutor-rail"><p className="eyebrow">Elige una acción</p>{([{"id":"explain","title":"Explicar","copy":"Aclara un concepto o una palabra."},{"id":"practice","title":"Practicar","copy":"Crea una práctica breve de tu nivel."},{"id":"review","title":"Revisar","copy":"Recibe observaciones sobre un texto."}] as const).map((item) => <button key={item.id} type="button" className={task === item.id ? "selected" : ""} onClick={() => setTask(item.id)}><span>{task === item.id ? <CheckCircle2 size={17} /> : <MessageCircle size={17} />}</span><strong>{item.title}</strong><small>{item.copy}</small></button>)}<div className="tutor-limits"><Sparkles size={16} /><p>El tutor no certifica niveles ni sustituye fuentes revisadas. Contrasta información importante.</p></div></aside><div className="tutor-chat"><AIChatBox messages={messages} onSendMessage={send} isLoading={tutor.isPending} height="min(520px, 52vh)" placeholder={task === "review" ? "Pega una respuesta para revisar…" : "Escribe una pregunta de aprendizaje…"} suggestedPrompts={["Explícame una palabra con un ejemplo", "Propón una práctica breve para mi nivel", "Revisa esta frase y dime cómo mejorarla"]} />{serviceState === "demonstration-fallback" && <p className="tutor-fallback">El servicio de IA no respondió en la última solicitud. Has recibido una guía pedagógica local; puedes volver a intentarlo.</p>}<p className="tutor-disclaimer">Las respuestas son apoyo de IA para el aprendizaje. Verifica los detalles con fuentes y materiales de curso adecuados.</p></div></div>{profile.data && <NextStepsQueue goalId={profile.data.learningGoal as LearningGoalId} stage="tutor" />}</section></InstitutionShell>;
}
