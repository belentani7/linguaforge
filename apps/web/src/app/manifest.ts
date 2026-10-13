import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LinguaForge · Agentes de IA",
    short_name: "LinguaForge",
    description: "De cero a experto en agentes de IA, con tutor y voz en castellano, portugués de Brasil y catalán.",
    start_url: "/",
    display: "standalone",
    background_color: "#05050a",
    theme_color: "#05050a",
    lang: "es",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
