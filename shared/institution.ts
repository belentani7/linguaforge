export const CEFR_LEVELS = [
  { code: "A1", title: "Descubrimiento", description: "Intercambios cotidianos esenciales." },
  { code: "A2", title: "Fundamentos", description: "Interacciones sencillas y frecuentes." },
  { code: "B1", title: "Independencia", description: "Participación en situaciones familiares." },
  { code: "B2", title: "Autonomía", description: "Argumentación y comprensión de ideas complejas." },
  { code: "C1", title: "Dominio operativo", description: "Comunicación flexible, precisa y eficaz." },
  { code: "C2", title: "Competencia avanzada", description: "Comprensión y expresión con alto grado de matiz." },
] as const;

export type CefrCode = (typeof CEFR_LEVELS)[number]["code"];

export const LEARNING_GOALS = [
  {
    id: "everyday",
    title: "Comunicación cotidiana",
    shortTitle: "Vida cotidiana",
    description: "Presentarte, pedir ayuda, resolver situaciones y conversar con confianza.",
    color: "terracotta",
  },
  {
    id: "technology",
    title: "Tecnología para la vida",
    shortTitle: "Tecnología",
    description: "Usar el móvil, la web, el correo y herramientas digitales de forma segura.",
    color: "ochre",
  },
  {
    id: "coding",
    title: "Programación y lógica",
    shortTitle: "Programación",
    description: "Leer, escribir y explicar código básico en un entorno internacional.",
    color: "indigo",
  },
  {
    id: "ai-literacy",
    title: "Alfabetización en IA",
    shortTitle: "IA responsable",
    description: "Comprender, preguntar y verificar resultados de IA con criterio.",
    color: "sage",
  },
  {
    id: "digital-citizenship",
    title: "Ciudadanía digital",
    shortTitle: "Ciudadanía digital",
    description: "Comprender derechos, información, seguridad y participación responsable en espacios digitales.",
    color: "sky",
  },
  {
    id: "professional-pathways",
    title: "Trayectorias profesionales",
    shortTitle: "Trayectorias",
    description: "Reconocer competencias, mostrar proyectos y preparar próximos pasos profesionales con dignidad.",
    color: "plum",
  },
] as const;

export type LearningGoalId = (typeof LEARNING_GOALS)[number]["id"];

export type InstitutionFaculty = {
  id: "languages" | "digital-citizenship" | "technology" | "coding" | "ai" | "professional-pathways";
  title: string;
  subtitle: string;
  description: string;
  goals: LearningGoalId[];
  capability: string;
  color: "terracotta" | "ochre" | "indigo" | "sage" | "sky" | "plum";
};

export const INSTITUTION_FACULTIES: InstitutionFaculty[] = [
  { id: "languages", title: "Lenguas y comunicación", subtitle: "LinguaForge", description: "Comprender, expresarte, conversar y crear puentes entre lenguas y contextos.", goals: ["everyday"], capability: "Comunicación situada", color: "terracotta" },
  { id: "digital-citizenship", title: "Ciudadanía digital", subtitle: "Derechos y participación", description: "Navegar información, seguridad, trámites y vida pública con criterio.", goals: ["digital-citizenship"], capability: "Decidir con información", color: "sky" },
  { id: "technology", title: "Tecnología aplicada", subtitle: "Herramientas cotidianas", description: "Usar dispositivos, web y herramientas digitales de forma segura y autónoma.", goals: ["technology"], capability: "Resolver tareas reales", color: "ochre" },
  { id: "coding", title: "Programación creativa", subtitle: "Lógica y creación", description: "Leer, construir y explicar sistemas sencillos para convertir ideas en herramientas.", goals: ["coding"], capability: "Crear con código", color: "indigo" },
  { id: "ai", title: "IA responsable", subtitle: "Comprensión crítica", description: "Preguntar, contrastar, crear y reconocer límites de los sistemas inteligentes.", goals: ["ai-literacy"], capability: "Usar IA con criterio", color: "sage" },
  { id: "professional-pathways", title: "Trayectorias y oportunidades", subtitle: "Competencias visibles", description: "Organizar experiencia, proyectos, perfiles y preparación profesional sin inventar méritos.", goals: ["professional-pathways"], capability: "Presentar lo que sabes hacer", color: "plum" },
];

