"use client";

import { useTranslations } from "next-intl";
import { siteConfig } from "@/data/siteConfig";
import { useAnalytics } from "@/hooks/useAnalytics";

/**
 * Bandeau de preuve immédiat sous le hero : avis Google, clients, zone,
 * délai de réponse. Les chiffres sont les seuls éléments en accent.
 */
export default function ProofStrip() {
  const t = useTranslations("proofStrip");
  const { trackEvent } = useAnalytics();

  return (
    <div className="border-y border-[var(--border)] bg-[var(--background-secondary)]">
      <div className="section-container py-4">
        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-[var(--foreground-secondary)]">
          <li>
            <a
              href={siteConfig.googleReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("google_review_click", { from: "proof-strip" })}
              className="hover:opacity-80 transition-opacity"
            >
              <span className="proof">★ {t("rating")}</span> {t("ratingLabel")}
            </a>
          </li>
          <li aria-hidden="true" className="hidden sm:block text-[var(--border)]">·</li>
          <li>
            <span className="proof">3</span> {t("clients")}
          </li>
          <li aria-hidden="true" className="hidden sm:block text-[var(--border)]">·</li>
          <li>{t("area")}</li>
          <li aria-hidden="true" className="hidden sm:block text-[var(--border)]">·</li>
          <li>{t("response")}</li>
        </ul>
      </div>
    </div>
  );
}
