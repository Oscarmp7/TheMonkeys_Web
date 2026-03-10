"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";

interface PortfolioCardProps {
  title: string;
  image: string;
  services: string[];
  featured: boolean;
  index: number;
  label: string;
  onClick: () => void;
  className?: string;
}

export function PortfolioCard({
  title,
  image,
  services,
  featured,
  index,
  label,
  onClick,
  className,
}: PortfolioCardProps) {
  const locale = useLocale();
  const eyebrow = locale === "es" ? "Proyecto" : "Case Study";

  return (
    <motion.button
      type="button"
      className={cn(
        `group relative overflow-hidden rounded-[2rem] border border-brand-navy/10 text-left shadow-[0_30px_80px_-48px_rgba(0,38,62,0.58)] ${
        featured
          ? "min-h-[450px] md:col-span-2 md:row-span-2"
          : "col-span-1 min-h-[260px]"
      }`,
        className,
      )}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.55,
        delay: index * 0.12,
        ease: "easeOut",
      }}
      onClick={onClick}
      aria-label={`${label}: ${title}`}
      aria-haspopup="dialog"
    >
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes={
          featured ? "(min-width: 768px) 66vw, 100vw" : "(min-width: 768px) 33vw, 100vw"
        }
      />

      <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/85 via-brand-navy/28 to-transparent" />
      <div className="absolute inset-0 translate-y-full bg-brand-navy/86 transition-transform duration-500 ease-out group-hover:translate-y-0" />

      <div className="absolute inset-x-0 bottom-0 z-10 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-yellow/85">
          {eyebrow}
        </p>
        <h3 className="mt-2 font-display text-xl font-bold text-white md:text-2xl">
          {title}
        </h3>

        <div className="mt-3 flex flex-wrap gap-2 opacity-0 translate-y-4 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          {services.map((service) => (
            <span
              key={service}
              className="rounded-full bg-brand-yellow px-3 py-1 text-xs font-medium text-brand-navy"
            >
              {service}
            </span>
          ))}
        </div>
      </div>
    </motion.button>
  );
}
