# CIDOL World Incorporation — Chamber Site (WDD 231, W02 → W05)

**Author:** Peter Ella Bisong &nbsp;|&nbsp; **Course:** BYU‑Idaho WDD 231

Five pages, sharing one header/nav/footer and one CSS system:

- `directory.html` — member directory with a grid/list toggle (W02)
- `index.html` — home page: hero, events, live weather, member spotlights (W03)
- `join.html` — membership application form, level cards, and benefit modals (W04)
- `thankyou.html` — confirmation page after a successful application (W04)
- `discover.html` — Abuja landmarks guide with a localStorage return-visit
  message and a three-layout responsive card grid (W05)

`contact.html` is the one remaining nav link not yet built — a future week's page.

## Folder structure

```
chamber/
├── index.html
├── directory.html
├── join.html
├── thankyou.html
├── discover.html
├── styles/
│   ├── normalize.css   ← reset, linked first
│   ├── small.css       ← mobile-first base styles + design tokens
│   └── larger.css      ← 600 / 900 / 1200px overrides only
├── scripts/
│   ├── nav.js           ← shared mobile-nav toggle (every page)
│   ├── getdates.js      ← shared footer year + last-modified date
│   ├── directory.js     ← directory page: full list + grid/list toggle
│   ├── home.js           ← home page: weather + member spotlights
│   ├── join.js           ← join page: timestamp field + benefit modals
│   ├── thankyou.js       ← thank-you page: reads submitted query string
│   └── discover.js       ← discover page: localStorage message + cards
├── data/
│   ├── members.json     ← 7 member businesses
│   └── discover.mjs     ← 8 Abuja landmarks (ES module, not JSON)
└── images/
    ├── favicon.svg / favicon.ico
    ├── logo.svg
    ├── hero.svg               ← home page hero (original artwork)
    ├── og-image.jpg           ← Facebook/Open Graph share image
    ├── members/*.svg          ← one logo per directory member (7)
    ├── discover/*.webp        ← one photo per landmark (8, 300×200)
    ├── social/*.png           ← local Facebook/LinkedIn/X icons
    └── weather/*.svg          ← local weather-condition icons (6)
```

## How the join → thank-you flow works

- `join.html`'s `<form>` uses `method="get" action="thankyou.html"`.
- A hidden `#timestamp` field is filled with the current ISO date/time by
  `scripts/join.js` when the page loads.
- The four membership-level cards each open a native `<dialog>` modal
  listing that tier's benefits, closable via the Close button, Escape,
  or a click on the dimmed backdrop.
- The cards animate in on page load (a staggered fade/slide, not a hover
  effect), respecting `prefers-reduced-motion`.
- `thankyou.js` reads `window.location.search` and renders the required
  fields (first name, last name, email, mobile, business name, timestamp).

## How the discover page works

- `discover.js` is loaded with `<script type="module">` in the `<head>`,
  so it can `import { discoverPlaces } from "../data/discover.mjs"` —
  the 8 places live in a real ES module (an `export` statement), not a
  JSON file fetched at runtime.
- Each card is built as `<article><h2>…</h2><figure><img></figure>
  <address>…</address><p>…</p><button>Learn More</button></article>` —
  the exact element set the assignment calls for. The button opens that
  place's reference link in a new tab.
- The first two images load eagerly (likely above the fold); the rest
  use `loading="lazy"`.
- `discover.js` checks `localStorage` for a saved last-visit timestamp
  and shows exactly one of three messages: a first-visit welcome, "Back
  so soon! Awesome!" for a repeat visit inside the same day, or "You
  last visited N days ago." (singular "day" when N is 1) — then saves
  the current visit for next time.
- The grid uses **named CSS Grid areas** with three distinct layouts at
  the assignment's exact breakpoints: a single stacked column from
  320–640px, a two-across layout with full-width feature rows from
  641–1024px, and an asymmetric four-column mosaic with one large
  feature tile at 1025px and up — genuinely different arrangements, not
  just more columns of the same pattern.
- The image zoom/brighten hover effect only activates at 641px and
  wider, so it never applies on the small/mobile layout.

## How this maps to the four course objectives

1. **Semantic HTML5 + maintainable CSS** — every page shares `<header>`,
   `<nav>`, `<main>`, `<section>`, `<article>`, `<address>`, `<footer>`;
   `join.html` adds a real `<form>` and native `<dialog>` modals. All CSS
   runs through the same mobile-first tokens in `small.css`, with
   `larger.css` only adding breakpoint overrides — no framework, no
   inline styles, no inline SVG.
2. **JavaScript fundamentals** — `URLSearchParams`, `localStorage`,
   `Date`/ISO timestamps, array-of-objects data (`WEATHER_CODES`,
   `SUMMARY_FIELDS`), and template-literal-built markup throughout.
3. **Events + dynamic DOM manipulation** — every fetch-driven section
   (directory list, spotlights, weather, discover cards) renders after
   load via `addEventListener`/`async`-`await`, not static markup.
4. **Professional practices** — one shared `nav.js`/`getdates.js` reused
   by every page, per-page scripts kept single-purpose, real local image
   assets instead of embedded markup, and this README kept current.

## Important: discover.html needs a real local server

Because `discover.js` is a `type="module"` script that `import`s
`discover.mjs`, browsers will **refuse to load it over a `file://` URL**
(double-clicking the HTML file) — module imports are blocked by browser
security policy outside of `http://`/`https://`. Always open this page
through VS Code's **Live Server** extension (or any local server); it
will fail silently otherwise, with a CORS-looking error in the console.
Once deployed to GitHub Pages this isn't an issue, since that's already
served over `https://`.

## Manual QA checklist before submitting

- [ ] Run **Lighthouse** (mobile + desktop) on all five pages.
- [ ] Hard-reload each page with cache disabled and confirm total
      transfer size is under 500 KB.
- [ ] Open the **Console** tab on every page and confirm zero errors.
- [ ] On `discover.html`: clear `localStorage` (or use a private window),
      load the page via Live Server, confirm the exact first-visit
      message, reload and confirm "Back so soon! Awesome!", then edit
      the stored timestamp in DevTools to be a few days old and reload
      to confirm the "You last visited N days ago." wording (and that
      N = 1 says "day" not "days").
- [ ] Resize `discover.html` through 320px → 641px → 1025px+ and confirm
      the card layout visibly changes at each of those exact breakpoints
      (not just column count — the arrangement itself).
- [ ] Confirm the hover zoom effect on discover cards only appears at
      641px and wider, never below it.
- [ ] On `join.html`: try submitting with fields empty, confirm the
      browser blocks it; test the "Organizational title" pattern; open
      and close all 4 benefit modals (Close button, Escape, backdrop).
- [ ] Submit the join form and confirm `thankyou.html` shows the correct
      submitted values, including a readable date/time.
- [ ] Toggle the directory's Grid/List view and confirm list view shows
      no images, just text info.
- [ ] Reload the home page a few times and confirm spotlight cards change
      (random Gold/Silver selection) and weather populates.
- [ ] Validate all five pages on the **W3C HTML validator** and
      `styles/*.css` on the **W3C CSS validator**.
- [ ] Use DevTools' **CSS Overview** to double-check color contrast.
- [ ] Click every nav link and in-page link to confirm nothing 404s
      (aside from the still-unbuilt `contact.html`, expected for now).
