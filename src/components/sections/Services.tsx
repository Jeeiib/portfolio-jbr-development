"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { offers, type Offer } from "@/data/offers";
import Reveal from "@/components/ui/Reveal";
import { useAnalytics } from "@/hooks/useAnalytics";
import { formatPrice } from "@/lib/formatPrice";

/**
 * Section Offres de la home : trois offres avec prix et délais affichés —
 * la transparence que les agences n'osent pas. Prix uniquement depuis
 * offers.ts (aucun montant en dur ici).
 */
export default function Services() {
  const t = useTranslations("offers");
  const locale = useLocale();
  const { trackEvent } = useAnalytics();

  const priceLine = (offer: Offer) => {
    if (offer.monthly !== undefined) {
      return (
        <>
          <span className="proof text-3xl">{formatPrice(offer.monthly, locale)} €</span>
          <span className="text-sm text-[var(--foreground-secondary)]"> HT {t("perMonth")}</span>
        </>
      );
    }
    return (
      <>
        <span className="text-sm text-[var(--foreground-secondary)]">{t("from")} </span>
        <span className="proof text-3xl">{formatPrice(offer.priceFrom, locale)} €</span>
        <span className="text-sm text-[var(--foreground-secondary)]"> HT</span>
      </>
    );
  };

  return (
    <section id="services" className="py-24 md:py-32 bg-[var(--background-secondary)]">
      <div className="section-container">
        <Reveal>
          <div className="mb-16 max-w-2xl">
            <p className="annotation-accent mb-4">{t("label")}</p>
            <h2 className="display-xl mb-4">{t("title")}</h2>
            <p className="text-[var(--foreground-secondary)]">{t("subtitle")}</p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offers.map((offer, index) => (
            <Reveal key={offer.id} delay={index * 100} className="h-full">
              <article className="h-full flex flex-col bg-[var(--background-card)] border border-[var(--border)] rounded-xl p-7 card-hover">
                <h3 className="text-xl font-bold mb-2">{t(`items.${offer.id}.title`)}</h3>
                <p className="text-sm text-[var(--foreground-secondary)] mb-6">
                  {t(`items.${offer.id}.description`)}
                </p>

                <p className="mb-3">{priceLine(offer)}</p>
                <p className="tag-chantier w-fit mb-6">
                  {offer.delayWeeks
                    ? t("delay", { min: offer.delayWeeks[0], max: offer.delayWeeks[1] })
                    : t("noCommitment")}
                </p>

                <ul className="flex flex-col gap-2.5 mb-8 flex-1">
                  {[0, 1, 2, 3].map((i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm">
                      <span className="text-[var(--accent)] mt-0.5" aria-hidden="true">✓</span>
                      <span className="text-[var(--foreground-secondary)]">
                        {t(`items.${offer.id}.includes.${i}`)}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/${locale}/tarifs`}
                  onClick={() => trackEvent("cta_click", { location: `offer-${offer.id}` })}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors mt-auto"
                >
                  {t("details")}
                  <span aria-hidden="true">→</span>
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
