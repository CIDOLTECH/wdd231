// =============================================================================
// CIDOL WORLD INCORPORATION — scripts/getdates.js
// Injects the current year and this document's last-modified timestamp into
// the footer. Kept separate from main.js so date logic is easy to find and
// reuse — organized file structure (objective 4).
// =============================================================================

/** Builds the footer copyright + last-modified strings with template
 *  literals only and writes them into the DOM. */
function renderFooterDates() {
  const yearEl = document.getElementById("current-year");
  const modifiedEl = document.getElementById("last-modified");
  const today = new Date();
  const modified = new Date(document.lastModified);

  if (yearEl) {
    yearEl.textContent = `${today.getFullYear()}`;
  }
  if (modifiedEl) {
    modifiedEl.textContent = `Last Modification: ${modified.toLocaleDateString()} ${modified.toLocaleTimeString()}`;
  }
}

document.addEventListener("DOMContentLoaded", renderFooterDates);
