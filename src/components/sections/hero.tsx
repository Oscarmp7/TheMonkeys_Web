"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import Image from "next/image";
import { ArrowUpRight, Globe, MapPin, Phone } from "lucide-react";
import { ScrollIndicator } from "@/components/ui/scroll-indicator";
import { getWhatsAppHref, type AppLocale, type SiteSettings } from "@/lib/site-data";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 18, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export function Hero({
  locale,
  settings,
}: {
  locale: AppLocale;
  settings: SiteSettings;
}) {
  const t = useTranslations("hero");
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const panelY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const logoY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const shapesY = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);

  const panelBg = isDark ? "bg-brand-navy-deep" : "bg-brand-yellow";
  const dotColor = isDark ? "rgba(255,205,0,0.5)" : "rgba(0,38,62,0.5)";
  const accentBorder = isDark ? "border-white/15" : "border-brand-navy/15";
  const accentFill = isDark ? "bg-white/8" : "bg-brand-navy/8";
  const mkSrc = isDark ? "/logos/mk-white.png" : "/logos/mk-navy.png";
  const mkShadow = isDark
    ? "drop-shadow-[0_24px_50px_rgba(0,0,0,0.3)]"
    : "drop-shadow-[0_24px_50px_rgba(0,38,62,0.14)]";

  const signalCards = [
    { icon: Globe, label: locale === "es" ? "Web" : "Website", value: "themonkeys.do" },
    { icon: Phone, label: "WhatsApp", value: settings.phone },
    { icon: MapPin, label: locale === "es" ? "Base" : "Location", value: settings.address },
  ];

  return (
    <motion.section
      ref={heroRef}
      id="hero"
      className="relative flex min-h-screen w-full flex-col overflow-hidden md:min-h-[100dvh] md:flex-row"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex w-full flex-col justify-center px-6 pb-14 pt-28 sm:px-8 md:w-[58%] md:px-10 md:pb-16 md:pt-32 lg:px-16 xl:px-20">
        <motion.p className="section-overheader mb-6 w-fit" variants={itemVariants}>
          {t("overheader")}
        </motion.p>

        <motion.div variants={containerVariants}>
          <motion.h1
            className="max-w-5xl font-display text-4xl font-bold leading-[0.95] tracking-tight md:text-6xl xl:text-[clamp(4.5rem,5.8vw,7rem)]"
            variants={itemVariants}
          >
            {t("title_line1")}
            <span className="block text-brand-yellow">{t("title_line2")}</span>
          </motion.h1>

          <motion.p
            className="mt-6 max-w-2xl text-base leading-7 text-brand-navy/60 dark:text-white/55 md:text-lg md:leading-8"
            variants={itemVariants}
          >
            {t("subtitle")}
          </motion.p>

          <motion.div
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
            variants={itemVariants}
          >
            <a
              href={getWhatsAppHref(locale, settings.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-full bg-brand-navy px-7 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-px hover:shadow-lg dark:bg-brand-yellow dark:text-brand-navy"
            >
              {t("cta_primary")}
            </a>
            <a
              href="#portfolio"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-brand-navy/15 px-7 text-sm font-semibold text-brand-navy transition-all duration-200 hover:-translate-y-px hover:border-brand-navy/40 dark:border-white/15 dark:text-white dark:hover:border-white/40"
            >
              {t("cta_secondary")}
              <ArrowUpRight size={16} />
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-14 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-3"
          variants={itemVariants}
        >
          {signalCards.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="rounded-2xl border border-brand-navy/6 bg-brand-navy/[0.02] px-5 py-5 dark:border-white/8 dark:bg-white/[0.03]"
            >
              <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-brand-navy/[0.04] text-brand-yellow dark:bg-white/[0.06]">
                <Icon className="h-4 w-4" />
              </div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-brand-navy/35 dark:text-white/35">
                {label}
              </p>
              <p className="mt-1.5 text-sm font-medium leading-6 text-brand-navy/75 dark:text-white/70">
                {value}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div
        className={`relative flex min-h-[320px] w-full items-center justify-center overflow-hidden px-8 py-12 md:w-[42%] md:min-h-[100dvh] ${panelBg}`}
        initial={{ clipPath: "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)" }}
        animate={{ clipPath: "polygon(18% 0, 100% 0, 100% 100%, 0 100%)" }}
        transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
        style={{ y: panelY }}
      >
        <div
          className="absolute inset-0 opacity-8"
          style={{
            backgroundImage: `radial-gradient(circle at 1.5px 1.5px, ${dotColor} 0.75px, transparent 0)`,
            backgroundSize: "28px 28px",
          }}
        />

        <motion.div className="relative z-10" style={{ y: logoY }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              animate={{ y: [0, -8, 0], rotate: [-0.5, 0.5, -0.5] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image
                src={mkSrc}
                alt="MK"
                width={440}
                height={440}
                className={`h-auto w-48 object-contain md:w-64 lg:w-72 xl:w-80 ${mkShadow}`}
                priority
              />
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          className={`absolute right-[12%] top-[14%] h-14 w-14 rounded-full border ${accentBorder}`}
          style={{ y: shapesY }}
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className={`absolute bottom-[26%] left-[16%] h-6 w-6 rounded-full ${accentFill}`}
          style={{ y: shapesY }}
        />
        <motion.div
          className={`absolute bottom-[16%] right-[24%] h-10 w-10 rounded-xl border ${accentBorder}`}
          style={{ y: shapesY }}
          animate={{ rotate: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      <ScrollIndicator />
    </motion.section>
  );
}
