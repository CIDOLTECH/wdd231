// =============================================================================
// CIDOL WORLD INCORPORATION — scripts/main.js
// Shared behaviour loaded on every page: mobile nav toggle, light/dark theme
// (persisted with localStorage), active-nav highlighting, and dynamic footer
// content. Demonstrates objectives 2 & 3: JS fundamentals, DOM selection,
// event handling, conditional branching, arrays/objects, template literals.
// =============================================================================

const THEME_KEY = "cidol-theme"; // localStorage key — persists across visits

/** Applies a theme name ("light" | "dark") to the document and updates the
 *  toggle button's icon + accessible label. Pure DOM-manipulation function #1. */
function applyTheme(themeName, toggleButton) {
  const root = document.documentElement;

  if (themeName === "dark") {
    root.setAttribute("data-theme", "dark");
  } else {
    root.removeAttribute("data-theme");
  }

  if (toggleButton) {
    const icon = themeName === "dark" ? "☀" : "◐";
    const label = `Switch to ${themeName === "dark" ? "light" : "dark"} mode`;
    toggleButton.textContent = icon;
    toggleButton.setAttribute("aria-label", label);
  }
}

/** Reads the saved theme (falling back to the OS preference) and wires up
 *  the header toggle button. Function #2 — event listening + conditional
 *  branching + localStorage read/write. */
function initThemeToggle() {
  const toggleButton = document.querySelector(".theme-toggle");
  const savedTheme = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const startingTheme = savedTheme ? savedTheme : (prefersDark ? "dark" : "light");

  applyTheme(startingTheme, toggleButton);

  if (!toggleButton) return;

  toggleButton.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const nextTheme = isDark ? "light" : "dark";
    applyTheme(nextTheme, toggleButton);
    localStorage.setItem(THEME_KEY, nextTheme);
  });
}

/** Mobile nav open/close. Function #3 — DOM selection + event + branching. */
function initNavToggle() {
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("main-nav");
  if (!navToggle || !nav) return;

  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.textContent = isOpen ? "✕" : "☰";
  });
}

/** Highlights the nav link matching the current page using array methods
 *  (Array.from + .find) rather than a manual loop. Function #4. */
function highlightActiveNavLink() {
  const links = Array.from(document.querySelectorAll(".main-nav a"));
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  const activeLink = links.find((link) => link.getAttribute("href") === currentPage);
  if (activeLink) {
    activeLink.setAttribute("aria-current", "page");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initNavToggle();
  highlightActiveNavLink();
});
