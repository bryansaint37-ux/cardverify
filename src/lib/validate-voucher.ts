import type { VoucherBrand } from "@/content/vouchers";

export type VoucherFormatIssue = {
  code: "empty" | "length" | "charset";
  message: string;
};

export type VoucherFormatResult = {
  valid: boolean;
  issues: VoucherFormatIssue[];
};

/**
 * Contrôle de forme uniquement : longueur et jeu de caractères attendus par
 * le gabarit fictif de la marque. Ne vérifie jamais l'existence, le solde ou
 * la validité réelle d'un coupon — aucune spécification officielle n'est
 * consultée, aucune donnée ne quitte le navigateur.
 */
export function validateVoucherFormat(
  brand: VoucherBrand,
  rawCode: string,
): VoucherFormatResult {
  const code = rawCode.trim();
  const issues: VoucherFormatIssue[] = [];

  if (!code) {
    return {
      valid: false,
      issues: [{ code: "empty", message: "Saisissez un code à tester." }],
    };
  }

  const { minLength, maxLength, pattern, hint } = brand.format;

  if (code.length < minLength || code.length > maxLength) {
    issues.push({
      code: "length",
      message:
        minLength === maxLength
          ? `${brand.name} attend ${minLength} caractères, ${code.length} fourni(s).`
          : `${brand.name} attend entre ${minLength} et ${maxLength} caractères, ${code.length} fourni(s).`,
    });
  }

  if (!pattern.test(code)) {
    issues.push({
      code: "charset",
      message: `Le code doit être composé de ${hint}.`,
    });
  }

  return { valid: issues.length === 0, issues };
}
