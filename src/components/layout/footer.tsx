import Image from "next/image";
import { SITE } from "@/lib/site";
import { SOCIALS_CONFIG } from "@/lib/socials";
import type { Locale } from "@/i18n/routing";

export function Footer({ locale }: { locale: Locale }) {
  const phoneFormatted = "+1 (809) 756-1847";
  const locationText = SITE.location[locale];

  return (
    <footer className="relative z-10 bg-brand-black py-12 px-6 md:px-8">
      <div className="max-w-6xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <Image
            src="/logos/logo-main.png"
            width={160}
            height={60}
            alt="The Monkeys"
            className="object-contain h-auto"
          />

          <div className="flex flex-col items-start md:items-end gap-1.5">
            <a
              href={`mailto:${SITE.email}`}
              className="font-mono text-sm text-off-white/70 hover:text-brand-yellow transition-colors duration-200 cursor-pointer"
            >
              {SITE.email}
            </a>
            <a
              href={`tel:${SITE.phone}`}
              className="font-mono text-sm text-off-white/70 hover:text-brand-yellow transition-colors duration-200 cursor-pointer"
            >
              {phoneFormatted}
            </a>
          </div>
        </div>

        <div className="border-t border-white/10 my-8" />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs text-white/40">
              {locationText}
            </span>
            <span className="font-mono text-xs text-white/30">
              &copy; {new Date().getFullYear()} The Monkeys
            </span>
          </div>

          <div className="flex items-center gap-3">
            {SOCIALS_CONFIG.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-8 h-8 border border-white/20 flex items-center justify-center text-white/50 hover:border-brand-yellow hover:text-brand-yellow hover:bg-brand-yellow/5 transition-all duration-200 cursor-pointer"
              >
                <Icon size={14} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
