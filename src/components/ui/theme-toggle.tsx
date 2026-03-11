"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  compact?: boolean;
  tone?: "default" | "inverse";
}

export function ThemeToggle({
  className,
  compact = false,
  tone = "default",
}: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const t = useTranslations("theme");
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center rounded-full border text-brand-navy transition",
        compact
          ? tone === "inverse"
            ? "border-white/12 bg-white/8 text-white shadow-none hover:border-brand-yellow/40 hover:bg-white/12"
            : "border-brand-yellow-border/20 bg-brand-yellow-soft/75 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] hover:border-brand-yellow-border/40 hover:bg-brand-yellow dark:border-white/10 dark:bg-white/5 dark:text-white dark:shadow-none dark:hover:bg-white/10"
          : "h-11 w-11 border-brand-yellow-border/20 bg-brand-yellow-soft/85 hover:border-brand-yellow-border/40 hover:bg-brand-yellow dark:border-white/10 dark:bg-brand-navy-light/50 dark:text-white",
        className,
      )}
      aria-label={t("toggle")}
      title={t("toggle")}
    >
      <Sun
        className="absolute h-5 w-5 transition-all duration-300"
        style={{
          transform: isDark ? "rotate(90deg) scale(0)" : "rotate(0) scale(1)",
          opacity: isDark ? 0 : 1,
        }}
      />
      <Moon
        className="absolute h-5 w-5 transition-all duration-300"
        style={{
          transform: isDark ? "rotate(0) scale(1)" : "rotate(-90deg) scale(0)",
          opacity: isDark ? 1 : 0,
        }}
      />
    </button>
  );
}
