import { Link } from "@/i18n/navigation";
import type { ArticleMeta } from "@/lib/conseils";
import { formatDateLongue } from "@/lib/formatDate";

interface ArticleCardProps {
  article: ArticleMeta;
}

// Pas de prop `locale` sur le Link : la passer explicitement forcerait next-intl
// à préfixer l'URL (/fr/conseils/...), qui repart en redirection 308. Sans elle,
// la locale courante est utilisée et l'URL est directement la bonne.
export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link
      href={`/conseils/${article.slug}`}
      className="card-hover group block rounded-xl border border-[var(--border)] bg-[var(--background-card)] p-6 md:p-7"
    >
      <div className="mb-4">
        <span className="tag-chantier">
          <time dateTime={article.date}>{formatDateLongue(article.date)}</time>
        </span>
      </div>
      <h2 className="mb-2 text-xl font-bold leading-snug transition-colors group-hover:text-[var(--accent)] md:text-2xl">
        {article.title}
      </h2>
      <p className="text-[var(--foreground-secondary)]">{article.description}</p>
    </Link>
  );
}
