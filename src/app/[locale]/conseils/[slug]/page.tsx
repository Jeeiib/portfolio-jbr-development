import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Navigation from "@/components/ui/Navigation";
import Footer from "@/components/sections/Footer";
import BriefCTA from "@/components/ui/BriefCTA";
import { mdxComponents } from "@/components/conseils/mdxComponents";
import { getAllArticles, getArticle, getHeadings } from "@/lib/conseils";
import { formatDateLongue } from "@/lib/formatDate";

const BASE_URL = "https://jbrdevelopment.fr";

// En dessous de ce nombre de sections, un sommaire encombre plus qu'il n'aide.
const SEUIL_SOMMAIRE = 4;

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

// Les slugs hors de cette liste renvoient 404 : un brouillon n'est pas publié.
export const dynamicParams = false;

export async function generateStaticParams() {
  // Section publiée en français uniquement (spec §11).
  return getAllArticles().map((article) => ({ locale: "fr", slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};

  const { meta } = article;
  return {
    title: `${meta.title} — JBR Development`,
    description: meta.description,
    keywords: meta.keywords,
    alternates: { canonical: `${BASE_URL}/fr/conseils/${slug}` },
    openGraph: {
      type: "article",
      title: meta.title,
      description: meta.description,
      publishedTime: meta.date,
      url: `${BASE_URL}/fr/conseils/${slug}`,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  if (locale !== "fr") notFound();

  const article = getArticle(slug);
  // Le brouillon reste consultable en dev pour la relecture, jamais en ligne.
  if (!article || (article.meta.draft && process.env.NODE_ENV === "production")) notFound();

  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "conseils" });

  const { meta } = article;
  const titres = getHeadings(article.content);
  const { content } = await compileMDX({
    source: article.content,
    components: mdxComponents,
  });

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: meta.title,
    description: meta.description,
    datePublished: meta.date,
    inLanguage: "fr-FR",
    author: {
      "@type": "Person",
      name: "Jean-Baptiste Renart",
      url: `${BASE_URL}/fr/a-propos`,
    },
    publisher: { "@type": "Organization", name: "JBR Development" },
    mainEntityOfPage: `${BASE_URL}/fr/conseils/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Navigation />
      <main className="pt-28 md:pt-36">
        <article className="section-container">
          <div className="max-w-3xl">
            <Link
              href={`/${locale}/conseils`}
              className="annotation inline-block transition-colors hover:text-[var(--accent)]"
            >
              &larr; {t("backToList")}
            </Link>

            <h1 className="display-xl mt-5 mb-5">{meta.title}</h1>

            <div className="mb-6">
              <span className="tag-chantier">
                {t("publishedOn")}{" "}
                <time dateTime={meta.date}>{formatDateLongue(meta.date)}</time>
              </span>
            </div>

            <p className="mb-10 max-w-2xl text-lg text-[var(--foreground-secondary)]">
              {meta.description}
            </p>

            {titres.length >= SEUIL_SOMMAIRE && (
              <nav
                aria-labelledby="sommaire-titre"
                className="mb-12 rounded-xl border border-[var(--border)] bg-[var(--background-secondary)] p-6"
              >
                <p id="sommaire-titre" className="annotation mb-4">
                  {t("sommaireTitle")}
                </p>
                <ul className="sommaire-conseils flex flex-col gap-2">
                  {titres.map((titre) => (
                    <li key={titre.id}>
                      <a
                        href={`#${titre.id}`}
                        className="transition-colors hover:text-[var(--accent)]"
                      >
                        {titre.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}

            <div className="prose-conseils">{content}</div>
          </div>
        </article>

        {/* slug dans l'origine : permet de voir quel article convertit */}
        <BriefCTA from={`conseils/${slug}`} />
      </main>
      <Footer />
    </>
  );
}
