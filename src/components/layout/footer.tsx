"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import { socialLinks, type SiteSettings } from "@/lib/site-data";

function PinterestIcon({ size = 24 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
    </svg>
  );
}

const socialIcons = {
  Instagram,
  Facebook,
  LinkedIn: Linkedin,
  YouTube: Youtube,
  Pinterest: PinterestIcon,
};

export function Footer({ settings }: { settings: SiteSettings }) {
  const t = useTranslations("footer");
  const navT = useTranslations("nav");

  const navLinks = [
    { href: "#services", label: navT("services") },
    { href: "#portfolio", label: navT("portfolio") },
    { href: "#about", label: navT("about") },
    { href: "#contact", label: navT("contact") },
  ];

  return (
    <footer className="border-t border-brand-yellow/10 bg-[linear-gradient(180deg,#001A2C_0%,#00263E_100%)] py-16 text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-md">
            <Image
              src="/logos/logo-white.png"
              alt="The Monkeys"
              width={160}
              height={50}
              className="h-10 w-auto"
            />
            <p className="mt-5 text-sm leading-7 text-white/50">{t("tagline")}</p>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
              {t("navigation")}
            </h2>
            <nav className="mt-5 flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-white/60 transition-colors duration-200 hover:text-brand-yellow"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
              {t("follow")}
            </h2>
            <div className="mt-5 flex flex-wrap gap-4">
              {socialLinks.map((social) => {
                const Icon = socialIcons[social.label];
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/50 transition-colors duration-200 hover:text-brand-yellow"
                    aria-label={social.label}
                  >
                    <Icon size={22} />
                  </a>
                );
              })}
            </div>

            <div className="mt-8 space-y-1.5 text-sm text-white/40">
              <p>{settings.email}</p>
              <p>{settings.phone}</p>
              <p>{settings.address}</p>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-white/8 pt-8 text-center text-xs text-white/30">
          {t("copyright")}
        </div>
      </div>
    </footer>
  );
}
