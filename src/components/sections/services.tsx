"use client";

import { useTranslations } from "next-intl";
import {
  HoverSlider,
  HoverSliderImage,
  HoverSliderImageWrap,
  TextStaggerHover,
} from "@/components/ui/animated-slideshow";

const SLIDES = [
  {
    id: "inbound",
    titleKey: "inbound",
    imageUrl:
      "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=800&auto=format&fit=crop",
  },
  {
    id: "content_production",
    titleKey: "content_production",
    imageUrl:
      "https://images.unsplash.com/photo-1574717025058-2f8737d2e2b7?w=800&auto=format&fit=crop",
  },
  {
    id: "seo",
    titleKey: "seo",
    imageUrl:
      "https://images.unsplash.com/photo-1571721795195-a2ca2d3370a9?w=800&auto=format&fit=crop",
  },
  {
    id: "web_dev",
    titleKey: "web_dev",
    imageUrl:
      "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&auto=format&fit=crop",
  },
  {
    id: "influencers",
    titleKey: "influencers",
    imageUrl:
      "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop",
  },
  {
    id: "campaigns",
    titleKey: "campaigns",
    imageUrl:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop",
  },
  {
    id: "content_creation",
    titleKey: "content_creation",
    imageUrl:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&auto=format&fit=crop",
  },
];

export function Services() {
  const t = useTranslations("services");

  return (
    <section id="services">
      <HoverSlider className="min-h-svh flex flex-col justify-center px-6 py-24 md:px-12 lg:px-16 bg-surface-light dark:bg-brand-navy">
        {/* Overheader */}
        <p className="mb-8 text-xs font-medium uppercase tracking-widest text-brand-yellow">
          / {t("overheader")}
        </p>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
          {/* Service list */}
          <div className="flex flex-col gap-3 md:gap-5">
            {SLIDES.map((slide, index) => (
              <TextStaggerHover
                key={slide.id}
                index={index}
                text={t(`items.${slide.titleKey}`)}
                className="text-3xl font-bold uppercase tracking-tight text-brand-navy dark:text-white md:text-4xl lg:text-5xl"
              />
            ))}
          </div>

          {/* Image stack — hidden on mobile */}
          <div className="hidden lg:block w-[420px] flex-shrink-0">
            <HoverSliderImageWrap className="aspect-[4/3] rounded-2xl overflow-hidden">
              {SLIDES.map((slide, index) => (
                <HoverSliderImage
                  key={slide.id}
                  index={index}
                  imageUrl={slide.imageUrl}
                  src={slide.imageUrl}
                  alt={t(`items.${slide.titleKey}`)}
                  className="size-full object-cover"
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                />
              ))}
            </HoverSliderImageWrap>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16">
          <a
            href="https://wa.me/18097561847?text=Hola,%20me%20interesa%20saber%20más%20sobre%20sus%20servicios"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-brand-yellow text-brand-navy px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            {t("cta")}
          </a>
        </div>
      </HoverSlider>
    </section>
  );
}
