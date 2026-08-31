"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { gsap, useGSAP } from "@/lib/motion";

/**
 * La scène "chantier vivant" : le site d'un commerce lillois passe de la
 * maquette au site en ligne en ~4 s. Trois calques superposés (wireframe,
 * design, final) animés par une timeline GSAP unique.
 *
 * Reduced motion / avant hydratation : le CSS par défaut affiche l'état
 * final — la timeline commence par poser les états initiaux (.set), donc
 * si elle ne tourne pas, le visiteur voit le site fini, jamais un vide.
 * Les textes de la scène restent en français (décoratifs, comme l'ancien
 * terminal).
 */
export default function ChantierScene() {
  const t = useTranslations("hero.scene");
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [canReplay, setCanReplay] = useState(false);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return; // état final statique, aucune timeline
      }

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        onComplete: () => setCanReplay(true),
      });
      timelineRef.current = tl;

      // États initiaux (le CSS par défaut montre l'état final)
      tl.set(".cs-wire", { autoAlpha: 1 });
      tl.set(".cs-design, .cs-final", { autoAlpha: 0 });
      tl.set(".cs-wire .cs-el", { autoAlpha: 0, y: 8 });
      tl.set(".cs-online", { autoAlpha: 0, scale: 0.8 });
      tl.set(".cs-label-2, .cs-label-3", { autoAlpha: 0 });
      tl.set(".cs-label-1", { autoAlpha: 1 });

      // Phase 1 — la maquette se trace
      tl.to(".cs-wire .cs-el", { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.07 });

      // Phase 2 — le design habille la maquette
      tl.to(".cs-label-1", { autoAlpha: 0, duration: 0.2 }, "+=0.45");
      tl.to(".cs-label-2", { autoAlpha: 1, duration: 0.2 }, "<");
      tl.to(".cs-wire", { autoAlpha: 0, duration: 0.5 }, "<");
      tl.to(".cs-design", { autoAlpha: 1, duration: 0.5 }, "<0.15");
      tl.from(".cs-design .cs-el", { y: 10, autoAlpha: 0, duration: 0.3, stagger: 0.05 }, "<");

      // Phase 3 — le site passe en ligne
      tl.to(".cs-label-2", { autoAlpha: 0, duration: 0.2 }, "+=0.5");
      tl.to(".cs-label-3", { autoAlpha: 1, duration: 0.2 }, "<");
      tl.to(".cs-design", { autoAlpha: 0, duration: 0.45 }, "<");
      tl.to(".cs-final", { autoAlpha: 1, duration: 0.45 }, "<0.1");
      tl.to(".cs-online", { autoAlpha: 1, scale: 1, duration: 0.4, ease: "back.out(2)" }, "-=0.1");
    },
    { scope: containerRef }
  );

  const replay = () => {
    timelineRef.current?.restart();
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-lg mx-auto lg:mx-0 select-none" aria-hidden="true">
      {/* Fenêtre navigateur */}
      <div className="bg-[var(--background-card)] border border-[var(--border)] rounded-xl overflow-hidden shadow-2xl">
        {/* Barre du navigateur */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-[var(--background-secondary)] border-b border-[var(--border)]">
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--border)]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--border)]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--border)]" />
          <div className="ml-3 flex-1 flex items-center gap-2 bg-[var(--background)] border border-[var(--border)] rounded px-3 py-1">
            <span className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-[var(--foreground-secondary)]">
              votre-commerce.fr
            </span>
            <span className="cs-online ml-auto inline-flex items-center gap-1 font-[family-name:var(--font-jetbrains-mono)] text-[10px] font-semibold text-[var(--accent)]">
              {t("online")}
            </span>
          </div>
        </div>

        {/* Zone de contenu : 3 calques empilés */}
        <div className="relative h-[300px] sm:h-[340px]">
          {/* ── Calque 1 : wireframe (caché par défaut, montré par la timeline) ── */}
          <div className="cs-wire absolute inset-0 p-5 opacity-0 invisible">
            <div className="cs-el flex items-center justify-between mb-5">
              <div className="w-8 h-3 border border-dashed border-[var(--foreground-secondary)]/50 rounded-sm" />
              <div className="flex gap-2">
                <div className="w-10 h-2.5 border border-dashed border-[var(--foreground-secondary)]/40 rounded-sm" />
                <div className="w-10 h-2.5 border border-dashed border-[var(--foreground-secondary)]/40 rounded-sm" />
                <div className="w-10 h-2.5 border border-dashed border-[var(--foreground-secondary)]/40 rounded-sm" />
              </div>
            </div>
            <div className="cs-el h-24 border border-dashed border-[var(--foreground-secondary)]/50 rounded mb-2 flex items-center justify-center">
              <span className="font-[family-name:var(--font-jetbrains-mono)] text-[10px] text-[var(--foreground-secondary)]/60 uppercase tracking-wider">
                {t("imageSlot")}
              </span>
            </div>
            {/* Trait de cote façon plan */}
            <div className="cs-el flex items-center gap-1 mb-4">
              <div className="w-px h-2 bg-[var(--foreground-secondary)]/40" />
              <div className="flex-1 h-px bg-[var(--foreground-secondary)]/40" />
              <span className="font-[family-name:var(--font-jetbrains-mono)] text-[9px] text-[var(--foreground-secondary)]/60 px-1">
                1200 px
              </span>
              <div className="flex-1 h-px bg-[var(--foreground-secondary)]/40" />
              <div className="w-px h-2 bg-[var(--foreground-secondary)]/40" />
            </div>
            <div className="cs-el w-3/5 h-3 border border-dashed border-[var(--foreground-secondary)]/50 rounded-sm mb-2" />
            <div className="cs-el w-2/5 h-3 border border-dashed border-[var(--foreground-secondary)]/40 rounded-sm mb-5" />
            <div className="grid grid-cols-3 gap-3">
              <div className="cs-el h-16 border border-dashed border-[var(--foreground-secondary)]/40 rounded" />
              <div className="cs-el h-16 border border-dashed border-[var(--foreground-secondary)]/40 rounded" />
              <div className="cs-el h-16 border border-dashed border-[var(--foreground-secondary)]/40 rounded" />
            </div>
          </div>

          {/* ── Calque 2 : design (caché par défaut) ── */}
          <div className="cs-design absolute inset-0 p-5 opacity-0 invisible">
            <div className="cs-el flex items-center justify-between mb-5">
              <div className="w-8 h-3 bg-[var(--foreground)]/80 rounded-sm" />
              <div className="flex gap-2">
                <div className="w-10 h-2.5 bg-[var(--foreground-secondary)]/30 rounded-sm" />
                <div className="w-10 h-2.5 bg-[var(--foreground-secondary)]/30 rounded-sm" />
                <div className="w-10 h-2.5 bg-[var(--foreground-secondary)]/30 rounded-sm" />
              </div>
            </div>
            <div className="cs-el h-24 rounded mb-4 bg-gradient-to-br from-[var(--foreground-secondary)]/25 to-[var(--foreground-secondary)]/10" />
            <div className="cs-el w-3/5 h-3 bg-[var(--foreground)]/70 rounded-sm mb-2" />
            <div className="cs-el w-2/5 h-3 bg-[var(--foreground-secondary)]/40 rounded-sm mb-5" />
            <div className="grid grid-cols-3 gap-3">
              <div className="cs-el h-16 bg-[var(--background-secondary)] border border-[var(--border)] rounded" />
              <div className="cs-el h-16 bg-[var(--background-secondary)] border border-[var(--border)] rounded" />
              <div className="cs-el h-16 bg-[var(--background-secondary)] border border-[var(--border)] rounded" />
            </div>
          </div>

          {/* ── Calque 3 : final (visible par défaut = fallback statique) ── */}
          <div className="cs-final absolute inset-0 p-5">
            <div className="flex items-center justify-between mb-5">
              <span className="text-[13px] font-bold">
                Aux P&apos;tits Pains<span className="text-[var(--accent)]">.</span>
              </span>
              <div className="flex gap-3 text-[10px] text-[var(--foreground-secondary)]">
                <span>Accueil</span>
                <span>La boutique</span>
                <span>Contact</span>
              </div>
            </div>
            <div className="h-24 rounded mb-4 bg-gradient-to-br from-[var(--foreground-secondary)]/25 to-[var(--foreground-secondary)]/5 flex items-end p-3">
              <span className="text-[15px] font-bold leading-tight">
                Boulangerie artisanale
                <br />
                à Lille depuis 1987
              </span>
            </div>
            <div className="flex items-center gap-3 mb-5">
              <span className="inline-flex items-center rounded bg-[var(--accent)] px-3 py-1.5 text-[10px] font-semibold btn-primary-text">
                Commander en ligne
              </span>
              <span className="text-[10px] text-[var(--foreground-secondary)]">
                Ouvert du mardi au dimanche
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="h-16 bg-[var(--background-secondary)] border border-[var(--border)] rounded p-2">
                <p className="text-[9px] font-semibold mb-0.5">Nos pains</p>
                <p className="font-[family-name:var(--font-jetbrains-mono)] text-[9px] text-[var(--accent)] font-semibold">
                  des 1,20 EUR
                </p>
              </div>
              <div className="h-16 bg-[var(--background-secondary)] border border-[var(--border)] rounded p-2">
                <p className="text-[9px] font-semibold mb-0.5">Patisseries</p>
                <p className="font-[family-name:var(--font-jetbrains-mono)] text-[9px] text-[var(--accent)] font-semibold">
                  des 2,50 EUR
                </p>
              </div>
              <div className="h-16 bg-[var(--background-secondary)] border border-[var(--border)] rounded p-2">
                <p className="text-[9px] font-semibold mb-0.5">Click &amp; collect</p>
                <p className="font-[family-name:var(--font-jetbrains-mono)] text-[9px] text-[var(--accent)] font-semibold">
                  en 10 min
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pied de scène : phases + rejouer */}
        <div className="flex items-center justify-between px-4 py-2 bg-[var(--background-secondary)] border-t border-[var(--border)]">
          <div className="relative h-4 flex-1">
            <span className="cs-label-1 absolute left-0 top-0 font-[family-name:var(--font-jetbrains-mono)] text-[10px] uppercase tracking-wider text-[var(--foreground-secondary)] opacity-0 invisible">
              {t("phase1")}
            </span>
            <span className="cs-label-2 absolute left-0 top-0 font-[family-name:var(--font-jetbrains-mono)] text-[10px] uppercase tracking-wider text-[var(--foreground-secondary)] opacity-0 invisible">
              {t("phase2")}
            </span>
            <span className="cs-label-3 absolute left-0 top-0 font-[family-name:var(--font-jetbrains-mono)] text-[10px] uppercase tracking-wider text-[var(--foreground-secondary)]">
              {t("phase3")}
            </span>
          </div>
          <button
            type="button"
            onClick={replay}
            disabled={!canReplay}
            tabIndex={-1}
            className={`annotation transition-opacity hover:text-[var(--accent)] ${
              canReplay ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            {t("replay")}
          </button>
        </div>
      </div>
    </div>
  );
}
