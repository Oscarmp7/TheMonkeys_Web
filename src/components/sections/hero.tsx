"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Globe, Phone, MapPin } from "lucide-react";
import { ParticleButton } from "@/components/ui/particle-button";
import { ScrollIndicator } from "@/components/ui/scroll-indicator";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export function Hero() {
  const t = useTranslations("hero");
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const isDark = mounted && resolvedTheme === "dark";
  const mkSrc = isDark ? "/logos/mk-white.png" : "/logos/mk-main.png";

  return (
    <motion.section
      id="hero"
      className="relative flex w-full min-h-screen flex-col overflow-hidden md:flex-row"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Left Side: Content */}
      <div className="flex w-full flex-col justify-center p-8 pt-24 md:w-1/2 md:p-12 md:pt-28 lg:w-3/5 lg:p-16 lg:pt-32">
        {/* Overheader tagline */}
        <motion.p
          className="mb-6 text-xs tracking-[0.3em] uppercase text-brand-navy/60 dark:text-white/40 font-semibold"
          variants={itemVariants}
        >
          {t("overheader")}
        </motion.p>

        {/* Main Content */}
        <motion.main variants={containerVariants}>
          <motion.h1
            className="font-display text-4xl font-bold leading-tight md:text-5xl lg:text-6xl"
            variants={itemVariants}
          >
            {t("title_line1")}{" "}
            <br />
            <span className="text-brand-yellow">{t("title_line2")}</span>
          </motion.h1>

          <motion.div
            className="my-6 h-1 w-20 bg-brand-yellow"
            variants={itemVariants}
          />

          <motion.p
            className="mb-8 max-w-md text-base text-brand-navy/70 dark:text-white/60"
            variants={itemVariants}
          >
            {t("subtitle")}
          </motion.p>

          <motion.div className="flex flex-wrap gap-4" variants={itemVariants}>
            <a
              href="https://wa.me/18097561847?text=Hola,%20me%20interesa%20saber%20m%C3%A1s%20sobre%20sus%20servicios"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ParticleButton
                variant="default"
                size="lg"
                className="bg-brand-yellow text-brand-navy font-bold hover:shadow-xl hover:scale-105 tracking-wider"
                successDuration={800}
              >
                {t("cta_primary")}
              </ParticleButton>
            </a>
            <a href="#portfolio">
              <ParticleButton
                variant="outline"
                size="lg"
                className="font-bold tracking-wider"
                successDuration={800}
              >
                {t("cta_secondary")}
              </ParticleButton>
            </a>
          </motion.div>
        </motion.main>

        {/* Bottom: Contact Info */}
        <motion.footer className="mt-12 w-full" variants={itemVariants}>
          <div className="grid grid-cols-1 gap-4 text-xs text-brand-navy/80 dark:text-white/60 sm:grid-cols-3">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-brand-yellow flex-shrink-0" />
              <span>themonkeys.do</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-brand-yellow flex-shrink-0" />
              <span>(809) 756-1847</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-brand-yellow flex-shrink-0" />
              <span>Santiago de los Caballeros, RD</span>
            </div>
          </div>
        </motion.footer>
      </div>

      {/* Right Side: MK with clip-path diagonal */}
      <motion.div
        className="relative w-full min-h-[280px] md:w-1/2 md:min-h-full lg:w-2/5 flex items-center justify-center"
        style={{ backgroundColor: isDark ? "#001A2C" : "#FFCD00" }}
        initial={{ clipPath: "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)" }}
        animate={{ clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0% 100%)" }}
        transition={{ duration: 1.2, ease: "circOut" }}
      >
        {/* Dot pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, ${isDark ? "#FFCD00" : "#00263E"} 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />

        {/* MK Logo */}
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [-1, 1, -1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src={mkSrc}
              alt="MK"
              width={400}
              height={400}
              className="w-56 h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 object-contain drop-shadow-2xl"
              priority
            />
          </motion.div>
        </motion.div>

        {/* Decorative shapes */}
        <motion.div
          className="absolute w-16 h-16 rounded-full border-2 border-brand-navy/20 dark:border-white/20"
          style={{ top: "15%", right: "20%" }}
          animate={{ y: [0, -15, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-8 h-8 rounded-full bg-brand-navy/10 dark:bg-white/10"
          style={{ bottom: "25%", left: "15%" }}
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute w-12 h-12 rounded-lg border-2 border-brand-navy/10 dark:border-white/10"
          style={{ bottom: "15%", right: "30%" }}
          animate={{ rotate: [0, 45, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
      </motion.div>

      <ScrollIndicator />
    </motion.section>
  );
}
