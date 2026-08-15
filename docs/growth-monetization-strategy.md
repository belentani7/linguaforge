# Estrategia de crecimiento y monetización de LinguaForge

**Autoría del producto:** Pedro Belentani · [belentani.eu](https://belentani.eu) · [belentani7studio@proton.me](mailto:belentani7studio@proton.me)

**Estado del documento:** estrategia operativa propuesta. No constituye una previsión financiera ni garantiza ingresos. No activa pagos, anuncios, afiliación, correo externo ni migraciones de infraestructura.

## Resumen ejecutivo

LinguaForge tiene un activo diferencial claro: una plataforma open source con diez idiomas, rutas bidireccionales, progresión A1–C2, diagnóstico, práctica, SRS, progreso persistido, métricas de crecimiento y una arquitectura gobernada. El camino con mejor relación entre coste de mantenimiento y potencial de ingresos no es colocar publicidad desde el primer día, sino construir un embudo compuesto por **contenido gratuito indexable**, **producto gratuito útil**, **patrocinios recurrentes**, **planes institucionales de seguimiento y métricas**, y **servicios premium opcionales que no bloqueen el núcleo abierto**. El caso de Openwords resulta relevante porque combinó software y contenido abiertos con una propuesta B2B de seguimiento y métricas para instituciones educativas [1].

No existe una forma responsable de garantizar “ingresos pasivos máximos” con coste absoluto de cero. Los proveedores gratuitos tienen límites cambiantes, las pasarelas de pago cobran o exigen cumplimiento, el tráfico orgánico necesita contenido y mantenimiento, y las donaciones dependen de una comunidad activa. La estrategia correcta es maximizar **ingreso recurrente potencial por unidad de mantenimiento**, limitar el coste fijo, medir cada embudo y conservar una ruta de apagado. Mientras no haya datos de Search Console, GA4, conversiones ni clientes, solo se pueden definir fórmulas, hipótesis y experimentos; no cifras de ingresos.

## 1. Auditoría de activos actuales

La base existente permite monetizar sin rehacer el producto. El backend ya expone catálogo de idiomas, rutas, diagnóstico, práctica, progreso, SRS, feedback, multimedia verificada, métricas de crecimiento y automatizaciones idempotentes. La UI ofrece una experiencia de dashboard con identidad pública, progreso y llamada a continuar aprendiendo. El repositorio es público y la documentación cubre privacidad, procedencia, accesibilidad, SEO, contenido y gobierno.

| Activo actual | Valor de adquisición o conversión | Monetización compatible | Brecha antes de escalar |
|---|---|---|---|
| Diez idiomas y 90 rutas bidireccionales | Muchas entradas SEO por combinación origen–destino | Patrocinios por idioma, colecciones premium y licencias institucionales | Contenido productivo por ruta todavía limitado |
| CEFR A1–C2 y diagnóstico | Mensaje de posicionamiento y páginas de intención educativa | Evaluación avanzada, informes y planes de centros | Validar precisión pedagógica y cobertura real |
| Práctica, lecciones y SRS | Retención y recurrencia | Membresía opcional por analítica, exportaciones o packs | Importar un banco amplio con licencias verificadas |
| Progreso, racha, XP y métricas | Activación y retorno | Planes de familias, tutores y centros | Medir cohortes y conversión real |
| Jobs gestionados e idempotencia | Persistencia operativa y reporting | Informes B2B y soporte de implementación | Conectar cron desplegado solo tras aprobación |
| GitHub público y documentación | Confianza, contribuciones y distribución | GitHub Sponsors, Open Collective, contratos B2B | Crear comunidad y perfil de patrocinio |

## 2. Propuesta de valor gratuita

El núcleo gratuito debe ser suficientemente útil para cumplir la promesa pública “Manos Abiertas / Cruzando el Charco”: acceso a las rutas, ejercicios disponibles, progreso básico, SRS básico, documentación y formatos de contenido abiertos cuando las licencias lo permitan. No se debe convertir el producto en una demostración artificial con límites que impidan aprender.

La frontera de pago debe vender **capacidad, coordinación y conveniencia**, no el derecho elemental a aprender. El usuario gratuito puede estudiar; el usuario premium puede obtener informes detallados, exportaciones, colecciones curadas, seguimiento multiusuario, herramientas de autoría y soporte. El software principal puede permanecer abierto mientras los servicios gestionados, la curación y la operación institucional sostienen el negocio.

## 3. Escalera de monetización recomendada

| Nivel | Oferta | Cliente | Automatización | Prioridad |
|---|---|---|---|---|
| Gratuito | App, rutas abiertas, progreso básico y contenido con licencia | Estudiantes y comunidad | Entrega automática y feedback local | Inmediata |
| Apoyo recurrente | GitHub Sponsors u Open Collective mensual/anual | Usuarios satisfechos y mantenedores | Cobro y recibos de la plataforma | Primera monetización |
| Premium individual | Informes avanzados, exportaciones, packs curados, historial ampliado | Aprendices intensivos | Acceso por rol y pago alojado | Después de medir uso |
| Institucional | Panel de cohortes, progreso agregado, rutas y soporte | Academias, ONG, universidades y empresas | Informes periódicos y gestión de licencias | Mayor potencial por cliente |
| Afiliación selectiva | Recomendaciones transparentes de herramientas o libros relevantes | Usuarios con intención comercial | Enlaces etiquetados y disclosure | Solo cuando exista tráfico |
| Publicidad ética | Espacios limitados y no invasivos | Audiencia suficientemente grande | Inserción controlada | Última prioridad |

**Recomendación:** comenzar por patrocinio recurrente y una oferta institucional de bajo alcance. GitHub Sponsors indica que los patrocinios desde cuentas personales no tienen comisión para el proyecto patrocinado, mientras que las cuentas de organización pueden tener hasta un 6 % de comisión [2]. Open Collective documenta contribuciones mensuales o anuales modificables y cancelables [3]. Ambos mecanismos son más coherentes con un proyecto open source que una red publicitaria desde el inicio.

Stripe Payment Links puede aceptar pagos únicos, donaciones y suscripciones mediante una página alojada, con parámetros UTM y herramientas de recuperación para suscripciones [4]. Es una opción de implementación ligera, pero no es coste cero: exige cuenta, revisión de comisiones, impuestos, reembolsos, protección de datos y condiciones de servicio. No se debe integrar hasta tener oferta, precio, jurisdicción y aprobación.

## 4. Embudo de adquisición de bajo coste

El embudo recomendado es **descubrimiento → prueba → hábito → recomendación → apoyo o contrato**. El descubrimiento se apoya en páginas realmente localizadas por idioma, guías de aprendizaje, repositorio público, comunidad open source y lanzamientos puntuales. Google recomienda URLs distintas para versiones lingüísticas, enlaces `hreflang` bidireccionales y contenido visible en un solo idioma por página; también advierte que cambiar el idioma solo mediante cookies o cabeceras puede impedir el rastreo completo [5] [6].

Cada página indexable debe resolver una intención concreta, por ejemplo “portugués para hispanohablantes A1”, “español para lusófonos”, “SRS de francés A2” o “ruta de conversación mandarín–inglés”. No se deben generar 90 páginas vacías para aparentar escala. Una ruta solo se indexa cuando tiene contenido suficiente, revisión lingüística, canonical, `hreflang`, datos estructurados y una experiencia útil.

GitHub funciona como canal de confianza técnica y colaboración. Product Hunt puede servir como lanzamiento puntual: su guía afirma que el servicio es gratuito, recomienda presentar una propuesta clara, preparar materiales y usar el lanzamiento para conversación y feedback; también aclara que no existe una fórmula universal de éxito [7] [8]. Debe tratarse como experimento de distribución, no como fuente garantizada de usuarios o ingresos.

## 5. Recursos reutilizables y control de licencias

Tatoeba se presenta como una asociación sin ánimo de lucro que recopila frases y traducciones para reutilización, pero sus términos recuerdan que las licencias pueden variar y que la precisión de traducciones y audios no está garantizada [9]. Por ello, cada importación debe guardar fuente, licencia, atribución, versión, fecha, idioma y estado de revisión. Wiktionary/Wiktextract y proyectos comunitarios pueden ser fuentes de investigación, pero no deben entrar en producción sin revisar licencia, cobertura y calidad por idioma.

La curación de recursos es una ventaja comercial si se transforma en un catálogo mantenido: diccionarios, frecuencia, ejemplos, audio, ejercicios y herramientas. La lista comunitaria `awesome-language-learning` sirve como mapa del ecosistema y enumera proyectos de diccionarios, SRS, TTS, STT, frecuencia y traducción; no sustituye la auditoría individual de sus licencias [10]. La promesa debe ser “recursos verificables y mantenidos”, no “más de 3000 herramientas” sin inventario.

El CEFR ofrece seis niveles A1–C2 y descriptores “can-do”; el Consejo de Europa también advierte que las descripciones de referencia por idioma son necesarias para convertir el marco general en especificaciones concretas [11]. LinguaForge puede usar el CEFR para estructura y comunicación, pero no debe presentarse como certificación oficial sin evaluación y acreditación independientes.

## 6. Arquitectura de coste mínimo y persistencia

La arquitectura actual de LinguaForge debe mantenerse como sistema principal mientras no exista una limitación concreta. La base de datos gestionada, el almacenamiento de objetos, el backend tRPC, los jobs idempotentes y el frontend integrado reducen duplicación y riesgo de migración. No se recomienda cambiar automáticamente a Vercel, Cloudflare, Turso, Supabase, Neon o R2 únicamente porque tengan una capa gratuita anunciada. Una migración solo tendría sentido si se documentan límites, región, copias, exportación, costes por exceso, seguridad y reversibilidad.

La persistencia automática se diseña con cinco reglas: los datos críticos viven en la base gestionada; los archivos grandes viven en almacenamiento de objetos; cada job tiene clave de idempotencia y estado; cada mutación externa queda pausada por defecto; y existen exportaciones o restauraciones verificables. “Gratis” no significa “sin mantenimiento”: la opción de menor coste real es reducir proveedores, interfaces y tareas manuales.

| Función | Diseño de mínimo mantenimiento | Estado recomendado |
|---|---|---|
| Métricas | `growth.summary`, feedback y reportes internos | Activo y medible |
| Jobs | Heartbeat gestionado, sin temporizadores en proceso | Activo, cron externo desactivado |
| Correo | Borradores y revisión humana | No conectar todavía |
| Pagos | Enlace alojado tras aprobación comercial y legal | No activar todavía |
| Afiliación | Tabla de enlaces con disclosure, UTM y revisión | Diseñar antes de publicar |
| Multimedia | S3/objeto + metadatos de licencia y consentimiento | Solo activos verificados |
| SEO | URLs estables, sitemap, canonical, `hreflang` y contenido útil | Ampliar gradualmente |

## 7. Automatización de crecimiento sin costes ocultos

La automatización debe ser determinista cuando no necesita juicio: validar contenido, detectar enlaces rotos, generar informes, calcular métricas, actualizar sitemaps y crear borradores. Las tareas de IA deben limitarse a clasificación, propuesta o resumen y conservar revisión humana. No se debe usar una sesión de IA recurrente para tareas que pueden ser código, porque aumenta coste y fragilidad.

El ciclo mínimo es semanal: validar contenido y licencias; recalcular métricas; identificar páginas con impresiones pero bajo CTR; crear un borrador de mejora; revisar manualmente; publicar solo después de aprobación; y registrar el resultado. Cada ejecución necesita `executionKey`, `lastRunAt`, `lastStatus`, `lastError`, `lastResult`, logs y botón de pausa. No se deben enviar correos, publicar contenido o modificar secretos automáticamente.

## 8. Escenarios económicos sin inventar ingresos

Sin tráfico, usuarios activos, conversión y precio no es válido inventar una cifra de ingresos. Se debe usar una hoja o informe con variables observadas:

| Variable | Definición |
|---|---|
| `V` | visitantes cualificados mensuales |
| `A` | porcentaje que crea una cuenta |
| `R` | porcentaje de cuentas que vuelve o completa una acción clave |
| `C` | porcentaje de usuarios activos que convierte |
| `P` | ingreso mensual neto por usuario o cliente |
| `S` | patrocinio mensual neto |
| `B` | ingreso mensual neto B2B |
| `K` | costes variables, impuestos, devoluciones y herramientas |

La fórmula de referencia es `ingreso neto = V × A × R × C × P + S + B − K`. En el escenario conservador, solo se considera patrocinio voluntario y una prueba institucional; en el escenario base, se añade una membresía opcional después de observar retención; en el expansivo, se añaden contratos institucionales y contenido premium curado. Los tres escenarios deben rellenarse con datos reales mensuales, nunca con porcentajes asumidos como hechos.

La métrica principal inicial no es el ingreso, sino el **mantenimiento por ingreso potencial**: horas mensuales de operación, coste variable, incidencias y usuarios retenidos. Si un canal produce ingresos pero exige revisión diaria, soporte y cumplimiento desproporcionados, deja de ser pasivo y debe pausarse.

## 9. Plan de 90 días

Durante los primeros 30 días se debe mejorar el producto gratuito: importar una primera colección pequeña con licencias verificadas, crear páginas de rutas con contenido real, añadir un bloque de apoyo open source, instalar medición consentida y definir eventos de activación. No se deben activar anuncios ni pagos todavía.

Entre los días 31 y 60 se debe publicar el perfil de patrocinio, preparar una página institucional, entrevistar a usuarios y profesores, lanzar un experimento de Product Hunt o comunidad open source y comparar dos mensajes de valor. El experimento debe medir visitas, registros, activación, retorno y solicitudes B2B, no solo votos o estrellas.

Entre los días 61 y 90 se puede seleccionar una sola vía de pago: patrocinio recurrente, pago alojado para una membresía muy concreta o piloto institucional. Se deben publicar precios y condiciones claras, registrar conversiones con UTM, probar reembolsos y limitar el alcance. Si el piloto no genera uso o feedback de calidad, se revisa la oferta antes de añadir otro canal.

## 10. Controles legales, de confianza y de marca

La afiliación debe identificarse de forma visible. La publicidad no debe perfilar usuarios sin base legal y consentimiento cuando corresponda. El correo necesita proveedor, consentimiento, finalidad, retención, cancelación y revisión humana. Los datos de progreso deben minimizarse y permitir eliminación. Los activos de audio, vídeo, voz e imagen deben conservar licencia y consentimiento. Las afirmaciones de nivel deben describir progreso educativo, no certificación oficial ni resultados garantizados.

La marca puede presentarse como un taller open source firmado por Pedro Belentani: transparente, útil, multilingüe, orientado al aprendizaje y respetuoso con el usuario. La escasez artificial, la culpa por perder rachas y los paywalls que bloquean el aprendizaje básico contradicen la propuesta de acceso abierto y dañan la retención a largo plazo.

## 11. Decisión recomendada

La decisión de mayor calidad es **mantener el núcleo gratuito y open source, activar primero patrocinio recurrente y validación institucional, y retrasar publicidad, afiliación y pagos hasta disponer de tráfico y consentimiento medidos**. Esta secuencia conserva la promesa pública, reduce mantenimiento, crea datos de demanda y permite monetizar valor añadido sin convertir el aprendizaje elemental en un peaje.

La estrategia no promete ingresos pasivos garantizados. Sí establece una ruta para que una parte creciente de la adquisición, entrega, medición y cobro sea automática, reversible y de bajo mantenimiento. La siguiente autorización necesaria, si se desea ejecutarla, es elegir un único canal inicial —patrocinio, membresía o piloto institucional— y proporcionar los datos o credenciales estrictamente necesarios; no hace falta activar todos los canales a la vez.

## Referencias

[1]: https://rising.globalvoices.org/blog/2017/03/15/building-a-sustainable-open-source-platform-for-language-learning/ "Global Voices — Building a Sustainable, Open-Source Platform for Language Learning"
[2]: https://docs.github.com/en/sponsors/getting-started-with-github-sponsors/about-github-sponsors "GitHub Docs — About GitHub Sponsors"
[3]: https://documentation.opencollective.com/giving-to-collectives/making-a-recurring-contribution "Open Collective Docs — Making a Recurring Contribution"
[4]: https://docs.stripe.com/payment-links "Stripe Docs — Payment Links"
[5]: https://developers.google.com/search/docs/specialty/international/localized-versions "Google Search Central — Localized Versions"
[6]: https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites "Google Search Central — Managing Multilingual Sites"
[7]: https://www.producthunt.com/launch "Product Hunt — Launch Guide"
[8]: https://www.producthunt.com/launch/preparing-for-launch "Product Hunt — Preparing for Launch"
[9]: https://tatoeba.org/en/terms_of_use "Tatoeba — Terms of Use"
[10]: https://github.com/Vuizur/awesome-language-learning "GitHub — Awesome Language Learning"
[11]: https://www.coe.int/en/web/common-european-framework-reference-languages/level-descriptions "Council of Europe — CEFR Levels"


## Decisión operativa recibida: coste mínimo y comunidad primero

La prioridad aprobada es **equilibrio con sesgo a coste mínimo y comunidad**. La secuencia queda fijada así: primero contenido abierto verificable y SEO útil; después comunidad, repositorio y feedback; finalmente donaciones mediante GitHub Sponsors u otra vía equivalente cuando exista tracción; y solo después un producto premium opcional si la demanda se observa y se puede operar con cumplimiento fiscal, reembolsos, soporte y privacidad.

No se activarán pagos ahora, no se usarán anuncios invasivos y no se desplegará un proveedor externo en sustitución de WebDev. El correo queda limitado a una futura verificación y newsletter mensual opt-in, con baja y límites, y permanecerá desactivado hasta configurar el proveedor mediante el canal seguro.

El primer activo de contenido aprobado es el lote español→inglés de cinco entradas Tatoeba CC BY 2.0 FR, importado en la ruta persistida con versión `0.2.0` y atribución por entrada. Esta importación pequeña no debe presentarse como cobertura completa; sirve para verificar el circuito de procedencia, validación y consumo antes de ampliar por idioma y nivel.
