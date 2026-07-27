"use client";

import { projects } from "@/data/projects";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import { useAnalytics } from "@/hooks/useAnalytics";

/**
 * Le mur de preuves : chaque projet livré raconté comme l'histoire d'un
 * patron (problème → livré → résultat), avec l'avis Google réel du client.
 * Toutes les preuves sont visibles d'un coup — pas de carrousel.
 */
export default function Projects() {
  const t = useTranslations("projects");
  const locale = useLocale();
  const { trackEvent } = useAnalytics();
  const featuredProjects = projects.filter((p) => p.featured);

  return (
    <section id="projets" className="py-24 md:py-32">
      <div className="section-container">
        {/* En-tête de section */}
        <Reveal>
          <div className="mb-16 max-w-2xl">
            <p className="annotation-accent mb-4">{t("label")}</p>
            <h2 className="display-xl mb-4">{t("title")}</h2>
            <p className="text-[var(--foreground-secondary)]">{t("subtitle")}</p>
          </div>
        </Reveal>

        {/* Cartes histoires */}
        <div className="flex flex-col gap-16 md:gap-20">
          {featuredProjects.map((p, index) => (
            <Reveal key={p.slug}>
              <article
                className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center ${
                  index % 2 === 1 ? "lg:[direction:rtl]" : ""
                }`}
              >
                {/* Capture dans un cadre navigateur */}
                <Link
                  href={`/${locale}/projets/${p.slug}`}
                  onClick={() => trackEvent("project_view", { slug: p.slug })}
                  className="group block [direction:ltr]"
                >
                  <div className="bg-[var(--background-card)] border border-[var(--border)] rounded-xl overflow-hidden transition-colors group-hover:border-[var(--accent)]">
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-[var(--background-secondary)] border-b border-[var(--border)]">
                      <span className="w-2.5 h-2.5 rounded-full bg-[var(--border)]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[var(--border)]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[var(--border)]" />
                      {p.liveUrl && (
                        <span className="ml-3 font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-[var(--foreground-secondary)] truncate">
                          {p.liveUrl.replace("https://", "").replace("www.", "")}
                        </span>
                      )}
                    </div>
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.02]"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        priority={index === 0}
                      />
                    </div>
                  </div>
                </Link>

                {/* Histoire */}
                <div className="[direction:ltr]">
                  <div className="flex flex-wrap items-center gap-2 mb-5">
                    <span className="tag-chantier">
                      {p.clientName ?? t("ownProduct")}
                    </span>
                    <span className="annotation">{t(`items.${p.slug}.clientRole`)}</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold mb-6">
                    <Link
                      href={`/${locale}/projets/${p.slug}`}
                      onClick={() => trackEvent("project_view", { slug: p.slug })}
                      className="hover:text-[var(--accent)] transition-colors"
                    >
                      {p.title}
                    </Link>
                  </h3>

                  <div className="flex flex-col gap-4 mb-6">
                    <div>
                      <p className="annotation mb-1">{t("problemLabel")}</p>
                      <p className="text-[var(--foreground-secondary)]">
                        {t(`items.${p.slug}.problem`)}
                      </p>
                    </div>
                    <div>
                      <p className="annotation mb-1">{t("deliveredLabel")}</p>
                      <p className="text-[var(--foreground-secondary)]">
                        {t(`items.${p.slug}.delivered`)}
                      </p>
                    </div>
                    <div>
                      <p className="annotation mb-1">{t("resultLabel")}</p>
                      <p className="proof text-base">{t(`items.${p.slug}.result`)}</p>
                    </div>
                  </div>

                  {/* Avis Google réel */}
                  {t(`items.${p.slug}.quote`) !== "" && p.googleReviewUrl && (
                    <blockquote className="border-l-2 border-[var(--accent)] pl-4 mb-6">
                      <p className="text-sm italic text-[var(--foreground-secondary)] mb-2">
                        « {t(`items.${p.slug}.quote`)} »
                      </p>
                      <footer className="flex flex-wrap items-center gap-3 text-sm">
                        <span className="font-semibold">
                          {t(`items.${p.slug}.quoteAuthor`)}
                        </span>
                        <a
                          href={p.googleReviewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() =>
                            trackEvent("google_review_click", { from: `project-${p.slug}` })
                          }
                          className="annotation-accent hover:opacity-80 transition-opacity"
                        >
                          {t("viewReview")} →
                        </a>
                      </footer>
                    </blockquote>
                  )}

                  <Link
                    href={`/${locale}/projets/${p.slug}`}
                    onClick={() => trackEvent("project_view", { slug: p.slug })}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
                  >
                    {t("viewProject")}
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
