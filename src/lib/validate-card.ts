import type { CardBrand, CardValidation, ValidationIssue } from "@/types";
import { detectBrand } from "@/lib/card-brands";
import { formatCardNumber } from "@/lib/format";
import { luhnCheck } from "@/lib/luhn";
import { onlyDigits } from "@/lib/utils";

/**
 * Validation structurelle complète d'un numéro de carte.
 *
 * Trois contrôles indépendants, du moins au plus spécifique :
 *   1. format   — que des chiffres, longueur plausible (12 à 19) ;
 *   2. réseau   — le préfixe correspond-il à une plage IIN connue, et la
 *                 longueur est-elle autorisée par ce réseau ;
 *   3. checksum — la somme de Luhn est-elle un multiple de 10.
 *
 * Aucun appel réseau, aucun stockage : tout se calcule localement.
 *
 * Retourne des codes d'erreur structurés plutôt que du texte : le texte est
 * produit par `formatCardIssue`, à partir des traductions actives, côté
 * client comme côté serveur.
 */
export function validateCard(input: string): CardValidation {
  const digits = onlyDigits(input);
  const brand = detectBrand(digits);
  const luhn = luhnCheck(digits);
  const issues: ValidationIssue[] = [];

  if (digits.length === 0) {
    issues.push({ code: "empty" });
  } else {
    if (input.replace(/[\s-]/g, "").length !== digits.length) {
      issues.push({ code: "non-digit" });
    }

    if (digits.length < 12) {
      issues.push({ code: "too-short", count: digits.length });
    } else if (digits.length > 19) {
      issues.push({ code: "too-long", count: digits.length });
    }

    if (brand.id === "unknown") {
      issues.push({ code: "unknown-brand" });
    } else if (!brand.lengths.includes(digits.length)) {
      issues.push({ code: "invalid-length", count: digits.length });
    }

    if (!luhn.valid) {
      issues.push({ code: "checksum" });
    }
  }

  return {
    digits,
    formatted: formatCardNumber(digits, brand),
    brand,
    luhn,
    valid: issues.length === 0,
    issues,
  };
}

/** Traducteur générique, compatible `useTranslations()` (client) et `getTranslations()` (serveur) sans espace de noms. */
type Translator = (key: string, values?: Record<string, string | number>) => string;

/** Construit le message lisible d'une erreur de validation, dans la langue active. */
export function formatCardIssue(
  t: Translator,
  brand: CardBrand,
  issue: ValidationIssue,
): string {
  switch (issue.code) {
    case "empty":
      return t("cardValidation.empty");
    case "non-digit":
      return t("cardValidation.nonDigit");
    case "too-short":
      return t("cardValidation.tooShort", { count: issue.count });
    case "too-long":
      return t("cardValidation.tooLong", { count: issue.count });
    case "unknown-brand":
      return t("cardValidation.unknownBrand");
    case "invalid-length":
      return t("cardValidation.invalidLength", {
        brand: t(`cardBrands.${brand.id}`),
        lengths: brand.lengths.join(t("cardValidation.lengthsSeparator")),
        count: issue.count,
      });
    case "checksum":
      return t("cardValidation.checksum");
  }
}
