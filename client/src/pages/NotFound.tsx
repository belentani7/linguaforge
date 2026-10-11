import { Link } from "wouter";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="eyebrow">Error 404</p>
      <h1 className="text-3xl font-semibold">Esta página no existe</h1>
      <p>
        Puede que el enlace haya cambiado. Vuelve al inicio o revisa el
        catálogo.
      </p>
      <div className="flex gap-3">
        <Link href="/" className="underline">
          Inicio
        </Link>
        <Link href="/programas" className="underline">
          Programas
        </Link>
      </div>
    </main>
  );
}
