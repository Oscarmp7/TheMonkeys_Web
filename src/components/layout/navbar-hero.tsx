"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Link as IntlLink, usePathname } from "@/i18n/navigation";
import { LogoWordmark } from "@/components/ui/logo-wordmark";
import { NAV_LINK_KEYS, NAV_ANCHORS } from "@/lib/nav";
import type { Locale } from "@/i18n/routing";

gsap.registerPlugin(useGSAP);

/** Nav keys that correspond to real routes (not hash anchors). */
const ROUTE_KEYS = new Set(["servicios"] as const);

export function NavbarHero({ locale }: { locale: Locale }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const prefersReduced =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  useGSAP(
    () => {
      if (prefersReduced || !navRef.current) return;
      gsap.from(navRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.6,
        delay: 0.1,
        ease: "expo.out",
      });
    },
    { scope: navRef }
  );

  return (
    <nav
      ref={navRef}
      className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-6 sm:px-10 lg:px-16 xl:px-24 py-6"
    >
      {/* Logo wordmark - left */}
      <div className="relative w-20 sm:w-24 lg:w-28 xl:w-32 aspect-square -my-4">
        <LogoWordmark variant="yellow" className="w-full h-full" sizes="128px" priority />
      </div>

      {/* Nav links - center (glass pill) */}
      <div className="hidden md:flex items-center gap-1 backdrop-blur-md bg-white/5 border border-white/10 rounded-full px-6 py-2">
        {NAV_LINK_KEYS.map((key) => {
          const href = NAV_ANCHORS[key];
          if (!ROUTE_KEYS.has(key as "servicios")) {
            return (
              <Link
                key={key}
                href={href}
                className="px-4 py-2 text-off-white/70 hover:text-off-white text-sm font-body font-medium tracking-wide transition-colors duration-200 cursor-pointer"
              >
                {t(key)}
              </Link>
            );
          }
          return (
            <IntlLink
              key={key}
              href={href as "/"}
              className="px-4 py-2 text-off-white/70 hover:text-off-white text-sm font-body font-medium tracking-wide transition-colors duration-200 cursor-pointer"
            >
              {t(key)}
            </IntlLink>
          );
        })}
        <Link
          href="#contacto"
          className="ml-3 px-6 py-2 bg-brand-yellow text-brand-black text-sm font-display tracking-wider rounded-full hover:bg-brand-yellow/90 transition-colors duration-200 cursor-pointer"
        >
          {t("cotizar")}
        </Link>
      </div>

      {/* Language toggle - pill */}
      <div className="flex items-center border border-white/20 rounded-full px-1 py-1 gap-1">
        <IntlLink
          href={pathname as "/"}
          locale="es"
          className={`rounded-full px-3 py-1 text-sm font-mono uppercase cursor-pointer transition-colors duration-200 ${
            locale === "es"
              ? "bg-white/10 text-white"
              : "text-white/40 hover:text-white/60"
          }`}
        >
          ES
        </IntlLink>
        <IntlLink
          href={pathname as "/"}
          locale="en"
          className={`rounded-full px-3 py-1 text-sm font-mono uppercase cursor-pointer transition-colors duration-200 ${
            locale === "en"
              ? "bg-white/10 text-white"
              : "text-white/40 hover:text-white/60"
          }`}
        >
          EN
        </IntlLink>
      </div>
    </nav>
  );
}
