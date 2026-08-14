"use client";

import Link from "next/link";
import { motion, type HTMLMotionProps } from "framer-motion";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

const base =
  "relative inline-flex items-center justify-center gap-2 rounded-xl font-medium " +
  "transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 " +
  "focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-app " +
  "disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-accent-ink shadow-lg glow-accent hover:brightness-110",
  secondary: "bg-solid text-ink-1 border border-line-soft hover:brightness-110",
  outline: "border border-line-soft text-ink-2 hover:bg-chip hover:text-ink-1",
  ghost: "text-ink-3 hover:bg-chip hover:text-ink-1",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-base",
};

const hoverMotion = {
  whileHover: { y: -2, scale: 1.02 },
  whileTap: { scale: 0.97 },
  transition: { type: "spring" as const, stiffness: 400, damping: 25 },
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type ButtonProps = CommonProps &
  Omit<HTMLMotionProps<"button">, keyof CommonProps>;

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      className={cn(base, variants[variant], sizes[size], className)}
      {...hoverMotion}
      {...props}
    >
      {children}
    </motion.button>
  );
}

const MotionLink = motion.create(Link);

/** Poignées d'événements redéfinies par Framer Motion — exclues du typage natif. */
type MotionOverriddenHandlers =
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onDrag"
  | "onDragStart"
  | "onDragEnd";

type CommonLinkProps = CommonProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, keyof CommonProps | MotionOverriddenHandlers>;

/** Même apparence que <Button />, mais rendu comme un lien de navigation. */
export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: CommonLinkProps) {
  return (
    <MotionLink
      className={cn(base, variants[variant], sizes[size], className)}
      {...hoverMotion}
      {...props}
    >
      {children}
    </MotionLink>
  );
}
