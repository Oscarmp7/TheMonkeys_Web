"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Link as IntlLink, usePathname, useRouter } from "@/i18n/navigation";
import { LogoWordmark } from "@/components/ui/logo-wordmark";
import { NAV_LINK_KEYS, NAV_ANCHORS } from "@/lib/nav";
import type { Locale } from "@/i18n/routing";

gsap.registerPlugin(useGSAP);

/** Nav keys that correspond to real routes (not hash anchors). */
const ROUTE_KEYS = new Set(["servicios"] as const);

export function NavbarHero({ locale }: { locale: Locale }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const magicLineRef = useRef<HTMLDivElement>(null);
  const navPillRef = useRef<HTMLDivElement>(null);
  const magicLineVisible = useRef(false);
  const [scrolled, setScrolled] = useState(false);

  const prefersReduced =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > window.innerHeight * 0.8);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkEnter = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (prefersReduced) return;
      const line = magicLineRef.current;
      const pill = navPillRef.current;
      if (!line || !pill) return;

      const pillRect = pill.getBoundingClientRect();
      const linkRect = e.currentTarget.getBoundingClientRect();
      const left = linkRect.left - pillRect.left + 16; // 16px = px-4 padding
      const width = linkRect.width - 32; // subtract both sides of px-4

      if (!magicLineVisible.current) {
        gsap.set(line, { left, width });
        gsap.to(line, { opacity: 1, duration: 0.15 });
        magicLineVisible.current = true;
      } else {
        gsap.to(line, { left, width, duration: 0.3, ease: "expo.out" });
      }
    },
    [prefersReduced]
  );

  const handlePillLeave = useCallback(() => {
    if (prefersReduced) return;
    const line = magicLineRef.current;
    if (!line) return;
    gsap.to(line, {
      opacity: 0,
      duration: 0.2,
      onComplete: () => {
        magicLineVisible.current = false;
      },
    });
  }, [prefersReduced]);

  useGSAP(
    () => {
      if (prefersReduced || !navRef.current) return;
      gsap.from(navRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.6,
        delay: 0.1,
        ease: "expo.out",
      });
    },
    { scope: navRef }
  );

  function handleLogoEnter() {
    if (prefersReduced) return;
    const el = logoRef.current;
    gsap.killTweensOf(el);
    gsap.timeline()
      .to(el, { x: -4, skewX: 4,  duration: 0.04, ease: "none" })
      .to(el, { x:  5, skewX: -3, filter: "brightness(1.5) hue-rotate(10deg)", duration: 0.04, ease: "none" })
      .to(el, { x: -3, skewX:  2, filter: "brightness(1)",  duration: 0.04, ease: "none" })
      .to(el, { x:  4, skewX: -4, filter: "brightness(1.6)", duration: 0.04, ease: "none" })
      .to(el, { x:  0, skewX:  0, filter: "brightness(1)", scale: 1.06, duration: 0.2, ease: "expo.out" });
  }

  function switchLocale(next: "es" | "en") {
    if (next === locale) return;
    const navigate = () =>
      router.replace(
        // @ts-expect-error -- TypeScript validates params against pathname;
        // since both always match for the current route, skip runtime checks.
        { pathname, params },
        { locale: next }
      );
    if (typeof document !== "undefined" && "startViewTransition" in document) {
      (document as Document & { startViewTransition: (cb: () => void) => void })
        .startViewTransition(navigate);
    } else {
      navigate();
    }
  }

  function handleLogoLeave() {
    if (prefersReduced) return;
    const el = logoRef.current;
    gsap.killTweensOf(el);
    gsap.to(el, { x: 0, skewX: 0, scale: 1, filter: "none", duration: 0.35, ease: "expo.out" });
  }

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-10 lg:px-16 xl:px-24 transition-all duration-300 ${
        scrolled
          ? "py-3 backdrop-blur-md bg-brand-black/60 border-b border-white/10 shadow-lg"
          : "py-6"
      }`}
    >
      {/* Logo wordmark - left */}
      <Link href="/" className="relative w-20 sm:w-24 lg:w-28 xl:w-32 aspect-square -my-4 cursor-pointer">
        <div
          ref={logoRef}
          className="w-full h-full"
          onMouseEnter={handleLogoEnter}
          onMouseLeave={handleLogoLeave}
        >
          <LogoWordmark variant="yellow" className="w-full h-full" sizes="128px" priority />
        </div>
      </Link>

      {/* Nav links - center (glass pill) */}
      <div
        ref={navPillRef}
        className="relative hidden md:flex items-center gap-1 backdrop-blur-md bg-white/5 border border-white/10 rounded-full px-6 py-2"
        onMouseLeave={handlePillLeave}
      >
        {/* Magic line — single shared underline that slides between links */}
        <div
          ref={magicLineRef}
          className="pointer-events-none absolute bottom-2 h-px bg-brand-yellow opacity-0"
          style={{ willChange: "left, width, opacity" }}
        />
        {NAV_LINK_KEYS.map((key) => {
          const href = NAV_ANCHORS[key];
          const linkClass =
            "relative px-4 py-2 text-off-white/70 hover:text-brand-yellow text-sm font-body font-medium tracking-wide transition-colors duration-200 cursor-pointer";
          if (!ROUTE_KEYS.has(key as "servicios")) {
            return (
              <Link key={key} href={href} className={linkClass} onMouseEnter={handleLinkEnter}>
                {t(key)}
              </Link>
            );
          }
          return (
            <IntlLink key={key} href={href as "/"} className={linkClass} onMouseEnter={handleLinkEnter}>
              {t(key)}
            </IntlLink>
          );
        })}
        <Link
          href="#contacto"
          className="ml-3 px-6 py-2 bg-brand-yellow text-brand-black text-sm font-display tracking-wider rounded-full transition-all duration-200 cursor-pointer hover:scale-105 hover:shadow-[0_0_20px_rgba(245,197,24,0.5)] active:scale-95"
        >
          {t("cotizar")}
        </Link>
      </div>

      {/* Language toggle - sliding pill */}
      <div className="relative flex items-center border border-white/20 rounded-full p-1 gap-1">
        {/* sliding background indicator */}
        <div
          className="absolute inset-y-1 rounded-full bg-white/15 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            width: "calc(50% - 6px)",
            left: locale === "es" ? "4px" : "calc(50% + 2px)",
          }}
        />
        <button
          onClick={() => switchLocale("es")}
          className={`relative z-10 rounded-full px-3 py-1 text-sm font-mono uppercase cursor-pointer transition-colors duration-200 ${
            locale === "es" ? "text-white" : "text-white/40 hover:text-white/60"
          }`}
        >
          ES
        </button>
        <button
          onClick={() => switchLocale("en")}
          className={`relative z-10 rounded-full px-3 py-1 text-sm font-mono uppercase cursor-pointer transition-colors duration-200 ${
            locale === "en" ? "text-white" : "text-white/40 hover:text-white/60"
          }`}
        >
          EN
        </button>
      </div>
    </nav>
  );
}
