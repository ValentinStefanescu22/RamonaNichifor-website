---
name: Ramona Nichifor
description: The meadow from her own book cover. Sky wash, plum ink, a butterfly that flies down the page and lands.
colors:
  ink: "#34224a"
  ink-soft: "#5e4a75"
  violet: "#7a5fb0"
  magenta: "#b8468a"
  lilac: "#c9b8e6"
  petal: "#f6dde6"
  sky: "#d6e6f5"
  mist: "#eef3fa"
  sage: "#dfe7d4"
  leaf: "#6f8a5a"
  cream: "#fbf7f1"
  paper-mat: "#fffdf9"
typography:
  display:
    fontFamily: "Fraunces, Iowan Old Style, Palatino Linotype, Georgia, serif"
    fontSize: "clamp(3.7rem, 17vw, 8.6rem)"
    fontWeight: 380
    lineHeight: 1
    letterSpacing: "-0.02em"
    fontVariation: "\"SOFT\" 100, \"WONK\" 0"
  display-accent:
    fontFamily: "Fraunces, Iowan Old Style, Palatino Linotype, Georgia, serif"
    fontSize: "inherit"
    fontWeight: 380
    lineHeight: 1
    letterSpacing: "-0.02em"
    fontVariation: "\"SOFT\" 100, \"WONK\" 1"
  headline:
    fontFamily: "Fraunces, Iowan Old Style, Palatino Linotype, Georgia, serif"
    fontSize: "clamp(2.4rem, 9vw, 4.2rem)"
    fontWeight: 380
    lineHeight: 1
    letterSpacing: "-0.02em"
    fontVariation: "\"SOFT\" 100, \"WONK\" 0"
  statement:
    fontFamily: "Fraunces, Iowan Old Style, Palatino Linotype, Georgia, serif"
    fontSize: "clamp(1.6rem, 6vw, 2.6rem)"
    fontWeight: 360
    lineHeight: 1.15
    letterSpacing: "-0.02em"
    fontVariation: "\"SOFT\" 100, \"WONK\" 0"
  tagline:
    fontFamily: "Fraunces, Iowan Old Style, Palatino Linotype, Georgia, serif"
    fontSize: "clamp(1.35rem, 4.8vw, 1.9rem)"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "-0.02em"
    fontVariation: "\"SOFT\" 100, \"WONK\" 0"
  title:
    fontFamily: "Fraunces, Iowan Old Style, Palatino Linotype, Georgia, serif"
    fontSize: "1.4rem"
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: "-0.02em"
    fontVariation: "\"SOFT\" 100, \"WONK\" 0"
  body:
    fontFamily: "Alegreya Sans, Gill Sans, Segoe UI, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  body-lead:
    fontFamily: "Alegreya Sans, Gill Sans, Segoe UI, system-ui, sans-serif"
    fontSize: "1.08rem"
    fontWeight: 400
    lineHeight: 1.625
  button:
    fontFamily: "Alegreya Sans, Gill Sans, Segoe UI, system-ui, sans-serif"
    fontSize: "1.02rem"
    fontWeight: 500
    lineHeight: 1.2
  label:
    fontFamily: "Alegreya Sans, Gill Sans, Segoe UI, system-ui, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.08em"
rounded:
  pill: "9999px"
  arch: "999px 999px 28px 28px"
  arch-halo: "999px 999px 40px 40px"
  row: "28px"
  tile: "24px"
  cover: "4px 10px 10px 4px"
  mat: "4px"
