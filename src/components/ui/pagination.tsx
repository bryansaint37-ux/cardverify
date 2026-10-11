"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

export function Pagination({
  page,
  totalPages,
  onPageChange,
  className,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}) {
  const t = useTranslations("pagination");

  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav
      aria-label={t("ariaLabel")}
      className={cn("flex flex-wrap items-center justify-center gap-1", className)}
    >
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label={t("previous")}
        className="grid h-9 w-9 place-items-center rounded-lg border border-line-soft text-ink-2 transition-colors hover:bg-chip disabled:pointer-events-none disabled:opacity-40"
      >
        <Icon name="arrow-right" size={16} className="rotate-180" />
      </button>

      {pages.map((candidate) => (
        <button
          key={candidate}
          type="button"
          onClick={() => onPageChange(candidate)}
          aria-current={candidate === page ? "page" : undefined}
          className="relative grid h-9 w-9 place-items-center rounded-lg text-sm font-medium text-ink-2 transition-colors hover:text-ink-1"
        >
          {candidate === page ? (
            <motion.span
              layoutId="pagination-active"
              className="absolute inset-0 rounded-lg bg-accent"
              transition={{ type: "spring", stiffness: 500, damping: 32 }}
            />
          ) : null}
          <span className={cn("relative", candidate === page && "text-accent-ink")}>
            {candidate}
          </span>
        </button>
      ))}

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label={t("next")}
        className="grid h-9 w-9 place-items-center rounded-lg border border-line-soft text-ink-2 transition-colors hover:bg-chip disabled:pointer-events-none disabled:opacity-40"
      >
        <Icon name="arrow-right" size={16} />
      </button>
    </nav>
  );
}
