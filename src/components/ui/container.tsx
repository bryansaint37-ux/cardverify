import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Size = "sm" | "md" | "lg";

const sizes: Record<Size, string> = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-7xl",
};

export function Container({
  children,
  className,
  size = "lg",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  size?: Size;
  as?: ElementType;
}) {
  return (
    <Tag className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", sizes[size], className)}>
      {children}
    </Tag>
  );
}
