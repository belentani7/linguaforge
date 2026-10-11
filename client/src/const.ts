/**
 * Inicio de sesión local y anónimo. LinguaForge no delega la identidad en ningún proveedor externo
 * (ver README: ningún proveedor activo por defecto). Crea una cookie HttpOnly en el servidor
 * y recarga la aplicación para que el estado de sesión se lea de nuevo.
 *
 * Devuelve una promesa; las llamadas existentes ignoran el valor (`onClick={() => startLogin()}`).
 * Nunca llamar durante el render.
 */
export async function startLogin(): Promise<void> {
  const response = await fetch("/api/trpc/auth.guest", {
    method: "POST",
    credentials: "same-origin",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ json: null }),
  });
  if (!response.ok)
    throw new Error(
      `No se pudo iniciar la sesión local (HTTP ${response.status}).`
    );
  window.location.reload();
}
