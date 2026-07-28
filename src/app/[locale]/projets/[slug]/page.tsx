import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import Navigation from "@/components/ui/Navigation";
import Footer from "@/components/sections/Footer";
import BriefCTA from "@/components/ui/BriefCTA";
import Link from "next/link";
import Image from "next/image";
import { routing } from "@/i18n/routing";
import { getTranslations, setRequestLocale } from "next-intl/server";

interface ProjectPageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];

  for (const locale of routing.locales) {
    for (const project of projects) {
      params.push({ locale, slug: project.slug });
    }
  }

  return params;
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug, locale } = await params;
  const project = projects.find((p) => p.slug === slug);
  const t = await getTranslations({ locale, namespace: "projects" });

  if (!project) {
    return { title: t("notFoundTitle") };
  }

  return {
    title: `${project.title} — ${t(`items.${project.slug}.description`)}`,
    description: `${t(`items.${project.slug}.delivered`)} ${t(`items.${project.slug}.result`)}`,
    alternates: {
      canonical: `https://jbrdevelopment.fr/${locale}/projets/${slug}`,
      languages: {
        "fr-FR": `https://jbrdevelopment.fr/fr/projets/${slug}`,
        "en-US": `https://jbrdevelopment.fr/en/projets/${slug}`,
      },
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  const project = projects.find((p) => p.slug === slug);
  const t = await getTranslations({ locale, namespace: "projects" });

  if (!project) {
    notFound();
  }

  const otherProjects = projects.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <>
      <Navigation />
      <main className="pt-28 md:pt-32">
        {/* En-tête histoire */}
        <section className="section-container mb-16">
          <Link
            href={`/${locale}#projets`}
            className="annotation inline-flex items-center gap-2 hover:text-[var(--accent)] transition-colors mb-10"
          >
            <span aria-hidden="true">←</span>
            {t("backToProjects")}
          </Link>

          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className="tag-chantier">{project.clientName ?? t("ownProduct")}</span>
            <span className="annotation">{t(`items.${project.slug}.clientRole`)}</span>
          </div>

          <h1 className="display-xl mb-6 max-w-3xl break-words">{project.title}</h1>

          <div className="flex flex-wrap gap-4 mb-12">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold border border-[var(--border)] rounded-lg hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
              >
                {t("visitOnlineSite")}
                <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>

          {/* Capture dans un cadre navigateur */}
          <div className="bg-[var(--background-card)] border border-[var(--border)] rounded-xl overflow-hidden max-w-4xl">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-[var(--background-secondary)] border-b border-[var(--border)]">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--border)]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--border)]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--border)]" />
              {project.liveUrl && (
                <span className="ml-3 font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-[var(--foreground-secondary)] truncate">
                  {project.liveUrl.replace("https://", "").replace("www.", "")}
                </span>
              )}
            </div>
            <div className="relative aspect-[16/10]">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 896px"
                priority
              />
            </div>
          </div>
        </section>

        {/* L'histoire en trois temps */}
        <section className="section-container mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
            <div>
              <p className="annotation mb-2">{t("problemLabel")}</p>
              <p className="text-[var(--foreground-secondary)] leading-relaxed">
                {t(`items.${project.slug}.problem`)}
              </p>
            </div>
            <div>
              <p className="annotation mb-2">{t("deliveredLabel")}</p>
              <p className="text-[var(--foreground-secondary)] leading-relaxed">
                {t(`items.${project.slug}.delivered`)}
              </p>
            </div>
            <div>
              <p className="annotation mb-2">{t("resultLabel")}</p>
              <p className="proof leading-relaxed">{t(`items.${project.slug}.result`)}</p>
            </div>
          </div>
        </section>

        {/* Détail complet */}
        <section className="section-container mb-16">
          <div className="max-w-3xl">
            <p className="annotation mb-3">{t("aboutProject")}</p>
            <p className="text-[var(--foreground-secondary)] leading-relaxed mb-8">
              {t(`items.${project.slug}.fullDescription`)}
            </p>

            <p className="annotation mb-3">{t("techStack")}</p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="tag-chantier">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Avis Google réel */}
        {t(`items.${project.slug}.quote`) !== "" && project.googleReviewUrl && (
          <section className="section-container mb-16">
            <blockquote className="border-l-2 border-[var(--accent)] pl-6 max-w-3xl">
              <p className="text-lg italic text-[var(--foreground-secondary)] mb-3">
                « {t(`items.${project.slug}.quote`)} »
              </p>
              <footer className="flex flex-wrap items-center gap-3 text-sm">
                <span className="font-semibold">{t(`items.${project.slug}.quoteAuthor`)}</span>
                <a
                  href={project.googleReviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="annotation-accent hover:opacity-80 transition-opacity"
                >
                  {t("viewReview")} →
                </a>
              </footer>
            </blockquote>
          </section>
        )}

        {/* Autres projets */}
        <section className="section-container mb-8">
          <p className="annotation mb-6">{t("otherProjects")}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl">
            {otherProjects.map((p) => (
              <Link
                key={p.slug}
                href={`/${locale}/projets/${p.slug}`}
                className="group bg-[var(--background-card)] border border-[var(--border)] rounded-xl p-6 hover:border-[var(--accent)] transition-colors"
              >
                <p className="font-bold mb-1 group-hover:text-[var(--accent)] transition-colors">
                  {p.title}
                </p>
                <p className="text-sm text-[var(--foreground-secondary)]">
                  {t(`items.${p.slug}.description`)}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <BriefCTA from={`projet-${project.slug}`} />
      </main>
      <Footer />
    </>
  );
}
