import { Hero } from "@/components/sections/hero";
import { Brandbook } from "@/components/sections/brandbook";
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
      </main>
    </LayoutProvider>
  );
}
