# Auditoría de accesibilidad — LinguaForge

## Alcance revisado

Se revisaron las vistas de dashboard, idiomas, práctica, repaso y perfil en `client/src/pages/Home.tsx`. La búsqueda de interactivos definidos como `div` o `span` con `role="button"`, así como patrones de `role="button"` restantes, no devolvió coincidencias. La marca, las tarjetas de idioma, lección y destreza usan botones nativos.

## Criterios aplicados

Los controles interactivos deben ser alcanzables con teclado, activar su acción con Enter o Space según su semántica, exponer un nombre visible o `aria-label` y mostrar un indicador de foco. Los botones de icono tienen `aria-label`; los campos de práctica usan `label` y `htmlFor`; los selectores de idioma tienen valores visibles; y el sistema global añade `:focus-visible` con contraste reforzado en ambos temas.

## Resultado y límites

La verificación estática no sustituye una prueba manual con lector de pantalla ni una medición automatizada de contraste sobre cada estado dinámico. Esas comprobaciones deben ejecutarse antes de declarar la aplicación lista para producción. Los componentes de lección, diagnóstico, repaso y perfil comparten el mismo anillo de foco global y deben conservarlo cuando se amplíe su contenido.

## Auditoría reproducible ampliada

La auditoría estática se amplió para cubrir todos los archivos `.tsx` bajo `client/src`, sin excluir `ComponentShowcase` ni componentes reutilizables. El script `scripts/audit-interactions.mjs` inspecciona `onClick`, `onKeyDown`, `onMouseDown`, `onPointerDown`, `onKeyUp`, `onChange` y `onSubmit`, y reconoce botones, enlaces, formularios, entradas, selects, diálogos, tabs, paginación y roles ARIA equivalentes.

Comando de verificación desde la raíz del proyecto:

```bash
node scripts/audit-interactions.mjs
```

La ejecución del 15 de agosto de 2026 produjo `findings: []`. Los resultados anteriores eran falsos positivos de componentes semánticos con propiedades multilínea y ya se corrigió el reconocimiento del auditor.

Esta comprobación estática complementa, pero no sustituye, el recorrido manual con `Tab`, `Shift+Tab`, `Enter`, `Space` y `Escape`, ni una medición automatizada de contraste sobre estados dinámicos. Antes de cada release se debe conservar el foco visible, verificar nombres accesibles en controles iconográficos y confirmar que los diálogos tengan una ruta de cierre.

## Segunda verificación reproducible de contratos

Como comprobación independiente de la búsqueda de eventos, `scripts/verify-accessibility.mjs` valida contratos concretos de foco global, diálogo de diagnóstico con nombre accesible, etiquetas de formularios, nombre accesible de navegación móvil y ruta semántica de salida en NotFound.

Se ejecuta con:

```bash
pnpm accessibility:verify
```

La ejecución del 15 de agosto de 2026 produjo `passed: true` y `failures: []` para los cinco contratos revisados.

## Verificación de etiquetas dinámicas de idioma

La UI de diagnóstico y repaso deriva el nombre y el nombre nativo del idioma desde `languages.list`, conservando localmente únicamente metadatos visuales como tono y abreviatura. `scripts/verify-language-labels.mjs` comprueba que no se reintroduzcan etiquetas fijas como `ESPAÑOL · A2` o `español` en esas vistas.

Se ejecuta con:

```bash
pnpm language-labels:verify
```

La ejecución del 15 de agosto de 2026 produjo `passed: true` y `failures: []`.
