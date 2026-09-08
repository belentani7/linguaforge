import { startLogin } from "@/const";
import { Button } from "@/components/ui/button";
import { LANGUAGE_CATALOG } from "@shared/institution";
import { getLocaleMetadata, resolveLocale, translate } from "@shared/i18n";
import { ArrowUpRight, Check, ChevronDown, Menu, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";

export function InstitutionShell({ children, compact = false }: { children: React.ReactNode; compact?: boolean }) {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [locale, setLocale] = useState(() => resolveLocale(localStorage.getItem("maos-ui-locale") ?? navigator.language));
  const [preferences, setPreferences] = useState(() => {
    try { return JSON.parse(localStorage.getItem("maos-accessibility-preferences") ?? '{"comfort":false,"focus":false,"reducedMotion":false}') as { comfort: boolean; focus: boolean; reducedMotion: boolean }; }
    catch { return { comfort: false, focus: false, reducedMotion: false }; }
  });
  const currentLanguage = getLocaleMetadata(locale);
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);

  useEffect(() => {
    localStorage.setItem("maos-ui-locale", locale);
    document.documentElement.lang = currentLanguage.locale;
    document.documentElement.dir = currentLanguage.direction;
  }, [currentLanguage.direction, currentLanguage.locale, locale]);
  useEffect(() => {
    const canonicalUrl = new URL(location.split("?")[0], window.location.origin).toString();
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); }
    canonical.href = canonicalUrl;
    let structuredData = document.querySelector<HTMLScriptElement>("#maos-institution-jsonld");
    if (!structuredData) { structuredData = document.createElement("script"); structuredData.id = "maos-institution-jsonld"; structuredData.type = "application/ld+json"; document.head.appendChild(structuredData); }
    structuredData.text = JSON.stringify({ "@context": "https://schema.org", "@type": "EducationalOrganization", name: "Maos Abertas + LinguaForge", url: window.location.origin, description: "Institución digital abierta para lenguas, ciudadanía digital, tecnología, programación, IA responsable y trayectorias profesionales." });
  }, [location]);
  useEffect(() => {
    localStorage.setItem("maos-accessibility-preferences", JSON.stringify(preferences));
    document.documentElement.classList.toggle("reading-comfort", preferences.comfort);
    document.documentElement.classList.toggle("focus-mode", preferences.focus);
    document.documentElement.classList.toggle("reduced-motion", preferences.reducedMotion);
  }, [preferences]);

  const togglePreference = (key: keyof typeof preferences) => setPreferences((current) => ({ ...current, [key]: !current[key] }));

  const navItems = [
    { href: "/programas", label: t("nav.learn") },
    { href: "/idiomas", label: t("nav.languages") },
    { href: "/biblioteca", label: t("nav.library") },
    { href: "/labs", label: t("nav.labs") },
    { href: "/empleo", label: "Empleo" },
    { href: "/abierto", label: "Abierto" },
    { href: "/tutor", label: t("nav.tutor") },
  ];

  return (
    <div className="institution-shell">
      <header className="site-header">
        <div className="site-header-inner">
          <Link href="/" className="brand-lockup" aria-label="Maos Abertas + LinguaForge, inicio">
            <span className="brand-seal">M</span>
            <span className="brand-name"><strong>Maos Abertas</strong><small>LinguaForge</small></span>
          </Link>
          <nav className="main-nav" aria-label="Navegación principal">
            {navItems.map((item) => <Link key={item.href} href={item.href} className={location === item.href ? "active" : ""}>{item.label}</Link>)}
          </nav>
          <div className="header-tools">
            <label className="locale-switcher" aria-label="Idioma de la interfaz">
              <span className="sr-only">Idioma de la interfaz</span>
              <select value={locale} onChange={(event) => setLocale(event.target.value)}>
                {LANGUAGE_CATALOG.map((language) => <option key={language.code} value={language.code}>{language.nativeName}</option>)}
              </select>
              <ChevronDown size={14} aria-hidden="true" />
            </label>
            <button type="button" className="a11y-toggle" onClick={() => setPreferencesOpen((value) => !value)} aria-expanded={preferencesOpen} aria-controls="reading-preferences" aria-label="Abrir preferencias de lectura"><SlidersHorizontal size={16} /></button>
            <Link href="/mi-espacio" className="quiet-link">{t("nav.space")}</Link>
            <Button size="sm" onClick={() => startLogin()} className="nav-cta">Entrar<ArrowUpRight size={14} /></Button>
            <button className="menu-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Abrir menú">
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        {open && <nav className="mobile-nav" aria-label="Navegación móvil">{navItems.map((item) => <Link onClick={() => setOpen(false)} key={item.href} href={item.href}>{item.label}</Link>)}<Link onClick={() => setOpen(false)} href="/mi-espacio">{t("nav.space")}</Link></nav>}
        {preferencesOpen && <div className="a11y-panel" id="reading-preferences" role="region" aria-label="Preferencias de lectura"><div><p className="eyebrow">Tu lectura</p><strong>Ajustes sin penalización</strong><p>Estos controles se guardan en este navegador y se pueden desactivar cuando quieras.</p></div><div className="a11y-options"><button type="button" className={preferences.comfort ? "on" : ""} onClick={() => togglePreference("comfort")}><span><strong>Lectura cómoda</strong><small>Aumenta aire y altura de línea.</small></span>{preferences.comfort && <Check size={16} />}</button><button type="button" className={preferences.focus ? "on" : ""} onClick={() => togglePreference("focus")}><span><strong>Modo de enfoque</strong><small>Reduce elementos decorativos.</small></span>{preferences.focus && <Check size={16} />}</button><button type="button" className={preferences.reducedMotion ? "on" : ""} onClick={() => togglePreference("reducedMotion")}><span><strong>Reducir movimiento</strong><small>Desactiva transiciones no esenciales.</small></span>{preferences.reducedMotion && <Check size={16} />}</button></div></div>}
      </header>
      <main className={compact ? "page-main compact" : "page-main"}>{children}</main>
      {!compact && <footer className="site-footer"><div><span className="brand-seal small">M</span><strong> Maos Abertas + LinguaForge</strong></div><p>Aprendizaje abierto, situado y verificable.</p><a href="https://github.com/belentani7/Maod-abertas" target="_blank" rel="noreferrer">Código y documentación <ArrowUpRight size={14} /></a></footer>}
    </div>
  );
}