spacing:
  hairline: "4px"
  xs: "8px"
  sm: "12px"
  md: "16px"
  gutter: "16px"
  gutter-sm: "24px"
  lg: "24px"
  xl: "40px"
  xxl: "56px"
  section: "80px"
  section-lg: "112px"
  container: "1152px"
  tap-min: "44px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.cream}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "6px 6px 6px 24px"
    height: "48px"
  button-primary-seed:
    backgroundColor: "rgb(251 247 241 / 0.15)"
    textColor: "{colors.cream}"
    rounded: "{rounded.pill}"
    size: "36px"
  button-glass:
    backgroundColor: "rgb(251 247 241 / 0.8)"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "0 16px 0 12px"
    height: "44px"
  path-chip:
    backgroundColor: "rgb(251 247 241 / 0.85)"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "44px"
  menu-button:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.cream}"
    rounded: "{rounded.pill}"
    size: "44px"
  lang-toggle:
    backgroundColor: "rgb(251 247 241 / 0.7)"
    textColor: "{colors.ink-soft}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "4px"
    height: "44px"
  lang-toggle-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.cream}"
    rounded: "{rounded.pill}"
    height: "36px"
    width: "44px"
  path-row:
    textColor: "{colors.ink}"
    rounded: "{rounded.row}"
    padding: "16px"
    height: "96px"
  path-row-hover:
    backgroundColor: "rgb(255 255 255 / 0.6)"
  universe-window:
    backgroundColor: "{colors.sky}"
    rounded: "{rounded.arch}"
    width: "min(72vw, 300px)"
  status-available:
    backgroundColor: "{colors.magenta}"
    textColor: "{colors.cream}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "2px 10px"
  status-soon:
    backgroundColor: "rgb(52 34 74 / 0.1)"
    textColor: "{colors.ink-soft}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "2px 10px"
  orb-label:
    backgroundColor: "rgb(251 247 241 / 0.8)"
    textColor: "{colors.ink}"
    typography: "{typography.title}"
    rounded: "{rounded.pill}"
    padding: "2px 12px"
  item-tile:
    backgroundColor: "rgb(251 247 241 / 0.8)"
    textColor: "{colors.ink}"
    rounded: "{rounded.tile}"
  art-frame:
    backgroundColor: "{colors.paper-mat}"
    rounded: "{rounded.mat}"
    padding: "12px"
  icon-seed:
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    size: "56px"
  social-button:
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    size: "44px"
  social-button-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.cream}"
---

# Design System: Ramona Nichifor

## Overview

**Creative North Star: "Stepping Into the Cover"**

The site is the meadow from the cover of *Fluturele dansator de step*: a powder-blue sky at the top of every screen, her own flower painting rising at the bottom, and soft plum ink in between. The visitor walks into the illustration rather than reading a brochure about it. One committed light world; there is no dark variant by design. Everything that feels soft does so through light, air and watercolor edges, never through ornament piled on.

Two grounds share one palette. The **meadow** (home) runs sky → mist → cream with the painting at its foot. The **sky** (Universuri and each universe page) drops the meadow, keeps the same tokens, and adds free-floating watercolor orbs (no connecting line) that drift constantly and grow when you look at one, plus drifting pollen; a universe page tints that same sky with its own colour. Type is Fraunces at its softest (SOFT 100) for everything that speaks, with its wonky italic reserved for the one word in a line that should sing; Alegreya Sans carries everything that informs.

Motion is the signature, and it always ends at rest. Her butterfly (the real cut-out from the cover, split at the body so each wing hinges in 3D) waits beside the headline, flies a scroll-driven path down the page and lands on the Universul Fluturelui window. Entrances paint in: blur-to-sharp rises, soft blooms, a meadow that lifts into place. Content never depends on motion to become visible.

**Key Characteristics:**
- Sky-to-cream vertical washes; the painting, not a pattern, is the texture.
- Plum ink (never black) for all text; magenta is the butterfly's spark, used sparingly.
- Fraunces SOFT 100 display, WONK italic only on accent words; Alegreya Sans body at 17px.
- Arched windows, orbs and pills. Nothing square, nothing bordered.
- Plum-tinted, long, low shadows; glass pills over imagery.
- A butterfly that flies and lands; worlds that drift freely and grow when you look at them.
- Romanian first, English on a visible toggle.

## Colors

A pastel spring palette lifted from the client's own cover, anchored by one deep plum that does all the reading work.

### Primary
- **Plum Ink** (ink): every heading and body-strength text, the primary button, the menu button, the active language thumb. Plum, not black, so type sits inside the watercolor instead of on top of it.
- **Dusk Plum** (ink-soft): secondary text, leads, captions, inactive toggle labels. Still passes on cream, mist, petal and sage.

