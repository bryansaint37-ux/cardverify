"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme/theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Passer au thème clair" : "Passer au thème sombre"}
      aria-pressed={isDark}
      className="relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full border transition-colors"
      style={{ borderColor: "var(--line-soft)", color: "var(--ink-2)" }}
    >
      <motion.span
        aria-hidden="true"
        className="absolute inset-0 rounded-full"
        style={{ background: "var(--glow-accent)" }}
        initial={false}
        animate={{ opacity: [0, 0.6, 0], scale: [0.6, 1.3, 1.3] }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        key={theme}
      />
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ y: -12, opacity: 0, rotate: -90 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: 12, opacity: 0, rotate: 90 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="relative grid place-items-center"
        >
          {isDark ? <Moon size={18} /> : <Sun size={18} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
