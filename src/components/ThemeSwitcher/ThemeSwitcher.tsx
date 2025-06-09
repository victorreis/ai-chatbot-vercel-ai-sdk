"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

type Theme = "light" | "dark" | "system";

export function ThemeSwitcher() {
  // Initialize with the actual saved theme to prevent flickering
  const [theme, setTheme] = useState<Theme>(() => {
    // This runs only on the client during initial render
    if (typeof window !== "undefined") {
      return ((window as Window & { __theme?: string }).__theme ||
        localStorage.getItem("theme") ||
        "system") as Theme;
    }
    return "system";
  });
  const [mounted, setMounted] = useState(false);

  // Initialize component after mounting to avoid hydration mismatches.
  useEffect(() => {
    setMounted(true);
    // Theme is already set in useState initializer, no need to set it again
  }, []);

  // Apply theme by updating both data attribute and class.
  // Data attribute prevents hydration issues, class enables Tailwind dark mode.
  const applyTheme = (newTheme: Theme) => {
    const root = window.document.documentElement;

    // Remove previous theme classes
    root.classList.remove("light", "dark");

    // Determine actual theme
    let actualTheme = newTheme;
    if (newTheme === "system") {
      actualTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }

    // Update window.__resolvedTheme for consistency
    (window as Window & { __resolvedTheme?: string }).__resolvedTheme =
      actualTheme;

    // Apply data attribute (for CSS variables)
    root.dataset.theme = actualTheme;

    // Apply class (for Tailwind dark: utilities)
    root.classList.add(actualTheme);

    // Update color-scheme for native elements
    root.style.colorScheme = actualTheme;
  };

  const cycleTheme = () => {
    const themes: Theme[] = ["light", "dark", "system"];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const nextTheme = themes[nextIndex]!;

    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    // Update window variable for consistency
    (window as Window & { __theme?: string }).__theme = nextTheme;
    applyTheme(nextTheme);
  };

  // Prevent rendering until after mount to avoid hydration mismatch.
  // The button will briefly not appear, but this is better than a hydration error.
  // The theme itself is already applied, so there's no visual flash.
  if (!mounted) {
    return null;
  }

  const icons = {
    light: <Sun className="h-4 w-4" />,
    dark: <Moon className="h-4 w-4" />,
    system: <Monitor className="h-4 w-4" />,
  };

  return (
    <Button
      className="relative overflow-hidden"
      onClick={cycleTheme}
      size="icon"
      variant="ghost"
    >
      <div className="relative h-4 w-4">
        {Object.entries(icons).map(([key, icon]) => (
          <div
            className={`absolute inset-0 transition-all duration-300 ${
              theme === key
                ? "scale-100 rotate-0 opacity-100"
                : "scale-0 rotate-180 opacity-0"
            }`}
            key={key}
          >
            {icon}
          </div>
        ))}
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
