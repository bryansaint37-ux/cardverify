import { CARD_FORMATS } from "@/lib/card-formats";

export type VoucherFormatIssue = {
  code: "empty" | "length" | "charset" | "unknown-type";
  message: string;
};

export type VoucherFormatResult = {
  valid: boolean;
  /** Code après retrait des séparateurs tolérés (espaces, tirets le cas échéant). */
  normalized: string;
  issues: VoucherFormatIssue[];
};

/**
 * Contrôle de forme uniquement : longueur et jeu de caractères attendus par
 * le gabarit fictif du type de carte (voir CARD_FORMATS). Ne vérifie jamais
 * l'existence, le solde ou la validité réelle d'un coupon — aucune
 * spécification officielle n'est consultée, aucune donnée ne quitte le
 * navigateur.
 */
export function validateVoucherFormat(
  type: string,
  rawCode: string,
  label?: string,
): VoucherFormatResult {
  const format = CARD_FORMATS[type];
  const displayName = label ?? type;

  if (!format) {
    return {
      valid: false,
      normalized: rawCode.trim(),
      issues: [{ code: "unknown-type", message: `Type de coupon inconnu : « ${type} ».` }],
    };
  }

  const normalized = format.normalize(rawCode);
  const issues: VoucherFormatIssue[] = [];

  if (!normalized) {
    return {
      valid: false,
      normalized,
      issues: [{ code: "empty", message: "Saisissez un code à tester." }],
    };
  }

  if (normalized.length < format.minLength || normalized.length > format.maxLength) {
    issues.push({
      code: "length",
      message:
        format.minLength === format.maxLength
          ? `${displayName} attend ${format.minLength} caractères, ${normalized.length} fourni(s).`
          : `${displayName} attend entre ${format.minLength} et ${format.maxLength} caractères, ${normalized.length} fourni(s).`,
    });
  }

  if (!format.pattern.test(normalized)) {
    issues.push({
      code: "charset",
      message: `Le code doit être composé de ${format.hint}.`,
    });
  }

  return { valid: issues.length === 0, normalized, issues };
}
