export type NavKey = "verify" | "dashboard" | "demo" | "algorithm";

export type NavItem = {
  key: NavKey;
  href: string;
};

export const mainNav: NavItem[] = [
  { key: "verify", href: "/verifier" },
  { key: "dashboard", href: "/dashboard" },
  { key: "demo", href: "/verification" },
  { key: "algorithm", href: "/algorithme" },
];

export type FooterNavKey =
  | "verify"
  | "demo"
  | "algorithm"
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
    ],
  },
  {
    group: "resources",
    items: [
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
