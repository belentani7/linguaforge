import { InstitutionShell } from "@/components/InstitutionShell";
import { Button } from "@/components/ui/button";
import { CEFR_LEVELS, LANGUAGE_CATALOG } from "@shared/institution";
import { ArrowRight, Check, Globe2, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useSearch } from "wouter";

export default function Catalog() {
  const search = useSearch();
  const selected = new URLSearchParams(search).get("estudio") ?? "en";
  const [query, setQuery] = useState("");
  const languages = useMemo(() => LANGUAGE_CATALOG.filter((item) => `${item.name} ${item.nativeName}`.toLocaleLowerCase().includes(query.toLocaleLowerCase())), [query]);
  const language = LANGUAGE_CATALOG.find((item) => item.code === selected) ?? LANGUAGE_CATALOG.find((item) => item.code === "en")!;
  return <InstitutionShell>
    <section className="page-hero"><p className="eyebrow">Catálogo de estudio</p><h1>39 lenguas, <em>una institución abierta.</em></h1><p>Elige una lengua de estudio y construye una ruta con metas CEFR, práctica guiada y apoyo contextual.</p></section>
    <section className="section-wrap catalog-layout"><aside className="catalog-filter"><label htmlFor="language-search"><Search size={16} /> Buscar idioma</label><input id="language-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nombre o escritura" /><p>{languages.length} idiomas disponibles</p><div className="catalog-list">{languages.map((item) => <Link href={`/idiomas?estudio=${item.code}`} className={item.code === language.code ? "selected" : ""} key={item.code}><span className="language-chip">{item.nativeName.slice(0, 2).toUpperCase()}</span><span><strong>{item.name}</strong><small>{item.nativeName}</small></span>{item.code === language.code && <Check size={16} />}</Link>)}</div></aside>
      <article className="language-profile"><div className="profile-top"><div className="large-language-chip">{language.nativeName.slice(0, 2).toUpperCase()}</div><div><p className="eyebrow">Perfil de idioma</p><h2>{language.name}</h2><p className="native-title" dir={language.direction}>{language.nativeName}</p></div></div><div className="profile-facts"><span><Globe2 size={16} /> Escritura {language.script}</span><span>Dirección {language.direction.toUpperCase()}</span><span>Ruta CEFR A1–C2</span></div><div className="profile-rule" /><h3>Una ruta que empieza en tu contexto</h3><p>Selecciona {language.name} como lengua de estudio y utiliza tu idioma de apoyo para instrucciones, glosario y conversaciones guiadas. La institución gestiona ambos contextos sin multiplicar pantallas.</p><div className="level-path">{CEFR_LEVELS.map((level) => <div key={level.code}><span>{level.code}</span><strong>{level.title}</strong><small>{level.description}</small></div>)}</div><Link href={`/diagnostico?estudio=${language.code}`}><Button className="primary-cta">Empezar diagnóstico en {language.name} <ArrowRight size={16} /></Button></Link></article></section>
  </InstitutionShell>;
}