export const INSTITUTION_COMPETENCIES = [
  { id: "communication", title: "Comunicar", description: "Comprender y expresar una idea para otra persona." },
  { id: "digital", title: "Navegar", description: "Usar información y herramientas digitales con seguridad." },
  { id: "creation", title: "Crear", description: "Convertir una necesidad o idea en una solución o proyecto." },
  { id: "critical", title: "Contrastar", description: "Reconocer límites, comparar evidencia y decidir con criterio." },
  { id: "pathway", title: "Proyectar", description: "Reconocer competencias y definir un siguiente paso propio." },
] as const;

export type CompetencyId = (typeof INSTITUTION_COMPETENCIES)[number]["id"];
export type CompetencySignals = Record<CompetencyId, number>;

export function recommendInstitutionalPath(signals: CompetencySignals) {
  const ranked = Object.entries(signals).sort(([, left], [, right]) => left - right) as [CompetencyId, number][];
  const primaryCompetency = ranked[0][0];
  const companionCompetency = ranked[1][0];
  const goalByCompetency: Record<CompetencyId, LearningGoalId> = {
    communication: "everyday",
    digital: "digital-citizenship",
    creation: "coding",
    critical: "ai-literacy",
    pathway: "professional-pathways",
  };
  return {
    primaryCompetency,
    companionCompetency,
    primaryGoal: goalByCompetency[primaryCompetency],
    companionGoal: goalByCompetency[companionCompetency],
  };
}

export type CatalogLanguage = {
  code: string;
  locale: string;
  name: string;
  nativeName: string;
  script: string;
  direction: "ltr" | "rtl";
};

export const LANGUAGE_CATALOG: CatalogLanguage[] = [
  { code: "ak", locale: "ak", name: "Akan", nativeName: "Akan", script: "Latina", direction: "ltr" },
  { code: "am", locale: "am", name: "Amárico", nativeName: "አማርኛ", script: "Etíope", direction: "ltr" },
  { code: "ar", locale: "ar", name: "Árabe", nativeName: "العربية", script: "Árabe", direction: "rtl" },
  { code: "ay", locale: "ay", name: "Aimara", nativeName: "Aymar aru", script: "Latina", direction: "ltr" },
  { code: "bm", locale: "bm", name: "Bambara", nativeName: "Bamanankan", script: "Latina", direction: "ltr" },
  { code: "bn", locale: "bn", name: "Bengalí", nativeName: "বাংলা", script: "Bengalí", direction: "ltr" },
  { code: "ee", locale: "ee", name: "Ewe", nativeName: "Eʋegbe", script: "Latina", direction: "ltr" },
  { code: "en", locale: "en", name: "Inglés", nativeName: "English", script: "Latina", direction: "ltr" },
  { code: "es", locale: "es", name: "Español", nativeName: "Español", script: "Latina", direction: "ltr" },
  { code: "ff", locale: "ff", name: "Fula", nativeName: "Pulaar", script: "Latina", direction: "ltr" },
  { code: "fr", locale: "fr", name: "Francés", nativeName: "Français", script: "Latina", direction: "ltr" },
  { code: "gn", locale: "gn", name: "Guaraní", nativeName: "Avañe'ẽ", script: "Latina", direction: "ltr" },
  { code: "ha", locale: "ha", name: "Hausa", nativeName: "Hausa", script: "Latina", direction: "ltr" },
  { code: "hi", locale: "hi", name: "Hindi", nativeName: "हिन्दी", script: "Devanagari", direction: "ltr" },
  { code: "ht", locale: "ht", name: "Criollo haitiano", nativeName: "Kreyòl ayisyen", script: "Latina", direction: "ltr" },
  { code: "ig", locale: "ig", name: "Igbo", nativeName: "Igbo", script: "Latina", direction: "ltr" },
  { code: "kg", locale: "kg", name: "Kongo", nativeName: "Kikongo", script: "Latina", direction: "ltr" },
  { code: "km", locale: "km", name: "Jemer", nativeName: "ខ្មែរ", script: "Jemer", direction: "ltr" },
  { code: "ln", locale: "ln", name: "Lingala", nativeName: "Lingála", script: "Latina", direction: "ltr" },
  { code: "lo", locale: "lo", name: "Lao", nativeName: "ລາວ", script: "Lao", direction: "ltr" },
  { code: "mg", locale: "mg", name: "Malgache", nativeName: "Malagasy", script: "Latina", direction: "ltr" },
  { code: "my", locale: "my", name: "Birmano", nativeName: "မြန်မာ", script: "Myanmar", direction: "ltr" },
  { code: "ne", locale: "ne", name: "Nepalí", nativeName: "नेपाली", script: "Devanagari", direction: "ltr" },
  { code: "om", locale: "om", name: "Oromo", nativeName: "Afaan Oromoo", script: "Latina", direction: "ltr" },
  { code: "pt", locale: "pt", name: "Portugués", nativeName: "Português", script: "Latina", direction: "ltr" },
  { code: "qu", locale: "qu", name: "Quechua", nativeName: "Runa Simi", script: "Latina", direction: "ltr" },
  { code: "ro", locale: "ro", name: "Rumano", nativeName: "Română", script: "Latina", direction: "ltr" },
  { code: "rw", locale: "rw", name: "Kinyarwanda", nativeName: "Ikinyarwanda", script: "Latina", direction: "ltr" },
  { code: "so", locale: "so", name: "Somalí", nativeName: "Soomaali", script: "Latina", direction: "ltr" },
  { code: "sw", locale: "sw", name: "Suajili", nativeName: "Kiswahili", script: "Latina", direction: "ltr" },
  { code: "ti", locale: "ti", name: "Tigriña", nativeName: "ትግርኛ", script: "Etíope", direction: "ltr" },
  { code: "tl", locale: "tl", name: "Tagalo", nativeName: "Tagalog", script: "Latina", direction: "ltr" },
  { code: "tw", locale: "tw", name: "Twi", nativeName: "Twi", script: "Latina", direction: "ltr" },
  { code: "uk", locale: "uk", name: "Ucraniano", nativeName: "Українська", script: "Cirílica", direction: "ltr" },
  { code: "ur", locale: "ur", name: "Urdu", nativeName: "اردو", script: "Árabe", direction: "rtl" },
  { code: "wo", locale: "wo", name: "Wólof", nativeName: "Wolof", script: "Latina", direction: "ltr" },
  { code: "yo", locale: "yo", name: "Yoruba", nativeName: "Yorùbá", script: "Latina", direction: "ltr" },
  { code: "zh", locale: "zh-Hans", name: "Chino mandarín", nativeName: "中文", script: "Han", direction: "ltr" },
  { code: "zu", locale: "zu", name: "Zulú", nativeName: "isiZulu", script: "Latina", direction: "ltr" },
];

