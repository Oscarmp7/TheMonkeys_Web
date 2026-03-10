"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function FloatingShapes() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";
  const mkSrc = isDark ? "/logos/mk-white.png" : "/logos/mk-main.png";

  return (
    <div className="absolute inset-0 hidden md:flex items-center justify-center">
      {/* Decorative small shapes behind MK */}
      <motion.div
        className="absolute w-20 h-20 rounded-full bg-brand-yellow/10"
        style={{ top: "10%", right: "15%" }}
        animate={{ y: [0, -15, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-12 h-12 rounded-lg bg-brand-navy/10 dark:bg-white/5"
        style={{ bottom: "20%", left: "10%" }}
        animate={{ y: [0, 12, 0], rotate: [0, 45, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        className="absolute w-16 h-16 rounded-full bg-brand-yellow/15"
        style={{ bottom: "10%", right: "20%" }}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />

      {/* Main MK Logo - Large, animated */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Glow behind MK */}
        <motion.div
          className="absolute inset-0 blur-3xl bg-brand-yellow/20 rounded-full scale-150"
          animate={{ opacity: [0.2, 0.4, 0.2], scale: [1.4, 1.6, 1.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* MK floating animation */}
        <motion.div
          animate={{ y: [0, -12, 0], rotate: [-2, 2, -2] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src={mkSrc}
            alt="MK"
            width={320}
            height={320}
            className="w-64 h-64 lg:w-80 lg:h-80 object-contain drop-shadow-2xl relative z-10"
            priority
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
