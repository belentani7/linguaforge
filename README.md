# LinguaForge

LinguaForge es una plataforma web open source para aprender idiomas con intención: rutas bidireccionales, progresión MCER de A1 a C2, lecciones interactivas, práctica libre, repetición espaciada y progreso personal.

## Alcance actual

La interfaz inicial incluye el catálogo de español, inglés, mandarín, hindi, árabe, portugués, bengalí, ruso, japonés y francés; selección de idioma objetivo; mapa MCER; panel de racha, XP y lecciones; módulos de vocabulario, gramática, pronunciación y conversación; actividades de completar frases, traducción y opción múltiple; práctica libre; sesión SRS; perfil; diagnóstico inicial y temas claro/oscuro.

La base de datos ya define las entidades necesarias para rutas, niveles, módulos, lecciones, ejercicios, entradas de vocabulario, diagnósticos, progreso y tarjetas SRS. El contenido a escala de más de 1000 entradas por par se gestionará como contenido versionado y con metadatos de licencia; no se incorporan corpus sin una fuente y permiso de reutilización verificables.

## Stack

El proyecto usa React 19, Tailwind CSS 4, Express, tRPC 11, Drizzle ORM, MySQL/TiDB, Manus OAuth y Vitest. Las llamadas de producto se exponen mediante procedimientos tRPC con contratos tipados.

## Desarrollo local

```bash
pnpm install
pnpm dev
pnpm check
pnpm test
```

Las variables de entorno son administradas por el entorno de desarrollo. No se deben subir archivos `.env` ni credenciales al repositorio.

## Estructura

| Ruta | Responsabilidad |
|---|---|
| `client/src/pages/Home.tsx` | Shell de aprendizaje y pantallas principales del MVP |
| `client/src/index.css` | Sistema visual, responsive, accesibilidad y temas |
| `shared/languages.ts` | Catálogo tipado, niveles MCER y pares bidireccionales |
| `drizzle/schema.ts` | Modelo relacional del producto |
| `server/db.ts` | Consultas de base de datos |
| `server/routers.ts` | Contratos tRPC de autenticación y catálogo |
| `docs/plan-y-mapa.md` | Plan de producto, navegación y widgets |
| `docs/fuentes-y-criterios.md` | Fuentes y criterios pedagógicos, técnicos y de licencia |

## Fuentes y licencias

El diseño curricular se basa en los descriptores del [Consejo de Europa — CEFR][1]. La accesibilidad toma como referencia [WCAG 2.2 de W3C][2]. La normalización de idiomas usa la lista de códigos de la [Biblioteca del Congreso][3]. El criterio para integrar contenido abierto sigue la definición de [Recursos Educativos Abiertos de UNESCO][4]. Las decisiones detalladas y sus referencias están en `docs/fuentes-y-criterios.md`.

El código se publica bajo MIT. Cada contenido lingüístico deberá conservar atribución, fuente y licencia específica. Las contribuciones deben evitar material protegido sin autorización.

## Contribuir

Consulta `CONTRIBUTING.md` antes de abrir un issue o pull request. Las contribuciones deben mantener el soporte de teclado, foco visible, contraste y adaptación móvil, y deben incluir pruebas cuando modifiquen lógica de diagnóstico, progreso o SRS.

[1]: https://www.coe.int/en/web/common-european-framework-reference-languages/level-descriptions
[2]: https://www.w3.org/TR/WCAG22/
[3]: https://www.loc.gov/standards/iso639-2/php/code_list.php
[4]: https://www.unesco.org/en/open-educational-resources
