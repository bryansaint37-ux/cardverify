export type NavKey = "verify" | "dashboard" | "demo" | "algorithm" | "faq" | "about";

export type NavItem = {
  key: NavKey;
  href: string;
};

export const mainNav: NavItem[] = [
  { key: "verify", href: "/verifier" },
  { key: "dashboard", href: "/dashboard" },
  { key: "demo", href: "/verification" },
  { key: "algorithm", href: "/algorithme" },
  { key: "faq", href: "/faq" },
  { key: "about", href: "/a-propos" },
];

export type FooterNavKey =
  | "verify"
  | "demo"
  | "algorithm"
  | "faq"
  | "about"
  | "contact"
  | "sitemap"
  | "legalNotice"
  | "privacy";

export const footerNav: { group: "product" | "resources" | "legal"; items: { key: FooterNavKey; href: string }[] }[] = [
  {
    group: "product",
    items: [
      { key: "verify", href: "/verifier" },
      { key: "demo", href: "/verification" },
      { key: "algorithm", href: "/algorithme" },
      { key: "faq", href: "/faq" },
    ],
  },
  {
    group: "resources",
    items: [
      { key: "about", href: "/a-propos" },
      { key: "contact", href: "/contact" },
      { key: "sitemap", href: "/sitemap.xml" },
    ],
  },
  {
    group: "legal",
    items: [
      { key: "legalNotice", href: "/mentions-legales" },
      { key: "privacy", href: "/confidentialite" },
    ],
  },
];
