import { InstitutionShell } from "@/components/InstitutionShell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { getGoal } from "@shared/institution";
import { ArrowRight, CheckCircle2, ClipboardCheck, LockKeyhole, Save, Send, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearch } from "wouter";

export default function Projects() {
  const { isAuthenticated, loading } = useAuth();
  const search = new URLSearchParams(useSearch());
  const catalogQuery = trpc.institution.projects.useQuery();
  const submissionsQuery = trpc.projects.mine.useQuery(undefined, { enabled: isAuthenticated });
  const [selectedId, setSelectedId] = useState(search.get("proyecto") ?? "project-source-trace");
  const [artifact, setArtifact] = useState("");
  const [reflection, setReflection] = useState("");
  const project = useMemo(() => catalogQuery.data?.find((item) => item.id === selectedId) ?? catalogQuery.data?.[0], [catalogQuery.data, selectedId]);
  const saved = submissionsQuery.data?.find((item) => item.projectId === project?.id);
  const save = trpc.projects.save.useMutation({ onSuccess: () => submissionsQuery.refetch() });
  useEffect(() => { if (project) { setArtifact(saved?.artifact ?? ""); setReflection(saved?.reflection ?? ""); } }, [project?.id, saved?.artifact, saved?.reflection]);
  if (loading || catalogQuery.isLoading) return <InstitutionShell compact><div className="loading-page">Preparando desafíos de proyecto…</div></InstitutionShell>;
  if (!project) return <InstitutionShell><section className="guest-dashboard"><p className="eyebrow">Proyectos</p><h1>Estamos preparando <em>los desafíos.</em></h1><p>El catálogo se publica cuando cada reto cuenta con un objetivo, criterios y evidencias claras.</p></section></InstitutionShell>;
  const goal = getGoal(project.goalId);
  const canSave = artifact.trim().length >= 20 && reflection.trim().length >= 12;
  const handleSave = (status: "draft" | "completed") => { if (!isAuthenticated) { startLogin(); return; } save.mutate({ projectId: project.id, artifact, reflection, status }); };
  return <InstitutionShell>
    <section className="page-hero projects-hero"><p className="eyebrow">Estudio de proyectos</p><h1>Una evidencia no es una promesa. <em>Es un proceso que puedes explicar.</em></h1><p>Los desafíos conectan las facultades con una situación, un entregable, criterios visibles y una reflexión. No hay evaluación automática ni certificación oculta.</p></section>
    <section className="section-wrap projects-layout"><aside className="project-index"><p className="eyebrow">Desafíos iniciales</p>{catalogQuery.data?.map((item) => <button type="button" key={item.id} onClick={() => setSelectedId(item.id)} className={item.id === project.id ? "selected" : ""}><span>{item.estimatedMinutes} min</span><strong>{item.title}</strong><small>{getGoal(item.goalId)?.shortTitle}</small></button>)}</aside><article className="project-workspace"><div className="project-head"><div><p className="eyebrow">{goal?.shortTitle} · proyecto guiado</p><h2>{project.title}</h2></div><span className={saved?.status === "completed" ? "project-status complete" : "project-status"}>{saved?.status === "completed" ? "Registrado" : saved ? "Borrador guardado" : "Sin guardar"}</span></div><p className="project-brief">{project.brief}</p><div className="project-spec"><section><ClipboardCheck size={19} /><h3>Entregables</h3>{project.deliverables.map((item) => <p key={item}><CheckCircle2 size={14} />{item}</p>)}</section><section><ShieldCheck size={19} /><h3>Criterios de revisión propia</h3>{project.criteria.map((item) => <p key={item}><CheckCircle2 size={14} />{item}</p>)}</section></div><label className="project-field"><span>Tu artefacto o evidencia</span><small>Describe, pega texto, enlaza una fuente o incluye código breve. Evita datos sensibles y no copies información privada de terceras personas.</small><textarea value={artifact} onChange={(event) => setArtifact(event.target.value)} placeholder="Escribe el trabajo que quieres conservar como evidencia…" rows={8} /></label><label className="project-field"><span>Tu reflexión</span><small>¿Qué decidiste, qué comprobaste y qué cambiarías en una siguiente versión?</small><textarea value={reflection} onChange={(event) => setReflection(event.target.value)} placeholder="Escribe una reflexión breve sobre tu proceso…" rows={4} /></label><div className="project-actions"><Button variant="outline" className="soft-button" disabled={save.isPending || !canSave} onClick={() => handleSave("draft")}><Save size={16} /> Guardar borrador</Button><Button className="primary-cta" disabled={save.isPending || !canSave} onClick={() => handleSave("completed")}><Send size={16} /> Registrar proyecto</Button></div>{!isAuthenticated && <p className="project-login"><LockKeyhole size={14} /> Inicia sesión para guardar tu trabajo. Puedes explorar los briefs sin crear una cuenta.</p>}{save.error && <p className="project-error">No se pudo guardar: {save.error.message}</p>}<p className="project-disclosure">Registrar un proyecto conserva una evidencia personal; no valida automáticamente la calidad, autoría ni resultados externos. Puedes editarlo después.</p></article></section>
    <section className="section-wrap project-footer"><div><p className="eyebrow">Evidencia personal</p><h2>Deja rastro de tu proceso, no una promesa vacía.</h2><p>Cuando inicias sesión, los proyectos guardados aparecen en tu espacio y en una constancia personal no oficial.</p></div><Link href="/mi-espacio" className="text-cta">Ver mi espacio <ArrowRight size={16} /></Link></section>
  </InstitutionShell>;
}
