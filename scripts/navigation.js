// navigation.js — controls the small-screen hamburger menu
const hamburgerBtn = document.getElementById("hamburgerBtn");
const primaryNav = document.getElementById("primaryNav");

function setNavOpen(isOpen) {
  primaryNav.classList.toggle("open", isOpen);
  hamburgerBtn.classList.toggle("active", isOpen);
  hamburgerBtn.setAttribute("aria-expanded", String(isOpen));
}

hamburgerBtn.addEventListener("click", () => {
  const isOpen = !primaryNav.classList.contains("open");
  setNavOpen(isOpen);
});

// Close the menu once a link is chosen, so it doesn't stay open on navigation
primaryNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setNavOpen(false));
});
