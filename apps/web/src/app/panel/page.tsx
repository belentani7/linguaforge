import type { Metadata } from "next";
import { Dashboard } from "@/components/dashboard/Dashboard";

export const metadata: Metadata = {
  title: "Mi progreso",
  description: "Tu progreso local: XP, racha y lecciones completadas.",
  robots: { index: false, follow: false },
};

export default function PanelPage() {
  return <Dashboard />;
}
