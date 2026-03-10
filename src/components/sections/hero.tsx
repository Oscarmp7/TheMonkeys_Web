"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { FloatingShapes } from "@/components/ui/floating-shapes";
import { ScrollIndicator } from "@/components/ui/scroll-indicator";

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
      <div className="container mx-auto px-6 lg:px-12">
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
              className="text-lg md:text-xl opacity-80 max-w-lg mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
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
                href="https://wa.me/18097561847?text=Hola,%20me%20interesa%20saber%20más%20sobre%20sus%20servicios"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-brand-yellow text-brand-navy px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all duration-300"
              >
                {t("cta_primary")}
              </a>
              <a
                href="#portfolio"
                className="border-2 border-brand-navy dark:border-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-brand-navy hover:text-white dark:hover:bg-white dark:hover:text-brand-navy transition-all duration-300"
              >
                {t("cta_secondary")}
              </a>
            </motion.div>
          </div>

          {/* Right visual */}
          <div className="lg:col-span-2 hidden lg:block relative h-96">
            <FloatingShapes />
          </div>
        </div>
      </div>

      <ScrollIndicator />
    </section>
  );
}
