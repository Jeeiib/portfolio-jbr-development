"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  /** Délai en millisecondes avant la transition une fois visible */
  delay?: number;
  className?: string;
  /** Élément rendu (div par défaut) — "li" pour rester valide dans une liste */
  as?: "div" | "li";
}

/**
 * Révélation au scroll unique et sobre (opacity + translateY).
 * Le contenu est visible par défaut (SEO, no-JS) : le masquage n'est
 * appliqué qu'en JS, et uniquement aux éléments encore sous le viewport.
 * Inerte si prefers-reduced-motion.
 */
export default function Reveal({ children, delay = 0, className = "", as: Tag = "div" }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return; // reste visible, aucune animation
    }

    // Ne masquer que ce qui est encore nettement sous le viewport :
    // ce qui est déjà visible ne doit jamais clignoter.
    const rect = el.getBoundingClientRect();
    if (rect.top <= window.innerHeight * 0.9) {
      return;
    }

    el.classList.add("reveal-hidden");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.remove("reveal-hidden");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      className={`reveal ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
