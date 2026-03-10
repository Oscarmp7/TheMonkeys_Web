"use client";

import { motion } from "framer-motion";

interface SectionHeaderProps {
  overheader: string;
  title: string;
  centered?: boolean;
}

export function SectionHeader({
  overheader,
  title,
  centered = true,
}: SectionHeaderProps) {
  return (
    <motion.div
      className={centered ? "text-center" : ""}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <p className="text-brand-yellow uppercase tracking-widest text-sm font-semibold">
        {overheader}
      </p>
      <h2 className="font-display text-4xl md:text-5xl font-bold mt-2">
        {title}
      </h2>
    </motion.div>
  );
}
