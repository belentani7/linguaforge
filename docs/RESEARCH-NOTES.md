# Notas de investigación y trazabilidad de diseño

La institución reutiliza las prioridades complementarias de los proyectos de referencia del mismo titular: **Manos Abiertas** aporta inclusión digital, acceso multilingüe y orientación práctica; **LinguaForge** aporta progresión CEFR, ejercicios, SRS, perfil y contenido con procedencia. No se trasladan testimonios, valoraciones, resultados personales ni reseñas de los sitios de referencia.

| Fuente | Hallazgo aplicado | URL |
|---|---|---|
| Consejo de Europa — CEFR | Seis niveles A1–C2 y descriptores de desempeño aplicables a distintas lenguas. | https://www.coe.int/en/web/common-european-framework-reference-languages/level-descriptions |
| MDN — Internationalization | Uso de etiquetas BCP 47 y APIs `Intl` para operaciones dependientes de idioma y cultura. | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Internationalization |
| MDN — MediaRecorder | El navegador puede grabar flujos multimedia mediante `MediaRecorder`. | https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder |
| MDN — getUserMedia | El acceso al micrófono necesita HTTPS y permiso explícito de la persona usuaria. | https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia |
| Open edX Platform | Separación entre entrega del aprendizaje y gestión del contenido como patrón escalable. | https://github.com/openedx/openedx-platform/ |
| FreeLingo | Referencia funcional, no código reutilizado: ruta CEFR, tutor contextual, voz, flashcards y progresión. Su licencia AGPL impide incorporar código sin revisión de compatibilidad. | https://github.com/ArtCC/freelingo |

El repositorio de referencia de LinguaForge declara MIT para su código y pide conservar fuente, licencia, versión y atribución para materiales de terceros. La nueva base adopta esa separación en la documentación: el código de la plataforma no autoriza por sí solo la redistribución de textos, modelos, voces, grabaciones o datasets de terceros.

La práctica oral queda limitada a captura voluntaria, transcripción y comparación pedagógica con el objetivo de la lección. No incorpora clonación de voz, verificación de identidad, perfilado biométrico ni certificación automática de pronunciación.
