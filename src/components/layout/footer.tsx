import Image from "next/image";
import { Linkedin, Youtube, Instagram, Facebook } from "lucide-react";
import { SITE } from "@/lib/site";
import type { Locale } from "@/i18n/routing";

/** Pinterest brand icon matching the Lucide component interface. */
function PinterestIcon({
  size = 24,
  ...props
}: { size?: number } & React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0" />
    </svg>
  );
}

const SOCIALS = [
  { icon: Instagram, href: SITE.instagram, label: "Instagram" },
  { icon: Linkedin, href: SITE.linkedin, label: "LinkedIn" },
  { icon: Youtube, href: SITE.youtube, label: "YouTube" },
  { icon: Facebook, href: SITE.facebook, label: "Facebook" },
  { icon: PinterestIcon, href: SITE.pinterest, label: "Pinterest" },
];

export function Footer({ locale }: { locale: Locale }) {
  const phoneFormatted = "+1 (809) 756-1847";
  const locationText = SITE.location[locale];

  return (
    <footer className="bg-brand-black py-12 px-6 md:px-8">
      <div className="max-w-6xl mx-auto w-full">
        {/* Top row — logo left, contact right */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          {/* Logo */}
          <Image
            src="/logos/logo-white.png"
            width={160}
            height={40}
            alt="The Monkeys"
            className="object-contain h-auto"
          />

          {/* Contact info */}
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

        {/* Divider */}
        <div className="border-t border-white/10 my-8" />

        {/* Bottom row — location left, socials center-right, copyright */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Location + copyright */}
          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs text-white/40">
              {locationText}
            </span>
            <span className="font-mono text-xs text-white/30">
              &copy; {new Date().getFullYear()} The Monkeys
            </span>
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
