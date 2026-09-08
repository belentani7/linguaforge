import type { CefrCode, LearningGoalId } from "./institution";

export type ContentCategory = "idiomas" | "tecnología" | "programación" | "ia-responsable" | "empleabilidad" | "accesibilidad";
export type ResourceKind = "guía" | "curso" | "ejercicio" | "glosario" | "herramienta";

export type ResourceItem = {
  id: string;
  kind: ResourceKind;
  category: ContentCategory;
  title: string;
  summary: string;
  duration?: number;
  level?: CefrCode;
  tags: string[];
  translationStatus: "base-es" | "es-en-pt" | "metadata-39";
  sourceNote?: string;
};

export type CourseCard = {
  id: string;
  title: string;
  summary: string;
  category: ContentCategory;
  goal: LearningGoalId;
  level: CefrCode;
  units: number;
  outcomes: string[];
};

export type LabStatus = "operativo" | "demostración" | "diseño";
export type LabRecord = {
  id: string;
  title: string;
  status: LabStatus;
  purpose: string;
  technology: string;
  limitation: string;
  externalService: boolean;
  category: ContentCategory;
};

export type StoryScenario = {
  id: string;
  title: string;
  context: string;
  decision: string;
  routeId: LearningGoalId;
  actionLabel: string;
  disclosure: string;
};

export type GlossaryEntry = {
  id: string;
  domain: "vida cotidiana" | "tecnología" | "aprendizaje";
  translations: Partial<Record<"es" | "en" | "pt", string>>;
  note: string;
};

export type LearningProject = {
  id: string;
  goalId: LearningGoalId;
  title: string;
  brief: string;
  deliverables: string[];
  criteria: string[];
  estimatedMinutes: number;
};

export const COURSE_CATALOG: CourseCard[] = [
  { id: "hablar-con-calma", title: "Hablar con calma en situaciones cotidianas", summary: "Construye mensajes cortos para presentarte, pedir ayuda y confirmar información.", category: "idiomas", goal: "everyday", level: "A1", units: 6, outcomes: ["Presentarte", "Hacer una petición", "Confirmar que has entendido"] },
  { id: "vida-digital-segura", title: "Vida digital segura", summary: "Aprende a reconocer cuentas, enlaces, contraseñas y señales de riesgo.", category: "tecnología", goal: "technology", level: "A1", units: 5, outcomes: ["Proteger una cuenta", "Distinguir un enlace", "Pedir apoyo"] },
  { id: "correo-y-formularios", title: "Correo, formularios y mensajes claros", summary: "Organiza una petición digital con asunto, contexto y siguiente paso.", category: "tecnología", goal: "technology", level: "A2", units: 7, outcomes: ["Escribir un correo", "Completar un formulario", "Revisar antes de enviar"] },
  { id: "logica-en-lenguaje-claro", title: "Lógica en lenguaje claro", summary: "Lee programas pequeños y relaciona condiciones, datos y resultados.", category: "programación", goal: "coding", level: "A1", units: 6, outcomes: ["Leer instrucciones", "Predecir resultados", "Explicar una condición"] },
  { id: "primeros-proyectos-web", title: "Primeros proyectos web", summary: "Une estructura, estilo y lenguaje para construir una página accesible.", category: "programación", goal: "coding", level: "A2", units: 8, outcomes: ["Estructurar HTML", "Escribir CSS", "Describir un proyecto"] },
  { id: "ia-para-preguntar", title: "IA para preguntar y comprobar", summary: "Formula peticiones con contexto, identifica límites y comprueba afirmaciones importantes.", category: "ia-responsable", goal: "ai-literacy", level: "A1", units: 6, outcomes: ["Dar contexto", "Pedir un formato", "Distinguir respuesta y fuente"] },
  { id: "ia-con-criterio", title: "IA con criterio", summary: "Practica la revisión, comparación de fuentes y mejora consciente de resultados de IA.", category: "ia-responsable", goal: "ai-literacy", level: "A2", units: 7, outcomes: ["Verificar", "Detectar incertidumbre", "Reformular una petición"] },
  { id: "presentar-tu-experiencia", title: "Presentar tu experiencia", summary: "Construye un perfil profesional y un CV legible, orientado a competencias reales.", category: "empleabilidad", goal: "everyday", level: "A2", units: 5, outcomes: ["Nombrar competencias", "Organizar experiencia", "Preparar una entrevista"] },
  { id: "informacion-con-criterio", title: "Información con criterio", summary: "Reconoce origen, fecha, propósito y señales de riesgo antes de compartir una información.", category: "tecnología", goal: "digital-citizenship", level: "A1", units: 6, outcomes: ["Reconocer una fuente", "Comprobar una fecha", "Evitar compartir por impulso"] },
  { id: "datos-y-decisiones", title: "Datos y decisiones", summary: "Comprende permisos, formularios y datos personales con lenguaje claro.", category: "tecnología", goal: "digital-citizenship", level: "A2", units: 5, outcomes: ["Leer un permiso", "Identificar un dato sensible", "Decidir qué compartir"] },
  { id: "portafolio-en-claro", title: "Portafolio en claro", summary: "Organiza experiencias, proyectos y aprendizajes en una historia profesional verificable.", category: "empleabilidad", goal: "professional-pathways", level: "A1", units: 5, outcomes: ["Nombrar una experiencia", "Explicar una acción", "Guardar una evidencia"] },
  { id: "proximo-paso-profesional", title: "Preparar tu próximo paso", summary: "Crea un perfil, una respuesta de entrevista y una lista de acciones sin prometer resultados laborales.", category: "empleabilidad", goal: "professional-pathways", level: "A2", units: 7, outcomes: ["Revisar un CV", "Preparar una entrevista", "Definir un próximo paso"] },
];

