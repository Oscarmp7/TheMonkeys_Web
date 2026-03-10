"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface ServiceCardProps {
  icon: LucideIcon;
  name: string;
  index: number;
}

export function ServiceCard({ icon: Icon, name, index }: ServiceCardProps) {
  return (
    <motion.div
      className="group flex flex-col items-center text-center p-8 rounded-2xl bg-white border border-gray-100 dark:bg-brand-navy-light/30 dark:border-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-default"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut",
      }}
    >
      <Icon
        size={48}
        strokeWidth={1.5}
        className="text-brand-navy dark:text-white group-hover:text-brand-yellow transition-colors duration-300"
      />
      <p className="font-display font-semibold text-lg mt-4">{name}</p>
    </motion.div>
  );
}
