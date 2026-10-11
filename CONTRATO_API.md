# Contrato de API · apps/web

Base: el mismo origen que la web (Next.js Route Handlers). Todas las respuestas de error son JSON `{ "error": string, "message": string }`, salvo los códigos indicados.

## `GET /api/courses`

Catálogo público. Estático (se genera en build). No incluye pruebas ni soluciones.

- **200** → `{ "levels": Level[], "lessons": LessonSummary[] }`

## `POST /api/tutor` — tutor por streaming

Cuerpo (validado con Zod, `src/lib/schemas.ts`):

```json
{
  "lessonId": "js-asincrono",
  "messages": [{ "role": "user" | "assistant", "content": "…" }],
  "chatLocale": "es" | "pt-BR" | "ca",
  "theoryLocale": "es" | "pt-BR" | "ca",
  "codeLocale": "es" | "pt-BR" | "ca",
  "code": "string (opcional, máx. 20 000 caracteres)",
  "hintsShown": 0
}
```

Límites: máx. 20 mensajes en el historial, cada mensaje 1–4 000 caracteres.

Respuesta **200** `text/event-stream`:

```
data: {"delta":"fragmento de texto"}

data: [DONE]
```

Cabeceras: `X-Tutor-Provider` (`openai` | `anthropic` | `local`), `X-RateLimit-Remaining`.

| Código | Cuándo | Cuerpo |
| --- | --- | --- |
| 400 | JSON inválido o no cumple el esquema | `{ "error": "invalid_request" }` |
| 404 | Lección inexistente o no publicada | `{ "error": "lesson_not_found" }` |
| 429 | Límite diario por cliente alcanzado (`TUTOR_DAILY_LIMIT`) | `{ "error": "daily_limit" }` |

Si el proveedor externo falla a mitad de stream, el cliente recibe el error como `TutorStreamError` y puede reintentar.

## `POST /api/tutor/review` — revisión de código

Cuerpo: `{ "code": string (máx. 20 000), "locale"?: "es" | "pt-BR" | "ca" }`.

- **200** → `{ "findings": Finding[], "summary": string }`
- `Finding` = `{ line, column, severity: "error" | "warning" | "info", rule, message }`. Las reglas son deterministas (no usan IA).
- **400** si el cuerpo no es válido.

## `POST /api/tutor/voice-token` — sesión de voz

Cuerpo: `{ "lessonId": string, "locale": "es" | "pt-BR" | "ca" }`.

- Con `OPENAI_API_KEY`: **200** → `{ "mode": "realtime", "model": string, "token": string, "expiresAt": number }`. El token es efímero; la clave maestra no sale del servidor.
- Sin clave: **200** → `{ "mode": "browser", "reason": "no_realtime_key" }`. El cliente usa Web Speech del navegador. Es una respuesta válida, no un error.

## Rutas de página relevantes

| Ruta | Estado HTTP |
| --- | --- |
| `/`, `/cursos`, `/panel`, `/cursos/{id}` publicada | 200 (prerender estático) |
| `/cursos/{id}` inexistente o no publicada | **404** real (vía `src/proxy.ts`, reescritura a `/no-encontrado`) |
| `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest` | 200 |

## Estado de verificación

- Verificado por HTTP contra `next start`: todas las rutas anteriores, `/api/courses`, `/api/tutor` (flujo SSE local y 400/404/429 en lógica), `/api/tutor/review`, `/api/tutor/voice-token` sin clave.
- **No verificado**: llamadas reales a OpenAI (chat, Realtime) y Anthropic. El código sigue las APIs públicas documentadas, pero no se ha probado con claves reales desde este entorno.
