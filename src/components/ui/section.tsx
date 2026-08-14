import type { ElementType, ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

export function Section({
  children,
  className,
  containerClassName,
  size = "lg",
  id,
}: {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  size?: "sm" | "md" | "lg";
  id?: string;
}) {
  return (
    <section id={id} className={cn("py-16 sm:py-24", className)}>
      <Container size={size} className={containerClassName}>
        {children}
      </Container>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  as: Component = "h2",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  as?: ElementType;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent">
          {eyebrow}
        </p>
      ) : null}

      <Component className="text-balance text-3xl font-bold tracking-tight text-ink-1 sm:text-4xl">
        {title}
      </Component>

      {description ? (
        <p className="mt-4 text-pretty text-base leading-relaxed text-ink-3 sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
