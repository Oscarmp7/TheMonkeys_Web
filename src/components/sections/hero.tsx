"use client";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { LogoWordmark } from "@/components/ui/logo-wordmark";
import { SocialSidebar } from "@/components/ui/social-sidebar";
import { NavbarHero } from "@/components/layout/navbar-hero";
import { getWhatsAppHref } from "@/lib/site";
import type { Locale } from "@/i18n/routing";

export function Hero({ locale }: { locale: Locale }) {
  const t = useTranslations("hero");

  return (
    <section
      className="sticky top-0 z-[1] relative min-h-screen noise-overlay overflow-hidden"
      style={{ background: "linear-gradient(160deg, #1b2f4f 0%, #0f1e35 100%)" }}
    >
      <NavbarHero locale={locale} />
      <SocialSidebar />

      {/* Centered logo — layoutId enables travel to brandbook section */}
      <div className="flex flex-col items-center justify-center min-h-screen px-8 gap-6">
        <motion.div
          layoutId="brand-logo"
          className="relative w-[min(80vw,700px)] aspect-[4/1]"
        >
          <LogoWordmark variant="yellow" priority sizes="80vw" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-white/70 text-center text-lg md:text-xl max-w-md"
        >
          {t("tagline")}
        </motion.p>

        <motion.a
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          href={getWhatsAppHref("Hola! Me gustaría cotizar un servicio.", locale)}
          target="_blank"
          rel="noopener noreferrer"
          className="px-8 py-3 bg-brand-yellow text-brand-navy font-semibold rounded-full hover:scale-105 transition-transform"
        >
          WhatsApp ↗
        </motion.a>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40"
      >
        <div className="w-0.5 h-8 bg-white/20 mx-auto mb-1 rounded-full" />
        <span className="text-xs tracking-widest uppercase">Scroll</span>
      </motion.div>
    </section>
  );
}
