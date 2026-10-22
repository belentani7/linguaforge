import type { Metadata } from "next";
import { SrsPractice } from "@/components/srs/SrsPractice";

export const metadata: Metadata = {
  title: "Repaso inteligente",
  description: "Repetición espaciada en castellano, portugués de Brasil y catalán, basada en las lecciones de LinguaForge. Datos locales, sin cuenta.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/repaso" },
};

export default function ReviewPage() {
  return <SrsPractice />;
}
