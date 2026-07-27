"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { offers, type Offer } from "@/data/offers";
import Reveal from "@/components/ui/Reveal";
import { useAnalytics } from "@/hooks/useAnalytics";

function formatPrice(n: number, locale: string) {
  return new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-US").format(n);
}

/**
 * Grille tarifaire détaillée de la page /tarifs. Montants exclusivement
 * depuis offers.ts ; le détail "inclus" (6 puces) vient de tarifs.items.*.
 */
export default function PricingTable() {
  const t = useTranslations("tarifs");
  const locale = useLocale();
  const { trackEvent } = useAnalytics();

  const priceLine = (offer: Offer) => {
    if (offer.monthly !== undefined) {
      return (
        <>
          <span className="proof text-4xl">{formatPrice(offer.monthly, locale)} €</span>
          <span className="text-sm text-[var(--foreground-secondary)]"> HT {t("perMonth")}</span>
        </>
      );
    }
    return (
      <>
        <span className="text-sm text-[var(--foreground-secondary)]">{t("from")} </span>
        <span className="proof text-4xl">{formatPrice(offer.priceFrom, locale)} €</span>
        <span className="text-sm text-[var(--foreground-secondary)]"> HT</span>
      </>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {offers.map((offer, index) => (
        <Reveal key={offer.id} delay={index * 100} className="h-full">
          <article
            className={`h-full flex flex-col bg-[var(--background-card)] border rounded-xl p-8 ${
              offer.id === "vitrine" ? "border-[var(--accent)]" : "border-[var(--border)]"
            }`}
          >
            {offer.id === "vitrine" && (
              <p className="annotation-accent mb-4">{t("popular")}</p>
            )}
            <h2 className="text-xl font-bold mb-2">{t(`items.${offer.id}.title`)}</h2>
            <p className="text-sm text-[var(--foreground-secondary)] mb-6">
              {t(`items.${offer.id}.description`)}
            </p>

            <p className="mb-3">{priceLine(offer)}</p>
            <p className="tag-chantier w-fit mb-7">
              {offer.delayWeeks
                ? t("delay", { min: offer.delayWeeks[0], max: offer.delayWeeks[1] })
                : t("noCommitment")}
            </p>

            <ul className="flex flex-col gap-3 mb-8 flex-1">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm">
                  <span className="text-[var(--accent)] mt-0.5" aria-hidden="true">✓</span>
                  <span className="text-[var(--foreground-secondary)]">
                    {t(`items.${offer.id}.includes.${i}`)}
                  </span>
                </li>
              ))}
            </ul>

            <Link
              href={`/${locale}/brief`}
              onClick={() => trackEvent("cta_brief_click", { from: `tarifs-${offer.id}` })}
              className="inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold bg-[var(--accent)] btn-primary-text rounded-lg transition-colors hover:bg-[var(--accent-hover)] mt-auto"
            >
              {t("estimateCta")}
            </Link>
          </article>
        </Reveal>
      ))}
    </div>
  );
}
