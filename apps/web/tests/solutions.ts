/**
 * Soluciones de referencia de cada lección publicada. Solo existen en la suite de pruebas:
 * sirven para demostrar que cada lección es resoluble y que sus pruebas no son triviales.
 * Nunca se incluyen en el contenido que ve el alumno.
 */
export const SOLUTIONS: Record<string, string> = {

  "css-moderno": String.raw`
function calcularClamp(minPx, maxPx, minVw, maxVw) {
  const pendiente = (maxPx - minPx) / (maxVw - minVw);
  return { min: minPx, max: maxPx, vwPendiente: pendiente * 100, origenPx: minPx - pendiente * minVw };
}
function valorEn(config, anchoPx) {
  const bruto = config.origenPx + (config.vwPendiente * anchoPx) / 100;
  const acotado = Math.min(config.max, Math.max(config.min, bruto));
  return Math.round(acotado * 100) / 100;
}`,
  "git-flujo": String.raw`
const TIPOS = ["feat", "fix", "docs", "chore"];
function nombreRama(tipo, descripcion) {
  if (!TIPOS.includes(tipo)) return null;
  const slug = descripcion
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
    .slice(0, 40).replace(/-+$/, "");
  return tipo + "/" + slug;
}`,
  "cot-autoevaluacion": String.raw`
const MARCADOR = "Respuesta final:";
function construirPromptCoT(pregunta) {
  return "Pregunta: " + pregunta + "\nRazona paso a paso y termina con una línea que empiece por \"" + MARCADOR + "\"";
}
function extraerRespuesta(texto) {
  const idx = texto.lastIndexOf(MARCADOR);
  if (idx === -1) return null;
  return texto.slice(idx + MARCADOR.length).trim();
}`,
  "sdk-hf": String.raw`
function normalizarRespuesta(proveedor, datos) {
  if (proveedor === "openai") {
    return { texto: datos.choices[0].message.content, tokens: datos.usage.total_tokens };
  }
  if (proveedor === "anthropic") {
    const texto = datos.content.filter((b) => b.type === "text").map((b) => b.text).join("");
    return { texto, tokens: datos.usage.input_tokens + datos.usage.output_tokens };
  }
  if (proveedor === "huggingface") {
    return { texto: datos[0].generated_text, tokens: 0 };
  }
  throw new Error("proveedor_desconocido");
}`,
  "langchain": String.raw`
function componer(...pasos) {
  return async function (entrada) {
    let valor = entrada;
    for (const paso of pasos) valor = await paso(valor);
    return valor;
  };
}
function crearPlantilla(texto) {
  return function (variables) {
    return texto.replace(/\{(\w+)\}/g, (_, nombre) => {
      if (!(nombre in variables)) throw new Error("falta_variable:" + nombre);
      return String(variables[nombre]);
    });
  };
}`,
  "rag-qdrant": String.raw`
function trocear(texto, tamano) {
  const palabras = texto.split(/\s+/).filter(Boolean);
  const trozos = [];
  for (let i = 0; i < palabras.length; i += tamano) trozos.push(palabras.slice(i, i + tamano).join(" "));
  return trozos;
}
function similitud(a, b) {
  let punto = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) { punto += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i]; }
  if (na === 0 || nb === 0) return 0;
  return punto / (Math.sqrt(na) * Math.sqrt(nb));
}
function recuperar(consulta, documentos, k) {
  return documentos
    .map((d) => ({ id: d.id, score: similitud(consulta, d.vector) }))
    .sort((x, y) => y.score - x.score || (x.id < y.id ? -1 : x.id > y.id ? 1 : 0))
    .slice(0, k)
    .map((d) => d.id);
}`,
  "crewai": String.raw`
async function ejecutarEquipo(agentes, tarea) {
  const historial = [];
  let entrada = tarea;
  for (const agente of agentes) {
    try {
      entrada = await agente.hacer(entrada);
      historial.push({ agente: agente.nombre, salida: entrada });
    } catch (err) {
      return { error: agente.nombre, historial };
    }
  }
  return { resultado: entrada, historial };
}`,
  "generative-ui": String.raw`
function aplicarEvento(estado, evento) {
  if (evento.tipo === "bloque") {
    if (estado.some((b) => b.id === evento.id)) return estado;
    const base = { id: evento.id, componente: evento.componente };
    const nuevo = evento.componente === "lista" ? { ...base, items: [] } : { ...base, texto: "" };
    return [...estado, nuevo];
  }
  return estado.map((b) => {
    if (b.id !== evento.id) return b;
    if (evento.tipo === "texto" && "texto" in b) return { ...b, texto: b.texto + evento.delta };
    if (evento.tipo === "item" && "items" in b) return { ...b, items: [...b.items, evento.valor] };
    return b;
  });
}
function aplicarEventos(eventos) {
  return eventos.reduce(aplicarEvento, []);
}`,
  "observabilidad": String.raw`
function crearTrazador() {
  const registros = [];
  return {
    async span(nombre, fn) {
      const inicio = Date.now();
      try {
        const valor = await fn();
        registros.push({ nombre, ok: true, ms: Date.now() - inicio });
        return valor;
      } catch (err) {
        registros.push({ nombre, ok: false, ms: Date.now() - inicio, error: err.message });
        throw err;
      }
    },
    lista() { return registros.map((r) => ({ nombre: r.nombre, ok: r.ok })); },
    resumen() { return { total: registros.length, errores: registros.filter((r) => !r.ok).length }; },
  };
}`,
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
