import { describe, it, expect } from "vitest";
import { siteConfig } from "@/data/siteConfig";

describe("siteConfig", () => {
  it("expose le téléphone au format E.164 et l'URL WhatsApp assortie", () => {
    expect(siteConfig.phone).toBe("+33618972250");
    expect(siteConfig.whatsappUrl).toBe("https://wa.me/33618972250");
  });
  it("expose la grille tarifaire validée", () => {
    expect(siteConfig.prices.vitrine.from).toBe(1190);
    expect(siteConfig.prices.surMesure.from).toBe(3900);
    expect(siteConfig.prices.maintenance.monthly).toBe(79);
  });
});
