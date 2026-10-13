"use client";

import { useT } from "@/hooks/useLocale";

export function SkipLink() {
  const { t } = useT();
  return (
    <a href="#main" className="skip-link">
      {t("skipToContent")}
    </a>
  );
}
