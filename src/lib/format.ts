import type { CardBrand } from "@/types";
import { onlyDigits } from "@/lib/utils";

/** Regroupe les chiffres selon le gabarit du réseau (ex. 4-6-5 pour Amex). */
export function formatCardNumber(value: string, brand: CardBrand): string {
  const digits = onlyDigits(value);
  if (!digits) return "";

  const groups: string[] = [];
  let offset = 0;

  for (const size of brand.gaps) {
    if (offset >= digits.length) break;
    groups.push(digits.slice(offset, offset + size));
    offset += size;
  }

  // Chiffres excédentaires (numéros à 19 chiffres) : groupes de 4.
  while (offset < digits.length) {
    groups.push(digits.slice(offset, offset + 4));
    offset += 4;
  }

  return groups.join(" ");
}

/** Longueur maximale acceptée par le réseau. */
export function maxLengthFor(brand: CardBrand): number {
  return Math.max(...brand.lengths);
}

/**
 * Masque le numéro façon reçu bancaire : seuls les quatre derniers chiffres
 * restent lisibles. Utilisé pour l'affichage, jamais pour le calcul.
 */
export function maskCardNumber(value: string): string {
  const digits = onlyDigits(value);
  if (digits.length <= 4) return digits;

  const last4 = digits.slice(-4);
  const hidden = "•".repeat(digits.length - 4);
  return `${hidden}${last4}`.replace(/(.{4})/g, "$1 ").trim();
}

/** Formate un entier avec séparateurs de milliers en français. */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("fr-FR").format(value);
}
