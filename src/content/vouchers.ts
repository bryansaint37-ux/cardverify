export type VoucherFormat = {
  minLength: number;
  maxLength: number;
  /** Motif de caractères accepté — gabarit simplifié, à but pédagogique. */
  pattern: RegExp;
  /** Description humaine du motif, pour les messages d'erreur. */
  hint: string;
};

export type VoucherBrand = {
  id: string;
  name: string;
  description: string;
  /** Texte court utilisé pour l'avatar du coupon. */
  initials: string;
  /** Classes Tailwind du dégradé de marque (purement décoratif, sans logo). */
  gradient: string;
  /** Classe d'ombre colorée assortie au dégradé. */
  glow: string;
  /** Chemin vers le logo réel de la marque (public/logos), si disponible. */
  logo?: string;
  /**
   * Gabarit de format utilisé par la démonstration. Simplifié et fictif :
   * il ne provient d'aucune spécification officielle et ne sert qu'à
   * illustrer un contrôle de saisie côté client.
   */
  format: VoucherFormat;
};

const transcash: VoucherBrand = {
  id: "transcash",
  name: "Transcash",
  initials: "TC",
  description:
    "Carte prépayée rechargeable, utilisée pour payer en ligne sans compte bancaire.",
  gradient: "from-orange-400 to-rose-500",
  glow: "hover:shadow-orange-500/10",
  logo: "/logos/transcash.jpg",
  format: {
    minLength: 16,
    maxLength: 16,
    pattern: /^\d{16}$/,
    hint: "16 chiffres",
  },
};

const pcs: VoucherBrand = {
  id: "pcs",
  name: "PCS",
  initials: "PC",
  description: "Carte prépayée rechargeable, disponible en bureau de tabac.",
  gradient: "from-indigo-400 to-blue-600",
  glow: "hover:shadow-indigo-500/10",
  logo: "/logos/pcs.jpg",
  format: {
    minLength: 16,
    maxLength: 16,
    pattern: /^\d{16}$/,
    hint: "16 chiffres",
  },
};

const paysafecard: VoucherBrand = {
  id: "paysafecard",
  name: "Paysafecard",
  initials: "PS",
  description: "Code prépayé permettant de payer en ligne sans IBAN ni carte bancaire.",
  gradient: "from-sky-400 to-blue-600",
  glow: "hover:shadow-sky-500/10",
  logo: "/logos/paysafecard.jpg",
  format: {
    minLength: 16,
    maxLength: 16,
    pattern: /^\d{16}$/,
    hint: "16 chiffres",
  },
};

const neosurf: VoucherBrand = {
  id: "neosurf",
  name: "Neosurf",
  initials: "NS",
  description: "Coupon prépayé accepté sur de nombreuses plateformes en ligne.",
  gradient: "from-cyan-400 to-teal-500",
  glow: "hover:shadow-cyan-500/10",
  logo: "/logos/neosurf.jpg",
  format: {
    minLength: 10,
    maxLength: 10,
    pattern: /^[A-Z0-9]{10}$/i,
    hint: "10 caractères alphanumériques",
  },
};

const steam: VoucherBrand = {
  id: "steam",
  name: "Steam",
  initials: "ST",
  description: "Carte cadeau destinée à créditer un portefeuille Steam.",
  gradient: "from-slate-400 to-slate-700",
  glow: "hover:shadow-slate-400/10",
  logo: "/logos/steam.jpg",
  format: {
    minLength: 15,
    maxLength: 29,
    pattern: /^[A-Z0-9-]{15,29}$/i,
    hint: "des lettres, des chiffres et éventuellement des tirets",
  },
};

const apple: VoucherBrand = {
  id: "apple",
  name: "Apple Gift Card",
  initials: "AG",
  description: "Carte cadeau destinée à créditer un identifiant Apple.",
  gradient: "from-fuchsia-400 to-purple-600",
  glow: "hover:shadow-fuchsia-500/10",
  format: {
    minLength: 16,
    maxLength: 16,
    pattern: /^[A-Z0-9]{16}$/i,
    hint: "16 caractères alphanumériques",
  },
};

export const voucherBrands: VoucherBrand[] = [
  transcash,
  pcs,
  paysafecard,
  neosurf,
  steam,
  apple,
];

export const defaultVoucherBrand: VoucherBrand = transcash;
