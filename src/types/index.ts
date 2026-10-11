/** Identifiant d'un réseau de cartes reconnu par la démonstration. */
export type CardBrandId =
  | "visa"
  | "mastercard"
  | "amex"
  | "discover"
  | "jcb"
  | "diners"
  | "unionpay"
  | "maestro"
  | "unknown";

export type CardBrand = {
  id: CardBrandId;
  label: string;
  /** Préfixes IIN/BIN, sous forme d'expression régulière ancrée au début. */
  pattern: RegExp;
  /** Longueurs totales valides (chiffres, hors espaces). */
  lengths: number[];
  /** Longueur du cryptogramme visuel. */
  cvcLength: number;
  /** Groupes d'affichage, ex. [4, 4, 4, 4] → 4242 4242 4242 4242 */
  gaps: number[];
  /** Classe Tailwind de dégradé, pour l'aperçu visuel. */
  gradient: string;
};

/** Une étape du calcul de Luhn, pour l'affichage pédagogique. */
export type LuhnStep = {
  /** Position affichée (1 = chiffre le plus à gauche). */
  position: number;
  digit: number;
  /** Vrai si le chiffre est doublé (positions paires en partant de la droite). */
  doubled: boolean;
  /** Valeur après doublement et éventuelle soustraction de 9. */
  value: number;
};

export type LuhnResult = {
  valid: boolean;
  sum: number;
  checkDigit: number | null;
  steps: LuhnStep[];
};

export type ValidationIssue =
  | { code: "empty" }
  | { code: "non-digit" }
  | { code: "too-short"; count: number }
  | { code: "too-long"; count: number }
  | { code: "unknown-brand" }
  | { code: "invalid-length"; count: number }
  | { code: "checksum" };

export type CardValidation = {
  /** Numéro nettoyé (chiffres uniquement). */
  digits: string;
  /** Numéro formaté selon le réseau détecté. */
  formatted: string;
  brand: CardBrand;
  luhn: LuhnResult;
  /** Vrai si le réseau, la longueur ET la somme de contrôle sont cohérents. */
  valid: boolean;
  issues: ValidationIssue[];
};
