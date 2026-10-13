// =============================================================================
// CIDOL WORLD INCORPORATION — scripts/join.js
// Validates and "submits" the Talent Membership form on join.html, and
// remembers the applicant's name in localStorage to personalize a
// welcome-back message on return visits.
// =============================================================================

const APPLICANT_KEY = "cidol-last-applicant";

// Field objects: id, human label, and a validator function — an array of
// objects driving the whole validation pass instead of repeated if-blocks.
const fieldRules = [
  { id: "full-name", label: "Full name", validate: (value) => value.trim().length >= 2 },
  { id: "email", label: "Email", validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) },
  { id: "track", label: "Talent track", validate: (value) => value !== "" },
  { id: "experience", label: "Years of experience", validate: (value) => Number(value) >= 0 && value !== "" },
  { id: "portfolio", label: "Portfolio or LinkedIn URL", validate: (value) => value.trim().length > 4 }
];

/** Validates one field, writing (or clearing) its inline error message. */
function validateField(field) {
  const input = document.getElementById(field.id);
  const errorEl = document.getElementById(`${field.id}-error`);
  if (!input || !errorEl) return true;

  const isValid = field.validate(input.value);
  errorEl.textContent = isValid ? "" : `${field.label} is required and must be valid.`;
  input.setAttribute("aria-invalid", String(!isValid));
  return isValid;
}

/** Runs every field rule with .every(), short-circuiting only after each
 *  field has had a chance to show its own message. */
function validateForm() {
  const results = fieldRules.map((field) => validateField(field));
  return results.every((isValid) => isValid);
}

/** Greets a returning applicant using data saved in localStorage. */
function greetReturningApplicant() {
  const banner = document.getElementById("returning-applicant");
  const lastName = localStorage.getItem(APPLICANT_KEY);
  if (banner && lastName) {
    banner.textContent = `Welcome back, ${lastName} — we still have your last application on file.`;
    banner.hidden = false;
  }
}

function initJoinForm() {
  const form = document.getElementById("talent-form");
  const statusEl = document.getElementById("form-status");
  if (!form) return;

  greetReturningApplicant();

  fieldRules.forEach((field) => {
    const input = document.getElementById(field.id);
    if (input) {
      input.addEventListener("blur", () => validateField(field));
    }
  });

  form.addEventListener("submit", (event) => {
    const isFormValid = validateForm();

    if (!isFormValid) {
      event.preventDefault(); // stop the browser from submitting invalid data
      statusEl.className = "form-status";
      statusEl.textContent = "Please fix the highlighted fields before submitting.";
      return;
    }

    // Valid: remember the applicant for next visit, then let the form submit
    // normally (GET) so application-received.html can read the values back
    // out of the URL with URLSearchParams.
    const name = document.getElementById("full-name").value.trim();
    localStorage.setItem(APPLICANT_KEY, name);
  });
}

document.addEventListener("DOMContentLoaded", initJoinForm);
