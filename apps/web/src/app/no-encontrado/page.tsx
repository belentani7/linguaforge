import { notFound } from "next/navigation";

/**
 * Destino interno de la reescritura de Proxy para lecciones inexistentes o no publicadas.
 * Llamar a notFound() durante el prerender devuelve un 404 real (no un soft 404).
 */
export default function NoEncontrado(): never {
  notFound();
}
