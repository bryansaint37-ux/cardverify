"use client";

import { MotionConfig } from "framer-motion";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

const STORAGE_KEY = "card-verify-theme";

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Applique le thème choisi au chargement, sans script bloquant inline :
 * on lit l'attribut déjà posé par le script anti-flash de `layout.tsx`
 * (voir `THEME_NO_FLASH_SCRIPT`), puis on le garde synchronisé.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    if (current === "light" || current === "dark") {
      setTheme(current);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {/* Désactive/simplifie les animations Framer Motion pour les visiteurs
          ayant demandé "prefers-reduced-motion" — la règle CSS globale ne
          couvre que les animations/transitions CSS, pas les animations JS
          pilotées par Framer Motion. */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme doit être utilisé à l'intérieur de <ThemeProvider>.");
  }
  return context;
}

/**
 * Script exécuté avant l'hydratation (voir `layout.tsx`) : pose l'attribut
 * `data-theme` d'après la préférence mémorisée, pour éviter un flash du
 * mauvais thème au chargement. Volontairement en dehors du composant React.
 */
export const THEME_NO_FLASH_SCRIPT = `
(function () {
  try {
    var stored = window.localStorage.getItem("${STORAGE_KEY}");
    var theme = stored === "light" || stored === "dark" ? stored : "dark";
    document.documentElement.setAttribute("data-theme", theme);
  } catch (error) {
    document.documentElement.setAttribute("data-theme", "dark");
  }
})();
`;
