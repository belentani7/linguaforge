# 0003 · Voz con degradación: Realtime si hay clave, navegador si no

- Estado: aceptada
- Fecha: 2026-10-11

## Contexto
Se pide voz humana conversacional en español, portugués de Brasil y catalán, con latencia objetivo < 300 ms. Ningún proveedor de voz es alcanzable desde el entorno de desarrollo, y ningún proveedor debe estar activo por defecto.

## Decisión
- `POST /api/tutor/voice-token` emite un token efímero de OpenAI Realtime si hay `OPENAI_API_KEY`.
- Sin clave responde 200 con `mode: "browser"`. El cliente usa Web Speech (`speechSynthesis` / reconocimiento).
- Si el audio pregrabado de introducción falla, se usa `speechSynthesis` con el texto.
- Las instrucciones de sesión piden frases cortas, máximo 3 por turno, sin leer código ni listas, y respuesta en el idioma del alumno.

## Estado
- Ruta del navegador: implementada; no probada en navegador real desde este entorno.
- Ruta Realtime: implementada según la API documentada; **no verificada** con una clave real. La latencia < 300 ms no está medida.
- Clips de voz humana por idioma: **pendientes** (la elección de voz del usuario sigue abierta).
