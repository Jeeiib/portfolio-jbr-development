import Link from "next/link";

// 404 hors contexte de locale (racine) : contenu statique français.
export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-xl">
        <p className="tag-chantier w-fit mb-6">Erreur 404 — page hors plan</p>
        <h1 className="display-xl mb-4">Page introuvable</h1>
        <p className="text-[var(--foreground-secondary)] mb-8">
          Cette page n&apos;existe pas ou a été déplacée.
        </p>
        <Link
          href="/fr"
          className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold bg-[var(--accent)] btn-primary-text rounded-lg transition-colors hover:bg-[var(--accent-hover)]"
        >
          <span aria-hidden="true">←</span>
          Retour à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}
