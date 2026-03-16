import { Hero } from "@/components/sections/hero";
import type { Locale } from "@/i18n/routing";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return (
    <main>
      <Hero locale={locale} />
    </main>
  );
}
