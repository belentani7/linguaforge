"use client";

import Link from "next/link";
import { useT } from "@/hooks/useLocale";

export function SiteFooter() {
  const { t } = useT();
  return (
    <footer className="mt-24 border-t border-white/5">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-10 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
        <p>{t("footerLicense")}</p>
        <nav aria-label="Pie de página" className="flex gap-5">
          <Link href="/cursos" className="hover:text-zinc-300">
            {t("navCourses")}
          </Link>
          <Link href="/panel" className="hover:text-zinc-300">
            {t("navDashboard")}
          </Link>
          <a href="https://github.com/belentani7/linguaforge" rel="noopener noreferrer" target="_blank" className="hover:text-zinc-300">
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}
