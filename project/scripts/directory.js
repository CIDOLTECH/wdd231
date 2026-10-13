// =============================================================================
// CIDOL WORLD INCORPORATION — scripts/directory.js
// Powers the Client Directory page: loads client records asynchronously from
// a local JSON file (via the clientService ES module), toggles grid/list
// view (remembered in localStorage), filters by industry, and opens a modal
// dialog with full client details. Demonstrates objects, arrays, array
// methods (.filter, .map, .find, .some), template-literal-only string
// building, DOM interaction/events, and ES module import.
// =============================================================================

import { fetchClients } from "./clientService.js";

const VIEW_KEY = "cidol-directory-view";

// Populated asynchronously by initDirectoryPage() once the JSON data loads.
let clients = [];

/** Builds one client card as an HTML string using template literals only.
 *  Pure function — no DOM access — easy to unit-reason about. */
function clientCardTemplate(client) {
  const initials = client.name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("");

  return `
    <article class="card client-card" data-industry="${client.industry}">
      <div class="logo-badge" aria-hidden="true">${initials}</div>
      <div>
        <h3>${client.name}</h3>
        <p class="client-meta">${client.tagline}</p>
        <p class="client-meta"><strong>Industry:</strong> ${client.industry}</p>
        <p class="client-meta"><strong>Email:</strong> ${client.email}</p>
        <p class="client-meta"><strong>Phone:</strong> ${client.phone}</p>
        <p class="client-meta"><strong>URL:</strong> ${client.url}</p>
        <button type="button" class="btn btn-solid view-details-btn" data-name="${client.name}">
          View details
        </button>
      </div>
    </article>
  `;
}

/** Renders a list of client objects into the #directory-list container. */
function renderClients(list) {
  const container = document.getElementById("directory-list");
  if (!container) return;

  if (list.length === 0) {
    container.innerHTML = `<p class="empty-state">No clients match that industry yet.</p>`;
    return;
  }

  container.innerHTML = list.map((client) => clientCardTemplate(client)).join("");
}

/** Applies the current industry filter, using Array.filter + conditional
 *  branching, then re-renders. */
function applyFilter(industry) {
  const filtered = industry === "all"
    ? clients
    : clients.filter((client) => client.industry === industry);
  renderClients(filtered);
}

/** Switches between grid and list layout and persists the choice. */
function setView(view, gridBtn, listBtn) {
  const container = document.getElementById("directory-list");
  if (!container) return;

  if (view === "list") {
    container.classList.add("view-list");
    container.classList.remove("view-grid");
    listBtn.setAttribute("aria-pressed", "true");
    gridBtn.setAttribute("aria-pressed", "false");
  } else {
    container.classList.add("view-grid");
    container.classList.remove("view-list");
    gridBtn.setAttribute("aria-pressed", "true");
    listBtn.setAttribute("aria-pressed", "false");
  }
  localStorage.setItem(VIEW_KEY, view);
}

/** Builds the industry filter <select> options from the unique industries
 *  found in the clients array (array + object property access). */
function populateIndustryFilter() {
  const select = document.getElementById("industry-filter");
  if (!select) return;

  const industries = [...new Set(clients.map((client) => client.industry))].sort();
  const optionsHtml = industries
    .map((industry) => `<option value="${industry}">${industry}</option>`)
    .join("");

  select.innerHTML = `<option value="all">All industries</option>${optionsHtml}`;
}

/** Fills and opens the modal dialog with one client's full details. */
function openClientModal(client) {
  const modal = document.getElementById("client-modal");
  const titleEl = document.getElementById("client-modal-title");
  const bodyEl = document.getElementById("client-modal-body");
  if (!modal || !titleEl || !bodyEl) return;

  titleEl.textContent = client.name;
  bodyEl.innerHTML = `
    <p class="client-meta"><strong>Industry:</strong> ${client.industry}</p>
    <p>${client.tagline}</p>
    <p class="client-meta"><strong>Email:</strong> <a href="mailto:${client.email}">${client.email}</a></p>
    <p class="client-meta"><strong>Phone:</strong> ${client.phone}</p>
    <p class="client-meta"><strong>Website:</strong> ${client.url}</p>
  `;

  if (typeof modal.showModal === "function") {
    modal.showModal();
  } else {
    modal.setAttribute("open", "");
  }
}

/** Wires up the modal: opening via event delegation on the card list,
 *  closing via the close button, backdrop click, or native Escape/cancel. */
function initModal() {
  const container = document.getElementById("directory-list");
  const modal = document.getElementById("client-modal");
  const closeBtn = document.getElementById("modal-close-btn");
  if (!container || !modal) return;

  container.addEventListener("click", (event) => {
    const trigger = event.target.closest(".view-details-btn");
    if (!trigger) return;
    const client = clients.find((item) => item.name === trigger.dataset.name);
    if (client) openClientModal(client);
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", () => modal.close());
  }

  // Click on the backdrop (the dialog element itself, outside its content box) closes it too.
  modal.addEventListener("click", (event) => {
    if (event.target === modal) modal.close();
  });
}

function initDirectoryControls() {
  const gridBtn = document.getElementById("grid-view-btn");
  const listBtn = document.getElementById("list-view-btn");
  const filterSelect = document.getElementById("industry-filter");
  if (!gridBtn || !listBtn) return;

  populateIndustryFilter();
  renderClients(clients);

  const savedView = localStorage.getItem(VIEW_KEY) || "grid";
  setView(savedView, gridBtn, listBtn);

  gridBtn.addEventListener("click", () => setView("grid", gridBtn, listBtn));
  listBtn.addEventListener("click", () => setView("list", gridBtn, listBtn));

  if (filterSelect) {
    filterSelect.addEventListener("change", (event) => {
      applyFilter(event.target.value);
    });
  }

  initModal();
}

/** Entry point: only runs on the directory page, loads data asynchronously,
 *  then wires up the controls once records are available. */
async function initDirectoryPage() {
  const container = document.getElementById("directory-list");
  if (!container) return; // not the directory page

  container.innerHTML = `<p class="empty-state">Loading directory&hellip;</p>`;
  clients = await fetchClients();

  if (clients.length === 0) {
    container.innerHTML = `<p class="empty-state">The directory couldn't be loaded right now. Please try again shortly.</p>`;
    return;
  }

  initDirectoryControls();
}

document.addEventListener("DOMContentLoaded", initDirectoryPage);
