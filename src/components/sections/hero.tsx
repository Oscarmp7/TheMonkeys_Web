"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { FloatingShapes } from "@/components/ui/floating-shapes";
import { ScrollIndicator } from "@/components/ui/scroll-indicator";
import { ParticleButton } from "@/components/ui/particle-button";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const wordVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export function Hero() {
  const t = useTranslations("hero");
  const titleWords = t("title").split(" ");

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center relative overflow-hidden"
    >
      {/* Yellow diagonal stripe - light mode only */}
      <div className="absolute inset-0 dark:hidden pointer-events-none">
        <motion.div
          className="absolute top-0 right-0 w-[60%] h-full bg-brand-yellow/5"
          style={{
            clipPath: "polygon(30% 0, 100% 0, 100% 100%, 0% 100%)",
          }}
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        />
        {/* Subtle accent line */}
        <motion.div
          className="absolute top-0 w-1 h-full bg-brand-yellow/30"
          style={{
            left: "42%",
            transform: "skewX(-12deg)",
          }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        />
      </div>

      {/* Dark mode subtle gradient */}
      <div className="absolute inset-0 hidden dark:block pointer-events-none">
        <motion.div
          className="absolute top-0 right-0 w-[50%] h-full bg-gradient-to-l from-brand-yellow/5 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
        />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          {/* Left content */}
          <div className="lg:col-span-3">
            <motion.p
              className="text-brand-yellow uppercase tracking-widest text-sm font-semibold"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              {t("overheader")}
            </motion.p>

            <motion.h1
              className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mt-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {titleWords.map((word, i) => (
                <motion.span
                  key={i}
                  className="inline-block mr-[0.3em]"
                  variants={wordVariants}
                >
                  {word}
                </motion.span>
              ))}
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl opacity-70 max-w-lg mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
            >
              {t("subtitle")}
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
            >
              <a
                href="https://wa.me/18097561847?text=Hola,%20me%20interesa%20saber%20m%C3%A1s%20sobre%20sus%20servicios"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ParticleButton
                  variant="default"
                  size="lg"
                  className="bg-brand-yellow text-brand-navy font-semibold hover:shadow-xl hover:scale-105"
                  successDuration={800}
                >
                  {t("cta_primary")}
                </ParticleButton>
              </a>
              <a href="#portfolio">
                <ParticleButton
                  variant="outline"
                  size="lg"
                  className="font-semibold"
                  successDuration={800}
                >
                  {t("cta_secondary")}
                </ParticleButton>
              </a>
            </motion.div>
          </div>

          {/* Right visual - MK Logo animated */}
          <div className="lg:col-span-2 hidden lg:block relative h-[28rem]">
            <FloatingShapes />
          </div>
        </div>
      </div>

      <ScrollIndicator />
    </section>
  );
}
