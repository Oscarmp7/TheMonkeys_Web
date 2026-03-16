"use client";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Link as IntlLink, usePathname } from "@/i18n/navigation";
import { MKMonogram } from "@/components/ui/logo-wordmark";
import { NAV_LINK_KEYS, NAV_ANCHORS } from "@/lib/nav";
import type { Locale } from "@/i18n/routing";

/** Nav keys that correspond to real routes (not hash anchors). */
const ROUTE_KEYS = new Set(["inicio", "servicios"] as const);

export function NavbarHero({ locale }: { locale: Locale }) {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <nav className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-8 py-6">
      {/* MK Monogram */}
      <MKMonogram variant="yellow" />

      {/* Nav pill */}
      <div className="hidden md:flex items-center gap-1 bg-brand-navy-dark/60 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2">
        {NAV_LINK_KEYS.map((key) => {
          const href = NAV_ANCHORS[key];
          // Hash anchors (#contacto) stay as plain links — in-page navigation
          if (!ROUTE_KEYS.has(key as "inicio" | "servicios")) {
            return (
              <Link
                key={key}
                href={href}
                className="px-3 py-1 text-white/80 hover:text-white text-sm font-medium transition-colors"
              >
                {t(key)}
              </Link>
            );
          }
          // Route links use IntlLink so next-intl resolves locale-aware paths
          return (
            <IntlLink
              key={key}
              href={href as "/"}
              className="px-3 py-1 text-white/80 hover:text-white text-sm font-medium transition-colors"
            >
              {t(key)}
            </IntlLink>
          );
        })}
        <Link
          href="#contacto"
          className="ml-2 px-4 py-1.5 bg-brand-yellow text-brand-navy text-sm font-semibold rounded-full hover:bg-brand-yellow/90 transition-colors"
        >
          {t("cotizar")}
        </Link>
      </div>

      {/* Language toggle — preserves the current path when switching locale */}
      <div className="flex items-center gap-2 text-sm font-medium">
        <IntlLink
          href={pathname as "/"}
          locale="es"
          className={
            locale === "es"
              ? "bg-brand-yellow text-brand-navy w-8 h-8 rounded-full flex items-center justify-center"
              : "text-white/60 hover:text-white"
          }
        >
          ES
        </IntlLink>
        <IntlLink
          href={pathname as "/"}
          locale="en"
          className={
            locale === "en"
              ? "bg-brand-yellow text-brand-navy w-8 h-8 rounded-full flex items-center justify-center"
              : "text-white/60 hover:text-white"
          }
        >
          EN
        </IntlLink>
      </div>
    </nav>
  );
}
