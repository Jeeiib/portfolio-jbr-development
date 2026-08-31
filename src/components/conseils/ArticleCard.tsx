import Link from "next/link";
import type { ArticleMeta } from "@/lib/conseils";
import { formatDateLongue } from "@/lib/formatDate";

interface ArticleCardProps {
  article: ArticleMeta;
  locale: string;
}

export default function ArticleCard({ article, locale }: ArticleCardProps) {
  return (
    <Link
      href={`/${locale}/conseils/${article.slug}`}
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
