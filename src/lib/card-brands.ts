import type { CardBrand, CardBrandId } from "@/types";

/**
 * Table des réseaux, identifiés par leur IIN (Issuer Identification Number),
 * les six à huit premiers chiffres du numéro. Les plages ci-dessous sont
 * publiques et documentées par la norme ISO/IEC 7812.
 */
export const CARD_BRANDS: CardBrand[] = [
  {
    id: "visa",
    label: "Visa",
    pattern: /^4/,
    lengths: [13, 16, 19],
    cvcLength: 3,
    gaps: [4, 4, 4, 4],
    gradient: "from-blue-600 to-indigo-700",
  },
  {
    id: "mastercard",
    label: "Mastercard",
    pattern: /^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]|720))/,
    lengths: [16],
    cvcLength: 3,
    gaps: [4, 4, 4, 4],
    gradient: "from-orange-500 to-red-600",
  },
  {
    id: "amex",
    label: "American Express",
    pattern: /^3[47]/,
    lengths: [15],
    cvcLength: 4,
    gaps: [4, 6, 5],
    gradient: "from-teal-500 to-cyan-700",
  },
  {
    id: "discover",
    label: "Discover",
    pattern: /^(6011|64[4-9]|65)/,
    lengths: [16, 19],
    cvcLength: 3,
    gaps: [4, 4, 4, 4],
    gradient: "from-amber-500 to-orange-600",
  },
  {
    id: "jcb",
    label: "JCB",
    pattern: /^35(2[89]|[3-8]\d)/,
    lengths: [16, 17, 18, 19],
    cvcLength: 3,
    gaps: [4, 4, 4, 4],
    gradient: "from-emerald-500 to-green-700",
  },
  {
    id: "diners",
    label: "Diners Club",
    pattern: /^3(0[0-5]|[68])/,
    lengths: [14, 16, 19],
    cvcLength: 3,
    gaps: [4, 6, 4],
    gradient: "from-slate-500 to-slate-700",
  },
  {
    id: "unionpay",
    label: "UnionPay",
    pattern: /^62/,
    lengths: [16, 17, 18, 19],
    cvcLength: 3,
    gaps: [4, 4, 4, 4],
    gradient: "from-rose-500 to-pink-700",
  },
  {
    id: "maestro",
    label: "Maestro",
    pattern: /^(5018|5020|5038|6304|6759|676[1-3])/,
    lengths: [12, 13, 14, 15, 16, 17, 18, 19],
    cvcLength: 3,
    gaps: [4, 4, 4, 4],
    gradient: "from-violet-500 to-purple-700",
  },
];

export const UNKNOWN_BRAND: CardBrand = {
  id: "unknown",
  label: "Réseau inconnu",
  pattern: /^$/,
  lengths: [12, 13, 14, 15, 16, 17, 18, 19],
  cvcLength: 3,
  gaps: [4, 4, 4, 4],
  gradient: "from-slate-600 to-slate-800",
};

/** Détecte le réseau à partir des premiers chiffres saisis. */
export function detectBrand(digits: string): CardBrand {
  if (!digits) return UNKNOWN_BRAND;
  return CARD_BRANDS.find((brand) => brand.pattern.test(digits)) ?? UNKNOWN_BRAND;
}

export function getBrandById(id: CardBrandId): CardBrand {
  return CARD_BRANDS.find((brand) => brand.id === id) ?? UNKNOWN_BRAND;
}

/**
 * Numéros de test publics, fournis par les réseaux eux-mêmes pour les
 * environnements de développement. Ils ne correspondent à aucun compte.
 */
export const SAMPLE_NUMBERS: { brand: CardBrandId; number: string; note: string }[] =
  [
    { brand: "visa", number: "4242424242424242", note: "Visa — 16 chiffres" },
    {
      brand: "mastercard",
      number: "5555555555554444",
      note: "Mastercard — 16 chiffres",
    },
    { brand: "amex", number: "378282246310005", note: "Amex — 15 chiffres" },
    {
      brand: "discover",
      number: "6011111111111117",
      note: "Discover — 16 chiffres",
    },
  ];
