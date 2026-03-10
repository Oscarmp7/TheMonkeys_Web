"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
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
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const ids = navLinks.map((l) => l.href.replace("#", ""));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) {
          setActiveSection(`#${visible.target.id}`);
        } else if (window.scrollY < window.innerHeight * 0.35) {
          setActiveSection(null);
        }
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0.2, 0.4, 0.6] },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (window.innerWidth >= 1024) setMobileOpen(false);
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
          scrolled
            ? "bg-white/90 shadow-[0_1px_0_rgba(0,38,62,0.06)] backdrop-blur-xl dark:bg-brand-navy/90 dark:shadow-[0_1px_0_rgba(255,255,255,0.06)]"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-6 lg:px-12">
          <Link href="/" aria-label="The Monkeys" className="shrink-0">
            <Image
              src="/logos/logo-navy.png"
              alt="The Monkeys"
              width={160}
              height={50}
              className={`h-auto w-auto transition-all duration-300 dark:hidden ${
                scrolled ? "max-h-8" : "max-h-10"
              }`}
              priority
            />
            <Image
              src="/logos/logo-white.png"
              alt="The Monkeys"
              width={160}
              height={50}
              className={`hidden h-auto w-auto transition-all duration-300 dark:block ${
                scrolled ? "max-h-8" : "max-h-10"
              }`}
              priority
            />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
            {navLinks.map(({ key, href }) => {
              const isActive = activeSection === href;
              return (
                <a
                  key={key}
                  href={href}
                  className={`group relative px-5 py-2 text-sm font-medium tracking-tight transition-colors duration-200 ${
                    isActive
                      ? "text-brand-navy dark:text-white"
                      : "text-brand-navy/55 hover:text-brand-navy dark:text-white/50 dark:hover:text-white"
                  }`}
                >
                  {t(key)}
                  <span
                    className={`absolute inset-x-5 -bottom-0.5 h-px origin-center transition-transform duration-300 ease-out ${
                      isActive
                        ? "scale-x-100 bg-brand-yellow"
                        : "scale-x-0 bg-brand-navy/30 group-hover:scale-x-100 dark:bg-white/30"
                    }`}
                  />
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 lg:flex">
              <LanguageToggle compact />
              <ThemeToggle compact />
              <a
                href="#contact"
                className="ml-2 inline-flex h-10 items-center justify-center rounded-full bg-brand-navy px-6 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-px hover:shadow-lg dark:bg-brand-yellow dark:text-brand-navy"
              >
                {t("cta")}
              </a>
            </div>

            <HamburgerButton
              isOpen={mobileOpen}
              onClick={() => setMobileOpen((c) => !c)}
              controlsId="mobile-navigation"
              label={mobileOpen ? t("menu_close") : t("menu_open")}
            />
          </div>
        </div>
      </header>

      <MobileDrawer
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        controlsId="mobile-navigation"
      />
    </>
  );
}
