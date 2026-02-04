"use client";

import { useState, useEffect } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useTranslations } from "next-intl";

const testimonialKeys = ["nicolas", "thierry", "corinne"] as const;

export default function Testimonial() {
  const t = useTranslations("testimonial");
  const { ref: sectionRef, isVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.2 });
  const [starsBreathe, setStarsBreathe] = useState(false);

  // Lance la respiration après que toutes les étoiles soient apparues
  useEffect(() => {
    if (isVisible && !starsBreathe) {
      const delay = 800 + (4 * 200) + 500;
      const timer = setTimeout(() => setStarsBreathe(true), delay);
      return () => clearTimeout(timer);
    }
  }, [isVisible, starsBreathe]);

  return (
    <section
      ref={sectionRef}
      className="py-24 md:py-32 bg-[var(--background)] relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--accent)]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--accent)]/5 rounded-full blur-3xl" />

      <div className="section-container relative z-10">
        {/* Section Header */}
        <div
          className={`text-center mb-12 transition-all duration-700 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <span className="inline-block text-sm font-medium text-[var(--accent)] uppercase tracking-widest mb-4">
            {t("label")}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            {t("title")}
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonialKeys.map((key, index) => (
            <div
              key={key}
              className={`transition-all duration-1000 ${
                isVisible
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95"
              }`}
              style={{ transitionDelay: `${200 + index * 150}ms` }}
            >
              <div className="relative bg-[var(--background)] border border-[var(--border)] rounded-2xl p-6 md:p-8 h-full flex flex-col shadow-lg shadow-black/10">
                {/* Quote mark */}
                <div
                  className={`absolute -top-5 left-6 md:left-8 transition-all duration-700 ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 -translate-y-4"
                  }`}
                  style={{ transitionDelay: `${400 + index * 150}ms` }}
                >
                  <div className="w-10 h-10 bg-[var(--accent)] rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-[var(--background)]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>
                </div>

                {/* Quote text */}
                <blockquote className="text-base md:text-lg leading-relaxed mb-6 pt-4 flex-grow">
                  <p className="text-[var(--foreground)]">
                    &ldquo;{t(`items.${key}.quote`)}{" "}
                    <span className="text-[var(--accent)] font-medium">{t(`items.${key}.quoteHighlight`)}</span>&rdquo;
                  </p>
                </blockquote>

                {/* Author */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-[var(--background-secondary)] border border-[var(--border)] flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-[var(--accent)]">
                        {t(`items.${key}.initials`)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{t(`items.${key}.author`)}</p>
                      <p className="text-xs text-[var(--foreground-secondary)]">
                        {t(`items.${key}.role`)}
                      </p>
                    </div>
                  </div>

                  {/* Stars and Google link */}
                  <div className="flex items-center gap-3">
                    {/* Stars */}
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 text-yellow-400 transition-all duration-500 ${
                            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-0"
                          }`}
                          style={{
                            transitionDelay: `${800 + index * 100 + i * 100}ms`,
                            animation: starsBreathe ? "starBreathe 1.5s ease-in-out forwards" : "none",
                          }}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>

                    {/* Google link */}
                    <a
                      href={t(`items.${key}.link`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-[var(--foreground-secondary)] hover:text-[var(--accent)] transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                      {t("viewOnGoogle")}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
