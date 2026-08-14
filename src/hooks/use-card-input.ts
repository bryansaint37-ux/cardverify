"use client";

import { useCallback, useMemo, useState } from "react";
import type { CardValidation } from "@/types";
import { detectBrand } from "@/lib/card-brands";
import { formatCardNumber, maxLengthFor } from "@/lib/format";
import { validateCard } from "@/lib/validate-card";
import { onlyDigits } from "@/lib/utils";

/**
 * État du champ « numéro de carte ».
 *
 * La valeur affichée est toujours reformatée à partir des chiffres bruts :
 * la saisie reste cohérente quel que soit le collage ou l'espacement d'origine.
 * Aucune persistance — l'état vit et meurt avec le composant.
 */
export function useCardInput(initialValue = "") {
  const [rawDigits, setRawDigits] = useState(() =>
    onlyDigits(initialValue).slice(0, 19),
  );
  const [touched, setTouched] = useState(false);

  const brand = useMemo(() => detectBrand(rawDigits), [rawDigits]);

  const displayValue = useMemo(
    () => formatCardNumber(rawDigits, brand),
    [rawDigits, brand],
  );

  const validation: CardValidation = useMemo(
    () => validateCard(rawDigits),
    [rawDigits],
  );

  const setValue = useCallback((next: string) => {
    // 19 chiffres : longueur maximale autorisée par l'ISO/IEC 7812.
    setRawDigits(onlyDigits(next).slice(0, 19));
    setTouched(true);
  }, []);

  const reset = useCallback(() => {
    setRawDigits("");
    setTouched(false);
  }, []);

  return {
    /** Chiffres bruts, sans séparateur. */
    rawDigits,
    /** Valeur formatée à afficher dans l'input. */
    displayValue,
    /** Longueur maximale du champ formaté, espaces compris. */
    maxLength: maxLengthFor(brand) + brand.gaps.length,
    brand,
    validation,
    touched,
    setValue,
    reset,
  };
}
