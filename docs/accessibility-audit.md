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

## Cobertura por vista del auditor de contratos

La ejecución ampliada de `pnpm accessibility:verify` cubre explícitamente los siguientes contratos: **dashboard**, navegación principal semántica y foco global; **idiomas**, selectores origen/destino y tarjetas como botones; **práctica**, campo etiquetado para completar/traducir y acción siguiente; **repaso**, botones de valoración SRS; y **perfil**, `fieldset`, `legend` y controles de formulario etiquetados. El verificador también conserva las comprobaciones globales del diálogo de diagnóstico, `DashboardLayout`, `NotFound` y `:focus-visible`.

El resultado reproducible actual es `passed: true` y `failures: []`. Esta evidencia confirma contratos estructurales y nombres accesibles en el código, pero no afirma por sí sola el orden físico de tabulación, la activación manual con `Tab`/`Shift+Tab`/`Enter`/`Space`, la experiencia con lector de pantalla ni la medición de contraste de cada estado dinámico; esas verificaciones siguen siendo una tarea de QA manual antes de declarar la experiencia sin fricciones.

## Auditoría reproducible de teclado — 15 de agosto de 2026

Se ejecutó `node scripts/audit-keyboard.mjs` contra el preview mediante Chromium/CDP en `/`, `/languages`, `/practice`, `/review` y `/profile`. El recorrido envió hasta 40 pulsaciones **Tab** por ruta, registró el elemento enfocado y comprobó que cada `button`, `a`, `input`, `select`, `textarea` y control con `tabindex` tuviera nombre accesible. El primer recorrido detectó diez checkboxes de objetivos sin nombre detectable; se corrigieron con `id`, `aria-label` basado en el nombre nativo del idioma y `aria-describedby="profile-target-help"`.

La segunda ejecución devolvió `passed: true`, `unnamedInteractiveCount: 0` en las cinco rutas y un recorrido de foco no vacío en todas. `node scripts/audit-interactions.mjs` también devolvió `findings: []`. Esta evidencia cubre las rutas principales solicitadas; todavía no sustituye una revisión humana de activación de controles, lectores de pantalla, zoom y todos los estados modales en el sitio publicado.

## Activación de controles y estados dinámicos

Se ejecutó `node scripts/audit-keyboard-interactions.mjs` mediante Chromium/CDP. La ejecución reproducible devolvió `passed: true` para: activación con **Space** del CTA del dashboard hacia práctica; apertura del diagnóstico desde idiomas con **Space**; cierre del diagnóstico con **Escape**; activación con **Space** de práctica hacia ejercicio, aceptando tanto contenido persistido como el estado vacío honesto; activación con **Space** de repaso hacia su sesión; y alternancia con **Space** de un checkbox de objetivos en perfil.

El diálogo de diagnóstico ahora tiene `tabIndex={-1}`, `aria-modal="true"`, `aria-labelledby` y un manejador explícito de `Escape`. La prueba cubre estados dinámicos observables y no solo nombres accesibles. La activación con **Enter** se confirmó posteriormente mediante CDP y quedó documentada en la sección de cierre reproducible; la evidencia no sustituye una revisión con lector de pantalla ni una sesión sobre el sitio publicado.

## Cierre reproducible de activación Enter — 15 de agosto de 2026

Se reejecutó `scripts/audit-keyboard-interactions.mjs` contra el preview real tras añadir activación explícita de Enter a los CTA de dashboard, práctica y repaso. El resultado fue `passed: true`: Enter activa dashboard→práctica y abre el diagnóstico; Space mantiene la activación de práctica→ejercicio, repaso→sesión y checkbox de perfil; Escape cierra el diálogo. Los estados observados fueron la vista de práctica, el diálogo abierto/cerrado, el estado vacío honesto de ejercicios y la cola SRS vacía. La auditoría cubre activación por teclado en las cinco rutas principales, aunque no sustituye una revisión con lector de pantalla ni una sesión sobre el sitio publicado.

## Cobertura ampliada de rutas — 15 de agosto de 2026

Se amplió `scripts/audit-keyboard.mjs` a `/`, `/languages`, `/practice`, `/review`, `/profile`, `/qa/pt-en`, `/404` y `/qa-dark/profile`. El primer recorrido detectó un selector de origen/destino sin nombre en `/languages`; se corrigió con `aria-label="Idioma de origen"` y `aria-label="Idioma de destino"`. La reejecución devolvió `passed: true`, `unnamedInteractiveCount: 0` y un recorrido de foco no vacío en las ocho rutas. Este resultado cubre foco y nombres accesibles en esas rutas; no sustituye lector de pantalla, contraste automatizado por estado ni tráfico publicado.

## Cierre de contraste y teclado — 15 de agosto de 2026

Se ejecutó `scripts/audit-contrast.mjs` sobre 17 rutas del preview, incluyendo `/qa-dark/dashboard` y `/qa-dark/languages`, después de ajustar los tokens muted/coral, los marcadores de idioma, los badges, el botón NotFound y los enlaces en modo oscuro. El resultado reproducible fue `passed: true` y `failureCount: 0`. La medición cubre los nodos visibles tras carga en las rutas auditadas; no pretende representar hover, focus, active, disabled, validación, todos los modales ni la versión publicada.

La auditoría `pnpm accessibility:interactions` también terminó con `passed: true` en todos sus escenarios, incluido Enter para abrir el diagnóstico. El CTA «Hacer diagnóstico» incorpora una activación explícita de Enter además de su activación nativa, y el escenario Space/Escape mantiene apertura y cierre verificables.

## Auditoría reproducible de estados dinámicos básicos — 15 de agosto de 2026

Se añadió `scripts/audit-dynamic-states.mjs`, expuesto como `pnpm accessibility:dynamic`. El script recorre `/`, `/languages`, `/practice`, `/review`, `/profile`, `/qa-dark/dashboard` y `/qa-dark/languages`; enfoca los controles visibles no deshabilitados, verifica que el foco se aplique, registra controles disabled sin tratarlos como errores y prueba la apertura y el cierre del diagnóstico con una interacción real y Escape CDP. La ejecución actual terminó con `passed: true`, `failureCount: 0`, siete rutas verificadas y un diálogo abierto/cerrado correctamente.

La cobertura sigue siendo deliberadamente parcial: no afirma que se hayan medido todos los estilos hover/active, todos los mensajes de validación/error, todos los modales de la aplicación, Shift+Tab completo, lector de pantalla, zoom ni el sitio publicado. Esos límites permanecen en `todo.md` como trabajo de QA adicional antes de declarar accesibilidad global.
