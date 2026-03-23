"use client";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Link as IntlLink, usePathname } from "@/i18n/navigation";
import { MKMonogram } from "@/components/ui/logo-wordmark";
import { NAV_LINK_KEYS, NAV_ANCHORS } from "@/lib/nav";
import type { Locale } from "@/i18n/routing";

gsap.registerPlugin(useGSAP);

/** Nav keys that correspond to real routes (not hash anchors). */
const ROUTE_KEYS = new Set(["servicios"] as const);

export function NavbarSticky({ locale }: { locale: Locale }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > window.innerHeight * 0.8);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useGSAP(
    () => {
      if (!navRef.current) return;
      gsap.to(navRef.current, {
        y: visible ? 0 : -80,
        opacity: visible ? 1 : 0,
        duration: 0.35,
        ease: "power2.out",
        pointerEvents: visible ? "auto" : "none",
      });
    },
    { dependencies: [visible] }
  );

  return (
    <nav
      ref={navRef}
      style={{ opacity: 0, transform: "translateY(-80px)", pointerEvents: "none" }}
      className="fixed top-0 left-0 right-0 z-50 bg-brand-black/95 backdrop-blur-md border-b border-off-white/10"
    >
      <div className="flex items-center justify-between px-6 sm:px-10 lg:px-16 py-4">
        {/* Logo */}
        <MKMonogram variant="yellow" />

        {/* Nav links - centered */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINK_KEYS.map((key) => {
            const href = NAV_ANCHORS[key];
            if (!ROUTE_KEYS.has(key as "servicios")) {
              return (
                <Link
                  key={key}
                  href={href}
                  className="px-3 py-1 text-off-white/70 hover:text-off-white text-sm font-body font-medium tracking-wide transition-colors duration-200 cursor-pointer"
                >
                  {t(key)}
                </Link>
              );
            }

            return (
              <IntlLink
                key={key}
                href={href as "/"}
                className="px-3 py-1 text-off-white/70 hover:text-off-white text-sm font-body font-medium tracking-wide transition-colors duration-200 cursor-pointer"
              >
                {t(key)}
              </IntlLink>
            );
          })}
        </div>

        {/* Right: Cotizar + language toggle */}
        <div className="flex items-center gap-3">
          <Link
            href="#contacto"
            className="px-5 py-2 bg-brand-yellow text-brand-black text-sm font-display tracking-wider hover:bg-brand-yellow/90 transition-colors duration-200 cursor-pointer"
          >
            {t("cotizar")}
          </Link>

          <div className="flex items-center gap-1 text-sm font-display">
            <IntlLink
              href={pathname as "/"}
              locale="es"
              className={
                locale === "es"
                  ? "bg-brand-yellow text-brand-black w-7 h-7 flex items-center justify-center text-xs tracking-wider cursor-pointer"
                  : "text-off-white/50 hover:text-off-white text-xs tracking-wider cursor-pointer transition-colors duration-200"
              }
            >
              ES
            </IntlLink>
            <IntlLink
              href={pathname as "/"}
              locale="en"
              className={
                locale === "en"
                  ? "bg-brand-yellow text-brand-black w-7 h-7 flex items-center justify-center text-xs tracking-wider cursor-pointer"
                  : "text-off-white/50 hover:text-off-white text-xs tracking-wider cursor-pointer transition-colors duration-200"
              }
            >
              EN
            </IntlLink>
          </div>
        </div>
      </div>
    </nav>
  );
}
