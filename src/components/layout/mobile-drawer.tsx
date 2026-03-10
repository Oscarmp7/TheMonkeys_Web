"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageToggle } from "@/components/ui/language-toggle";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  controlsId?: string;
}

const navLinks = [
  { key: "services", href: "#services" },
  { key: "portfolio", href: "#portfolio" },
  { key: "about", href: "#about" },
  { key: "contact", href: "#contact" },
] as const;

function getFocusableElements(container: HTMLElement | null) {
  if (!container) {
    return [];
  }

  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
    ),
  );
}

export function MobileDrawer({
  isOpen,
  onClose,
  controlsId = "mobile-navigation",
}: MobileDrawerProps) {
  const t = useTranslations("nav");
  const footerT = useTranslations("footer");
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const focusables = getFocusableElements(drawerRef.current);
    focusables[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const elements = getFocusableElements(drawerRef.current);
      if (!elements.length) {
        event.preventDefault();
        return;
      }

      const first = elements[0];
      const last = elements[elements.length - 1];
      const activeElement = document.activeElement as HTMLElement | null;

      if (event.shiftKey && activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-30 bg-brand-navy/45 backdrop-blur-sm lg:hidden"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            ref={drawerRef}
            id={controlsId}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            role="dialog"
            aria-modal="true"
            aria-label={t("navigation")}
            className="fixed right-0 top-0 z-40 flex h-full w-[min(25rem,92vw)] flex-col bg-[linear-gradient(180deg,#fbf8f1_0%,#f5f0e6_100%)] px-6 pb-8 pt-6 shadow-2xl dark:bg-[linear-gradient(180deg,#00263E_0%,#001A2C_100%)] lg:hidden"
          >
            <div className="mb-10 flex items-start justify-between gap-4 border-b border-brand-navy/10 pb-5 dark:border-white/10">
              <div>
                <Image
                  src="/logos/logo-navy.png"
                  alt="The Monkeys"
                  width={184}
                  height={58}
                  className="h-auto w-auto dark:hidden"
                />
                <Image
                  src="/logos/logo-white.png"
                  alt="The Monkeys"
                  width={184}
                  height={58}
                  className="hidden h-auto w-auto dark:block"
                />
                <p className="mt-3 max-w-[18rem] text-sm leading-6 text-brand-navy/55 dark:text-white/55">
                  {footerT("tagline")}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-11 w-11 items-center justify-center rounded-[1.2rem] border border-brand-navy/10 bg-white/70 text-brand-navy transition hover:border-brand-yellow/40 dark:border-white/10 dark:bg-white/5 dark:text-white"
                aria-label={t("menu_close")}
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex flex-col gap-2">
              {navLinks.map(({ key, href }) => (
                <a
                  key={key}
                  href={href}
                  onClick={onClose}
                  className="rounded-[1.5rem] border border-brand-navy/8 bg-white/46 px-4 py-4 text-lg font-display font-medium text-brand-navy transition hover:border-brand-yellow/30 hover:bg-brand-yellow/12 dark:border-white/8 dark:bg-white/4 dark:text-white dark:hover:bg-white/8"
                >
                  {t(key)}
                </a>
              ))}
            </nav>

            <div className="mt-auto space-y-5 border-t border-brand-navy/10 pt-6 dark:border-white/10">
              <a
                href="#contact"
                onClick={onClose}
                className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-brand-yellow px-5 py-3 text-center font-semibold text-brand-navy transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                {t("cta")}
              </a>

              <div className="flex items-center justify-between gap-3">
                <LanguageToggle compact className="flex-1 justify-center" />
                <ThemeToggle compact className="shrink-0" />
              </div>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
