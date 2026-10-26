# CANON — LinguaForge

> Estado: VERIFIED / DOCUMENTED ONLY. Observado online el 2026-10-15.

## Misión
Sistema de aprendizaje multilingüe con práctica guiada, repetición espaciada y capacidades de IA.

## Usuarios
Aprendiz, tutor/editor y operador. Journey mínimo: seleccionar idioma, iniciar unidad, practicar, recibir feedback y recuperar progreso.

## Arquitectura observada
Monorepo TypeScript con apps, client, server, src, campus, drizzle, tests, docs y Vitest. Mantener la separación cliente/servidor y Drizzle; no imponer FastAPI sin una frontera demostrada.

## Estado
- VERIFIED: tests, Vitest, Drizzle, cliente, servidor y documentación estructural.
- VERIFIED: existen workflows y scripts de calidad.
- UNVERIFIED: cifras públicas de usuarios, finalización y valoración.
- RISK: lockfile divergente y correcciones que pueden ocultar fallos.

## Quality gates
Instalación congelada, typecheck, lint, tests, coverage y build. Ningún workflow debe convertir un fallo en éxito.

## Privacidad
Seeds sintéticos, mínimo de datos personales, exportación y borrado documentados.

## Decisión
Producto CORE de aprendizaje. Prioridad: CI reproducible, datos sintéticos y motor SRS antes de ampliar frontend.
