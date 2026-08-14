"use client";

import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type InputCodeState = "default" | "success" | "error";
type InputCodeSize = "md" | "lg";

type InputCodeProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "id" | "className" | "size"
> & {
  label: string;
  hint?: string;
  state?: InputCodeState;
  size?: InputCodeSize;
  /** Élément affiché à droite du champ, ex. un badge de marque détectée. */
  suffix?: ReactNode;
  containerClassName?: string;
};

const stateStyles: Record<InputCodeState, string> = {
  default: "border-line-soft focus:border-accent focus:ring-accent",
  success: "border-success-border focus:border-success focus:ring-success",
  error: "border-danger-border focus:border-danger focus:ring-danger",
};

const hintStyles: Record<InputCodeState, string> = {
  default: "text-ink-4",
  success: "text-success",
  error: "text-danger",
};

const sizeStyles: Record<InputCodeSize, string> = {
  md: "px-4 py-3 text-base",
  lg: "px-4 py-3.5 text-lg tracking-wider",
};

/** Champ de saisie de code monospace, réutilisé pour tout numéro/coupon du site. */
export function InputCode({
  label,
  hint,
  state = "default",
  size = "md",
  suffix,
  containerClassName,
  ...props
}: InputCodeProps) {
  const id = useId();
  const hintId = `${id}-hint`;

  return (
    <div className={containerClassName}>
      <label htmlFor={id} className="block text-sm font-medium text-ink-2">
        {label}
      </label>

      <div className="relative mt-2">
        <input
          id={id}
          type="text"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          data-1p-ignore
          data-lpignore="true"
          aria-describedby={hint ? hintId : undefined}
          aria-invalid={state === "error" || undefined}
          className={cn(
            "glass w-full rounded-xl font-mono text-ink-1 placeholder:text-ink-4 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-app",
            sizeStyles[size],
            suffix ? "pr-24" : null,
            stateStyles[state],
          )}
          {...props}
        />

        {suffix ? (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">{suffix}</span>
        ) : null}
      </div>

      {hint ? (
        <p id={hintId} className={cn("mt-2 text-xs", hintStyles[state])}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}
