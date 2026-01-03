"use client";

import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useTranslations } from "next-intl";

const steps = [
  {
    id: "discovery",
    number: "01",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    id: "proposal",
    number: "02",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    id: "development",
    number: "03",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    id: "delivery",
    number: "04",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
];

export default function Process() {
  const t = useTranslations("process");
  const { ref: sectionRef, isVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.25 });
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  return (
    <section
      id="process"
      ref={sectionRef}
      className="py-24 md:py-32 bg-[var(--background)]"
    >
      <div className="section-container">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <span className="inline-block text-sm font-medium text-[var(--accent)] uppercase tracking-widest mb-4">
            {t("label")}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            {t("title")}
          </h2>
          <p className="text-[var(--foreground-secondary)] max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* Process Steps with connecting line */}
        <div className="relative">
          {/* Connector line (desktop only) */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-[var(--border)] -translate-y-1/2 z-0">
            <div
              className={`h-full bg-[var(--accent)] transition-all duration-[2000ms] ease-out ${
                isVisible ? "w-full" : "w-0"
              }`}
              style={{ transitionDelay: "800ms" }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`relative z-10 transition-all duration-1000 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-12"
                }`}
                style={{ transitionDelay: `${400 + index * 200}ms` }}
                onMouseEnter={() => setHoveredStep(index)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                <div
                  className={`relative bg-[var(--background-card)] border rounded-2xl p-6 h-full transition-all duration-300 ${
                    hoveredStep === index
                      ? "border-[var(--accent)] shadow-lg shadow-[var(--accent)]/20 -translate-y-2"
                      : "border-[var(--border)] hover:border-[var(--accent)]/50"
                  }`}
                >
                  {/* Step number badge */}
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        hoveredStep === index
                          ? "bg-[var(--accent)] text-[var(--background)] scale-110"
                          : "bg-[var(--accent)]/10 text-[var(--accent)]"
                      }`}
                    >
                      {step.icon}
                    </div>
                    <span
                      className={`text-3xl font-bold transition-all duration-300 ${
                        hoveredStep === index
                          ? "text-[var(--accent)]"
                          : "text-[var(--accent)]/30"
                      }`}
                    >
                      {step.number}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold mb-2 transition-colors">
                    {t(`steps.${step.id}.title`)}
                  </h3>
                  <p className="text-[var(--foreground-secondary)] text-sm leading-relaxed">
                    {t(`steps.${step.id}.description`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
