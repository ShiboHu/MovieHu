import React, { useEffect, useState } from "react";

/**
 * ThemeToggle
 * Controls light/dark theme via data-theme attribute on <html>.
 * Persists choice in localStorage.
 */
function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";
    const saved = window.localStorage.getItem("movieTheme");
    if (saved === "light" || saved === "dark") return saved;
    // fallback: prefers-color-scheme
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")
      .matches;
    return prefersDark ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem("movieTheme", theme);
  }, [theme]);

  const toggle = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const isLight = theme === "light";

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      data-mode={isLight ? "light" : "dark"}
      aria-label="Toggle light or dark theme"
    >
      <span className="theme-toggle-label">
        {isLight ? "Light" : "Dark"}
      </span>
      <div className="theme-toggle-thumb">
        <div className="theme-toggle-knob" />
      </div>
      <span aria-hidden="true">{isLight ? "🌞" : "🌙"}</span>
    </button>
  );
}

export default ThemeToggle;
