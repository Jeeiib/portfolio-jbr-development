import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[var(--background)] flex items-center justify-center px-6">
      <div className="text-center max-w-xl">
        {/* 404 Number */}
        <div className="flex items-center justify-center gap-2 md:gap-4 mb-8">
          <span className="text-[10rem] md:text-[14rem] font-bold text-[var(--accent)]/10 leading-none select-none">
            4
          </span>
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-[var(--accent)]/20 flex items-center justify-center animate-pulse">
            <svg
              className="w-14 h-14 md:w-18 md:h-18 text-[var(--accent)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <span className="text-[10rem] md:text-[14rem] font-bold text-[var(--accent)]/10 leading-none select-none">
            4
          </span>
        </div>

        {/* Message */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Page introuvable
        </h1>
        <p className="text-[var(--foreground-secondary)] mb-8 leading-relaxed">
          Oups ! La page que vous cherchez semble avoir disparu dans le code.
          Pas de panique, retournons à l&apos;accueil.
        </p>

        {/* CTA */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--accent)] text-[var(--background)] font-semibold rounded-lg hover:bg-[var(--accent-hover)] transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Retour à l&apos;accueil
        </Link>

        {/* Decorative elements */}
        <div className="mt-16 flex items-center justify-center gap-4 text-[var(--foreground-secondary)] text-sm">
          <span>JBR</span>
          <span className="text-[var(--accent)]">•</span>
          <span>Development</span>
        </div>
      </div>

      {/* Background decoration */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-[var(--accent)]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-[var(--accent)]/5 rounded-full blur-3xl pointer-events-none" />
    </main>
  );
}
