"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Reveal from "@/components/ui/Reveal";

const faqKeys = ["why-from", "payment", "what-raises", "hidden-costs"] as const;

/** FAQ spécifique aux prix, sur la page /tarifs. */
export default function PricingFAQ() {
  const t = useTranslations("tarifs.faq");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="max-w-3xl space-y-4">
      {faqKeys.map((key, index) => (
        <Reveal key={key} delay={index * 60}>
          <div
            className={`bg-[var(--background-card)] border rounded-xl overflow-hidden transition-colors duration-300 ${
              openIndex === index
                ? "border-[var(--accent)]"
                : "border-[var(--border)] hover:border-[var(--accent)]/50"
            }`}
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              aria-expanded={openIndex === index}
              className="w-full px-6 py-5 flex items-center justify-between text-left gap-4"
            >
              <span className="font-semibold">{t(`items.${key}.question`)}</span>
              <span
                aria-hidden="true"
                className={`flex-shrink-0 w-7 h-7 rounded-full bg-[var(--accent)]/10 flex items-center justify-center transition-transform duration-300 ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              >
                <svg className="w-4 h-4 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === index ? "max-h-96" : "max-h-0"
              }`}
            >
              <div className="px-6 pb-5 text-sm text-[var(--foreground-secondary)] leading-relaxed">
                {t(`items.${key}.answer`)}
              </div>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
