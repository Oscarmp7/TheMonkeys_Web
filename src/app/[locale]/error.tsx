"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error_page");

  useEffect(() => {
    // Surface the real error for debugging without leaking it to the UI
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h1 className="font-display text-6xl text-brand-yellow mb-4">{t("headline")}</h1>
        <p className="font-body text-off-white/60 text-base mb-8">{t("body")}</p>
        <button
          onClick={reset}
          className="bg-brand-yellow text-brand-black font-display text-sm tracking-wider px-8 py-3 rounded-full cursor-pointer hover:scale-105 transition-transform duration-200"
        >
          {t("cta")}
        </button>
      </div>
    </div>
  );
}
