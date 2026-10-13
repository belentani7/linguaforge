import { Skeleton } from "@/components/ui/skeleton";

/** Estado de carga de ruta: esqueleto con la forma del contenido final, no un spinner genérico. */
export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-5 py-10" aria-busy="true" aria-live="polite">
      <Skeleton className="h-10 w-2/3" />
      <Skeleton className="h-5 w-1/2" />
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
      </div>
    </div>
  );
}
