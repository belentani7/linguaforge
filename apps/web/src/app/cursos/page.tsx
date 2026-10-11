import type { Metadata } from "next";
import { CourseCatalog } from "@/components/courses/CourseCatalog";

export const metadata: Metadata = {
  title: "Plan de estudios",
  description: "Cuatro niveles para pasar de cero a experto en agentes de IA, con práctica en el navegador.",
  alternates: { canonical: "/cursos" },
};

export default function CursosPage() {
  return <CourseCatalog />;
}