export const LEARNING_PROJECTS: LearningProject[] = [
  { id: "project-source-trace", goalId: "digital-citizenship", title: "Rastrear una información antes de compartirla", brief: "Elige una publicación o afirmación no sensible. Describe dónde apareció, localiza la fuente original si existe y explica qué datos te faltan para decidir.", deliverables: ["Enlace o referencia de la fuente", "Fecha y autoría disponibles", "Decisión razonada: compartir, esperar o no compartir"], criteria: ["Diferencias fuente y opinión", "Nombras información que no pudiste verificar", "Explicas tu decisión sin exagerar certeza"], estimatedMinutes: 25 },
  { id: "project-small-tool", goalId: "coding", title: "Diseñar una herramienta pequeña", brief: "Describe una tarea repetitiva y crea o adapta una regla, pseudocódigo o fragmento breve que indique qué datos necesita y qué resultado produce.", deliverables: ["Problema o necesidad", "Reglas o código breve", "Ejemplo de entrada y resultado esperado"], criteria: ["La secuencia se puede seguir", "Incluyes una condición o decisión", "Pruebas al menos un caso"], estimatedMinutes: 35 },
  { id: "project-ai-verification", goalId: "ai-literacy", title: "Pedir, contrastar y corregir con IA", brief: "Formula una pregunta de aprendizaje con contexto. Conserva la respuesta, contrástala con una fuente pertinente y explica qué mantuviste, corregiste o no pudiste confirmar.", deliverables: ["Petición con objetivo y contexto", "Fuente de contraste", "Nota de corrección o incertidumbre"], criteria: ["Diferencias la respuesta de IA de una fuente", "Indicas una comprobación concreta", "Declaras límites o dudas"], estimatedMinutes: 30 },
  { id: "project-evidence-story", goalId: "professional-pathways", title: "Convertir una experiencia en evidencia", brief: "Elige una tarea, experiencia o proyecto propio. Explica el contexto, la acción, las herramientas y el resultado sin añadir datos que no puedas sostener.", deliverables: ["Contexto de la situación", "Acciones y herramientas usadas", "Resultado y un aprendizaje"], criteria: ["La evidencia es específica", "No inventas resultados ni credenciales", "Relacionas la experiencia con una competencia"], estimatedMinutes: 30 },
  { id: "project-communication-bridge", goalId: "everyday", title: "Preparar un puente de comunicación", brief: "Prepara un mensaje breve para pedir, confirmar o explicar algo en una situación cotidiana. Puedes usar el idioma de apoyo, el idioma de estudio o ambos.", deliverables: ["Situación y destinatario", "Mensaje breve", "Una adaptación posible según la respuesta"], criteria: ["El objetivo es claro", "El lenguaje se ajusta al contexto", "Prevés una confirmación o siguiente paso"], estimatedMinutes: 20 },
  { id: "project-digital-workflow", goalId: "technology", title: "Documentar un flujo digital seguro", brief: "Explica los pasos para realizar una tarea digital frecuente, señalando qué dato o permiso requiere más atención y cómo confirmarías que el servicio es legítimo.", deliverables: ["Pasos ordenados", "Dato o permiso a proteger", "Comprobación de legitimidad"], criteria: ["Los pasos siguen un orden", "Reconoces un punto de riesgo", "Propones una acción de verificación"], estimatedMinutes: 25 },
];

