"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import Image from "next/image";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { HamburgerButton } from "@/components/ui/hamburger-button";
import { MobileDrawer } from "@/components/layout/mobile-drawer";

const navLinks = [
  { key: "services", href: "#services" },
  { key: "portfolio", href: "#portfolio" },
  { key: "about", href: "#about" },
  { key: "contact", href: "#contact" },
] as const;

export function Navbar() {
  const t = useTranslations("nav");
  const { resolvedTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 10);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isDark = mounted && resolvedTheme === "dark";
  const logoSrc = isDark ? "/logos/logo-white.png" : "/logos/logo-main.png";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? "backdrop-blur-md bg-white/90 dark:bg-brand-navy/90 shadow-sm py-2"
            : "bg-transparent py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left: Full Logo - BIGGER */}
            <a href="#" className="flex-shrink-0">
              <Image
                src={logoSrc}
                alt="The Monkeys"
                width={180}
                height={60}
                className={`object-contain transition-all duration-300 ${
                  scrolled ? "h-10 w-auto" : "h-14 w-auto"
                }`}
                priority
              />
            </a>

            {/* Center: Nav links (desktop) */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map(({ key, href }) => (
                <a
                  key={key}
                  href={href}
                  className="text-sm font-medium text-brand-navy dark:text-white/90 hover:text-brand-yellow transition-colors relative group"
                >
                  {t(key)}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-yellow transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </nav>

            {/* Right: Controls (desktop) */}
            <div className="hidden lg:flex items-center gap-3">
              <LanguageToggle />
              <ThemeToggle />
              <a
                href="#contact"
                className="bg-brand-yellow text-brand-navy font-semibold px-6 py-2.5 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                {t("cta")}
              </a>
            </div>

            {/* Mobile: Hamburger */}
            <HamburgerButton
              isOpen={mobileOpen}
              onClick={() => setMobileOpen(!mobileOpen)}
            />
          </div>
        </div>
      </header>

      <MobileDrawer
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
    </>
  );
}
