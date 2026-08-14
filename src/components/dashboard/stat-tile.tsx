"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function StatTile({
  label,
  value,
  hint,
  className,
}: {
  label: string;
  value: string;
  hint?: string;
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className={cn(
        "glass rounded-2xl p-5 transition-colors hover:border-line-soft hover:glow-accent",
        className,
      )}
    >
      <span className="text-sm text-ink-3">{label}</span>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-ink-1">{value}</p>
      {hint ? <p className="mt-1 text-xs text-ink-4">{hint}</p> : null}
    </motion.div>
  );
}
