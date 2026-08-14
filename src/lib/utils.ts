/**
 * Concatène des classes conditionnelles sans dépendance externe.
 * `cn("a", false && "b", ["c", null], "d")` → "a c d"
 */
export type ClassValue =
  | string
  | number
  | null
  | undefined
  | false
  | ClassValue[];

export function cn(...inputs: ClassValue[]): string {
  const out: string[] = [];

  for (const input of inputs) {
    if (!input && input !== 0) continue;
    if (Array.isArray(input)) {
      const nested = cn(...input);
      if (nested) out.push(nested);
    } else {
      out.push(String(input));
    }
  }

  return out.join(" ");
}

/** Retourne uniquement les chiffres d'une chaîne. */
export function onlyDigits(value: string): string {
  return value.replace(/\D+/g, "");
}

/** Slugifie un titre pour en faire une ancre HTML stable. */
export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
