"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface PortfolioCardProps {
  title: string;
  image: string;
  services: string[];
  featured: boolean;
  index: number;
  onClick: () => void;
}

export function PortfolioCard({
  title,
  image,
  services,
  featured,
  index,
  onClick,
}: PortfolioCardProps) {
  return (
    <motion.div
      className={`
        relative overflow-hidden rounded-2xl cursor-pointer group
        ${featured ? "md:col-span-2 md:row-span-2 min-h-[450px]" : "col-span-1 min-h-[250px]"}
      `}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: "easeOut",
      }}
      onClick={onClick}
    >
      {/* Background image */}
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes={featured ? "(min-width: 768px) 66vw, 100vw" : "(min-width: 768px) 33vw, 100vw"}
      />

      {/* Default gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-brand-navy/80 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />

      {/* Content — always visible at bottom */}
      <div className="absolute inset-x-0 bottom-0 p-6 z-10">
        <h3 className="font-display text-xl md:text-2xl font-bold text-white">
          {title}
        </h3>

        {/* Service tags — visible on hover */}
        <div className="flex flex-wrap gap-2 mt-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 delay-100">
          {services.map((service) => (
            <span
              key={service}
              className="text-xs font-medium px-3 py-1 rounded-full bg-brand-yellow text-brand-navy"
            >
              {service}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
