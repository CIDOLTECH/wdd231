// =============================================================================
// CIDOL WORLD INCORPORATION — scripts/application-received.js
// Reads whichever form (talent application or project quote) submitted to
// this page via a GET request, using URLSearchParams, and displays the
// values. Demonstrates URLSearchParams, array methods, template literals,
// and DOM manipulation.
// =============================================================================

// Every field either form might send, with a friendly label. Fields not
// present in the current URL are simply skipped when rendering.
const FIELD_LABELS = [
  { key: "full-name", label: "Full name" },
  { key: "email", label: "Email address" },
  { key: "track", label: "Talent track" },
  { key: "experience", label: "Years of experience" },
  { key: "portfolio", label: "Portfolio or LinkedIn URL" },
  { key: "notes", label: "Additional notes" },
  { key: "quote-name", label: "Full name" },
  { key: "quote-company", label: "Company" },
  { key: "quote-email", label: "Email address" },
  { key: "quote-type", label: "Project type" },
  { key: "quote-message", label: "Project details" },
];

const PAGE_COPY = {
  talent: {
    heading: "Application Received",
    lede: "Thanks for applying to the CIDOL World talent bench. Here's what we received.",
  },
  quote: {
    heading: "Inquiry Received",
    lede: "Thanks for reaching out about a project. Here's what we received.",
  },
};

/** Escapes text before it's injected as HTML, since it comes from a URL a
 *  visitor could edit by hand. */
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/** Reads the query string and renders a summary of whichever fields were
 *  actually present, using .filter(), .map(), and .join() on the field
 *  list — no manual loops. */
function renderSubmission() {
  const params = new URLSearchParams(window.location.search);
  const container = document.getElementById("submission-summary");
  const headingEl = document.getElementById("received-heading");
  const ledeEl = document.getElementById("received-lede");
  if (!container) return;

  const formType = params.get("form-type");
  const copy = PAGE_COPY[formType];
  if (copy && headingEl && ledeEl) {
    headingEl.textContent = copy.heading;
    ledeEl.textContent = copy.lede;
  }

  const presentFields = FIELD_LABELS.filter((field) => params.get(field.key));

  if (presentFields.length === 0) {
    container.innerHTML = `
      <p class="empty-state">
        No submitted data was found in this page's link. Visit the
        <a href="join.html">Join</a> or <a href="index.html#quote-form">project inquiry</a>
        form to submit one.
      </p>
    `;
    return;
  }

  const rowsHtml = presentFields
    .map((field) => {
      const rawValue = params.get(field.key);
      return `
        <div class="form-row">
          <p class="client-meta"><strong>${field.label}</strong></p>
          <p>${escapeHtml(rawValue)}</p>
        </div>
      `;
    })
    .join("");

  container.innerHTML = rowsHtml;
}

document.addEventListener("DOMContentLoaded", renderSubmission);
