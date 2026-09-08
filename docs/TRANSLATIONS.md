# Sistema de traducciones e internacionalización

La institución modela 39 idiomas en el catálogo y evita duplicar la aplicación por idioma. Cada superficie de interfaz debe usar una clave del diccionario, mientras que los contenidos utilizan metadatos de idioma y estado de traducción.

| Elemento | Implementación actual | Convención de ampliación |
|---|---|---|
| Metadatos de idioma | `LANGUAGE_CATALOG`: código, locale, nombre, endónimo, escritura y dirección. | Mantener códigos cortos y `locale` BCP 47 cuando sea necesario. |
| Diccionario UI | `shared/i18n.ts` contiene claves estables y traducciones iniciales en ES, EN y PT. | Añadir las mismas claves por locale; la ausencia de clave se resuelve en español. |
| Detección | `resolveLocale()` acepta etiqueta del navegador, normaliza subtags y valida contra el catálogo. | Conectar `navigator.languages` solo en cliente y permitir siempre cambiar la elección. |
| Contenido | `translationStatus` declara si una pieza existe en base ES, ES/EN/PT o solo con metadatos. | Nunca mostrar un idioma como traducido sin una versión editorial revisada. |
| RTL | Árabe y urdu declaran `rtl`. | Aplicar `dir` en el documento y probar orden, iconos y lectura en cada componente. |

La plataforma incluye una interfaz base en español, inglés y portugués. Los 39 idiomas son seleccionables como idiomas de estudio y cuentan con metadatos de presentación. Las localizaciones no traducidas usan un respaldo visible en español para no simular cobertura editorial inexistente.

