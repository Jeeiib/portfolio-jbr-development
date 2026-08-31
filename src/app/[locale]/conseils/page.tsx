import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Navigation from "@/components/ui/Navigation";
import Footer from "@/components/sections/Footer";
import BriefCTA from "@/components/ui/BriefCTA";
import Reveal from "@/components/ui/Reveal";
import ArticleCard from "@/components/conseils/ArticleCard";
import { getAllArticles } from "@/lib/conseils";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "conseils.meta" });

  return {
    title: t("title"),
    description: t("description"),
    // Section publiée en français uniquement : pas d'alternate en anglais.
    alternates: { canonical: "https://jbrdevelopment.fr/fr/conseils" },
  };
}

export default async function ConseilsPage({ params }: Props) {
  const { locale } = await params;
  if (locale !== "fr") notFound();

  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "conseils" });
  const articles = getAllArticles();

  return (
    <>
      <Navigation />
      <main className="pt-28 md:pt-36">
        <div className="section-container mb-14">
          <p className="annotation-accent mb-4">{t("annotation")}</p>
          <h1 className="display-xl mb-5 max-w-3xl">{t("title")}</h1>
          <p className="max-w-2xl text-lg text-[var(--foreground-secondary)]">{t("intro")}</p>
        </div>

        <div className="section-container mb-8">
          {articles.length === 0 ? (
            <p className="max-w-2xl text-[var(--foreground-secondary)]">{t("empty")}</p>
          ) : (
            <div className="flex max-w-3xl flex-col gap-5">
              {articles.map((article) => (
                <Reveal key={article.slug}>
                  <ArticleCard article={article} locale={locale} />
                </Reveal>
              ))}
            </div>
          )}
        </div>

        <BriefCTA from="conseils" />
      </main>
      <Footer />
    </>
  );
}
