import { InstitutionShell } from "@/components/InstitutionShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { recommendResources, RESOURCE_LIBRARY, searchResources } from "@shared/content";
import { ArrowRight, BookMarked, Bookmark, Braces, ExternalLink, FileText, Search, ShieldCheck, Wrench } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";

const glossary = [{ term: "Prompt", definition: "Instrucción o pregunta que se ofrece a un sistema de IA.", support: "Pregunta / instrucción" }, { term: "Variable", definition: "Nombre que representa un dato que puede utilizar un programa.", support: "Dato con nombre" }, { term: "Verificación", definition: "Acción de comprobar una afirmación con una fuente o evidencia adecuada.", support: "Comprobar antes de usar" }, { term: "URL", definition: "Dirección que permite localizar un recurso en internet.", support: "Dirección web" }];
const kindIcons = { guía: FileText, curso: BookMarked, ejercicio: Braces, glosario: BookMarked, herramienta: Wrench };
const translationCopy = { "base-es": "Base ES", "es-en-pt": "ES · EN · PT", "metadata-39": "Metadatos 39" };

export default function Library() {
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const filtered = useMemo(() => searchResources(query), [query]);
  const recommendations = useMemo(() => recommendResources(history, favorites), [history, favorites]);
  useEffect(() => { const saved = localStorage.getItem("maos-library-favorites"); if (saved) setFavorites(JSON.parse(saved)); }, []);
  useEffect(() => { const saved = localStorage.getItem("maos-library-history"); if (saved) setHistory(JSON.parse(saved)); }, []);
  const toggleFavorite = (id: string) => setFavorites((current) => { const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id]; localStorage.setItem("maos-library-favorites", JSON.stringify(next)); return next; });
  const recordOpen = (id: string) => setHistory((current) => { const next = [id, ...current.filter((item) => item !== id)].slice(0, 8); localStorage.setItem("maos-library-history", JSON.stringify(next)); return next; });
  return <InstitutionShell>
    <section className="page-hero library-hero"><p className="eyebrow">Biblioteca de aprendizaje</p><h1>Recursos para entender, <em>hacer y verificar.</em></h1><p>Guías, prácticas, ejemplos de código y un glosario técnico para acompañar cada ruta. El estado de traducción deja claro qué contenido está disponible y qué solo cuenta con metadatos.</p></section>
    <section className="section-wrap library-controls"><label><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por tema, concepto o ruta" /></label><span>{filtered.length} de {RESOURCE_LIBRARY.length} recursos · {favorites.length} guardados localmente</span></section>
    <section className="section-wrap resource-grid">{filtered.map((resource) => { const Icon = kindIcons[resource.kind]; const isFavorite = favorites.includes(resource.id); const href = resource.kind === "herramienta" ? "/labs" : resource.category === "empleabilidad" ? "/empleo" : `/programas?ruta=${resource.category === "idiomas" ? "everyday" : resource.category === "tecnología" ? "digital-citizenship" : resource.category === "programación" ? "coding" : "ai-literacy"}`; return <article key={resource.id} className="resource-card"><div className="resource-card-top"><span><Icon size={18} /> {resource.kind}</span><div><Badge variant="secondary">{resource.level ?? translationCopy[resource.translationStatus]}</Badge><button type="button" className={isFavorite ? "resource-save saved" : "resource-save"} aria-label={isFavorite ? `Quitar ${resource.title} de guardados` : `Guardar ${resource.title}`} onClick={() => toggleFavorite(resource.id)}><Bookmark size={15} fill={isFavorite ? "currentColor" : "none"} /></button></div></div><p className="resource-category">{resource.category}</p><h2>{resource.title}</h2><p>{resource.summary}</p><small className="translation-status">{translationCopy[resource.translationStatus]}</small><Link href={href} onClick={() => recordOpen(resource.id)} className="text-cta">Abrir recurso <ArrowRight size={16} /></Link></article>; })}</section>
    <section className="section-wrap recommendation-strip"><div><p className="eyebrow">Siguiente lectura</p><h2>Recomendado desde tus guardados y aperturas.</h2><p>La recomendación se calcula en este navegador a partir de categorías de recursos. No perfila tu comportamiento ni usa un modelo externo.</p></div><div>{recommendations.map((resource) => <Link href={resource.kind === "herramienta" ? "/labs" : "/programas"} onClick={() => recordOpen(resource.id)} key={resource.id}><span>{resource.kind}</span><strong>{resource.title}</strong><ArrowRight size={16} /></Link>)}</div></section>
    <section className="section-wrap code-feature"><div><p className="eyebrow">Ejemplo de código</p><h2>Aprender la lógica y las palabras a la vez.</h2><p>La programación se aborda como una práctica lingüística: leer una instrucción, predecir el resultado y explicarlo con precisión.</p><Link href="/programas?ruta=coding"><Button className="soft-button" variant="outline">Ir a programación <ArrowRight size={16} /></Button></Link></div><pre aria-label="Ejemplo de código JavaScript"><code><span className="code-purple">const</span> saludo = <span className="code-gold">"Hola"</span>;
<span className="code-purple">if</span> (saludo) {'{'}
  console.<span className="code-teal">log</span>(saludo);
{'}'}</code></pre></section>
    <section className="section-wrap glossary-section"><div className="section-heading"><div><p className="eyebrow">Glosario técnico bilingüe</p><h2>Palabras precisas para participar.</h2></div><a href="https://developer.mozilla.org/es/" target="_blank" rel="noreferrer" className="text-cta">Consultar MDN <ExternalLink size={15} /></a></div><div className="glossary-table">{glossary.map((entry) => <article key={entry.term}><strong>{entry.term}</strong><p>{entry.definition}</p><span>{entry.support}</span></article>)}</div></section>
  </InstitutionShell>;
}
