import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFoundPage() {
  const t = useTranslations("not_found");

  return (
    <main className="min-h-screen bg-brand-black flex items-center justify-center px-6">
      <div className="max-w-xl text-center">
        <div className="mb-6 flex items-center justify-center gap-3">
          <span className="h-px w-6 bg-brand-yellow/60" aria-hidden="true" />
          <span className="font-mono text-xs tracking-[0.25em] uppercase text-brand-yellow/80">
            {t("eyebrow")}
          </span>
          <span className="h-px w-6 bg-brand-yellow/60" aria-hidden="true" />
        </div>

        <p
          className="font-display text-[clamp(6rem,20vw,12rem)] leading-none text-stroke-yellow"
          aria-hidden="true"
        >
          404
        </p>

        <h1 className="mt-4 font-display text-2xl sm:text-3xl uppercase text-off-white">
          {t("headline")}
        </h1>

        <p className="mt-4 font-body text-sm sm:text-base text-off-white/60 leading-relaxed">
          {t("body")}
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-brand-yellow px-8 py-3.5 font-display text-sm tracking-wider text-brand-black transition-all duration-200 hover:scale-[1.03] hover:shadow-glow-yellow cursor-pointer"
        >
          {t("cta")}
        </Link>
      </div>
    </main>
  );
}
