import { startLogin } from "@/const";
import { Button } from "@/components/ui/button";
import { LANGUAGE_CATALOG } from "@shared/institution";
import { getLocaleMetadata, resolveLocale, translate } from "@shared/i18n";
import { ArrowUpRight, Check, ChevronDown, Menu, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";

export function InstitutionShell({ children, compact = false }: { children: React.ReactNode; compact?: boolean }) {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [locale, setLocale] = useState(() => {
    try { return resolveLocale(localStorage.getItem("maos-ui-locale") ?? navigator.language); }
    catch { return resolveLocale(navigator.language); }
  });
  const [preferences, setPreferences] = useState(() => {
    try {
      const stored: unknown = JSON.parse(localStorage.getItem("maos-accessibility-preferences") ?? "null");
      const values = stored && typeof stored === "object" && !Array.isArray(stored)
        ? stored as Record<string, unknown> : {};
      return {
        comfort: values.comfort === true,
        focus: values.focus === true,
        reducedMotion: values.reducedMotion === true,
      };
    } catch { return { comfort: false, focus: false, reducedMotion: false }; }
  });
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const preferencesButtonRef = useRef<HTMLButtonElement>(null);
  const currentLanguage = getLocaleMetadata(locale);
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);

  useEffect(() => {
    try { localStorage.setItem("maos-ui-locale", locale); } catch { /* Preferences remain usable without storage. */ }
    document.documentElement.lang = currentLanguage.locale;
    document.documentElement.dir = currentLanguage.direction;
  }, [currentLanguage.direction, currentLanguage.locale, locale]);
  // The SPA route-level SEO layer owns canonical URLs; do not overwrite them with preview origins.
  useEffect(() => {
    let structuredData = document.querySelector<HTMLScriptElement>("#linguaforge-institution-jsonld");
    if (!structuredData) {
      structuredData = document.createElement("script");
      structuredData.id = "linguaforge-institution-jsonld";
      structuredData.type = "application/ld+json";
      document.head.appendChild(structuredData);
    }
    structuredData.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      name: "LinguaForge",
      url: import.meta.env.VITE_SITE_URL || window.location.origin,
      description: "Plataforma de aprendizaje abierto de lenguas, competencias digitales y práctica orientada por objetivos."
    });
  }, [location]);
  useEffect(() => {
    try { localStorage.setItem("maos-accessibility-preferences", JSON.stringify(preferences)); } catch { /* Private browsing may deny storage. */ }
    document.documentElement.classList.toggle("reading-comfort", preferences.comfort);
    document.documentElement.classList.toggle("focus-mode", preferences.focus);
    document.documentElement.classList.toggle("reduced-motion", preferences.reducedMotion);
  }, [preferences]);

  useEffect(() => {
    if (!open && !preferencesOpen) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (preferencesOpen) {
        setPreferencesOpen(false);
        preferencesButtonRef.current?.focus();
      } else {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, [open, preferencesOpen]);

  const togglePreference = (key: keyof typeof preferences) => setPreferences((current) => ({ ...current, [key]: !current[key] }));

  const navItems = [
    { href: "/programas", label: t("nav.learn") },
    { href: "/catalogo", label: t("nav.languages") },
    { href: "/biblioteca", label: t("nav.library") },
    { href: "/laboratorios", label: t("nav.labs") },
    { href: "/empleo", label: "Empleo" },
    { href: "/transparencia", label: "Abierto" },
    { href: "/tutor", label: t("nav.tutor") },
  ];

  return (
    <div className="institution-shell">
      <a className="skip-link" href="#main-content">Ir al contenido principal</a>
      <header className="site-header">
        <div className="site-header-inner">
          <Link href="/" className="brand-lockup">
            <span className="brand-seal">L</span>
            <span className="brand-name"><strong>LinguaForge</strong><small>Learning Studio</small></span>
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
            <button type="button" className="a11y-toggle" ref={preferencesButtonRef} onClick={() => setPreferencesOpen((value) => !value)} aria-expanded={preferencesOpen} aria-controls="reading-preferences" aria-label="Abrir preferencias de lectura"><SlidersHorizontal size={16} /></button>
            <Link href="/mi-espacio" className="quiet-link">{t("nav.space")}</Link>
            <Button size="sm" onClick={() => startLogin()} className="nav-cta">Entrar<ArrowUpRight size={14} /></Button>
            <button type="button" className="menu-toggle" ref={menuButtonRef} onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Cerrar menú" : "Abrir menú"}>
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        {open && <nav id="mobile-navigation" className="mobile-nav is-open" aria-label="Navegación móvil">{navItems.map((item) => <Link onClick={() => setOpen(false)} key={item.href} href={item.href}>{item.label}</Link>)}<Link onClick={() => setOpen(false)} href="/mi-espacio">{t("nav.space")}</Link></nav>}
        {preferencesOpen && <div className="a11y-panel" id="reading-preferences" role="region" aria-label="Preferencias de lectura"><div><p className="eyebrow">Tu lectura</p><strong>Ajustes sin penalización</strong><p>Estos controles se guardan en este navegador y se pueden desactivar cuando quieras.</p></div><div className="a11y-options"><button type="button" className={preferences.comfort ? "on" : ""} aria-pressed={preferences.comfort} onClick={() => togglePreference("comfort")}><span><strong>Lectura cómoda</strong><small>Aumenta aire y altura de línea.</small></span>{preferences.comfort && <Check size={16} />}</button><button type="button" className={preferences.focus ? "on" : ""} aria-pressed={preferences.focus} onClick={() => togglePreference("focus")}><span><strong>Modo de enfoque</strong><small>Reduce elementos decorativos.</small></span>{preferences.focus && <Check size={16} />}</button><button type="button" className={preferences.reducedMotion ? "on" : ""} aria-pressed={preferences.reducedMotion} onClick={() => togglePreference("reducedMotion")}><span><strong>Reducir movimiento</strong><small>Desactiva transiciones no esenciales.</small></span>{preferences.reducedMotion && <Check size={16} />}</button></div></div>}
      </header>
      <main id="main-content" tabIndex={-1} className={compact ? "page-main compact" : "page-main"}>{children}</main>
      {!compact && <footer className="site-footer"><div><span className="brand-seal small">L</span><strong> LinguaForge</strong></div><p>Aprendizaje abierto, situado y verificable.</p><Link href="/privacidad">Privacidad y límites <ArrowUpRight size={14} /></Link></footer>}
    </div>
  );
}