### Secondary
- **Wing Violet** (violet): the accent word in display lines (the italic "Nichifor"), the series title „Magia suntem noi”, path icons and arrows, the book metadata line.
- **Butterfly Magenta** (magenta): the spark. Focus ring, the "Available" status, "Descoperă" links, the WONK emphasis in the manifesto, the tap-a-world hint. Rare by design.

### Tertiary
- **Lilac** (lilac): link underlines (2px, 6px offset), the paint-edged halo behind the portrait at 45%.
- **Petal Blush** (petal): the Book section's middle wash, text selection, the books path seed.
- **Sage** (sage) with **Leaf** (leaf): the counselling ground and its icon colour. Leaf is only used as an icon tint on cream seeds.

### Neutral
- **Powder Sky** (sky): the top of every wash (hero, Fluturelui window).
- **Mist** (mist): the middle of washes; the Art section ground.
- **Meadow Cream** (cream): the page ground, the bottom of every wash, the colour of text on plum, the base of every glass pill.
- **Paper Mat** (paper-mat): the warm white mat framing a painting in the Art section only.

**Universe tints are content, not tokens.** Each universe carries a light / mid / deep triple in the CMS (Fluturele pink, Buburuza coral, Țânțarul blue, Musca green; see the sidecar). They colour its orb, its creature, its status text and its tinted sky, and nothing else.

**The Plum-Not-Black Rule.** No text, icon or button is ever #000 or a grey. Text is ink or ink-soft; on ink, text is cream.

**The One Spark Rule.** Magenta marks what is alive or actionable right now (focus, available, discover). If two magenta things compete in a viewport, one of them is wrong.

## Typography

**Decision (2026-10-01):** the „Poveste” pairing below is final, confirmed after comparing it with Newsreader + Commissioner, Literata + Atkinson Hyperlegible Next, and Instrument Serif + Hanken Grotesk.

**Display Font:** Fraunces (variable: opsz auto, wght 300–700, SOFT, WONK, roman + italic), falling back to Iowan Old Style, Palatino Linotype, Georgia.
**Body Font:** Alegreya Sans (400, 500, 700, italics 400/500), falling back to Gill Sans, Segoe UI, system-ui.

**Character:** A storybook serif at its roundest, paired with a humanist sans that has a calligraphic pulse. Together they read as one hand writing both the story and the note beside it.

Load both through next/font as self-hosted variable files with the `latin-ext` subset so ă â î ș ț (comma-below, not cedilla) render in every weight and italic. Fraunces must keep its SOFT and WONK axes (`axes: ["SOFT","WONK","opsz"]`).

### Hierarchy
- **Display** (380, clamp 3.7–8.6rem, line-height 1, -0.02em): the name in the hero and footer. Two lines, second line indented 0.6em (0.9em from sm) and set as the violet WONK italic.
- **Headline** (380, clamp 2.4–4.2rem, line-height 1): section titles. Book and universe page titles run slightly smaller (clamp 2.3–4rem and 2.6–4.6rem).
- **Statement** (360, clamp 1.6–2.6rem, line-height 1.15, max 24ch): the intro line under the hero; the manifesto runs larger (clamp 1.9–3.6rem, line-height 1.12, max 20ch) with its key words in magenta WONK italic.
- **Tagline** (400 italic, clamp 1.35–1.9rem, line-height 1.2, max 22ch): „Povești pentru suflete mici și mari”, book subtitles (1.3rem), the series title (1.25–1.35rem, violet).
- **Title** (400, 1.25–1.55rem, line-height 1.25): path names, universe names, art captions, counselling formats. The full-screen menu uses this face at 2.6rem.
- **Body** (400, 17px, line-height 1.6): running text, 52–58ch measure. Leads use 1.05–1.1rem at line-height 1.625 in ink-soft.
- **Button** (500, ~1.02rem): all pill actions. Store names inside the button go to 700.
- **Label** (700, 0.78–0.8rem): status badges and the RO | EN toggle. Only the toggle is uppercase with 0.08em tracking.

