"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useT } from "@/hooks/useLocale";

/** Límite de error de ruta: aísla fallos en una página sin romper el resto de la navegación. */
export default function RouteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { t } = useT();

  useEffect(() => {
    console.error("[route-error]", error.digest ?? error.message);
  }, [error]);

  return (
    <div role="alert" className="mx-auto flex min-h-[60dvh] max-w-xl flex-col items-center justify-center px-5 py-20 text-center">
      <h1 className="text-2xl font-bold tracking-tight">{t("errorTitle")}</h1>
      <p className="mt-3 text-zinc-400">{t("errorBody")}</p>
      <Button className="mt-8" onClick={() => reset()}>
        {t("retry")}
      </Button>
    </div>
  );
}
