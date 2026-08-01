/**
 * Asia Green Tech — light / dark theme toggle
 */

(function (global) {
  "use strict";

  const STORAGE_KEY = "agt-theme";
  const THEMES = ["light", "dark"];

  /**
   * @returns {"light"|"dark"}
   */
  function getPreferredTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") {
      return stored;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  /**
   * @param {"light"|"dark"} theme
   */
  function applyTheme(theme) {
    const next = THEMES.includes(theme) ? theme : "light";
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem(STORAGE_KEY, next);

    const toggle = document.getElementById("theme-toggle");
    if (toggle) {
      toggle.setAttribute("aria-pressed", String(next === "dark"));
    }

    document.dispatchEvent(
      new CustomEvent("theme:changed", {
        detail: { theme: next },
      })
    );
  }

  function toggleTheme() {
    const isDark = document.documentElement.classList.contains("dark");
    applyTheme(isDark ? "light" : "dark");
  }

  function initTheme() {
    applyTheme(getPreferredTheme());

    const toggle = document.getElementById("theme-toggle");
    if (toggle) {
      toggle.addEventListener("click", toggleTheme);
    }

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (event) => {
        if (!localStorage.getItem(STORAGE_KEY)) {
          applyTheme(event.matches ? "dark" : "light");
        }
      });
  }

  // Prevent flash of wrong theme before body paints
  applyTheme(getPreferredTheme());

  global.AGT_THEME = {
    initTheme,
    applyTheme,
    toggleTheme,
    getTheme: () =>
      document.documentElement.classList.contains("dark") ? "dark" : "light",
  };
})(window);
