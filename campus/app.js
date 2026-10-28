import { parseQuiz, answerClass } from "./quiz-logic.mjs";

document.documentElement.classList.add("js");
const $ = (sel, root = document) => root.querySelector(sel);

async function loadQuiz(url, box) {
  const title = $(".quiz-titulo", box);
  const options = $(".opciones", box);
  const feedback = $(".feedback", box);
  const marker = $(".marcador", box);
  const next = $(".quiz-siguiente", box);
  let questions;
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error("Unable to load quiz");
    questions = parseQuiz(await response.json());
  } catch {
    title.textContent = "No se pudo cargar el quiz. Consulta el programa del curso y vuelve a intentarlo más tarde.";
    box.setAttribute("aria-busy", "false");
    return;
  }
  box.setAttribute("aria-busy", "false");
  let index = 0;
  let score = 0;
  let finished = false;

  const render = () => {
    const question = questions[index];
    title.textContent = (index + 1) + "/" + questions.length + " · " + question.pregunta;
    options.replaceChildren();
    feedback.textContent = "";
    marker.textContent = "Aciertos: " + score;
    next.hidden = true;
    next.textContent = "Siguiente pregunta";
    question.opciones.forEach((label, answer) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "opcion";
      button.textContent = label;
      button.addEventListener("click", () => {
        // Disable ALL answers immediately: score can increase only once per question.
        [...options.children].forEach((item, i) => {
          const state = answerClass(i, answer, question.correcta);
          if (state) item.classList.add(state);
          item.disabled = true;
        });
        const correct = answer === question.correcta;
        if (correct) score++;
        feedback.textContent = (correct ? "Correcto. " : "Incorrecto. ") + question.explicacion;
        marker.textContent = "Aciertos: " + score;
        next.hidden = false;
        next.focus();
      });
      options.append(button);
    });
  };

  next.addEventListener("click", () => {
    if (finished) {
      index = 0;
      score = 0;
      finished = false;
      render();
    } else {
      index++;
      if (index >= questions.length) {
        finished = true;
        title.textContent = "Quiz terminado: " + score + "/" + questions.length;
        options.replaceChildren();
        feedback.textContent = score >= questions.length * 0.7 ?
          "Nivel superado. Puedes repetir el quiz para practicar." :
          "Repasa el material y vuelve a intentarlo.";
        marker.textContent = "";
        next.textContent = "Repetir quiz";
        next.hidden = false;
      } else {
        render();
      }
    }
    title.focus({ preventScroll: true });
  });
  render();
}

// Small entrance animation, never forced on people preferring reduced motion.
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!reduced) {
  document.querySelectorAll(".card").forEach((el, i) => {
    el.style.animation = "rise var(--dur-slow) var(--ease-out) both";
    el.style.animationDelay = Math.min(i * 60, 300) + "ms";
  });
  const style = document.createElement("style");
  style.textContent = "@keyframes rise{from{opacity:0;transform:translateY(8px)}}";
  document.head.append(style);
}

window.uiAudit = () => {
  const issues = [];
  document.querySelectorAll("img:not([alt])").forEach(() => issues.push("img sin alt"));
  document.querySelectorAll("a, button").forEach(el => {
    const rect = el.getBoundingClientRect();
    if ((rect.width < 44 || rect.height < 44) && !el.disabled)
      issues.push("Target pequeno: " + el.tagName);
  });
  return issues;
};

// Offline scope remains restricted to /campus/ in sw.js.
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}

document.querySelectorAll(".quiz-json").forEach(el => {
  const url = el.dataset.src;
  if (url) loadQuiz(url, el);
});
