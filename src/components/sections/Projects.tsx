"use client";

import { projects } from "@/data/projects";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { useAnalytics } from "@/hooks/useAnalytics";

export default function Projects() {
  const t = useTranslations("projects");
  const { trackProjectView, trackExternalLink } = useAnalytics();
  const featuredProjects = projects.filter((p) => p.featured);
  const { ref: sectionRef, isVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.15 });

  return (
    <section
      id="projets"
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

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {featuredProjects.map((project, index) => (
            <div
              key={project.slug}
              className={`transition-[opacity,transform] duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${150 + index * 150}ms` }}
            >
            <div className="group relative bg-[var(--background-card)] border border-[var(--border)] rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-300 hover:border-[var(--accent)] hover:-translate-y-1">
              {/* Project Image - Clickable to project page */}
              <Link href={`/projets/${project.slug}`} className="relative aspect-video bg-[var(--background-secondary)] overflow-hidden block" onClick={() => trackProjectView(project.slug)}>
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-[var(--accent)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>

              {/* Project Content */}
              <div className="p-6 flex flex-col flex-grow">
                <Link href={`/projets/${project.slug}`} onClick={() => trackProjectView(project.slug)}>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-[var(--accent)] transition-colors">
                    {project.title}
                  </h3>
                </Link>
                <p className="text-[var(--foreground-secondary)] text-sm mb-4 line-clamp-2">
                  {t(`items.${project.slug}.description`)}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs font-medium bg-[var(--accent)]/10 text-[var(--accent)] rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Links - pushed to bottom */}
                <div className="flex items-center gap-4 pt-4 border-t border-[var(--border)] mt-auto">
                  <Link
                    href={`/projets/${project.slug}`}
                    className="inline-flex items-center text-sm font-medium text-[var(--accent)]"
                    onClick={() => trackProjectView(project.slug)}
                  >
                    {t("viewProject")}
                    <svg
                      className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1"
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
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-[var(--foreground-secondary)] hover:text-[var(--accent)] transition-colors"
                      onClick={() => trackExternalLink(project.liveUrl!)}
                    >
                      <svg
                        className="w-4 h-4 mr-1"
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
          ))}
        </div>
      </div>
    </section>
  );
}
