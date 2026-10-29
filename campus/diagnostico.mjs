const ROUTES = Object.freeze({
  translate: { title: "Traducción y adaptación", href: "cursos/forja-linguistica/syllabus.md", action: "Abrir el programa", detail: "Empieza por los criterios de contexto, registro y revisión de traducciones." },
  voice: { title: "Escucha y práctica oral", href: "index.html#voz", action: "Escuchar audios", detail: "Escucha los ejemplos y anota dos expresiones que quieras practicar." },
  quiz: { title: "Autoevaluación formativa", href: "index.html#quiz", action: "Hacer el quiz", detail: "Comprueba tus respuestas y revisa la explicación antes de repetir el ejercicio." },
  plan: { title: "Ruta de cuatro semanas", href: "ruta.html", action: "Abrir mi ruta", detail: "Sigue el itinerario y registra las actividades completadas en tu dispositivo." }
});
const LEVELS = new Set(["inicio", "practica", "autonomia"]);
const PACES = new Set(["10", "20", "40"]);
export function recommendRoute({ goal, level, pace }) {
  if (!Object.hasOwn(ROUTES, goal) || !LEVELS.has(level) || !PACES.has(pace)) {
    throw new RangeError("Selecciona una opción válida en los tres campos.");
  }
  const route = ROUTES[goal];
  const duration = Number(pace);
  const introduction = level === "inicio"
    ? "Empieza por una lectura guiada, sin presuponer conocimientos previos."
    : level === "practica"
      ? "Recupera lo aprendido con una práctica corta y una revisión."
      : "Trabaja con ejemplos propios y revisa tus decisiones con criterio.";
  return {
    ...route,
    summary: route.detail + " " + introduction,
    firstStep: duration === 10
      ? "Reserva 10 minutos: identifica una idea, aplícala y anota una duda."
      : duration === 20
        ? "Reserva 20 minutos: estudia, realiza un ejercicio y explica tu resultado."
        : "Reserva 40 minutos: estudia, practica y revisa una producción propia.",
    note: "Orientación educativa, no diagnóstico oficial ni certificación. No se envían ni guardan tus respuestas."
  };
}
if (typeof document !== "undefined") {
  const form = document.querySelector("#diagnostic-form");
  const result = document.querySelector("#resultado");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    try {
      const entries = new FormData(form);
      const rec = recommendRoute({
        goal: entries.get("goal"), level: entries.get("level"), pace: entries.get("pace")
      });
      result.querySelector("h2").textContent = rec.title;
      result.querySelector("[data-summary]").textContent = rec.summary;
      result.querySelector("[data-step]").textContent = rec.firstStep;
      result.querySelector("[data-note]").textContent = rec.note;
      const link = result.querySelector("[data-action]");
      link.href = rec.href;
      link.textContent = rec.action;
      result.hidden = false;
      result.querySelector("h2").focus();
    } catch {
      result.hidden = false;
      result.querySelector("h2").textContent = "Revisa tus respuestas";
      result.querySelector("[data-summary]").textContent = "Selecciona una opción en cada campo.";
      result.querySelector("[data-step]").textContent = "";
      result.querySelector("[data-note]").textContent = "";
      result.querySelector("[data-action]").hidden = true;
      result.querySelector("h2").focus();
      return;
    }
    result.querySelector("[data-action]").hidden = false;
  });
}
