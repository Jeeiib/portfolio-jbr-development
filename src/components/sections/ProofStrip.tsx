"use client";

import { useTranslations } from "next-intl";
import { siteConfig } from "@/data/siteConfig";
import { useAnalytics } from "@/hooks/useAnalytics";

/**
 * Barre de preuve immédiate sous le hero : quatre faits, chacun en
 * valeur + étiquette façon relevé de chantier. Les valeurs sont les
 * seuls éléments en accent.
 */
export default function ProofStrip() {
  const t = useTranslations("proofStrip");
  const { trackEvent } = useAnalytics();

  const items = [
    { value: `★ ${t("rating")}`, label: t("ratingLabel"), href: siteConfig.googleReviewsUrl },
    { value: "3", label: t("clients") },
    { value: "Lille", label: t("area") },
    { value: "24 h", label: t("response") },
  ];

  return (
    <div className="border-y border-[var(--border)] bg-[var(--background-secondary)]">
      <div className="section-container py-8">
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8 text-center">
          {items.map((item) => (
            <li key={item.label}>
              {item.href ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("google_review_click", { from: "proof-strip" })}
                  className="group inline-block"
                >
                  <p className="proof text-2xl mb-1 transition-opacity group-hover:opacity-80">
                    {item.value}
                  </p>
                  <p className="annotation">{item.label}</p>
                </a>
              ) : (
                <>
                  <p className="proof text-2xl mb-1">{item.value}</p>
                  <p className="annotation">{item.label}</p>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
