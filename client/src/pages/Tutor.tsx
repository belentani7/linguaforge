import { AIChatBox, type Message } from "@/components/AIChatBox";
import { InstitutionShell } from "@/components/InstitutionShell";
import { NextStepsQueue } from "@/components/NextStepsQueue";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { guideReply, type GuideTask } from "@/lib/learning-guide";
import type { LearningGoalId } from "@shared/institution";
import { BookOpen, CheckCircle2, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";

const initialMessage: Message = { role: "assistant", content: "Bienvenido. Esta guía de LinguaForge puede ayudarte a explorar el microglosario, practicar y revisar la estructura de tu texto sin una cuenta. Es una herramienta didáctica con reglas, no un chatbot generativo." };

export default function Tutor() {
  const { isAuthenticated } = useAuth();
  const profile = trpc.profile.get.useQuery(undefined, { enabled: isAuthenticated });
  const [task, setTask] = useState<GuideTask>("explain");
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [serviceState, setServiceState] = useState<"local" | "server-guide" | null>(null);
  const tutor = trpc.tutor.respond.useMutation({ onSuccess: (result) => { setMessages((items) => [...items, { role: "assistant", content: result.answer }]); setServiceState("server-guide"); } });
  const send = (raw: string) => {
    const content = raw.trim().slice(0, 2000);
    if (!content || tutor.isPending) return;
    setMessages((items) => [...items, { role: "user", content }]);
    if (!isAuthenticated) {
      setMessages((items) => [...items, { role: "assistant", content: guideReply(task, content) }]);
      setServiceState("local");
      return;
    }
    tutor.mutate({ message: content, task }, {
      onError: () => {
        setMessages((items) => [...items, { role: "assistant", content: guideReply(task, content) }]);
        setServiceState("local");
      },
    });
  };
  return <InstitutionShell compact><section className="tutor-page"><div className="tutor-header"><div><p className="eyebrow">Tutor conversacional</p><h1>Practica con una guía <em>que mantiene el contexto.</em></h1><p>{profile.data ? `Apoyo: ${profile.data.nativeLanguageCode.toUpperCase()} · Estudio: ${profile.data.targetLanguageCode.toUpperCase()} · ${profile.data.currentLevel}` : "Modo invitado: no se usan cuentas ni se envía el texto al servidor."}</p></div><div className="tutor-context"><span><BookOpen size={16} /> {profile.data?.learningGoal ?? "Ruta"}</span><span><ShieldCheck size={16} /> {!isAuthenticated || serviceState === "local" ? "Guía local" : "Guía didáctica"}</span></div></div><div className="tutor-layout"><aside className="tutor-rail"><p className="eyebrow">Elige una acción</p>{([{"id":"explain","title":"Explicar","copy":"Aclara un concepto o una palabra."},{"id":"practice","title":"Practicar","copy":"Crea una práctica breve de tu nivel."},{"id":"review","title":"Revisar","copy":"Recibe observaciones sobre un texto."}] as const).map((item) => <button key={item.id} type="button" className={task === item.id ? "selected" : ""} onClick={() => setTask(item.id)}><span>{task === item.id ? <CheckCircle2 size={17} /> : <MessageCircle size={17} />}</span><strong>{item.title}</strong><small>{item.copy}</small></button>)}<div className="tutor-limits"><Sparkles size={16} /><p>El tutor no certifica niveles ni sustituye fuentes revisadas. Contrasta información importante.</p></div></aside><div className="tutor-chat"><AIChatBox messages={messages} onSendMessage={send} isLoading={tutor.isPending} height="min(520px, 52vh)" placeholder={task === "review" ? "Pega una respuesta para revisar…" : "Escribe una pregunta de aprendizaje…"} suggestedPrompts={["Explícame una palabra con un ejemplo", "Propón una práctica breve para mi nivel", "Revisa esta frase y dime cómo mejorarla"]} />{serviceState === "local" && <p className="tutor-fallback" role="status">Modo local activo: las respuestas proceden de reglas y materiales limitados, no de un modelo generativo ni de una evaluación del nivel.</p>}<p className="tutor-disclaimer">Guía pedagógica determinista. Las explicaciones y revisiones no certifican conocimientos, no evalúan gramática y no sustituyen la revisión de fuentes.</p></div></div>{profile.data && <NextStepsQueue goalId={profile.data.learningGoal as LearningGoalId} stage="tutor" />}</section></InstitutionShell>;
}
