import { InstitutionShell } from "@/components/InstitutionShell";
import { INSTITUTION_FACULTIES } from "@shared/institution";
import { ArrowRight, BookOpenCheck, Code2, FileCheck2, GitFork, Scale, ShieldCheck } from "lucide-react";
import { Link } from "wouter";

const commitments = [
  { icon: Code2, title: "Código abierto", body: "La arquitectura de producto, los contratos y las herramientas de esta base se publican bajo MIT. Las dependencias de terceros conservan sus propias licencias." },
  { icon: FileCheck2, title: "Contenido con procedencia", body: "Cada contenido externo debe indicar fuente, atribución, licencia, versión y método de revisión antes de incorporarse." },
  { icon: ShieldCheck, title: "Datos con límites", body: "Las preferencias, la voz y la IA se tratan como capacidades con consentimiento, límites visibles y documentación; no como excusa para perfilar personas." },
];

export default function OpenInstitution() {
  return <InstitutionShell>
    <section className="page-hero open-hero"><p className="eyebrow">Institución abierta</p><h1>Una base que se puede <em>mirar, cuestionar y mejorar.</em></h1><p>Maos Abertas + LinguaForge nace desde L’Hospitalet de Llobregat con vocación internacional. No declara impacto antes de producirlo: publica una infraestructura para que el aprendizaje útil pueda construirse en común.</p></section>
    <section className="section-wrap open-statement"><div><p className="eyebrow">El modelo</p><h2>Seis facultades. Una misma promesa de claridad.</h2><p>El idioma no queda aislado. Cada facultad se relaciona con situaciones cotidianas, autonomía digital, creación y oportunidades reales.</p></div><div className="open-faculty-list">{INSTITUTION_FACULTIES.map((faculty, index) => <Link key={faculty.id} href={`/programas?ruta=${faculty.goals[0]}`}><span>0{index + 1}</span><div><strong>{faculty.title}</strong><small>{faculty.capability}</small></div><ArrowRight size={16} /></Link>)}</div></section>
    <section className="section-wrap open-commitments">{commitments.map((item) => { const Icon = item.icon; return <article key={item.title}><Icon size={23} /><h2>{item.title}</h2><p>{item.body}</p></article>; })}</section>
    <section className="section-wrap open-documents"><div><p className="eyebrow">Documentación viva</p><h2>Decisiones que no se esconden en el código.</h2><p>La documentación describe lo que existe, lo que está diseñado y lo que depende de servicios externos. Ninguna etiqueta de «demo» pretende ocultar una ausencia de funcionalidad.</p></div><div className="document-links"><a href="https://github.com/belentani7/Maod-abertas/blob/duck/docs/INSTITUTION-MODEL.md" target="_blank" rel="noreferrer"><BookOpenCheck size={18} />Modelo institucional<ArrowRight size={15} /></a><a href="https://github.com/belentani7/Maod-abertas/blob/duck/docs/AI-CORE.md" target="_blank" rel="noreferrer"><GitFork size={18} />AI Core y adaptadores<ArrowRight size={15} /></a><a href="https://github.com/belentani7/Maod-abertas/blob/duck/PRIVACY.md" target="_blank" rel="noreferrer"><ShieldCheck size={18} />Privacidad y datos<ArrowRight size={15} /></a><a href="https://github.com/belentani7/Maod-abertas/blob/duck/LICENSE" target="_blank" rel="noreferrer"><Scale size={18} />Licencia y colaboración<ArrowRight size={15} /></a></div></section>
  </InstitutionShell>;
}
