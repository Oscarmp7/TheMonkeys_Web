import Image from "next/image";
import { Linkedin, Youtube, Instagram, Facebook } from "lucide-react";
import { SITE } from "@/lib/site";
import type { Locale } from "@/i18n/routing";

const SOCIALS = [
  { icon: Linkedin, href: SITE.linkedin, label: "LinkedIn" },
  { icon: Youtube, href: SITE.youtube, label: "YouTube" },
  { icon: Facebook, href: SITE.facebook, label: "Facebook" },
  { icon: Instagram, href: SITE.instagram, label: "Instagram" },
];

export function Footer({ locale }: { locale: Locale }) {
  const year = new Date().getFullYear();
  const location = locale === "es" ? SITE.location.es : SITE.location.en;
  const rightsText = locale === "es" ? "Todos los derechos reservados" : "All rights reserved";

  return (
    <footer className="bg-brand-yellow py-12 px-8">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        {/* Logo */}
        <div className="relative w-48 h-12">
          <Image
            src="/logos/logo-navy.png"
            alt="The Monkeys"
            fill
            className="object-contain object-left"
            sizes="192px"
          />
        </div>

        {/* Info row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col gap-1 text-brand-navy text-sm">
            <span>{location}</span>
            <a
              href={`mailto:${SITE.email}`}
              className="hover:underline font-medium"
            >
              {SITE.email}
            </a>
            <a
              href={`tel:${SITE.phone}`}
              className="hover:underline"
            >
              {SITE.phone}
            </a>
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-3">
            {SOCIALS.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-9 h-9 rounded-full border border-brand-navy/30 flex items-center justify-center text-brand-navy hover:bg-brand-navy hover:text-brand-yellow transition-colors duration-300"
              >
                <Icon size={16} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <p className="text-brand-navy/60 text-xs border-t border-brand-navy/10 pt-4">
          © {year} {SITE.name} · {rightsText}
        </p>
      </div>
    </footer>
  );
}
