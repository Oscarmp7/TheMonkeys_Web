"use client";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoWordmarkProps {
  variant?: "yellow" | "navy" | "white";
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export function LogoWordmark({
  variant = "yellow",
  className,
  sizes = "50vw",
  priority = false,
}: LogoWordmarkProps) {
  const src = {
    yellow: "/logos/logo-yellow.png",
    navy: "/logos/logo-navy.png",
    white: "/logos/logo-white.png",
  }[variant];

  return (
    <div className={cn("relative", className)}>
      <Image
        src={src}
        alt="The Monkeys"
        fill
        sizes={sizes}
        className="object-contain"
        priority={priority}
      />
    </div>
  );
}

export function MKMonogram({
  variant = "yellow",
  className,
}: {
  variant?: "yellow" | "navy" | "white";
  className?: string;
}) {
  const src = {
    yellow: "/logos/mk-yellow.png",
    navy: "/logos/mk-navy.png",
    white: "/logos/mk-white.png",
  }[variant];

  return (
    <div className={cn("relative w-12 h-12", className)}>
      <Image src={src} alt="MK" fill className="object-contain" />
    </div>
  );
}
