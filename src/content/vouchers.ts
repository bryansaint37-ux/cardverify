export type VoucherBrand = {
  id: string;
  /** Nom de marque — identique dans toutes les langues, jamais traduit. */
  name: string;
  /** Texte court utilisé pour l'avatar du coupon. */
  initials: string;
  /** Classes Tailwind du dégradé de marque (purement décoratif, sans logo). */
  gradient: string;
  /** Classe d'ombre colorée assortie au dégradé. */
  glow: string;
  /** Chemin vers le logo réel de la marque (public/logos), si disponible. */
  logo?: string;
};

const transcash: VoucherBrand = {
  id: "transcash",
  name: "Transcash",
  initials: "TC",
  gradient: "from-orange-400 to-rose-500",
  glow: "hover:shadow-orange-500/10",
  logo: "/logos/transcash.jpg",
};

const pcs: VoucherBrand = {
  id: "pcs",
  name: "PCS",
  initials: "PC",
  gradient: "from-indigo-400 to-blue-600",
  glow: "hover:shadow-indigo-500/10",
  logo: "/logos/pcs.jpg",
};

const paysafecard: VoucherBrand = {
  id: "paysafecard",
  name: "Paysafecard",
  initials: "PS",
  gradient: "from-sky-400 to-blue-600",
  glow: "hover:shadow-sky-500/10",
  logo: "/logos/paysafecard.jpg",
};

const neosurf: VoucherBrand = {
  id: "neosurf",
  name: "Neosurf",
  initials: "NS",
  gradient: "from-cyan-400 to-teal-500",
  glow: "hover:shadow-cyan-500/10",
  logo: "/logos/neosurf.jpg",
};

const steam: VoucherBrand = {
  id: "steam",
  name: "Steam",
  initials: "ST",
  gradient: "from-slate-400 to-slate-700",
  glow: "hover:shadow-slate-400/10",
  logo: "/logos/steam.jpg",
};

const apple: VoucherBrand = {
  id: "apple",
  name: "Apple Gift Card",
  initials: "AG",
  gradient: "from-fuchsia-400 to-purple-600",
  glow: "hover:shadow-fuchsia-500/10",
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
