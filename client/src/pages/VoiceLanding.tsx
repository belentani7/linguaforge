import { InstitutionShell } from "@/components/InstitutionShell";
import { Button } from "@/components/ui/button";
import { CURRICULUM_LESSONS, getGoal } from "@shared/institution";
import { ArrowRight, Mic, ShieldCheck, Volume2 } from "lucide-react";
import { Link } from "wouter";

export default function VoiceLanding() {
  const options = CURRICULUM_LESSONS.filter((lesson) => ["dialogue", "practice", "reflection"].includes(lesson.activity)).slice(0, 4);
  return <InstitutionShell><section className="page-hero voice-landing-hero"><p className="eyebrow">Material de voz</p><h1>Una respuesta no necesita ser <em>perfecta</em> para practicarse.</h1><p>Elige una actividad breve. Primero puedes escuchar el objetivo, después grabar de manera voluntaria y finalmente revisar la transcripción en tu propio ritmo.</p></section><section className="section-wrap voice-landing-grid"><article className="voice-how"><Volume2 size={23} /><p className="eyebrow">Así funciona</p><h2>La persona conserva el control.</h2><p>El audio solo se reproduce o graba cuando pulsas un control. La transcripción sirve para comparar una idea con el objetivo de la actividad; no evalúa acento, identidad ni nivel.</p><div><ShieldCheck size={16} /> Puedes repetir antes de enviar.</div></article><div className="voice-option-list">{options.map((lesson) => <Link href={`/practica-oral/${lesson.id}`} key={lesson.id} className="voice-option"><span><Mic size={18} /> {lesson.minutes} min</span><h3>{lesson.title}</h3><p>{getGoal(lesson.goalId)?.shortTitle} · {lesson.objective}</p><Button variant="outline" className="soft-button">Elegir práctica <ArrowRight size={15} /></Button></Link>)}</div></section></InstitutionShell>;
}
