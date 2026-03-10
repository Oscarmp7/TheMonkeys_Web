"use client";

import { useTranslations } from "next-intl";
import {
  TrendingUp,
  Film,
  Search,
  Code,
  Users,
  Megaphone,
  Camera,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { ServiceCard } from "@/components/ui/service-card";

interface ServiceItem {
  key: string;
  icon: LucideIcon;
}

const serviceItems: ServiceItem[] = [
  { key: "inbound", icon: TrendingUp },
  { key: "content_production", icon: Film },
  { key: "seo", icon: Search },
  { key: "web_dev", icon: Code },
  { key: "influencers", icon: Users },
  { key: "campaigns", icon: Megaphone },
  { key: "content_creation", icon: Camera },
];

export function Services() {
  const t = useTranslations("services");

  return (
    <section id="services" className="py-24 lg:py-32">
      <div className="container mx-auto px-6 lg:px-12">
        <SectionHeader overheader={t("overheader")} title={t("title")} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {serviceItems.map((item, index) => (
            <ServiceCard
              key={item.key}
              icon={item.icon}
              name={t(`items.${item.key}`)}
              index={index}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="https://wa.me/18097561847?text=Hola,%20me%20interesa%20saber%20más%20sobre%20sus%20servicios"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-brand-yellow text-brand-navy px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all duration-300"
          >
            {t("cta")}
          </a>
        </div>
      </div>
    </section>
  );
}
