// scripts/thankyou.js
// Nav toggle lives in scripts/nav.js, shared by every page.

const SUMMARY_FIELDS = [
  { key: "firstName", label: "First Name" },
  { key: "lastName", label: "Last Name" },
  { key: "email", label: "Email Address" },
  { key: "mobile", label: "Mobile Phone" },
  { key: "businessName", label: "Business/Organization Name" },
  {
    key: "timestamp",
    label: "Submitted On",
    format: (value) => {
      const date = new Date(value);
      return Number.isNaN(date.getTime())
        ? value
        : date.toLocaleString("en-GB", {
            dateStyle: "long",
            timeStyle: "short",
          });
    },
  },
];

function renderApplicationSummary() {
  const list = document.querySelector("#summaryList");
  if (!list) return;

  const params = new URLSearchParams(window.location.search);

  const rows = SUMMARY_FIELDS.map(({ key, label, format }) => {
    const rawValue = params.get(key);
    if (!rawValue) return "";

    const value = format ? format(rawValue) : rawValue;
    return `
      <div class="summary-list__row">
        <dt>${label}</dt>
        <dd>${value}</dd>
      </div>
    `;
  }).join("");

  list.innerHTML =
    rows ||
    `<p>No application details were found. Please <a href="join.html">fill out the membership form</a> to apply.</p>`;
}

document.addEventListener("DOMContentLoaded", renderApplicationSummary);
