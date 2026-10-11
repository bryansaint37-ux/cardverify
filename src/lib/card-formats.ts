export type CardFormat = {
  /** Longueur minimale attendue, après normalisation. */
  minLength: number;
  /** Longueur maximale attendue, après normalisation. */
  maxLength: number;
  /** Motif de caractères accepté — testé après normalisation. */
  pattern: RegExp;
  /** Retire les séparateurs tolérés à la saisie (espaces, tirets) avant validation. */
  normalize: (raw: string) => string;
};

const trimOnly = (raw: string) => raw.trim();
const stripSpacesAndDashes = (raw: string) => raw.trim().replace(/[\s-]/g, "");

const transcash: CardFormat = {
  minLength: 12,
  maxLength: 12,
  pattern: /^\d{12}$/,
  normalize: trimOnly,
};

const pcs: CardFormat = {
  minLength: 10,
  maxLength: 10,
  pattern: /^[A-Z0-9]{10}$/i,
  normalize: trimOnly,
};

const paysafecard: CardFormat = {
  minLength: 16,
  maxLength: 16,
  pattern: /^\d{16}$/,
  // Seule marque dont le gabarit fictif tolère des tirets à la saisie.
  normalize: stripSpacesAndDashes,
};

const neosurf: CardFormat = {
  minLength: 10,
  maxLength: 10,
  pattern: /^[A-Z0-9]{10}$/i,
  normalize: trimOnly,
};

const steam: CardFormat = {
  minLength: 15,
  maxLength: 29,
  pattern: /^[A-Z0-9-]{15,29}$/i,
  normalize: trimOnly,
};

const apple: CardFormat = {
  minLength: 16,
  maxLength: 16,
  pattern: /^[A-Z0-9]{16}$/i,
  normalize: trimOnly,
};

/**
 * Configuration centralisée des formats de démonstration, par type de carte.
 * Purement fictif et simplifié — ne provient d'aucune spécification
 * officielle. Le texte affiché (indice, exemple) vit dans les fichiers de
 * traduction (`cardFormats.<type>.hint` / `.example`), pas ici : seule la
 * structure de validation est centralisée dans ce fichier.
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
