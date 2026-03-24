import { Hero } from "@/components/sections/hero";
import { StatsBar } from "@/components/sections/stats-bar";
import { Brandbook } from "@/components/sections/brandbook";
import { Methodology } from "@/components/sections/methodology";
import { ServicesSection } from "@/components/sections/services-section";
import { Process } from "@/components/sections/process";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/layout/footer";
import { NavbarHero } from "@/components/layout/navbar-hero";
import { LayoutProvider } from "@/components/providers/layout-provider";
import type { Locale } from "@/i18n/routing";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return (
    <LayoutProvider>
      <NavbarHero locale={locale} />
      <main>
        {/* Hero — fixed panel behind everything */}
        <div className="sticky top-0 z-0 h-screen">
          <Hero locale={locale} />
        </div>

        {/* Scrolling content — rises over the hero */}
        <div className="relative z-10">
          <StatsBar />
          <Brandbook />
          <Methodology />
          <ServicesSection />
          <Process />
          <Contact />
        </div>
      </main>
      <Footer locale={locale} />
    </LayoutProvider>
  );
}
