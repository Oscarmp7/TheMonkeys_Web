"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface LanguageToggleProps {
  className?: string;
  compact?: boolean;
  tone?: "default" | "inverse";
}

export function LanguageToggle({
  className,
  compact = false,
  tone = "default",
}: LanguageToggleProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale(newLocale: "es" | "en") {
    if (newLocale === locale) return;
    router.replace(pathname, { locale: newLocale });
  }

  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-full border p-1 text-sm font-medium",
        compact
          ? tone === "inverse"
            ? "border-white/12 bg-white/8 text-white shadow-none"
            : "border-brand-yellow-border/20 bg-brand-yellow-soft/75 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] dark:border-white/10 dark:bg-white/5 dark:shadow-none"
          : "border-brand-yellow-border/20 bg-brand-yellow-soft/82 shadow-sm dark:border-white/10 dark:bg-brand-navy-light/50",
        className,
      )}
      aria-label={locale === "es" ? "Selector de idioma" : "Language switcher"}
      role="group"
    >
      <button
        type="button"
        onClick={() => switchLocale("es")}
        aria-pressed={locale === "es"}
        className={`min-h-10 min-w-10 rounded-full px-3 py-2 transition-colors ${
          locale === "es"
            ? "bg-brand-yellow text-brand-navy"
            : tone === "inverse"
              ? "text-white/68 hover:bg-white/10 hover:text-white"
              : "text-brand-navy/65 hover:bg-brand-navy/[0.05] hover:text-brand-navy dark:text-white/58 dark:hover:bg-white/8 dark:hover:text-white"
        }`}
      >
        ES
      </button>
      <button
        type="button"
        onClick={() => switchLocale("en")}
        aria-pressed={locale === "en"}
        className={`min-h-10 min-w-10 rounded-full px-3 py-2 transition-colors ${
          locale === "en"
            ? "bg-brand-yellow text-brand-navy"
            : tone === "inverse"
              ? "text-white/68 hover:bg-white/10 hover:text-white"
              : "text-brand-navy/65 hover:bg-brand-navy/[0.05] hover:text-brand-navy dark:text-white/58 dark:hover:bg-white/8 dark:hover:text-white"
        }`}
      >
        EN
      </button>
    </div>
  );
}
