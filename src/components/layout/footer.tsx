"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Instagram, Facebook, Linkedin, Youtube } from "lucide-react";

function PinterestIcon({ size = 24 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
    </svg>
  );
}

const socialLinks = [
  { href: "https://www.instagram.com/themonkeys.do/", icon: Instagram, label: "Instagram" },
  { href: "https://www.facebook.com/themonkeys.do", icon: Facebook, label: "Facebook" },
  { href: "https://www.linkedin.com/company/the-monkeysrd/", icon: Linkedin, label: "LinkedIn" },
  { href: "https://www.youtube.com/@Themonkeysrd", icon: Youtube, label: "YouTube" },
];

export function Footer() {
  const t = useTranslations("footer");
  const navT = useTranslations("nav");

  const navLinks = [
    { href: "#services", label: navT("services") },
    { href: "#portfolio", label: navT("portfolio") },
    { href: "#about", label: navT("about") },
    { href: "#contact", label: navT("contact") },
  ];

  return (
    <footer className="bg-brand-navy-deep text-white py-16">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <Image
              src="/logos/logo-white.png"
              alt="The Monkeys"
              width={180}
              height={60}
              className="h-12 w-auto"
            />
            <p className="mt-4 opacity-60 text-sm">{t("tagline")}</p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">
              Navegación
            </h4>
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="opacity-60 hover:opacity-100 hover:text-brand-yellow transition text-sm"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Social + Contact */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">
              Síguenos
            </h4>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-60 hover:opacity-100 hover:text-brand-yellow transition"
                  aria-label={social.label}
                >
                  <social.icon size={24} />
                </a>
              ))}
              <a
                href="https://www.pinterest.com/themonkeysdo/"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-60 hover:opacity-100 hover:text-brand-yellow transition"
                aria-label="Pinterest"
              >
                <PinterestIcon size={24} />
              </a>
            </div>
            <div className="mt-6 space-y-2 text-sm opacity-60">
              <p>hola@themonkeys.do</p>
              <p>(809) 756-1847</p>
            </div>
          </div>
        </div>

        {/* Separator + Copyright */}
        <div className="border-t border-white/10 mt-12 pt-8 text-center text-sm opacity-40">
          {t("copyright")}
        </div>
      </div>
    </footer>
  );
}
