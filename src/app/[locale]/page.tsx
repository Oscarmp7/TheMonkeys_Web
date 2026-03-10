import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("hero");

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between px-16 py-32 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <p className="text-sm font-medium uppercase tracking-widest text-brand-yellow">
            {t("overheader")}
          </p>
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            {t("title")}
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            {t("subtitle")}
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-brand-navy font-semibold transition-colors hover:bg-brand-yellow/90 md:w-[180px]"
            href="#contact"
          >
            {t("cta_primary")}
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[180px]"
            href="#portfolio"
          >
            {t("cta_secondary")}
          </a>
        </div>
      </main>
    </div>
  );
}
