"use client";
import { useEffect, useState } from "react";
import { SOCIALS_CONFIG } from "@/lib/socials";

export function SocialSidebar() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let ticking = false;
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          setVisible(window.scrollY < window.innerHeight * 0.8);
          ticking = false;
        });
        ticking = true;
      }
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed right-4 lg:right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3 animate-[fadeIn_0.7s_ease-out_1.6s_both] motion-reduce:animate-none transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {SOCIALS_CONFIG.map(({ icon: Icon, href, label }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="w-10 h-10 rounded-full border-2 border-brand-yellow/30 flex items-center justify-center text-brand-yellow/70 hover:bg-brand-yellow hover:text-brand-black transition-colors duration-200 cursor-pointer"
        >
          <Icon size={20} strokeWidth={2.5} aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}
