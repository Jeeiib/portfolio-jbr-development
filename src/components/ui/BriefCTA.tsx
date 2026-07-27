"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { siteConfig } from "@/data/siteConfig";
import { useAnalytics } from "@/hooks/useAnalytics";

interface BriefCTAProps {
  /** Origine du clic, envoyée en analytics (ex. "home-proof", "tarifs") */
  from: string;
}

/**
 * Bloc CTA réutilisable vers le brief : estimation en 3 minutes,
 * avec rappel téléphone/WhatsApp pour ceux qui préfèrent parler.
 */
export default function BriefCTA({ from }: BriefCTAProps) {
  const t = useTranslations("briefCta");
  const locale = useLocale();
  const { trackEvent } = useAnalytics();

  return (
    <div className="section-container py-14">
      <div className="rounded-xl border border-dashed border-[var(--accent)] bg-[var(--accent)]/5 px-6 py-10 sm:px-10 text-center">
        <p className="annotation mb-3">{t("annotation")}</p>
        <h2 className="text-2xl sm:text-3xl font-bold mb-3">{t("title")}</h2>
        <p className="text-[var(--foreground-secondary)] mb-7 max-w-xl mx-auto">
          {t("subtitle")}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={`/${locale}/brief`}
            onClick={() => trackEvent("cta_brief_click", { from })}
            className="inline-flex items-center justify-center px-7 py-3.5 text-base font-semibold bg-[var(--accent)] btn-primary-text rounded-lg transition-colors hover:bg-[var(--accent-hover)]"
          >
            {t("cta")}
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <a
              href={`tel:${siteConfig.phone}`}
              onClick={() => trackEvent("tel_click", { from })}
              className="font-semibold hover:text-[var(--accent)] transition-colors"
            >
              {siteConfig.phoneDisplay}
            </a>
            <span className="text-[var(--border)]" aria-hidden="true">|</span>
            <a
              href={siteConfig.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("whatsapp_click", { from })}
              className="font-semibold hover:text-[var(--accent)] transition-colors"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
