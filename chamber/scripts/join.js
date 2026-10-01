// scripts/join.js
// Nav toggle lives in scripts/nav.js, shared by every page.

function stampFormLoadTime() {
  const timestampField = document.querySelector("#timestamp");
  if (!timestampField) return;
  timestampField.value = new Date().toISOString();
}

function initMembershipModals() {
  const openButtons = document.querySelectorAll("[data-modal-target]");

  openButtons.forEach((button) => {
    const dialog = document.querySelector(`#${button.dataset.modalTarget}`);
    if (!dialog) return;

    button.addEventListener("click", () => {
      dialog.showModal();
    });

    dialog.querySelectorAll(".modal-close").forEach((closeButton) => {
      closeButton.addEventListener("click", () => dialog.close());
    });

    // Clicking the backdrop (outside the modal's content box) closes it
    // too — a showModal() dialog's backdrop click lands on the <dialog>
    // element itself, never a descendant.
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
