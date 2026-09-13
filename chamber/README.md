# CIDOL World Incorporation — Directory Page (WDD 231, W06)

**Author:** Peter Ella Bisong &nbsp;|&nbsp; **Course:** BYU‑Idaho WDD 231

This week's deliverable is the **directory page**, built as the template for
the rest of the site: it establishes the header, primary navigation, and
footer that every later page (`index.html`, `join.html`, `discover.html`,
`contact.html`) will reuse unchanged. Those other pages are **not** part of
this milestone — the nav links to them are in place per the site plan, but
the pages themselves come in later weeks, per the assignment scope ("Do not
include the body content from the example site plan… it will be used when
you create the landing page next week").

## Folder structure

```
chamber/
├── directory.html
├── styles/
│   ├── normalize.css   ← reset, linked first
│   ├── small.css       ← mobile-first base styles + design tokens
│   └── larger.css      ← 600 / 900 / 1200px overrides only
├── scripts/
│   ├── getdates.js     ← footer year + last-modified date
│   └── directory.js    ← nav toggle, fetch/render, grid–list switch
├── data/
│   └── members.json    ← 7 member businesses
└── images/
    ├── favicon.svg / favicon.ico
    ├── logo.svg
    ├── og-image.jpg     ← Facebook/Open Graph share image
    └── members/*.svg    ← one distinct logo per member
```

## How this maps to the four course objectives

1. **Semantic HTML5 + maintainable CSS** — `directory.html` uses `<header>`,
   `<nav>`, `<main>`, `<section>`, `<article>`, `<address>`, and `<footer>`.
   CSS is mobile-first (`small.css` is the un-media-queried baseline;
   `larger.css` only adds breakpoint overrides) and driven by CSS custom
   properties defined once in `:root` — no framework, no inline styles.
2. **JavaScript fundamentals** — see `scripts/directory.js`: `const`
   declarations, small single-purpose functions, an object lookup table
   (`LEVEL_LABELS`), array methods (`sort`, `map`, `join`), and template
   literals for all generated markup.
3. **Events + dynamic DOM manipulation** — the hamburger button, the
   grid/list toggle buttons, and the `fetch()`/`async`/`await` call that
   populates `#directory` from `data/members.json` all wire up real
   `addEventListener` handlers and rewrite the DOM after load rather than
   relying on static markup.
4. **Professional practices** — organized folders (styles / scripts / data /
   images), inline comments tying code back to these objectives, and this
   README documenting scope and decisions.

## Manual QA checklist before submitting

- [ ] Run **Lighthouse** (Chrome DevTools, mobile + desktop, incognito) and
      confirm Accessibility / Best Practices / SEO are at 100 and
      Performance is 95+.
- [ ] In DevTools **Network** tab, hard-reload with cache disabled and
      confirm total transfer size is under 500 KB.
- [ ] Open the **Console** tab and confirm there are zero errors/warnings.
- [ ] Resize the viewport from 320px up through a wide desktop and confirm
      there is never horizontal scrolling and the directory grid reflows
      (1 → 2 → 3 → 4 columns).
- [ ] **Keyboard-only pass**: Tab through the skip link, nav toggle, nav
      links, the Grid/List buttons, and every card link — check the focus
      ring is always visible and the tab order is logical.
- [ ] Toggle the **Grid** and **List** buttons and confirm `aria-pressed`
      updates and the layout actually changes.
- [ ] Validate `directory.html` on the **W3C HTML validator** and
      `styles/*.css` on the **W3C CSS validator** — fix anything flagged.
- [ ] Confirm the footer shows the current year and today's date as the
      "last updated" date without editing them by hand.
- [ ] Test a Facebook/LinkedIn share-debugger against the page URL once
      deployed, to confirm the Open Graph title/description/image render.
