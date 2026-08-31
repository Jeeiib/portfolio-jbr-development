import { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/ui/Navigation";
import Footer from "@/components/sections/Footer";
import ContactForm from "@/components/ui/ContactForm";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { landingFAQs, whyChooseMe, featureOffer } from "@/data/landingPages";
import { siteConfig } from "@/data/siteConfig";
import BriefCTA from "@/components/ui/BriefCTA";
import { formatPrice } from "@/lib/formatPrice";
import LandingFAQ from "@/components/landing/LandingFAQ";

interface PageProps {
  params: Promise<{ locale: string }>;
}

const SLUG = "freelance-react-nextjs";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "landing" });

  return {
    title: t(`${SLUG}.meta.title`),
    description: t(`${SLUG}.meta.description`),
    keywords: [
      "freelance React",
      "développeur Next.js",
      "freelance Next.js France",
      "développeur React freelance",
      "expert React",
      "développeur frontend freelance",
    ],
    alternates: {
      canonical: `https://jbrdevelopment.fr/${locale}/services/${SLUG}`,
      languages: {
        "fr-FR": `https://jbrdevelopment.fr/fr/services/${SLUG}`,
        "en-US": `https://jbrdevelopment.fr/en/services/${SLUG}`,
      },
    },
  };
}

const whyIcons: Record<string, React.ReactElement> = {
  mapPin: (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>),
  user: (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>),
  zap: (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>),
  piggyBank: (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>),
  compass: (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>),
  cpu: (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>),
};

const serviceIcons: Record<string, React.ReactElement> = {
  globe: (<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>),
  layout: (<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>),
  rocket: (<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /></svg>),
};

