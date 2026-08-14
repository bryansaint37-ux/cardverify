import type { LuhnResult, LuhnStep } from "@/types";
import { onlyDigits } from "@/lib/utils";

/**
 * Algorithme de Luhn (norme ISO/IEC 7812-1), aussi appelé « modulo 10 ».
 *
 * Principe :
 *  1. On parcourt les chiffres de droite à gauche.
 *  2. Un chiffre sur deux (en partant de l'avant-dernier) est doublé.
 *  3. Si le doublement dépasse 9, on retranche 9 (équivaut à sommer les chiffres).
 *  4. Le numéro est valide si la somme totale est un multiple de 10.
 *
 * C'est une somme de contrôle : elle détecte les fautes de frappe et les
 * inversions de chiffres. Elle ne dit RIEN de l'existence réelle d'un compte.
 */
export function luhnCheck(input: string): LuhnResult {
  const digits = onlyDigits(input);

  if (digits.length === 0) {
    return { valid: false, sum: 0, checkDigit: null, steps: [] };
  }

  const steps: LuhnStep[] = [];
  let sum = 0;

  for (let i = digits.length - 1; i >= 0; i -= 1) {
    const digit = Number(digits[i]);
    // Distance depuis la droite : 0 pour la clé de contrôle, 1 pour son voisin…
    const fromRight = digits.length - 1 - i;
    const doubled = fromRight % 2 === 1;

    let value = digit;
    if (doubled) {
      value = digit * 2;
      if (value > 9) value -= 9;
    }

    sum += value;
    steps.push({ position: i + 1, digit, doubled, value });
  }

  // Les étapes sont calculées de droite à gauche : on rétablit l'ordre de lecture.
  steps.reverse();

  return {
    valid: sum % 10 === 0,
    sum,
    checkDigit: Number(digits[digits.length - 1]),
    steps,
  };
}

/**
 * Calcule la clé de contrôle qui rendrait `partialNumber` valide.
 * Utile pour générer des numéros de test conformes à la norme.
 */
export function luhnCheckDigit(partialNumber: string): number {
  const digits = onlyDigits(partialNumber);
  let sum = 0;

  for (let i = digits.length - 1; i >= 0; i -= 1) {
    const fromRight = digits.length - 1 - i;
    // La clé occupera la position 0 depuis la droite : le décalage s'inverse.
    const doubled = fromRight % 2 === 0;

    let value = Number(digits[i]);
    if (doubled) {
      value *= 2;
      if (value > 9) value -= 9;
    }

    sum += value;
  }

  return (10 - (sum % 10)) % 10;
}

/** Complète un préfixe avec une clé de Luhn valide. */
export function luhnComplete(partialNumber: string): string {
  const digits = onlyDigits(partialNumber);
  return `${digits}${luhnCheckDigit(digits)}`;
}
