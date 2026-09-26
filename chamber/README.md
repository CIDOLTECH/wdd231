# CIDOL World Incorporation — Chamber Site (WDD 231, W06 → W08)

**Author:** Peter Ella Bisong &nbsp;|&nbsp; **Course:** BYU‑Idaho WDD 231

Four pages are built so far, sharing one header/nav/footer and one CSS system:

- `directory.html` — full, sortable-by-view member directory (W06)
- `index.html` — the home/landing page (W07): hero, events, live weather,
  and randomized Gold/Silver member spotlights
- `join.html` — membership application form with four membership-level
  cards and benefit modals (W08)
- `thankyou.html` — confirmation page shown after a successful
  application submission (W08)

The remaining nav links (`discover.html`, `contact.html`) are future
weeks' pages, per the assignment's incremental scope.

## Folder structure

```
chamber/
├── index.html
├── directory.html
├── join.html
├── thankyou.html
├── styles/
│   ├── normalize.css   ← reset, linked first
│   ├── small.css       ← mobile-first base styles + design tokens
│   └── larger.css      ← 600 / 900 / 1200px overrides only
├── scripts/
│   ├── nav.js           ← shared mobile-nav toggle (every page)
│   ├── getdates.js      ← shared footer year + last-modified date
│   ├── directory.js     ← directory page: full list + grid/list toggle
│   ├── home.js           ← home page: weather API + member spotlights
│   ├── join.js           ← join page: timestamp field + benefit modals
│   └── thankyou.js       ← thank-you page: reads submitted query string
├── data/
│   └── members.json    ← 7 member businesses
└── images/
    ├── favicon.svg / favicon.ico
    ├── logo.svg
    ├── hero.svg              ← home page hero (original artwork)
    ├── weather-placeholder.svg
    ├── og-image.jpg     ← Facebook/Open Graph share image
    └── members/*.svg    ← one distinct logo per member
```

## Setting up live weather on the home page

The weather panel calls the OpenWeatherMap API for CIDOL World's Abuja
headquarters (current conditions + a 3-day forecast). To activate it:

1. Create a free account at <https://openweathermap.org/api> and generate
   an API key (the "Current Weather" / "5 Day Forecast" plan is free).
2. Open `scripts/home.js` and replace the placeholder:
   ```js
   const WEATHER_API_KEY = "YOUR_OPENWEATHERMAP_API_KEY";
   ```
   with your real key.
3. New OpenWeatherMap keys can take up to a couple of hours to activate —
   if you get a 401 right after signing up, that's why. Until a real key
   is added, the panel shows a friendly message instead of breaking.

## How the join → thank-you flow works

- `join.html`'s `<form>` uses `method="get" action="thankyou.html"`, so a
  submission redirects to `thankyou.html?firstName=...&lastName=...` etc.
- A hidden `#timestamp` field is filled with the current ISO date/time by
  `scripts/join.js` the moment the page loads — not when it's submitted.
- The four membership-level cards each open a native `<dialog>` modal
  (via `.showModal()`) listing that tier's benefits. Modals close via
  their Close button, the Escape key (built into `<dialog>`), or a click
  on the dimmed backdrop.
- The cards animate in on page load (a staggered fade/slide, not a hover
  effect) via CSS `@keyframes`, respecting `prefers-reduced-motion`.
- `thankyou.js` reads `window.location.search` with `URLSearchParams` and
  renders only the **required** fields (first name, last name, email,
  mobile, business name, timestamp) into a definition list.

## How this maps to the four course objectives

1. **Semantic HTML5 + maintainable CSS** — every page shares `<header>`,
   `<nav>`, `<main>`, `<section>`, `<article>`, `<address>`, `<footer>`;
   `join.html` adds a real `<form>`, `<label>`-wrapped fields, and native
   `<dialog>` modals. All CSS still runs through the same mobile-first
   tokens in `small.css`, with `larger.css` only adding breakpoint
   overrides — no framework, no inline styles.
2. **JavaScript fundamentals** — `join.js` and `thankyou.js` add
   `URLSearchParams`, `Date`/ISO timestamps, array-of-objects field
   configuration (`SUMMARY_FIELDS`), and template-literal-built markup.
3. **Events + dynamic DOM manipulation** — modal open/close/backdrop
   clicks are wired with `addEventListener`; the thank-you page's summary
   is built entirely from the query string after load, not static markup.
4. **Professional practices** — one shared `nav.js`/`getdates.js` reused
   by every page, per-page scripts kept separate and single-purpose, and
   this README kept current as pages are added.

## Manual QA checklist before submitting

- [ ] Run **Lighthouse** (mobile + desktop) on all four pages —
      Accessibility / Best Practices / SEO at 100, Performance 95+.
- [ ] Hard-reload each page with cache disabled and confirm total
      transfer size is under 500 KB.
- [ ] Open the **Console** tab on every page and confirm zero errors.
- [ ] On `join.html`: try submitting with fields empty, confirm the
      browser blocks it on every `required` field; type fewer than 7
      characters (or a digit) into "Organizational title" and confirm
      the pattern validation catches it.
- [ ] Confirm each of the 4 "Learn more" buttons opens its own modal
      with the right benefits list, and that Escape, the Close button,
      and a click on the dimmed backdrop all close it.
- [ ] **Keyboard-only pass** on `join.html`: Tab through every field and
      card link in a logical order; confirm a modal traps focus while
      open and returns focus sensibly when closed.
- [ ] Reload `join.html` a few times and confirm the 4 membership cards
      visibly animate in on load (not just appear instantly).
- [ ] Submit the form with real data and confirm `thankyou.html` shows
      the first name, last name, email, mobile, business name, and a
      readable submitted date/time — try it with a field left blank
      (not the required ones) to confirm summary skips it cleanly.
- [ ] Validate all four pages on the **W3C HTML validator** and
      `styles/*.css` on the **W3C CSS validator**.
- [ ] Use DevTools' **CSS Overview** to double-check color contrast on
      the new join-page elements (form fields, cards, modals).
- [ ] Click every nav link and in-page link across all four pages to
      confirm nothing 404s (aside from the still-unbuilt
      `discover.html`/`contact.html`, expected for now).

