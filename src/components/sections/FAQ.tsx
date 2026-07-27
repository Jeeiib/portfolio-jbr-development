"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Reveal from "@/components/ui/Reveal";

const faqKeys = ["cost", "timeline", "nontech", "after", "wixOrCustom", "location"] as const;

/**
 * FAQ anti-objections : les vraies questions qu'un patron de TPE se pose
 * avant de confier son site, répondues frontalement.
 */
export default function FAQ() {
  const t = useTranslations("faq");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 md:py-32 bg-[var(--background-secondary)]">
      <div className="section-container">
        <Reveal>
          <div className="mb-16 max-w-2xl">
            <p className="annotation-accent mb-4">{t("label")}</p>
            <h2 className="display-xl">{t("title")}</h2>
          </div>
        </Reveal>

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
                  onClick={() => toggleItem(index)}
                  aria-expanded={openIndex === index}
                  className="w-full px-6 py-5 flex items-center justify-between text-left gap-4"
                >
                  <span className="font-semibold text-lg">{t(`items.${key}.question`)}</span>
                  <span
                    aria-hidden="true"
                    className={`flex-shrink-0 w-8 h-8 rounded-full bg-[var(--accent)]/10 flex items-center justify-center transition-transform duration-300 ${
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
                  <div className="px-6 pb-5 text-[var(--foreground-secondary)] leading-relaxed">
                    {t(`items.${key}.answer`)}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