export const RESOURCE_LIBRARY: ResourceItem[] = [
  { id: "guide-prompt-context", kind: "guía", category: "ia-responsable", title: "Una pregunta útil tiene contexto", summary: "Plantilla de objetivo, información disponible, restricciones y formato de respuesta.", duration: 8, level: "A1", tags: ["prompt", "verificación", "IA"], translationStatus: "es-en-pt" },
  { id: "guide-safe-passwords", kind: "guía", category: "tecnología", title: "Cuentas y contraseñas sin complicaciones", summary: "Una secuencia breve para crear, guardar y proteger accesos digitales.", duration: 7, level: "A1", tags: ["seguridad", "cuentas", "móvil"], translationStatus: "es-en-pt" },
  { id: "exercise-introduction", kind: "ejercicio", category: "idiomas", title: "Presentarte con intención", summary: "Práctica escrita y oral para decir quién eres y qué necesitas.", duration: 12, level: "A1", tags: ["diálogo", "oral", "A1"], translationStatus: "metadata-39" },
  { id: "glossary-web-basics", kind: "glosario", category: "tecnología", title: "Glosario: las palabras de la web", summary: "Cuenta, navegador, enlace, URL, verificación y privacidad explicados en lenguaje claro.", tags: ["glosario", "web", "bilingüe"], translationStatus: "es-en-pt" },
  { id: "code-js-conditions", kind: "ejercicio", category: "programación", title: "Variables y decisiones", summary: "Lee una condición en JavaScript y predice qué ocurrirá antes de ejecutar.", duration: 15, level: "A2", tags: ["JavaScript", "lógica", "código"], translationStatus: "metadata-39" },
  { id: "guide-cv-readable", kind: "guía", category: "empleabilidad", title: "Un CV que se puede leer", summary: "Lista de comprobación de estructura, evidencia y claridad para preparar un perfil profesional.", duration: 10, level: "A2", tags: ["CV", "empleo", "claridad"], translationStatus: "es-en-pt" },
  { id: "guide-focus-session", kind: "herramienta", category: "accesibilidad", title: "Sesión de foco de un solo paso", summary: "Configura duración, densidad y una intención para reducir cambios de contexto durante una actividad.", duration: 2, tags: ["foco", "metacognición", "preferencias"], translationStatus: "es-en-pt" },
  { id: "guide-voice-practice", kind: "guía", category: "idiomas", title: "Practicar tu respuesta oral", summary: "Guía para grabar una respuesta voluntaria, revisar la transcripción y ajustar una idea por vez.", duration: 8, level: "A1", tags: ["voz", "transcripción", "práctica"], translationStatus: "metadata-39" },
  { id: "guide-source-check", kind: "guía", category: "tecnología", title: "Antes de compartir: tres comprobaciones", summary: "Una guía de ciudadanía digital para revisar origen, fecha y propósito de una información.", duration: 9, level: "A1", tags: ["fuentes", "ciudadanía", "verificación"], translationStatus: "es-en-pt" },
  { id: "exercise-data-decision", kind: "ejercicio", category: "tecnología", title: "Decidir qué dato compartes", summary: "Compara situaciones y elige qué información es necesaria, opcional o mejor reservar.", duration: 12, level: "A2", tags: ["privacidad", "formularios", "decisión"], translationStatus: "metadata-39" },
  { id: "template-evidence-story", kind: "herramienta", category: "empleabilidad", title: "De tarea a evidencia", summary: "Plantilla para documentar contexto, acción, herramientas, resultado y aprendizaje sin exagerar méritos.", duration: 10, level: "A1", tags: ["portafolio", "competencias", "proyecto"], translationStatus: "es-en-pt" },
  { id: "guide-interview-reflection", kind: "guía", category: "empleabilidad", title: "Una entrevista se prepara con ejemplos", summary: "Guía para seleccionar una situación concreta, explicar una decisión y cerrar con lo aprendido.", duration: 13, level: "A2", tags: ["entrevista", "reflexión", "empleo"], translationStatus: "es-en-pt" },
];

