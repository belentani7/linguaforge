# Notas de investigación: crecimiento y monetización

Estas notas reúnen fuentes públicas consultadas para la estrategia de LinguaForge. No son métricas de tráfico propio ni una previsión financiera.

## Hallazgos verificados

- **GitHub Sponsors**: GitHub indica que las cuentas personales no pagan comisiones por patrocinios; las cuentas de organización pueden pagar hasta un 6 %. También admite patrocinios recurrentes y fondos de contrapartida sujetos a requisitos y términos. Fuente: https://docs.github.com/en/sponsors/getting-started-with-github-sponsors/about-github-sponsors
- **Open Collective**: su documentación describe contribuciones mensuales o anuales recurrentes y permite cancelar o modificar contribuciones. Fuente: https://documentation.opencollective.com/giving-to-collectives/making-a-recurring-contribution
- **Stripe Payment Links**: Stripe documenta enlaces alojados para pagos únicos, donaciones y suscripciones, con seguimiento mediante parámetros UTM y recuperación de ingresos para suscripciones. Requiere una cuenta y la evaluación posterior de comisiones, impuestos y cumplimiento. Fuente: https://docs.stripe.com/payment-links
- **Openwords**: el caso publicado por Global Voices describe una plataforma de aprendizaje de idiomas open source con contenido abierto y un modelo de ingresos B2B basado en seguimiento y métricas para instituciones educativas. Es evidencia de un patrón de modelo, no una garantía de éxito ni una fuente actual de precios. Fuente: https://rising.globalvoices.org/blog/2017/03/15/building-a-sustainable-open-source-platform-for-language-learning/
- **Recursos de contenido**: Tatoeba describe una colección comunitaria de frases y traducciones con reutilización bajo licencias Creative Commons variables; sus términos advierten que la precisión, traducción y audio no están garantizados, por lo que LinguaForge debe conservar atribución, licencia y revisión. Fuente: https://tatoeba.org/en/terms_of_use
- **CEFR**: el Consejo de Europa define seis niveles, A1–C2, con descriptores “can-do”, y distingue entre el marco general y descripciones de referencia por idioma. Fuente: https://www.coe.int/en/web/common-european-framework-reference-languages/level-descriptions
- **Competencia**: Wirecutter/NYT (actualizado en marzo de 2026) observa que las aplicaciones recomendadas cubren distintos estilos, que las funciones de conversación y pronunciación son diferenciadores, y que muchas aplicaciones no llegan a C1–C2. Esto sugiere una oportunidad de posicionamiento, no una prueba de demanda cuantificada para LinguaForge. Fuente: https://www.nytimes.com/wirecutter/reviews/best-language-learning-apps/
- **Ecosistema open source**: la lista CC0 `awesome-language-learning` reúne proyectos, diccionarios, SRS, TTS, STT, datos de frecuencia y herramientas que pueden servir como mapa de investigación; cada dependencia requiere su propia comprobación de licencia. Fuente: https://github.com/Vuizur/awesome-language-learning

## Límites

No se han usado todavía datos propios de Google Search Console, GA4, Ahrefs, Semrush, Similarweb o DataForSEO. Por tanto, no se deben afirmar tráfico, conversión, CAC, LTV, ingresos esperados ni rentabilidad. Para un estudio de tráfico cuantitativo debe elegirse primero una fuente de datos y respetar sus límites de volumen y alcance mundial.

## Decisiones recibidas: verificación primaria de Tatoeba

La página oficial de términos de Tatoeba indica que las frases textuales usan por defecto CC BY 2.0 France, con obligación de atribución; el audio puede tener licencias diferentes y algunas frases de audio pueden no estar autorizadas para uso fuera del sitio. La propia página indica que, ante incertidumbre, no se debe añadir la frase. Por tanto, el importador debe conservar autor, licencia y URL por activo; el primer lote debe limitarse a texto cuya licencia esté explícita y excluir audio hasta verificar su licencia individual.

Fuente primaria: https://tatoeba.org/en/terms_of_use

## Verificación primaria de Mozilla Common Voice

La página oficial del Mozilla Data Collective muestra datasets de Common Voice con licencia CC0-1.0, en formatos TSV y MP3 según el conjunto, y tamaños que van desde megabytes hasta decenas de gigabytes. Esto permite considerar audio abierto, pero no justifica descargar grandes datasets dentro del MVP ni afirmar coste cero: el tamaño, almacenamiento, procesamiento y distribución deben limitarse por idioma y lote. La importación inicial debe usar metadatos de versión, locale, licencia y URL de descarga, y mantener audio fuera del repositorio.

Fuentes primarias: https://commonvoice.mozilla.org/en/datasets y https://commonvoice.mozilla.org/en/terms-of-use

## Verificación primaria de Project Gutenberg

Project Gutenberg explica que muchos ebooks están en dominio público en EE. UU., pero exige comprobar la situación jurídica en la jurisdicción de quien redistribuye; también advierte que existen obras todavía protegidas. La marca “Project Gutenberg” es registrada y su uso comercial puede estar sujeto a condiciones. Por ello, LinguaForge no importará automáticamente textos de Gutenberg: solo se admitirán obras cuya situación de dominio público esté comprobada para la jurisdicción relevante, con la fuente concreta y sin usar la marca como reclamo comercial.

Fuente primaria: https://www.gutenberg.org/policy/permission.html

## Verificación primaria de LibreLingo

El repositorio oficial describe el software como AGPLv3 y advierte que el contenido de cursos y otros materiales creativos pueden tener licencias distintas, como Creative Commons. LinguaForge puede estudiar el código y los formatos, pero no copiar cursos automáticamente sin revisar la licencia de cada curso y sus atribuciones. La compatibilidad con la licencia del software también debe evaluarse antes de reutilizar código, no solo datos.

Fuente primaria: https://github.com/kantord/LibreLingo

## Verificación primaria de Kaikki/Wiktextract

Kaikki publica datos extraídos de Wiktionary en JSONL y gzip, actualizados regularmente; la página también muestra que los archivos por idioma pueden ser muy grandes. El extracto incluye léxico, glosas y enlaces de audio con particularidades propias. Para LinguaForge, el primer importador debe descargar únicamente un subconjunto por idioma, conservar la edición/dump de origen y revisar la licencia aplicable a cada tipo de dato; no se debe importar el dump completo ni audio masivo al almacenamiento del proyecto.

Fuente primaria: https://kaikki.org/dictionary/rawdata.html
