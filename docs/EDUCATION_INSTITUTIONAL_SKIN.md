# LinguaForge — Institutional Education Skin v1

## Estado y alcance
El sitio editorial raíz está compuesto por `index.html`, `itinerarios.html`, `metodo.html`, `recursos.html` y tres lecciones originales de demostración. No reemplaza la aplicación principal en `client/` ni promete que la API, la emisión de certificados o la traducción estén operativas.

## Identidad
Familia BELENTANI Education; jerarquía editorial y componentes comunes; símbolo de libro y puente dibujado en SVG original. Color de acento #176b62. Sin fuentes remotas, fotos sin licencia, tracking o animaciones automáticas.

## Navegación
Inicio → Itinerarios → Lección → Comprobación → Campus existente. Todos los enlaces relativos locales son verificables. En móviles, navegación visible (sin menú JavaScript obligatorio).

## Contenido
Las tres lecciones tienen objetivo observable, explicación, ejemplo, tarea, cuestionario con retroalimentación y rúbrica. El guardado en localStorage requiere pulsar explícitamente el botón; se puede borrar. No existe certificación ni envío de datos.

## Criterios de publicación y pruebas pendientes
- WCAG 2.2 AA como objetivo de conformidad; comprobar navegación por teclado, VoiceOver/NVDA, zoom 200/400 %, contraste y lectura de formularios.
- Core Web Vitals: LCP ≤2,5 s, INP ≤200 ms, CLS ≤0,1 (percentil 75 en datos de campo), medir; no declarar cumplimiento sin medición.
- OWASP ASVS 5.0 como referencia para superficies con backend; CSP de despliegue, headers y política de seguridad deben verificarse en el hosting.
- Probar enlaces, HTML y rendimiento en servidor estático; revisar también la app React en su pipeline independiente.

## Fuentes normativas
- https://www.w3.org/TR/WCAG22/
- https://www.w3.org/WAI/ARIA/apg/
- https://web.dev/articles/vitals
- https://asvs.owasp.org/
- https://standards.1edtech.org/

## Diseño de producto pendiente
Unificar componentes de `client/` y `campus/` mediante migración progresiva, sin duplicar fuentes de contenido. El contenido de este sitio raíz es suplementario y no pretende sustituir el corpus didáctico del repositorio.
