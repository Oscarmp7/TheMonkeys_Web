"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface ValueCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
}

export function ValueCard({
  icon: Icon,
  title,
  description,
  index,
}: ValueCardProps) {
  return (
    <motion.div
      className="bg-white dark:bg-brand-navy-light/30 dark:border dark:border-white/10 rounded-2xl p-8 text-center"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: index * 0.15,
        ease: "easeOut",
      }}
    >
      <Icon size={40} strokeWidth={1.5} className="text-brand-yellow mx-auto mb-4" />
      <h3 className="font-display font-semibold text-xl">{title}</h3>
      <p className="text-sm opacity-70 mt-2">{description}</p>
    </motion.div>
  );
}
