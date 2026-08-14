"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import type { VoucherBrand } from "@/content/vouchers";
import { cn } from "@/lib/utils";

const BrandLogo = ({ brand }: { brand: VoucherBrand }) => {
  if (brand.logo) {
    return (
      <Image
        src={brand.logo}
        alt={brand.name}
        width={32}
        height={32}
        className="h-8 w-8 rounded-full object-cover"
      />
    );
  }

  switch (brand.id) {
    case "transcash":
      return (
        <svg viewBox="0 0 48 48" className="h-8 w-8" aria-hidden="true">
          <path
            d="M14 20h14l-6 6M34 28h-6v8"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M30 14l6 6-6 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "pcs":
      return (
        <svg viewBox="0 0 48 48" className="h-8 w-8" aria-hidden="true">
          <path
            d="M16 12h10a6 6 0 0 1 0 12H16v12"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M32 12v24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      );
    case "paysafecard":
      return (
        <svg viewBox="0 0 48 48" className="h-8 w-8" aria-hidden="true">
          <path
            d="M24 8l16 8v16l-16 8L8 32V16z"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path d="M16 20h16M16 28h16" fill="none" stroke="currentColor" strokeWidth="3" />
        </svg>
      );
    case "neosurf":
      return (
        <svg viewBox="0 0 48 48" className="h-8 w-8" aria-hidden="true">
          <path
            d="M12 28c4-4 8-4 12-4s8 0 12 4"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M18 16h12l6 8-6 8H18l-6-8z"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "steam":
      return (
        <svg viewBox="0 0 48 48" className="h-8 w-8" aria-hidden="true">
          <circle cx="18" cy="30" r="6" fill="none" stroke="currentColor" strokeWidth="3" />
          <path
            d="M22 26l10-4 6 8-10 4"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="34" cy="15" r="4" fill="none" stroke="currentColor" strokeWidth="3" />
        </svg>
      );
    case "apple":
      return (
        <svg viewBox="0 0 48 48" className="h-8 w-8" aria-hidden="true">
          <path
            d="M28 14c0-2.8 2.2-5 5-5 0 0 1.5 3.5 0 7-1.5 3.5-5.5 6-9 5-3-1-5-4-5-7 1 0 2-1 2-1s2 1 2 3z"
            fill="currentColor"
            opacity="0.85"
          />
          <path
            d="M16 24c-1-6 4-10 10-10s10 4 10 10c0 6-4 12-10 12s-10-5-10-12z"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          />
        </svg>
      );
    default:
      return (
        <span className="text-sm font-semibold">{brand.initials}</span>
      );
  }
};

/**
 * Aperçu visuel purement décoratif du coupon sélectionné — reflète le type
 * choisi et le code saisi. Aucun montant, aucune devise : la maquette ne
 * demande jamais ces informations.
 */
export function VoucherPreview({ brand, code }: { brand: VoucherBrand; code: string }) {
  const masked = code
    ? code
        .padEnd(brand.format.minLength, "•")
        .slice(0, Math.max(brand.format.minLength, code.length))
    : "•".repeat(brand.format.minLength);

  return (
    <div className="relative mx-auto w-full max-w-sm" style={{ perspective: 800 }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={brand.id}
          initial={{ opacity: 0, rotateY: -8, scale: 0.96 }}
          animate={{ opacity: 1, rotateY: 0, scale: 1 }}
          exit={{ opacity: 0, rotateY: 8, scale: 0.96 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ rotateX: 3, rotateY: -4, scale: 1.015 }}
          className={cn(
            "relative aspect-[1.586/1] w-full overflow-hidden rounded-2xl bg-gradient-to-br p-6 shadow-2xl",
            brand.gradient,
          )}
        >
          <div
            aria-hidden="true"
            className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl"
          />

          <div className="absolute left-6 top-6 flex items-center gap-3 rounded-3xl bg-white/10 px-4 py-3 text-white backdrop-blur-sm">
            <span
              className={cn(
                "grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full border border-white/20 text-white shadow-lg",
                brand.logo ? "bg-white p-1" : brand.gradient,
              )}
            >
              <BrandLogo brand={brand} />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.4em] text-white/70">Photo du coupon</p>
              <p className="truncate text-sm font-semibold text-white">{brand.name}</p>
            </div>
          </div>

          <div className="relative flex h-full flex-col justify-end">
            <p className="break-all font-mono text-base tracking-[0.12em] text-white sm:text-lg">
              {masked}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
