"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowRight, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useT } from "@/hooks/useLocale";

const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => <div className="skeleton h-full w-full" aria-hidden />,
});

export function Hero() {
  const { t } = useT();
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-16 pt-14 md:grid-cols-2 md:pb-24 md:pt-20">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 120, damping: 20 }}>
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-violet-200">
            <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" aria-hidden />
            {t("heroEyebrow")}
          </p>
          <h1 id="hero-title" className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            <span className="text-gradient">{t("heroTitle")}</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-zinc-300 sm:text-lg">{t("heroBody")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/cursos">
                {t("ctaCourses")} <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/cursos/js-asincrono">
                <Mic aria-hidden /> {t("voiceTitle")}
              </Link>
            </Button>
          </div>
        </motion.div>

        <div className="relative aspect-square w-full max-w-[520px] justify-self-center" aria-hidden>
          <div className="absolute inset-0 rounded-full bg-violet-600/20 blur-3xl" />
          <HeroScene />
        </div>
      </div>
    </section>
  );
}