**The Soft Axis Rule.** Every Fraunces setting carries SOFT 100. WONK 1 is allowed only on italic accent words (the second name line, manifesto emphases, the wordmark), never on a whole paragraph.

**The Diacritics Rule.** A face or weight that cannot render ă â î ș ț correctly does not ship. Check the wordmark, "Țânțarului" and "Poveștile" in every weight used.

## Layout

Mobile-first, single column, centred container of 72rem (1152px) with 16px gutters (24px from 640px). Sections breathe vertically: 80px top and bottom, 112px from 1024px. Headings, leads and actions stack with 12 / 16 / 24 / 40 / 56px steps.

- **Hero.** At least `max(640px, 100svh)` (720px on desktop). Phone: wordmark + RO|EN + menu at the top, headline in the upper third starting 9vh down, butterfly perched at top-right (27vw, max 130px), meadow filling the bottom `clamp(190px, 33vh, 380px)` with the three path chips sitting at its edge. Desktop (1024px+): two columns (1.15fr / 0.85fr), butterfly 300px in the right column, meadow pinned to the bottom `clamp(200px, 29vh, 340px)`.
- **Horizontal rows on phones.** Universe windows (72vw, max 300px) and art pieces (70vw, max 320px) scroll sideways with centre snap and a hidden scrollbar; the row's side padding aligns its first item with the container edge. From 1024px they become grids (4 and 3 columns; the middle painting drops 64px).
- **Two-column splits** on desktop for Book (0.9fr / 1.1fr), About (0.8fr / 1.2fr), Counselling (1fr / 1fr), gaps of 48–80px.
- **Universuri (sky variant).** Sticky intro column (0.8fr) beside the world map (1.2fr) on desktop; on phones the intro sits above. The map is a box whose height is width × 1.2 (phone) or × 0.98 (desktop); orbs sit at fixed fractional spots, the featured universe larger (44% / 40% of width, others 27–28%). Each orb column is at least 144px wide.
- **Anchors** scroll with an 80px top margin so the floating bar never covers a title.
- Breakpoints: 640px (gutters), 1024px (desktop nav, grids, two columns).

**The At-Rest Rule.** Every section is fully readable with all motion removed. Layout never reserves empty space for something that only arrives by animation, except the butterfly's own perch.

## Elevation & Depth

Depth comes from air, not stacking. Surfaces are flat washes; lift is reserved for things you can hold (buttons, pills, the book, arched windows) and is always plum-tinted, long and low, as if lit by the same sky. Glass (cream at 75–85% with backdrop blur) is the only way a control floats over imagery. Parallax layers in the hero (wash, hazy back meadow, sharp front meadow, text) give the scene its depth.

### Shadow Vocabulary
- **Soft lift** (`0 1px 2px rgb(52 34 74 / 0.06), 0 18px 40px -18px rgb(52 34 74 / 0.28)`): primary buttons, path chips, the floating bar, glass buttons, arched windows, the art mat.
- **Book lift** (`0 2px 4px rgb(52 34 74 / 0.08), 0 30px 60px -24px rgb(52 34 74 / 0.45), inset 3px 0 6px -3px rgb(255 255 255 / 0.5)`): book covers only; the inset highlight is the spine.
- **Orb volume** (inset `-10px -14px 30px` of the deep tint at 20% and `8px 10px 24px` white at 50%): the watercolor orbs, plus a blurred mid-tint glow 18% outside.

**The Plum Shadow Rule.** Shadows are always tinted with ink (52 34 74), never neutral black, and never hard-edged or offset.

## Shapes

