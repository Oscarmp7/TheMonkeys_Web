"use client";
import Image from "next/image";
import { CLIENT_LOGOS } from "@/lib/clients";

export function LogosBanner() {
  if (CLIENT_LOGOS.length === 0) return null;

  // Duplicate for seamless infinite loop: 2 copies, animate -50% translateX
  const logos = [...CLIENT_LOGOS, ...CLIENT_LOGOS];

  return (
    <section
      aria-label="Nuestros clientes"
      className="py-16 bg-off-white border-y border-brand-navy/10 overflow-hidden"
    >
      <div className="marquee-track flex gap-16 w-max">
        {logos.map((logo, i) => (
          <div
            key={`${logo.name}-${i}`}
            className="relative w-32 h-16 flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
          >
            <Image
              src={logo.src}
              alt={logo.name}
              fill
              className="object-contain"
              sizes="128px"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
