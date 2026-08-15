# Fuentes y criterios de LinguaForge

## Marco pedagógico

LinguaForge utilizará el **Marco Común Europeo de Referencia para las Lenguas (MCER/CEFR)** como sistema común de progresión. El Consejo de Europa organiza la competencia en seis niveles, de **A1 a C2**, agrupados en usuario básico, independiente y competente, y define los niveles mediante descriptores funcionales de tipo “puede hacer” [1]. Por ello, cada diagnóstico y cada lección se asociarán con una combinación de nivel, destreza y objetivo observable, en lugar de tratar el nivel como una etiqueta aislada.

El **Companion Volume 2020** amplía los descriptores y dispone de versiones oficiales en español, árabe y otros idiomas [2]. LinguaForge tomará sus descriptores como referencia de diseño curricular, pero no copiará materiales protegidos sin comprobar sus condiciones de uso. El contenido propio se almacenará con metadatos de autoría, licencia y fuente.

La evaluación inicial será diagnóstica y multidimensional. Para cada idioma objetivo, el usuario resolverá una secuencia breve de ítems de vocabulario, gramática, comprensión lectora y uso comunicativo. La puntuación se convertirá en una recomendación de nivel A1–C2, conservando la evidencia por destreza para evitar que una única puntuación oculte desequilibrios.

## Idiomas y normalización

La primera versión incluirá español, inglés, mandarín, hindi, árabe, portugués, bengalí, ruso, japonés y francés. El catálogo usará códigos ISO 639-1 y, cuando sea necesario para una desambiguación regional o técnica, ISO 639-2/3. La Biblioteca del Congreso describe ISO 639-2 como un código alfanumérico de tres letras y distingue también los códigos ISO 639-1 de dos letras [3]. Esta normalización permitirá que las rutas bidireccionales se representen como pares ordenados `sourceLanguage -> targetLanguage` sin duplicar la definición del idioma.

La cobertura inicial de contenidos se organizará por idioma origen, idioma destino, nivel MCER, temática, módulo y tipo de ejercicio. La cifra de más de 1000 entradas por par se tratará como objetivo de contenido versionado, no como datos inventados durante la generación de la interfaz. Cada entrada deberá tener traducción, ejemplo contextual, nivel, tema, fuente o autoría y licencia.

## Accesibilidad y experiencia web

La implementación seguirá **WCAG 2.2** como referencia técnica. W3C establece cuatro principios —perceptible, operable, comprensible y robusto— y criterios de éxito verificables con niveles de conformidad A, AA y AAA [4]. La aplicación priorizará el nivel AA: contraste suficiente, foco visible, navegación por teclado, etiquetas accesibles, mensajes de error comprensibles, objetivos táctiles adecuados, reducción de movimiento y estados de carga anunciables.

La accesibilidad no se limitará a una auditoría final. Cada componente interactivo se diseñará con HTML semántico, estados de foco y teclado desde el inicio. Las actividades de relación y arrastrar elementos tendrán una alternativa operable mediante teclado y controles explícitos, de modo que el ejercicio no dependa exclusivamente del ratón.

## Contenido abierto y licencias

UNESCO define los recursos educativos abiertos como materiales educativos, de enseñanza o investigación que están en el dominio público o bajo una licencia abierta que permite acceso, reutilización, adaptación y redistribución sin coste [5]. LinguaForge separará el código de los datos lingüísticos y registrará por entrada la licencia, la atribución y la URL de origen. El repositorio incluirá un archivo de licencias y no incorporará corpus, audio, traducciones o imágenes cuyo permiso de reutilización no esté claro.

## Repetición espaciada

El módulo SRS se implementará como un planificador determinista basado en el resultado de cada revisión. La tarjeta almacenará estado, intervalo, facilidad, número de repeticiones, fallos y próxima fecha de revisión. La primera versión permitirá respuestas equivalentes a “otra vez”, “difícil”, “bien” y “fácil”; el algoritmo se mantendrá encapsulado para poder ajustar parámetros sin cambiar el modelo de contenido. Las revisiones quedarán asociadas al usuario, idioma y par de traducción, y no modificarán la lección original.

## Referencias

[1]: https://www.coe.int/en/web/common-european-framework-reference-languages/level-descriptions "Council of Europe — The CEFR Levels"

[2]: https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-companion-volume-and-its-language-versions "Council of Europe — CEFR Companion Volume and language versions"

[3]: https://www.loc.gov/standards/iso639-2/php/code_list.php "Library of Congress — ISO 639-2 Language Code List"

[4]: https://www.w3.org/TR/WCAG22/ "W3C — Web Content Accessibility Guidelines 2.2"

[5]: https://www.unesco.org/en/open-educational-resources "UNESCO — Open Educational Resources"
