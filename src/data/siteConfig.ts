export const siteConfig = {
  name: "JBR Development",
  url: "https://jbrdevelopment.fr",
  phone: "+33618972250",
  phoneDisplay: "06 18 97 22 50",
  whatsappUrl: "https://wa.me/33618972250",
  email: "jb@jbrdevelopment.fr",
  city: "Lille",
  responseTimeHours: 24,
  googleReviewsUrl: "https://share.google/TrBD8GioYeNPAUJ37",
  prices: {
    vitrine: { from: 1190, currency: "EUR" as const },
    surMesure: { from: 3900, typicalMin: 5000, typicalMax: 9000, currency: "EUR" as const },
    maintenance: { monthly: 79, currency: "EUR" as const },
  },
} as const;

export type SiteConfig = typeof siteConfig;
