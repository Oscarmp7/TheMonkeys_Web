"use client";
import { Linkedin, Youtube, Instagram, Facebook } from "lucide-react";
import { SITE } from "@/lib/site";

const SOCIALS = [
  { icon: Linkedin, href: SITE.linkedin, label: "LinkedIn" },
  { icon: Youtube, href: SITE.youtube, label: "YouTube" },
  { icon: Facebook, href: SITE.facebook, label: "Facebook" },
  { icon: Instagram, href: SITE.instagram, label: "Instagram" },
];

export function SocialSidebar() {
  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
      {SOCIALS.map(({ icon: Icon, href, label }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="w-9 h-9 rounded-full border border-brand-yellow/40 flex items-center justify-center text-brand-yellow hover:bg-brand-yellow hover:text-brand-navy transition-colors duration-300"
        >
          <Icon size={16} />
        </a>
      ))}
    </div>
  );
}
