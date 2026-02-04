"use client";

import { projects } from "@/data/projects";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useRef, useState, useCallback, useEffect } from "react";

export default function Projects() {
  const t = useTranslations("projects");
  const { trackProjectView, trackExternalLink } = useAnalytics();
  const featuredProjects = projects.filter((p) => p.featured);
  const total = featuredProjects.length;
  const { ref: sectionRef, isVisible } =
    useScrollAnimation<HTMLElement>({ threshold: 0.15 });

  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goTo = useCallback((index: number) => {
    setCurrent(index);
  }, []);

  // Auto-play — restarts on every slide change, pauses on hover/touch
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [isPaused, current, next]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev]);

  // Touch swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = touchStartX.current - e.changedTouches[0].clientX;
    const dy = touchStartY.current - e.changedTouches[0].clientY;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      dx > 0 ? next() : prev();
    }
    setIsPaused(false);
  };

  const ArrowButton = ({
    direction,
    className = "",
  }: {
    direction: "left" | "right";
    className?: string;
  }) => (
    <button
      onClick={direction === "left" ? prev : next}
      className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[var(--background)]/80 backdrop-blur-sm border border-[var(--border)] flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-[var(--accent)] hover:border-[var(--accent)] hover:text-[var(--accent-foreground)] hover:scale-110 ${className}`}
      aria-label={direction === "left" ? "Projet précédent" : "Projet suivant"}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d={direction === "left" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
        />
      </svg>
    </button>
  );

  return (
    <section
      id="projets"
      ref={sectionRef}
      className="py-24 md:py-32 bg-[var(--background)]"
    >
      {/* Section Header */}
      <div className="section-container">
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
      </div>

      {/* Carousel with side arrows on desktop */}
      <div
        className={`transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
        style={{ transitionDelay: "200ms" }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="flex items-center gap-4 lg:gap-6 max-w-[1400px] mx-auto px-4 sm:px-6">
          {/* Left Arrow — desktop only */}
          <div className="hidden lg:block shrink-0">
            <ArrowButton direction="left" />
          </div>

          {/* Slide Container */}
          <div className="flex-1 min-w-0">
            <div
              className="overflow-hidden rounded-2xl"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="flex transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
                style={{ transform: `translateX(-${current * 100}%)` }}
              >
                {featuredProjects.map((p, index) => (
                  <div key={p.slug} className="w-full shrink-0 px-1">
                    <div className="bg-[var(--background-card)] border border-[var(--border)] rounded-2xl overflow-hidden lg:h-[500px]">
                      <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] h-full">
                        {/* Browser Mockup + Image */}
                        <Link
                          href={`/projets/${p.slug}`}
                          className="flex flex-col overflow-hidden bg-[var(--terminal-bg)] group h-full"
                          onClick={() => trackProjectView(p.slug)}
                        >
                          {/* Browser Chrome */}
                          <div className="shrink-0 bg-[var(--terminal-header)] px-4 py-2.5 flex items-center gap-2 border-b border-[var(--border)]">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                            <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                            <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                            {p.liveUrl && (
                              <div className="flex-1 mx-4">
                                <span className="block max-w-[220px] mx-auto text-[11px] text-[var(--foreground-secondary)] text-center bg-[var(--background-secondary)]/50 rounded-md px-3 py-0.5 truncate">
                                  {p.liveUrl.replace("https://", "").replace("www.", "")}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Screenshot */}
                          <div className="relative aspect-[16/10] lg:aspect-auto lg:flex-1 overflow-hidden">
                            <Image
                              src={p.image}
                              alt={p.title}
                              fill
                              className="object-cover object-top group-hover:scale-[1.02] transition-transform duration-700"
                              sizes="(max-width: 1024px) 100vw, 55vw"
                              priority={index === 0}
                            />
                          </div>
                        </Link>

                        {/* Content */}
                        <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center overflow-hidden">
                          <span className="text-xs font-mono text-[var(--foreground-secondary)] tracking-[0.2em] mb-4 lg:mb-6">
                            {String(index + 1).padStart(2, "0")} /{" "}
                            {String(total).padStart(2, "0")}
                          </span>

                          <Link
                            href={`/projets/${p.slug}`}
                            onClick={() => trackProjectView(p.slug)}
                          >
                            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 hover:text-[var(--accent)] transition-colors">
                              {p.title}
                            </h3>
                          </Link>

                          <p className="text-[var(--foreground-secondary)] mb-6 leading-relaxed text-sm sm:text-base line-clamp-4 lg:line-clamp-5">
                            {t(`items.${p.slug}.fullDescription`)}
                          </p>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mb-6 lg:mb-8">
                            {p.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-3 py-1 text-xs font-medium bg-[var(--accent)]/10 text-[var(--accent)] rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          {/* Links */}
                          <div className="flex flex-wrap items-center gap-3">
                            <Link
                              href={`/projets/${p.slug}`}
                              className="inline-flex items-center px-5 py-2.5 sm:px-6 sm:py-3 bg-[var(--accent)] btn-primary-text font-semibold rounded-lg hover:bg-[var(--accent-hover)] transition-colors text-sm"
                              onClick={() => trackProjectView(p.slug)}
                            >
                              {t("viewProject")}
                              <svg
                                className="ml-2 w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                                />
                              </svg>
                            </Link>
                            {p.liveUrl && (
                              <a
                                href={p.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-5 py-2.5 sm:px-6 sm:py-3 border border-[var(--border)] rounded-lg text-sm font-medium hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
                                onClick={() => trackExternalLink(p.liveUrl!)}
                              >
                                <svg
                                  className="w-4 h-4 mr-2"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                  />
                                </svg>
                                {t("visitSite")}
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Arrow — desktop only */}
          <div className="hidden lg:block shrink-0">
            <ArrowButton direction="right" />
          </div>
        </div>

        {/* Bottom controls: arrows (mobile) + dots */}
        <div className="flex justify-center items-center gap-4 mt-8">
          {/* Left Arrow — mobile only */}
          <div className="lg:hidden">
            <ArrowButton direction="left" />
          </div>

          {/* Dots with progress */}
          <div className="flex items-center gap-3">
            {featuredProjects.map((_, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                className={`relative h-2 rounded-full cursor-pointer transition-all duration-500 overflow-hidden ${
                  current === index
                    ? "w-10 bg-[var(--accent)]/20"
                    : "w-2 bg-[var(--border)] hover:bg-[var(--foreground-secondary)]"
                }`}
                aria-label={`Aller au projet ${index + 1}`}
              >
                {current === index && (
                  <span
                    key={`${current}-${isPaused}`}
                    className="absolute inset-0 bg-[var(--accent)] rounded-full"
                    style={{
                      transformOrigin: "left",
                      animation: isPaused
                        ? "none"
                        : "carousel-progress 6s linear forwards",
                      transform: isPaused ? "scaleX(1)" : undefined,
                    }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Right Arrow — mobile only */}
          <div className="lg:hidden">
            <ArrowButton direction="right" />
          </div>
        </div>
      </div>
    </section>
  );
}
