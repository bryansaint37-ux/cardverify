"use client";

import { motion } from "framer-motion";
import type { CardBrand } from "@/types";
import { cn } from "@/lib/utils";

/**
 * Aperçu visuel purement décoratif : il reflète la saisie en cours pour rendre
 * la démonstration lisible. Aucun champ nom / date / cryptogramme n'est demandé.
 */
export function CardPreview({
  formatted,
  brand,
  valid,
}: {
  formatted: string;
  brand: CardBrand;
  valid: boolean;
}) {
  const placeholder = brand.gaps.map((size) => "•".repeat(size)).join(" ");

  return (
    <motion.div
      whileHover={{ rotateX: 4, rotateY: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 250, damping: 20 }}
      style={{ transformPerspective: 800 }}
      className={cn(
        "relative aspect-[1.586/1] w-full max-w-sm overflow-hidden rounded-2xl bg-gradient-to-br p-6 shadow-2xl transition-colors duration-500",
        brand.gradient,
      )}
    >
      <div
        aria-hidden="true"
        className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl"
      />

      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-start justify-between">
          {/* Puce stylisée */}
          <div className="h-8 w-11 rounded-md bg-gradient-to-br from-yellow-200/90 to-yellow-500/90" />
          <span className="text-sm font-semibold tracking-wide text-white/90">
            {brand.id === "unknown" ? "" : brand.label}
          </span>
        </div>

        <div>
          <p className="font-mono text-lg tracking-[0.15em] text-white sm:text-xl">
            {formatted || placeholder}
          </p>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/60">
                Démonstration
              </p>
              <p className="text-sm font-medium tracking-wide text-white/90">
                NUMÉRO DE TEST
              </p>
            </div>

            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-sm",
                valid
                  ? "bg-emerald-400/20 text-emerald-100"
                  : "bg-black/25 text-white/70",
              )}
            >
              {valid ? "Structure valide" : "En attente"}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
