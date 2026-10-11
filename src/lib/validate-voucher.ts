import { CARD_FORMATS } from "@/lib/card-formats";

export type VoucherFormatIssue =
  | { code: "empty" }
  | { code: "unknown-type"; type: string }
  | { code: "length-exact"; count: number; provided: number }
  | { code: "length-range"; min: number; max: number; provided: number }
  | { code: "charset" };

export type VoucherFormatResult = {
  valid: boolean;
  /** Code après retrait des séparateurs tolérés (espaces, tirets le cas échéant). */
  normalized: string;
  type: string;
  issues: VoucherFormatIssue[];
};

/**
 * Contrôle de forme uniquement : longueur et jeu de caractères attendus par
 * le gabarit fictif du type de carte (voir CARD_FORMATS). Ne vérifie jamais
 * l'existence, le solde ou la validité réelle d'un coupon — aucune
 * spécification officielle n'est consultée, aucune donnée ne quitte le
 * navigateur.
 *
 * Retourne des codes d'erreur structurés plutôt que du texte : le texte est
 * produit par `formatVoucherIssue`, à partir des traductions actives, côté
 * client comme côté serveur.
 */
export function validateVoucherFormat(type: string, rawCode: string): VoucherFormatResult {
  const format = CARD_FORMATS[type];

  if (!format) {
    return {
      valid: false,
      normalized: rawCode.trim(),
      type,
      issues: [{ code: "unknown-type", type }],
    };
  }

  const normalized = format.normalize(rawCode);

  if (!normalized) {
    return { valid: false, normalized, type, issues: [{ code: "empty" }] };
  }

  const issues: VoucherFormatIssue[] = [];

  if (normalized.length < format.minLength || normalized.length > format.maxLength) {
    issues.push(
      format.minLength === format.maxLength
        ? { code: "length-exact", count: format.minLength, provided: normalized.length }
        : { code: "length-range", min: format.minLength, max: format.maxLength, provided: normalized.length },
    );
  }

  if (!format.pattern.test(normalized)) {
    issues.push({ code: "charset" });
  }

  return { valid: issues.length === 0, normalized, type, issues };
}

/** Traducteur générique, compatible `useTranslations()` (client) et `getTranslations()` (serveur) sans espace de noms. */
type Translator = (key: string, values?: Record<string, string | number>) => string;

/** Construit le message lisible d'une erreur de format, dans la langue active. */
export function formatVoucherIssue(
  t: Translator,
  type: string,
  brandName: string,
  issue: VoucherFormatIssue,
): string {
  switch (issue.code) {
    case "empty":
      return t("voucherValidation.empty");
    case "unknown-type":
      return t("voucherValidation.unknownType", { type: issue.type });
    case "length-exact":
      return t("voucherValidation.lengthExact", {
        name: brandName,
        count: issue.count,
        provided: issue.provided,
      });
    case "length-range":
      return t("voucherValidation.lengthRange", {
        name: brandName,
        min: issue.min,
        max: issue.max,
        provided: issue.provided,
      });
    case "charset":
      return t("voucherValidation.charset", { hint: t(`cardFormats.${type}.hint`) });
  }
}
