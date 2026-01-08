import { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/ui/Navigation";
import Footer from "@/components/sections/Footer";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { landingPages } from "@/data/landingPages";

interface ServicesPageProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: ServicesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "servicesHub" });

  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: {
      canonical: `https://jbrdevelopment.fr/${locale}/services`,
      languages: {
        "fr-FR": "https://jbrdevelopment.fr/fr/services",
        "en-US": "https://jbrdevelopment.fr/en/services",
      },
    },
  };
}

const icons: Record<string, React.ReactElement> = {
  code: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  globe: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
  ),
  rocket: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
    </svg>
  ),
  layout: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
    </svg>
  ),
};

export default async function ServicesPage({ params }: ServicesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "servicesHub" });

  return (
    <>
      <Navigation />
      <main className="pt-20">
        {/* Hero */}
        <section className="py-16 md:py-24 bg-[var(--background)]">
          <div className="section-container">
            <div className="text-center max-w-3xl mx-auto">
              <span className="inline-block text-sm font-medium text-[var(--accent)] uppercase tracking-widest mb-4">
                {t("label")}
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                {t("title")}
              </h1>
              <p className="text-xl text-[var(--foreground-secondary)] leading-relaxed">
                {t("subtitle")}
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16 md:py-24 bg-[var(--background-secondary)]">
          <div className="section-container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {landingPages.map((page) => (
                <Link
                  key={page.slug}
                  href={`/${locale}/services/${page.slug}`}
                  className="group relative bg-[var(--background)] border border-[var(--border)] rounded-2xl p-8 transition-all duration-300 hover:border-[var(--accent)] hover:-translate-y-1 hover:shadow-lg hover:shadow-[var(--accent)]/10"
                >
                  {/* Icon */}
                  <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] mb-6 group-hover:bg-[var(--accent)] group-hover:text-[var(--background)] transition-all duration-300">
                    {icons[page.icon]}
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl font-bold mb-3 group-hover:text-[var(--accent)] transition-colors">
                    {t(`pages.${page.slug}.title`)}
                  </h2>

                  {/* Description */}
                  <p className="text-[var(--foreground-secondary)] mb-6 leading-relaxed">
                    {t(`pages.${page.slug}.description`)}
                  </p>

                  {/* Arrow */}
                  <div className="flex items-center text-[var(--accent)] font-medium">
                    {t("learnMore")}
                    <svg
                      className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24 bg-[var(--background)]">
          <div className="section-container text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              {t("cta.title")}
            </h2>
            <p className="text-[var(--foreground-secondary)] mb-8 max-w-xl mx-auto">
              {t("cta.description")}
            </p>
            <Link
              href={`/${locale}#contact`}
              className="inline-flex items-center px-8 py-4 bg-[var(--accent)] btn-primary-text font-semibold rounded-lg hover:bg-[var(--accent-hover)] transition-colors"
            >
              {t("cta.button")}
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