export const LAB_CATALOG: LabRecord[] = [
  { id: "language-signal", title: "Señales de idioma", status: "operativo", purpose: "Explorar una detección local y orientativa de señales de idioma en un texto corto.", technology: "Reglas locales de escritura y vocabulario frecuente", limitation: "No sustituye un detector estadístico; no se envía texto a terceros.", externalService: false, category: "idiomas" },
  { id: "language-compare", title: "Comparador LinguaForge", status: "operativo", purpose: "Buscar conceptos básicos entre español, inglés y portugués y observar sus equivalencias.", technology: "Microglosario local curado y búsqueda normalizada", limitation: "No es un traductor general ni un diccionario exhaustivo; ofrece una base transparente para ampliar con proveedores.", externalService: false, category: "idiomas" },
  { id: "prompt-studio", title: "Estudio de prompts", status: "operativo", purpose: "Transformar una intención vaga en una petición con propósito, contexto y formato.", technology: "Plantillas locales y validación de estructura", limitation: "No genera una respuesta de IA; prepara una petición más clara.", externalService: false, category: "ia-responsable" },
  { id: "voice-lab", title: "Laboratorio de voz", status: "operativo", purpose: "Grabar una práctica voluntaria y obtener transcripción con comparación pedagógica.", technology: "MediaRecorder, almacenamiento controlado y STT del servidor", limitation: "Requiere sesión, permiso del micrófono, conexión y servicio de transcripción disponible.", externalService: true, category: "idiomas" },
  { id: "learning-focus", title: "Ritmo de aprendizaje", status: "operativo", purpose: "Configurar una sesión breve, una intención y una reflexión al terminar.", technology: "Preferencias del navegador y temporizador local", limitation: "Es un apoyo de organización, no un tratamiento ni una evaluación clínica.", externalService: false, category: "accesibilidad" },
  { id: "semantic-library", title: "Búsqueda semántica educativa", status: "diseño", purpose: "Relacionar una pregunta con recursos y contenidos por significado, manteniendo procedencia.", technology: "Adaptador de embeddings y ranking de fuentes", limitation: "La entrega actual usa búsqueda lexical local; necesita un modelo de embeddings y revisión de contenido.", externalService: false, category: "ia-responsable" },
  { id: "open-voice-adapter", title: "Adaptador de voz abierto", status: "diseño", purpose: "Habilitar motores locales o alojados de STT/TTS sin modificar la experiencia de estudiante.", technology: "Interfaz de proveedor STT/TTS compatible con el contrato de voz", limitation: "No está conectado a un motor local en esta entrega; requiere infraestructura de cómputo persistente.", externalService: false, category: "tecnología" },
];

export const LINGUAFORGE_MICRO_GLOSSARY: GlossaryEntry[] = [
  { id: "hello", domain: "vida cotidiana", translations: { es: "hola", en: "hello", pt: "olá" }, note: "Saludo breve para iniciar una conversación." },
  { id: "help", domain: "vida cotidiana", translations: { es: "ayuda", en: "help", pt: "ajuda" }, note: "Palabra útil para pedir apoyo de forma clara." },
  { id: "account", domain: "tecnología", translations: { es: "cuenta", en: "account", pt: "conta" }, note: "Perfil o acceso personal en un servicio digital." },
  { id: "password", domain: "tecnología", translations: { es: "contraseña", en: "password", pt: "palavra-passe" }, note: "Clave privada; nunca debe compartirse." },
  { id: "source", domain: "aprendizaje", translations: { es: "fuente", en: "source", pt: "fonte" }, note: "Origen que permite verificar una información." },
  { id: "practice", domain: "aprendizaje", translations: { es: "práctica", en: "practice", pt: "prática" }, note: "Actividad repetida con un objetivo de aprendizaje." },
];

