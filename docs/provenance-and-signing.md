# Política de autenticidad y procedencia

**Proyecto:** LinguaForge  
**Autoría pública:** Pedro Belentani — [belentani.eu](https://belentani.eu)  
**Repositorio:** [github.com/belentani7/linguaforge](https://github.com/belentani7/linguaforge)

## Principios

La autoría pública y la autenticidad técnica son conceptos distintos. La atribución a Pedro Belentani identifica la persona responsable del proyecto; no representa una clave privada, un token ni una garantía criptográfica que no haya sido configurada. No se almacenan credenciales de firma en el repositorio.

La procedencia se conserva mediante el historial de Git, los pull requests y revisiones de GitHub, los checkpoints de WebDev y la trazabilidad de cambios en `todo.md`. Cada cambio que se entregue debe poder asociarse a una revisión concreta y a una versión recuperable.

## Reglas de contribución

Las contribuciones deben incluir un mensaje de commit descriptivo, mantener el alcance documentado y evitar secretos, datos personales innecesarios, contenido sin licencia o automatizaciones externas no aprobadas. Los cambios sensibles de esquema, autenticación, almacenamiento, correo, jobs o derechos multimedia requieren revisión adicional y actualización de la documentación correspondiente.

Los mantenedores deben revisar el diff antes de fusionar, ejecutar `pnpm check`, `pnpm test`, las validaciones de contenido y las auditorías aplicables. La publicación del sitio requiere un checkpoint y aprobación explícita mediante la interfaz de gestión. Cambiar la visibilidad de GitHub requiere una decisión explícita del propietario y una auditoría previa de secretos.

## Verificación

Para revisar la procedencia local:

```bash
git log --show-signature --decorate --oneline -n 20
git status --short
git remote -v
```

`git log --show-signature` informa firmas criptográficas únicamente cuando el entorno de Git las haya configurado; su ausencia no debe ocultarse ni describirse como una firma existente. La verificación pública complementaria se realiza revisando el historial y los archivos del repositorio en GitHub, junto con el checkpoint mostrado por WebDev.

## Alcance actual

LinguaForge utiliza actualmente procedencia auditable mediante GitHub, checkpoints y revisión de cambios. No afirma que todos los commits estén firmados criptográficamente. La activación futura de commits o tags firmados deberá configurarse con una clave protegida fuera del repositorio, documentar el proveedor y añadir una comprobación reproducible antes de presentarse como garantía técnica.
