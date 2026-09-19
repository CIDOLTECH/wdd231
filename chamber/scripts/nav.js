// scripts/nav.js
// Shared across every page: opens/closes the mobile nav and closes
// it again once a link is chosen. Course objective 3 (events + DOM).

function initNavToggle() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("#primaryNav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

document.addEventListener("DOMContentLoaded", initNavToggle);
