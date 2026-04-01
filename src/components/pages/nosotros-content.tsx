"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import NextLink from "next/link";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const TEAM_KEYS = ["giovanny", "guillermo"] as const;
const WHY_KEYS = ["team", "investment", "transparency", "allies"] as const;

export function NosotrosContent() {
  const t = useTranslations("about_page");
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (prefersReduced) return;

      gsap.fromTo(
        "[data-about-hero]",
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.72,
          stagger: 0.1,
          ease: "expo.out",
          delay: 0.15,
        }
      );

      gsap.fromTo(
        "[data-about-history]",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.62,
          stagger: 0.08,
          ease: "expo.out",
          scrollTrigger: { trigger: "[data-about-history-section]", start: "top 82%", once: true },
        }
      );

      gsap.fromTo(
        "[data-about-team-header]",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.58,
          stagger: 0.08,
          ease: "expo.out",
          scrollTrigger: { trigger: "[data-about-team-section]", start: "top 84%", once: true },
        }
      );

      gsap.utils.toArray<HTMLElement>("[data-about-team-card]").forEach((card, index) => {
        gsap.fromTo(
          card,
          { opacity: 0, x: index % 2 === 0 ? -24 : 24, y: 24 },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.72,
            ease: "expo.out",
            scrollTrigger: { trigger: card, start: "top 84%", once: true },
          }
        );
      });

      gsap.fromTo(
        "[data-about-why-intro]",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.58,
          stagger: 0.08,
          ease: "expo.out",
          scrollTrigger: { trigger: "[data-about-why-section]", start: "top 82%", once: true },
        }
      );

      gsap.fromTo(
        "[data-about-why-item]",
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "expo.out",
          scrollTrigger: { trigger: "[data-about-why-list]", start: "top 84%", once: true },
        }
      );

      gsap.fromTo(
        "[data-about-quote]",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.62,
          stagger: 0.08,
          ease: "expo.out",
          scrollTrigger: { trigger: "[data-about-why-section]", start: "top 82%", once: true },
        }
      );

      gsap.fromTo(
        "[data-about-cta]",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "expo.out",
          scrollTrigger: { trigger: "[data-about-cta-section]", start: "top 84%", once: true },
        }
      );

      gsap.utils.toArray<HTMLElement>("[data-about-scroll-glow]").forEach((glow) => {
        const trigger = glow.closest("[data-about-surface]") ?? glow;

        gsap.fromTo(
          glow,
          { yPercent: 8 },
          {
            yPercent: -8,
            ease: "none",
            scrollTrigger: {
              trigger,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });
    },
    { scope: containerRef }
  );

  const values = t.raw("values") as string[];

  return (
    <div ref={containerRef}>
      <section data-about-surface className="relative overflow-hidden bg-brand-black">
        <div
          data-about-scroll-glow
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px]"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 58% 24%, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.025) 28%, transparent 72%)",
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent_38%,transparent)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.018),transparent_55%)]" />

        <div className="relative mx-auto flex min-h-[80svh] max-w-[1400px] items-center px-6 pb-28 pt-36 sm:px-12 sm:pb-32 sm:pt-40">
          <div className="max-w-[1020px]">
            <div data-about-hero className="mb-4 flex items-center gap-3 sm:mb-6">
              <span className="inline-block h-px w-6 bg-brand-yellow/65" aria-hidden="true" />
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-brand-yellow/78 sm:text-sm">
                {t("hero_eyebrow")}
              </span>
            </div>

            <h1
              data-about-hero
              className="max-w-[12.5ch] font-display text-[clamp(3.4rem,10vw,9.5rem)] uppercase leading-[0.84] tracking-tight"
            >
              <span
                className="block"
                style={{
                  WebkitTextStroke: "2px #F5C518",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {t("hero_title_line1_outline")}
              </span>
              <span className="mt-3 block sm:mt-5">
                <span className="block text-brand-yellow sm:inline">{t("hero_title_line2_yellow")}</span>
                <span className="mt-2 block text-off-white sm:ml-[0.12em] sm:mt-0 sm:inline">
                  {t("hero_title_line3")}
                </span>
              </span>
            </h1>

            <p
              data-about-hero
              className="mt-9 max-w-[660px] font-body text-sm leading-relaxed text-off-white/62 sm:mt-10 sm:text-base lg:text-[1.02rem]"
            >
              {t("hero_subtitle")}{" "}
              <strong className="text-off-white">{t("hero_subtitle_bold")}</strong>{" "}
              {t("hero_subtitle_end")}
            </p>

            <div
              data-about-hero
              className="mt-12 flex flex-wrap gap-x-5 gap-y-2.5 font-mono text-[0.58rem] uppercase tracking-[0.24em] text-off-white/34 sm:mt-14"
            >
              <span>strategy</span>
              <span>production</span>
              <span>campaigns</span>
              <span>santiago, rd</span>
            </div>
          </div>
        </div>
      </section>

      <section
        data-about-history-section
        data-about-surface
        className="relative overflow-hidden bg-[#F1F0EB] py-20 sm:py-28"
      >
        <div
          data-about-scroll-glow
          className="pointer-events-none absolute left-[-8%] top-8 h-[320px] w-[420px]"
          style={{
            background: "radial-gradient(circle, rgba(30,36,63,0.06) 0%, transparent 72%)",
          }}
        />
        <div className="pointer-events-none absolute inset-0 opacity-[0.02] [background-image:radial-gradient(circle_at_1px_1px,rgba(30,36,63,0.08)_1px,transparent_0)] [background-size:18px_18px]" />

        <div className="relative mx-auto max-w-[1400px] px-6 sm:px-12">
          <div className="grid items-center gap-14 lg:grid-cols-[minmax(320px,0.92fr)_minmax(0,1.08fr)] lg:gap-16">
            <div data-about-history className="relative">
              <div className="overflow-hidden border border-brand-navy/15 bg-brand-navy/8">
                <div className="aspect-[4/3] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent_62%)] p-4 sm:p-6">
                  <div className="flex h-full flex-col justify-between border border-white/8 px-5 py-5 sm:px-7 sm:py-6">
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-mono text-[0.52rem] uppercase tracking-[0.24em] text-brand-navy/50">
                        founders / placeholder
                      </span>
                      <span className="font-mono text-[0.52rem] uppercase tracking-[0.24em] text-brand-navy/35">
                        the monkeys
                      </span>
                    </div>

                    <div className="flex flex-1 items-center justify-center">
                      <span className="font-display text-[7rem] uppercase leading-none text-brand-yellow/[0.18] sm:text-[9rem]">
                        TM
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4 font-mono text-[0.52rem] uppercase tracking-[0.24em] text-brand-navy/40">
                      <span>Santiago, RD</span>
                      <span>strategy + visual</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-5 left-5 bg-brand-yellow px-5 py-4 shadow-[0_22px_40px_rgba(0,0,0,0.28)] sm:left-7">
                <div className="font-display text-4xl leading-none text-brand-black">
                  {t("history_badge_number")}
                </div>
                <div className="mt-1 font-mono text-[0.52rem] uppercase tracking-[0.22em] text-brand-black/58">
                  {t("history_badge_label")}
                </div>
              </div>
            </div>

            <div className="lg:pl-2">
              <div data-about-history className="mb-4 flex items-center gap-3">
                <span className="inline-block h-[2px] w-8 bg-brand-yellow" aria-hidden="true" />
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-brand-navy/55">
                  {t("history_eyebrow")}
                </span>
              </div>

              <h2
                data-about-history
                className="mb-7 max-w-[13.2ch] font-display text-3xl uppercase leading-[0.9] text-brand-navy sm:text-4xl md:text-[3.8rem]"
              >
                <span className="block">{t("history_title_line1")}</span>
                <span className="block text-brand-yellow">{t("history_title_line2")}</span>
                <span className="mt-1 block">{`${t("history_title_line3")} ${t("history_title_line4")}`}</span>
              </h2>

              <div className="space-y-4">
                <p data-about-history className="font-body text-sm leading-relaxed text-brand-navy/65 sm:text-[0.96rem]">
                  {t("history_body1")}
                </p>
                <p data-about-history className="font-body text-sm leading-relaxed text-brand-navy/65 sm:text-[0.96rem]">
                  {t("history_body2")}
                </p>
                <p data-about-history className="font-body text-sm leading-relaxed text-brand-navy/65 sm:text-[0.96rem]">
                  {t("history_body3")}{" "}
                  <strong className="text-brand-navy">{t("history_body3_bold")}</strong>
                </p>
              </div>

              <div data-about-history className="mt-7 flex flex-wrap gap-x-5 gap-y-2.5">
                {values.map((value) => (
                  <span
                    key={value}
                    className="border-b border-brand-yellow/18 pb-1 font-mono text-[0.58rem] uppercase tracking-[0.18em] text-brand-navy/55 transition-colors duration-200 hover:border-brand-yellow/40 hover:text-brand-navy"
                  >
                    {value}
                  </span>
                ))}
              </div>

              <a
                data-about-history
                href="https://wa.me/18097561847"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-10 inline-flex min-w-[16rem] items-center justify-center gap-3 rounded-full border border-brand-yellow/70 bg-brand-yellow px-7 py-4 font-display text-base tracking-[0.04em] text-brand-black transition-all duration-200 hover:scale-[1.035] hover:shadow-[0_0_26px_rgba(245,197,24,0.38)] sm:min-w-[17rem] sm:px-9 sm:py-4.5"
              >
                {t("values_cta")}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section data-about-team-section className="bg-brand-black py-20 sm:py-28">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-12">
          <div className="mb-14 flex flex-col items-center text-center sm:mb-16">
            <div data-about-team-header className="mb-4 flex items-center gap-3">
              <span className="h-[2px] w-8 bg-brand-yellow" aria-hidden="true" />
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-off-white/50">
                {t("team_eyebrow")}
              </span>
              <span className="h-[2px] w-8 bg-brand-yellow" aria-hidden="true" />
            </div>
            <h2
              data-about-team-header
              className="font-display text-4xl uppercase leading-[0.92] text-off-white sm:text-5xl md:text-6xl lg:text-7xl"
            >
              {t("team_title_line1")}
              <br />
              <span className="text-brand-yellow">{t("team_title_line2")}</span>
            </h2>
            <p
              data-about-team-header
              className="mt-4 max-w-[560px] font-body text-sm leading-relaxed text-off-white/50 sm:text-base"
            >
              {t("team_subtitle")}
            </p>
          </div>

          <div className="flex flex-col gap-16 sm:gap-20">
            {TEAM_KEYS.map((key, index) => {
              const tags = t.raw(`team.${key}.tags`) as string[];
              const isReversed = index % 2 === 1;

              const media = (
                <div className="relative overflow-hidden border border-white/10 bg-brand-navy/55 transition-all duration-300 group-hover:border-white/16">
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),transparent_60%)]" />
                  <div className="relative aspect-[4/3] px-5 py-5 sm:px-6 sm:py-6">
                    <div className="flex h-full flex-col justify-between border border-white/8 p-5 sm:p-6">
                      <div className="flex items-center justify-between gap-4">
                        <span className="font-mono text-[0.5rem] uppercase tracking-[0.24em] text-off-white/40">
                          {t(`team.${key}.badge`)}
                        </span>
                        <span className="font-mono text-[0.5rem] uppercase tracking-[0.24em] text-off-white/24">
                          founders / plate
                        </span>
                      </div>

                      <div className="flex flex-1 items-center justify-center">
                        <span className="font-display text-[6.5rem] uppercase leading-none text-brand-yellow/[0.1] sm:text-[8.5rem]">
                          {t(`team.${key}.initials`)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4 font-mono text-[0.5rem] uppercase tracking-[0.24em] text-off-white/28">
                        <span>{t(`team.${key}.role`)}</span>
                        <span>the monkeys</span>
                      </div>
                    </div>
                  </div>
                </div>
              );

              const content = (
                <div className="flex h-full flex-col justify-center">
                  <p className="font-mono text-[0.58rem] uppercase tracking-[0.24em] text-brand-yellow/75">
                    {t(`team.${key}.badge`)}
                  </p>
                  <h3 className="mt-4 font-display text-[2.2rem] uppercase leading-[0.92] text-off-white sm:text-[2.7rem]">
                    {t(`team.${key}.name`)}
                  </h3>
                  <p className="mt-2 font-mono text-[0.62rem] uppercase tracking-[0.24em] text-off-white/38">
                    {t(`team.${key}.role`)}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="border-b border-brand-yellow/18 pb-1 font-mono text-[0.56rem] uppercase tracking-[0.18em] text-off-white/48"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 space-y-4">
                    <p className="font-body text-sm leading-relaxed text-off-white/58 sm:text-[0.96rem]">
                      {t(`team.${key}.bio1`)}
                    </p>
                    <p className="font-body text-sm leading-relaxed text-off-white/58 sm:text-[0.96rem]">
                      {t(`team.${key}.bio2`)}
                    </p>
                  </div>

                  <div className="mt-8 grid gap-4 border-t border-white/10 pt-5 sm:grid-cols-3 sm:gap-5">
                    {(["stat1", "stat2", "stat3"] as const).map((stat) => (
                      <div key={stat} className="sm:border-l sm:border-white/8 sm:pl-5 first:sm:border-l-0 first:sm:pl-0">
                        <div className="font-display text-3xl leading-none text-brand-yellow">
                          {t(`team.${key}.${stat}_num`)}
                        </div>
                        <div className="mt-1 font-mono text-[0.54rem] uppercase tracking-[0.18em] text-off-white/34">
                          {t(`team.${key}.${stat}_label`)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );

              return (
                <article
                  key={key}
                  data-about-team-card
                  className="group border-t border-white/10 pt-7 sm:pt-8"
                >
                  <div
                    className={cn(
                      "grid gap-8 lg:items-start lg:gap-10",
                      isReversed
                        ? "lg:grid-cols-[minmax(0,1.04fr)_minmax(320px,0.76fr)]"
                        : "lg:grid-cols-[minmax(320px,0.76fr)_minmax(0,1.04fr)]"
                    )}
                  >
                    {isReversed ? (
                      <>
                        {content}
                        {media}
                      </>
                    ) : (
                      <>
                        {media}
                        {content}
                      </>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section
        data-about-why-section
        data-about-surface
        className="relative overflow-hidden bg-brand-navy-dark py-20 sm:py-28"
      >
        <div
          data-about-scroll-glow
          className="pointer-events-none absolute left-1/2 top-0 h-[280px] w-[380px] -translate-x-1/2"
          style={{
            background: "radial-gradient(circle, rgba(255,255,255,0.045) 0%, transparent 72%)",
          }}
        />

        <div className="relative mx-auto max-w-[1400px] px-6 sm:px-12">
          <div className="overflow-hidden border border-white/10 lg:grid lg:grid-cols-[minmax(0,1.06fr)_minmax(360px,0.94fr)]">
            <div className="bg-brand-navy-dark px-8 py-12 sm:px-12 sm:py-14 lg:px-14 lg:py-16">
              <div data-about-why-intro className="mb-4 flex items-center gap-3">
                <span className="inline-block h-[2px] w-8 bg-brand-yellow" aria-hidden="true" />
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-off-white/50">
                  {t("why_eyebrow")}
                </span>
              </div>

              <h2
                data-about-why-intro
                className="max-w-[11.8ch] font-display text-4xl uppercase leading-[0.92] text-off-white sm:text-5xl md:text-[5rem]"
              >
                <span className="block">{`${t("why_title_line1")} ${t("why_title_line2")}`}</span>
                <span className="mt-1 block text-brand-yellow">{`${t("why_title_line3")} ${t("why_title_line4")}`}</span>
              </h2>

              <div data-about-why-list className="mt-8 flex flex-col">
                {WHY_KEYS.map((key, index) => (
                  <div
                    key={key}
                    data-about-why-item
                    className={cn(
                      "group grid gap-4 border-t border-white/10 py-4 sm:grid-cols-[22px_minmax(0,1fr)] sm:gap-5",
                      index === 0 && "border-t-0 pt-0"
                    )}
                  >
                    <div className="mt-1 flex h-[22px] w-[22px] items-center justify-center rounded-full border border-brand-yellow/22 text-brand-yellow/82 transition-colors duration-200 group-hover:border-brand-yellow/44">
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <path
                          d="M2 6l2.5 2.5L10 3"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-display text-sm uppercase tracking-wide text-off-white">
                        {t(`why_items.${key}.title`)}
                      </h4>
                      <p className="mt-1.5 max-w-[58ch] font-body text-sm leading-relaxed text-off-white/52">
                        {t(`why_items.${key}.description`)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-brand-yellow px-8 py-12 text-brand-black sm:px-12 sm:py-14 lg:px-14 lg:py-16">
              <div data-about-quote className="font-mono text-[0.6rem] uppercase tracking-[0.24em] text-brand-black/46">
                The Monkeys / Value
              </div>
              <p
                data-about-quote
                className="mt-5 max-w-[13.6ch] font-display text-[clamp(2.1rem,4vw,4rem)] uppercase leading-[0.9] text-brand-black"
              >
                {t("why_quote")}
              </p>
              <p
                data-about-quote
                className="mt-6 max-w-[44ch] font-body text-sm leading-relaxed text-brand-black/68 sm:text-[0.98rem]"
              >
                {t("why_quote_body")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        data-about-cta-section
        data-about-surface
        className="relative overflow-hidden bg-brand-black py-28 text-center sm:py-36"
      >
        <div
          data-about-scroll-glow
          className="pointer-events-none absolute inset-x-0 top-12 mx-auto h-[260px] w-[560px] max-w-[90vw]"
          style={{
            background: "radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 72%)",
          }}
        />
        <div className="pointer-events-none absolute inset-0 opacity-[0.018] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.82)_1px,transparent_0)] [background-size:18px_18px]" />

        <div className="relative z-10 mx-auto max-w-[1400px] px-6 sm:px-12">
          <div data-about-cta className="mb-4 flex items-center justify-center gap-3 sm:mb-6">
            <span className="h-px w-6 bg-brand-yellow/60" aria-hidden="true" />
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-brand-yellow/80 sm:text-sm">
              {t("cta_eyebrow")}
            </span>
            <span className="h-px w-6 bg-brand-yellow/60" aria-hidden="true" />
          </div>

          <h2
            data-about-cta
            className="mx-auto max-w-[12.6ch] font-display text-[clamp(3rem,9vw,8.5rem)] uppercase leading-[0.85] tracking-tight"
          >
            <span
              className="block"
              style={{
                WebkitTextStroke: "2px #F5C518",
                WebkitTextFillColor: "transparent",
              }}
            >
              {t("cta_title_outline")}
            </span>
            <span className="mt-4 block sm:mt-5">
              <span className="text-off-white">{t("cta_title_mid")}</span>{" "}
              <span className="text-brand-yellow">{t("cta_title_yellow")}</span>
            </span>
          </h2>

          <p
            data-about-cta
            className="mx-auto mt-7 max-w-[540px] font-body text-sm leading-relaxed text-off-white/60 sm:mt-8 sm:text-base"
          >
            {t("cta_subtitle")}
          </p>

          <div data-about-cta className="mt-10 flex flex-wrap justify-center gap-3 sm:mt-12 sm:gap-4">
            <a
              href="https://wa.me/18097561847"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-brand-yellow px-6 py-3 font-display text-sm tracking-wider text-brand-black transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_0_24px_rgba(245,197,24,0.38)] sm:px-8 sm:py-3.5 sm:text-base"
            >
              {t("cta_button_primary")}
            </a>
            <NextLink
              href="/servicios"
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border-2 border-off-white/38 px-6 py-3 font-display text-sm tracking-wider text-off-white transition-colors duration-200 hover:border-off-white hover:text-brand-black sm:px-8 sm:py-3.5 sm:text-base"
            >
              <span className="absolute inset-0 origin-left scale-x-0 bg-off-white transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
              <span className="relative z-10">{t("cta_button_secondary")}</span>
            </NextLink>
          </div>
        </div>
      </section>
    </div>
  );
}
