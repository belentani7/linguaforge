import type { Lesson, Level } from "./types";

/**
 * Plan de estudios de 0 a experto en agentes de IA.
 * Las lecciones publicadas tienen teoría, código inicial y pruebas verificables
 * en los tres idiomas. Las lecciones "proximamente" aparecen en la hoja de ruta.
 */

export const LEVELS: Level[] = [
  {
    id: 1,
    title: {
      es: "Fundamentos del desarrollo web para IA",
      "pt-BR": "Fundamentos do desenvolvimento web para IA",
      ca: "Fonaments del desenvolupament web per a la IA",
    },
    description: {
      es: "JavaScript asíncrono, JSON y flujos de datos en tiempo real.",
      "pt-BR": "JavaScript assíncrono, JSON e fluxos de dados em tempo real.",
      ca: "JavaScript asíncron, JSON i fluxos de dades en temps real.",
    },
    outline: [
      {
        id: "css-moderno",
        level: 1,
        title: { es: "CSS moderno y diseño responsive", "pt-BR": "CSS moderno e design responsivo", ca: "CSS modern i disseny responsive" },
      },
      {
        id: "git-flujo",
        level: 1,
        title: { es: "Git y flujo de trabajo colaborativo", "pt-BR": "Git e fluxo de trabalho colaborativo", ca: "Git i flux de treball col·laboratiu" },
      },
    ],
  },
  {
    id: 2,
    title: {
      es: "Conexión con modelos e ingeniería de prompts",
      "pt-BR": "Conexão com modelos e engenharia de prompts",
      ca: "Connexió amb models i enginyeria de prompts",
    },
    description: {
      es: "SDKs de proveedores, few-shot, Chain-of-Thought y salidas con JSON Schema.",
      "pt-BR": "SDKs de provedores, few-shot, Chain-of-Thought e saídas com JSON Schema.",
      ca: "SDK de proveïdors, few-shot, Chain-of-Thought i sortides amb JSON Schema.",
    },
    outline: [
      {
        id: "cot-autoevaluacion",
        level: 2,
        title: { es: "Chain-of-Thought y autoevaluación", "pt-BR": "Chain-of-Thought e autoavaliação", ca: "Chain-of-Thought i autoavaluació" },
      },
      {
        id: "sdk-hf",
        level: 2,
        title: { es: "OpenAI, Anthropic y modelos abiertos en Hugging Face", "pt-BR": "OpenAI, Anthropic e modelos abertos no Hugging Face", ca: "OpenAI, Anthropic i models oberts a Hugging Face" },
      },
    ],
  },
  {
    id: 3,
    title: {
      es: "Arquitectura de agentes de IA autónomos",
      "pt-BR": "Arquitetura de agentes de IA autônomos",
      ca: "Arquitectura d'agents d'IA autònoms",
    },
    description: {
      es: "Tool calling, memoria a corto y largo plazo, LangChain, LlamaIndex y CrewAI.",
      "pt-BR": "Tool calling, memória de curto e longo prazo, LangChain, LlamaIndex e CrewAI.",
      ca: "Tool calling, memòria a curt i llarg termini, LangChain, LlamaIndex i CrewAI.",
    },
    outline: [
      {
        id: "langchain",
        level: 3,
        title: { es: "LangChain: cadenas y herramientas", "pt-BR": "LangChain: cadeias e ferramentas", ca: "LangChain: cadenes i eines" },
      },
      {
        id: "rag-qdrant",
        level: 3,
        title: { es: "RAG con Qdrant y Pinecone", "pt-BR": "RAG com Qdrant e Pinecone", ca: "RAG amb Qdrant i Pinecone" },
      },
      {
        id: "crewai",
        level: 3,
        title: { es: "CrewAI: equipos de agentes", "pt-BR": "CrewAI: equipes de agentes", ca: "CrewAI: equips d'agents" },
      },
    ],
  },
  {
    id: 4,
    title: {
      es: "Producción, monitorización y nivel experto",
      "pt-BR": "Produção, monitoramento e nível especialista",
      ca: "Producció, monitoratge i nivell expert",
    },
    description: {
      es: "Generative UI, streaming, evaluación con LangSmith o Phoenix y escala.",
      "pt-BR": "Generative UI, streaming, avaliação com LangSmith ou Phoenix e escala.",
      ca: "Generative UI, streaming, avaluació amb LangSmith o Phoenix i escala.",
    },
    outline: [
      {
        id: "generative-ui",
        level: 4,
        title: { es: "Generative UI con streaming", "pt-BR": "Generative UI com streaming", ca: "Generative UI amb streaming" },
      },
      {
        id: "observabilidad",
        level: 4,
        title: { es: "Observabilidad y evaluación en producción", "pt-BR": "Observabilidade e avaliação em produção", ca: "Observabilitat i avaluació en producció" },
      },
    ],
  },
];