export type CurriculumLesson = {
  id: string;
  goalId: LearningGoalId;
  level: CefrCode;
  title: string;
  objective: string;
  minutes: number;
  activity: "dialogue" | "practice" | "code" | "reflection";
  prompt: string;
  expected: string;
};

export const CURRICULUM_LESSONS: CurriculumLesson[] = [
  { id: "everyday-a1-introductions", goalId: "everyday", level: "A1", title: "Presentarte y pedir ayuda", objective: "Intercambiar información personal básica y formular una petición breve.", minutes: 12, activity: "dialogue", prompt: "Completa: «Hola, me llamo ____. ¿Puedes ayudarme, por favor?»", expected: "Tu nombre y una petición cordial." },
  { id: "everyday-a2-routines", goalId: "everyday", level: "A2", title: "Tu rutina y tu barrio", objective: "Describir hábitos y orientarte en situaciones locales frecuentes.", minutes: 16, activity: "practice", prompt: "Describe en tres frases una rutina que haces cada semana.", expected: "Tres frases con tiempo, acción y lugar." },
  { id: "technology-a1-browser", goalId: "technology", level: "A1", title: "Navegar y proteger tu cuenta", objective: "Reconocer una URL, crear una contraseña robusta y pedir ayuda digital.", minutes: 14, activity: "practice", prompt: "¿Qué datos nunca deberías compartir en un chat o formulario desconocido?", expected: "Contraseñas, códigos de acceso y documentos personales." },
  { id: "technology-a2-email", goalId: "technology", level: "A2", title: "Escribir un correo útil", objective: "Redactar un correo breve con asunto, petición y despedida.", minutes: 18, activity: "dialogue", prompt: "Escribe un asunto y dos frases para solicitar información sobre un curso.", expected: "Un asunto claro, saludo, petición y cierre." },
  { id: "coding-a1-reading", goalId: "coding", level: "A1", title: "Leer un programa simple", objective: "Identificar datos, instrucciones y resultado en un fragmento de código.", minutes: 15, activity: "code", prompt: "¿Qué mostrará console.log('Hola')?", expected: "Mostrará el texto Hola en la consola." },
  { id: "coding-a2-variables", goalId: "coding", level: "A2", title: "Variables y decisiones", objective: "Usar variables simples y explicar una condición if/else.", minutes: 20, activity: "code", prompt: "Completa: const idioma = 'es'; if (idioma === 'es') { ____ }", expected: "Una instrucción que se ejecute cuando el idioma sea español." },
  { id: "ai-literacy-a1-questions", goalId: "ai-literacy", level: "A1", title: "Preguntar con contexto", objective: "Formular una petición concreta y reconocer límites de una respuesta de IA.", minutes: 14, activity: "reflection", prompt: "Convierte «ayúdame con IA» en una pregunta que indique objetivo, idioma y formato.", expected: "Una petición concreta con contexto suficiente." },
  { id: "ai-literacy-a2-verification", goalId: "ai-literacy", level: "A2", title: "Verificar antes de usar", objective: "Distinguir una sugerencia de una fuente y verificar información importante.", minutes: 18, activity: "reflection", prompt: "Indica dos pasos para comprobar una respuesta de IA sobre un trámite o una norma.", expected: "Consultar una fuente primaria y contrastar la fecha o un profesional competente." },
  { id: "digital-citizenship-a1-information", goalId: "digital-citizenship", level: "A1", title: "Reconocer una fuente y una opinión", objective: "Distinguir quién publica una información, cuándo y con qué propósito.", minutes: 16, activity: "reflection", prompt: "Antes de compartir una noticia, ¿qué dos datos revisarías?", expected: "La autoría, la fecha y la fuente original antes de compartir." },
  { id: "digital-citizenship-a2-rights", goalId: "digital-citizenship", level: "A2", title: "Tus datos, tu decisión", objective: "Reconocer qué datos personales requieren más cuidado en un formulario o servicio.", minutes: 18, activity: "practice", prompt: "Menciona dos datos que no enviarías en un enlace desconocido y explica por qué.", expected: "Datos de acceso o documentos personales, con una razón de seguridad." },
  { id: "professional-pathways-a1-skills", goalId: "professional-pathways", level: "A1", title: "Nombrar una competencia con un ejemplo", objective: "Relacionar una capacidad propia con una situación en la que la utilizaste.", minutes: 15, activity: "reflection", prompt: "Escribe: «Sé ___ porque en ___ hice ___.»", expected: "Una competencia, un contexto y una acción concreta." },
  { id: "professional-pathways-a2-portfolio", goalId: "professional-pathways", level: "A2", title: "Convertir una tarea en evidencia", objective: "Describir un proyecto o experiencia de forma clara y comprobable.", minutes: 20, activity: "practice", prompt: "Describe una tarea que realizaste: objetivo, herramientas y resultado.", expected: "Una descripción con contexto, acción y resultado sin inventar información." },
];

export const CORE_UI_COPY = {
  es: { learn: "Aprender", catalog: "Idiomas", library: "Biblioteca", tutor: "Tutor", dashboard: "Mi espacio", begin: "Comenzar mi ruta", signIn: "Entrar", language: "Idioma", support: "Apoyo en español" },
  en: { learn: "Learn", catalog: "Languages", library: "Library", tutor: "Tutor", dashboard: "My space", begin: "Start my path", signIn: "Sign in", language: "Language", support: "Support in English" },
  pt: { learn: "Aprender", catalog: "Idiomas", library: "Biblioteca", tutor: "Tutor", dashboard: "Meu espaço", begin: "Começar minha rota", signIn: "Entrar", language: "Idioma", support: "Apoio em português" },
} as const;

export function getLanguage(code: string) {
  return LANGUAGE_CATALOG.find((language) => language.code === code);
}

export function getGoal(goalId: LearningGoalId) {
  return LEARNING_GOALS.find((goal) => goal.id === goalId);
}

export function getLessons(goalId: LearningGoalId, level?: CefrCode) {
  return CURRICULUM_LESSONS.filter((lesson) => lesson.goalId === goalId && (!level || lesson.level === level));
}
