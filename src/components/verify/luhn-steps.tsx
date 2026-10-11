"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { LuhnResult } from "@/types";
import { cn } from "@/lib/utils";

/**
 * Décomposition visuelle du calcul : un jeton par chiffre, dans l'ordre de
 * lecture. Les chiffres doublés sont mis en évidence.
 */
export function LuhnSteps({ luhn }: { luhn: LuhnResult }) {
  const t = useTranslations("demoPage.luhnSteps");

  if (luhn.steps.length === 0) {
    return <p className="text-sm text-ink-4">{t("placeholder")}</p>;
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {luhn.steps.map((step, index) => (
          <motion.div
            key={step.position}
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.25, delay: index * 0.02 }}
            className={cn(
              "flex min-w-12 flex-col items-center rounded-lg border px-2 py-2 font-mono text-sm",
              step.doubled
                ? "border-accent/40 bg-info-bg text-accent"
                : "border-line-soft bg-chip text-ink-2",
            )}
            title={
              step.doubled
                ? t("digitDoubledTitle", { digit: step.digit, value: step.value })
                : t("digitUnchangedTitle", { digit: step.digit })
            }
          >
            <span className="text-ink-4">{step.digit}</span>
            <span
              aria-hidden="true"
              className="my-1 h-px w-full bg-current opacity-20"
            />
            <span className="font-semibold">{step.value}</span>
          </motion.div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
        <p className="text-ink-3">
          {t("sum")}{" "}
          <span className="font-mono font-semibold text-ink-1">{luhn.sum}</span>
        </p>
        <p className="text-ink-3">
          {t("modulo", { sum: luhn.sum })}{" "}
          <span
            className={cn(
              "font-mono font-semibold",
              luhn.valid ? "text-success" : "text-danger",
            )}
          >
            {luhn.sum % 10}
          </span>
        </p>
        <p className="flex items-center gap-2 text-ink-4">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-accent/40" />
          {t("doubledLegend")}
        </p>
      </div>
    </div>
  );
}