export const LESSONS: Lesson[] = [
  // ───────────────── Nivel 1 ─────────────────
  {
    id: "js-asincrono",
    level: 1,
    order: 1,
    status: "publicada",
    minutes: 25,
    title: {
      es: "JavaScript asíncrono: promesas y async/await",
      "pt-BR": "JavaScript assíncrono: promises e async/await",
      ca: "JavaScript asíncron: promeses i async/await",
    },
    summary: {
      es: "Entiende por qué un agente espera respuestas de red y cómo escribir esa espera sin bloquear la interfaz.",
      "pt-BR": "Entenda por que um agente espera respostas de rede e como escrever essa espera sem travar a interface.",
      ca: "Entén per què un agent espera respostes de xarxa i com escriure aquesta espera sense bloquejar la interfície.",
    },
    objectives: {
      es: ["Distinguir una promesa pendiente de una resuelta", "Usar await dentro de una función async", "Propagar errores con try/catch"],
      "pt-BR": ["Distinguir uma promise pendente de uma resolvida", "Usar await dentro de uma função async", "Propagar erros com try/catch"],
      ca: ["Distingir una promesa pendent d'una resolta", "Usar await dins d'una funció async", "Propagar errors amb try/catch"],
    },
    theory: {
      es: [
        "Una llamada a un modelo de IA tarda entre cientos de milisegundos y varios segundos. Si el código se detuviera mientras espera, la interfaz se congelaría. Una Promise representa un valor que todavía no existe pero que existirá, o un error.",
        "async y await permiten escribir ese flujo como si fuera síncrono. await pausa solo la función actual; el resto de la página sigue respondiendo. Para esperar una pausa, puedes envolver setTimeout en una promesa.",
        "Cuando algo falla, lanza un error dentro de una función async y captúralo con try/catch. Nunca dejes un catch vacío: un agente que falla en silencio es mucho más difícil de depurar.",
      ],
      "pt-BR": [
        "Uma chamada a um modelo de IA leva de centenas de milissegundos a vários segundos. Se o código parasse enquanto espera, a interface travaria. Uma Promise representa um valor que ainda não existe, mas vai existir, ou um erro.",
        "async e await permitem escrever esse fluxo como se fosse síncrono. O await pausa apenas a função atual; o resto da página continua respondendo. Para esperar uma pausa, envolva setTimeout em uma promise.",
        "Quando algo falha, lance um erro dentro de uma função async e capture-o com try/catch. Nunca deixe um catch vazio: um agente que falha em silêncio é muito mais difícil de depurar.",
      ],
      ca: [
        "Una crida a un model d'IA triga entre centenars de mil·lisegons i diversos segons. Si el codi s'aturés mentre espera, la interfície es bloquejaria. Una Promise representa un valor que encara no existeix però que existirà, o un error.",
        "async i await permeten escriure aquest flux com si fos síncron. await només atura la funció actual; la resta de la pàgina continua responent. Per esperar una pausa, pots envoltar setTimeout en una promesa.",
        "Quan alguna cosa falla, llança un error dins d'una funció async i captura'l amb try/catch. Mai no deixis un catch buit: un agent que falla en silenci és molt més difícil de depurar.",
      ],
    },
    starterCode: {
      es: `// Escribe una función asíncrona que espere 100 ms y devuelva la suma de a y b.
async function sumarDespues(a, b) {
  // Pista: await new Promise((resolve) => setTimeout(resolve, 100));
}
`,
      "pt-BR": `// Escreva uma função assíncrona que espere 100 ms e retorne a soma de a e b.
async function sumarDespues(a, b) {
  // Dica: await new Promise((resolve) => setTimeout(resolve, 100));
}
`,
      ca: `// Escriu una funció asíncrona que esperi 100 ms i retorni la suma de a i b.
async function sumarDespues(a, b) {
  // Pista: await new Promise((resolve) => setTimeout(resolve, 100));
}
`,
    },
    tests: [
      {
        id: "suma-basica",
        expr: "await sumarDespues(2, 3)",
        equals: 5,
        label: { es: "Devuelve la suma tras esperar", "pt-BR": "Retorna a soma após esperar", ca: "Retorna la suma després d'esperar" },
      },
      {
        id: "suma-negativos",
        expr: "await sumarDespues(-4, 1)",
        equals: -3,
        label: { es: "Funciona con negativos", "pt-BR": "Funciona com negativos", ca: "Funciona amb negatius" },
      },
    ],
    hints: {
      es: ["Una función async siempre devuelve una promesa.", "Espera la promesa de setTimeout antes del return."],
      "pt-BR": ["Uma função async sempre retorna uma promise.", "Espere a promise do setTimeout antes do return."],
      ca: ["Una funció async sempre retorna una promesa.", "Espera la promesa de setTimeout abans del return."],
    },
    voiceIntro: {
      es: "Hoy veremos cómo esperar respuestas sin congelar la página.",
      "pt-BR": "Hoje vamos ver como esperar respostas sem travar a página.",
      ca: "Avui veurem com esperar respostes sense bloquejar la pàgina.",
    },
  },
  {
    id: "json-sse",
    level: 1,
    order: 2,
    status: "publicada",
    minutes: 30,
    title: {
      es: "JSON y streaming con Server-Sent Events",
      "pt-BR": "JSON e streaming com Server-Sent Events",
      ca: "JSON i streaming amb Server-Sent Events",
    },
    summary: {
      es: "Lee la respuesta de un modelo a medida que se genera, evento a evento.",
      "pt-BR": "Leia a resposta de um modelo à medida que ela é gerada, evento por evento.",
      ca: "Llegeix la resposta d'un model a mesura que es genera, esdeveniment a esdeveniment.",
    },
    objectives: {
      es: ["Leer el formato de eventos data: de SSE", "Parsear JSON de forma segura", "Ignorar el marcador de fin [DONE]"],
      "pt-BR": ["Ler o formato de eventos data: do SSE", "Analisar JSON com segurança", "Ignorar o marcador de fim [DONE]"],
      ca: ["Llegir el format d'esdeveniments data: de SSE", "Analitzar JSON de manera segura", "Ignorar el marcador de fi [DONE]"],
    },
    theory: {
      es: [
        "Server-Sent Events es un formato de texto sencillo: cada evento empieza por data: y termina con una línea en blanco. Con él, el servidor envía tokens del modelo conforme los genera, y la interfaz los muestra al instante.",
        "Cada línea data: contiene normalmente un JSON. Parsearlo sin cuidado puede romper toda la conversación, así que envuelve JSON.parse en try/catch y descarta los fragmentos que no sean válidos.",
        "El marcador data: [DONE] indica que el stream terminó. No es JSON, así que debes detectarlo antes de parsear.",
      ],
      "pt-BR": [
        "Server-Sent Events é um formato de texto simples: cada evento começa com data: e termina com uma linha em branco. Com ele, o servidor envia tokens do modelo conforme os gera, e a interface os mostra na hora.",
        "Cada linha data: normalmente contém um JSON. Analisá-lo sem cuidado pode quebrar a conversa inteira, então envolva JSON.parse em try/catch e descarte os fragmentos inválidos.",
        "O marcador data: [DONE] indica que o stream terminou. Não é JSON, então você deve detectá-lo antes de analisar.",
      ],
      ca: [
        "Server-Sent Events és un format de text senzill: cada esdeveniment comença amb data: i acaba amb una línia en blanc. Amb ell, el servidor envia tokens del model a mesura que els genera, i la interfície els mostra a l'instant.",
        "Cada línia data: normalment conté un JSON. Analitzar-lo sense cura pot trencar tota la conversa, així que envolta JSON.parse amb try/catch i descarta els fragments no vàlids.",
        "El marcador data: [DONE] indica que el stream ha acabat. No és JSON, així que l'has de detectar abans d'analitzar.",
      ],
    },
    starterCode: {
      es: `// Recibe el texto de un stream SSE y devuelve un array con los objetos JSON de cada evento.
// Ignora líneas que no empiecen por "data:", el marcador [DONE] y los JSON inválidos.
function parsearEventos(texto) {
  return [];
}
`,
      "pt-BR": `// Recebe o texto de um stream SSE e retorna um array com os objetos JSON de cada evento.
// Ignore linhas que não começam com "data:", o marcador [DONE] e os JSON inválidos.
function parsearEventos(texto) {
  return [];
}
`,
      ca: `// Rep el text d'un stream SSE i retorna un array amb els objectes JSON de cada esdeveniment.
// Ignora les línies que no comencen per "data:", el marcador [DONE] i els JSON no vàlids.
function parsearEventos(texto) {
  return [];
}
`,
    },
    tests: [
      {
        id: "evento-simple",
        expr: 'parsearEventos(\'data: {"delta":"Hola"}\\n\\n\')',
        equals: [{ delta: "Hola" }],
        label: { es: "Parsea un evento", "pt-BR": "Analisa um evento", ca: "Analitza un esdeveniment" },
      },
      {
        id: "done-y-basura",
        expr: 'parsearEventos(\'data: {"n":1}\\n\\nevento raro\\ndata: {roto\\n\\ndata: [DONE]\\n\\n\')',
        equals: [{ n: 1 }],
        label: { es: "Ignora [DONE] y JSON roto", "pt-BR": "Ignora [DONE] e JSON quebrado", ca: "Ignora [DONE] i JSON trencat" },
      },
    ],
    hints: {
      es: ["Divide el texto con split('\\n').", "Usa startsWith('data:') y recorta el prefijo."],
      "pt-BR": ["Divida o texto com split('\\n').", "Use startsWith('data:') e remova o prefixo."],
      ca: ["Divideix el text amb split('\\n').", "Usa startsWith('data:') i treu el prefix."],
    },
    voiceIntro: {
      es: "Ahora leeremos una respuesta de IA token a token, como si la escucháramos llegar.",
      "pt-BR": "Agora vamos ler uma resposta de IA token por token, como se a ouvíssemos chegar.",
      ca: "Ara llegirem una resposta d'IA token a token, com si la sentíssim arribar.",
    },
  },

  // ───────────────── Nivel 2 ─────────────────
  {
    id: "few-shot",
    level: 2,
    order: 3,
    status: "publicada",
    minutes: 30,
    title: {
      es: "Few-shot prompting: enseñar con ejemplos",
      "pt-BR": "Few-shot prompting: ensinar com exemplos",
      ca: "Few-shot prompting: ensenyar amb exemples",
    },
    summary: {
      es: "Construye prompts con ejemplos de entrada y salida para fijar el formato de la respuesta.",
      "pt-BR": "Construa prompts com exemplos de entrada e saída para fixar o formato da resposta.",
      ca: "Construeix prompts amb exemples d'entrada i sortida per fixar el format de la resposta.",
    },
    objectives: {
      es: ["Diseñar un prompt con ejemplos", "Separar instrucción, ejemplos y pregunta", "Mantener un formato estable"],
      "pt-BR": ["Projetar um prompt com exemplos", "Separar instrução, exemplos e pergunta", "Manter um formato estável"],
      ca: ["Dissenyar un prompt amb exemples", "Separar instrucció, exemples i pregunta", "Mantenir un format estable"],
    },
    theory: {
      es: [
        "Un modelo imita patrones. Si le muestras dos o tres ejemplos del formato que quieres, responderá con ese mismo formato. A esto se le llama few-shot prompting.",
        "Mantén un formato constante: Entrada, Salida, y una línea en blanco entre ejemplos. Así el modelo distingue con claridad qué es un ejemplo y qué es la pregunta real.",
        "Al final deja la pregunta sin salida, con la palabra Salida: vacía. El modelo completará justo ese hueco.",
      ],
      "pt-BR": [
        "Um modelo imita padrões. Se você mostrar a ele dois ou três exemplos do formato que deseja, ele responderá nesse mesmo formato. Isso se chama few-shot prompting.",
        "Mantenha um formato constante: Entrada, Saída e uma linha em branco entre os exemplos. Assim o modelo distingue claramente o que é exemplo e o que é a pergunta real.",
        "No fim, deixe a pergunta sem saída, com Saída: vazio. O modelo vai completar exatamente esse espaço.",
      ],
      ca: [
        "Un model imita patrons. Si li mostres dos o tres exemples del format que vols, respondrà amb aquest mateix format. Això s'anomena few-shot prompting.",
        "Mantén un format constant: Entrada, Sortida i una línia en blanc entre exemples. Així el model distingeix amb claredat què és un exemple i què és la pregunta real.",
        "Al final deixa la pregunta sense sortida, amb Sortida: buit. El model completarà justament aquest espai.",
      ],
    },
    starterCode: {
      es: `// Construye un prompt few-shot. Cada ejemplo ocupa dos líneas:
// "Entrada: ..." y "Salida: ...", seguido de una línea en blanco.
// Al final añade la pregunta, con "Salida:" vacío.
function construirPrompt(ejemplos, pregunta) {
  return "";
}
`,
      "pt-BR": `// Construa um prompt few-shot. Cada exemplo ocupa duas linhas:
// "Entrada: ..." e "Saída: ...", seguidas de uma linha em branco.
// No fim, adicione a pergunta, com "Saída:" vazio.
function construirPrompt(ejemplos, pregunta) {
  return "";
}
`,
      ca: `// Construeix un prompt few-shot. Cada exemple ocupa dues línies:
// "Entrada: ..." i "Sortida: ...", seguides d'una línia en blanc.
// Al final afegeix la pregunta, amb "Sortida:" buit.
function construirPrompt(ejemplos, pregunta) {
  return "";
}
`,
    },
    tests: [
      {
        id: "un-ejemplo",
        expr: 'construirPrompt([{ entrada: "gato", salida: "cat" }], "perro")',
        equals: "Entrada: gato\nSalida: cat\n\nEntrada: perro\nSalida:",
        label: { es: "Formato exacto con un ejemplo", "pt-BR": "Formato exato com um exemplo", ca: "Format exacte amb un exemple" },
      },
      {
        id: "sin-ejemplos",
        expr: 'construirPrompt([], "casa")',
        equals: "Entrada: casa\nSalida:",
        label: { es: "Sin ejemplos solo añade la pregunta", "pt-BR": "Sem exemplos, só adiciona a pergunta", ca: "Sense exemples només afegeix la pregunta" },
      },
    ],
    hints: {
      es: ["Recorre ejemplos con map y une los resultados con join.", "Cada ejemplo termina en \\n\\n."],
      "pt-BR": ["Percorra os exemplos com map e junte com join.", "Cada exemplo termina em \\n\\n."],
      ca: ["Recorre els exemples amb map i uneix-los amb join.", "Cada exemple acaba en \\n\\n."],
    },
    voiceIntro: {
      es: "Vamos a enseñar a un modelo con ejemplos, no con largas explicaciones.",
      "pt-BR": "Vamos ensinar um modelo com exemplos, não com longas explicações.",
      ca: "Ensenyarem un model amb exemples, no amb llargues explicacions.",
    },
  },
  {
    id: "salida-json-schema",
    level: 2,
    order: 4,
    status: "publicada",
    minutes: 35,
    title: {
      es: "Salidas estructuradas con JSON Schema",
      "pt-BR": "Saídas estruturadas com JSON Schema",
      ca: "Sortides estructurades amb JSON Schema",
    },
    summary: {
      es: "Valida la respuesta del modelo antes de usarla en tu aplicación.",
      "pt-BR": "Valide a resposta do modelo antes de usá-la na sua aplicação.",
      ca: "Valida la resposta del model abans d'utilitzar-la a la teva aplicació.",
    },
    objectives: {
      es: ["Definir un contrato de datos", "Validar tipos y rangos", "Rechazar respuestas malformadas"],
      "pt-BR": ["Definir um contrato de dados", "Validar tipos e intervalos", "Rejeitar respostas malformadas"],
      ca: ["Definir un contracte de dades", "Validar tipus i rangs", "Rebutjar respostes malformades"],
    },
    theory: {
      es: [
        "Un modelo puede devolver texto libre, pero tu aplicación necesita datos fiables. Un JSON Schema describe qué campos existen, qué tipo tienen y qué valores son válidos.",
        "Nunca confíes en la salida sin validarla. Comprueba que los campos existen, que son del tipo esperado y que están en el rango permitido antes de guardarlos o mostrarlos.",
        "Cuando la validación falla, no intentes adivinar. Pide de nuevo al modelo con el error concreto o muestra un estado de error claro al alumno.",
      ],
      "pt-BR": [
        "Um modelo pode retornar texto livre, mas sua aplicação precisa de dados confiáveis. Um JSON Schema descreve quais campos existem, qual tipo têm e quais valores são válidos.",
        "Nunca confie na saída sem validá-la. Verifique se os campos existem, se são do tipo esperado e se estão no intervalo permitido antes de salvar ou mostrar.",
        "Quando a validação falha, não tente adivinhar. Peça ao modelo de novo com o erro específico ou mostre um estado de erro claro para o aluno.",
      ],
      ca: [
        "Un model pot retornar text lliure, però la teva aplicació necessita dades fiables. Un JSON Schema descriu quins camps existeixen, quin tipus tenen i quins valors són vàlids.",
        "Mai no confiïs en la sortida sense validar-la. Comprova que els camps existeixen, que són del tipus esperat i que estan dins del rang permès abans de desar-los o mostrar-los.",
        "Quan la validació falla, no intentis endevinar. Demana de nou al model amb l'error concret o mostra a l'alumne un estat d'error clar.",
      ],
    },
    starterCode: {
      es: `// Devuelve true solo si obj tiene "titulo" (texto no vacío)
// y "puntuacion" (entero entre 0 y 10). En cualquier otro caso, false.
function validarRespuesta(obj) {
  return false;
}
`,
      "pt-BR": `// Retorne true somente se obj tiver "titulo" (texto não vazio)
// e "puntuacion" (inteiro entre 0 e 10). Em qualquer outro caso, false.
function validarRespuesta(obj) {
  return false;
}
`,
      ca: `// Retorna true només si obj té "titulo" (text no buit)
// i "puntuacion" (enter entre 0 i 10). En qualsevol altre cas, false.
function validarRespuesta(obj) {
  return false;
}
`,
    },
    tests: [
      {
        id: "valida",
        expr: 'validarRespuesta({ titulo: "Agente", puntuacion: 7 })',
        equals: true,
        label: { es: "Acepta una respuesta correcta", "pt-BR": "Aceita uma resposta correta", ca: "Accepta una resposta correcta" },
      },
      {
        id: "rango",
        expr: 'validarRespuesta({ titulo: "Agente", puntuacion: 11 })',
        equals: false,
        label: { es: "Rechaza puntuaciones fuera de rango", "pt-BR": "Rejeita pontuações fora do intervalo", ca: "Rebutja puntuacions fora de rang" },
      },
      {
        id: "tipo",
        expr: 'validarRespuesta({ titulo: "", puntuacion: 5 })',
        equals: false,
        label: { es: "Rechaza un título vacío", "pt-BR": "Rejeita um título vazio", ca: "Rebutja un títol buit" },
      },
    ],
    hints: {
      es: ["Number.isInteger(x) comprueba que sea entero.", "Comprueba typeof obj.titulo === 'string' y trim() antes de validar."],
      "pt-BR": ["Number.isInteger(x) verifica se é inteiro.", "Verifique typeof obj.titulo === 'string' e use trim() antes de validar."],
      ca: ["Number.isInteger(x) comprova que sigui enter.", "Comprova typeof obj.titulo === 'string' i usa trim() abans de validar."],
    },
    voiceIntro: {
      es: "Un agente fiable no confía en lo que escribe el modelo: lo valida primero.",
      "pt-BR": "Um agente confiável não confia no que o modelo escreve: ele valida primeiro.",
      ca: "Un agent fiable no confia en el que escriu el model: primer el valida.",
    },
  },

  // ───────────────── Nivel 3 ─────────────────
  {
    id: "tool-calling",
    level: 3,
    order: 5,
    status: "publicada",
    minutes: 40,
    title: {
      es: "Tool calling: herramientas que el agente ejecuta",
      "pt-BR": "Tool calling: ferramentas que o agente executa",
      ca: "Tool calling: eines que l'agent executa",
    },
    summary: {
      es: "Registra funciones en un catálogo y deja que el modelo elija cuál ejecutar, con argumentos validados.",
      "pt-BR": "Registre funções em um catálogo e deixe o modelo escolher qual executar, com argumentos validados.",
      ca: "Registra funcions en un catàleg i deixa que el model triï quina executar, amb arguments validats.",
    },
    objectives: {
      es: ["Crear un registro de herramientas", "Ejecutar una herramienta por nombre", "Gestionar herramientas desconocidas"],
      "pt-BR": ["Criar um registro de ferramentas", "Executar uma ferramenta pelo nome", "Tratar ferramentas desconhecidas"],
      ca: ["Crear un registre d'eines", "Executar una eina pel nom", "Gestionar eines desconegudes"],
    },
    theory: {
      es: [
        "Con tool calling, el modelo no ejecuta nada por sí mismo. Devuelve el nombre de una herramienta y sus argumentos, y tu código decide si la ejecuta. Ahí reside el control.",
        "Guarda las herramientas en un objeto registro, con el nombre como clave. Antes de llamarlas, comprueba que existen. Una herramienta desconocida no debe provocar un fallo silencioso.",
        "Devuelve siempre un resultado con forma conocida: { ok: valor } cuando funciona y { error: código } cuando no. Así el agente puede razonar sobre el fallo y reintentar o avisar.",
      ],
      "pt-BR": [
        "Com tool calling, o modelo não executa nada por conta própria. Ele retorna o nome de uma ferramenta e seus argumentos, e o seu código decide se a executa. É aí que está o controle.",
        "Guarde as ferramentas em um objeto de registro, com o nome como chave. Antes de chamá-las, verifique se existem. Uma ferramenta desconhecida não deve causar uma falha silenciosa.",
        "Retorne sempre um resultado com formato conhecido: { ok: valor } quando funciona e { error: código } quando não funciona. Assim o agente consegue raciocinar sobre a falha e tentar de novo ou avisar.",
      ],
      ca: [
        "Amb tool calling, el model no executa res per si mateix. Retorna el nom d'una eina i els seus arguments, i el teu codi decideix si l'executa. Aquí hi ha el control.",
        "Guarda les eines en un objecte de registre, amb el nom com a clau. Abans de cridar-les, comprova que existeixen. Una eina desconeguda no ha de provocar un fallo silenciós.",
        "Retorna sempre un resultat amb una forma coneguda: { ok: valor } quan funciona i { error: codi } quan no. Així l'agent pot raonar sobre el fallo i reintentar o avisar.",
      ],
    },
    starterCode: {
      es: `// registro: objeto { nombreHerramienta: función }.
// Ejecuta registro[nombre] con los argumentos de la lista "args".
// Si no existe, devuelve { error: "herramienta_desconocida", nombre }.
// Si existe, devuelve { ok: resultado }.
function ejecutarHerramienta(registro, nombre, args) {
  return null;
}
`,
      "pt-BR": `// registro: objeto { nomeDaFerramenta: função }.
// Execute registro[nome] com os argumentos da lista "args".
// Se não existir, retorne { error: "herramienta_desconocida", nombre }.
// Se existir, retorne { ok: resultado }.
function ejecutarHerramienta(registro, nombre, args) {
  return null;
}
`,
      ca: `// registre: objecte { nomEina: funció }.
// Executa registre[nom] amb els arguments de la llista "args".
// Si no existeix, retorna { error: "herramienta_desconocida", nombre }.
// Si existeix, retorna { ok: resultat }.
function ejecutarHerramienta(registro, nombre, args) {
  return null;
}
`,
    },
    tests: [
      {
        id: "suma-herramienta",
        expr: 'ejecutarHerramienta({ suma: (a, b) => a + b }, "suma", [1, 2])',
        equals: { ok: 3 },
        label: { es: "Ejecuta la herramienta con sus argumentos", "pt-BR": "Executa a ferramenta com seus argumentos", ca: "Executa l'eina amb els seus arguments" },
      },
      {
        id: "desconocida",
        expr: 'ejecutarHerramienta({}, "borrar", [])',
        equals: { error: "herramienta_desconocida", nombre: "borrar" },
        label: { es: "Informa de herramientas desconocidas", "pt-BR": "Informa ferramentas desconhecidas", ca: "Informa d'eines desconegudes" },
      },
    ],
    hints: {
      es: ["Usa Object.prototype.hasOwnProperty.call(registro, nombre).", "Para pasar la lista como argumentos usa el operador spread: fn(...args)."],
      "pt-BR": ["Use Object.prototype.hasOwnProperty.call(registro, nome).", "Para passar a lista como argumentos use o operador spread: fn(...args)."],
      ca: ["Usa Object.prototype.hasOwnProperty.call(registre, nom).", "Per passar la llista com a arguments usa l'operador spread: fn(...args)."],
    },
    voiceIntro: {
      es: "Ahora daremos manos a nuestro agente: herramientas que puede pedir, pero que tú controlas.",
      "pt-BR": "Agora vamos dar mãos ao nosso agente: ferramentas que ele pode pedir, mas que você controla.",
      ca: "Ara donarem mans al nostre agent: eines que pot demanar, però que tu controlaràs.",
    },
  },
  {
    id: "memoria-agente",
    level: 3,
    order: 6,
    status: "publicada",
    minutes: 35,
    title: {
      es: "Memoria del agente: corto plazo y ventana de contexto",
      "pt-BR": "Memória do agente: curto prazo e janela de contexto",
      ca: "Memòria de l'agent: curt termini i finestra de context",
    },
    summary: {
      es: "Mantén el contexto útil sin superar el límite de tokens del modelo.",
      "pt-BR": "Mantenha o contexto útil sem ultrapassar o limite de tokens do modelo.",
      ca: "Manté el context útil sense superar el límit de tokens del model.",
    },
    objectives: {
      es: ["Conservar las instrucciones del sistema", "Recortar el historial por cupo", "Entender el coste de la memoria"],
      "pt-BR": ["Preservar as instruções do sistema", "Recortar o histórico por cota", "Entender o custo da memória"],
      ca: ["Conservar les instruccions del sistema", "Retallar l'historial per cupo", "Entendre el cost de la memòria"],
    },
    theory: {
      es: [
        "La memoria a corto plazo de un agente es, en la práctica, la lista de mensajes que envías en cada llamada. Cuanto más larga, más tokens cuestas y más lenta es la respuesta.",
        "El mensaje de sistema, con las reglas del agente, debe conservarse siempre. Lo que se recorta son los mensajes antiguos de la conversación.",
        "La memoria a largo plazo, con bases vectoriales como Qdrant o Pinecone, se verá en el nivel 3 de RAG. Aquí resolvemos la ventana inmediata.",
      ],
      "pt-BR": [
        "A memória de curto prazo de um agente é, na prática, a lista de mensagens que você envia em cada chamada. Quanto mais longa, mais tokens custa e mais lenta fica a resposta.",
        "A mensagem de sistema, com as regras do agente, deve ser sempre preservada. O que se recorta são as mensagens antigas da conversa.",
        "A memória de longo prazo, com bases vetoriais como Qdrant ou Pinecone, será vista no módulo de RAG. Aqui resolvemos a janela imediata.",
      ],
      ca: [
        "La memòria a curt termini d'un agent és, a la pràctica, la llista de missatges que envies a cada crida. Com més llarga, més tokens costa i més lenta és la resposta.",
        "El missatge de sistema, amb les regles de l'agent, s'ha de conservar sempre. El que es retalla són els missatges antics de la conversa.",
        "La memòria a llarg termini, amb bases vectorials com Qdrant o Pinecone, es veurà al mòdul de RAG. Aquí resolem la finestra immediata.",
      ],
    },
    starterCode: {
      es: `// mensajes: array de { role, content }. max: número máximo de mensajes a conservar.
// Conserva el primer mensaje si su role es "system" y, después, los más recientes
// hasta completar max. Si max es menor o igual que el sistema, devuelve solo el sistema.
function recortarMemoria(mensajes, max) {
  return [];
}
`,
      "pt-BR": `// mensagens: array de { role, content }. max: número máximo de mensagens a preservar.
// Preserve a primeira mensagem se o role for "system" e, depois, as mais recentes
// até completar max. Se max for menor ou igual ao sistema, retorne só o sistema.
function recortarMemoria(mensajes, max) {
  return [];
}
`,
      ca: `// missatges: array de { role, content }. max: nombre màxim de missatges a conservar.
// Conserva el primer missatge si el seu role és "system" i, després, els més recents
// fins a completar max. Si max és menor o igual que el sistema, retorna només el sistema.
function recortarMemoria(mensajes, max) {
  return [];
}
`,
    },
    tests: [
      {
        id: "con-sistema",
        expr: 'recortarMemoria([{ role: "system", content: "s" }, { role: "user", content: "1" }, { role: "user", content: "2" }, { role: "user", content: "3" }], 3)',
        equals: [
          { role: "system", content: "s" },
          { role: "user", content: "2" },
          { role: "user", content: "3" },
        ],
        label: { es: "Conserva el sistema y los más recientes", "pt-BR": "Preserva o sistema e os mais recentes", ca: "Conserva el sistema i els més recents" },
      },
      {
        id: "sin-sistema",
        expr: 'recortarMemoria([{ role: "user", content: "a" }, { role: "user", content: "b" }], 1)',
        equals: [{ role: "user", content: "b" }],
        label: { es: "Sin sistema, recorta desde el principio", "pt-BR": "Sem sistema, recorta do início", ca: "Sense sistema, retalla des del principi" },
      },
    ],
    hints: {
      es: ["Si el primer mensaje es system, sepáralo con slice(0, 1).", "Cuidado: slice(-0) devuelve todo el array."],
      "pt-BR": ["Se a primeira mensagem for system, separe-a com slice(0, 1).", "Cuidado: slice(-0) retorna o array inteiro."],
      ca: ["Si el primer missatge és system, separa'l amb slice(0, 1).", "Compte: slice(-0) retorna tot l'array."],
    },
    voiceIntro: {
      es: "Un buen agente recuerda lo importante y olvida lo que ya no sirve.",
      "pt-BR": "Um bom agente lembra o importante e esquece o que não serve mais.",
      ca: "Un bon agent recorda l'important i oblida el que ja no serveix.",
    },
  },

  // ───────────────── Nivel 4 ─────────────────
  {
    id: "reintentos-resiliencia",
    level: 4,
    order: 7,
    status: "publicada",
    minutes: 35,
    title: {
      es: "Resiliencia en producción: reintentos controlados",
      "pt-BR": "Resiliência em produção: tentativas controladas",
      ca: "Resiliència en producció: reintents controlats",
    },
    summary: {
      es: "Reintenta llamadas que fallan de forma transitoria, con un límite claro.",
      "pt-BR": "Tente novamente chamadas que falham de forma transitória, com um limite claro.",
      ca: "Reintenta crides que fallen de manera transitòria, amb un límit clar.",
    },
    objectives: {
      es: ["Implementar reintentos con límite", "Devolver el primer éxito", "Propagar el último error"],
      "pt-BR": ["Implementar tentativas com limite", "Retornar o primeiro sucesso", "Propagar o último erro"],
      ca: ["Implementar reintents amb límit", "Retornar el primer èxit", "Propagar l'últim error"],
    },
    theory: {
      es: [
        "Las APIs de modelos fallan a veces por límites de tasa o cortes breves. Reintentar es útil, pero sin límite puede saturar tu sistema y multiplicar el coste.",
        "Define un número máximo de intentos. Si una llamada tiene éxito, devuelve el resultado al instante. Si agota los intentos, lanza el último error para que quien llama decida qué hacer.",
        "En producción, combina el límite con una espera creciente entre intentos, con backoff exponencial, y con jitter aleatorio para no sincronizar todos los clientes.",
      ],
      "pt-BR": [
        "As APIs de modelos às vezes falham por limites de taxa ou quedas breves. Tentar de novo é útil, mas sem limite pode sobrecarregar o sistema e multiplicar o custo.",
        "Defina um número máximo de tentativas. Se uma chamada tiver sucesso, retorne o resultado na hora. Se esgotar as tentativas, lance o último erro para que quem chamou decida o que fazer.",
        "Em produção, combine o limite com uma espera crescente entre tentativas, com backoff exponencial, e com jitter aleatório para não sincronizar todos os clientes.",
      ],
      ca: [
        "Les APIs de models de vegades fallen per límits de taxa o caigudes breus. Reintentar és útil, però sense límit pot saturar el sistema i multiplicar el cost.",
        "Defineix un nombre màxim d'intents. Si una crida té èxit, retorna el resultat a l'instant. Si esgota els intents, llança l'últim error perquè qui ha cridat decideixi què fer.",
        "En producció, combina el límit amb una espera creixent entre intents, amb backoff exponencial, i amb jitter aleatori per no sincronitzar tots els clients.",
      ],
    },
    starterCode: {
      es: `// Llama a fn hasta "intentos" veces. Devuelve el primer resultado que no lance error.
// Si todos fallan, lanza el último error.
async function reintentar(fn, intentos) {
  return null;
}
`,
      "pt-BR": `// Chame fn até "intentos" vezes. Retorne o primeiro resultado que não lance erro.
// Se todas falharem, lance o último erro.
async function reintentar(fn, intentos) {
  return null;
}
`,
      ca: `// Crida fn fins a "intentos" vegades. Retorna el primer resultat que no llanci error.
// Si tots fallen, llança l'últim error.
async function reintentar(fn, intentos) {
  return null;
}
`,
    },
    tests: [
      {
        id: "tercer-intento",
        expr: '(async () => { let n = 0; const r = await reintentar(async () => { n++; if (n < 3) throw new Error("x"); return "ok"; }, 3); return [r, n]; })()',
        equals: ["ok", 3],
        label: { es: "Tiene éxito en el tercer intento", "pt-BR": "Tem sucesso na terceira tentativa", ca: "Té èxit al tercer intent" },
      },
      {
        id: "agotado",
        expr: '(async () => { let n = 0; try { await reintentar(async () => { n++; throw new Error("fallo"); }, 2); return "no"; } catch (e) { return [e.message, n]; } })()',
        equals: ["fallo", 2],
        label: { es: "Lanza el último error al agotar intentos", "pt-BR": "Lança o último erro ao esgotar as tentativas", ca: "Llança l'últim error en esgotar els intents" },
      },
    ],
    hints: {
      es: ["Usa un bucle for con try/catch dentro.", "Guarda el último error en una variable antes de reintentar."],
      "pt-BR": ["Use um laço for com try/catch dentro.", "Guarde o último erro em uma variável antes de tentar de novo."],
      ca: ["Usa un bucle for amb try/catch a dins.", "Guarda l'últim error en una variable abans de reintentar."],
    },
    voiceIntro: {
      es: "En producción, fallar no es el problema. Lo difícil es fallar con elegancia.",
      "pt-BR": "Em produção, falhar não é o problema. O difícil é falhar com elegância.",
      ca: "En producció, fallar no és el problema. El difícil és fallar amb elegància.",
    },
  },
  {
    id: "evaluar-agente",
    level: 4,
    order: 8,
    status: "publicada",
    minutes: 35,
    title: {
      es: "Evaluar respuestas de un agente con criterios medibles",
      "pt-BR": "Avaliar respostas de um agente com critérios mensuráveis",
      ca: "Avaluar respostes d'un agent amb criteris mesurables",
    },
    summary: {
      es: "Puntúa respuestas con reglas explícitas para comparar versiones de tu agente.",
      "pt-BR": "Pontue respostas com regras explícitas para comparar versões do seu agente.",
      ca: "Puntua respostes amb regles explícites per comparar versions del teu agent.",
    },
    objectives: {
      es: ["Definir criterios de evaluación", "Calcular una puntuación entre 0 y 1", "Registrar resultados comparables"],
      "pt-BR": ["Definir critérios de avaliação", "Calcular uma pontuação entre 0 e 1", "Registrar resultados comparáveis"],
      ca: ["Definir criteris d'avaluació", "Calcular una puntuació entre 0 i 1", "Registrar resultats comparables"],
    },
    theory: {
      es: [
        "Sin medición no sabes si una nueva versión del agente es mejor. Las herramientas como LangSmith o Phoenix guardan trazas y permiten puntuar respuestas, pero el criterio empieza siempre por reglas claras.",
        "Una métrica sencilla es la cobertura de palabras clave: qué fracción de los conceptos esperados aparece en la respuesta. Es imperfecta, pero es reproducible y barata.",
        "Usa siempre el mismo conjunto de casos y el mismo criterio al comparar versiones. Cambiar el criterio a mitad de camino invalida la comparación.",
      ],
      "pt-BR": [
        "Sem medição você não sabe se uma nova versão do agente é melhor. Ferramentas como LangSmith ou Phoenix guardam traces e permitem pontuar respostas, mas o critério sempre começa com regras claras.",
        "Uma métrica simples é a cobertura de palavras-chave: qual fração dos conceitos esperados aparece na resposta. Ela é imperfeita, mas é reprodutível e barata.",
        "Use sempre o mesmo conjunto de casos e o mesmo critério ao comparar versões. Mudar o critério no meio do caminho invalida a comparação.",
      ],
      ca: [
        "Sense mesura no saps si una nova versió de l'agent és millor. Eines com LangSmith o Phoenix guarden traces i permeten puntuar respostes, però el criteri sempre comença amb regles clares.",
        "Una mètrica senzilla és la cobertura de paraules clau: quina fracció dels conceptes esperats apareix a la resposta. És imperfecta, però és reproduïble i barata.",
        "Fes servir sempre el mateix conjunt de casos i el mateix criteri en comparar versions. Canviar el criteri a mig camí invalida la comparació.",
      ],
    },
    starterCode: {
      es: `// Devuelve la fracción de palabrasClave que aparecen en respuesta (sin distinguir mayúsculas),
// redondeada a 2 decimales. Si la lista está vacía, devuelve 0.
function puntuarRespuesta(respuesta, palabrasClave) {
  return 0;
}
`,
      "pt-BR": `// Retorne a fração de palavrasChave que aparecem em resposta (sem diferenciar maiúsculas),
// arredondada a 2 casas decimais. Se a lista estiver vazia, retorne 0.
function puntuarRespuesta(respuesta, palabrasClave) {
  return 0;
}
`,
      ca: `// Retorna la fracció de palabrasClave que apareixen a respuesta (sense distingir majúscules),
// arrodonida a 2 decimals. Si la llista està buida, retorna 0.
function puntuarRespuesta(respuesta, palabrasClave) {
  return 0;
}
`,
    },
    tests: [
      {
        id: "dos-de-tres",
        expr: 'puntuarRespuesta("El Agente usa herramientas", ["agente", "herramientas", "memoria"])',
        equals: 0.67,
        label: { es: "Calcula 2 de 3 con redondeo", "pt-BR": "Calcula 2 de 3 com arredondamento", ca: "Calcula 2 de 3 amb arrodoniment" },
      },
      {
        id: "lista-vacia",
        expr: 'puntuarRespuesta("cualquier cosa", [])',
        equals: 0,
        label: { es: "Lista vacía devuelve 0", "pt-BR": "Lista vazia retorna 0", ca: "Llista buida retorna 0" },
      },
    ],
    hints: {
      es: ["Pasa la respuesta a minúsculas con toLowerCase().", "Math.round(x * 100) / 100 redondea a dos decimales."],
      "pt-BR": ["Converta a resposta para minúsculas com toLowerCase().", "Math.round(x * 100) / 100 arredonda para duas casas decimais."],
      ca: ["Passa la resposta a minúscules amb toLowerCase().", "Math.round(x * 100) / 100 arrodoneix a dos decimals."],
    },
    voiceIntro: {
      es: "Cerramos el recorrido con algo esencial: medir para mejorar de verdad.",
      "pt-BR": "Fechamos o percurso com algo essencial: medir para melhorar de verdade.",
      ca: "Tanquem el recorregut amb una cosa essencial: mesurar per millorar de veritat.",
    },
  },
];

export function getLesson(id: string): Lesson | undefined {
  return LESSONS.find((l) => l.id === id);
}

export function getLessonsByLevel(level: Level["id"]): Lesson[] {
  return LESSONS.filter((l) => l.level === level).sort((a, b) => a.order - b.order);
}

export function getNextLesson(id: string): Lesson | undefined {
  const current = getLesson(id);
  if (!current) return undefined;
  const published = LESSONS.filter((l) => l.status === "publicada").sort((a, b) => a.order - b.order);
  const index = published.findIndex((l) => l.id === id);
  return index >= 0 ? published[index + 1] : undefined;
}
