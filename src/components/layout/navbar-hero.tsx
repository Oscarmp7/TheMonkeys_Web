"use client";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { MKMonogram } from "@/components/ui/logo-wordmark";
import { NAV_LINK_KEYS, NAV_ANCHORS } from "@/lib/nav";
import type { Locale } from "@/i18n/routing";

export function NavbarHero({ locale }: { locale: Locale }) {
  const t = useTranslations("nav");

  return (
    <nav className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-8 py-6">
      {/* MK Monogram */}
      <MKMonogram variant="yellow" />

      {/* Nav pill */}
      <div className="hidden md:flex items-center gap-1 bg-brand-navy-dark/60 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2">
        {NAV_LINK_KEYS.map((key) => (
          <Link
            key={key}
            href={NAV_ANCHORS[key]}
            className="px-3 py-1 text-white/80 hover:text-white text-sm font-medium transition-colors"
          >
            {t(key)}
          </Link>
        ))}
        <Link
          href="#contacto"
          className="ml-2 px-4 py-1.5 bg-brand-yellow text-brand-navy text-sm font-semibold rounded-full hover:bg-brand-yellow/90 transition-colors"
        >
          {t("cotizar")}
        </Link>
      </div>

      {/* Language toggle */}
      <div className="flex items-center gap-2 text-sm font-medium">
        <Link
          href="/"
          className={
            locale === "es"
              ? "bg-brand-yellow text-brand-navy w-8 h-8 rounded-full flex items-center justify-center"
              : "text-white/60 hover:text-white"
          }
        >
          ES
        </Link>
        <Link
          href="/en"
          className={
            locale === "en"
              ? "bg-brand-yellow text-brand-navy w-8 h-8 rounded-full flex items-center justify-center"
              : "text-white/60 hover:text-white"
          }
        >
          EN
        </Link>
      </div>
    </nav>
  );
}
