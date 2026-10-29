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
    <section className="page-hero open-hero"><p className="eyebrow">Institución abierta</p><h1>Una base que se puede <em>mirar, cuestionar y mejorar.</em></h1><p>LinguaForge nace como plataforma independiente de aprendizaje abierto con vocación internacional. No declara impacto antes de producirlo: publica una infraestructura para que el aprendizaje útil pueda construirse en común.</p><div className="hero-actions"><Link href="/diagnostico" className="primary-cta">Empezar diagnóstico <ArrowRight size={16} /></Link><Link href="/catalogo" className="secondary-cta">Explorar lenguas</Link><a href="/campus/itinerarios/index.html" className="secondary-cta">Cursos completos ↗</a></div></section>
    <section className="section-wrap open-statement"><div><p className="eyebrow">El modelo</p><h2>Seis facultades. Una misma promesa de claridad.</h2><p>El idioma no queda aislado. Cada facultad se relaciona con situaciones cotidianas, autonomía digital, creación y oportunidades reales.</p></div><div className="open-faculty-list">{INSTITUTION_FACULTIES.map((faculty, index) => <Link key={faculty.id} href={`/programas?ruta=${faculty.goals[0]}`}><span>0{index + 1}</span><div><strong>{faculty.title}</strong><small>{faculty.capability}</small></div><ArrowRight size={16} /></Link>)}</div></section>
    <section className="section-wrap open-commitments">{commitments.map((item) => { const Icon = item.icon; return <article key={item.title}><Icon size={23} /><h2>{item.title}</h2><p>{item.body}</p></article>; })}</section>
    <section className="section-wrap open-documents"><div><p className="eyebrow">Documentación viva</p><h2>Decisiones que no se esconden en el código.</h2><p>La documentación describe lo que existe, lo que está diseñado y lo que depende de servicios externos. Ninguna etiqueta de «demo» pretende ocultar una ausencia de funcionalidad.</p></div><div className="document-links"><Link href="/programas"><BookOpenCheck size={18} />Modelo de aprendizaje<ArrowRight size={15} /></Link><Link href="/tutor"><GitFork size={18} />Guía y límites del tutor<ArrowRight size={15} /></Link><Link href="/privacidad"><ShieldCheck size={18} />Privacidad y datos<ArrowRight size={15} /></Link><Link href="/biblioteca"><Scale size={18} />Recursos y procedencia<ArrowRight size={15} /></Link></div>
      <nav className="document-links" aria-label="Transparencia de LinguaForge">
        <a href="/transparencia#modelo">Modelo educativo y contenido disponible</a>
        <a href="/transparencia#ia">Proveedores de IA y límites</a>
        <a href="/transparencia#privacidad">Tratamiento de datos y consentimiento</a>
        <a href="/transparencia#licencia">Licencias y procedencia</a>
      </nav></section>
  </InstitutionShell>;
}
