import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import Navigation from "@/components/ui/Navigation";
import Footer from "@/components/sections/Footer";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import AboutTimeline from "@/components/about/AboutTimeline";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiNodedotjs,
  SiSpringboot,
  SiPostgresql,
  SiSupabase,
  SiGit,
  SiVercel,
  SiVuedotjs,
} from "react-icons/si";
import { FaJava } from "react-icons/fa";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "aboutPage" });

  return {
    title: t("meta.title"),
    description: t("meta.description"),
    keywords: [
      "Jean-Baptiste Renart",
      "développeur web Lille",
      "freelance React",
      "développeur Next.js",
      "JBR Development",
    ],
    alternates: {
      canonical: `https://jbrdevelopment.fr/${locale}/a-propos`,
      languages: {
        "fr-FR": "https://jbrdevelopment.fr/fr/a-propos",
        "en-US": "https://jbrdevelopment.fr/en/a-propos",
      },
    },
  };
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "aboutPage" });

  // Schema.org Person - Safe: all content from static translation files
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Jean-Baptiste Renart",
    jobTitle: t("schema.jobTitle"),
    description: t("schema.description"),
    url: "https://jbrdevelopment.fr",
    image: "https://jbrdevelopment.fr/pictures/moi.webp",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Lambersart",
      addressRegion: "Hauts-de-France",
      addressCountry: "FR",
    },
    sameAs: [
      "https://www.linkedin.com/in/jean-baptiste-renart-46b618153/",
      "https://github.com/Jeeiib",
    ],
    worksFor: {
      "@type": "Organization",
      name: "JBR Development",
      url: "https://jbrdevelopment.fr",
    },
    knowsAbout: [
      "React",
      "Next.js",
      "TypeScript",
      "Node.js",
      "Web Development",
      "JavaScript",
    ],
  };

  const skills = [
    { name: "React", icon: <SiReact className="w-8 h-8" />, color: "#61DAFB" },
    { name: "Next.js", icon: <SiNextdotjs className="w-8 h-8" />, color: "var(--foreground)" },
    { name: "TypeScript", icon: <SiTypescript className="w-8 h-8" />, color: "#3178C6" },
    { name: "Node.js", icon: <SiNodedotjs className="w-8 h-8" />, color: "#339933" },
    { name: "Java", icon: <FaJava className="w-8 h-8" />, color: "#ED8B00" },
    { name: "Spring Boot", icon: <SiSpringboot className="w-8 h-8" />, color: "#6DB33F" },
    { name: "PostgreSQL", icon: <SiPostgresql className="w-8 h-8" />, color: "#4169E1" },
    { name: "Supabase", icon: <SiSupabase className="w-8 h-8" />, color: "#3FCF8E" },
    { name: "Git", icon: <SiGit className="w-8 h-8" />, color: "#F05032" },
    { name: "Vercel", icon: <SiVercel className="w-8 h-8" />, color: "var(--foreground)" },
    { name: "React Native", icon: <SiReact className="w-8 h-8" />, color: "#61DAFB" },
    { name: "Vue.js", icon: <SiVuedotjs className="w-8 h-8" />, color: "#4FC08D" },
  ];

  const approaches = [
    {
      key: "ecoute",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
    {
      key: "exigence",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
    },
    {
      key: "reactivite",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <Script
        id="person-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <Navigation />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-[var(--background)] relative overflow-hidden">
          <div className="section-container relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Photo */}
              <div className="relative order-2 lg:order-1">
                <div className="relative aspect-square max-w-md mx-auto lg:mx-0">
                  {/* Background decoration */}
                  <div className="absolute inset-4 bg-[var(--accent)]/10 rounded-2xl -rotate-3 transition-transform duration-700 hover:rotate-0" />
                  <div className="absolute inset-4 bg-[var(--background-card)] border border-[var(--border)] rounded-2xl rotate-3 transition-transform duration-700 hover:rotate-0" />

                  {/* Main image */}
                  <div className="relative bg-[var(--background-secondary)] border border-[var(--border)] rounded-2xl overflow-hidden aspect-square">
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
                  <div className="absolute -bottom-4 -right-4 lg:right-auto lg:-left-4 bg-[var(--background)] border border-[var(--accent)] rounded-xl p-4 shadow-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[var(--accent)]/20 flex items-center justify-center">
                        <span className="text-[var(--accent)] text-lg">★</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{t("hero.badge")}</p>
                        <p className="text-xs text-[var(--foreground-secondary)]">{t("hero.badgeSub")}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="order-1 lg:order-2">
                <span className="annotation-accent block mb-4">{t("hero.label")}</span>
                <h1 className="display-xl mb-6">Jean-Baptiste Renart</h1>
                <p className="text-xl text-[var(--foreground-secondary)] mb-4">
                  {t("hero.subtitle")}
                </p>
                <p className="text-lg text-[var(--foreground-secondary)] mb-8 leading-relaxed">
                  {t("hero.description")}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 mb-8">
                  <div>
                    <p className="text-3xl font-bold text-[var(--accent)]">5★</p>
                    <p className="text-sm text-[var(--foreground-secondary)]">{t("hero.stats.reviews")}</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-[var(--accent)]">100%</p>
                    <p className="text-sm text-[var(--foreground-secondary)]">{t("hero.stats.satisfaction")}</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-[var(--accent)]">24h</p>
                    <p className="text-sm text-[var(--foreground-secondary)]">{t("hero.stats.response")}</p>
                  </div>
                </div>

                {/* Social links */}
                <div className="flex items-center gap-4">
                  <a
                    href="https://www.linkedin.com/in/jean-baptiste-renart-46b618153/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--border)] rounded-lg hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    LinkedIn
                  </a>
                  <a
                    href="https://github.com/Jeeiib"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--border)] rounded-lg hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-16 md:py-24 bg-[var(--background-secondary)] relative overflow-hidden">
          <div className="section-container relative z-10">
            <div className="text-center mb-12">
              <span className="inline-block text-sm font-medium text-[var(--accent)] uppercase tracking-widest mb-4">
                {t("timeline.label")}
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                {t("timeline.title")}
              </h2>
              <p className="text-[var(--foreground-secondary)] max-w-2xl mx-auto">
                {t("timeline.subtitle")}
              </p>
            </div>

            <AboutTimeline locale={locale} />
          </div>
        </section>

        {/* Approach Section */}
        <section className="py-16 md:py-24 bg-[var(--background)]">
          <div className="section-container">
            <div className="text-center mb-12">
              <span className="inline-block text-sm font-medium text-[var(--accent)] uppercase tracking-widest mb-4">
                {t("approach.label")}
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold">
                {t("approach.title")}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {approaches.map((approach) => (
                <div
                  key={approach.key}
                  className="group p-8 bg-[var(--background-card)] border border-[var(--border)] rounded-2xl transition-all duration-300 hover:border-[var(--accent)] hover:-translate-y-2"
                >
                  <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] mb-6 group-hover:bg-[var(--accent)] group-hover:text-[var(--background)] transition-all duration-300">
                    {approach.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-[var(--accent)] transition-colors">
                    {t(`approach.items.${approach.key}.title`)}
                  </h3>
                  <p className="text-[var(--foreground-secondary)] leading-relaxed">
                    {t(`approach.items.${approach.key}.description`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stack Section */}
        <section className="py-16 md:py-24 bg-[var(--background-secondary)]">
          <div className="section-container">
            <div className="text-center mb-12">
              <span className="inline-block text-sm font-medium text-[var(--accent)] uppercase tracking-widest mb-4">
                {t("stack.label")}
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold">
                {t("stack.title")}
              </h2>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 max-w-4xl mx-auto">
              {skills.map((skill) => (
                <div
                  key={skill.name}
                  className="group flex flex-col items-center gap-3 p-4 bg-[var(--background)] border border-[var(--border)] rounded-xl hover:border-[var(--accent)] hover:bg-[var(--accent)]/5 transition-all duration-300"
                >
                  <div
                    className="transition-transform duration-300 group-hover:scale-110"
                    style={{ color: skill.color }}
                  >
                    {skill.icon}
                  </div>
                  <span className="text-xs font-medium text-center">
                    {skill.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-[var(--background)]">
          <div className="section-container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                {t("cta.title")}
              </h2>
              <p className="text-lg text-[var(--foreground-secondary)] mb-8">
                {t("cta.description")}
              </p>
              <Link
                href={`/${locale}#contact`}
                className="inline-flex items-center justify-center px-8 py-4 bg-[var(--accent)] btn-primary-text font-semibold rounded-lg hover:bg-[var(--accent-hover)] transition-colors"
              >
                {t("cta.button")}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
