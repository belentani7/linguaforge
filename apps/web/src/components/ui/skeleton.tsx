import { cn } from "@/lib/utils";

/** Placeholder de carga con brillo animado (respeta prefers-reduced-motion vía globals.css). */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn("skeleton", className)} />;
}
