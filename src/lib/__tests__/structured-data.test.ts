import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const SRC = path.resolve(__dirname, "../..");

function sourcesTsx(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return sourcesTsx(p);
    return e.name.endsWith(".tsx") ? [p] : [];
  });
}

const porteursDeJsonLd = sourcesTsx(SRC)
  .map((p) => ({ chemin: path.relative(SRC, p), contenu: fs.readFileSync(p, "utf8") }))
  .filter((f) => f.contenu.includes("application/ld+json"));

describe("données structurées JSON-LD", () => {
  it("sont déclarées dans le composant global et les pages ciblées", () => {
    const chemins = porteursDeJsonLd.map((f) => f.chemin);
    expect(chemins).toContain("components/StructuredData.tsx");
    expect(chemins.length).toBeGreaterThanOrEqual(5);
  });

  // next/script injecte le script apres hydratation : le JSON-LD reste absent
  // du HTML source, donc invisible pour tout crawler qui n'execute pas le JS.
  it("passent par une balise <script> native, jamais par next/script", () => {
    for (const { chemin, contenu } of porteursDeJsonLd) {
      expect(contenu, `${chemin} importe next/script`).not.toMatch(/from "next\/script"/);
      expect(contenu, `${chemin} rend une balise <Script>`).not.toMatch(/<Script\b/);
      expect(contenu, `${chemin} n'a pas de <script> natif`).toMatch(
        /<script\s+type="application\/ld\+json"|<script\n\s+type="application\/ld\+json"/,
      );
    }
  });

  // Google n'affiche pas les avis qu'une entreprise s'attribue elle-meme et
  // peut sanctionner la pratique : la note vit sur la fiche Google Business.
  it("ne contiennent aucun avis auto-attribué", () => {
    for (const { chemin, contenu } of porteursDeJsonLd) {
      expect(contenu, `${chemin} declare un aggregateRating`).not.toMatch(/aggregateRating/);
    }
  });
});
