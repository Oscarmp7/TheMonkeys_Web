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
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useFocusTrap } from "@/hooks/use-focus-trap";
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

  // Mobile menu state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const mobileLinkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const mobileCtaRef = useRef<HTMLAnchorElement>(null);
  const mobileLangRef = useRef<HTMLDivElement>(null);

  const prefersReduced = usePrefersReducedMotion();

  // Focus trap + Escape key for mobile menu
  const closeMenu = useCallback(() => {
    if (isAnimating) return;
    const menu = menuRef.current;
    if (!menu) {
      setIsMenuOpen(false);
      return;
    }

    if (prefersReduced) {
      setIsMenuOpen(false);
      return;
    }

    setIsAnimating(true);
    gsap.to(menu, {
      opacity: 0,
      y: -10,
      duration: 0.2,
      ease: "expo.in",
      onComplete: () => {
        setIsMenuOpen(false);
        setIsAnimating(false);
      },
    });
  }, [isAnimating, prefersReduced]);

  useFocusTrap(isMenuOpen, menuRef, closeMenu);

  // Scroll state — RAF-throttled
  useEffect(() => {
    let ticking = false;
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > window.innerHeight * 0.8);
          ticking = false;
        });
        ticking = true;
      }
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll lock when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMenuOpen]);

  function openMenu() {
    if (isAnimating) return;
    setIsMenuOpen(true);
    setIsAnimating(true);

    requestAnimationFrame(() => {
      const menu = menuRef.current;
      if (!menu) {
        setIsAnimating(false);
        return;
      }

      const targets = [
        ...mobileLinkRefs.current.filter(Boolean),
        mobileLangRef.current,
        mobileCtaRef.current,
      ].filter(Boolean);

      if (prefersReduced) {
        gsap.set(menu, { opacity: 1, y: 0 });
        gsap.set(targets, { opacity: 1, y: 0 });
        setIsAnimating(false);
        return;
      }

      gsap.fromTo(
        menu,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.3, ease: "expo.out" }
      );
      gsap.fromTo(
        targets,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.07,
          ease: "expo.out",
          delay: 0.1,
          onComplete: () => setIsAnimating(false),
        }
      );
    });
  }

  function toggleMenu() {
    if (isMenuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  const handleLinkEnter = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (prefersReduced) return;
      const line = magicLineRef.current;
      const pill = navPillRef.current;
      if (!line || !pill) return;

      const pillRect = pill.getBoundingClientRect();
      const linkRect = e.currentTarget.getBoundingClientRect();
      const left = linkRect.left - pillRect.left + 16;
      const width = linkRect.width - 32;

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
    { scope: navRef, dependencies: [prefersReduced] }
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
        // @ts-expect-error -- pathname + params always match for the current route
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

  /** Close mobile menu, then scroll to a hash anchor after the overlay is gone. */
  function handleMobileAnchor(e: React.MouseEvent, href: string) {
    e.preventDefault();
    // Close immediately (no animation delay) so scroll target is reachable
    setIsMenuOpen(false);
    setIsAnimating(false);
    // Scroll after React removes the overlay
    requestAnimationFrame(() => {
      const id = href.replace("#", "");
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    });
  }

  function handleLogoLeave() {
    if (prefersReduced) return;
    const el = logoRef.current;
    gsap.killTweensOf(el);
    gsap.to(el, { x: 0, skewX: 0, scale: 1, filter: "none", duration: 0.35, ease: "expo.out" });
  }

  const mobileNavItems = NAV_LINK_KEYS.map((key) => ({
    key,
    href: NAV_ANCHORS[key],
    label: t(key),
    isRoute: ROUTE_KEYS.has(key as "servicios"),
  }));

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-10 lg:px-16 xl:px-24 transition-all duration-300 ${
          scrolled
            ? "py-3 backdrop-blur-md bg-brand-black/60 border-b border-white/10 shadow-lg"
            : "py-6"
        }`}
      >
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

        <div
          ref={navPillRef}
          className="relative hidden md:flex items-center gap-1 backdrop-blur-md bg-white/5 border border-white/10 rounded-full px-6 py-2"
          onMouseLeave={handlePillLeave}
        >
          <div
            ref={magicLineRef}
            className="pointer-events-none absolute bottom-2 h-px bg-brand-yellow opacity-0"
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

        <div className="flex items-center gap-3">
          <div className="relative hidden md:flex items-center border border-white/20 rounded-full p-1 gap-1">
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

          <button
            onClick={toggleMenu}
            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 cursor-pointer"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Cerrar menu" : "Abrir menu"}
          >
            <span className={`w-6 h-[2px] bg-off-white transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`w-6 h-[2px] bg-off-white transition-all duration-300 ${isMenuOpen ? "opacity-0 scale-x-0" : ""}`} />
            <span className={`w-6 h-[2px] bg-off-white transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <div
          ref={menuRef}
          className="fixed inset-0 z-40 bg-brand-black flex flex-col items-center justify-center md:hidden"
        >
          <div className="flex flex-col items-center gap-8">
            {mobileNavItems.map((item, i) => {
              const linkClass =
                "font-display text-4xl text-off-white uppercase tracking-wider transition-colors duration-200 cursor-pointer hover:text-brand-yellow";

              if (item.isRoute) {
                return (
                  <IntlLink
                    key={item.key}
                    ref={(el) => { mobileLinkRefs.current[i] = el; }}
                    href={item.href as "/"}
                    className={linkClass}
                    onClick={closeMenu}
                  >
                    {item.label}
                  </IntlLink>
                );
              }
              // Hash anchor — close menu first, then scroll
              return (
                <a
                  key={item.key}
                  ref={(el) => { mobileLinkRefs.current[i] = el; }}
                  href={item.href}
                  className={linkClass}
                  onClick={(e) => handleMobileAnchor(e, item.href)}
                >
                  {item.label}
                </a>
              );
            })}
          </div>

          <div
            ref={mobileLangRef}
            className="relative flex items-center border border-white/20 rounded-full p-1 gap-1 mt-10"
          >
            <div
              className="absolute inset-y-1 rounded-full bg-white/15 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                width: "calc(50% - 6px)",
                left: locale === "es" ? "4px" : "calc(50% + 2px)",
              }}
            />
            <button
              onClick={() => { switchLocale("es"); closeMenu(); }}
              className={`relative z-10 rounded-full px-4 py-2 text-base font-mono uppercase cursor-pointer transition-colors duration-200 ${
                locale === "es" ? "text-white" : "text-white/40 hover:text-white/60"
              }`}
            >
              ES
            </button>
            <button
              onClick={() => { switchLocale("en"); closeMenu(); }}
              className={`relative z-10 rounded-full px-4 py-2 text-base font-mono uppercase cursor-pointer transition-colors duration-200 ${
                locale === "en" ? "text-white" : "text-white/40 hover:text-white/60"
              }`}
            >
              EN
            </button>
          </div>

          <a
            ref={mobileCtaRef}
            href="#contacto"
            className="bg-brand-yellow text-brand-black font-display px-8 py-4 tracking-widest uppercase mt-8 transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
            onClick={(e) => handleMobileAnchor(e, "#contacto")}
          >
            {t("cotizar")}
          </a>
        </div>
      )}
    </>
  );
}
