export type NavItem = {
  label: string;
  href: string;
  description?: string;
};

export const mainNav: NavItem[] = [
  {
    label: "Vérifier",
    href: "/verifier",
    description: "Simulation interactive de coupon",
  },
  {
    label: "Tableau de bord",
    href: "/dashboard",
    description: "Statistiques sur données réelles de vérification",
  },
  {
    label: "Démonstration",
    href: "/verification",
    description: "Testez l'algorithme en direct",
  },
  {
    label: "Algorithme",
    href: "/algorithme",
    description: "Le calcul de Luhn, étape par étape",
  },
  { label: "FAQ", href: "/faq" },
  { label: "À propos", href: "/a-propos" },
];

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "Produit",
    items: [
      { label: "Vérifier un coupon", href: "/verifier" },
      { label: "Démonstration", href: "/verification" },
      { label: "Algorithme de Luhn", href: "/algorithme" },
      { label: "Questions fréquentes", href: "/faq" },
    ],
  },
  {
    title: "Ressources",
    items: [
      { label: "À propos du projet", href: "/a-propos" },
      { label: "Contact", href: "/contact" },
      { label: "Plan du site", href: "/sitemap.xml" },
    ],
  },
  {
    title: "Légal",
    items: [
      { label: "Mentions légales", href: "/mentions-legales" },
      { label: "Confidentialité", href: "/confidentialite" },
    ],
  },
];
