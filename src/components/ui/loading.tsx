"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type LoadingSize = "sm" | "md" | "lg";
/** "current" hérite du texte ambiant ; "inverted" pour un fond clair (ex. bouton primaire). */
type LoadingTone = "current" | "inverted";

const sizes: Record<LoadingSize, string> = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-9 w-9 border-[3px]",
};

const tones: Record<LoadingTone, string> = {
  current: "border-line-soft border-t-accent",
  inverted: "border-accent-ink/30 border-t-accent-ink",
};

export function Loading({
  size = "md",
  tone = "current",
  label,
  className,
}: {
  size?: LoadingSize;
  tone?: LoadingTone;
  label?: string;
  className?: string;
}) {
  const t = useTranslations("common");

  return (
    <span role="status" className={cn("inline-flex items-center gap-2", className)}>
      <span
        aria-hidden="true"
        className={cn("animate-spin rounded-full", sizes[size], tones[tone])}
      />
      {label ? (
        <span>{label}</span>
      ) : (
        <span className="sr-only">{t("loading")}</span>
      )}
    </span>
  );
}
