"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";

export function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale(newLocale: "es" | "en") {
    if (newLocale === locale) return;
    router.replace(pathname, { locale: newLocale });
  }

  return (
    <div className="flex items-center gap-1 text-sm font-medium">
      <button
        onClick={() => switchLocale("es")}
        className={`px-1.5 py-0.5 transition-colors ${
          locale === "es"
            ? "text-brand-navy dark:text-white border-b-2 border-brand-yellow"
            : "text-brand-navy/50 dark:text-white/50 hover:text-brand-navy dark:hover:text-white"
        }`}
      >
        ES
      </button>
      <span className="text-brand-navy/30 dark:text-white/30">|</span>
      <button
        onClick={() => switchLocale("en")}
        className={`px-1.5 py-0.5 transition-colors ${
          locale === "en"
            ? "text-brand-navy dark:text-white border-b-2 border-brand-yellow"
            : "text-brand-navy/50 dark:text-white/50 hover:text-brand-navy dark:hover:text-white"
        }`}
      >
        EN
      </button>
    </div>
  );
}
