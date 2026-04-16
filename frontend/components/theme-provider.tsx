"use client";

import * as React from "react";
type Theme = "light" | "dark" | "system";

type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
};

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  enableSystem?: boolean;
  forcedTheme?: Theme;
  attribute?: string;
  disableTransitionOnChange?: boolean;
};

function getSystemTheme() {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyThemeClass(resolvedTheme: "light" | "dark", attribute = "class") {
  const root = document.documentElement;
  if (attribute === "class") {
    root.classList.remove("light", "dark");
    root.classList.add(resolvedTheme);
    return;
  }
  root.setAttribute(attribute, resolvedTheme);
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  enableSystem = true,
  forcedTheme,
  attribute = "class",
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = React.useState<"light" | "dark">(
    "light",
  );
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  React.useEffect(() => {
    if (!isMounted) return;

    if (forcedTheme) {
      const forced = forcedTheme === "system" ? getSystemTheme() : forcedTheme;
      setResolvedTheme(forced);
      applyThemeClass(forced, attribute);
      return;
    }

    const stored = window.localStorage.getItem("theme") as Theme | null;
    const initialTheme = stored || defaultTheme;
    const initialResolved =
      initialTheme === "system" ? getSystemTheme() : initialTheme;

    setThemeState(initialTheme);
    setResolvedTheme(initialResolved);
    applyThemeClass(initialResolved, attribute);
  }, [attribute, defaultTheme, forcedTheme, isMounted]);

  React.useEffect(() => {
    if (!isMounted || forcedTheme || !enableSystem || theme !== "system")
      return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const next = media.matches ? "dark" : "light";
      setResolvedTheme(next);
      applyThemeClass(next, attribute);
    };

    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [attribute, enableSystem, forcedTheme, theme, isMounted]);

  const setTheme = React.useCallback(
    (nextTheme: Theme) => {
      if (forcedTheme) return;
      setThemeState(nextTheme);
      window.localStorage.setItem("theme", nextTheme);
      const nextResolved =
        nextTheme === "system" ? getSystemTheme() : nextTheme;
      setResolvedTheme(nextResolved);
      applyThemeClass(nextResolved, attribute);
    },
    [attribute, forcedTheme],
  );

  const contextValue = React.useMemo(
    () => ({
      theme: forcedTheme || theme,
      resolvedTheme: !isMounted
        ? "light"
        : forcedTheme
          ? forcedTheme === "system"
            ? getSystemTheme()
            : forcedTheme
          : resolvedTheme,
      setTheme,
    }),
    [forcedTheme, theme, resolvedTheme, setTheme, isMounted],
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (!context) {
    return {
      theme: "system" as Theme,
      resolvedTheme: "light" as "light" | "dark",
      setTheme: (_theme: Theme) => {},
    };
  }
  return context;
}
