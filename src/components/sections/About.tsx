"use client";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";

export default function About() {
  const t = useTranslations("about");
  const locale = useLocale();
  const { ref: sectionRef, isVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.15 });

  const stats = [
    { value: "5★", label: t("stats.reviews") },
    { value: "100%", label: t("stats.satisfaction") },
    { value: "24-48h", label: t("stats.response") },
  ];

  return (
    <section
      id="a-propos"
      ref={sectionRef}
      className="py-24 md:py-32 bg-[var(--background-secondary)]"
    >
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image / Visual */}
          <div
            className={`relative order-2 lg:order-1 transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-12"
            }`}
          >
            <div className="relative aspect-square max-w-md mx-auto lg:mx-0">
              {/* Background decoration */}
              <div className="absolute inset-4 bg-[var(--accent)]/10 rounded-2xl -rotate-3 transition-transform duration-700 hover:rotate-0" />
              <div className="absolute inset-4 bg-[var(--background-card)] border border-[var(--border)] rounded-2xl rotate-3 transition-transform duration-700 hover:rotate-0" />

              {/* Main image container */}
              <div className="relative bg-[var(--background-secondary)] border-2 border-[var(--accent)] rounded-2xl overflow-hidden aspect-square shadow-[0_0_30px_rgba(52,211,153,0.3)]">
                <Image
                  src="/pictures/moi.webp"
                  alt="Jean-Baptiste Renart"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 400px"
                  priority
                />
              </div>

              {/* Floating badge */}
              <div
                className={`absolute -bottom-4 -right-4 lg:right-auto lg:-left-4 bg-[var(--background)] border border-[var(--border)] rounded-xl p-4 shadow-xl transition-all duration-700 ${
                  isVisible
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-90"
                }`}
                style={{ transitionDelay: "400ms" }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--accent)]/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t("badge")}</p>
                    <p className="text-xs text-[var(--foreground-secondary)]">{t("badgeSub")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div
            className={`order-1 lg:order-2 transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-12"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <span className="inline-block text-sm font-medium text-[var(--accent)] uppercase tracking-widest mb-4">
              {t("label")}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              {t("title")}
            </h2>

            <div className="space-y-4 text-[var(--foreground-secondary)] leading-relaxed">
              <p>
                {t("paragraph1")} <span className="text-[var(--foreground)] font-medium">{t("paragraph1Highlight")}</span>
              </p>
              <p>
                {t("paragraph2")}
              </p>
              <p className="text-[var(--foreground)] font-medium text-lg">
                {t("paragraph3")} <span className="text-[var(--accent)]">{t("paragraph3Highlight")}</span>
              </p>
            </div>

            {/* Stats or highlights */}
            <div className="grid grid-cols-3 gap-6 mt-10 pt-10 border-t border-[var(--border)]">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={`transition-all duration-700 ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${500 + index * 150}ms` }}
                >
                  <p className="text-3xl font-bold text-[var(--accent)]">{stat.value}</p>
                  <p className="text-sm text-[var(--foreground-secondary)]">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Link to full About page */}
            <Link
              href={`/${locale}/a-propos`}
              className={`inline-flex items-center gap-2 mt-8 text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium transition-all duration-700 group ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "800ms" }}
            >
              {t("learnMore")}
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
