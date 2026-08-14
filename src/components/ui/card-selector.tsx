"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

export type CardSelectorOption = {
  id: string;
  label: string;
  /** Classes Tailwind du dégradé utilisé pour le badge (ex. "from-sky-400 to-indigo-600"). */
  gradient: string;
  /** Photo réelle de la marque, si disponible — remplace le badge d'initiales. */
  logo?: string;
};

/** Sélecteur d'options en grille de tuiles — alternative visuelle à un <select>. */
export function CardSelector({
  options,
  value,
  onChange,
  label,
  className,
}: {
  options: CardSelectorOption[];
  value: string;
  onChange: (id: string) => void;
  label?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      {label ? (
        <span className="block text-sm font-medium text-ink-2">{label}</span>
      ) : null}

      <div
        role="radiogroup"
        aria-label={label}
        className={cn("grid grid-cols-2 gap-3 sm:grid-cols-3", label && "mt-2")}
      >
        {options.map((option) => {
          const selected = option.id === value;
          return (
            <motion.button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(option.id)}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 350, damping: 22 }}
              className={cn(
                "glass flex flex-col items-center gap-2 rounded-xl px-3 py-4 text-center transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-app",
                selected
                  ? "border-accent glow-accent bg-info-bg"
                  : "hover:border-line-soft hover:bg-card-hover",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg text-xs font-bold text-white shadow",
                  option.logo ? "bg-white p-1" : cn("bg-gradient-to-br", option.gradient),
                )}
              >
                {option.logo ? (
                  <Image
                    src={option.logo}
                    alt=""
                    width={24}
                    height={24}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  option.label.slice(0, 2).toUpperCase()
                )}
              </span>
              <span
                className={cn(
                  "text-xs font-medium",
                  selected ? "text-accent" : "text-ink-2",
                )}
              >
                {option.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