Round, arched and painted. Controls are full pills or circles. Universe windows and the portrait are **arches**: fully rounded tops falling to 28px bottom corners (the portrait's lilac halo uses 40px). Path rows round at 28px, universe-page tiles at 24px. The book cover has a spine (4px left, 10px right corners); a painting sits on a nearly square 4px mat so it reads as an object, not a card.

Watercolor edges come from SVG displacement filters, not images: a **paint edge** (fractal noise, base frequency 0.035, 3 octaves, displacement 12) on arches and seed circles on the meadow; a softer **orb edge** (0.028, displacement 6) on the sky; a heavy **paint bloom** (0.012, 4 octaves, displacement 60, blur 6) for the pink-lilac wash behind the hero name. Image edges are always feathered with mask gradients so no photo or painting ever shows a straight edge against the sky.

**The Arch Window Rule.** A universe, a portrait or a scene is framed as an arch or an orb; rectangles are for the book and the paintings, because those are real objects.

## Components

### Buttons
Soft, weighty pills that feel pressed into the page.
- **Primary** (Plum Ink pill, cream text, 48px tall, 24px left padding): carries a 36px cream-15% "seed" circle at its right end holding the arrow, store arrow or WhatsApp mark. Press: scales to 0.97 in 150ms. Hover: the seed nudges toward its arrow (down 2px for "Intră în poveste", up-right for stores) over 300–500ms with the bloom easing. Focus: 2px magenta outline, 3px offset.
- **Glass** (cream 80%, blur, 5% ink hairline ring, 44px): "back" on universe pages and anything floating over a sky.
- **Text link with arrow** (700, magenta or ink with 2px lilac underline at 6px offset, 44px row height): "Descoperă", "Întreabă despre o lucrare". Arrow slides 4px right on hover.
- **Circle buttons** (44px): menu (ink), social (25% currentColor ring; fills ink with cream icon on hover).

### Path chips and path rows
- **Path chips** sit on the meadow's edge: cream 85% glass pills, 44px (48px desktop), violet 17px icon plus label. Press to 0.96.
- **Path rows** repeat the three paths below the hero with equal weight: a 56px icon seed (tinted circle with paint edge: petal / light sky / sage), title in Fraunces, one line in ink-soft, violet arrow. No background at rest; white 60% on hover, arrow slides 4px. Row on phones, three columns on desktop.

### Language toggle
A 44px cream-70% pill with two 44×36px segments (RO first, default). The active segment has an ink thumb with cream text that slides between segments on a spring (bounce 0, 0.35s). Each segment's hit area extends 4px above and below. Switching the language cross-fades the page with a 0.28s view transition (skipped under reduced motion), updates `<html lang>`, and persists the choice.

### Navigation
- **Top bar** (in the hero, not fixed): italic WONK wordmark at 1.35–1.5rem, desktop section links in ink-soft (hover: ink with lilac underline), toggle, menu button on phones.
- **Floating bar**: once the hero has scrolled 85% of a viewport, a cream-75% glass pill (max 768px wide, blur and saturation, soft lift, 10px below the safe area) blurs in from above in 0.5s.
- **Menu sheet** (phones): full-screen cream with the wash top-right and the meadow along the bottom; it opens as a circle growing from the menu button (0.7s, bloom easing), items rise in at 2.6rem Fraunces with a 0.05s stagger, socials fade in last. Escape closes; the body stops scrolling.
- **Every page shares this chrome.** Menu order: Universuri, Cărți, Despre mine, Artă, Consiliere, Comunitate, Contact (plus Acasă in the sheet and footer). The current page carries `aria-current` and the lilac underline (italic violet in the sheet). Inline links show from 1280px; below that the menu button is used. Links are 44px tall.
- **Content edge.** Header, page titles, sections and footer share one left edge: a 75rem container with 16/24px side padding, which lands exactly where sections that pad on the outside do (144px at 1440).

### Page opener (inner pages)
Every inner page opens the same way: the header over the page's own ground, the masked wash top-right, an `<h1>` at clamp 3.1–6.4rem (an optional second line in violet WONK italic, indented like the home name: „Despre / mine”, „Comunitate / cu sens”), an italic tagline, a lead, actions, and one signature element beside it (portrait with the butterfly, cover stack, hanging frame, session formats, the butterflies gathering in an arch window, the form). Inner-page openers tint the sky toward the page's own colour, the way universe pages do: petal (Cărți, Comunitate), sage (Consiliere), lilac (Despre), mist (Artă, Contact).

### Footer
One footer everywhere: the name with violet „Nichifor”, the souls tagline, socials and email, all pages in two columns, the placeholder line, and the meadow strip at the bottom, so every page lands on the same ground. Only the light above the meadow changes with the page (`ground`): cream, sky (Universuri: cream opening back into sky), sage (from the pale sage of the counselling close), mist, petal. The ground at the top of the footer always equals the colour the page ends on, so there is never a seam.

### Universe window (home)
An arched window, 3:4, soft lift. The live universe is a small copy of the hero (sky wash + meadow; the painting zooms to 1.04 over 1.4s on hover) and is the butterfly's landing perch. Unreleased universes show their creature on a paint-edged tint circle and a cream badge in the universe's deep tint. Name in Fraunces below, book title in italic ink-soft, "Descoperă" (magenta when live, ink-soft otherwise). Every window links to its universe page, including the ones still „în curând”.

### Watercolor orb (Universuri sky)
A perfectly round orb painted in its universe tint (light highlight at 36% / 30%, mid at the edge), with a smooth rim feathered over 1.5px (no displacement filter; it left jagged steps), inset volume, and a blurred glow halo that breathes only when the universe is live. It holds the flapping butterfly (live) or the line-drawn creature. Beneath: a glass name pill in Fraunces and a status badge (magenta "Disponibilă" / 10% ink "În curând"). The orb is the button. Orbs are never joined by a line; each drifts on its own and the one being looked at grows (see Orb focus in the Motion Vocabulary); press is 0.97. Opening it morphs the orb into the universe page's header orb.

### Universe page
A full-screen dialog on the universe's tinted sky with its own pollen. Glass back button + toggle at the top, the header orb (min(64vw, 300px)), title, italic book title, status badge, a hook paragraph (46ch). "În acest univers" lists items as 24px-rounded glass tiles on a 70% tint panel (2 columns, 4 from 1024px); items not yet made say "în curând". Live: primary store buttons; not live: a primary "anunță-mă" via Instagram. "Alte universuri" shows the other three as small orbs that switch in place. Escape and browser back close it; a shared `#id` link opens it directly.

### Book cover
A real cover image with a spine radius, book lift and a -2.5° resting tilt. With a mouse it tilts toward the pointer (up to 7° / 5°) on a spring and settles on leave; touch keeps it still.

### Status badges
Small 700 labels in pills. On the sky: magenta with cream for available, ink 10% with ink-soft for coming soon. On an arch window: cream 88% with the universe's deep tint.

### Inner-page components
- **Section title**: the headline role (clamp 2.2–3.8rem, 380) for every section h2 on inner pages; statements (clamp 1.6–2.6rem, 360) for closing lines.
- **Status chip**: one component. Magenta with cream text only for what is available now; everything coming is a 10% plum tint with ink-soft text. No ring. It sits *below* the title it describes, never above.
- **Links**: the ink pill with seed circle is the primary action; the underlined text link with a lilac 2px underline and moving arrow is the secondary. Nothing outlined.
- **Age switch (Cărți)**: tabs Copii · Adolescenți · Adulți on a white-60% pill; the ink thumb slides with a critically damped spring (0.4s); arrow keys, Home and End move between tabs.
- **Shelf**: covers stand on a soft plum contact shadow and lift 8px with a 1.5° tilt on hover; magenta link only on the available book.
- **Opening cover (book page)**: the cover is hinged at the spine and opens −24° on hover or tap, showing a page with faint lines beneath.
- **Gallery wall (Artă)**: column masonry (2 → 3 columns), each work on a #fffdf9 mat with the soft shadow and a museum label (title, technique · size, availability dot, price when available). Sold is a quiet plum dot, never magenta. Filter chips use the same sliding ink thumb.
- **Artwork sheet**: rises from the bottom on phones (spring, no bounce; drag the handle down to dismiss, velocity-aware), a centred two-column panel on laptop; Esc, Back and the close button close it, focus returns to the frame, Tab stays inside.
- **Steps (Consiliere)**: numbered (a real sequence) on a leaf stem that grows with scroll; italic WONK numerals in leaf on cream discs.
- **FAQ**: native `<details>` with a height transition where the browser can animate to `auto`; the plus turns 45°.
- **Contact form**: paper fields (white 72%, 1px plum hairline as inset shadow, magenta 2px focus), 17px text so iOS never zooms, subject chips as native radios, inline errors in a muted red under each field plus a summary, focus to the first problem. The success note is a slightly tilted paper card that says honestly that the mockup sends nothing.
- **Product page**: one template for every universe keepsake, opened from „În acest univers”: the universe-tinted sky, „← Universul X”, the product visual, the name with the universe as a violet WONK italic second line, the status chip and price below the title, specs, then „Din același univers” (the book first). Every book has its own book page too; the Fluture book page is the same from Universuri and from Cărți.
- **Booking (Consiliere)**: inside one white-60% card. Numbered steps (format → day → time → details) reveal in turn with a short fade and focus moving to the next step. Format chips use the sliding ink thumb; the month calendar has 44px round days (open days bold with a small leaf dot, past and closed days at 45% ink-soft, today ringed, the chosen day solid ink); times are pill chips; the confirmation is the tilted paper note with the summary and an honest mockup line.
- **Partner card (Comunitate)**: white-60% card with the logo, or a painted initial in Fraunces WONK italic on a smooth lilac-petal disc, the name, one line and the handle with an outbound arrow.
- **Butterflies gathering (Comunitate hero)**: six real cover butterflies at different sizes, flying in from every side with a damped spring and settling over the meadow inside an arch window; each keeps its own wingbeat and slow drift.
- **Spam guards**: every form carries an off-screen honeypot and a 3-second time trap; spam gets the normal success state.
- **Painted placeholders**: code-painted watercolour pools in the palette (paler centres, darker drying rims, paint-edge filter) stand in for paintings, covers and spreads until the real scans arrive. They are always marked placeholder in content.

### Email copy
The address is shown as selectable text with a 44px "Copiază" pill that confirms "Copiat" for 1.8s and announces it politely; mail links are not relied on.

### Motion Vocabulary

Motion is part of every component above; this is the shared grammar. Exact tokens live in the sidecar (`.impeccable/design.json`, `extensions.motion`).

- **Easing.** Bloom (`cubic-bezier(0.16, 1, 0.3, 1)`) for every entrance, reveal and hover. Glide (`cubic-bezier(0.2, 0.9, 0.1, 1)`) for orbs and the morph. Sway (`cubic-bezier(0.45, 0.05, 0.55, 0.95)`) for anything that breathes (bob, glow). Drift (`cubic-bezier(0.37, 0, 0.63, 1)`, a sine) for the orbs' endless float, so their speed changes continuously and never stops dead. Springs never bounce, except the flight.
- **Paint-in entrance** (CSS keyframes so it finishes even in background tabs): the name rises from 0.35em below and a 10px blur (1.1s, lines at 0.25s and 0.37s); tagline, roles and CTA fade up 14px (0.9s at 0.62 / 0.72 / 0.84s); path chips at 1.0s; the pink bloom grows from 0.55 (1.8s); the wash fades in (1.4s); the meadow lifts 24px out of an 8px blur (1.2s).
- **Parallax meadow.** Through the hero's scroll: wash drifts down 18%, the hazy back meadow up 10%, the sharp meadow up 26%, the text down 22%.
- **Butterfly.** Wings hinge in 3D (left 6°→66°, right mirrored) alternating every 0.34s; 0.16s while flying fast; 1.1–1.5s when perched or in an orb; wings open at ±18° when stopped. It arrives from off-screen (1.6s, delay 0.5s), bobs 7px on a 3.2s sway, then follows a scroll-driven Catmull-Rom path (hero perch → left → right → the Fluturelui window) through a spring (stiffness 70, damping 18, mass 0.7), banking up to 28°, flutter settling as it lands and growing to the perch size. At 99.2% it hands over to a perched twin inside the window, so it scrolls with the row.
- **Orbs.** Paint in from 0.6 scale and 8px blur (1.1s, staggered 0.15s); live glow breathes 45–80% opacity over 3.6s. There is no connecting line between them.
- **Orb drift.** Each world (orb, name and badge together) drifts on its own slow Lissajous loop: x ±8px and y ±10px, with the orb alone tilting ±2.5° so text never rotates. Half-periods per orb: x 7.3 / 8.9 / 6.7 / 9.4s, y 5.1 / 6.3 / 5.8 / 7.1s, tilt 9.7 / 11.3 / 10.1 / 12.2s, with staggered negative delays. The periods are incommensurate so the worlds never move in step. Transform-only CSS animations, so they stay on the compositor (measured steady 60fps).
- **Orb focus.** The world being looked at grows to 1.22 (from 50% 85%, so it grows upward, away from its label) and rises above the others; the rest go to 0.9 at 70% opacity, their labels to 72%. Transform 0.6s and opacity 0.4s, both glide, with no bounce. All worlds share one size at rest (phones 32% of the map width, laptops 26%); no world is bigger by default, the live one included. On hover-capable devices, "looked at" means mouse or pen hover and keyboard focus; with no pointer on a world, all sit at 1. On touch screens (`hover: none`) nothing grows until the visitor starts scrolling; after that it's the world nearest the middle of the screen (within 45% of the viewport height, with a 24px margin so it never flickers between two). The page leaves enough scroll room below the map for the last world to reach the middle.
- **Pollen.** A canvas of up to 80 motes (one per 9,000px²) rising slowly with a 0.9s twinkle, magenta and violet on the Universuri sky (strength 0.5), the universe tint plus lilac on a universe page (0.55). Pauses off-screen.
- **Morph.** Opening a universe runs a view transition typed `morph`: the orb (`view-transition-name: universe-orb`) travels and grows into the page's header orb (group 0.6s glide, cross-fade 0.35s, root 0.5s). Closing reverses into the original orb.
- **Press.** Every tappable pill scales to 0.97 (chips 0.96, menu 0.94) in 150ms.

**The Reduced-Motion Rule.** Under `prefers-reduced-motion: reduce` all animations and transitions collapse to their end state; the flight does not render and the butterfly sits perched with wings open, both in the hero and in the window; pollen draws one still frame; parallax, drift and glow stop (orb focus still applies, instantly); view transitions (language switch and morph) are skipped and state changes instantly; smooth scrolling is off. Nothing is hidden as a result.

## Do's and Don'ts

### Do:
- **Do** open every screen on the sky (powder sky → mist → cream) and end the home page on the meadow painting.
- **Do** set every text colour from ink or ink-soft, and cream on ink.
- **Do** carry SOFT 100 on every Fraunces setting; keep WONK italic for one accent word or name line.
- **Do** keep every tap target at least 44×44px (primary actions 48px), including toggle segments, icon buttons and text links.
- **Do** default to Romanian, show the RO | EN toggle in the top bar, floating bar and universe pages, and keep `<html lang>` in sync.
- **Do** frame universes as arches or orbs, and paintings and books as real objects (mat, spine).
- **Do** make content visible at rest and give every motion a reduced-motion end state.
- **Do** mark unreleased universes and items as „în curând” rather than inventing content.

### Don't:
- **Don't** use the line „Bine ai revenit acasă, puiule!” / "Welcome home, baby" anywhere.
- **Don't** put an eyebrow or kicker (a small label line above a heading); the heading leads, context goes below it.
- **Don't** use bordered cards or grey boxes; the only outline is a 5% ink hairline on glass pills and tiles over imagery.
- **Don't** use black or neutral-grey shadows, or hard offset shadows.
- **Don't** add a dark mode or a night sky; the dusk Universuri look is not part of this world.
- **Don't** replace the SVG line icons (24px grid, 1.5 stroke, round joins) with emoji, glyph characters or a mixed icon set.
- **Don't** let any image show a straight edge against the sky; feather it with a mask.
- **Don't** ship a font or weight that drops or mangles ă â î ș ț.
