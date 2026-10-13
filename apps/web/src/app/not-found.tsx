"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useT } from "@/hooks/useLocale";

export default function NotFound() {
  const { t } = useT();
  return (
    <div className="mx-auto flex min-h-[60dvh] max-w-xl flex-col items-center justify-center px-5 py-20 text-center">
      <p className="font-mono text-sm text-violet-300">404</p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight">{t("notFoundTitle")}</h1>
      <p className="mt-3 text-zinc-400">{t("notFoundBody")}</p>
      <Button asChild className="mt-8">
        <Link href="/">{t("backHome")}</Link>
      </Button>
    </div>
  );
}
