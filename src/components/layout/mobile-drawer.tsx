"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageToggle } from "@/components/ui/language-toggle";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const navLinks = [
  { key: "services", href: "#services" },
  { key: "portfolio", href: "#portfolio" },
  { key: "about", href: "#about" },
  { key: "contact", href: "#contact" },
] as const;

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const t = useTranslations("nav");

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 z-40 h-full w-72 bg-white dark:bg-brand-navy-deep shadow-2xl lg:hidden"
          >
            <div className="flex flex-col h-full pt-20 px-6 pb-8">
              {/* Nav links */}
              <nav className="flex flex-col gap-2">
                {navLinks.map(({ key, href }) => (
                  <a
                    key={key}
                    href={href}
                    onClick={onClose}
                    className="text-lg font-display font-medium text-brand-navy dark:text-white py-3 px-2 rounded-lg hover:bg-brand-yellow/10 transition-colors"
                  >
                    {t(key)}
                  </a>
                ))}
              </nav>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Bottom controls */}
              <div className="flex flex-col gap-4">
                {/* CTA */}
                <a
                  href="#contact"
                  onClick={onClose}
                  className="block text-center bg-brand-yellow text-brand-navy font-semibold px-5 py-3 rounded-full hover:shadow-lg transition"
                >
                  {t("cta")}
                </a>

                {/* Language + Theme */}
                <div className="flex items-center justify-between px-2">
                  <LanguageToggle />
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
