// Small, independently testable quiz contract for the static LinguaForge campus.
// Treat course JSON as untrusted; render text only using textContent.
export function parseQuiz(data) {
  if (!Array.isArray(data) || data.length < 1 || data.length > 100) {
    throw new TypeError("A quiz must contain between 1 and 100 questions");
  }
  return data.map((entry, index) => {
    if (!entry || typeof entry !== "object" || Array.isArray(entry) ||
      typeof entry.pregunta !== "string" || !entry.pregunta.trim() ||
      !Array.isArray(entry.opciones) || entry.opciones.length < 2 || entry.opciones.length > 8 ||
      entry.opciones.some(value => typeof value !== "string" || !value.trim()) ||
      !Number.isInteger(entry.correcta) || entry.correcta < 0 || entry.correcta >= entry.opciones.length ||
      typeof entry.explicacion !== "string" || !entry.explicacion.trim()) {
      throw new TypeError("Invalid quiz question at index " + index);
    }
    return {
      pregunta: entry.pregunta.trim(),
      opciones: entry.opciones.map(value => value.trim()),
      correcta: entry.correcta,
      explicacion: entry.explicacion.trim(),
    };
  });
}

export function answerClass(index, chosenIndex, correctIndex) {
  if (index === correctIndex) return "correcta";
  if (index === chosenIndex) return "fallo";
  return "";
}
