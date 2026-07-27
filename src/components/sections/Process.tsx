"use client";

import { useTranslations } from "next-intl";
import Reveal from "@/components/ui/Reveal";

const PHASES = ["quote", "design", "build", "handover"] as const;

/**
 * Le process présenté comme les phases d'un vrai chantier — la numérotation
 * porte une information réelle : l'ordre des étapes que vit le client.
 */
export default function Process() {
  const t = useTranslations("process");

  return (
    <section id="process" className="py-24 md:py-32">
      <div className="section-container">
        <Reveal>
          <div className="mb-16 max-w-2xl">
            <p className="annotation-accent mb-4">{t("label")}</p>
            <h2 className="display-xl mb-4">{t("title")}</h2>
            <p className="text-[var(--foreground-secondary)]">{t("subtitle")}</p>
          </div>
        </Reveal>

        <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PHASES.map((phase, index) => (
            <Reveal key={phase} delay={index * 100} className="h-full">
              <li className="h-full flex flex-col bg-[var(--background-card)] border border-[var(--border)] rounded-xl p-6">
                <p className="annotation mb-4">
                  {t("phaseLabel")} {String(index + 1).padStart(2, "0")} / 04
                </p>
                <h3 className="text-lg font-bold mb-3">{t(`steps.${phase}.title`)}</h3>
                <p className="text-sm text-[var(--foreground-secondary)] leading-relaxed mb-4 flex-1">
                  {t(`steps.${phase}.description`)}
                </p>
                <p className="tag-chantier w-fit">{t(`steps.${phase}.marker`)}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
