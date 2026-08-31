import { describe, it, expect } from "vitest";
import { getAllArticles, getArticle } from "@/lib/conseils";

describe("conseils", () => {
  it("liste les articles non-draft triés du plus récent au plus ancien", () => {
    const all = getAllArticles();
    expect(all.length).toBeGreaterThanOrEqual(1);
    const dates = all.map((a) => a.date);
    expect([...dates].sort().reverse()).toEqual(dates);
    expect(all.every((a) => !a.draft)).toBe(true);
  });

  it("retourne null pour un slug inconnu", () => {
    expect(getArticle("nexiste-pas")).toBeNull();
  });

  it("retourne meta + contenu pour un slug existant", () => {
    const first = getAllArticles()[0];
    const art = getArticle(first.slug);
    expect(art?.meta.title).toBeTruthy();
    expect(art?.content.length).toBeGreaterThan(100);
  });

  // le filtrage des brouillons n'est verifiable que s'il en existe un
  it("exclut les brouillons de la liste mais les rend lisibles par slug", () => {
    const brouillon = getArticle("exemple-brouillon");
    expect(brouillon?.meta.draft).toBe(true);
    expect(getAllArticles().map((a) => a.slug)).not.toContain("exemple-brouillon");
  });

  it("expose un frontmatter complet sur chaque article publié", () => {
    for (const a of getAllArticles()) {
      expect(a.title, `${a.slug}: title`).toBeTruthy();
      expect(a.description, `${a.slug}: description`).toBeTruthy();
      expect(a.date, `${a.slug}: date ISO`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Array.isArray(a.keywords), `${a.slug}: keywords`).toBe(true);
    }
  });
});
