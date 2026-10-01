// getdates.js
// Shared by every page. Updates the footer's copyright year and
// last-modified date after load.

const yearEl = document.querySelector("#year");
const modifiedEl = document.querySelector("#lastModified");

if (yearEl) {
  const currentYear = new Date().getFullYear();
  yearEl.textContent = `${currentYear}`;
}

if (modifiedEl) {
  const modified = new Date(document.lastModified);
  modifiedEl.textContent = `Last updated: ${modified.toLocaleDateString(
    "en-GB",
    { day: "numeric", month: "short", year: "numeric" }
  )}`;
}
