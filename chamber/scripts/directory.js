// scripts/directory.js
// Course objective 2: variables, functions, arrays/objects, template
// literals, and an ES module.
// Course objective 3: event handling + dynamic DOM manipulation.

// ---------------------------------------------------------------
// Mobile navigation toggle
// ---------------------------------------------------------------
function initNavToggle() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("#primaryNav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close the menu automatically once a visitor picks a link,
  // so it doesn't stay open after navigating on a small screen.
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

// ---------------------------------------------------------------
// Member directory: fetch + render
// ---------------------------------------------------------------
const LEVEL_LABELS = {
  1: { text: "Member", badgeClass: "badge--member" },
  2: { text: "Silver", badgeClass: "badge--silver" },
  3: { text: "Gold", badgeClass: "badge--gold" },
};

// Turn one member object into a card's markup. Kept as its own
// function so the grid and list views can reuse identical markup —
// the CSS (not the JS) decides how a card is laid out.
function memberCardTemplate(member) {
  const level = LEVEL_LABELS[member.level] ?? LEVEL_LABELS[1];

  return `
    <article class="member-card">
      <figure class="member-card__figure">
        <img src="images/members/${member.image}" alt="${member.name} logo" loading="lazy" width="240" height="160">
      </figure>
      <div class="member-card__body">
        <div class="member-card__top">
          <h3 class="member-card__name">${member.name}</h3>
          <span class="badge ${level.badgeClass}">${level.text}</span>
        </div>
        <p class="member-card__tagline">${member.tagline}</p>
        <ul class="member-card__meta">
          <li>${member.address}</li>
          <li><a href="tel:${member.phone.replace(/[^\d+]/g, "")}">${member.phone}</a></li>
          <li><a href="${member.url}" target="_blank" rel="noopener">${member.url.replace(/^https?:\/\//, "")}</a></li>
        </ul>
      </div>
    </article>
  `;
}

async function loadMembers() {
  const directoryEl = document.querySelector("#directory");
  const statusEl = document.querySelector("#directoryStatus");
  const countEl = document.querySelector("#memberCount");
  if (!directoryEl) return;

  try {
    const response = await fetch("data/members.json");
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    const members = data.members;

    // Sort gold-tier members first so top-tier sponsors surface up top,
    // then alphabetically within a tier.
    const sorted = [...members].sort((a, b) => {
      if (b.level !== a.level) return b.level - a.level;
      return a.name.localeCompare(b.name);
    });

    directoryEl.innerHTML = sorted.map(memberCardTemplate).join("");

    if (countEl) {
      countEl.textContent = `${members.length} member businesses`;
    }
    if (statusEl) {
      statusEl.hidden = true;
    }
  } catch (error) {
    console.error("Could not load member directory:", error);
    if (statusEl) {
      statusEl.textContent =
        "Sorry — the member directory could not be loaded right now. Please refresh the page.";
      statusEl.hidden = false;
    }
  }
}

// ---------------------------------------------------------------
// Grid / list view switch
// ---------------------------------------------------------------
function initViewSwitch() {
  const directoryEl = document.querySelector("#directory");
  const buttons = document.querySelectorAll("[data-view-button]");
  if (!directoryEl || buttons.length === 0) return;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const view = button.dataset.viewButton;
      directoryEl.dataset.view = view;

      buttons.forEach((btn) => {
        btn.setAttribute("aria-pressed", String(btn === button));
      });
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initNavToggle();
  initViewSwitch();
  loadMembers();
});
