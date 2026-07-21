"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

/**
 * Dark/light mode toggle. Dark is the brand default; the choice persists in
 * localStorage and is applied pre-hydration by the inline script in layout.tsx
 * so the canvas never flashes the wrong mode.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const [mode, setMode] = useState<"dark" | "light">("dark");

  useEffect(() => {
    setMode(document.documentElement.dataset.mode === "light" ? "light" : "dark");
  }, []);

  function toggle() {
    const next = mode === "light" ? "dark" : "light";
    setMode(next);
    if (next === "light") {
      document.documentElement.dataset.mode = "light";
    } else {
      delete document.documentElement.dataset.mode;
    }
    try {
      localStorage.setItem("bl.mode", next);
    } catch {
      // Private mode — the toggle still works for this visit.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={mode === "light" ? "Switch to dark mode" : "Switch to light mode"}
      className={`eyebrow flex items-center gap-1.5 transition-colors hover:text-blush-300 ${className}`}
    >
      {mode === "light" ? (
        <Moon size={13} strokeWidth={1.5} />
      ) : (
        <Sun size={13} strokeWidth={1.5} />
      )}
      {mode === "light" ? "Dark" : "Light"}
    </button>
  );
}
