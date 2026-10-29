# PROJECT MASTER PROMPT — LinguaForge

## Identidad
LinguaForge es una plataforma open source para aprender idiomas con progresión CEFR/MCER, repetición espaciada, diagnóstico y contenido con procedencia verificable.

## Visión
Construir una experiencia de aprendizaje rigurosa, accesible y explicable para estudiantes de español, portugués y otras lenguas, con rutas adaptativas y datos controlables por la persona usuaria.

## Alcance
- diagnóstico inicial y rutas por nivel;
- SRS y práctica espaciada;
- contenidos con fuente, nivel y objetivos explícitos;
- progreso medible sin convertir datos educativos en publicidad;
- API y frontend mantenibles, seguros y desplegables.

## Límites
No afirmar acreditación oficial inexistente. No inventar fuentes, resultados ni niveles. No exponer claves, datos personales o credenciales en el frontend, logs, seeds o documentación.

## Arquitectura
Frontend web separado de API y persistencia. Validación de entrada en servidor, autorización por recurso, migraciones reproducibles, pruebas de dominio/API/UI y observabilidad sin datos sensibles.

## Fases
1. base funcional y datos pedagógicos verificables;
2. diagnóstico, SRS y progreso;
3. accesibilidad, rendimiento y despliegue;
4. integraciones LMS/exportación;
5. evaluación continua y gobernanza de contenidos.

## Criterio de entrega
Cada cambio debe incluir pruebas adecuadas, revisión de secretos/dependencias, documentación actualizada y una comprobación de despliegue cuando afecte a producción.
