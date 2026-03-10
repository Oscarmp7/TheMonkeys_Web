import { Hero } from "@/components/sections/hero";
import { Services } from "@/components/sections/services";
import { Portfolio } from "@/components/sections/portfolio";
import { ClientLogos } from "@/components/sections/client-logos";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import {
  getClientLogos,
  getPortfolioProjects,
  getSiteSettings,
  type AppLocale,
} from "@/lib/site-data";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const appLocale: AppLocale = locale === "en" ? "en" : "es";

  const [projects, logos, settings] = await Promise.all([
    getPortfolioProjects(appLocale),
    getClientLogos(),
    getSiteSettings(appLocale),
  ]);

  return (
    <main id="main-content" tabIndex={-1} className="overflow-x-clip">
      <Hero locale={appLocale} settings={settings} />
      <Services />
      <Portfolio projects={projects} />
      <ClientLogos logos={logos} />
      <About />
      <Contact locale={appLocale} settings={settings} />
    </main>
  );
}