export const STORY_SCENARIOS: StoryScenario[] = [
  { id: "new-language", title: "Una conversación que no quieres evitar", context: "Tienes que pedir una información sencilla en una lengua que todavía estás aprendiendo.", decision: "Empiezas con una frase breve, practicas una variación y preparas una respuesta oral.", routeId: "everyday", actionLabel: "Practicar una situación", disclosure: "Escenario de aprendizaje. No representa un testimonio ni una persona real." },
  { id: "first-digital-step", title: "Un trámite empieza con una pantalla", context: "Recibes un enlace y necesitas distinguir qué revisar antes de abrirlo o compartir información.", decision: "Recorres una lista breve, reconoces señales y eliges un siguiente paso seguro.", routeId: "technology", actionLabel: "Aprender seguridad básica", disclosure: "Escenario de aprendizaje. No representa un testimonio ni una persona real." },
  { id: "check-before-share", title: "Una información no se comparte sola", context: "Alguien te reenvía un mensaje urgente y no sabes quién lo publicó ni de qué fecha es.", decision: "Localizas la fuente, distingues una opinión y decides si necesitas comprobarlo antes de actuar.", routeId: "digital-citizenship", actionLabel: "Practicar ciudadanía digital", disclosure: "Escenario de aprendizaje. No representa un testimonio ni una persona real." },
  { id: "make-a-tool", title: "Una idea puede convertirse en herramienta", context: "Repites una tarea pequeña y quieres entender cómo una regla o un programa puede ayudarte.", decision: "Lees un ejemplo, predices su resultado y modificas una parte para crear una solución propia.", routeId: "coding", actionLabel: "Explorar programación", disclosure: "Escenario de aprendizaje. No representa un testimonio ni una persona real." },
  { id: "show-your-work", title: "Contar lo que sabes hacer", context: "Quieres presentar tu experiencia de forma clara, incluso si tus títulos o trabajos pertenecen a contextos distintos.", decision: "Organizas competencias, preparas un CV legible y ensayas una respuesta de entrevista.", routeId: "everyday", actionLabel: "Crear un perfil profesional", disclosure: "Escenario de aprendizaje. No representa un testimonio ni una persona real." },
];

const normalized = (value: string) => value.toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export function searchResources(query: string, category?: ContentCategory) {
  const terms = normalized(query).split(/\s+/).filter((term) => term.length > 1);
  return RESOURCE_LIBRARY.filter((resource) => {
    if (category && resource.category !== category) return false;
    if (terms.length === 0) return true;
    const haystack = normalized([resource.title, resource.summary, resource.category, ...resource.tags].join(" "));
    return terms.every((term) => haystack.includes(term));
  });
}

export function lookupLocalGlossary(query: string, sourceLanguage: "es" | "en" | "pt") {
  const term = normalized(query).trim();
  if (!term) return undefined;
  return LINGUAFORGE_MICRO_GLOSSARY.find((entry) => normalized(entry.translations[sourceLanguage] ?? "") === term);
}

export function recommendResources(historyIds: string[], favoriteIds: string[]) {
  const activeIds = [...favoriteIds, ...historyIds];
  const activeResources = activeIds.map((id) => RESOURCE_LIBRARY.find((resource) => resource.id === id)).filter((resource): resource is ResourceItem => Boolean(resource));
  const preferredCategories = new Set(activeResources.map((resource) => resource.category));
  return RESOURCE_LIBRARY
    .filter((resource) => !activeIds.includes(resource.id))
    .sort((left, right) => Number(preferredCategories.has(right.category)) - Number(preferredCategories.has(left.category)) || left.title.localeCompare(right.title))
    .slice(0, 3);
}

export function detectLanguageSignal(text: string) {
  const candidate = normalized(text);
  if (!candidate.trim()) return { language: "Sin señal suficiente", confidence: "baja", explanation: "Escribe una frase corta para explorar sus señales." };
  if (/[\u0600-\u06ff]/.test(text)) return { language: "Árabe o urdu", confidence: "media", explanation: "Se detectó escritura árabe. Una frase más larga ayuda a distinguir con mayor precisión." };
  if (/[\u4e00-\u9fff]/.test(text)) return { language: "Chino", confidence: "alta", explanation: "Se detectaron caracteres Han." };
  if (/[\u0900-\u097f]/.test(text)) return { language: "Hindi o nepalí", confidence: "media", explanation: "Se detectó escritura devanagari." };
  if (/\b(the|and|with|this|that|hello)\b/.test(candidate)) return { language: "Inglés", confidence: "media", explanation: "Se encontraron palabras frecuentes de inglés." };
  if (/\b(que|para|con|una|hola|gracias)\b/.test(candidate)) return { language: "Español", confidence: "media", explanation: "Se encontraron palabras frecuentes de español." };
  if (/\b(que|para|com|ola|obrigado)\b/.test(candidate)) return { language: "Portugués", confidence: "media", explanation: "Se encontraron palabras frecuentes de portugués." };
  if (/\b(le|la|les|bonjour|merci|avec)\b/.test(candidate)) return { language: "Francés", confidence: "media", explanation: "Se encontraron palabras frecuentes de francés." };
  return { language: "Señal no concluyente", confidence: "baja", explanation: "El detector local necesita más texto o una señal de escritura distintiva." };
}
