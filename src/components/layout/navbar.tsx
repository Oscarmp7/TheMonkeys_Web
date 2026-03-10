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

  // Close mobile drawer on resize to desktop
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scroll when mobile drawer is open
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

  const logoSrc =
    mounted && resolvedTheme === "dark"
      ? "/logos/mk-white.png"
      : "/logos/mk-main.png";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "backdrop-blur-md bg-white/80 dark:bg-brand-navy/80 shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo */}
            <a href="#" className="flex-shrink-0">
              <Image
                src={logoSrc}
                alt="The Monkeys"
                width={40}
                height={40}
                className="w-10 h-10 object-contain"
                priority
              />
            </a>

            {/* Center: Nav links (desktop) */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map(({ key, href }) => (
                <a
                  key={key}
                  href={href}
                  className="text-sm font-medium text-brand-navy dark:text-white hover:text-brand-yellow transition-colors"
                >
                  {t(key)}
                </a>
              ))}
            </nav>

            {/* Right: Controls (desktop) */}
            <div className="hidden lg:flex items-center gap-4">
              <LanguageToggle />
              <ThemeToggle />
              <a
                href="#contact"
                className="bg-brand-yellow text-brand-navy font-semibold px-5 py-2 rounded-full hover:shadow-lg transition"
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

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
    </>
  );
}
