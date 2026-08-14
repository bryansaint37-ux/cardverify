import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "success" | "danger" | "warning" | "info";

const tones: Record<Tone, string> = {
  neutral: "bg-chip text-ink-2 border-line-soft",
  success: "bg-success-bg text-success border-success-border",
  danger: "bg-danger-bg text-danger border-danger-border",
  warning: "bg-warning-bg text-warning border-warning-border",
  info: "bg-info-bg text-info border-info-border",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-sm",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
