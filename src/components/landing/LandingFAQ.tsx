"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

interface FAQItem {
  key: string;
}

interface LandingFAQProps {
  slug: string;
  items: FAQItem[];
}

export default function LandingFAQ({ slug, items }: LandingFAQProps) {
  const t = useTranslations("landing");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {items.map((item, index) => (
        <div key={item.key}>
          <div
            className={`bg-[var(--background-card)] border rounded-xl overflow-hidden transition-all duration-300 ${
              openIndex === index
                ? "border-[var(--accent)] shadow-lg shadow-[var(--accent)]/10"
                : "border-[var(--border)] hover:border-[var(--accent)]/50"
            }`}
          >
            {/* Question Button */}
            <button
              onClick={() => toggleItem(index)}
              className="w-full px-6 py-5 flex items-center justify-between text-left gap-4"
            >
              <span className="font-semibold text-lg">
                {t(`${slug}.faq.${item.key}.question`)}
              </span>
              <span
                className={`flex-shrink-0 w-8 h-8 rounded-full bg-[var(--accent)]/10 flex items-center justify-center transition-transform duration-300 ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              >
                <svg
                  className="w-4 h-4 text-[var(--accent)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
            </button>

            {/* Answer */}
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === index ? "max-h-96" : "max-h-0"
              }`}
            >
              <div className="px-6 pb-5 text-[var(--foreground-secondary)] leading-relaxed">
                {t(`${slug}.faq.${item.key}.answer`)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
