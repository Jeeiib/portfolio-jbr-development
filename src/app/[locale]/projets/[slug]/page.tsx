import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import Navigation from "@/components/ui/Navigation";
import Footer from "@/components/sections/Footer";
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
    title: `${project.title} | JBR Development`,
    description: t(`items.${project.slug}.description`),
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

  // Enable static rendering
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
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-[var(--background)]">
          <div className="section-container">
            {/* Back link */}
            <Link
              href={`/${locale}#projets`}
              className="inline-flex items-center text-[var(--foreground-secondary)] hover:text-[var(--accent)] transition-colors mb-8"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              {t("backToProjects")}
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
              {/* Content */}
              <div className="animate-fade-in-up min-w-0">
                <span className="inline-block text-sm font-medium text-[var(--accent)] uppercase tracking-widest mb-4">
                  {t("projectLabel")}
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-5xl font-bold mb-6 break-words">
                  {project.title}
                </h1>
                <p className="text-xl text-[var(--foreground-secondary)] mb-8 leading-relaxed">
                  {t(`items.${project.slug}.description`)}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-2 text-sm font-medium bg-[var(--accent)]/10 text-[var(--accent)] rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex flex-wrap gap-4">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 bg-[var(--accent)] btn-primary-text font-semibold rounded-lg hover:bg-[var(--accent-hover)] transition-colors"
                    >
                      {t("visitSiteButton")}
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
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 border border-[var(--border)] font-semibold rounded-lg hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      {t("sourceCode")}
                    </a>
                  )}
                </div>
              </div>

              {/* Image */}
              <div className="animate-scale-in">
                <div className="relative aspect-video bg-[var(--background-secondary)] border border-[var(--border)] rounded-2xl overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Description Section */}
        <section className="py-16 md:py-24 bg-[var(--background-secondary)]">
          <div className="section-container">
            <div className="max-w-3xl">
              <h2 className="text-2xl sm:text-3xl font-bold mb-6">
                {t("aboutProject")}
              </h2>
              <p className="text-lg text-[var(--foreground-secondary)] leading-relaxed">
                {t(`items.${project.slug}.fullDescription`)}
              </p>
            </div>
          </div>
        </section>

        {/* Other Projects */}
        {otherProjects.length > 0 && (
          <section className="py-16 md:py-24 bg-[var(--background)]">
            <div className="section-container">
              <h2 className="text-2xl sm:text-3xl font-bold mb-12">
                {t("otherProjects")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {otherProjects.map((otherProject) => (
                  <Link
                    key={otherProject.slug}
                    href={`/${locale}/projets/${otherProject.slug}`}
                    className="group relative bg-[var(--background-card)] border border-[var(--border)] rounded-2xl overflow-hidden card-hover"
                  >
                    <div className="relative aspect-video bg-[var(--background-secondary)] overflow-hidden">
                      <Image
                        src={otherProject.image}
                        alt={otherProject.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-[var(--accent)] transition-colors">
                        {otherProject.title}
                      </h3>
                      <p className="text-[var(--foreground-secondary)] text-sm">
                        {t(`items.${otherProject.slug}.description`)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-[var(--background-secondary)]">
          <div className="section-container text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              {t("ctaTitle")}
            </h2>
            <p className="text-[var(--foreground-secondary)] mb-8 max-w-xl mx-auto">
              {t("ctaDescription")}
            </p>
            <Link
              href={`/${locale}#contact`}
              className="inline-flex items-center px-8 py-4 bg-[var(--accent)] btn-primary-text font-semibold rounded-lg hover:bg-[var(--accent-hover)] transition-colors"
            >
              {t("ctaButton")}
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
