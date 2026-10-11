"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { BookOpen, LayoutDashboard, Sparkles } from "lucide-react";
import { LOCALES, type Locale } from "@/content/types";
import { LOCALE_NAMES } from "@/lib/i18n";
import { useT, useUiLocale } from "@/hooks/useLocale";
import { usePrefsStore } from "@/store/prefsStore";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const SHORT: Record<Locale, string> = { es: "ES", "pt-BR": "PT-BR", ca: "CA" };

export function SiteNav() {
  const { t } = useT();
  const locale = useUiLocale();
  const setUiLocale = usePrefsStore((s) => s.setUiLocale);
  const pathname = usePathname();

  const items = [
    { href: "/cursos", label: t("navCourses"), icon: BookOpen },
    { href: "/panel", label: t("navDashboard"), icon: LayoutDashboard },
  ];

  return (
    <header className="sticky top-0 z-50 px-3 pt-3">
      <nav aria-label="Principal" className="glass mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-2xl px-3 py-2 sm:px-4">
        <Link href="/" className="flex items-center gap-2 rounded-xl px-2 py-1 font-bold tracking-tight">
          <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg">
            <Sparkles className="size-4 text-white" aria-hidden />
          </span>
          <span className="hidden sm:inline">{t("brand")}</span>
        </Link>

        <ul className="flex items-center gap-1">
          {items.map((item) => {
            const active = pathname?.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-zinc-300 transition-colors hover:text-white",
                    active && "text-white",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-xl bg-white/[0.08]"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <item.icon className="size-4" aria-hidden />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <label htmlFor="ui-locale" className="sr-only">
            {t("langUi")}
          </label>
          <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1" role="group" aria-label={t("langUi")}>
            {LOCALES.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setUiLocale(l)}
                aria-pressed={locale === l}
                title={LOCALE_NAMES[l]}
                className={cn(
                  "rounded-lg px-2 py-1 text-xs font-semibold transition-all duration-300",
                  locale === l ? "bg-violet-600 text-white shadow" : "text-zinc-400 hover:text-white",
                )}
              >
                {SHORT[l]}
              </button>
            ))}
          </div>
          <Button asChild size="sm" className="hidden md:inline-flex">
            <Link href="/cursos">{t("navStart")}</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}
