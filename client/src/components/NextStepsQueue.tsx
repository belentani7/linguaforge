import { LEARNING_PROJECTS } from "@shared/content";
import { getGoal, type LearningGoalId } from "@shared/institution";
import { ArrowRight, BookOpenCheck, MessageCircle, Mic, PanelsTopLeft } from "lucide-react";
import { Link } from "wouter";

type NextStepsQueueProps = {
  goalId: LearningGoalId;
  lessonId?: string;
  stage?: "lesson" | "voice" | "tutor" | "panel";
};

export function NextStepsQueue({ goalId, lessonId, stage = "lesson" }: NextStepsQueueProps) {
  const project = LEARNING_PROJECTS.find((item) => item.goalId === goalId);
  const goal = getGoal(goalId);
  const allSteps = [
    ...(lessonId ? [{ id: "voice", icon: Mic, label: "Expresarlo con mi voz", note: "Graba de forma voluntaria y revisa la transcripción.", href: `/practica-oral/${lessonId}` }] : []),
    { id: "tutor", icon: MessageCircle, label: "Pedir una explicación", note: "Usa el tutor para practicar o revisar una idea.", href: "/tutor" },
    ...(project ? [{ id: "project", icon: BookOpenCheck, label: "Convertirlo en proyecto", note: `Abrir un desafío de ${goal?.shortTitle ?? "esta facultad"} con criterios visibles.`, href: `/proyectos?proyecto=${project.id}` }] : []),
    { id: "panel", icon: PanelsTopLeft, label: "Ver mi recorrido", note: "Consulta únicamente el avance y las evidencias que has guardado.", href: "/mi-espacio" },
  ];
  const start = stage === "voice" ? 1 : stage === "tutor" ? 1 : stage === "panel" ? Math.max(0, allSteps.length - 2) : 0;
  return <section className="next-steps-queue" aria-label="Próximos pasos de aprendizaje"><div className="next-steps-heading"><p className="eyebrow">Siguiente paso</p><h2>Elige cómo <em>continuar.</em></h2></div><div className="next-steps-list">{allSteps.slice(start).map((step, index) => { const Icon = step.icon; return <Link href={step.href} key={step.id} className="next-step-card"><span className="next-step-number">{String(index + 1).padStart(2, "0")}</span><Icon size={18} /><div><strong>{step.label}</strong><small>{step.note}</small></div><ArrowRight size={16} /></Link>; })}</div></section>;
}
