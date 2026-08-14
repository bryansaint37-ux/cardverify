"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

export type BarDatum = {
  key: string;
  label: string;
  value: number;
  /** Couleur hexadécimale du barreau — identité fixe, jamais recalculée par rang. */
  color: string;
};

/**
 * Graphique en barres autonome (aucune dépendance de rendu graphique).
 * Les barres s'animent à l'apparition ; survol/focus affiche une infobulle.
 * Les valeurs restent lisibles au clavier via `aria-label` sur chaque barre.
 */
export function BarChart({
  data,
  height = 200,
  valueFormatter = (value: number) => String(value),
  directLabels = false,
  ariaLabel,
  className,
}: {
  data: BarDatum[];
  height?: number;
  valueFormatter?: (value: number) => string;
  directLabels?: boolean;
  ariaLabel: string;
  className?: string;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const max = Math.max(1, ...data.map((datum) => datum.value));

  return (
    <div className={className}>
      <div
        role="img"
        aria-label={ariaLabel}
        className="relative flex items-end gap-2 border-b border-line-soft"
        style={{ height }}
      >
        {/* Lignes de repère, discrètes — un cran au-dessus de la surface. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex flex-col justify-between py-1"
        >
          {[0, 1, 2, 3].map((line) => (
            <div key={line} className="h-px w-full bg-line" />
          ))}
        </div>

        {data.map((datum) => {
          const percent =
            datum.value > 0 ? Math.max((datum.value / max) * 100, 4) : 0;
          const isHovered = hovered === datum.key;

          return (
            <div
              key={datum.key}
              className="relative flex h-full flex-1 flex-col items-center justify-end"
            >
              <AnimatePresence>
                {isHovered ? (
                  <motion.div
                    role="tooltip"
                    initial={{ opacity: 0, y: 4, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="glass-strong absolute -top-11 z-10 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs shadow-lg"
                  >
                    <span className="font-semibold text-ink-1">
                      {valueFormatter(datum.value)}
                    </span>
                    <span className="ml-1.5 text-ink-4">{datum.label}</span>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              {directLabels && datum.value > 0 ? (
                <span className="mb-1 text-xs font-medium text-ink-3">
                  {valueFormatter(datum.value)}
                </span>
              ) : null}

              <motion.button
                type="button"
                onMouseEnter={() => setHovered(datum.key)}
                onMouseLeave={() =>
                  setHovered((current) => (current === datum.key ? null : current))
                }
                onFocus={() => setHovered(datum.key)}
                onBlur={() =>
                  setHovered((current) => (current === datum.key ? null : current))
                }
                aria-label={`${datum.label} : ${valueFormatter(datum.value)}`}
                initial={{ height: 0 }}
                animate={{ height: `${percent}%` }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  "w-full max-w-8 rounded-t-[4px] transition-[filter] duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-app",
                )}
                style={{
                  backgroundColor: datum.color,
                  filter: isHovered ? "brightness(1.2)" : "brightness(1)",
                  boxShadow: isHovered ? `0 0 16px -2px ${datum.color}` : "none",
                }}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-2 flex gap-2">
        {data.map((datum) => (
          <span
            key={datum.key}
            className="flex-1 truncate text-center text-[11px] text-ink-4"
          >
            {datum.label}
          </span>
        ))}
      </div>
    </div>
  );
}
