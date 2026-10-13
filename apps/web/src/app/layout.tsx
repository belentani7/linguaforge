import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Providers } from "./providers";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { LangSync } from "@/components/layout/LangSync";
import { SkipLink } from "@/components/layout/SkipLink";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "LinguaForge · De cero a experto en agentes de IA",
    template: "%s · LinguaForge",
  },
  description:
    "Curso interactivo para aprender a construir agentes de IA: JavaScript asíncrono, prompts, tool calling, memoria, evaluación y producción. Con tutor de IA y voz en castellano, portugués de Brasil y catalán.",
  applicationName: "LinguaForge",
  authors: [{ name: "Pedro Belentani", url: "https://github.com/belentani7" }],
  keywords: ["agentes de IA", "LLM", "tool calling", "JavaScript", "RAG", "tutor IA", "español", "portugués", "catalán"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "LinguaForge",
    title: "LinguaForge · De cero a experto en agentes de IA",
    description: "Aprende a construir agentes de IA con un tutor que revisa tu código y te habla en tu idioma.",
    locale: "es_ES",
    alternateLocale: ["pt_BR", "ca_ES"],
    images: [{ url: "/og.svg", width: 1200, height: 630, alt: "LinguaForge" }],
  },
  twitter: { card: "summary_large_image", title: "LinguaForge", description: "Agentes de IA, de cero a experto." },
  robots: { index: true, follow: true },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#05050a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>
          <LangSync />
          <SkipLink />
          <SiteNav />
          <main id="main" tabIndex={-1} className="relative min-h-[calc(100dvh-80px)] outline-none">
            {children}
          </main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
