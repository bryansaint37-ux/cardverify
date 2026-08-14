export type CardFormat = {
  /** Longueur minimale attendue, après normalisation. */
  minLength: number;
  /** Longueur maximale attendue, après normalisation. */
  maxLength: number;
  /** Motif de caractères accepté — testé après normalisation. */
  pattern: RegExp;
  /** Description humaine du motif, pour les messages d'erreur et l'indication de format. */
  hint: string;
  /** Exemple fictif affiché à l'utilisateur. */
  example: string;
  /** Valeur affichée en filigrane dans le champ vide — peut inclure des séparateurs visuels. */
  placeholder: string;
  /** Retire les séparateurs tolérés à la saisie (espaces, tirets) avant validation. */
  normalize: (raw: string) => string;
};

const trimOnly = (raw: string) => raw.trim();
const stripSpacesAndDashes = (raw: string) => raw.trim().replace(/[\s-]/g, "");

const transcash: CardFormat = {
  minLength: 12,
  maxLength: 12,
  pattern: /^\d{12}$/,
  hint: "12 chiffres",
  example: "123456789123",
  placeholder: "123456789123",
  normalize: trimOnly,
};

const pcs: CardFormat = {
  minLength: 10,
  maxLength: 10,
  pattern: /^[A-Z0-9]{10}$/i,
  hint: "10 caractères alphanumériques",
  example: "A7218JH12X",
  placeholder: "A7218JH12X",
  normalize: trimOnly,
};

const paysafecard: CardFormat = {
  minLength: 16,
  maxLength: 16,
  pattern: /^\d{16}$/,
  hint: "16 chiffres (tirets optionnels)",
  example: "1234-1234-1234-1234",
  placeholder: "1234-1234-1234-1234",
  // Seule marque dont le gabarit fictif tolère des tirets à la saisie.
  normalize: stripSpacesAndDashes,
};

const neosurf: CardFormat = {
  minLength: 10,
  maxLength: 10,
  pattern: /^[A-Z0-9]{10}$/i,
  hint: "10 caractères alphanumériques",
  example: "ABC1234567",
  placeholder: "ABC1234567",
  normalize: trimOnly,
};

const steam: CardFormat = {
  minLength: 15,
  maxLength: 29,
  pattern: /^[A-Z0-9-]{15,29}$/i,
  hint: "des lettres, des chiffres et éventuellement des tirets",
  example: "STEAM-5F27K-9QX3P",
  placeholder: "STEAM-5F27K-9QX3P",
  normalize: trimOnly,
};

const apple: CardFormat = {
  minLength: 16,
  maxLength: 16,
  pattern: /^[A-Z0-9]{16}$/i,
  hint: "16 caractères alphanumériques",
  example: "X7K9P2M4Q8R1T5W3",
  placeholder: "X7K9P2M4Q8R1T5W3",
  normalize: trimOnly,
};

/**
 * Configuration centralisée des formats de démonstration, par type de carte.
 * Purement fictif et simplifié — ne provient d'aucune spécification
 * officielle. La modifier ici suffit à changer la validation partout
 * (formulaire, aperçu du coupon, route /api/verify).
 */
export const CARD_FORMATS: Record<string, CardFormat> = {
  transcash,
  pcs,
  paysafecard,
  neosurf,
  steam,
  apple,
};

/** Repli utilisé si un identifiant de type inconnu est rencontré. */
export const DEFAULT_CARD_FORMAT: CardFormat = transcash;

export function getCardFormat(type: string): CardFormat {
  return CARD_FORMATS[type] ?? DEFAULT_CARD_FORMAT;
}
