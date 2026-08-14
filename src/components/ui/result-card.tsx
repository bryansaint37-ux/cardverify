"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

type Tone = "success" | "warning" | "danger" | "neutral";

const toneStyles: Record<Tone, { wrapper: string; iconWrapper: string; icon: IconName }> = {
  success: {
    wrapper: "border-success-border bg-success-bg",
    iconWrapper: "bg-success-icon-bg text-success-icon",
    icon: "check",
  },
  warning: {
    wrapper: "border-warning-border bg-warning-bg",
    iconWrapper: "bg-warning-icon-bg text-warning-icon",
    icon: "warning",
  },
  danger: {
    wrapper: "border-danger-border bg-danger-bg",
    iconWrapper: "bg-danger-icon-bg text-danger-icon",
    icon: "cross",
  },
  neutral: {
    wrapper: "border-line bg-card",
    iconWrapper: "bg-chip text-ink-3",
    icon: "info",
  },
};

/**
 * Carte de verdict unique (icône + titre + détail). S'anime automatiquement
 * à l'apparition — le composant se monte et se démonte via le rendu
 * conditionnel de l'appelant, Framer Motion joue `initial` → `animate`.
 */
export function ResultCard({
  tone,
  title,
  description,
  className,
}: {
  tone: Tone;
  title: string;
  description?: ReactNode;
  className?: string;
}) {
  const style = toneStyles[tone];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.97 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "glass flex items-start gap-4 rounded-2xl border p-5",
        style.wrapper,
        className,
      )}
    >
      <span
        className={cn(
          "grid h-12 w-12 shrink-0 place-items-center rounded-full",
          style.iconWrapper,
        )}
      >
        <Icon name={style.icon} size={22} />
      </span>

      <div className="min-w-0">
        <p className="font-semibold text-ink-1">{title}</p>
        {description ? (
          <div className="mt-1 text-sm leading-relaxed text-ink-3">{description}</div>
        ) : null}
      </div>
    </motion.div>
  );
}
