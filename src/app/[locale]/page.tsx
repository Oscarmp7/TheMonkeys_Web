import { Hero } from "@/components/sections/hero";
import { Brandbook } from "@/components/sections/brandbook";
import { Portfolio } from "@/components/sections/portfolio";
import { LogosBanner } from "@/components/sections/logos-banner";
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
      <main>
        <Hero locale={locale} />
        <Brandbook />
        <Portfolio locale={locale} />
        <LogosBanner />
      </main>
    </LayoutProvider>
  );
}
