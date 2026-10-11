import type { Lesson, Localized } from "./types";

/**
 * Lecciones de los temas de la hoja de ruta que aún no tenían curso.
 * Cada código inicial comparte identificadores en los tres idiomas; solo cambian los comentarios.
 * Las soluciones de referencia viven en tests/solutions.ts y se verifican en la suite.
 */

function code(comentario: Localized<string>, cuerpo: string): Localized {
  return {
    es: `${comentario.es}\n${cuerpo}`,
    "pt-BR": `${comentario["pt-BR"]}\n${cuerpo}`,
    ca: `${comentario.ca}\n${cuerpo}`,
  };
}

const LABEL = (es: string, pt: string, ca: string): Localized => ({ es, "pt-BR": pt, ca });

export const LESSONS_AMPLIADAS: Lesson[] = [
  // ───────────────── Nivel 1 ─────────────────
  {
    id: "css-moderno",
    level: 1,
    order: 3,
    status: "publicada",
    minutes: 25,
    title: {
      es: "CSS moderno: tipografía y espaciado fluidos con clamp()",
      "pt-BR": "CSS moderno: tipografia e espaçamento fluidos com clamp()",
      ca: "CSS modern: tipografia i espaiat fluids amb clamp()",
    },
    summary: {
      es: "Diseña interfaces que se adaptan a cualquier pantalla sin media queries para cada tamaño.",
      "pt-BR": "Crie interfaces que se adaptam a qualquer tela sem media queries para cada tamanho.",
      ca: "Dissenya interfícies que s'adapten a qualsevol pantalla sense media queries per a cada mida.",
    },
    objectives: {
      es: ["Entender la función lineal que hay detrás de clamp()", "Calcular una escala fluida entre dos tamaños y dos anchos", "Evaluar el valor en cualquier ancho de pantalla"],
      "pt-BR": ["Entender a função linear por trás do clamp()", "Calcular uma escala fluida entre dois tamanhos e duas larguras", "Avaliar o valor em qualquer largura de tela"],
      ca: ["Entendre la funció lineal que hi ha darrere de clamp()", "Calcular una escala fluida entre dues mides i dues amplades", "Avaluar el valor en qualsevol amplada de pantalla"],
    },
    theory: {
      es: [
        "Un agente de IA casi siempre vive dentro de una interfaz: un chat, un panel de herramientas o una herramienta de productividad. Esa interfaz tiene que leerse igual de bien en un móvil de 360 px y en un monitor de 1440 px. Antes se resolvía con media queries en cada punto de ruptura. Hoy una sola declaración puede hacerlo.",
        "clamp(mínimo, valor preferido, máximo) mantiene un valor dentro de un rango. El valor preferido suele ser una función lineal del ancho de pantalla: origen + pendiente × ancho. Si fijas el tamaño de letra a 16 px en 360 px de ancho y a 24 px en 1440 px, la recta que une esos dos puntos te da el origen y la pendiente.",
        "Calcula esa recta una vez, guárdala como configuración y evalúala cuando la necesites. Así el mismo código sirve para tipografía, espaciados y anchos de tarjeta, y el resultado es predecible en cada ancho intermedio.",
      ],
      "pt-BR": [
        "Um agente de IA quase sempre vive dentro de uma interface: um chat, um painel de ferramentas ou um aplicativo de produtividade. Essa interface precisa funcionar bem em um celular de 360 px e em um monitor de 1440 px. Antes isso se resolvia com media queries em cada ponto de quebra. Hoje, uma única declaração pode fazer isso.",
        "clamp(mínimo, valor preferido, máximo) mantém um valor dentro de uma faixa. O valor preferido costuma ser uma função linear da largura da tela: origem + inclinação × largura. Se a fonte deve ir de 16 px em 360 px a 24 px em 1440 px, a reta que une esses dois pontos fornece a origem e a inclinação.",
        "Calcule essa reta uma vez, guarde-a como configuração e avalie-a quando precisar. Assim o mesmo código serve para tipografia, espaçamentos e larguras de cartão, e o resultado é previsível em todas as larguras intermediárias.",
      ],
      ca: [
        "Un agent d'IA gairebé sempre viu dins d'una interfície: un xat, un panell d'eines o una aplicació de productivitat. Aquesta interfície ha de llegir-se igual de bé en un mòbil de 360 px i en un monitor de 1440 px. Abans es resolia amb media queries a cada punt de trencament. Avui una sola declaració pot fer-ho.",
        "clamp(mínim, valor preferit, màxim) manté un valor dins d'un rang. El valor preferit sol ser una funció lineal de l'amplada de pantalla: origen + pendent × amplada. Si la lletra ha d'anar de 16 px a 360 px a 24 px a 1440 px, la recta que uneix aquests dos punts et dona l'origen i el pendent.",
        "Calcula aquesta recta una vegada, guarda-la com a configuració i avalua-la quan la necessitis. Així el mateix codi serveix per a tipografia, espaiats i amplades de targeta, i el resultat és previsible en cada amplada intermèdia.",
      ],
    },
    starterCode: code(
      LABEL(
        "// calcularClamp devuelve la recta entre (minVw, minPx) y (maxVw, maxPx). valorEn la evalúa en un ancho dado.",
        "// calcularClamp devolve a reta entre (minVw, minPx) e (maxVw, maxPx). valorEn a avalia em uma largura dada.",
        "// calcularClamp retorna la recta entre (minVw, minPx) i (maxVw, maxPx). valorEn l'avalua en una amplada donada.",
      ),
      String.raw`function calcularClamp(minPx, maxPx, minVw, maxVw) {
  // Devuelve { min, max, vwPendiente, origenPx }. Pendiente en %, origen en px.
  return { min: minPx, max: maxPx };
}

function valorEn(config, anchoPx) {
  // Aplica origen + pendiente * ancho, acota entre min y max y redondea a 2 decimales.
  return config.min;
}`,
    ),
    tests: [
      {
        id: "valor-en-360",
        expr: "valorEn(calcularClamp(16, 24, 360, 1440), 360)",
        equals: 16,
        label: LABEL("En 360 px vale el mínimo (16)", "Em 360 px vale o mínimo (16)", "A 360 px val el mínim (16)"),
      },
      {
        id: "valor-en-900",
        expr: "valorEn(calcularClamp(16, 24, 360, 1440), 900)",
        equals: 20,
        label: LABEL("En 900 px vale 20", "Em 900 px vale 20", "A 900 px val 20"),
      },
      {
        id: "acotado-arriba",
        expr: "valorEn(calcularClamp(16, 24, 360, 1440), 2000)",
        equals: 24,
        label: LABEL("Por encima de 1440 px no supera el máximo (24)", "Acima de 1440 px não passa do máximo (24)", "Per sobre de 1440 px no supera el màxim (24)"),
      },
      {
        id: "origen",
        expr: "Math.round(calcularClamp(16, 24, 360, 1440).origenPx * 100) / 100",
        equals: 13.33,
        label: LABEL("El origen de la recta es 13.33 px", "A origem da reta é 13.33 px", "L'origen de la recta és 13.33 px"),
      },
    ],
    hints: {
      es: [
        "La pendiente en píxeles por píxel es (maxPx - minPx) / (maxVw - minVw). Para la fórmula de clamp la multiplicas por 100.",
        "El origen es minPx - pendiente * minVw. Después, valorEn suma origen + pendiente * ancho y acota con Math.min y Math.max.",
      ],
      "pt-BR": [
        "A inclinação em pixels por pixel é (maxPx - minPx) / (maxVw - minVw). Para a fórmula do clamp, multiplique por 100.",
        "A origem é minPx - inclinação * minVw. Depois, valorEn soma origem + inclinação * largura e limita com Math.min e Math.max.",
      ],
      ca: [
        "La pendent en píxels per píxel és (maxPx - minPx) / (maxVw - minVw). Per a la fórmula de clamp, multiplica-la per 100.",
        "L'origen és minPx - pendent * minVw. Després, valorEn suma origen + pendent * amplada i limita amb Math.min i Math.max.",
      ],
    },
    voiceIntro: {
      es: "Ahora vamos a hacer que tu interfaz respire: una sola línea de CSS puede adaptar el texto a cualquier pantalla.",
      "pt-BR": "Agora vamos fazer sua interface respirar: uma única linha de CSS pode adaptar o texto a qualquer tela.",
      ca: "Ara farem que la teva interfície respiri: una sola línia de CSS pot adaptar el text a qualsevol pantalla.",
    },
  },

  {
    id: "git-flujo",
    level: 1,
    order: 4,
    status: "publicada",
    minutes: 25,
    title: {
      es: "Git y flujo colaborativo: ramas y commits con convención",
      "pt-BR": "Git e fluxo colaborativo: branches e commits com convenção",
      ca: "Git i flux col·laboratiu: branques i commits amb convenció",
    },
    summary: {
      es: "Nombra ramas y mensajes de forma que cualquier persona del equipo, y cualquier herramienta, los entienda.",
      "pt-BR": "Nomeie branches e mensagens de forma que qualquer pessoa da equipe, e qualquer ferramenta, entenda.",
      ca: "Anomena branques i missatges de manera que qualsevol persona de l'equip, i qualsevol eina, els entengui.",
    },
    objectives: {
      es: ["Usar tipos de cambio convencionales (feat, fix, docs, chore)", "Convertir una descripción libre en un slug seguro para una rama", "Rechazar tipos no permitidos"],
      "pt-BR": ["Usar tipos de mudança convencionais (feat, fix, docs, chore)", "Converter uma descrição livre em um slug seguro para branch", "Rejeitar tipos não permitidos"],
      ca: ["Usar tipus de canvi convencionals (feat, fix, docs, chore)", "Convertir una descripció lliure en un slug segur per a una branca", "Rebutjar tipus no permesos"],
    },
    theory: {
      es: [
        "En un equipo de agentes, muchas personas y muchas herramientas leen el historial de Git: revisiones, generadores de notas de versión y los propios agentes que automatizan cambios. Una convención clara hace que esas lecturas sean automáticas. Por eso se usa un tipo corto al principio: feat para una funcionalidad, fix para una corrección, docs para documentación y chore para mantenimiento.",
        "Una rama se nombra con el tipo, una barra y una descripción en minúsculas, sin acentos ni espacios. Ese proceso se llama slugificar: normalizar los caracteres, sustituir todo lo que no sea letra o número por un guion y recortar la longitud para que el nombre sea manejable.",
        "Valida siempre el tipo antes de generar el nombre. Un tipo desconocido debe devolver un valor vacío, no inventarse uno. Así el flujo falla pronto y el error es visible.",
      ],
      "pt-BR": [
        "Em uma equipe de agentes, muitas pessoas e muitas ferramentas leem o histórico do Git: revisões, geradores de notas de versão e os próprios agentes que automatizam mudanças. Uma convenção clara torna essas leituras automáticas. Por isso se usa um tipo curto no início: feat para funcionalidade, fix para correção, docs para documentação e chore para manutenção.",
        "Uma branch é nomeada com o tipo, uma barra e uma descrição em minúsculas, sem acentos nem espaços. Esse processo se chama slugificar: normalizar os caracteres, trocar tudo o que não for letra ou número por um hífen e limitar o tamanho.",
        "Valide sempre o tipo antes de gerar o nome. Um tipo desconhecido deve devolver um valor vazio, não inventar um. Assim o fluxo falha cedo e o erro fica visível.",
      ],
      ca: [
        "En un equip d'agents, moltes persones i moltes eines llegeixen l'historial de Git: revisions, generadors de notes de versió i els mateixos agents que automatitzen canvis. Una convenció clara fa que aquestes lectures siguin automàtiques. Per això s'usa un tipus curt al principi: feat per a funcionalitat, fix per a correcció, docs per a documentació i chore per a manteniment.",
        "Una branca es nomena amb el tipus, una barra i una descripció en minúscules, sense accents ni espais. Aquest procés es diu slugificar: normalitzar els caràcters, substituir tot el que no sigui lletra o número per un guionet i retallar la longitud.",
        "Valida sempre el tipus abans de generar el nom. Un tipus desconegut ha de retornar un valor buit, no inventar-ne un. Així el flux falla aviat i l'error és visible.",
      ],
    },
    starterCode: code(
      LABEL(
        "// nombreRama debe devolver 'tipo/slug' o null si el tipo no está permitido.",
        "// nombreRama deve devolver 'tipo/slug' ou null se o tipo não for permitido.",
        "// nombreRama ha de retornar 'tipus/slug' o null si el tipus no està permès.",
      ),
      String.raw`const TIPOS = ["feat", "fix", "docs", "chore"];

function nombreRama(tipo, descripcion) {
  // 1. Comprueba que tipo está en TIPOS.
  // 2. Normaliza descripcion: minúsculas, sin acentos, [a-z0-9] separados por guiones.
  // 3. Recorta a 40 caracteres y devuelve tipo + "/" + slug.
  return "";
}`,
    ),
    tests: [
      {
        id: "acentos",
        expr: 'nombreRama("feat", "Añadir login OAuth!")',
        equals: "feat/anadir-login-oauth",
        label: LABEL("Quita acentos y signos", "Remove acentos e sinais", "Treu accents i signes"),
      },
      {
        id: "espacios",
        expr: 'nombreRama("fix", "  Corregir   bug 42 ")',
        equals: "fix/corregir-bug-42",
        label: LABEL("Colapsa espacios y recorta bordes", "Colapsa espaços e remove bordas", "Col·lapsa espais i retalla vores"),
      },
      {
        id: "tipo-invalido",
        expr: 'nombreRama("release", "algo")',
        equals: null,
        label: LABEL("Rechaza un tipo no permitido", "Rejeita um tipo não permitido", "Rebutja un tipus no permès"),
      },
      {
        id: "longitud",
        expr: 'nombreRama("docs", "x".repeat(60)).length',
        equals: 45,
        label: LABEL("El slug no supera 40 caracteres", "O slug não passa de 40 caracteres", "El slug no supera 40 caràcters"),
      },
    ],
    hints: {
      es: [
        "Para quitar acentos: texto.normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').",
        "Tras sustituir [^a-z0-9]+ por '-', recorta guiones al inicio y al final, y después limita a 40 caracteres.",
      ],
      "pt-BR": [
        "Para remover acentos: texto.normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').",
        "Depois de trocar [^a-z0-9]+ por '-', remova hífens do início e do fim, e então limite a 40 caracteres.",
      ],
      ca: [
        "Per treure accents: text.normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').",
        "Després de substituir [^a-z0-9]+ per '-', treu els guionets del principi i del final, i després limita a 40 caràcters.",
      ],
    },
    voiceIntro: {
      es: "Un buen equipo empieza por nombrar bien sus ramas. Vamos a automatizar esa disciplina.",
      "pt-BR": "Uma boa equipe começa nomeando bem suas branches. Vamos automatizar essa disciplina.",
      ca: "Un bon equip comença nomenant bé les seves branques. Anem a automatitzar aquesta disciplina.",
    },
  },

  // ───────────────── Nivel 2 ─────────────────
  {
    id: "cot-autoevaluacion",
    level: 2,
    order: 7,
    status: "publicada",
    minutes: 30,
    title: {
      es: "Chain-of-Thought y autoevaluación de respuestas",
      "pt-BR": "Chain-of-Thought e autoavaliação de respostas",
      ca: "Chain-of-Thought i autoavaluació de respostes",
    },
    summary: {
      es: "Pide razonamiento paso a paso y extrae la respuesta final de forma fiable para que el resto del sistema la use.",
      "pt-BR": "Peça raciocínio passo a passo e extraia a resposta final de forma confiável para o resto do sistema.",
      ca: "Demana raonament pas a pas i extreu la resposta final de manera fiable perquè la resta del sistema l'usi.",
    },
    objectives: {
      es: ["Construir un prompt que pide razonamiento explícito", "Separar el razonamiento de la respuesta final", "Tratar la ausencia de respuesta como un caso controlado"],
      "pt-BR": ["Construir um prompt que pede raciocínio explícito", "Separar o raciocínio da resposta final", "Tratar a ausência de resposta como caso controlado"],
      ca: ["Construir un prompt que demana raonament explícit", "Separar el raonament de la resposta final", "Tractar l'absència de resposta com un cas controlat"],
    },
    theory: {
      es: [
        "Chain-of-Thought consiste en pedir al modelo que razone paso a paso antes de contestar. En tareas con varios pasos, esa instrucción reduce errores porque el modelo genera los pasos intermedios en vez de saltar a una respuesta. Funciona mejor cuando el formato es explícito.",
        "Un formato estable es la clave para automatizarlo. Pide que el razonamiento sea libre y que la última línea empiece siempre por el mismo marcador, por ejemplo 'Respuesta final:'. El código entonces puede extraer solo lo que necesita, sin depender del estilo del texto.",
        "La autoevaluación es el siguiente paso: si el marcador no aparece, o aparece varias veces, el sistema debe reintentar o pedir una aclaración. Nunca debe inventar una respuesta. Un valor null es una señal útil para el flujo.",
      ],
      "pt-BR": [
        "Chain-of-Thought consiste em pedir ao modelo que raciocine passo a passo antes de responder. Em tarefas com várias etapas, essa instrução reduz erros, porque o modelo gera os passos intermediários em vez de pular para uma resposta. Funciona melhor quando o formato é explícito.",
        "Um formato estável é a chave para automatizar. Peça que o raciocínio seja livre e que a última linha comece sempre pelo mesmo marcador, por exemplo 'Resposta final:'. O código então pode extrair apenas o que precisa, sem depender do estilo do texto.",
        "A autoavaliação é o próximo passo: se o marcador não aparecer, ou aparecer várias vezes, o sistema deve tentar de novo ou pedir esclarecimento. Nunca deve inventar uma resposta. Um valor null é um sinal útil para o fluxo.",
      ],
      ca: [
        "Chain-of-Thought consisteix a demanar al model que raonari pas a pas abans de respondre. En tasques amb diversos passos, aquesta instrucció redueix errors, perquè el model genera els passos intermedis en lloc de saltar a una resposta. Funciona millor quan el format és explícit.",
        "Un format estable és la clau per automatitzar-ho. Demana que el raonament sigui lliure i que l'última línia comenci sempre pel mateix marcador, per exemple 'Resposta final:'. El codi aleshores pot extreure només el que necessita, sense dependre de l'estil del text.",
        "L'autoavaluació és el següent pas: si el marcador no apareix, o apareix diverses vegades, el sistema ha de reintentar o demanar una aclaració. Mai no ha d'inventar una resposta. Un valor null és un senyal útil per al flux.",
      ],
    },
    starterCode: code(
      LABEL(
        "// construirPromptCoT crea el prompt. extraerRespuesta toma la última 'Respuesta final:' del texto.",
        "// construirPromptCoT cria o prompt. extraerRespuesta pega a última 'Resposta final:' do texto.",
        "// construirPromptCoT crea el prompt. extraerRespuesta pren l'última 'Resposta final:' del text.",
      ),
      String.raw`const MARCADOR = "Respuesta final:";

function construirPromptCoT(pregunta) {
  // Debe incluir la pregunta, pedir razonamiento paso a paso y el MARCADOR al final.
  return pregunta;
}

function extraerRespuesta(texto) {
  // Devuelve el texto tras el último MARCADOR, sin espacios sobrantes. null si no existe.
  return null;
}`,
    ),
    tests: [
      {
        id: "extrae-respuesta",
        expr: 'extraerRespuesta("Paso 1: 2+2=4.\\nRespuesta final: 4")',
        equals: "4",
        label: LABEL("Extrae la respuesta tras el marcador", "Extrai a resposta após o marcador", "Extreu la resposta després del marcador"),
      },
      {
        id: "ultimo-marcador",
        expr: 'extraerRespuesta("Respuesta final: a\\nRespuesta final: b")',
        equals: "b",
        label: LABEL("Usa el último marcador si hay varios", "Usa o último marcador se houver vários", "Usa l'últim marcador si n'hi ha diversos"),
      },
      {
        id: "sin-marcador",
        expr: 'extraerRespuesta("sin marcador")',
        equals: null,
        label: LABEL("Devuelve null si no hay marcador", "Devolve null se não houver marcador", "Retorna null si no hi ha marcador"),
      },
      {
        id: "prompt",
        expr: 'construirPromptCoT("¿2+2?").includes("Razona paso a paso") && construirPromptCoT("¿2+2?").includes("¿2+2?")',
        equals: true,
        label: LABEL("El prompt incluye la pregunta y pide razonamiento", "O prompt inclui a pergunta e pede raciocínio", "El prompt inclou la pregunta i demana raonament"),
      },
    ],
    hints: {
      es: [
        "Para encontrar el último marcador usa texto.lastIndexOf(MARCADOR).",
        "Si el índice es -1 devuelve null. Si no, corta desde índice + MARCADOR.length y aplica trim().",
      ],
      "pt-BR": [
        "Para encontrar o último marcador, use texto.lastIndexOf(MARCADOR).",
        "Se o índice for -1, retorne null. Caso contrário, corte a partir de índice + MARCADOR.length e aplique trim().",
      ],
      ca: [
        "Per trobar l'últim marcador fes servir texto.lastIndexOf(MARCADOR).",
        "Si l'índex és -1, retorna null. Si no, talla des de índex + MARCADOR.length i aplica trim().",
      ],
    },
    voiceIntro: {
      es: "Pedir que el modelo piense en voz alta mejora mucho sus respuestas. Aprendamos a pedirlo y a leer el resultado.",
      "pt-BR": "Pedir que o modelo pense em voz alta melhora muito suas respostas. Vamos aprender a pedir e a ler o resultado.",
      ca: "Demanar que el model pensi en veu alta millora molt les seves respostes. Aprenem a demanar-ho i a llegir el resultat.",
    },
  },

  {
    id: "sdk-hf",
    level: 2,
    order: 8,
    status: "publicada",
    minutes: 30,
    title: {
      es: "OpenAI, Anthropic y modelos abiertos: un adaptador único",
      "pt-BR": "OpenAI, Anthropic e modelos abertos: um adaptador único",
      ca: "OpenAI, Anthropic i models oberts: un adaptador únic",
    },
    summary: {
      es: "Cada proveedor devuelve la respuesta con una forma distinta. Aprende a normalizarlas para cambiar de modelo sin reescribir tu aplicación.",
      "pt-BR": "Cada provedor devolve a resposta com um formato diferente. Aprenda a normalizá-las para trocar de modelo sem reescrever sua aplicação.",
      ca: "Cada proveïdor retorna la resposta amb una forma diferent. Aprèn a normalitzar-les per canviar de model sense reescriure la teva aplicació.",
    },
    objectives: {
      es: ["Leer la forma de respuesta de OpenAI, Anthropic y Hugging Face", "Unificar texto y tokens en un único objeto", "Fallar explícitamente con proveedores desconocidos"],
      "pt-BR": ["Ler o formato de resposta da OpenAI, Anthropic e Hugging Face", "Unificar texto e tokens em um único objeto", "Falhar explicitamente com provedores desconhecidos"],
      ca: ["Llegir la forma de resposta d'OpenAI, Anthropic i Hugging Face", "Unificar text i tokens en un únic objecte", "Fallar explícitament amb proveïdors desconeguts"],
    },
    theory: {
      es: [
        "OpenAI devuelve choices[0].message.content y usage.total_tokens. Anthropic devuelve un array content con bloques de tipo text, y los tokens están en input_tokens y output_tokens. Hugging Face, en la inferencia de texto, devuelve un array con generated_text. Tres formas distintas para la misma idea.",
        "Si el resto de tu aplicación depende de esas formas, cambiar de proveedor se vuelve caro. La solución es un adaptador: una sola función que recibe el proveedor y los datos crudos, y devuelve siempre { texto, tokens }. La interfaz, los registros y los costes trabajan solo con ese objeto.",
        "Un adaptador también debe decir la verdad. Si un proveedor no informa de tokens, devuelve 0 y no inventes una cifra. Y si el proveedor no existe, lanza un error con un código claro en vez de devolver un valor vacío.",
      ],
      "pt-BR": [
        "A OpenAI devolve choices[0].message.content e usage.total_tokens. A Anthropic devolve um array content com blocos do tipo text, e os tokens estão em input_tokens e output_tokens. O Hugging Face, na inferência de texto, devolve um array com generated_text. Três formatos para a mesma ideia.",
        "Se o resto da aplicação depende desses formatos, trocar de provedor fica caro. A solução é um adaptador: uma única função que recebe o provedor e os dados brutos e sempre devolve { texto, tokens }. A interface, os registros e os custos trabalham só com esse objeto.",
        "Um adaptador também deve dizer a verdade. Se um provedor não informa tokens, devolva 0 e não invente um número. E se o provedor não existe, lance um erro com um código claro em vez de devolver um valor vazio.",
      ],
      ca: [
        "OpenAI retorna choices[0].message.content i usage.total_tokens. Anthropic retorna un array content amb blocs de tipus text, i els tokens són a input_tokens i output_tokens. Hugging Face, en la inferència de text, retorna un array amb generated_text. Tres formes per a la mateixa idea.",
        "Si la resta de l'aplicació depèn d'aquestes formes, canviar de proveïdor es fa car. La solució és un adaptador: una sola funció que rep el proveïdor i les dades crues i sempre retorna { texto, tokens }. La interfície, els registres i els costos treballen només amb aquest objecte.",
        "Un adaptador també ha de dir la veritat. Si un proveïdor no informa de tokens, retorna 0 i no inventis una xifra. I si el proveïdor no existeix, llança un error amb un codi clar en lloc de retornar un valor buit.",
      ],
    },
    starterCode: code(
      LABEL(
        "// normalizarRespuesta debe devolver { texto, tokens } para 'openai', 'anthropic' o 'huggingface'.",
        "// normalizarRespuesta deve devolver { texto, tokens } para 'openai', 'anthropic' ou 'huggingface'.",
        "// normalizarRespuesta ha de retornar { texto, tokens } per a 'openai', 'anthropic' o 'huggingface'.",
      ),
      String.raw`function normalizarRespuesta(proveedor, datos) {
  // Adapta la forma de cada proveedor. Para un proveedor desconocido lanza new Error("proveedor_desconocido").
  return { texto: "", tokens: 0 };
}`,
    ),
    tests: [
      {
        id: "openai",
        expr: 'normalizarRespuesta("openai", { choices: [{ message: { content: "Hola" } }], usage: { total_tokens: 7 } })',
        equals: { texto: "Hola", tokens: 7 },
        label: LABEL("Adapta la respuesta de OpenAI", "Adapta a resposta da OpenAI", "Adapta la resposta d'OpenAI"),
      },
      {
        id: "anthropic",
        expr: 'normalizarRespuesta("anthropic", { content: [{ type: "text", text: "Hola" }, { type: "text", text: " mundo" }], usage: { input_tokens: 5, output_tokens: 3 } })',
        equals: { texto: "Hola mundo", tokens: 8 },
        label: LABEL("Une los bloques de texto de Anthropic y suma tokens", "Une os blocos de texto da Anthropic e soma tokens", "Uneix els blocs de text d'Anthropic i suma tokens"),
      },
      {
        id: "huggingface",
        expr: 'normalizarRespuesta("huggingface", [{ generated_text: "Bien" }])',
        equals: { texto: "Bien", tokens: 0 },
        label: LABEL("Hugging Face sin tokens devuelve 0", "Hugging Face sem tokens devolve 0", "Hugging Face sense tokens retorna 0"),
      },
      {
        id: "desconocido",
        expr: '(() => { try { normalizarRespuesta("x", {}); return "no"; } catch (e) { return e.message; } })()',
        equals: "proveedor_desconocido",
        label: LABEL("Un proveedor desconocido lanza un error claro", "Um provedor desconhecido lança um erro claro", "Un proveïdor desconegut llança un error clar"),
      },
    ],
    hints: {
      es: [
        "Usa if separados por proveedor. En Anthropic filtra content por type === 'text' y une con join('').",
        "Los tokens de Anthropic son input_tokens + output_tokens. Para Hugging Face no hay usage: devuelve 0.",
      ],
      "pt-BR": [
        "Use if separados por provedor. Na Anthropic, filtre content por type === 'text' e una com join('').",
        "Os tokens da Anthropic são input_tokens + output_tokens. Para o Hugging Face não há usage: devolva 0.",
      ],
      ca: [
        "Fes servir if separats per proveïdor. A Anthropic filtra content per type === 'text' i uneix amb join('').",
        "Els tokens d'Anthropic són input_tokens + output_tokens. Per a Hugging Face no hi ha usage: retorna 0.",
      ],
    },
    voiceIntro: {
      es: "Hoy aprenderás a hablar con tres proveedores de IA usando una sola interfaz. Eso te da libertad.",
      "pt-BR": "Hoje você vai aprender a falar com três provedores de IA usando uma só interface. Isso te dá liberdade.",
      ca: "Avui aprendràs a parlar amb tres proveïdors d'IA fent servir una sola interfície. Això et dona llibertat.",
    },
  },

  // ───────────────── Nivel 3 ─────────────────
  {
    id: "langchain",
    level: 3,
    order: 11,
    status: "publicada",
    minutes: 35,
    title: {
      es: "LangChain: cadenas, plantillas y composición",
      "pt-BR": "LangChain: cadeias, modelos e composição",
      ca: "LangChain: cadenes, plantilles i composició",
    },
    summary: {
      es: "Construye flujos de agentes componiendo pasos pequeños y comprobables, igual que hace LangChain con sus runnables.",
      "pt-BR": "Construa fluxos de agentes compondo etapas pequenas e testáveis, como faz o LangChain com seus runnables.",
      ca: "Construeix fluxos d'agents components passos petits i comprovables, com fa LangChain amb els seus runnables.",
    },
    objectives: {
      es: ["Entender una cadena como composición de funciones asíncronas", "Crear plantillas con variables validadas", "Detectar variables que faltan antes de llamar al modelo"],
      "pt-BR": ["Entender uma cadeia como composição de funções assíncronas", "Criar modelos com variáveis validadas", "Detectar variáveis faltantes antes de chamar o modelo"],
      ca: ["Entendre una cadena com a composició de funcions asíncrones", "Crear plantilles amb variables validades", "Detectar variables que falten abans de cridar el model"],
    },
    theory: {
      es: [
        "LangChain organiza el trabajo de un agente en cadenas: una entrada pasa por una serie de pasos, y la salida de cada paso es la entrada del siguiente. Un paso puede ser una plantilla de prompt, una llamada a un modelo, un analizador de salida o una herramienta. Cada uno hace una sola cosa.",
        "Esa composición se puede escribir a mano en pocas líneas. Si cada paso es una función que devuelve una promesa, una cadena es un bucle que espera cada paso en orden. Así no dependes de una librería para entender qué ocurre, y puedes probar cada paso por separado.",
        "Las plantillas son el primer paso de cualquier cadena. Una plantilla con {variables} debe fallar si falta un valor, porque un prompt con un hueco sin rellenar produce respuestas erráticas y costosas. Valida siempre antes de llamar al modelo.",
      ],
      "pt-BR": [
        "O LangChain organiza o trabalho de um agente em cadeias: uma entrada passa por uma série de etapas, e a saída de cada uma é a entrada da seguinte. Uma etapa pode ser um modelo de prompt, uma chamada a um modelo, um analisador de saída ou uma ferramenta. Cada uma faz uma coisa só.",
        "Essa composição pode ser escrita à mão em poucas linhas. Se cada etapa é uma função que retorna uma promise, uma cadeia é um laço que espera cada etapa em ordem. Assim você não depende de uma biblioteca para entender o que acontece, e pode testar cada etapa separadamente.",
        "Os modelos são o primeiro passo de qualquer cadeia. Um modelo com {variáveis} deve falhar se faltar um valor, porque um prompt com um buraco produz respostas erráticas e caras. Valide sempre antes de chamar o modelo.",
      ],
      ca: [
        "LangChain organitza la feina d'un agent en cadenes: una entrada passa per una sèrie de passos, i la sortida de cada pas és l'entrada del següent. Un pas pot ser una plantilla de prompt, una crida a un model, un analitzador de sortida o una eina. Cadascun fa una sola cosa.",
        "Aquesta composició es pot escriure a mà en poques línies. Si cada pas és una funció que retorna una promesa, una cadena és un bucle que espera cada pas en ordre. Així no depens d'una llibreria per entendre què passa, i pots provar cada pas per separat.",
        "Les plantilles són el primer pas de qualsevol cadena. Una plantilla amb {variables} ha de fallar si falta un valor, perquè un prompt amb un forat produeix respostes erràtiques i cares. Valida sempre abans de cridar el model.",
      ],
    },
    starterCode: code(
      LABEL(
        "// componer encadena funciones (async o no). crearPlantilla reemplaza {variable} y lanza si falta una.",
        "// componer encadeia funções (async ou não). crearPlantilla substitui {variável} e lança erro se faltar uma.",
        "// componer encadena funcions (async o no). crearPlantilla substitueix {variable} i llança si en falta una.",
      ),
      String.raw`function componer(...pasos) {
  // Devuelve una función async que pasa la entrada por cada paso en orden.
  return async function (entrada) {
    return entrada;
  };
}

function crearPlantilla(texto) {
  // Devuelve una función que recibe un objeto de variables y sustituye {nombre}.
  // Si falta una variable: throw new Error("falta_variable:" + nombre)
  return function (variables) {
    return texto;
  };
}`,
    ),
    tests: [
      {
        id: "componer",
        expr: "await componer((x) => x + 1, async (x) => x * 2)(3)",
        equals: 8,
        label: LABEL("Encadena pasos síncronos y asíncronos en orden", "Encadeia etapas síncronas e assíncronas em ordem", "Encadena passos síncrons i asíncrons en ordre"),
      },
      {
        id: "plantilla",
        expr: 'crearPlantilla("Hola {nombre}, tienes {n} mensajes")({ nombre: "Ana", n: 3 })',
        equals: "Hola Ana, tienes 3 mensajes",
        label: LABEL("Sustituye todas las variables", "Substitui todas as variáveis", "Substitueix totes les variables"),
      },
      {
        id: "falta-variable",
        expr: '(() => { try { crearPlantilla("Hola {nombre}")({}); return "no"; } catch (e) { return e.message; } })()',
        equals: "falta_variable:nombre",
        label: LABEL("Lanza un error si falta una variable", "Lança erro se faltar uma variável", "Llança un error si en falta una variable"),
      },
    ],
    hints: {
      es: [
        "Para componer: let valor = entrada; for (const paso of pasos) valor = await paso(valor); return valor;",
        "Para la plantilla: texto.replace(/\\{(\\w+)\\}/g, (_, nombre) => ...). Dentro comprueba si nombre está en variables.",
      ],
      "pt-BR": [
        "Para compor: let valor = entrada; for (const etapa of pasos) valor = await etapa(valor); return valor;",
        "Para o modelo: texto.replace(/\\{(\\w+)\\}/g, (_, nome) => ...). Dentro, verifique se nome está em variables.",
      ],
      ca: [
        "Per compondre: let valor = entrada; for (const pas of pasos) valor = await pas(valor); return valor;",
        "Per a la plantilla: texto.replace(/\\{(\\w+)\\}/g, (_, nom) => ...). Dins, comprova si nom és a variables.",
      ],
    },
    voiceIntro: {
      es: "Un agente es una cadena de pasos bien pensados. Vamos a construir la nuestra, pieza a pieza.",
      "pt-BR": "Um agente é uma cadeia de etapas bem pensadas. Vamos construir a nossa, peça por peça.",
      ca: "Un agent és una cadena de passos ben pensats. Anem a construir la nostra, peça a peça.",
    },
  },

  {
    id: "rag-qdrant",
    level: 3,
    order: 12,
    status: "publicada",
    minutes: 35,
    title: {
      es: "RAG con Qdrant y Pinecone: trocear, vectorizar y recuperar",
      "pt-BR": "RAG com Qdrant e Pinecone: dividir, vetorizar e recuperar",
      ca: "RAG amb Qdrant i Pinecone: trossejar, vectoritzar i recuperar",
    },
    summary: {
      es: "Haz que tu agente responda con tus propios documentos: trozos, similitud coseno y recuperación top-k, el núcleo de Qdrant y Pinecone.",
      "pt-BR": "Faça seu agente responder com seus próprios documentos: trechos, similaridade cosseno e recuperação top-k, o núcleo do Qdrant e do Pinecone.",
      ca: "Fes que el teu agent respongui amb els teus propis documents: trossos, similitud cosinus i recuperació top-k, el nucli de Qdrant i Pinecone.",
    },
    objectives: {
      es: ["Trocear un documento en fragmentos de tamaño fijo", "Calcular la similitud coseno entre vectores", "Recuperar los k fragmentos más relevantes"],
      "pt-BR": ["Dividir um documento em trechos de tamanho fixo", "Calcular a similaridade cosseno entre vetores", "Recuperar os k trechos mais relevantes"],
      ca: ["Trossejar un document en fragments de mida fixa", "Calcular la similitud cosinus entre vectors", "Recuperar els k fragments més rellevants"],
    },
    theory: {
      es: [
        "RAG (generación aumentada por recuperación) evita que el modelo invente. Antes de responder, el sistema busca en tus documentos los fragmentos relevantes y los pone en el prompt. El primer paso es trocear: un documento largo se divide en fragmentos de pocas palabras, para que cada uno sea una unidad de contexto manejable.",
        "Cada fragmento se convierte en un vector mediante un modelo de embeddings. Dos textos parecidos tienen vectores que apuntan en direcciones parecidas. La similitud coseno mide ese ángulo: 1 si son iguales en dirección, 0 si son ortogonales. Qdrant y Pinecone guardan esos vectores e indexan la búsqueda para no comparar uno a uno en colecciones enormes.",
        "La recuperación top-k devuelve los k vectores con mayor similitud. Con dos documentos iguales en puntuación, el orden debe ser estable, por ejemplo por id, para que los resultados sean reproducibles en los tests. Recuerda que la calidad de RAG depende tanto del troceado como de la búsqueda.",
      ],
      "pt-BR": [
        "RAG (geração aumentada por recuperação) evita que o modelo invente. Antes de responder, o sistema busca nos seus documentos os trechos relevantes e os coloca no prompt. O primeiro passo é dividir: um documento longo vira fragmentos de poucas palavras, cada um uma unidade de contexto gerenciável.",
        "Cada fragmento vira um vetor por meio de um modelo de embeddings. Dois textos parecidos têm vetores que apontam para direções parecidas. A similaridade cosseno mede esse ângulo: 1 se têm a mesma direção, 0 se são ortogonais. Qdrant e Pinecone guardam esses vetores e indexam a busca para não comparar um a um em coleções enormes.",
        "A recuperação top-k devolve os k vetores mais similares. Com dois documentos empatados, a ordem deve ser estável, por exemplo por id, para que os resultados sejam reproduzíveis nos testes. Lembre que a qualidade do RAG depende tanto da divisão quanto da busca.",
      ],
      ca: [
        "RAG (generació augmentada per recuperació) evita que el model inventi. Abans de respondre, el sistema busca als teus documents els fragments rellevants i els posa al prompt. El primer pas és trossejar: un document llarg es divideix en fragments de poques paraules, cadascun una unitat de context manejable.",
        "Cada fragment es converteix en un vector amb un model d'embeddings. Dos textos semblants tenen vectors que apunten en direccions semblants. La similitud cosinus mesura aquest angle: 1 si tenen la mateixa direcció, 0 si són ortogonals. Qdrant i Pinecone guarden aquests vectors i indexen la cerca per no comparar-los un a un en col·leccions enormes.",
        "La recuperació top-k retorna els k vectors més similars. Amb dos documents empatats, l'ordre ha de ser estable, per exemple per id, perquè els resultats siguin reproduïbles als tests. Recorda que la qualitat del RAG depèn tant del trossejat com de la cerca.",
      ],
    },
    starterCode: code(
      LABEL(
        "// trocear, similitud y recuperar son el núcleo de un RAG mínimo, sin base de datos vectorial.",
        "// trocear, similitud e recuperar são o núcleo de um RAG mínimo, sem banco vetorial.",
        "// trocear, similitud i recuperar són el nucli d'un RAG mínim, sense base de dades vectorial.",
      ),
      String.raw`function trocear(texto, tamano) {
  // Devuelve fragmentos de "tamano" palabras, unidos con espacios.
  return [texto];
}

function similitud(a, b) {
  // Similitud coseno: punto / (|a| * |b|). Devuelve 0 si algún vector es nulo.
  return 0;
}

function recuperar(consulta, documentos, k) {
  // documentos: [{ id, vector }]. Devuelve los ids de los k más similares, de mayor a menor.
  // Empates: orden alfabético por id.
  return [];
}`,
    ),
    tests: [
      {
        id: "trocear",
        expr: 'trocear("uno dos tres cuatro cinco", 2)',
        equals: ["uno dos", "tres cuatro", "cinco"],
        label: LABEL("Trocea en fragmentos de 2 palabras", "Divide em trechos de 2 palavras", "Trosseja en fragments de 2 paraules"),
      },
      {
        id: "coseno-ortogonal",
        expr: "similitud([1, 0], [0, 1])",
        equals: 0,
        label: LABEL("Vectores ortogonales tienen similitud 0", "Vetores ortogonais têm similaridade 0", "Vectors ortogonals tenen similitud 0"),
      },
      {
        id: "top-k",
        expr: 'recuperar([1, 0], [{ id: "a", vector: [0, 1] }, { id: "b", vector: [1, 0] }, { id: "c", vector: [1, 1] }], 2)',
        equals: ["b", "c"],
        label: LABEL("Devuelve los 2 más similares, en orden", "Devolve os 2 mais similares, em ordem", "Retorna els 2 més similars, en ordre"),
      },
      {
        id: "identico",
        expr: "similitud([3, 4], [3, 4])",
        equals: 1,
        label: LABEL("Un vector consigo mismo tiene similitud 1", "Um vetor consigo mesmo tem similaridade 1", "Un vector amb si mateix té similitud 1"),
      },
    ],
    hints: {
      es: [
        "Para trocear: texto.split(/\\s+/).filter(Boolean) y luego bucles de tamaño tamano con slice.",
        "Para similitud acumula punto, normA y normB. Recuerda que la norma es la raíz de la suma de cuadrados.",
      ],
      "pt-BR": [
        "Para dividir: texto.split(/\\s+/).filter(Boolean) e depois laços de tamanho com slice.",
        "Para similaridade, acumule punto, normA e normB. A norma é a raiz da soma dos quadrados.",
      ],
      ca: [
        "Per trossejar: texto.split(/\\s+/).filter(Boolean) i després bucles de mida amb slice.",
        "Per a la similitud acumula punt, normA i normB. La norma és l'arrel de la suma dels quadrats.",
      ],
    },
    voiceIntro: {
      es: "Ahora tu agente va a poder consultar tus propios documentos antes de responder. Eso cambia el juego.",
      "pt-BR": "Agora seu agente vai poder consultar os seus próprios documentos antes de responder. Isso muda o jogo.",
      ca: "Ara el teu agent podrà consultar els teus propis documents abans de respondre. Això canvia el joc.",
    },
  },

  {
    id: "crewai",
    level: 3,
    order: 13,
    status: "publicada",
    minutes: 35,
    title: {
      es: "CrewAI: equipos de agentes con traspaso de trabajo",
      "pt-BR": "CrewAI: equipes de agentes com passagem de trabalho",
      ca: "CrewAI: equips d'agents amb traspàs de feina",
    },
    summary: {
      es: "Un equipo de agentes con roles reparte una tarea: uno investiga, otro redacta y otro revisa. Aprende el patrón de traspaso y el control de errores.",
      "pt-BR": "Uma equipe de agentes com papéis divide uma tarefa: um pesquisa, outro redige e outro revisa. Aprenda o padrão de passagem e o controle de erros.",
      ca: "Un equip d'agents amb rols reparteix una tasca: un investiga, un altre redacta i un altre revisa. Aprèn el patró de traspàs i el control d'errors.",
    },
    objectives: {
      es: ["Modelar agentes con nombre, rol y una función de trabajo", "Pasar la salida de cada agente como entrada del siguiente", "Detener el equipo de forma controlada si un agente falla"],
      "pt-BR": ["Modelar agentes com nome, papel e uma função de trabalho", "Passar a saída de cada agente como entrada do seguinte", "Parar a equipe de forma controlada se um agente falhar"],
      ca: ["Modelar agents amb nom, rol i una funció de treball", "Passar la sortida de cada agent com a entrada del següent", "Aturar l'equip de manera controlada si un agent falla"],
    },
    theory: {
      es: [
        "CrewAI organiza los agentes como un equipo humano: cada uno tiene un rol, un objetivo y herramientas, y trabaja sobre una tarea. En el modo secuencial, el resultado de un agente se convierte en la entrada del siguiente, igual que una cadena, pero con roles explícitos que hacen el sistema más fácil de razonar y de depurar.",
        "El historial importa tanto como el resultado final. Guardar qué hizo cada agente y qué devolvió permite explicar una respuesta, auditar costes y reproducir errores. Un equipo sin trazas es un equipo que nadie puede mejorar.",
        "Los fallos también forman parte del diseño. Si un agente lanza un error, el equipo debe parar, informar de qué agente falló y conservar el historial parcial. Seguir adelante con una entrada rota produce resultados que parecen válidos y no lo son.",
      ],
      "pt-BR": [
        "O CrewAI organiza os agentes como uma equipe humana: cada um tem um papel, um objetivo e ferramentas, e trabalha sobre uma tarefa. No modo sequencial, o resultado de um agente vira a entrada do seguinte, como uma cadeia, mas com papéis explícitos que tornam o sistema mais fácil de entender e depurar.",
        "O histórico importa tanto quanto o resultado final. Guardar o que cada agente fez e devolveu permite explicar uma resposta, auditar custos e reproduzir erros. Uma equipe sem rastros é uma equipe que ninguém consegue melhorar.",
        "As falhas também fazem parte do design. Se um agente lança um erro, a equipe deve parar, informar qual agente falhou e manter o histórico parcial. Continuar com uma entrada quebrada produz resultados que parecem válidos e não são.",
      ],
      ca: [
        "CrewAI organitza els agents com un equip humà: cadascun té un rol, un objectiu i eines, i treballa sobre una tasca. En el mode seqüencial, el resultat d'un agent esdevé l'entrada del següent, com una cadena, però amb rols explícits que fan el sistema més fàcil d'entendre i de depurar.",
        "L'historial importa tant com el resultat final. Guardar què va fer cada agent i què va retornar permet explicar una resposta, auditar costos i reproduir errors. Un equip sense traces és un equip que ningú no pot millorar.",
        "Les fallades també formen part del disseny. Si un agent llança un error, l'equip ha d'aturar-se, informar de quin agent ha fallat i conservar l'historial parcial. Continuar amb una entrada trencada produeix resultats que semblen vàlids i no ho són.",
      ],
    },
    starterCode: code(
      LABEL(
        "// ejecutarEquipo pasa la tarea por cada agente en orden. Cada agente: { nombre, hacer(entrada) }.",
        "// ejecutarEquipo passa a tarefa por cada agente em ordem. Cada agente: { nome, hacer(entrada) }.",
        "// ejecutarEquipo passa la tasca per cada agent en ordre. Cada agent: { nom, hacer(entrada) }.",
      ),
      String.raw`async function ejecutarEquipo(agentes, tarea) {
  // Devuelve { resultado, historial: [{ agente, salida }] }.
  // Si un agente lanza un error, devuelve { error: nombreDelAgente, historial } y se detiene.
  return { resultado: tarea, historial: [] };
}`,
    ),
    tests: [
      {
        id: "resultado",
        expr: '(await ejecutarEquipo([{ nombre: "redactor", hacer: async (t) => t + "A" }, { nombre: "editor", hacer: (t) => t + "B" }], "tarea")).resultado',
        equals: "tareaAB",
        label: LABEL("El resultado encadena la salida de cada agente", "O resultado encadeia a saída de cada agente", "El resultat encadena la sortida de cada agent"),
      },
      {
        id: "historial",
        expr: '(await ejecutarEquipo([{ nombre: "redactor", hacer: async (t) => t + "A" }, { nombre: "editor", hacer: (t) => t + "B" }], "tarea")).historial.map((h) => h.agente)',
        equals: ["redactor", "editor"],
        label: LABEL("El historial registra cada agente en orden", "O histórico registra cada agente em ordem", "L'historial registra cada agent en ordre"),
      },
      {
        id: "error-controlado",
        expr: '(await ejecutarEquipo([{ nombre: "a", hacer: (t) => t + "1" }, { nombre: "b", hacer: () => { throw new Error("x"); } }], "t")).error',
        equals: "b",
        label: LABEL("Si un agente falla, informa cuál fue", "Se um agente falhar, informa qual foi", "Si un agent falla, informa de quin ha estat"),
      },
    ],
    hints: {
      es: [
        "Usa un for...of y, dentro, await agente.hacer(entrada). Guarda la salida como nueva entrada.",
        "Envuelve la llamada en try/catch: en el catch devuelve { error: agente.nombre, historial }.",
      ],
      "pt-BR": [
        "Use for...of e, dentro, await agente.hacer(entrada). Guarde a saída como nova entrada.",
        "Envolva a chamada em try/catch: no catch, devolva { error: agente.nome, historial }.",
      ],
      ca: [
        "Fes servir for...of i, dins, await agente.hacer(entrada). Guarda la sortida com a nova entrada.",
        "Envolta la crida en try/catch: al catch retorna { error: agent.nom, historial }.",
      ],
    },
    voiceIntro: {
      es: "Un equipo de agentes trabaja como un equipo humano: cada uno con su rol, y todos con trazas claras.",
      "pt-BR": "Uma equipe de agentes trabalha como uma equipe humana: cada um com seu papel, e todos com rastros claros.",
      ca: "Un equip d'agents treballa com un equip humà: cadascun amb el seu rol, i tots amb traces clares.",
    },
  },

  // ───────────────── Nivel 4 ─────────────────
  {
    id: "generative-ui",
    level: 4,
    order: 16,
    status: "publicada",
    minutes: 35,
    title: {
      es: "Generative UI con streaming: interfaces que se construyen mientras el modelo escribe",
      "pt-BR": "Generative UI com streaming: interfaces que se constroem enquanto o modelo escreve",
      ca: "Generative UI amb streaming: interfícies que es construeixen mentre el model escriu",
    },
    summary: {
      es: "Convierte un flujo de eventos del modelo en bloques de interfaz de forma inmutable, sin esperar a que termine la respuesta.",
      "pt-BR": "Converta um fluxo de eventos do modelo em blocos de interface de forma imutável, sem esperar a resposta terminar.",
      ca: "Converteix un flux d'esdeveniments del model en blocs d'interfície de manera immutable, sense esperar que acabi la resposta.",
    },
    objectives: {
      es: ["Modelar la interfaz como un estado de bloques", "Aplicar eventos de forma inmutable con reduce", "Ignorar eventos que apuntan a bloques inexistentes"],
      "pt-BR": ["Modelar a interface como um estado de blocos", "Aplicar eventos de forma imutável com reduce", "Ignorar eventos que apontam para blocos inexistentes"],
      ca: ["Modelar la interfície com un estat de blocs", "Aplicar esdeveniments de manera immutable amb reduce", "Ignorar esdeveniments que apunten a blocs inexistents"],
    },
    theory: {
      es: [
        "La Generative UI consiste en que el modelo decide qué interfaz mostrar: un título, un texto, una lista o un gráfico. El modelo no escribe HTML; emite eventos estructurados como 'crea bloque', 'añade texto' o 'añade elemento'. Tu aplicación convierte esos eventos en componentes.",
        "El estado de la interfaz es una lista de bloques. Cada evento produce un estado nuevo, sin modificar el anterior. Esa disciplina de inmutabilidad es la que hace que React detecte los cambios y que puedas reproducir o deshacer una sesión.",
        "En un stream los eventos pueden llegar desordenados o referenciar bloques que aún no existen. Un evento para un bloque desconocido se ignora sin romper la interfaz. Así un fallo parcial del modelo deja una pantalla incompleta pero usable, en vez de una pantalla en blanco.",
      ],
      "pt-BR": [
        "A Generative UI consiste em o modelo decidir qual interface mostrar: um título, um texto, uma lista ou um gráfico. O modelo não escreve HTML; ele emite eventos estruturados como 'cria bloco', 'acrescenta texto' ou 'acrescenta item'. Sua aplicação converte esses eventos em componentes.",
        "O estado da interface é uma lista de blocos. Cada evento produz um novo estado, sem alterar o anterior. Essa disciplina de imutabilidade é o que faz o React detectar as mudanças e permite reproduzir ou desfazer uma sessão.",
        "Em um stream, os eventos podem chegar fora de ordem ou referenciar blocos que ainda não existem. Um evento para um bloco desconhecido é ignorado sem quebrar a interface. Assim, uma falha parcial do modelo deixa uma tela incompleta, mas utilizável, em vez de uma tela em branco.",
      ],
      ca: [
        "La Generative UI consisteix que el model decideixi quina interfície mostrar: un títol, un text, una llista o un gràfic. El model no escriu HTML; emet esdeveniments estructurats com 'crea bloc', 'afegeix text' o 'afegeix element'. La teva aplicació converteix aquests esdeveniments en components.",
        "L'estat de la interfície és una llista de blocs. Cada esdeveniment produeix un estat nou, sense modificar l'anterior. Aquesta disciplina d'immutabilitat és el que fa que React detecti els canvis i que puguis reproduir o desfer una sessió.",
        "En un stream, els esdeveniments poden arribar desordenats o referenciar blocs que encara no existeixen. Un esdeveniment per a un bloc desconegut s'ignora sense trencar la interfície. Així, una fallada parcial del model deixa una pantalla incompleta però utilitzable, en lloc d'una pantalla en blanc.",
      ],
    },
    starterCode: code(
      LABEL(
        "// aplicarEvento devuelve un estado nuevo. aplicarEventos reduce una lista de eventos desde [].",
        "// aplicarEvento devolve um estado novo. aplicarEventos aplica uma lista de eventos a partir de [].",
        "// aplicarEvento retorna un estat nou. aplicarEventos redueix una llista d'esdeveniments des de [].",
      ),
      String.raw`function aplicarEvento(estado, evento) {
  // Eventos: { tipo: "bloque", id, componente: "texto" | "lista" }
  //          { tipo: "texto", id, delta }  -> concatena delta al bloque de texto
  //          { tipo: "item", id, valor }   -> añade valor a items de una lista
  // Nunca modifiques estado. Ignora eventos sobre ids inexistentes.
  return estado;
}

function aplicarEventos(eventos) {
  return [];
}`,
    ),
    tests: [
      {
        id: "texto-en-trozos",
        expr: 'aplicarEventos([{ tipo: "bloque", id: "1", componente: "texto" }, { tipo: "texto", id: "1", delta: "Ho" }, { tipo: "texto", id: "1", delta: "la" }])',
        equals: [{ id: "1", componente: "texto", texto: "Hola" }],
        label: LABEL("Concatena los fragmentos de texto", "Concatena os fragmentos de texto", "Concatena els fragments de text"),
      },
      {
        id: "lista",
        expr: 'aplicarEventos([{ tipo: "bloque", id: "l", componente: "lista" }, { tipo: "item", id: "l", valor: "uno" }, { tipo: "item", id: "l", valor: "dos" }])',
        equals: [{ id: "l", componente: "lista", items: ["uno", "dos"] }],
        label: LABEL("Añade elementos a una lista", "Acrescenta itens a uma lista", "Afegeix elements a una llista"),
      },
      {
        id: "inmutable",
        expr: '(() => { const s = []; aplicarEvento(s, { tipo: "bloque", id: "x", componente: "texto" }); return s.length; })()',
        equals: 0,
        label: LABEL("No modifica el estado anterior", "Não altera o estado anterior", "No modifica l'estat anterior"),
      },
      {
        id: "id-inexistente",
        expr: 'aplicarEventos([{ tipo: "texto", id: "nada", delta: "x" }])',
        equals: [],
        label: LABEL("Ignora eventos sobre bloques inexistentes", "Ignora eventos sobre blocos inexistentes", "Ignora esdeveniments sobre blocs inexistents"),
      },
    ],
    hints: {
      es: [
        "Para crear un bloque devuelve [...estado, nuevo]. Para modificar uno usa estado.map y devuelve una copia con spread.",
        "aplicarEventos puede ser eventos.reduce(aplicarEvento, []).",
      ],
      "pt-BR": [
        "Para criar um bloco, devolva [...estado, novo]. Para alterar um, use estado.map e devolva uma cópia com spread.",
        "aplicarEventos pode ser eventos.reduce(aplicarEvento, []).",
      ],
      ca: [
        "Per crear un bloc retorna [...estado, nou]. Per modificar-ne un fes servir estado.map i retorna una còpia amb spread.",
        "aplicarEventos pot ser eventos.reduce(aplicarEvento, []).",
      ],
    },
    voiceIntro: {
      es: "La interfaz ya no es fija: el modelo la va dibujando contigo, bloque a bloque. Vamos a programarlo.",
      "pt-BR": "A interface não é mais fixa: o modelo a desenha com você, bloco a bloco. Vamos programar isso.",
      ca: "La interfície ja no és fixa: el model la va dibuixant amb tu, bloc a bloc. Anem a programar-ho.",
    },
  },

  {
    id: "observabilidad",
    level: 4,
    order: 17,
    status: "publicada",
    minutes: 35,
    title: {
      es: "Observabilidad y evaluación en producción: trazas con LangSmith y Phoenix",
      "pt-BR": "Observabilidade e avaliação em produção: traces com LangSmith e Phoenix",
      ca: "Observabilitat i avaluació en producció: traces amb LangSmith i Phoenix",
    },
    summary: {
      es: "Mide cada paso de tu agente, registra fallos y resume la salud del sistema, el mismo modelo mental que usan LangSmith y Phoenix.",
      "pt-BR": "Meça cada etapa do seu agente, registre falhas e resuma a saúde do sistema, o mesmo modelo mental do LangSmith e do Phoenix.",
      ca: "Mesura cada pas del teu agent, registra les fallades i resumeix la salut del sistema, el mateix model mental que usen LangSmith i Phoenix.",
    },
    objectives: {
      es: ["Envolver cada paso del agente en un span", "Registrar éxito y error sin perder la excepción original", "Resumir errores y pasos totales"],
      "pt-BR": ["Envolver cada etapa do agente em um span", "Registrar sucesso e erro sem perder a exceção original", "Resumir erros e total de etapas"],
      ca: ["Envoltar cada pas de l'agent en un span", "Registrar èxit i error sense perdre l'excepció original", "Resumir errors i total de passos"],
    },
    theory: {
      es: [
        "Un agente en producción hace muchas cosas por petición: llama a un modelo, consulta una base vectorial, ejecuta una herramienta. Cuando algo va mal, necesitas saber qué paso falló y cuánto tardó. Un span es el registro de una de esas operaciones: nombre, duración y resultado. Las trazas agrupan los spans de una misma petición.",
        "LangSmith y Phoenix son plataformas que reciben esas trazas y las muestran como árboles, con latencias y errores. Pero el principio es el mismo que puedes implementar tú: envolver cada operación en una función que mide, registra y deja pasar el resultado o el error.",
        "Al registrar un error no lo tragues. Anótalo y vuelve a lanzarlo para que la capa superior decida qué hacer. Después, un resumen simple (total de pasos y número de errores) es el primer indicador de salud que deberías vigilar en un dashboard.",
      ],
      "pt-BR": [
        "Um agente em produção faz muitas coisas por requisição: chama um modelo, consulta um banco vetorial, executa uma ferramenta. Quando algo dá errado, você precisa saber qual etapa falhou e quanto demorou. Um span é o registro de uma dessas operações: nome, duração e resultado. Os traces agrupam os spans de uma mesma requisição.",
        "LangSmith e Phoenix são plataformas que recebem esses traces e os mostram como árvores, com latências e erros. Mas o princípio é o mesmo que você pode implementar: envolver cada operação em uma função que mede, registra e repassa o resultado ou o erro.",
        "Ao registrar um erro, não o engula. Anote-o e relance-o para que a camada superior decida o que fazer. Depois, um resumo simples (total de etapas e número de erros) é o primeiro indicador de saúde que você deveria monitorar em um painel.",
      ],
      ca: [
        "Un agent en producció fa moltes coses per petició: crida un model, consulta una base vectorial, executa una eina. Quan alguna cosa va malament, necessites saber quin pas ha fallat i quant ha trigat. Un span és el registre d'una d'aquestes operacions: nom, durada i resultat. Les traces agrupen els spans d'una mateixa petició.",
        "LangSmith i Phoenix són plataformes que reben aquestes traces i les mostren com a arbres, amb latències i errors. Però el principi és el mateix que pots implementar tu: envoltar cada operació en una funció que mesura, registra i deixa passar el resultat o l'error.",
        "En registrar un error, no l'empassis. Anota'l i torna'l a llançar perquè la capa superior decideixi què fer. Després, un resum simple (total de passos i nombre d'errors) és el primer indicador de salut que hauries de vigilar en un tauler.",
      ],
    },
    starterCode: code(
      LABEL(
        "// crearTrazador registra spans. span(nombre, fn) ejecuta fn, registra el resultado y relanza errores.",
        "// crearTrazador registra spans. span(nome, fn) executa fn, registra o resultado e relança erros.",
        "// crearTrazador registra spans. span(nom, fn) executa fn, registra el resultat i torna a llançar errors.",
      ),
      String.raw`function crearTrazador() {
  const registros = [];
  return {
    async span(nombre, fn) {
      // Ejecuta fn, guarda { nombre, ok, ms } y devuelve su valor. Si falla, guarda ok:false y relanza.
      return fn();
    },
    lista() {
      // [{ nombre, ok }] en orden de ejecución.
      return [];
    },
    resumen() {
      // { total, errores }
      return { total: registros.length, errores: 0 };
    },
  };
}`,
    ),
    tests: [
      {
        id: "devuelve-valor",
        expr: "(async () => { const t = crearTrazador(); return await t.span(\"a\", async () => 1); })()",
        equals: 1,
        label: LABEL("Devuelve el valor de la operación", "Devolve o valor da operação", "Retorna el valor de l'operació"),
      },
      {
        id: "registra-ok-y-error",
        expr: "(async () => { const t = crearTrazador(); await t.span(\"a\", async () => 1); try { await t.span(\"b\", async () => { throw new Error(\"boom\"); }); } catch (e) {} return t.lista(); })()",
        equals: [{ nombre: "a", ok: true }, { nombre: "b", ok: false }],
        label: LABEL("Registra cada span con su resultado", "Registra cada span com seu resultado", "Registra cada span amb el seu resultat"),
      },
      {
        id: "relanza",
        expr: "(async () => { const t = crearTrazador(); try { await t.span(\"c\", async () => { throw new Error(\"boom\"); }); } catch (e) { return e.message; } })()",
        equals: "boom",
        label: LABEL("Relanza el error original", "Relança o erro original", "Torna a llançar l'error original"),
      },
      {
        id: "resumen",
        expr: "(async () => { const t = crearTrazador(); await t.span(\"a\", async () => 1); try { await t.span(\"b\", async () => { throw new Error(\"x\"); }); } catch (e) {} return t.resumen(); })()",
        equals: { total: 2, errores: 1 },
        label: LABEL("El resumen cuenta pasos y errores", "O resumo conta etapas e erros", "El resum compta passos i errors"),
      },
    ],
    hints: {
      es: [
        "Dentro de span usa try { const valor = await fn(); registros.push({ nombre, ok: true }); return valor; } catch (err) { ... throw err; }",
        "lista() y resumen() solo leen registros: lista() hace map y resumen() cuenta los que tienen ok === false.",
      ],
      "pt-BR": [
        "Dentro de span use try { const valor = await fn(); registros.push({ nombre, ok: true }); return valor; } catch (err) { ... throw err; }",
        "lista() e resumen() só leem registros: lista() faz map e resumen() conta os que têm ok === false.",
      ],
      ca: [
        "Dins de span fes servir try { const valor = await fn(); registros.push({ nombre, ok: true }); return valor; } catch (err) { ... throw err; }",
        "lista() i resumen() només llegeixen registros: lista() fa map i resumen() compta els que tenen ok === false.",
      ],
    },
    voiceIntro: {
      es: "Un agente que no se puede observar no se puede mejorar. Hoy aprenderás a ver dentro de tu sistema.",
      "pt-BR": "Um agente que não pode ser observado não pode ser melhorado. Hoje você vai aprender a ver dentro do seu sistema.",
      ca: "Un agent que no es pot observar no es pot millorar. Avui aprendràs a veure dins del teu sistema.",
    },
  },
];
