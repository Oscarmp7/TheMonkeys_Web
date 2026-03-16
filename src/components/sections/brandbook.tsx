"use client";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { LogoWordmark } from "@/components/ui/logo-wordmark";
import { SERVICE_KEYS, SERVICE_ICONS } from "@/lib/services";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const lineVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

export function Brandbook() {
  const t = useTranslations("brandbook");
  const tServices = useTranslations("services");

  return (
    <section className="relative z-10 min-h-screen bg-off-white grid md:grid-cols-2">

      {/* Left: Info + Services */}
      <motion.div
        className="flex flex-col justify-center px-12 py-20 gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.p variants={lineVariants} className="text-5xl md:text-6xl font-display text-brand-navy leading-none">
          {t("statement")}
        </motion.p>

        <motion.p variants={lineVariants} className="text-lg text-brand-navy/70 max-w-sm leading-relaxed">
          {t("bio")}
        </motion.p>

        {/* Service list */}
        <motion.div variants={lineVariants}>
          <ul className="grid grid-cols-2 gap-3">
            {SERVICE_KEYS.map((key) => {
              const Icon = SERVICE_ICONS[key];
              return (
                <li key={key} className="flex items-center gap-2 text-brand-navy/80">
                  <Icon size={18} className="text-brand-yellow flex-shrink-0" aria-hidden="true" />
                  <span className="text-sm font-medium">{tServices(key)}</span>
                </li>
              );
            })}
          </ul>
        </motion.div>

        <motion.a
          variants={lineVariants}
          href="#contacto"
          className="self-start px-7 py-3 bg-brand-navy text-brand-yellow font-semibold rounded-full hover:bg-brand-navy/90 transition-colors"
        >
          {t("cta")} →
        </motion.a>
      </motion.div>

      {/* Right: Logo travels here from hero via shared layoutId */}
      <motion.div
        layoutId="brand-logo"
        className="flex items-center justify-center bg-brand-navy/5 p-8 md:p-12 min-h-[40vh] md:min-h-screen"
      >
        <LogoWordmark
          variant="navy"
          className="w-full max-h-[60vh] aspect-[4/1]"
          sizes="50vw"
        />
      </motion.div>

    </section>
  );
}
