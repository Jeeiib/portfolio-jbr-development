"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import ChantierScene from "@/components/hero/ChantierScene";
import { siteConfig } from "@/data/siteConfig";
import { useAnalytics } from "@/hooks/useAnalytics";

export default function Hero() {
  const t = useTranslations("hero");
  const locale = useLocale();
  const { trackEvent } = useAnalytics();

  return (
    <section className="relative min-h-[88svh] flex items-center pt-28 pb-16">
      <div className="section-container py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Message + CTA — visibles dès la première frame, aucun contenu n'attend l'animation */}
          <div className="text-center lg:text-left">
            <p className="annotation mb-5">{t("annotation")}</p>

            <h1 className="display-2xl mb-6">
              {t("title")}{" "}
              <span className="text-[var(--accent)]">{t("titleHighlight")}</span>
            </h1>

            <p className="text-lg sm:text-xl text-[var(--foreground-secondary)] mb-9 max-w-xl mx-auto lg:mx-0">
              {t("subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4 mb-6">
              <Link
                href={`/${locale}/brief`}
                onClick={() => trackEvent("cta_brief_click", { from: "hero" })}
                className="inline-flex items-center justify-center px-7 py-4 text-base font-semibold bg-[var(--accent)] btn-primary-text rounded-lg transition-colors hover:bg-[var(--accent-hover)]"
              >
                {t("ctaPrimary")}
              </Link>
              <a
                href={`tel:${siteConfig.phone}`}
                onClick={() => trackEvent("tel_click", { from: "hero" })}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 text-base font-semibold border border-[var(--border)] rounded-lg transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                {siteConfig.phoneDisplay}
              </a>
            </div>

            <p className="text-sm text-[var(--foreground-secondary)]">
              {t("reassurance")}
            </p>
          </div>

          {/* La scène chantier vivant */}
          <div>
            <ChantierScene />
          </div>
        </div>
      </div>

    </section>
  );
}
