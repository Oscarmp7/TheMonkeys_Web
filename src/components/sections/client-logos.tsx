"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";

interface ClientLogo {
  _id: string;
  name: string;
  logoUrl: string;
}

const fallbackLogos: ClientLogo[] = [
  {
    _id: "jimetor",
    name: "Jimetor Eco Village",
    logoUrl: "/portfolio/jimetor-logo.jpeg",
  },
];

export function ClientLogos() {
  const t = useTranslations("clients");

  const logos = fallbackLogos;

  return (
    <section
      id="clients"
      className="py-24 lg:py-32 bg-surface-light-alt dark:bg-brand-navy-deep"
    >
      <div className="container mx-auto px-6 lg:px-12">
        <SectionHeader overheader={t("overheader")} title="" />

        <motion.div
          className="flex flex-wrap justify-center items-center gap-12 mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {logos.map((logo) => (
            <div key={logo._id} className="group">
              <Image
                src={logo.logoUrl}
                alt={logo.name}
                width={120}
                height={60}
                className="h-16 w-auto object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all ease-in-out"
                style={{ transitionDuration: "400ms" }}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
