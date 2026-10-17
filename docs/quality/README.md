# Evidencia local del contrato educativo

La fuente canónica es el [contrato educativo de 200 reglas](https://github.com/belentani7/open-school/blob/main/docs/CONTRATO_EDUCATIVO_200_REGLAS.md). Este directorio conserva únicamente el estado y la evidencia de **linguaforge**.

- `evidence.json` contiene exactamente E001–E200.
- `NO MEDIDO` significa que aún no existe una comprobación reproducible; no significa incumplimiento.
- `VERIFICADO` exige al menos una ruta, URL de prueba, informe o PR en `evidence`.
- `N/A JUSTIFICADO` exige el campo `justification`.

Comprobación:

```bash
node scripts/verify-education-contract.mjs
node --test scripts/verify-education-contract.test.mjs
```

## Integración comprobada — 17 de octubre de 2026

Con Node 22.23.3 y pnpm 10.4.1 se ejecutaron instalación congelada, tipos,
lint, pruebas y build. Tras integrar `main`, TypeScript 6 detectó el `baseUrl`
obsoleto; se retiró porque todos los aliases ya usan rutas relativas explícitas.
La comprobación de tipos volvió a pasar sin silenciar errores.

- 45 pruebas pasaron; 15 pruebas de persistencia se omitieron porque no se
  configuró `TEST_DATABASE_URL`. No se ejecutaron migraciones ni cambios de base.
- Las 5 pruebas del validador pasan; el ledger mantiene 0/200 reglas verificadas.
- El build termina con un aviso de chunks circulares; no constituye una prueba
  del funcionamiento en navegador ni una validación de producción.
