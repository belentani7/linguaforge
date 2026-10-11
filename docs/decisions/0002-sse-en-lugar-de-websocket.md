# 0002 · Streaming SSE por HTTP para el tutor (en lugar de WebSocket)

- Estado: aceptada (revisable)
- Fecha: 2026-10-11

## Contexto
El encargo menciona WebSocket con Claude o GPT-4o. El tutor solo necesita enviar texto del servidor al navegador en un sentido, con streaming de tokens.

## Decisión
`POST /api/tutor` devuelve `text/event-stream`. El cliente lee con `fetch` y `ReadableStream` (`src/lib/tutor/client-stream.ts`).

## Motivos
- Un único sentido de datos: SSE basta y es más simple de cachear, limitar y observar.
- Funciona en Route Handlers de Next sin servidor WebSocket propio ni despliegue especial.
- Cancelación limpia con `AbortSignal`.

## Cuándo reconsiderar
Si aparece audio bidireccional de baja latencia en el propio chat (no en el panel de voz), o colaboración en tiempo real. La voz ya usa WebRTC/WebSocket del proveedor Realtime, no este endpoint.
