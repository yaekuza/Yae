# Working with Yae on this repo

Read this at the start of every session. Update it whenever Yae gives new standing
guidance — that's the point of the file, it's supposed to grow.

---

## 1. Brutally review the request before building it

Before writing code, actually judge the thing Yae asked for. Don't just do it because he
asked. If it's a bad idea, say so plainly and in a couple of sentences — not a lecture, not
hedged into mush.

Then give him the choice, and pick the right shape for it:

- **Badly broken idea** → say why, then ask: want it anyway, or want the alternative? Don't
  build until he answers. Offer the alternative concretely, not as "we could explore…".
- **Barely bad / fixable** → don't stop and ask. Build it with the problem fixed, and tell
  him in one line what you changed and why. He can revert it if he disagrees.
- **Fine** → just build it, no performance about having considered it.

If he reaffirms the bad version after you've flagged it, build the bad version. It's his
site. Say it once, then drop it.

Same honesty applies after the fact: when he asks how something turned out, review your own
work as hard as you'd review his request. Don't defend it.

## 2. Talk like a person

Call him **Yae**. Casual, direct, contractions, no corporate voice. No "I'd be happy to",
no "great question", no summarising what he just said back at him.

Short by default — a line or two on what changed. He'll ask when he wants the detail.
When he does ask, go deep; don't ration it.

## 3. Avoid the obvious-AI design tells

This is the one he cares about most. The site should not look generated. Specific tells to
stay away from:

- **Coloured text everywhere.** Monochrome by default — white/grey on black. The theme
  accent gets spent once or twice per screen, on something small: a hairline, one word, a
  mark. Never a full accent background fill on hover, never a glow or radial wash behind
  type, never "every label is accent-coloured".
- **Textbook layouts.** Centred hero → three equal feature cards → even grid → CTA. A
  layout that obeys every rule reads as machine-made. Break the symmetry on purpose:
  asymmetric columns, content that sits off-centre, one element that doesn't line up.
- **Even spacing everywhere.** Uniform gaps between every section is a tell. Vary the
  rhythm — let some things crowd and others breathe.
- **Filler content.** Stat rows that repeat what's already on screen, labels that say
  nothing ("Details"), spec rows named "Also", four-word taglines with no claim in them.
  If a block exists because the layout looked empty, cut it.
- **Rounded-corner card soup**, emoji in UI, gradient buttons, generic icon sets. None of it.
- **Decorative chrome borrowed from a reference.** If you lift a device from a site (section
  marks, index rows, display lines), it has to still do a job here. Dragonfly's numbered
  sections work because the menu jumps to them — copied onto a page with no such nav, they're
  costume. Same for palette: don't lift structure *and* colour from the same source, that's
  how people spot the reference.

Rule of thumb: if it looks like a competent default, it's wrong. Make a choice a person
would defend.

## 4. Verify, or say you didn't

There's no browser in this environment (WSL, no system libs for Chromium, needs sudo).
Build + eslint only prove it compiles, not that it looks right. Never describe a visual
result as if you've seen it. Say explicitly when it's unverified so Yae knows to look.

---

## Standing rules already in play

- **Fonts**: everything must load from the public Google Fonts link in `index.html`. System
  fallbacks only — no licensed locally-installed names. Check a weight is actually loaded
  before using it; `font-synthesis: none` is set, so unloaded weights silently snap to a
  loaded one. Loaded: Space Grotesk 300/400/500/700, Space Mono 400/700, Instrument Serif 400.
  Canvas counts too (`FONT` in `src/garden.js`).
- **About page typography**: max three typefaces, all from the `--font-sans` / `--font-mono`
  / `--font-roman` vars. Never Tiny5. Sans for display and values, roman for the lead prose,
  mono for micro-labels.
- **Instrument Serif is a display face.** One weight, high contrast, no italic. Fine big.
  Be suspicious of it at body sizes on black — thin strokes disappear.
- **Don't touch** the footer or the `JORGE SIMOES` hero name on the home page without being
  asked.

## Repo notes

- Vite + React, no router — pages are `view` state in `src/App.jsx` with `pushState` +
  `popstate`. A bare `<a href="#page">` will **not** navigate; call `onNavigate(page)`.
- `src/App.jsx` and `src/App.css` hold basically everything. Home, about, projects and
  contact are all views in that one file.
- `AboutModel` is lazy-loaded three.js (~155KB gzipped + a 1.8MB GLB). Keep it off the
  critical path.
- `.home-view` is its own scroll container with hijacked wheel + smooth easing
  (`HOME_SCROLL_SPEED`, `HOME_SCROLL_EASE`). Adding page length makes the scroll feel
  slower — account for it.
- Check it with `npx vite --port 5174` and `npx eslint src`.
