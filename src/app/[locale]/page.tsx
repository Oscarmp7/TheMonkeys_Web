import { setRequestLocale } from "next-intl/server";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <p className="font-display text-6xl text-brand-navy p-8">The Monkeys — {locale}</p>
    </main>
  );
}
