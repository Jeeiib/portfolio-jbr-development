import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Navigation from "@/components/ui/Navigation";
import Footer from "@/components/sections/Footer";
import BriefCTA from "@/components/ui/BriefCTA";
import PricingTable from "@/components/tarifs/PricingTable";
import PricingFAQ from "@/components/tarifs/PricingFAQ";
import Reveal from "@/components/ui/Reveal";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tarifs.meta" });

  const canonical =
    locale === "fr"
      ? "https://jbrdevelopment.fr/fr/tarifs"
      : `https://jbrdevelopment.fr/${locale}/tarifs`;

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical,
      languages: {
        "fr-FR": "https://jbrdevelopment.fr/fr/tarifs",
        "en-US": "https://jbrdevelopment.fr/en/tarifs",
      },
    },
  };
}

export default async function TarifsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tarifs" });

  return (
    <>
      <Navigation />
      <main className="pt-28 md:pt-36">
        {/* En-tête */}
        <div className="section-container mb-16">
          <p className="annotation-accent mb-4">{t("annotation")}</p>
          <h1 className="display-xl mb-5 max-w-3xl">{t("title")}</h1>
          <p className="text-lg text-[var(--foreground-secondary)] max-w-2xl">{t("intro")}</p>
        </div>

        {/* Grille tarifaire */}
        <div className="section-container mb-20">
          <PricingTable />
        </div>

        {/* Ce qui fait varier le prix */}
        <div className="section-container mb-20">
          <Reveal>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--background-secondary)] p-8">
              <p className="annotation mb-3">{t("variesAnnotation")}</p>
              <h2 className="text-2xl font-bold mb-4">{t("variesTitle")}</h2>
              <p className="text-[var(--foreground-secondary)] max-w-3xl leading-relaxed">
                {t("variesText")}
              </p>
            </div>
          </Reveal>
        </div>

        {/* Comparatif honnête des trois segments */}
        <div className="section-container mb-20">
          <Reveal>
            <h2 className="text-2xl font-bold mb-3">{t("compareTitle")}</h2>
            <p className="text-[var(--foreground-secondary)] mb-8 max-w-2xl">
              {t("compareIntro")}
            </p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(["diy", "lowcost", "jbr"] as const).map((seg, index) => (
              <Reveal key={seg} delay={index * 100} className="h-full">
                <div
                  className={`h-full rounded-xl border p-7 ${
                    seg === "jbr"
                      ? "border-[var(--accent)] bg-[var(--accent)]/5"
                      : "border-[var(--border)] bg-[var(--background-card)]"
                  }`}
                >
                  <p className="annotation mb-2">{t(`compare.${seg}.range`)}</p>
                  <h3 className="text-lg font-bold mb-3">{t(`compare.${seg}.title`)}</h3>
                  <p className="text-sm text-[var(--foreground-secondary)] leading-relaxed mb-4">
                    {t(`compare.${seg}.text`)}
                  </p>
                  <p className="text-sm font-medium">{t(`compare.${seg}.forWhom`)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Témoignage RDP Glass */}
        <div className="section-container mb-20">
          <Reveal>
            <blockquote className="border-l-2 border-[var(--accent)] pl-6 max-w-3xl">
              <p className="text-lg italic text-[var(--foreground-secondary)] mb-3">
                « {t("quote.text")} »
              </p>
              <footer className="text-sm">
                <span className="font-semibold">{t("quote.author")}</span>
                <span className="text-[var(--foreground-secondary)]"> — {t("quote.role")}</span>
              </footer>
            </blockquote>
          </Reveal>
        </div>

        {/* FAQ prix */}
        <div className="section-container mb-8">
          <Reveal>
            <h2 className="text-2xl font-bold mb-8">{t("faq.title")}</h2>
          </Reveal>
          <PricingFAQ />
        </div>

        <BriefCTA from="tarifs" />
      </main>
      <Footer />
    </>
  );
}
