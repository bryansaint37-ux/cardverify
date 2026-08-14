"use client";

import { motion } from "framer-motion";
import { SAMPLE_NUMBERS } from "@/lib/card-brands";
import { getBrandById } from "@/lib/card-brands";
import { formatCardNumber } from "@/lib/format";

/**
 * Raccourcis vers des numéros de test publics — pour éviter toute tentation
 * de saisir une carte réelle.
 */
export function SampleNumbers({
  onSelect,
}: {
  onSelect: (value: string) => void;
}) {
  return (
    <div>
      <p className="text-sm font-medium text-ink-2">Numéros de test publics</p>
      <p className="mt-1 text-xs text-ink-4">
        Publiés par les réseaux pour les environnements de développement. Ils ne
        correspondent à aucun compte.
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {SAMPLE_NUMBERS.map((sample) => {
          const brand = getBrandById(sample.brand);
          return (
            <motion.button
              key={sample.number}
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(sample.number)}
              className="glass rounded-lg px-3 py-2 text-left font-mono text-xs text-ink-2 transition-colors hover:border-accent/50 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              title={sample.note}
            >
              {formatCardNumber(sample.number, brand)}
              <span className="mt-0.5 block font-sans text-[10px] text-ink-4">
                {brand.label}
              </span>
            </motion.button>
          );
        })}

        <motion.button
          type="button"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onSelect("4242424242424241")}
          className="rounded-lg border border-danger-border bg-danger-bg px-3 py-2 text-left font-mono text-xs text-danger transition-colors hover:border-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger"
          title="Dernier chiffre modifié : la somme de Luhn échoue"
        >
          4242 4242 4242 4241
          <span className="mt-0.5 block font-sans text-[10px] text-danger/70">
            Exemple invalide
          </span>
        </motion.button>
      </div>
    </div>
  );
}
