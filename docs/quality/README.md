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
