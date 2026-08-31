import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface ArticleMeta {
  slug: string;
  title: string;
  description: string;
  /** ISO court, YYYY-MM-DD */
  date: string;
  keywords: string[];
  draft?: boolean;
}

export interface Article {
  meta: ArticleMeta;
  content: string;
}

const DOSSIER = path.join(process.cwd(), "content/conseils");

// Le frontmatter est saisi à la main ou produit par la routine hebdomadaire de
// rédaction. Un champ manquant doit faire échouer le build sur la préversion,
// pas publier une page sans titre, sans description ou hors du sitemap.
function toMeta(slug: string, data: Record<string, unknown>): ArticleMeta {
  const exiger = (champ: string): string => {
    const valeur = data[champ];
    if (typeof valeur !== "string" || valeur.trim() === "") {
      throw new Error(`content/conseils/${slug}.mdx : frontmatter "${champ}" manquant ou vide`);
    }
    return valeur;
  };

  const date = exiger("date");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`content/conseils/${slug}.mdx : "date" doit être au format YYYY-MM-DD`);
  }

  const keywords = data.keywords;
  if (!Array.isArray(keywords) || keywords.some((k) => typeof k !== "string")) {
    throw new Error(`content/conseils/${slug}.mdx : "keywords" doit être une liste de chaînes`);
  }

  return {
    slug,
    title: exiger("title"),
    description: exiger("description"),
    date,
    keywords: keywords as string[],
    draft: data.draft === true,
  };
}

function lire(slug: string): Article | null {
  const fichier = path.join(DOSSIER, `${slug}.mdx`);
  if (!fs.existsSync(fichier)) return null;
  const { data, content } = matter(fs.readFileSync(fichier, "utf8"));
  return { meta: toMeta(slug, data), content };
}

/** Articles publiés, du plus récent au plus ancien. Les brouillons sont exclus. */
export function getAllArticles(): ArticleMeta[] {
  if (!fs.existsSync(DOSSIER)) return [];
  return fs
    .readdirSync(DOSSIER)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => lire(f.replace(/\.mdx$/, ""))!.meta)
    .filter((meta) => !meta.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * Article complet par son slug, brouillons inclus : la prévisualisation d'un
 * brouillon doit rester possible pendant la rédaction, même s'il n'apparaît
 * ni dans la liste publique ni dans le sitemap.
 */
export function getArticle(slug: string): Article | null {
  return lire(slug);
}

export interface Heading {
  /** ancre, identique a l'id pose sur le <h2> au rendu */
  id: string;
  text: string;
}

/**
 * Ancre lisible depuis un titre francais : les diacritiques sont aplatis et
 * toute ponctuation devient un separateur. Le rendu MDX pose l'id avec cette
 * meme fonction, pour que le sommaire et les titres ne puissent pas divorcer.
 */
export function slugifyHeading(texte: string): string {
  return texte
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * H2 du corps, dans l'ordre de lecture, pour alimenter le sommaire. Les blocs
 * de code delimites par des fences sont ignores : un exemple de Markdown dans
 * un article ne doit pas se retrouver dans son sommaire.
 */
export function getHeadings(content: string): Heading[] {
  const titres: Heading[] = [];
  let dansUnBlocDeCode = false;

  for (const ligne of content.split("\n")) {
    if (ligne.trimStart().startsWith("```")) {
      dansUnBlocDeCode = !dansUnBlocDeCode;
      continue;
    }
    if (dansUnBlocDeCode || !ligne.startsWith("## ")) continue;
    const text = ligne.slice(3).trim();
    titres.push({ id: slugifyHeading(text), text });
  }

  return titres;
}
