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
  loaded one. Loaded: Space Grotesk 300/400/500/700, Space Mono 400/700, Instrument Serif 400,
  Newsreader 400 **roman and italic** at `opsz` 16. Canvas counts too (`FONT` in `src/garden.js`).
- **Typography: four typefaces, and four is the ceiling** (raised from three on 2026-11-16 at
  Yae's request). They are `--font-sans` / `--font-mono` / `--font-roman` / `--font-serif`,
  all declared in `src/index.css`. Never Tiny5. **When something needs to look different,
  take a weight or an italic of one of these — never a fifth family.** That was the explicit
  instruction. Any new weight or style has to go into the `index.html` link first or it snaps
  silently.
  - **sans** (Space Grotesk) — all body text: leads, story copy, values. Also the about name
    at 700.
  - **mono** (Space Mono) — micro-labels only.
  - **roman** (Instrument Serif) — the sharp display serif: the home statement and the footer
    canvas, nothing else. One weight, high contrast; at body size on black the strokes
    disappear. We tried it for body text and reverted.
  - **serif** (Newsreader) — the soft display serif, currently only the contact statement.
    Added because Yae wanted that line **less sharp** and `--font-roman` is the sharpest face
    in the set. Requested at **`opsz` 16, the text cut, not the display cut**, and pinned with
    `font-optical-sizing: none` — left on auto, the browser asks for `opsz` 82 at that size
    and gets the thin-hairline cut back, which defeats the point. Two cuts are loaded, roman
    and **italic** (`ital,opsz,wght@0,16,400;1,16,400`), costing **22.5KB + 24.3KB** of latin
    subset on the same Google request. The italic is the site's only italic and is used in
    exactly one place: the contact email address.
- **Don't touch** the footer or the `JORGE SIMOES` hero name on the home page without being
  asked. The big `JORGE SIMOES` on *about* is deliberate and carries that page — it's the
  one memorable thing on it, don't quietly demote it again.
- **One message per page.** Home = the work, the position statement, and the ask.
  About = the person: name, bio, spec sheet, what he's doing now. Don't let the two pages
  explain him twice; if you write a statement for one, the other doesn't get one.
- **Availability: he's interning until February, looking for front-end work from February
  on** (as of 2026-11-11). It now lives in **one place only**: `Interning until February` in
  the about Now list. He asked for the home mention to go on 2026-11-16, so don't reintroduce
  it there or anywhere else. Over-stating it reads as pleading and breaks the design rules
  above. It is *not* "looking for a third-year internship" any more. The contact statement
  says `Open to front-end and fullstack work in the Netherlands` without a date, which is
  deliberate — it's the ask without the countdown.
- **Home order is deliberate**: hero → work → position → footer. Projects come first.
  Don't bury the work again, and don't pad the page back out with prose.
- **The four story blocks are gone** (SCHOOL / ORIGIN / DIRECTION / OFF SCREEN, removed
  2026-11-12 — he called them bulk text). That autobiography already lives in the about bio.
  The `.home-position` block (statement + HOW paragraph) is all the prose home gets. The old
  copy is in git if it's ever wanted on about.
- **The work section carries the page.** Each project is a block: title, one-line summary,
  credit, stack, VISIT/SOURCE link, and its screenshot. Screenshots are greyscale at 0.72 and
  go full colour on hover — that's what keeps four screenshots from turning the page into a
  colour swatch. **All four shots are one width** (`--shot-width: 47%`, the widest of the old
  set) — they ran 38/47/32/44% per `nth-child` until 2026-11-16, when Yae said the variation
  read as "much too messy" and asked for them matched to the biggest. That reverses the
  earlier rule here, so don't re-stagger them. The screenshots are all 1400x692-696, so one
  width makes them identical boxes rather than just equal columns.
  **The vertical `--shot-drop` still varies per `nth-child`** (0 / 4vh / 1.4vh / 6vh) and is
  now the only thing keeping the section off a plain grid. Don't flatten those as well
  without being asked. Knock-on worth watching: the shots are wider than the old average, so
  the work section is taller and the hijacked home scroll (`HOME_SCROLL_SPEED` 0.85) has more
  page to cover — raised 2026-11-16, speed left alone.
- **Credit before stack** (added 2026-11-13). Every project has a `credit` field — what he did
  and who with (`FULLSTACK \u00b7 SOLO`, `FRONT-END \u00b7 TEAM OF 3`). It renders first in
  `.home-work-meta` at 0.78 white, with the stack after it at `--home-dim`. That order is the
  point: someone hiring cares which half he built before they care that it's Next.js. Keep the
  brightness difference; two mono labels at the same value read as one run-on string.
- **Hovering a work row dims the other three** to 0.42 (added 2026-11-13, idea taken from
  signal-a.studio's `dimm`). It's inside `@media (hover: hover)` on purpose — a sticky `:hover`
  on touch would leave three rows faded for good — and scoped to `.is-in` so it can't light up a
  row that hasn't revealed yet. `:focus-within` gets the same treatment so tabbing matches the
  mouse. It's what makes a four-item list read as a choice instead of a short list.
- **The home ask is gone** (removed 2026-11-16). `Available from February` plus the big email
  address was its own section between the position and the footer; the footer already carries
  the same `mailto:` link four items along from LINKEDIN, so the ask was the same address
  twice in one scroll. Home now ends on the position and drops into the footer. Don't rebuild
  it — all of `.home-ask*` and `homeAvailability` were deleted.
- **The laptop is gone.** `AboutModel.jsx` and the 1.8MB `.glb` were deleted (2026-11-11) —
  1.8MB + ~155KB of three.js to spin a generic laptop that said nothing. `three` itself was
  dropped from `package.json` on 2026-11-13 (nothing imported it; the bundle didn't change, so
  it was never shipping). Don't reintroduce decoration that costs more than the content.
- **Project screenshots are `.webp`, 1400px wide** (converted 2026-11-12: the four PNGs were
  2.4MB, Melograph alone 1.97MB; they're now 55KB total). `convert` (ImageMagick) is
  available — `convert in.png -resize 1400x -quality 82 out.webp`. Any new screenshot goes
  through that before it ships. The PNGs are in git history.

- **Don't stack a third reference.** The home page already carries Dragonfly's structure *and*
  a palette within a few points of theirs. Generic patterns are fair game (sibling dimming, a
  role label, eased scroll); a site's *signature* device is not. Specifically asked about and
  rejected 2026-11-13: signal-a.studio's text-scramble effect (it's on 155 elements there and
  is the most-copied effect in this genre right now), their awards grid (he has none — a junior
  portfolio inventing proof is the worst possible move), and their habit of baking body copy
  into SVG, which would undo his own SEO work.
- **No em dashes in visible copy** (2026-11-16: "i dont want that inclueded"). They were in
  the contact lead, the home HOW paragraph and the about bio; all three now use a full stop
  or a colon. It is one of the loudest machine-written tells, so this is a copy rule, not a
  one-off edit. Code comments are fine.
- **Open, not fixed: home and about say the same sentence.** `homeEthos` has "how a layout
  holds at every width" and the about bio has "how a layout holds up at every width" — the
  same thought, nearly the same words, on the two pages that are supposed to carry different
  messages. Spotted 2026-11-16 while removing the dashes. Not touched, because which one
  gives it up is a content call.
- **Check copy against the project data.** The HOW paragraph claimed "two with a team, two on
  my own" — it's one solo and three team projects. Fixed 2026-11-13. Any sentence that counts
  or characterises the work has to be verified against the `projects` array, not written to
  sound good.

## The about page

Reviewed and reworked 2026-11-16. Its failure mode is **saying the same four facts three
times in three different formats**, because the right column looks empty otherwise. Watch
for that specifically.

- **The name is the brightest thing on the page.** `#f4f4f4` at weight 700. It was `#a8a8a8`
  while `.about-lead` sat at 0.92 white, so the body paragraph was literally brighter than
  the headline it sat under — size was doing all the hierarchy work on its own. The lead is
  0.86 now so it doesn't compete. The accent line that sweeps the name ends at `opacity: 0`
  (checked) — it's a sweep, not a permanent strikethrough. Leave it that way.
- **The role label is `Front-end developer`.** It said `Software Developer`, which contradicted
  the bio, three of the four project credits, and the job he's looking for. Don't soften it
  back to something broader; vague is worse than narrow here.
- **No fact appears twice.** School is named once (the Now list), bouldering once (the Now
  list — it came out of the bio), Rotterdam once as a place (the `BASED` spec row). Before
  this, Rotterdam appeared three times, school twice and bouldering twice. If you add a row
  to this page, check it against the bio first.
- **Spec sheet is `STACK / LANGUAGES / BASED`.** `SCHOOL` came out because the Now list names
  it; `BASED` came in because `Rotterdam, NL` was an orphan note in the footer. `React Native`
  was added to the stack — Aria ships on it and the row omitted it.
- **The Now list sits behind the spec sheet** (0.6 white vs 0.86). Two blocks of the same size
  and brightness in one narrow column read as a single grey mass, which is what they were.
- **Never say he's moving away from front-end.** The Now list used to read `Moving from
  front-end into some backend`, on a page selling him for front-end work. It's now `Learning
  enough backend to ship on my own`, which supports YaeType's `FULLSTACK · SOLO` credit
  instead of undercutting the pitch.
- **The bio was rewritten 2026-11-16** and is now three sentences: age and origin, the
  shipping standard, photography. **It stops at exactly what nothing else on the site says.**
  What came out and why — check any replacement against this list:
  - `living in Rotterdam for school and work` — Rotterdam is the `BASED` row and school is
    the Now list. The old bio put the page's Rotterdam count at **three** and school at two,
    which is the exact failure this section warns about; the earlier pass claimed it was
    fixed and had not touched the bio.
  - `the part I keep coming back to is structure: how a layout holds up at every width` —
    `homeEthos` already says `how a layout holds at every width`. Same thought, nearly the
    same words, on the two pages that are meant to carry different messages. **Home keeps
    it.**
  - `Front-end is the whole of what I am aiming at` — `.about-role` directly above it reads
    `Front-end developer`.
  The photography line went **in** (`the ones on the contact page are mine`), which was the
  open recommendation from earlier that day: his photographs carry a page now, so the visitor
  needs to be told they are his. It deliberately does **not** count them — same rule as the
  project copy, a sentence that counts something breaks when the data changes.
- **Open recommendation, not done:** there is still no photo of *him* on the one page that is
  about him. Raised 2026-11-16; it's his call because it's his face.
- **The GitHub / LinkedIn / CV icon row is gone** (deleted 2026-11-16 with `src/AboutLinks.jsx`,
  `.about-foot` and `.about-link*`). Three reasons, any one of them enough: the contact page
  carries all of those links plus both CVs and the email, and the home footer carries two of
  them again, so this was the third copy; the design rules ban generic icon sets and it was a
  GitHub octocat, a LinkedIn mark and a document glyph; and it linked `CV (EN)` only while
  contact offers EN and NL. It was also the scrollbar-flash source above, and its
  `justify-content: space-between` had been doing nothing since it was left with one child.
  **About now has no outbound links at all** — that is the trade, and CONTACT is in the nav.
- **The sector marks are gone** (removed 2026-11-16, across all three pages). About said
  `sec-02`, projects `SECTOR 03`, contact `SECTOR 04` — two different formats for the same
  device, numbering that started at 02 because home never had one, and nothing anywhere that
  counted sections or navigated to them. Textbook borrowed chrome. `SectionHeader` no longer
  takes `sectorLabel` / `sectorClassName` / `sectorFirst`; it's `phase`, `title`,
  `extraClassName`. Don't reintroduce them without a nav that actually uses the numbers.

## The contact page

Reworked 2026-11-16 after Yae said it "looks too ai ish". He was right. What made it read
that way, so none of it comes back:

- **No accent word in the headline.** It was `Available from <span class="contact-highlight">
  February</span> for front-end work.` — colouring the one "important" word in the hero line
  is the single most recognisable template move there is, and at 54px it isn't the "small
  accent spend" section 3 allows. `.contact-highlight` is deleted. The page's entire accent
  budget is now one hairline that draws under the email address on hover.
- **The email address is Newsreader italic 400** (2026-11-16), at `clamp(22px, 2.9vw, 46px)`
  / `line-height: 1.08` / `-0.005em`. It was Space Grotesk 500 at `clamp(20px, 2.6vw, 40px)`
  / `-0.025em`; a serif italic at those numbers reads smaller and runs its letters together,
  so it is set larger and looser. **Why the serif and not a third voice**: the statement at
  the top of the page is Newsreader, so the two things that actually matter here now bracket
  the sans lead between them. **`font-style: italic` only works because the italic cut is in
  the `index.html` link** — `font-synthesis: none` means a roman-only load would leave it
  silently upright, with no false slant to hint anything is wrong.
- **Email is primary, the rest are a link row.** It used to be four equal cards
  (`repeat(4, 1fr)` with divider borders), each a mono label over a value — the "three equal
  feature cards" tell, and it contradicted the lead copy claiming email is fastest. Now the
  address is display type at `clamp(20px, 2.6vw, 40px)` and LINKEDIN / GITHUB / CV sit under
  it as small mono links. Don't flatten them back into a grid.
- **Values that restated their labels are gone.** `LINKEDIN → JORGE SIMOES` (his own name,
  already the biggest thing on about), `GITHUB → YAEKUZA`, and `CV → DOWNLOAD PDF` under a
  label that already read CV. The label is the link now.
- **The CV hover-swap is gone.** A `position: absolute; inset: 0` overlay swapped the CV cell
  for ENGLISH / DUTCH on hover — hidden behind hover, awkward on touch, and a card filling in
  on hover is its own tell. It's two plain links: `CV (EN)` and `CV (NL)`.
- **The body split is 1.42fr / 1fr with `align-items: start`** and the photo dropped by
  `clamp(16px, 5vh, 64px)`. It was `1fr / 1.05fr` with both halves vertically centred — a
  centred hero split whose only asymmetry (that 1.05) was too small to see. Don't re-centre it.
- **The headline and the lead must not say the same thing.** The statement said "Available
  from February for front-end work" and the paragraph directly under it said "Open to
  front-end and fullstack work in the Netherlands" — a restatement that also contradicted
  itself on front-end vs fullstack. The lead carries location and the channel hierarchy now.
- **Fixed in passing**: `.contact-view` was `overflow: hidden` with a photo whose
  `max-height` floor was 320px, so on a ~500px-tall viewport it clipped with no scrollbar.
  It's `overflow-y: auto` now, same as about.
- **CONTACT is page-centred, not column-centred** (2026-11-16). `SectionHeader` spans
  `grid-column: 1 / -1`, so the title lands where it does on about and projects, and its
  hairline runs the full page width.
- **Contact has exactly one line: the rule under CONTACT.** Both hairlines came off on
  2026-11-16 and the top one went back the same day at Yae's request; `.contact-channels`'
  `border-top` is gone for good, as are the figure's own side borders. So the page opens on a
  rule like about and projects do and then has nothing else — don't "balance" it by putting a
  line above the channels again.
  **`--project-line` must stay declared on `.contact-view`.** `.projects-list-rule` uses
  `background: var(--project-line)` with no fallback and the var is declared per view, not at
  `:root`, so removing it from contact doesn't inherit anything — it paints the line
  transparent. I removed it while both rules were off and had to put it back.
  Two knock-ons from losing the bottom rule, both still in place: the channels' `padding-top`
  went `18→24 / 2.6→3.4vh / 30→42px` because a gap now does the separating a rule was doing,
  and `--contact-band`'s subtraction went `350px → 364px` to pay for it — the view is
  `overflow: hidden`, so the three rows have to stay inside `100vh` or the channels clip.
- **The photo sits between the header rule and where the channels rule used to be, not the
  viewport edges** (changed 2026-11-16 —
  the full-bleed version lasted one turn; Yae wanted it bounded). `.contact-view` is a
  2-col x 3-row grid: header (row 1, both cols), `.contact-body` + `.contact-figure`
  (row 2), `.contact-channels` (row 3, both cols). The header rule is the photo band'''s top
  edge and the channels''' `border-top` is its bottom edge. The `.contact-main` wrapper is
  gone — don'''t reintroduce it, the grid places all four children directly.
- **A downward entry animation on the last child of a scroll container flashes a scrollbar.**
  That was the "scrollbar visible on load" bug Yae reported 2026-11-16: `about-block-in` goes
  `from { translate3d(0, 16px, 0) }`, and `.contact-channels` was the last child of an
  `overflow-y: auto` column, so those 16px extended the scroll range for the length of the
  animation. Two fixes: the channels moved out of the scroller onto their own row, and
  `.contact-intro` now uses `contact-block-in`, which comes **from -14px**. Overflow past the
  *top* of a scroll container is not scrollable, so an upward entry can never do this.
  Only `.contact-body` scrolls now. **About had the same latent bug and it is gone**: it was
  `.about-foot`, the bottom-most child of `.about-view` (`overflow-y: auto`), and deleting
  that block removed it. Nothing bottom-most on about uses a downward entry any more, because
  row 2 is `minmax(0, 1fr)` and the aside is `align-content: start`, so neither column reaches
  the bottom edge on a viewport tall enough not to scroll.
- **`front-end` is wrapped in `.contact-keep` (`white-space: nowrap`).** Browsers break after
  a hyphen, so the statement was splitting as `front-` / `end work.` Any hyphenated word put
  into display type needs the same treatment.
- **The photo is a full-bleed column with a gsap shutter** (2026-11-16). The page is two
  columns now, not three stacked bands: `.contact-main` (header, body, channels) scrolls on
  the left, `.contact-figure` runs the full viewport height on the right at
  `clamp(300px, 40vw, 680px)` and is the only element on the site that touches the top and
  bottom edges. Clicking it cycles to the next photo.
- **How the shutter works.** Seven bars (`SHUTTER_BARS`) sit over the figure, covering it in
  CSS at `scaleY(1)` so nothing flashes before gsap runs. Intro clears them downward
  (`transform-origin: bottom`, scaleY → 0, 0.055s stagger). A swap closes them downward
  (`origin: top`, scaleY → 1), swaps the photo inside `.add()` while it is hidden, then
  clears downward again. **The origin flips between the two halves on purpose** — same
  origin both ways gives a symmetric open/close, which looks like a curtain instead of a
  wipe. Re-entrancy is guarded by `timelineRef.current?.isActive()`.
- **gsap is a real dependency again** (re-added 2026-11-16 at his request; I had removed it
  on the 13th because nothing imported it). It costs **+72KB raw / +27.6KB gzipped** — the
  bundle went 259.6KB → 331.5KB. This shutter is doable in CSS keyframes for free; he asked
  for gsap specifically, so it stays. Now that it is paid for, prefer gsap for any further
  sequenced animation rather than adding a second approach.
- **The statement is Space Grotesk 400** (`--font-sans`), at `clamp(34px, 4.6vw, 76px)` /
  `line-height: 1` / `-0.028em`. It was Instrument Serif; Yae asked for something **less
  sharp** on 2026-11-16 and a high-contrast serif with wedge serifs is the sharpest thing in
  the loaded set. **So contact no longer uses the third face at all** — the page is sans plus
  mono micro-labels, and `--font-roman` is back to home statement + footer canvas only, which
  is what the typography rule above says it is for.
  **Kept at 400, not 300.** Lighter strokes read *sharper*, not softer, so dropping the weight
  would undo the request. `max-width` went `15ch → 13ch` because `ch` is the width of the
  font's own zero and Space Grotesk's is wider than Instrument Serif's — the same count would
  have widened the column.
  **A genuinely new face is the one thing that can't be done cheaply here**: a 4th family
  breaks the three-typeface rule, and replacing Instrument Serif instead would change the home
  statement and the footer canvas (`FONT` in `src/garden.js`), which are both off-limits
  without asking. Offered to Yae 2026-11-16, not taken up yet.
  Yae also asked for the hairline between the statement and the lead to be removed on
  2026-11-16; the gap alone separates them now.
- **`.contact-figure-index` (`01 / 03`) is the click affordance**, not decoration. A clickable
  photo with no hint is a control nobody finds. It also reports how many there are, which is
  the test for whether an index mark earns its place.
- **The layout is sized by whichever photo is showing** (2026-11-16, replacing the fixed
  40vw column). `.contact-view` is three columns — **text, empty, figure** (changed the same
  day: the photo was in the middle column with the slack on the right, which read as a pair
  sitting together on the left). The type is hard left, the photo's right edge sits on
  `--about-gutter` in line with the channel links below it, and the slack pools *between*
  them. Because the photo is right-aligned, a landscape shot grows leftward into that empty
  middle instead of pushing the page wider. `--contact-band` is the height of the middle row (where the
  header rule and the channels rule used to be) and is **constant**: `clamp(240px, calc(100vh - 350px), 700px)`. The
  figure is `height: var(--contact-band)` and
  `width: calc(var(--contact-band) * var(--contact-shape))`, where React sets
  `--contact-shape` inline from that photo'''s own aspect ratio.
  **Why it is built this way:** the two photos are opposite orientations (687x1031 portrait,
  1471x981 landscape). Cropping both into one frame throws away most of the landscape shot;
  letting the frame change height would reflow the whole page on every swap. Fixing the
  height and deriving the width means both fill the band uncropped and only the column width
  moves — and that move is a 360ms transition that runs while the shutter bars are covering,
  with the timeline holding `+=0.42` before it opens so the frame is never seen resizing.
  **Any new photo must carry its real pixel ratio in `contactPhotos`** or the frame will
  crop it.
- **There are two photos**, both landscape and both 3:2: `darkpool.avif` 1471x981 and
  `steps.avif` 1470x980, a figure silhouetted at the top of a flight of steps against a
  clouded sky. `moon.avif` (687x1031 portrait) was dropped on 2026-11-16 — Yae called it
  the small asset, which it was: portrait meant it rendered at `frame x 0.666` against the
  others' `x 1.5`, so it was visibly half the size of the other two.
  **The file is still in `src/assets/` and is untracked, so deleting it would lose it.** It
  is simply not imported.
  Because both remaining photos share a ratio the frame width no longer changes on a swap,
  so the 360ms width transition and the timeline's `+=0.42` hold are currently no-ops. Both
  stay: the sizing is driven by `contactPhotos` data, and a portrait shot would need them
  again the moment one is added.
- **The photo hangs below the top of its row by `--contact-drop`** (`clamp(16px, 2.8vh, 44px)`,
  added 2026-11-16) so it doesn't start level with the type. The drop is **subtracted from the
  frame, not added to the row** — `--contact-frame: calc(var(--contact-band) - var(--contact-drop))`
  is what the height *and* the width calc both use. Adding it as a plain `margin-top` instead
  would push a band-tall figure past a fixed-height grid track and straight over the EMAIL
  block. Deriving width from the frame is also what keeps the aspect ratio honest; derive it
  from the band and every photo stretches by the drop.
- **The photos are Yae'''s own photography, not portraits of him.** `moon.avif` is a crescent
  moon over a treeline; `darkpool.avif` is a player over a pool table under a strip light.
  Both monochrome, both very dark, both genuinely on-brand. They have real `alt` text because
  they are content, not decoration. **The about bio used to end on "bouldering or taking
  photos" and that line was cut on 2026-11-16** — now that his photographs carry a page,
  it is worth putting photography back into the bio. Raised, not done.
- **Both arrived as `.png` but were AVIF**, twice (`test.png`, `darkpoolportasset.png`).
  Renamed to `moon.avif` and `darkpool.avif` rather than re-encoded — converting an already
  compressed file only adds artifacts, and Vite handles `.avif` natively. **Check
  `identify` on anything Yae hands over**; the extension has been wrong every time so far.
  The three old PNGs (`img1/img2/img7`, 425KB) are deleted but in git history.
- **The figure has no border** (2026-11-16). It had `border-left` / `border-right` hairlines
  only, so the photo read as a slot cut between the header rule and the channels rule; the
  mobile stack had a full `1px` box. Yae asked for both gone. **Known consequence, unverified:
  the photos are near-black on a near-black page and now have nothing defining their edges** —
  if the moon shot dissolves into the background, that is why. Don't re-add a border without
  asking; a `background` a shade off black would be the quieter fix.
- **The swap control is conditional on `contactPhotos.length > 1`.** With one photo the figure
  renders as a `div` with no handler and no `01 / 02` index — a click target that cannot
  change anything is worse than nothing. With two it is a `button` again, automatically.
  `cursor: pointer` lives on `button.contact-figure`.

## Deploy and dependencies

Reviewed 2026-11-13. The site is static — no server, no database, no forms, no inputs,
no `fetch`, no `localStorage`, no `innerHTML`. There is no injection surface of any kind
(SQL, XSS or otherwise) and adding one would be a deliberate decision, not an accident.
So the only things that can actually hurt this project are the deploy pipeline and
what gets published.

- **bun is the package manager, not npm.** CI runs `bun install --frozen-lockfile`, so
  `bun.lock` is the only lockfile that counts. `package-lock.json` was deleted and is now
  gitignored — **never run `npm install` or `npm uninstall` here.** I removed `three` with
  npm on 2026-11-13 and it silently didn't ship, because npm only touched the lockfile CI
  ignores. Two lockfiles mean local and CI can resolve different trees.
- **`three` and `gsap` are both gone** (2026-11-13). Neither was imported anywhere; the
  bundle was 260.80 kB before and after, so they were never shipping — they were pure
  install-time surface. Deps are now just `react` + `react-dom`.
- **`deploy.yml` scopes permissions per job.** The build job runs third-party code and
  must never get `id-token: write`. Keep it that way. `oven-sh/setup-bun` is SHA-pinned
  because it's third party and a tag can be moved; `actions/*` are left on major tags
  because that's GitHub themselves. `bun-version` is pinned so CI matches local.
  Honest limit: scoping permissions does *not* make the build job safe — anything running
  there can poison `dist` before upload. The pin and the frozen lockfile are what help.
- **Verify a deploy change by actually running CI's commands**: `rm -rf node_modules &&
  bun install --frozen-lockfile && bun run build`. The workflow itself can't be tested
  locally; if it fails, the last deploy keeps serving, so a broken run is one line to fix.
- **The CV PDFs are published to the open web.** `src/links.js` imports both with `?url`,
  so they land in `dist/assets/` at crawlable URLs, and `robots.txt` is `Allow: /`.
  Google indexes PDFs. Whatever PII is in them (phone, address, DOB) is public and cached
  permanently. Flagged to Yae 2026-11-13 — **if he hasn't stripped them, raise it again.**
  Also, both PDFs link `js.jorgesimoes@gmail.com` and GitHub `Jorgefort`, while the site
  uses `jorgesimoes096@gmail.com` and `yaekuza`. Two identities, bad look for a recruiter.
- **Known and accepted, not bugs**: Google Fonts is hotlinked (CLAUDE.md mandates it; the
  cost is visitor IPs going to Google and a render-blocking cross-origin stylesheet), the
  email sits in plain markup for scrapers (he wants people to email him), and `npm audit`
  moderates are dev-only `minimatch` reaching through eslint — don't `--force` it, that
  downgrades eslint for nothing. No CSP, because GitHub Pages can't set headers; a
  `<meta http-equiv>` CSP was offered and not taken up.

## Repo notes

- Vite + React, no router — pages are `view` state in `src/App.jsx` with `pushState` +
  `popstate`. A bare `<a href="#page">` will **not** navigate; call `onNavigate(page)`.
- `src/App.jsx` and `src/App.css` hold basically everything. Home, about, projects and
  contact are all views in that one file. **Editing it by slicing between two markers is how
  I deleted `ProjectsView` by accident on 2026-11-11** — match exact text, or check what sits
  between your two anchors first.
- `.home-view` is its own scroll container with hijacked wheel + smooth easing
  (`HOME_SCROLL_SPEED` 0.85, `HOME_SCROLL_EASE`). Adding page length makes the scroll feel
  slower — account for it. **Every scroll input goes through the `glide(delta)` helper**, never
  `scrollTop` directly — it re-reads the element first so a native jump (tab to a link) can't
  desync the easing. Keyboard (arrows / space / PageUp-Down / Home / End) was wired through it
  on 2026-11-13; before that only `wheel` was handled, so keys snapped while the wheel eased.
  Touch is deliberately left native — the OS momentum scroll is better than our easing.
- **The spinning square beside the home story is gone** (removed 2026-11-11, he found it
  messy). All of it: markup, `.home-logo-pin*` CSS, the refs, `activeStoryIndex`, and the
  measured hero→pin handoff transforms. Don't rebuild any version of it. The story column
  is narrow on purpose and the right side of the page is meant to be empty.
- `@media (prefers-reduced-motion: reduce)` near the bottom of `App.css` kills the infinite
  animations. Any new `animation: … infinite` has to be added there.
- Check it with `npx vite --port 5174` and `npx eslint src`.
