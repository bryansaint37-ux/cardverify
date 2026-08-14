"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/verifier"
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        className,
      )}
      aria-label={`${siteConfig.name} — retour à la vérification`}
    >
      <motion.span
        whileHover={{ rotate: -6, scale: 1.06 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-indigo-600 shadow-lg shadow-sky-500/25"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 text-slate-950"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m4 12 5 5L20 6" />
        </svg>
      </motion.span>

      <span className="text-lg font-semibold tracking-tight text-ink-1">
        Card<span className="text-accent">Verify</span>
      </span>
    </Link>
  );
}
