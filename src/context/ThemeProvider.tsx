"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const CLE_STOCKAGE = "theme";

/**
 * Le theme de reference vit dans localStorage et est pose sur <html> par
 * public/scripts/theme-init.js, avant l'hydratation, ce qui evite le flash.
 * React n'a donc qu'a le LIRE : le synchroniser via un setState dans un effet
 * declencherait un rendu en cascade a chaque montage, et le CSS ne dependrait
 * de toute facon jamais de cet etat.
 */
const abonnes = new Set<() => void>();

function sAbonner(notifier: () => void) {
  abonnes.add(notifier);
  // Un autre onglet peut basculer le theme : l'evenement storage ne se
  // declenche que dans les AUTRES onglets, d'ou le jeu d'abonnes local.
  window.addEventListener("storage", notifier);
  return () => {
    abonnes.delete(notifier);
    window.removeEventListener("storage", notifier);
  };
}

function lireTheme(): Theme {
  try {
    return localStorage.getItem(CLE_STOCKAGE) === "light" ? "light" : "dark";
  } catch {
    // Navigation privee ou stockage refuse par le navigateur.
    return "dark";
  }
}

// Au rendu serveur, localStorage n'existe pas : on annonce le theme sombre,
// celui que le script d'initialisation applique aussi par defaut.
function themeParDefaut(): Theme {
  return "dark";
}

function ecrireTheme(theme: Theme) {
  try {
    localStorage.setItem(CLE_STOCKAGE, theme);
  } catch {
    // Le theme ne survivra pas au rechargement, mais la bascule reste visible.
  }
  document.documentElement.setAttribute("data-theme", theme);
  for (const notifier of abonnes) notifier();
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(sAbonner, lireTheme, themeParDefaut);

  const toggleTheme = useCallback(() => {
    ecrireTheme(lireTheme() === "dark" ? "light" : "dark");
  }, []);

  const valeur = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return <ThemeContext.Provider value={valeur}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  // Valeurs de repli quand le contexte est absent (rendu hors Provider).
  if (!context) {
    return {
      theme: "dark" as const,
      toggleTheme: () => {},
    };
  }
  return context;
}
