"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export function ScrollIndicator() {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 md:block"
      animate={{ y: [0, 10, 0] }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      aria-hidden="true"
    >
      <ChevronDown className="h-8 w-8 text-brand-navy dark:text-white opacity-60" />
    </motion.div>
  );
}
