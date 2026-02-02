"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

interface AboutTimelineProps {
  locale: string;
}

interface TimelineItemData {
  key: string;
  position: "left" | "right";
  icon: React.ReactNode;
}

export default function AboutTimeline({ locale }: AboutTimelineProps) {
  const t = useTranslations("aboutPage.timeline");
  const timelineRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const [parallelVisible, setParallelVisible] = useState(false);

  const timelineItems: TimelineItemData[] = [
    {
      key: "marriott",
      position: "left",
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
    },
    {
      key: "narcisse",
      position: "right",
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      ),
    },
    {
      key: "formation",
      position: "left",
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = entry.target.getAttribute("data-index");
            if (index !== null) {
              if (index === "parallel") {
                setParallelVisible(true);
              } else {
                setVisibleItems((prev) => new Set(prev).add(parseInt(index)));
              }
            }
          }
        });
      },
      { threshold: 0.5, rootMargin: "0px 0px -150px 0px" }
    );

    const items = timelineRef.current?.querySelectorAll("[data-index]");
    items?.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  // Update progress line based on visible items
  useEffect(() => {
    if (progressRef.current) {
      const totalItems = timelineItems.length + 1; // +1 for parallel section
      const visibleCount = visibleItems.size + (parallelVisible ? 1 : 0);
      const progress = (visibleCount / totalItems) * 100;
      progressRef.current.style.height = `${progress}%`;
    }
  }, [visibleItems, parallelVisible, timelineItems.length]);

  return (
    <div ref={timelineRef} className="timeline-container relative py-12">
      {/* Timeline line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 bg-gradient-to-b from-transparent via-[var(--border)] to-transparent" />

      {/* Progress line */}
      <div
        ref={progressRef}
        className="absolute left-1/2 top-0 w-[3px] -translate-x-1/2 bg-gradient-to-b from-[var(--accent)] to-[var(--accent-hover)] transition-[height] duration-1000 ease-out rounded-sm"
        style={{
          height: "0%",
          boxShadow: "0 0 20px var(--accent), 0 0 40px var(--accent)"
        }}
      />

      {/* Timeline items */}
      {timelineItems.map((item, index) => (
        <div
          key={item.key}
          data-index={index}
          className={`timeline-item relative flex items-center mb-16 transition-all duration-1000 ease-out ${
            item.position === "left" ? "justify-start" : "justify-end"
          } ${
            visibleItems.has(index)
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          {/* Dot */}
          <div
            className={`timeline-dot absolute left-1/2 w-5 h-5 -translate-x-1/2 rounded-full border-[3px] z-10 transition-all duration-400 ${
              visibleItems.has(index)
                ? "border-[var(--accent)] bg-[var(--accent)]"
                : "border-[var(--border)] bg-[var(--background)]"
            }`}
          >
            {visibleItems.has(index) && (
              <>
                <span className="absolute inset-[-8px] border-2 border-[var(--accent)] rounded-full animate-ripple" />
                <span className="absolute inset-[-8px] border-2 border-[var(--accent)] rounded-full animate-ripple delay-500" />
              </>
            )}
          </div>

          {/* Connector */}
          <div
            className={`timeline-connector absolute top-1/2 h-[2px] -translate-y-1/2 transition-all duration-500 ${
              item.position === "left"
                ? "right-1/2 w-10 mr-[10px]"
                : "left-1/2 w-10 ml-[10px]"
            } ${
              visibleItems.has(index)
                ? "bg-[var(--accent)] shadow-[0_0_10px_var(--accent)]"
                : "bg-[var(--border)]"
            }`}
          />

          {/* Content card */}
          <div
            className={`timeline-content w-[calc(50%-60px)] p-7 bg-[var(--background-card)] border rounded-2xl transition-all duration-400 relative overflow-hidden group ${
              visibleItems.has(index)
                ? "border-[rgba(52,211,153,0.3)] shadow-[0_4px_30px_rgba(52,211,153,0.1)]"
                : "border-[var(--border)]"
            } hover:-translate-y-1.5 hover:border-[var(--accent)] hover:shadow-[0_20px_50px_rgba(52,211,153,0.2)]`}
          >
            {/* Hover gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)] to-transparent opacity-0 group-hover:opacity-[0.03] transition-opacity duration-400" />

            {/* Icon */}
            <div className="relative w-12 h-12 flex items-center justify-center rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] mb-4 transition-all duration-300 group-hover:bg-[var(--accent)] group-hover:text-[var(--background)] group-hover:scale-110">
              <div className="w-6 h-6">{item.icon}</div>
            </div>

            {/* Year badge */}
            <span className="inline-block text-xs font-semibold text-[var(--accent)] mb-2 px-2.5 py-1 bg-[var(--accent)]/10 rounded-full">
              {t(`items.${item.key}.year`)}
            </span>

            {/* Title */}
            <h3 className="relative text-lg font-semibold mb-3">
              {t(`items.${item.key}.title`)}
            </h3>

            {/* Description */}
            <p className="relative text-sm text-[var(--foreground-secondary)] leading-relaxed">
              {t(`items.${item.key}.description`)}
            </p>
          </div>
        </div>
      ))}

      {/* Parallel section */}
      <div
        data-index="parallel"
        className={`timeline-parallel relative pt-[50px] mb-16 transition-all duration-1000 ease-out ${
          parallelVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        {/* Label */}
        <span className="absolute left-1/2 top-0 -translate-x-1/2 text-xs font-semibold text-[var(--accent)] px-3.5 py-1.5 bg-[var(--background)] border border-[var(--accent)] rounded-full whitespace-nowrap z-20">
          {t("items.parallel.year")}
        </span>

        {/* Center dot */}
        <div
          className={`absolute left-1/2 top-1/2 w-5 h-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] z-10 transition-all duration-400 ${
            parallelVisible
              ? "border-[var(--accent)] bg-[var(--accent)]"
              : "border-[var(--border)] bg-[var(--background)]"
          }`}
        >
          {parallelVisible && (
            <>
              <span className="absolute inset-[-8px] border-2 border-[var(--accent)] rounded-full animate-ripple" />
              <span className="absolute inset-[-8px] border-2 border-[var(--accent)] rounded-full animate-ripple delay-500" />
            </>
          )}
        </div>

        {/* Left connector */}
        <div
          className={`absolute top-1/2 left-[calc(50%-10px)] w-10 h-[2px] -translate-y-1/2 -translate-x-full transition-all duration-500 ${
            parallelVisible
              ? "bg-[var(--accent)] shadow-[0_0_10px_var(--accent)]"
              : "bg-[var(--border)]"
          }`}
        />

        {/* Right connector */}
        <div
          className={`absolute top-1/2 left-[calc(50%+10px)] w-10 h-[2px] -translate-y-1/2 transition-all duration-500 ${
            parallelVisible
              ? "bg-[var(--accent)] shadow-[0_0_10px_var(--accent)]"
              : "bg-[var(--border)]"
          }`}
        />

        {/* Parallel cards */}
        <div className="flex justify-between items-stretch">
          {/* Jay card */}
          <div
            className={`timeline-content w-[calc(50%-60px)] p-7 bg-[var(--background-card)] border rounded-2xl transition-all duration-400 relative overflow-hidden group ${
              parallelVisible
                ? "border-[rgba(52,211,153,0.3)] shadow-[0_4px_30px_rgba(52,211,153,0.1)]"
                : "border-[var(--border)]"
            } hover:-translate-y-1.5 hover:border-[var(--accent)] hover:shadow-[0_20px_50px_rgba(52,211,153,0.2)]`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)] to-transparent opacity-0 group-hover:opacity-[0.03] transition-opacity duration-400" />

            <div className="relative w-12 h-12 flex items-center justify-center rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] mb-4 transition-all duration-300 group-hover:bg-[var(--accent)] group-hover:text-[var(--background)] group-hover:scale-110">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>

            <span className="inline-block text-xs font-semibold text-[var(--accent)] mb-2 px-2.5 py-1 bg-[var(--accent)]/10 rounded-full">
              {t("items.jay.badge")}
            </span>

            <h3 className="relative text-lg font-semibold mb-3">
              {t("items.jay.title")}
            </h3>

            <p className="relative text-sm text-[var(--foreground-secondary)] leading-relaxed">
              {t("items.jay.description")}
            </p>
          </div>

          {/* Freelance card */}
          <div
            className={`timeline-content w-[calc(50%-60px)] p-7 bg-[var(--background-card)] border rounded-2xl transition-all duration-400 relative overflow-hidden group ${
              parallelVisible
                ? "border-[rgba(52,211,153,0.3)] shadow-[0_4px_30px_rgba(52,211,153,0.1)]"
                : "border-[var(--border)]"
            } hover:-translate-y-1.5 hover:border-[var(--accent)] hover:shadow-[0_20px_50px_rgba(52,211,153,0.2)]`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)] to-transparent opacity-0 group-hover:opacity-[0.03] transition-opacity duration-400" />

            <div className="relative w-12 h-12 flex items-center justify-center rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] mb-4 transition-all duration-300 group-hover:bg-[var(--accent)] group-hover:text-[var(--background)] group-hover:scale-110">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>

            <span className="inline-block text-xs font-semibold text-[var(--accent)] mb-2 px-2.5 py-1 bg-[var(--accent)]/10 rounded-full">
              {t("items.freelance.badge")}
            </span>

            <h3 className="relative text-lg font-semibold mb-3">
              {t("items.freelance.title")}
            </h3>

            <p className="relative text-sm text-[var(--foreground-secondary)] leading-relaxed">
              {t("items.freelance.description")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
