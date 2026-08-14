/**
 * Source unique de vérité pour l'identité du site.
 * Toute métadonnée SEO découle de cet objet.
 */
export const siteConfig = {
  name: "Card Verify",
  shortName: "CardVerify",
  tagline: "Comprendre la validation des numéros de carte",
  description:
    "Card Verify est une démonstration pédagogique de l'algorithme de Luhn : validez la structure d'un numéro de carte, identifiez le réseau émetteur et visualisez chaque étape du calcul, directement dans votre navigateur.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "fr_FR",
  lang: "fr",
  author: "Card Verify",
  themeColor: "#0f172a",
  keywords: [
    "algorithme de Luhn",
    "validation numéro de carte",
    "checksum",
    "modulo 10",
    "IIN",
    "BIN",
    "démonstration pédagogique",
    "Next.js",
  ],
  links: {
    github: "https://github.com/example/card-verify",
    docs: "/algorithme",
  },
} as const;

export type SiteConfig = typeof siteConfig;