export default async function FreelanceReactNextjsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "landing" });
  const tCommon = await getTranslations({ locale, namespace: "landingCommon" });
  const faqItems = landingFAQs[SLUG];
  // Schema.org FAQPage - Safe: static translation data
  const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqItems.map((item) => ({ "@type": "Question", name: t(`${SLUG}.faq.${item.key}.question`), acceptedAnswer: { "@type": "Answer", text: t(`${SLUG}.faq.${item.key}.answer`) } })) };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Navigation />
      <main className="pt-20">
        <section className="py-16 md:py-24 bg-[var(--background)] relative overflow-hidden">
          <div className="section-container relative z-10">
            <div className="max-w-3xl">
              <span className="inline-block text-sm font-medium text-[var(--accent)] uppercase tracking-widest mb-4">{t(`${SLUG}.hero.label`)}</span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">{t(`${SLUG}.hero.title`)}</h1>
              <p className="text-xl text-[var(--foreground-secondary)] mb-6 leading-relaxed">{t(`${SLUG}.hero.subtitle`)}</p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--background-card)] border border-[var(--border)] rounded-full mb-8">
                <div className="flex text-yellow-400">{[...Array(5)].map((_, i) => (<svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>))}</div>
                <span className="text-sm font-medium">5/5</span><span className="text-sm text-[var(--foreground-secondary)]">• {tCommon("googleReviewsCount")}</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#contact" className="inline-flex items-center justify-center px-8 py-4 bg-[var(--accent)] btn-primary-text font-semibold rounded-lg hover:bg-[var(--accent-hover)] transition-colors">{tCommon("cta.quote")}</a>
                <Link href={`/${locale}#projets`} className="inline-flex items-center justify-center px-8 py-4 border border-[var(--border)] font-semibold rounded-lg hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors">{tCommon("cta.projects")}<svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></Link>
              </div>
            </div>
          </div>
        </section>
        <section className="py-16 md:py-24 bg-[var(--background-secondary)]">
          <div className="section-container">
            <div className="text-center mb-12"><span className="inline-block text-sm font-medium text-[var(--accent)] uppercase tracking-widest mb-4">{tCommon("whyMe.label")}</span><h2 className="text-3xl sm:text-4xl font-bold">{tCommon("whyMe.title")}</h2></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {whyChooseMe.map((item) => (<div key={item.key} className="group p-6 bg-[var(--background)] border border-[var(--border)] rounded-2xl transition-all duration-300 hover:border-[var(--accent)] hover:-translate-y-1"><div className="w-12 h-12 flex items-center justify-center rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] mb-4 group-hover:bg-[var(--accent)] group-hover:text-[var(--background)] transition-all duration-300">{whyIcons[item.icon]}</div><h3 className="text-lg font-semibold mb-2 group-hover:text-[var(--accent)] transition-colors">{tCommon(`whyMe.items.${item.key}.title`)}</h3><p className="text-[var(--foreground-secondary)] text-sm leading-relaxed">{tCommon(`whyMe.items.${item.key}.description`)}</p></div>))}
            </div>
          </div>
        </section>
        <section className="py-16 md:py-24 bg-[var(--background)]">
          <div className="section-container">
            <div className="text-center mb-12"><span className="inline-block text-sm font-medium text-[var(--accent)] uppercase tracking-widest mb-4">{tCommon("services.label")}</span><h2 className="text-3xl sm:text-4xl font-bold">{tCommon("services.title")}</h2></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {["siteVitrine", "applicationWeb", "landingPage"].map((service) => (<div key={service} className="group flex flex-col p-8 bg-[var(--background-card)] border border-[var(--border)] rounded-2xl transition-all duration-300 hover:border-[var(--accent)]"><div className="w-14 h-14 flex items-center justify-center rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] mb-6 group-hover:bg-[var(--accent)] group-hover:text-[var(--background)] transition-all duration-300">{serviceIcons[service === "siteVitrine" ? "globe" : service === "applicationWeb" ? "layout" : "rocket"]}</div><h3 className="text-xl font-semibold mb-3 group-hover:text-[var(--accent)] transition-colors">{tCommon(`services.items.${service}.title`)}</h3><p className="text-[var(--foreground-secondary)] mb-4 leading-relaxed">{tCommon(`services.items.${service}.description`)}</p><ul className="space-y-2 mb-6 flex-grow">{[1,2,3,4].map((i) => (<li key={i} className="flex items-center text-sm text-[var(--foreground-secondary)]"><svg className="w-4 h-4 text-[var(--accent)] mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>{tCommon(`services.items.${service}.features.${i}`)}</li>))}</ul><p className="text-sm text-[var(--foreground-secondary)] mt-auto pt-4 border-t border-[var(--border)]"><span className="proof">{tCommon("services.pricingFrom", { price: formatPrice(siteConfig.prices[featureOffer[service]].from, locale) })}</span></p></div>))}
            </div>
          </div>
        </section>
        <section className="py-16 md:py-24 bg-[var(--background-secondary)]">
          <div className="section-container">
            <div className="text-center mb-12"><span className="inline-block text-sm font-medium text-[var(--accent)] uppercase tracking-widest mb-4">{tCommon("faq.label")}</span><h2 className="text-3xl sm:text-4xl font-bold">{t(`${SLUG}.faq.title`)}</h2></div>
            <LandingFAQ slug={SLUG} items={faqItems} />
          </div>
        </section>
        <BriefCTA from={SLUG} />
        <section id="contact" className="py-16 md:py-24 bg-[var(--background)]">
          <div className="section-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
              <div>
                <span className="inline-block text-sm font-medium text-[var(--accent)] uppercase tracking-widest mb-4">{tCommon("contact.label")}</span>
                <h2 className="text-3xl sm:text-4xl font-bold mb-6">{tCommon("contact.title")}</h2>
                <p className="text-[var(--foreground-secondary)] mb-8 leading-relaxed">{tCommon("contact.subtitle")}</p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-4 p-4 bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl"><div className="w-12 h-12 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg></div><div><p className="text-sm text-[var(--foreground-secondary)]">{tCommon("contact.address")}</p><p className="font-medium">Lambersart (Lille métropole)</p></div></div>
                  <a href="mailto:jb@jbrdevelopment.fr" className="flex items-center gap-4 p-4 bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl hover:border-[var(--accent)] transition-colors group"><div className="w-12 h-12 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-[var(--background)] transition-all"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></div><div><p className="text-sm text-[var(--foreground-secondary)]">Email</p><p className="font-medium">jb@jbrdevelopment.fr</p></div></a>
                  <a href="tel:+33618972250" className="flex items-center gap-4 p-4 bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl hover:border-[var(--accent)] transition-colors group"><div className="w-12 h-12 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-[var(--background)] transition-all"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg></div><div><p className="text-sm text-[var(--foreground-secondary)]">{tCommon("contact.phone")}</p><p className="font-medium">06 18 97 22 50</p></div></a>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--background-secondary)] border border-[var(--border)] rounded-full"><div className="flex text-yellow-400">{[...Array(5)].map((_, i) => (<svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>))}</div><span className="text-sm font-medium">5/5 {tCommon("contact.onGoogle")}</span></div>
              </div>
              <div><ContactForm source={SLUG} /></div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
