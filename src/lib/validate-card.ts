import type { CardValidation, ValidationIssue } from "@/types";
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
 */
export function validateCard(input: string): CardValidation {
  const digits = onlyDigits(input);
  const brand = detectBrand(digits);
  const luhn = luhnCheck(digits);
  const issues: ValidationIssue[] = [];

  if (digits.length === 0) {
    issues.push({ code: "empty", message: "Saisissez un numéro à vérifier." });
  } else {
    if (input.replace(/[\s-]/g, "").length !== digits.length) {
      issues.push({
        code: "non-digit",
        message: "Le numéro contient des caractères non numériques.",
      });
    }

    if (digits.length < 12) {
      issues.push({
        code: "too-short",
        message: `Numéro trop court : ${digits.length} chiffre(s) sur 12 minimum.`,
      });
    } else if (digits.length > 19) {
      issues.push({
        code: "too-long",
        message: `Numéro trop long : ${digits.length} chiffres, 19 au maximum.`,
      });
    }

    if (brand.id === "unknown") {
      issues.push({
        code: "unknown-brand",
        message: "Aucun réseau connu ne correspond à ce préfixe IIN.",
      });
    } else if (!brand.lengths.includes(digits.length)) {
      issues.push({
        code: "invalid-length",
        message: `${brand.label} attend ${brand.lengths.join(" ou ")} chiffres, ${digits.length} fournis.`,
      });
    }

    if (!luhn.valid) {
      issues.push({
        code: "checksum",
        message: "La somme de contrôle de Luhn est incorrecte.",
      });
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
