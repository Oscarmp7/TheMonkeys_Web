"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { MKMonogram } from "@/components/ui/logo-wordmark";
import { NAV_LINK_KEYS, NAV_ANCHORS } from "@/lib/nav";
import type { Locale } from "@/i18n/routing";

export function NavbarSticky({ locale }: { locale: Locale }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > window.innerHeight * 0.8);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          key="sticky-nav"
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="fixed top-0 left-0 right-0 z-50 bg-brand-navy/95 backdrop-blur-md border-b border-white/10"
        >
          <div className="flex items-center justify-between px-8 py-4">
            {/* Logo */}
            <MKMonogram variant="yellow" />

            {/* Nav links — centered */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINK_KEYS.map((key) => {
                if (key === "contacto") {
                  return (
                    <a
                      key={key}
                      href="#contacto"
                      className="px-3 py-1 text-white/80 hover:text-white text-sm font-medium transition-colors"
                    >
                      {t(key)}
                    </a>
                  );
                }
                return (
                  <Link
                    key={key}
                    href={NAV_ANCHORS[key] as "/"}
                    className="px-3 py-1 text-white/80 hover:text-white text-sm font-medium transition-colors"
                  >
                    {t(key)}
                  </Link>
                );
              })}
            </div>

            {/* Right: Cotizar + language toggle */}
            <div className="flex items-center gap-3">
              <a
                href="#contacto"
                className="px-4 py-1.5 bg-brand-yellow text-brand-navy text-sm font-semibold rounded-full hover:bg-brand-yellow/90 transition-colors"
              >
                {t("cotizar")}
              </a>

              <div className="flex items-center gap-1 text-sm font-medium">
                <Link
                  href={pathname as "/"}
                  locale="es"
                  className={
                    locale === "es"
                      ? "bg-brand-yellow text-brand-navy w-7 h-7 rounded-full flex items-center justify-center text-xs"
                      : "text-white/60 hover:text-white text-xs"
                  }
                >
                  ES
                </Link>
                <Link
                  href={pathname as "/"}
                  locale="en"
                  className={
                    locale === "en"
                      ? "bg-brand-yellow text-brand-navy w-7 h-7 rounded-full flex items-center justify-center text-xs"
                      : "text-white/60 hover:text-white text-xs"
                  }
                >
                  EN
                </Link>
              </div>
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
