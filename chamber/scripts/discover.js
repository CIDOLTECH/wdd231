// scripts/discover.js
// Loaded via <script type="module"> so this file can use import/export.
// Nav toggle lives in scripts/nav.js, shared by every page.

import { discoverPlaces } from "../data/discover.mjs";

const LAST_VISIT_KEY = "cidolWorldLastVisit";

// ---------------------------------------------------------------
// Cards — h2 title, figure/img, address, paragraph, "Learn More" button
// ---------------------------------------------------------------
function discoverCardTemplate(place, index) {
  // The first two cards are likely above the fold, so they load
  // eagerly; every other image is deferred with loading="lazy".
  const loadingAttr = index < 2 ? "eager" : "lazy";

  return `
    <article class="discover-card">
      <h2>${place.title}</h2>
      <figure class="discover-card__figure">
        <img
          src="images/discover/${place.image}"
          alt="${place.title}"
          loading="${loadingAttr}"
          width="300"
          height="200"
        >
      </figure>
      <address>${place.address}</address>
      <p>${place.description}</p>
      <button type="button" class="discover-card__link" data-url="${place.link}">Learn More</button>
    </article>
  `;
}

function renderDiscoverCards() {
  const grid = document.querySelector("#discoverGrid");
  if (!grid) return;

  grid.innerHTML = discoverPlaces.map(discoverCardTemplate).join("");

  // Each "Learn More" button opens that place's reference link in a
  // new tab — wired here rather than with an inline handler.
  grid.querySelectorAll(".discover-card__link").forEach((button) => {
    button.addEventListener("click", () => {
      window.open(button.dataset.url, "_blank", "noopener");
    });
  });
}

// ---------------------------------------------------------------
// Last-visit message via localStorage
// ---------------------------------------------------------------
function showLastVisitMessage() {
  const messageEl = document.querySelector("#visitMessage");
  if (!messageEl) return;

  const lastVisitRaw = localStorage.getItem(LAST_VISIT_KEY);
  const now = Date.now();

  if (!lastVisitRaw) {
    messageEl.textContent = "Welcome! Let us know if you have any questions.";
  } else {
    const msPerDay = 1000 * 60 * 60 * 24;
    const daysSince = Math.floor((now - Number(lastVisitRaw)) / msPerDay);

    if (daysSince < 1) {
      messageEl.textContent = "Back so soon! Awesome!";
    } else {
      const unit = daysSince === 1 ? "day" : "days";
      messageEl.textContent = `You last visited ${daysSince} ${unit} ago.`;
    }
  }

  localStorage.setItem(LAST_VISIT_KEY, String(now));
}

document.addEventListener("DOMContentLoaded", () => {
  showLastVisitMessage();
  renderDiscoverCards();
});
