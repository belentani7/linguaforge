/**
 * Metadatos por ruta para la SPA de raíz (sin dependencias).
 * Actualiza title, description, canonical, Open Graph y robots en cada navegación.
 * Las rutas no existentes reciben `noindex` para evitar soft-404 indexables.
 * El dominio canónico se toma de VITE_SITE_URL; si no existe, no se emite canonical absoluto.
 */

export interface RouteMeta {
  title: string;
  description: string;
}

const BRAND = "LinguaForge";

const ROUTE_META: Record<string, RouteMeta> = {
  "/": {
    title: "Aprende idiomas y tecnología abierta",
    description:
      "LinguaForge: cursos de idiomas, tecnología, programación e IA responsable, con tutor y práctica oral en castellano, portugués de Brasil y catalán.",
  },
  "/catalogo": {
    title: "Catálogo de lenguas",
    description: "39 lenguas de estudio con rutas CEFR de A1 a C2, escritura y dirección de cada idioma.",
  },
  "/programas": {
    title: "Programas de estudio",
    description: "Programas guiados por nivel y objetivo, con práctica, evaluación y seguimiento.",
  },
  "/diagnostico": {
    title: "Diagnóstico de nivel",
    description: "Evalúa tu punto de partida en la lengua que quieres estudiar y recibe una ruta personalizada.",
  },
  "/biblioteca": {
    title: "Biblioteca abierta",
    description: "Materiales abiertos y recursos de lectura para practicar idiomas y tecnología.",
  },
  "/laboratorios": {
    title: "Laboratorios",
    description: "Prácticas aplicadas de idiomas y tecnología con retroalimentación.",
  },
  "/proyectos": {
    title: "Proyectos",
    description: "Proyectos prácticos para demostrar lo que has aprendido.",
  },
  "/empleo": {
    title: "Empleo y oportunidades",
    description: "Oportunidades y trayectorias profesionales vinculadas a lo que aprendes.",
  },
  "/voz": {
    title: "Práctica oral",
    description: "Practica la conversación en voz alta con retroalimentación, sin depender de claves externas.",
  },
  "/tutor": {
    title: "Tutor de aprendizaje",
    description: "Un tutor que conoce tu ruta, tu idioma de apoyo y tu nivel para guiar tu práctica.",
  },
  "/transparencia": {
    title: "Transparencia y documentación",
    description: "Modelo institucional, límites de la IA, privacidad, procedencia y licencia de LinguaForge.",
  },
  "/privacidad": {
    title: "Privacidad y límites del servicio",
    description: "Cómo funciona el progreso local, la práctica oral y la orientación educativa de LinguaForge.",
  },
  "/mi-espacio": { title: "Mi espacio", description: "Tu espacio de aprendizaje personal." },
  "/mi-constancia": { title: "Mi constancia", description: "Registro de tu progreso y evidencias de aprendizaje." },
};

/** Rutas que sólo son útiles para el propio usuario: no deben indexarse. */
const PRIVATE_PREFIXES = ["/mi-espacio", "/mi-constancia"];

const DEFAULT_META: RouteMeta = ROUTE_META["/"];

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href: string | null) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!href) {
    link?.remove();
    return;
  }
  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }
  link.href = href;
}

function siteUrl(): string | null {
  const raw = import.meta.env.VITE_SITE_URL as string | undefined;
  return raw ? raw.replace(/\/$/, "") : null;
}

/** Devuelve la metadata para una ruta. `known` indica si la ruta existe en la tabla. */
export function metaFor(pathname: string): { meta: RouteMeta; known: boolean; indexable: boolean } {
  const clean = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
  const hit = ROUTE_META[clean];
  if (hit) {
    const isPrivate = PRIVATE_PREFIXES.some((p) => clean.startsWith(p));
    return { meta: hit, known: true, indexable: !isPrivate };
  }
  if (clean.startsWith("/lecciones/") || clean.startsWith("/practica-oral/")) {
    return {
      meta: { title: "Lección", description: DEFAULT_META.description },
      known: true,
      indexable: false,
    };
  }
  return {
    meta: { title: "Página no encontrada", description: "Esta página no existe. Vuelve al inicio o revisa el catálogo." },
    known: false,
    indexable: false,
  };
}

/** Aplica la metadata a <head>. Idempotente; seguro de llamar en cada cambio de ruta. */
export function applySeo(pathname: string) {
  const { meta, indexable } = metaFor(pathname);
  const fullTitle = meta.title === DEFAULT_META.title ? `${BRAND} · ${meta.title}` : `${meta.title} · ${BRAND}`;
  document.title = fullTitle;
  setMeta("name", "description", meta.description);
  setMeta("property", "og:title", fullTitle);
  setMeta("property", "og:description", meta.description);
  setMeta("property", "og:type", "website");
  setMeta("property", "og:site_name", BRAND);
  setMeta("name", "robots", indexable ? "index, follow" : "noindex, nofollow");
  const base = siteUrl();
  const clean = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
  setCanonical(base && indexable ? `${base}${clean}` : null);
  if (base) setMeta("property", "og:url", `${base}${clean}`);
}
