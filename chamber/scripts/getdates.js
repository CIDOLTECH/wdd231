// getdates.js
// Course objectives 2 & 3: plain JS fundamentals (const, template
// literals, Date object) used to update the DOM after page load.
// Shared by every page — the two elements it looks for
// (#year and #lastModified) belong to the common footer markup.

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
