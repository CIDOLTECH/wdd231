// scripts/join.js
// Course objective 2: variables, functions, template literals.
// Course objective 3: event handling + dynamic DOM manipulation.
// Nav toggle lives in scripts/nav.js, shared by every page.

// ---------------------------------------------------------------
// Hidden timestamp field — records when the form was loaded
// ---------------------------------------------------------------
function stampFormLoadTime() {
  const timestampField = document.querySelector("#timestamp");
  if (!timestampField) return;
  timestampField.value = new Date().toISOString();
}

// ---------------------------------------------------------------
// Membership benefit modals (native <dialog> elements)
// ---------------------------------------------------------------
function initMembershipModals() {
  const openButtons = document.querySelectorAll("[data-modal-target]");

  openButtons.forEach((button) => {
    const dialog = document.querySelector(`#${button.dataset.modalTarget}`);
    if (!dialog) return;

    button.addEventListener("click", () => {
      dialog.showModal();
    });

    // Close buttons inside this particular dialog.
    dialog.querySelectorAll(".modal-close").forEach((closeButton) => {
      closeButton.addEventListener("click", () => dialog.close());
    });

    // Clicking the backdrop (outside the modal's content box) closes it too.
    // A showModal() dialog's backdrop click lands on the <dialog> element
    // itself, never a descendant, so that's how we tell the two apart.
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) {
        dialog.close();
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  stampFormLoadTime();
  initMembershipModals();
});
