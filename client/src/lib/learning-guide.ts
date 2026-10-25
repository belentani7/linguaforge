import { LINGUAFORGE_MICRO_GLOSSARY } from "@shared/content";

/**
 * Deterministic learning guidance, available without an account or an API.
 * This is NOT a generative AI tutor or an assessment of language proficiency.
 * Learner input is processed only in memory on this device.
 */
export type GuideTask = "explain" | "practice" | "review";

const normalise = (value: string) =>
  value.toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

function knownConcept(question: string) {
  const clean = normalise(question);
  return LINGUAFORGE_MICRO_GLOSSARY.find((item) =>
    Object.values(item.translations).some((translation) => {
      const term = normalise(translation);
      return new RegExp("(^|[^a-z])" + term.replace(/[.*+?^${}()|[\][\\]/g, "\\$&") + "([^a-z]|$)", "u").test(clean);
    }),
  );
}

export function guideReply(task: GuideTask, raw: string): string {
  const text = raw.trim().slice(0, 2000);
  if (!text) return "Escribe una palabra, una pregunta o una frase para comenzar.";
  if (task === "explain") {
    const entry = knownConcept(text);
    if (entry) {
      return [
        "**Microglosario local · " + entry.domain + "**",
        "Español: " + entry.translations.es,
        "English: " + entry.translations.en,
        "Português: " + entry.translations.pt,
        entry.note,
        "",
        "Práctica: usa esta palabra en una frase de tu vida diaria.",
        "La guía cubre solo las entradas revisadas del microglosario; no es un traductor general.",
      ].join("\n");
    }
    return [
      "Para comprender tu pregunta, usa esta secuencia de aprendizaje:",
      "1. Identifica la palabra o la acción central.",
      "2. Escríbela en una frase sencilla y explica cuándo la usarías.",
      "3. Consulta la biblioteca y comprueba el significado en una fuente apropiada.",
      "4. Vuelve aquí para practicar o revisar tu ejemplo.",
      "",
      "Esta guía local no inventa una explicación especializada que no está en el catálogo.",
    ].join("\n");
  }

  if (task === "practice") {
    return [
      "**Práctica guiada · 5 minutos**",
      "1. Elige una situación real en la que utilizarías el concepto que has escrito.",
      "2. Escribe dos frases: qué necesitas y qué harías primero.",
      "3. Añade una pregunta que pedirías a otra persona para aclarar el contexto.",
      "4. Léelo en voz alta y simplifica una frase que te resulte difícil.",
      "5. Compara tu respuesta con el objetivo de una lección del catálogo.",
      "",
      "Puedes seleccionar «Revisar» para recibir una lista local de comprobación.",
    ].join("\n");
  }

  const sentences = text.split(/[.!?\n]+/u).map((value) => value.trim()).filter(Boolean);
  const longSentences = sentences.filter((value) => value.split(/\s+/u).length > 30).length;
  const checks = [
    "Has escrito " + text.length + " caracteres y " + sentences.length + " segmentos de frase (aproximados).",
    longSentences ? longSentences + " segmento(s) superan 30 palabras: prueba a separarlos." : "No he detectado segmentos de más de 30 palabras.",
    text.length < 30 ? "Amplía con un ejemplo concreto para poder revisar tu intención." : "Comprueba que cada idea tiene un ejemplo o una razón.",
    "Revisa la claridad, la concordancia y el vocabulario con una persona o fuente fiable.",
  ];
  return [
    "**Revisión formal local — no es una corrección lingüística automática**",
    ...checks.map((value, index) => (index + 1) + ". " + value),
    "",
    "No asigno nota CEFR ni afirmo haber comprobado gramática o hechos.",
  ].join("\n");
}
