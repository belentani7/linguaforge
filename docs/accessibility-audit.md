# Auditoría de accesibilidad — LinguaForge

## Alcance revisado

Se revisaron las vistas de dashboard, idiomas, práctica, repaso y perfil en `client/src/pages/Home.tsx`. La búsqueda de interactivos definidos como `div` o `span` con `role="button"`, así como patrones de `role="button"` restantes, no devolvió coincidencias. La marca, las tarjetas de idioma, lección y destreza usan botones nativos.

## Criterios aplicados

Los controles interactivos deben ser alcanzables con teclado, activar su acción con Enter o Space según su semántica, exponer un nombre visible o `aria-label` y mostrar un indicador de foco. Los botones de icono tienen `aria-label`; los campos de práctica usan `label` y `htmlFor`; los selectores de idioma tienen valores visibles; y el sistema global añade `:focus-visible` con contraste reforzado en ambos temas.

## Resultado y límites

La verificación estática no sustituye una prueba manual con lector de pantalla ni una medición automatizada de contraste sobre cada estado dinámico. Esas comprobaciones deben ejecutarse antes de declarar la aplicación lista para producción. Los componentes de lección, diagnóstico, repaso y perfil comparten el mismo anillo de foco global y deben conservarlo cuando se amplíe su contenido.
