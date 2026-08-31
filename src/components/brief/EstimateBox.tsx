"use client";

import { useLocale, useTranslations } from "next-intl";
import type { BriefData } from "@/data/briefTypes";
import { estimateFromBrief } from "@/lib/estimate";

interface EstimateBoxProps {
  data: Partial<BriefData>;
}

/**
 * Estimation immédiate affichée dans le récapitulatif du brief, avant
 * l'envoi : la récompense instantanée qui fait finir le parcours.
 * Fourchette calculée depuis les réponses (lib/estimate) et la grille.
 */
export default function EstimateBox({ data }: EstimateBoxProps) {
  const t = useTranslations("brief.estimate");
  const locale = useLocale();

  const { min, max } = estimateFromBrief(
    data as Pick<BriefData, "projectType" | "features">
  );
  const fmt = new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-US");

  return (
    <div className="rounded-xl border border-[var(--accent)] bg-[var(--accent)]/5 p-6 text-center">
      <p className="annotation mb-2">{t("label")}</p>
      <p className="mb-2">
        <span className="proof text-3xl">
          {fmt.format(min)} € – {fmt.format(max)} €
        </span>
        <span className="text-sm text-[var(--foreground-secondary)]"> HT</span>
      </p>
      <p className="text-xs text-[var(--foreground-secondary)]">{t("disclaimer")}</p>
    </div>
  );
}
