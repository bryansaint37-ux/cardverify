import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

type Tone = "info" | "success" | "warning" | "danger";

const tones: Record<Tone, { wrapper: string; icon: IconName; iconColor: string }> = {
  info: {
    wrapper: "border-info-border bg-info-bg",
    icon: "info",
    iconColor: "text-info",
  },
  success: {
    wrapper: "border-success-border bg-success-bg",
    icon: "check",
    iconColor: "text-success",
  },
  warning: {
    wrapper: "border-warning-border bg-warning-bg",
    icon: "warning",
    iconColor: "text-warning",
  },
  danger: {
    wrapper: "border-danger-border bg-danger-bg",
    icon: "cross",
    iconColor: "text-danger",
  },
};

export function Alert({
  tone = "info",
  title,
  children,
  className,
}: {
  tone?: Tone;
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  const config = tones[tone];

  return (
    <div
      role={tone === "danger" || tone === "warning" ? "alert" : undefined}
      className={cn(
        "flex gap-3 rounded-xl border p-4 backdrop-blur-sm",
        config.wrapper,
        className,
      )}
    >
      <Icon name={config.icon} size={18} className={cn("mt-0.5", config.iconColor)} />
      <div className="min-w-0 flex-1">
        {title ? <p className="mb-1 font-semibold text-ink-1">{title}</p> : null}
        <div className="text-sm leading-relaxed text-ink-2">{children}</div>
      </div>
    </div>
  );
}
