<<<<<<< HEAD
﻿# LinguaForge

> **Uma plataforma open source para aprender l├¡nguas com progress├úo CEFR, repeti├º├úo espa├ºada e conte├║do com proveni├¬ncia verific├ível.**
>
> **Una plataforma open source para aprender idiomas con progresi├│n MCER, repetici├│n espaciada y contenido con procedencia verificable.**
>
> **An open-source language learning platform with CEFR progression, spaced repetition, and traceable content provenance.**

**Projeto criado e assinado por Pedro Belentani ┬À [@belentani\_](https://github.com/belentani7) ┬À belentani7studio@proton.me**

---

# Portugu├¬s

## A minha vis├úo

Eu sou Pedro Belentani e criei o LinguaForge como uma base aberta, audit├ível e evolutiva para aprender l├¡nguas com clareza, pr├ítica frequente e respeito pela proced├¬ncia do conte├║do. Quero construir uma ferramenta ├║til sem publicidade invasiva e sem pagamentos obrigat├│rios no in├¡cio, mantendo o c├│digo, as decis├Áes e os limites vis├¡veis para a comunidade.

O cat├ílogo atual suporta espanhol, ingl├¬s, mandarim, hindi, ├írabe, portugu├¬s, bengali, russo, japon├¬s e franc├¬s. As rotas s├úo bidirecionais entre os idiomas dispon├¡veis: uma pessoa pode estudar portugu├¬sÔåÆespanhol, espanholÔåÆportugu├¬s, portugu├¬sÔåÆingl├¬s e outras combina├º├Áes do cat├ílogo. A progress├úo usa CEFR/MCER A1, A2, B1, B2, C1 e C2; isso organiza a experi├¬ncia, mas n├úo substitui certifica├º├úo oficial.

## O que existe hoje

| ├ürea           | Estado verific├ível                                                                  |
| -------------- | ----------------------------------------------------------------------------------- |
| Rotas          | OrigemÔåÆdestino persistidas e bidirecionais para dez idiomas                         |
| Progress├úo     | Diagn├│stico inicial, recomenda├º├úo de n├¡vel e n├¡veis A1ÔÇôC2                           |
| Li├º├Áes         | M├│dulos de vocabul├írio, gram├ítica, pron├║ncia e conversa├º├úo                          |
| Exerc├¡cios     | Completar frases, relacionar elementos, tradu├º├úo e m├║ltipla escolha                 |
| Mem├│ria        | Flashcards e repeti├º├úo espa├ºada SRS com progresso persistido                        |
| Painel         | Racha, XP, li├º├Áes conclu├¡das, n├¡vel e resumo por idioma                             |
| Conte├║do       | Lotes piloto Tatoeba com licen├ºa, URL, vers├úo e atribui├º├úo                          |
| Qualidade      | TypeScript, Vitest, build de produ├º├úo e auditorias reproduz├¡veis                    |
| Acessibilidade | Keyboard, foco, ARIA, contraste e estados locais verificados no invent├írio de rotas |
| Avisos         | Notifica├º├Áes locais opcionais, com permiss├úo expl├¡cita, sem e-mail externo          |

O banco de conte├║do ainda est├í em expans├úo. Os lotes piloto n├úo s├úo a meta de mais de 1000 entradas por par. A importa├º├úo em escala exige export oficial completo, licen├ºa confirmada, deduplica├º├úo, revis├úo lingu├¡stica e manifest de cobertura.

## C├│digo, conte├║do e licen├ºas

O c├│digo deste reposit├│rio ├® distribu├¡do sob a **MIT License**, salvo indica├º├úo diferente em um arquivo espec├¡fico. Conte├║do, datasets, ├íudio, modelos, pesos, plugins e fontes de terceiros conservam as suas licen├ºas pr├│prias. Uma licen├ºa permissiva do c├│digo n├úo autoriza automaticamente redistribuir um modelo, uma voz ou um dataset.

Os pilotos textuais de Tatoeba conservam atribui├º├úo e proced├¬ncia conforme a licen├ºa indicada no lote. O ├íudio n├úo ├® importado automaticamente porque cada grava├º├úo pode ter condi├º├Áes pr├│prias. Consulte [CREDITS.md](CREDITS.md), [docs/content-import.md](docs/content-import.md) e [docs/compliance-readiness.md](docs/compliance-readiness.md) antes de reutilizar material.

## IA, voz, imagem e v├¡deo

Avaliei recursos open source para uma evolu├º├úo futura: [Kokoro](https://github.com/hexgrad/kokoro) e [Coqui TTS](https://github.com/coqui-ai/TTS) para compara├º├úo de voz, [Whisper](https://github.com/openai/whisper) para reconhecimento opt-in, [Ollama](https://github.com/ollama/ollama) para ferramentas internas e [Diffusers](https://github.com/huggingface/diffusers), [ComfyUI](https://github.com/Comfy-Org/ComfyUI) e [Wan2.1](https://github.com/Wan-Video/Wan2.1) para produ├º├úo editorial isolada. A prioridade ├® uma voz natural, mas essa qualidade deve ser medida por idioma, frase, pros├│dia e revis├úo humana; n├úo ├® uma promessa autom├ítica do nome do modelo.

N├úo se clonam vozes de terceiros sem consentimento documentado. Modelos pesados devem executar fora do runtime web, com limites, metadados, revis├úo, armazenamento controlado e fallback textual. Nenhum recurso externo ├® ativado apenas por ser popular.

## Arquitetura

O frontend utiliza React 19, Tailwind CSS 4 e componentes acess├¡veis. O backend utiliza Express, tRPC 11 e Drizzle ORM sobre MySQL/TiDB, com autentica├º├úo Manus e contratos tipados. O conte├║do persistido ├® servido pelo backend; arquivos devem usar refer├¬ncias de armazenamento controladas, n├úo blobs no banco. Jobs e automa├º├Áes ficam paus├íveis, idempotentes e sem efeitos externos por padr├úo.

## Desenvolvimento local

```bash
pnpm install
pnpm dev
pnpm check
pnpm test
pnpm build
```

N├úo fa├ºa commit de `.env`, tokens, chaves privadas ou credenciais. As vari├íveis s├úo fornecidas pelo ambiente de desenvolvimento. Os validadores e auditores ficam em `scripts/`; a explica├º├úo das fontes, licen├ºas, QA e opera├º├úo est├í em `docs/`.

## Contribui├º├úo

Pull requests s├úo bem-vindos quando mant├¬m acessibilidade, responsividade, proced├¬ncia, seguran├ºa, custos m├¡nimos e testes reproduz├¡veis. Antes de adicionar frases, imagens, ├íudio, v├¡deo, modelos ou datasets, informe fonte, autor, licen├ºa, URL, vers├úo, alcance de uso e m├®todo de revis├úo. Consulte [CONTRIBUTING.md](CONTRIBUTING.md) e [CREDITS.md](CREDITS.md).

## Publica├º├úo e contacto

O reposit├│rio GitHub e o site publicado s├úo sistemas diferentes. O site deve ser publicado pelo bot├úo **Publish** do ambiente WebDev e depois validado com tr├ífego real. E-mail autom├ítico, pagamentos, anal├¡tica externa, cron externo e integra├º├Áes de fornecedores continuam desativados at├® existirem configura├º├úo segura, consentimento, limites, base legal e revis├úo profissional.

Eu sou Pedro Belentani. Acompanhe o projeto em [@belentani\_](https://github.com/belentani7).

---

# Espa├▒ol

## Mi visi├│n

Soy Pedro Belentani y cre├® LinguaForge como una base abierta, auditable y evolutiva para aprender idiomas con claridad, pr├íctica frecuente y respeto por la procedencia del contenido. Quiero construir una herramienta ├║til sin publicidad invasiva y sin pagos obligatorios al principio, manteniendo visibles el c├│digo, las decisiones y los l├¡mites del proyecto.

El cat├ílogo actual soporta espa├▒ol, ingl├®s, mandar├¡n, hindi, ├írabe, portugu├®s, bengal├¡, ruso, japon├®s y franc├®s. Las rutas son bidireccionales entre los idiomas disponibles: una persona puede estudiar portugu├®sÔåÆespa├▒ol, espa├▒olÔåÆportugu├®s, portugu├®sÔåÆingl├®s y otras combinaciones del cat├ílogo. La progresi├│n utiliza MCER/CEFR A1, A2, B1, B2, C1 y C2; organiza la experiencia, pero no sustituye una certificaci├│n oficial.

## Lo que existe hoy

| ├ürea          | Estado verificable                                                                     |
| ------------- | -------------------------------------------------------------------------------------- |
| Rutas         | OrigenÔåÆdestino persistidas y bidireccionales para diez idiomas                         |
| Progresi├│n    | Diagn├│stico inicial, nivel recomendado y niveles A1ÔÇôC2                                 |
| Lecciones     | M├│dulos de vocabulario, gram├ítica, pronunciaci├│n y conversaci├│n                        |
| Ejercicios    | Completar frases, relacionar elementos, traducci├│n y opci├│n m├║ltiple                   |
| Memoria       | Flashcards y repetici├│n espaciada SRS con progreso persistido                          |
| Panel         | Racha, XP, lecciones completadas, nivel y resumen por idioma                           |
| Contenido     | Lotes piloto de Tatoeba con licencia, URL, versi├│n y atribuci├│n                        |
| Calidad       | TypeScript, Vitest, build de producci├│n y auditor├¡as reproducibles                     |
| Accesibilidad | Teclado, foco, ARIA, contraste y estados locales verificados en el inventario de rutas |
| Avisos        | Notificaciones locales opcionales, con permiso expl├¡cito, sin correo externo           |

El banco de contenido todav├¡a est├í en expansi├│n. Los lotes piloto no representan la meta de m├ís de 1000 entradas por par. La importaci├│n masiva exige un export oficial completo, licencia confirmada, deduplicaci├│n, revisi├│n ling├╝├¡stica y un manifest de cobertura.

## C├│digo, contenido y licencias

El c├│digo de este repositorio se distribuye bajo la **MIT License**, salvo indicaci├│n diferente en un archivo concreto. El contenido, datasets, audio, modelos, pesos, plugins y fuentes de terceros conservan sus licencias propias. Una licencia permisiva del c├│digo no autoriza autom├íticamente redistribuir un modelo, una voz o un dataset.

Los pilotos textuales de Tatoeba conservan atribuci├│n y procedencia conforme a la licencia indicada en cada lote. El audio no se importa autom├íticamente porque cada grabaci├│n puede tener condiciones propias. Consulta [CREDITS.md](CREDITS.md), [docs/content-import.md](docs/content-import.md) y [docs/compliance-readiness.md](docs/compliance-readiness.md) antes de reutilizar material.

## IA, voz, imagen y v├¡deo

He evaluado recursos open source para una evoluci├│n futura: [Kokoro](https://github.com/hexgrad/kokoro) y [Coqui TTS](https://github.com/coqui-ai/TTS) para comparar voz, [Whisper](https://github.com/openai/whisper) para reconocimiento opt-in, [Ollama](https://github.com/ollama/ollama) para herramientas internas y [Diffusers](https://github.com/huggingface/diffusers), [ComfyUI](https://github.com/Comfy-Org/ComfyUI) y [Wan2.1](https://github.com/Wan-Video/Wan2.1) para producci├│n editorial aislada. La prioridad es una voz natural, pero esa calidad debe medirse por idioma, frase, prosodia y revisi├│n humana; no es una promesa autom├ítica del nombre del modelo.

No se clonan voces de terceros sin consentimiento documentado. Los modelos pesados deben ejecutarse fuera del runtime web, con l├¡mites, metadatos, revisi├│n, almacenamiento controlado y fallback textual. Ning├║n recurso externo se activa solo por ser popular.

## Arquitectura

El frontend utiliza React 19, Tailwind CSS 4 y componentes accesibles. El backend utiliza Express, tRPC 11 y Drizzle ORM sobre MySQL/TiDB, con autenticaci├│n Manus y contratos tipados. El contenido persistido se sirve desde el backend; los archivos deben usar referencias controladas, no blobs en la base de datos. Los jobs y automatizaciones son pausables, idempotentes y no tienen efectos externos por defecto.

## Desarrollo local

```bash
pnpm install
pnpm dev
pnpm check
pnpm test
pnpm build
```

No hagas commit de `.env`, tokens, claves privadas ni credenciales. Las variables las proporciona el entorno de desarrollo. Los validadores y auditores est├ín en `scripts/`; las fuentes, licencias, QA y operaci├│n se explican en `docs/`.

## Contribuci├│n

Las pull requests son bienvenidas cuando mantienen accesibilidad, responsive, procedencia, seguridad, coste m├¡nimo y pruebas reproducibles. Antes de a├▒adir frases, im├ígenes, audio, v├¡deo, modelos o datasets, indica fuente, autor├¡a, licencia, URL, versi├│n, alcance de uso y m├®todo de revisi├│n. Consulta [CONTRIBUTING.md](CONTRIBUTING.md) y [CREDITS.md](CREDITS.md).

## Publicaci├│n y contacto

El repositorio GitHub y el sitio publicado son sistemas diferentes. El sitio debe publicarse mediante el bot├│n **Publish** del entorno WebDev y validarse despu├®s con tr├ífico real. El correo autom├ítico, pagos, anal├¡tica externa, cron externo e integraciones con proveedores siguen desactivados hasta disponer de configuraci├│n segura, consentimiento, l├¡mites, base legal y revisi├│n profesional.

Soy Pedro Belentani. Sigue el proyecto en [@belentani\_](https://github.com/belentani7).

---

# English

## My vision

I am Pedro Belentani, and I created LinguaForge as an open, auditable and evolvable foundation for language learning with clarity, frequent practice and respect for content provenance. I want to build a useful tool without intrusive advertising or mandatory payments at the beginning, while keeping the code, decisions and limitations visible.

The current catalog supports Spanish, English, Mandarin Chinese, Hindi, Arabic, Portuguese, Bengali, Russian, Japanese and French. Routes are bidirectional across available languages: a learner can study PortugueseÔåÆSpanish, SpanishÔåÆPortuguese, PortugueseÔåÆEnglish and other catalog combinations. Progression uses CEFR A1, A2, B1, B2, C1 and C2; it organizes the experience but does not replace official certification.

## What exists today

| Area          | Verifiable status                                                                   |
| ------------- | ----------------------------------------------------------------------------------- |
| Routes        | Persisted sourceÔåÆtarget routes, bidirectional across ten languages                  |
| Progression   | Initial diagnostic, recommended level and A1ÔÇôC2 progression                         |
| Lessons       | Vocabulary, grammar, pronunciation and conversation modules                         |
| Exercises     | Sentence completion, matching, translation and multiple choice                      |
| Memory        | Persisted flashcards and spaced repetition (SRS) reviews                            |
| Dashboard     | Streak, XP, completed lessons, level and per-language summary                       |
| Content       | Tatoeba pilot batches with license, URL, version and attribution                    |
| Quality       | TypeScript, Vitest, production build and reproducible audits                        |
| Accessibility | Keyboard, focus, ARIA, contrast and local-state checks across the route inventory   |
| Notices       | Optional local browser notifications with explicit permission and no external email |

The content bank is still expanding. Pilot batches do not represent the goal of more than 1,000 entries per pair. A large import requires a complete official export, license validation, deduplication, linguistic review and a coverage manifest.

## Code, content and licenses

The code in this repository is distributed under the **MIT License**, unless a specific file states otherwise. Third-party content, datasets, audio, models, weights, plugins and sources keep their own licenses. A permissive code license does not automatically authorize redistribution of a model, voice or dataset.

Pilot Tatoeba text keeps the attribution and provenance recorded in each batch. Audio is not imported automatically because each recording may have separate terms. Read [CREDITS.md](CREDITS.md), [docs/content-import.md](docs/content-import.md) and [docs/compliance-readiness.md](docs/compliance-readiness.md) before reusing material.

## AI, voice, image and video

I evaluated open-source resources for future work: [Kokoro](https://github.com/hexgrad/kokoro) and [Coqui TTS](https://github.com/coqui-ai/TTS) for voice comparison, [Whisper](https://github.com/openai/whisper) for opt-in speech recognition, [Ollama](https://github.com/ollama/ollama) for internal tools, and [Diffusers](https://github.com/huggingface/diffusers), [ComfyUI](https://github.com/Comfy-Org/ComfyUI) and [Wan2.1](https://github.com/Wan-Video/Wan2.1) for isolated editorial production. Natural voice quality must be measured by language, sentence, prosody and human review; it is not an automatic promise made by a model name.

Third-party voices are not cloned without documented consent. Heavy models must run outside the web runtime with limits, metadata, review, controlled storage and a text fallback. No external resource is activated merely because it is popular.

## Architecture

The frontend uses React 19, Tailwind CSS 4 and accessible components. The backend uses Express, tRPC 11 and Drizzle ORM on MySQL/TiDB, with Manus authentication and typed contracts. Persisted content is served by the backend; files must use controlled references rather than database blobs. Jobs and automations are pausable, idempotent and have no external effects by default.

## Local development

```bash
pnpm install
pnpm dev
pnpm check
pnpm test
pnpm build
```

Do not commit `.env` files, tokens, private keys or credentials. Environment variables are supplied by the development environment. Validators and auditors live under `scripts/`; sources, licenses, QA and operations are documented under `docs/`.

## Contributing

Pull requests are welcome when they preserve accessibility, responsiveness, provenance, security, minimum cost and reproducible tests. Before adding sentences, images, audio, video, models or datasets, provide source, authorship, license, URL, version, scope of use and review method. Read [CONTRIBUTING.md](CONTRIBUTING.md) and [CREDITS.md](CREDITS.md).

## Publication and contact

The GitHub repository and the deployed website are different systems. The website must be published with the **Publish** button in the WebDev environment and then validated with real traffic. Automatic email, payments, external analytics, external cron and provider integrations remain disabled until secure configuration, consent, limits, legal basis and professional review are available.

I am Pedro Belentani. Follow the project at [@belentani7](https://github.com/belentani7).

---

## References

[1]: https://github.com/hexgrad/kokoro "Kokoro"
[2]: https://github.com/coqui-ai/TTS "Coqui TTS"
[3]: https://github.com/openai/whisper "Whisper"
[4]: https://github.com/ollama/ollama "Ollama"
[5]: https://github.com/huggingface/diffusers "Diffusers"
[6]: https://github.com/Comfy-Org/ComfyUI "ComfyUI"
[7]: https://github.com/Wan-Video/Wan2.1 "Wan2.1"
[8]: https://tatoeba.org/en/downloads "Tatoeba downloads"
[9]: https://en.wiki.tatoeba.org/articles/show/using-the-tatoeba-corpus "Using the Tatoeba corpus"
=======
﻿# LinguaForge

> **Uma plataforma open source para aprender l├¡nguas com progress├úo CEFR, repeti├º├úo espa├ºada e conte├║do com proveni├¬ncia verific├ível.**
>
> **Una plataforma open source para aprender idiomas con progresi├│n MCER, repetici├│n espaciada y contenido con procedencia verificable.**
>
> **An open-source language learning platform with CEFR progression, spaced repetition, and traceable content provenance.**

**Projeto criado e assinado por Pedro Belentani ┬À [@belentani\_](https://github.com/belentani7) ┬À belentani7studio@proton.me**

---

# Portugu├¬s

## A minha vis├úo

Eu sou Pedro Belentani e criei o LinguaForge como uma base aberta, audit├ível e evolutiva para aprender l├¡nguas com clareza, pr├ítica frequente e respeito pela proced├¬ncia do conte├║do. Quero construir uma ferramenta ├║til sem publicidade invasiva e sem pagamentos obrigat├│rios no in├¡cio, mantendo o c├│digo, as decis├Áes e os limites vis├¡veis para a comunidade.

O cat├ílogo atual suporta espanhol, ingl├¬s, mandarim, hindi, ├írabe, portugu├¬s, bengali, russo, japon├¬s e franc├¬s. As rotas s├úo bidirecionais entre os idiomas dispon├¡veis: uma pessoa pode estudar portugu├¬sÔåÆespanhol, espanholÔåÆportugu├¬s, portugu├¬sÔåÆingl├¬s e outras combina├º├Áes do cat├ílogo. A progress├úo usa CEFR/MCER A1, A2, B1, B2, C1 e C2; isso organiza a experi├¬ncia, mas n├úo substitui certifica├º├úo oficial.

## O que existe hoje

| ├ürea           | Estado verific├ível                                                                  |
| -------------- | ----------------------------------------------------------------------------------- |
| Rotas          | OrigemÔåÆdestino persistidas e bidirecionais para dez idiomas                         |
| Progress├úo     | Diagn├│stico inicial, recomenda├º├úo de n├¡vel e n├¡veis A1ÔÇôC2                           |
| Li├º├Áes         | M├│dulos de vocabul├írio, gram├ítica, pron├║ncia e conversa├º├úo                          |
| Exerc├¡cios     | Completar frases, relacionar elementos, tradu├º├úo e m├║ltipla escolha                 |
| Mem├│ria        | Flashcards e repeti├º├úo espa├ºada SRS com progresso persistido                        |
| Painel         | Racha, XP, li├º├Áes conclu├¡das, n├¡vel e resumo por idioma                             |
| Conte├║do       | Lotes piloto Tatoeba com licen├ºa, URL, vers├úo e atribui├º├úo                          |
| Qualidade      | TypeScript, Vitest, build de produ├º├úo e auditorias reproduz├¡veis                    |
| Acessibilidade | Keyboard, foco, ARIA, contraste e estados locais verificados no invent├írio de rotas |
| Avisos         | Notifica├º├Áes locais opcionais, com permiss├úo expl├¡cita, sem e-mail externo          |

O banco de conte├║do ainda est├í em expans├úo. Os lotes piloto n├úo s├úo a meta de mais de 1000 entradas por par. A importa├º├úo em escala exige export oficial completo, licen├ºa confirmada, deduplica├º├úo, revis├úo lingu├¡stica e manifest de cobertura.

## C├│digo, conte├║do e licen├ºas

O c├│digo deste reposit├│rio ├® distribu├¡do sob a **MIT License**, salvo indica├º├úo diferente em um arquivo espec├¡fico. Conte├║do, datasets, ├íudio, modelos, pesos, plugins e fontes de terceiros conservam as suas licen├ºas pr├│prias. Uma licen├ºa permissiva do c├│digo n├úo autoriza automaticamente redistribuir um modelo, uma voz ou um dataset.

Os pilotos textuais de Tatoeba conservam atribui├º├úo e proced├¬ncia conforme a licen├ºa indicada no lote. O ├íudio n├úo ├® importado automaticamente porque cada grava├º├úo pode ter condi├º├Áes pr├│prias. Consulte [CREDITS.md](CREDITS.md), [docs/content-import.md](docs/content-import.md) e [docs/compliance-readiness.md](docs/compliance-readiness.md) antes de reutilizar material.

## IA, voz, imagem e v├¡deo

Avaliei recursos open source para uma evolu├º├úo futura: [Kokoro](https://github.com/hexgrad/kokoro) e [Coqui TTS](https://github.com/coqui-ai/TTS) para compara├º├úo de voz, [Whisper](https://github.com/openai/whisper) para reconhecimento opt-in, [Ollama](https://github.com/ollama/ollama) para ferramentas internas e [Diffusers](https://github.com/huggingface/diffusers), [ComfyUI](https://github.com/Comfy-Org/ComfyUI) e [Wan2.1](https://github.com/Wan-Video/Wan2.1) para produ├º├úo editorial isolada. A prioridade ├® uma voz natural, mas essa qualidade deve ser medida por idioma, frase, pros├│dia e revis├úo humana; n├úo ├® uma promessa autom├ítica do nome do modelo.

N├úo se clonam vozes de terceiros sem consentimento documentado. Modelos pesados devem executar fora do runtime web, com limites, metadados, revis├úo, armazenamento controlado e fallback textual. Nenhum recurso externo ├® ativado apenas por ser popular.

## Arquitetura

O frontend utiliza React 19, Tailwind CSS 4 e componentes acess├¡veis. O backend utiliza Express, tRPC 11 e Drizzle ORM sobre MySQL/TiDB, com autentica├º├úo Manus e contratos tipados. O conte├║do persistido ├® servido pelo backend; arquivos devem usar refer├¬ncias de armazenamento controladas, n├úo blobs no banco. Jobs e automa├º├Áes ficam paus├íveis, idempotentes e sem efeitos externos por padr├úo.

## Desenvolvimento local

```bash
pnpm install
pnpm dev
pnpm check
pnpm test
pnpm build
```

N├úo fa├ºa commit de `.env`, tokens, chaves privadas ou credenciais. As vari├íveis s├úo fornecidas pelo ambiente de desenvolvimento. Os validadores e auditores ficam em `scripts/`; a explica├º├úo das fontes, licen├ºas, QA e opera├º├úo est├í em `docs/`.

## Contribui├º├úo

Pull requests s├úo bem-vindos quando mant├¬m acessibilidade, responsividade, proced├¬ncia, seguran├ºa, custos m├¡nimos e testes reproduz├¡veis. Antes de adicionar frases, imagens, ├íudio, v├¡deo, modelos ou datasets, informe fonte, autor, licen├ºa, URL, vers├úo, alcance de uso e m├®todo de revis├úo. Consulte [CONTRIBUTING.md](CONTRIBUTING.md) e [CREDITS.md](CREDITS.md).

## Publica├º├úo e contacto

O reposit├│rio GitHub e o site publicado s├úo sistemas diferentes. O site deve ser publicado pelo bot├úo **Publish** do ambiente WebDev e depois validado com tr├ífego real. E-mail autom├ítico, pagamentos, anal├¡tica externa, cron externo e integra├º├Áes de fornecedores continuam desativados at├® existirem configura├º├úo segura, consentimento, limites, base legal e revis├úo profissional.

Eu sou Pedro Belentani. Acompanhe o projeto em [@belentani\_](https://github.com/belentani7).

---

# Espa├▒ol

## Mi visi├│n

Soy Pedro Belentani y cre├® LinguaForge como una base abierta, auditable y evolutiva para aprender idiomas con claridad, pr├íctica frecuente y respeto por la procedencia del contenido. Quiero construir una herramienta ├║til sin publicidad invasiva y sin pagos obligatorios al principio, manteniendo visibles el c├│digo, las decisiones y los l├¡mites del proyecto.

El cat├ílogo actual soporta espa├▒ol, ingl├®s, mandar├¡n, hindi, ├írabe, portugu├®s, bengal├¡, ruso, japon├®s y franc├®s. Las rutas son bidireccionales entre los idiomas disponibles: una persona puede estudiar portugu├®sÔåÆespa├▒ol, espa├▒olÔåÆportugu├®s, portugu├®sÔåÆingl├®s y otras combinaciones del cat├ílogo. La progresi├│n utiliza MCER/CEFR A1, A2, B1, B2, C1 y C2; organiza la experiencia, pero no sustituye una certificaci├│n oficial.

## Lo que existe hoy

| ├ürea          | Estado verificable                                                                     |
| ------------- | -------------------------------------------------------------------------------------- |
| Rutas         | OrigenÔåÆdestino persistidas y bidireccionales para diez idiomas                         |
| Progresi├│n    | Diagn├│stico inicial, nivel recomendado y niveles A1ÔÇôC2                                 |
| Lecciones     | M├│dulos de vocabulario, gram├ítica, pronunciaci├│n y conversaci├│n                        |
| Ejercicios    | Completar frases, relacionar elementos, traducci├│n y opci├│n m├║ltiple                   |
| Memoria       | Flashcards y repetici├│n espaciada SRS con progreso persistido                          |
| Panel         | Racha, XP, lecciones completadas, nivel y resumen por idioma                           |
| Contenido     | Lotes piloto de Tatoeba con licencia, URL, versi├│n y atribuci├│n                        |
| Calidad       | TypeScript, Vitest, build de producci├│n y auditor├¡as reproducibles                     |
| Accesibilidad | Teclado, foco, ARIA, contraste y estados locales verificados en el inventario de rutas |
| Avisos        | Notificaciones locales opcionales, con permiso expl├¡cito, sin correo externo           |

El banco de contenido todav├¡a est├í en expansi├│n. Los lotes piloto no representan la meta de m├ís de 1000 entradas por par. La importaci├│n masiva exige un export oficial completo, licencia confirmada, deduplicaci├│n, revisi├│n ling├╝├¡stica y un manifest de cobertura.

## C├│digo, contenido y licencias

El c├│digo de este repositorio se distribuye bajo la **MIT License**, salvo indicaci├│n diferente en un archivo concreto. El contenido, datasets, audio, modelos, pesos, plugins y fuentes de terceros conservan sus licencias propias. Una licencia permisiva del c├│digo no autoriza autom├íticamente redistribuir un modelo, una voz o un dataset.

Los pilotos textuales de Tatoeba conservan atribuci├│n y procedencia conforme a la licencia indicada en cada lote. El audio no se importa autom├íticamente porque cada grabaci├│n puede tener condiciones propias. Consulta [CREDITS.md](CREDITS.md), [docs/content-import.md](docs/content-import.md) y [docs/compliance-readiness.md](docs/compliance-readiness.md) antes de reutilizar material.

## IA, voz, imagen y v├¡deo

He evaluado recursos open source para una evoluci├│n futura: [Kokoro](https://github.com/hexgrad/kokoro) y [Coqui TTS](https://github.com/coqui-ai/TTS) para comparar voz, [Whisper](https://github.com/openai/whisper) para reconocimiento opt-in, [Ollama](https://github.com/ollama/ollama) para herramientas internas y [Diffusers](https://github.com/huggingface/diffusers), [ComfyUI](https://github.com/Comfy-Org/ComfyUI) y [Wan2.1](https://github.com/Wan-Video/Wan2.1) para producci├│n editorial aislada. La prioridad es una voz natural, pero esa calidad debe medirse por idioma, frase, prosodia y revisi├│n humana; no es una promesa autom├ítica del nombre del modelo.

No se clonan voces de terceros sin consentimiento documentado. Los modelos pesados deben ejecutarse fuera del runtime web, con l├¡mites, metadatos, revisi├│n, almacenamiento controlado y fallback textual. Ning├║n recurso externo se activa solo por ser popular.

## Arquitectura

El frontend utiliza React 19, Tailwind CSS 4 y componentes accesibles. El backend utiliza Express, tRPC 11 y Drizzle ORM sobre MySQL/TiDB, con autenticaci├│n Manus y contratos tipados. El contenido persistido se sirve desde el backend; los archivos deben usar referencias controladas, no blobs en la base de datos. Los jobs y automatizaciones son pausables, idempotentes y no tienen efectos externos por defecto.

## Desarrollo local

```bash
pnpm install
pnpm dev
pnpm check
pnpm test
pnpm build
```

No hagas commit de `.env`, tokens, claves privadas ni credenciales. Las variables las proporciona el entorno de desarrollo. Los validadores y auditores est├ín en `scripts/`; las fuentes, licencias, QA y operaci├│n se explican en `docs/`.

## Contribuci├│n

Las pull requests son bienvenidas cuando mantienen accesibilidad, responsive, procedencia, seguridad, coste m├¡nimo y pruebas reproducibles. Antes de a├▒adir frases, im├ígenes, audio, v├¡deo, modelos o datasets, indica fuente, autor├¡a, licencia, URL, versi├│n, alcance de uso y m├®todo de revisi├│n. Consulta [CONTRIBUTING.md](CONTRIBUTING.md) y [CREDITS.md](CREDITS.md).

## Publicaci├│n y contacto

El repositorio GitHub y el sitio publicado son sistemas diferentes. El sitio debe publicarse mediante el bot├│n **Publish** del entorno WebDev y validarse despu├®s con tr├ífico real. El correo autom├ítico, pagos, anal├¡tica externa, cron externo e integraciones con proveedores siguen desactivados hasta disponer de configuraci├│n segura, consentimiento, l├¡mites, base legal y revisi├│n profesional.

Soy Pedro Belentani. Sigue el proyecto en [@belentani\_](https://github.com/belentani7).

---

# English

## My vision

I am Pedro Belentani, and I created LinguaForge as an open, auditable and evolvable foundation for language learning with clarity, frequent practice and respect for content provenance. I want to build a useful tool without intrusive advertising or mandatory payments at the beginning, while keeping the code, decisions and limitations visible.

The current catalog supports Spanish, English, Mandarin Chinese, Hindi, Arabic, Portuguese, Bengali, Russian, Japanese and French. Routes are bidirectional across available languages: a learner can study PortugueseÔåÆSpanish, SpanishÔåÆPortuguese, PortugueseÔåÆEnglish and other catalog combinations. Progression uses CEFR A1, A2, B1, B2, C1 and C2; it organizes the experience but does not replace official certification.

## What exists today

| Area          | Verifiable status                                                                   |
| ------------- | ----------------------------------------------------------------------------------- |
| Routes        | Persisted sourceÔåÆtarget routes, bidirectional across ten languages                  |
| Progression   | Initial diagnostic, recommended level and A1ÔÇôC2 progression                         |
| Lessons       | Vocabulary, grammar, pronunciation and conversation modules                         |
| Exercises     | Sentence completion, matching, translation and multiple choice                      |
| Memory        | Persisted flashcards and spaced repetition (SRS) reviews                            |
| Dashboard     | Streak, XP, completed lessons, level and per-language summary                       |
| Content       | Tatoeba pilot batches with license, URL, version and attribution                    |
| Quality       | TypeScript, Vitest, production build and reproducible audits                        |
| Accessibility | Keyboard, focus, ARIA, contrast and local-state checks across the route inventory   |
| Notices       | Optional local browser notifications with explicit permission and no external email |

The content bank is still expanding. Pilot batches do not represent the goal of more than 1,000 entries per pair. A large import requires a complete official export, license validation, deduplication, linguistic review and a coverage manifest.

## Code, content and licenses

The code in this repository is distributed under the **MIT License**, unless a specific file states otherwise. Third-party content, datasets, audio, models, weights, plugins and sources keep their own licenses. A permissive code license does not automatically authorize redistribution of a model, voice or dataset.

Pilot Tatoeba text keeps the attribution and provenance recorded in each batch. Audio is not imported automatically because each recording may have separate terms. Read [CREDITS.md](CREDITS.md), [docs/content-import.md](docs/content-import.md) and [docs/compliance-readiness.md](docs/compliance-readiness.md) before reusing material.

## AI, voice, image and video

I evaluated open-source resources for future work: [Kokoro](https://github.com/hexgrad/kokoro) and [Coqui TTS](https://github.com/coqui-ai/TTS) for voice comparison, [Whisper](https://github.com/openai/whisper) for opt-in speech recognition, [Ollama](https://github.com/ollama/ollama) for internal tools, and [Diffusers](https://github.com/huggingface/diffusers), [ComfyUI](https://github.com/Comfy-Org/ComfyUI) and [Wan2.1](https://github.com/Wan-Video/Wan2.1) for isolated editorial production. Natural voice quality must be measured by language, sentence, prosody and human review; it is not an automatic promise made by a model name.

Third-party voices are not cloned without documented consent. Heavy models must run outside the web runtime with limits, metadata, review, controlled storage and a text fallback. No external resource is activated merely because it is popular.

## Architecture

The frontend uses React 19, Tailwind CSS 4 and accessible components. The backend uses Express, tRPC 11 and Drizzle ORM on MySQL/TiDB, with Manus authentication and typed contracts. Persisted content is served by the backend; files must use controlled references rather than database blobs. Jobs and automations are pausable, idempotent and have no external effects by default.

## Local development

```bash
pnpm install
pnpm dev
pnpm check
pnpm test
pnpm build
```

Do not commit `.env` files, tokens, private keys or credentials. Environment variables are supplied by the development environment. Validators and auditors live under `scripts/`; sources, licenses, QA and operations are documented under `docs/`.

## Contributing

Pull requests are welcome when they preserve accessibility, responsiveness, provenance, security, minimum cost and reproducible tests. Before adding sentences, images, audio, video, models or datasets, provide source, authorship, license, URL, version, scope of use and review method. Read [CONTRIBUTING.md](CONTRIBUTING.md) and [CREDITS.md](CREDITS.md).

## Publication and contact

The GitHub repository and the deployed website are different systems. The website must be published with the **Publish** button in the WebDev environment and then validated with real traffic. Automatic email, payments, external analytics, external cron and provider integrations remain disabled until secure configuration, consent, limits, legal basis and professional review are available.

I am Pedro Belentani. Follow the project at [@belentani7](https://github.com/belentani7).

---

## References

[1]: https://github.com/hexgrad/kokoro "Kokoro"
[2]: https://github.com/coqui-ai/TTS "Coqui TTS"
[3]: https://github.com/openai/whisper "Whisper"
[4]: https://github.com/ollama/ollama "Ollama"
[5]: https://github.com/huggingface/diffusers "Diffusers"
[6]: https://github.com/Comfy-Org/ComfyUI "ComfyUI"
[7]: https://github.com/Wan-Video/Wan2.1 "Wan2.1"
[8]: https://tatoeba.org/en/downloads "Tatoeba downloads"
[9]: https://en.wiki.tatoeba.org/articles/show/using-the-tatoeba-corpus "Using the Tatoeba corpus"
>>>>>>> 78d39f215c3cd9bb5d89fe55de39ffa2cf46a494
