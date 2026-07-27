import { describe, it, expect } from "vitest";
import { estimateFromBrief } from "@/lib/estimate";

describe("estimateFromBrief", () => {
  it("un site vitrine simple part du prix d'appel", () => {
    const r = estimateFromBrief({ projectType: "site-vitrine", features: { selected: [], other: "" } } as never);
    expect(r.min).toBe(1190);
    expect(r.max).toBeGreaterThanOrEqual(1500);
  });
  it("chaque fonctionnalité cochée augmente la fourchette", () => {
    const base = estimateFromBrief({ projectType: "site-vitrine", features: { selected: [], other: "" } } as never);
    const plus = estimateFromBrief({ projectType: "site-vitrine", features: { selected: ["a", "b", "c"], other: "" } } as never);
    expect(plus.min).toBeGreaterThan(base.min);
    expect(plus.max).toBeGreaterThan(base.max);
  });
  it("une application web sur mesure part de 3900 minimum", () => {
    const r = estimateFromBrief({ projectType: "application-web", features: { selected: [], other: "" } } as never);
    expect(r.min).toBeGreaterThanOrEqual(3900);
  });
  it("arrondit à la centaine", () => {
    const r = estimateFromBrief({ projectType: "site-vitrine", features: { selected: ["a"], other: "" } } as never);
    expect(r.min % 100).toBe(0);
    expect(r.max % 100).toBe(0);
  });
  it("une landing page part de la base vitrine (petit format)", () => {
    const r = estimateFromBrief({ projectType: "landing-page", features: { selected: [], other: "" } } as never);
    expect(r.min).toBe(1190);
  });
  it("une maintenance ou un développement sur mesure part de la base sur-mesure", () => {
    const dev = estimateFromBrief({ projectType: "developpement-sur-mesure", features: { selected: [], other: "" } } as never);
    const maintenance = estimateFromBrief({ projectType: "maintenance", features: { selected: [], other: "" } } as never);
    expect(dev.min).toBeGreaterThanOrEqual(3900);
    expect(maintenance.min).toBeGreaterThanOrEqual(3900);
  });
});
