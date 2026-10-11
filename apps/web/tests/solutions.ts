/**
 * Soluciones de referencia de cada lección publicada. Solo existen en la suite de pruebas:
 * sirven para demostrar que cada lección es resoluble y que sus pruebas no son triviales.
 * Nunca se incluyen en el contenido que ve el alumno.
 */
export const SOLUTIONS: Record<string, string> = {
  "js-asincrono": `
async function sumarDespues(a, b) {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return a + b;
}`,
  "json-sse": `
function parsearEventos(texto) {
  const eventos = [];
  for (const linea of texto.split('\\n')) {
    if (!linea.startsWith('data:')) continue;
    const carga = linea.slice(5).trim();
    if (carga === '[DONE]' || carga === '') continue;
    try { eventos.push(JSON.parse(carga)); } catch { /* fragmento inválido */ }
  }
  return eventos;
}`,
  "few-shot": `
function construirPrompt(ejemplos, pregunta) {
  const bloques = ejemplos.map((e) => 'Entrada: ' + e.entrada + '\\nSalida: ' + e.salida + '\\n\\n');
  return bloques.join('') + 'Entrada: ' + pregunta + '\\nSalida:';
}`,
  "salida-json-schema": `
function validarRespuesta(obj) {
  if (typeof obj?.titulo !== 'string' || obj.titulo.trim().length === 0) return false;
  return Number.isInteger(obj.puntuacion) && obj.puntuacion >= 0 && obj.puntuacion <= 10;
}`,
  "tool-calling": `
function ejecutarHerramienta(registro, nombre, args) {
  if (!Object.prototype.hasOwnProperty.call(registro, nombre)) {
    return { error: 'herramienta_desconocida', nombre };
  }
  return { ok: registro[nombre](...args) };
}`,
  "memoria-agente": `
function recortarMemoria(mensajes, max) {
  const sistema = mensajes[0]?.role === 'system' ? [mensajes[0]] : [];
  const resto = mensajes.slice(sistema.length);
  const cupo = max - sistema.length;
  return cupo > 0 ? [...sistema, ...resto.slice(-cupo)] : sistema;
}`,
  "reintentos-resiliencia": `
async function reintentar(fn, intentos) {
  let ultimo;
  for (let i = 0; i < intentos; i++) {
    try { return await fn(); } catch (err) { ultimo = err; }
  }
  throw ultimo;
}`,
  "evaluar-agente": `
function puntuarRespuesta(respuesta, palabrasClave) {
  if (palabrasClave.length === 0) return 0;
  const texto = respuesta.toLowerCase();
  const aciertos = palabrasClave.filter((p) => texto.includes(p.toLowerCase())).length;
  return Math.round((aciertos / palabrasClave.length) * 100) / 100;
}`,
};
