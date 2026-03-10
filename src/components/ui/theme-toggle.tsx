"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <button className="w-9 h-9" aria-label="Toggle theme" />;
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-brand-navy/10 dark:hover:bg-white/10 transition-colors"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <Sun
        className="absolute h-5 w-5 text-brand-navy dark:text-white transition-all duration-300"
        style={{
          transform: isDark ? "rotate(90deg) scale(0)" : "rotate(0) scale(1)",
          opacity: isDark ? 0 : 1,
        }}
      />
      <Moon
        className="absolute h-5 w-5 text-brand-navy dark:text-white transition-all duration-300"
        style={{
          transform: isDark ? "rotate(0) scale(1)" : "rotate(-90deg) scale(0)",
          opacity: isDark ? 1 : 0,
        }}
      />
    </button>
  );
}
