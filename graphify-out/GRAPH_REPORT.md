# Graph Report - RamonaNichifor-website  (2026-10-01)

## Corpus Check
- 57 files · ~64,197 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 511 nodes · 1284 edges · 34 communities (30 shown, 4 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 77 edges (avg confidence: 0.84)
- Token cost: 432,682 input · 0 output

## Community Hubs (Navigation)
- Book Pages
- Butterflies & About
- Contact & Home
- Dependencies
- Counselling Booking
- Spec Pages & Booking
- Design System Rules
- Universe Creatures
- Payload Collections
- TS Config
- Book & Series Facts
- Art Gallery
- Motion Rules
- Page Entrypoints
- Typography
- Inner Page Components
- Image Pipeline
- Universe & Product Pages
- Product Brief
- Poiana Concept
- Hosting
- SEO & i18n
- Core CMS Content
- Shop (M7)
- Motion & Performance
- Mug Asset
- Wash Asset
- Cover North Star
- Stack & M1 Fixes
- Butterfly Sprites
- Meadow Assets
- Artifact Publishing
- Portrait Asset

## God Nodes (most connected - your core abstractions)
1. `Ramona Nichifor Website Spec` - 37 edges
2. `DESIGN.md (Design System: Ramona Nichifor)` - 35 edges
3. `Payload CMS` - 29 edges
4. `react` - 28 edges
5. `SiteShell()` - 26 edges
6. `Icon()` - 24 edges
7. `ArrowRight()` - 22 edges
8. `useLang()` - 20 edges
9. `t()` - 17 edges
10. `TextLink()` - 17 edges

## Surprising Connections (you probably didn't know these)
- `Google Fonts link (Fraunces SOFT/WONK + Alegreya Sans)` --semantically_similar_to--> `Self-hosted fonts via next/font (Fraunces, Alegreya Sans)`  [INFERRED] [semantically similar]
  mockups/index.html → docs/superpowers/specs/2026-09-30-ramona-site-design.md
- `Banned tagline` --semantically_similar_to--> `Banned tagline rule`  [INFERRED] [semantically similar]
  docs/superpowers/specs/2026-09-30-ramona-site-design.md → DESIGN.md
- `Spam guards` --semantically_similar_to--> `Cloudflare Turnstile`  [INFERRED] [semantically similar]
  DESIGN.md → docs/superpowers/specs/2026-09-30-ramona-site-design.md
- `Home page` --references--> `mockups/index.html (Poiana mockup entry)`  [INFERRED]
  docs/superpowers/specs/2026-09-30-ramona-site-design.md → mockups/index.html
- `mockups/index.html (Poiana mockup entry)` --conceptually_related_to--> `SEO strategy`  [INFERRED]
  mockups/index.html → docs/superpowers/specs/2026-09-30-ramona-site-design.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Magia suntem noi series titles** — mockups_assets_src_cover_fluturele_spread_fluturele_dansator_de_step, mockups_assets_src_cover_fluturele_spread_buburuza_rotunjoara, mockups_assets_src_cover_fluturele_spread_tantarul_cu_cizme_de_cauciuc, mockups_assets_src_cover_fluturele_spread_musca_ratacita [EXTRACTED 1.00]
- **Three user-pinned homepage directions (Poiana, Jurnalul, Universuri)** — _impeccable_surfaces_mockups_src_poiana_app_tsx_concept_a_poiana, mockups_index [EXTRACTED 1.00]
- **Orb to universe page morph flow** — design_watercolor_orb, design_orb_focus, design_morph_view_transition, design_universe_page, docs_superpowers_specs_2026_09_30_ramona_site_design_universe_detail_page, docs_superpowers_specs_2026_09_30_ramona_site_design_view_transitions [INFERRED 0.85]
- **Native booking stack** — docs_superpowers_specs_2026_09_30_ramona_site_design_native_booking_flow, docs_superpowers_specs_2026_09_30_ramona_site_design_availability_global, docs_superpowers_specs_2026_09_30_ramona_site_design_bookings_collection, docs_superpowers_specs_2026_09_30_ramona_site_design_google_calendar_freebusy, docs_superpowers_specs_2026_09_30_ramona_site_design_resend, docs_superpowers_specs_2026_09_30_ramona_site_design_slotsfor [EXTRACTED 1.00]
- **Payload CMS infrastructure** — docs_superpowers_specs_2026_09_30_ramona_site_design_payload_cms, docs_superpowers_specs_2026_09_30_ramona_site_design_postgres, docs_superpowers_specs_2026_09_30_ramona_site_design_cloudflare_r2, docs_superpowers_specs_2026_09_30_ramona_site_design_next_js_16, docs_superpowers_specs_2026_09_30_ramona_site_design_payload_local_api, docs_superpowers_specs_2026_09_30_ramona_site_design_afterchange_revalidatetag_hook [EXTRACTED 1.00]
- **Butterfly sprite set (full + split wings)** — mockups_public_img_butterfly_butterfly_illustration, mockups_public_img_butterfly_wing_l_left_wing, mockups_public_img_butterfly_wing_r_right_wing [INFERRED 0.85]

## Communities (34 total, 4 thin omitted)

### Community 0 - "Book Pages"
Cohesion: 0.08
Nodes (58): App(), OpeningCover(), pick(), AgeTabs(), App(), CoverStack(), ShelfItem(), App() (+50 more)

### Community 1 - "Butterflies & About"
Cohesion: 0.10
Nodes (37): flock, App(), Craft(), Portrait(), catmullRom(), Flight(), Geometry, pathAt() (+29 more)

### Community 2 - "Contact & Home"
Cohesion: 0.12
Nodes (38): App(), ContactForm(), Errors, Field(), subjectFromHash(), validate(), Values, App() (+30 more)

### Community 3 - "Dependencies"
Cohesion: 0.06
Nodes (31): dependencies, motion, react, react-dom, devDependencies, tailwindcss, @tailwindcss/vite, @types/node (+23 more)

### Community 4 - "Counselling Booking"
Cohesion: 0.13
Nodes (29): App(), Faq(), Formats(), Steps(), Booking(), BookingSection(), Calendar(), Errors (+21 more)

### Community 5 - "Spec Pages & Booking"
Cohesion: 0.09
Nodes (21): Booking component, About page, availability global, Banned tagline, bookings collection, Counselling page, Google Calendar freeBusy, Milestone M1 (+13 more)

### Community 6 - "Design System Rules"
Cohesion: 0.15
Nodes (12): DESIGN.md (Design System: Ramona Nichifor), Book cover, Butterfly flight, Butterfly Magenta, Footer, Meadow ground, Plum Ink, Pollen (+4 more)

### Community 7 - "Universe Creatures"
Cohesion: 0.17
Nodes (18): Universe, boot(), Creature(), Fly(), Frame(), Ladybird(), Mosquito(), Props (+10 more)

### Community 8 - "Payload Collections"
Cohesion: 0.12
Nodes (16): afterChange revalidateTag hook, artworks collection, content.ts seed, events collection, legal-pages collection, Lexical rich text, Payload Local API data access, media collection (+8 more)

### Community 9 - "TS Config"
Cohesion: 0.12
Nodes (15): compilerOptions, isolatedModules, jsx, lib, module, moduleResolution, noEmit, noUnusedLocals (+7 more)

### Community 10 - "Book & Series Facts"
Cohesion: 0.17
Nodes (14): Cover spread: Fluturele dansator de step (back + front), Buburuza rotunjoara (series title), Fluturele dansator de step (book), ISBN 978-973-0-44382-0 (Bucuresti 2026), Magia suntem noi (book series), Planned e-book, audiobook and translations (EN, FR, DE, ES, AR, HI), Musca ratacita (series title), Ramona Nichifor (author) (+6 more)

### Community 11 - "Art Gallery"
Cohesion: 0.22
Nodes (13): App(), ArtworkSheet(), Availability(), dotColor, Filter, HangingFrame(), Picture(), art (+5 more)

### Community 12 - "Motion Rules"
Cohesion: 0.18
Nodes (10): Bloom easing, Impeccable design.json sidecar, Motion Vocabulary, Orb focus, Concept C orbs, Orb drift and glow, Universuri page, WCAG 2.2 AA (+2 more)

### Community 14 - "Typography"
Cohesion: 0.30
Nodes (10): Alegreya Sans, Fraunces, Artă mockup page, Carte mockup page, Cărți mockup page, Comunitate mockup page, Consiliere mockup page, Contact mockup page (+2 more)

### Community 15 - "Inner Page Components"
Cohesion: 0.18
Nodes (11): Butterflies gathering, Contact form, Gallery wall, Page opener, Spam guards, Art gallery page, Artwork page, Cloudflare Turnstile (+3 more)

### Community 16 - "Image Pipeline"
Cohesion: 0.20
Nodes (3): largest_component(), save(), scaled()

### Community 17 - "Universe & Product Pages"
Cohesion: 0.22
Nodes (9): Age switch, Morph view transition, Product page template, Universe page, Book page, Books list page, Product page, Universe detail page (+1 more)

### Community 18 - "Product Brief"
Cohesion: 0.20
Nodes (7): Language toggle, PRODUCT.md product brief, Bilingual Romanian default + English toggle, Book: Fluturele dansator de step (2026), Series „Magia suntem noi”, Three equal audiences (book buyers, counselling clients, art lovers), Universuri: one universe per story character as a collection

### Community 19 - "Poiana Concept"
Cohesion: 0.29
Nodes (5): Concept A Poiana surface (mockups/src/poiana/App.tsx), Concept A: Poiana (meadow from the book cover), Contact form (server action + Resend, honeypot, rate limit), mockups/index.html (Poiana mockup entry), Google Fonts link (Fraunces SOFT/WONK + Alegreya Sans)

### Community 20 - "Hosting"
Cohesion: 0.29
Nodes (6): Cloudflare R2, Hetzner VPS, Neon, Netlify, Postgres database (Neon), Vercel Pro

### Community 21 - "SEO & i18n"
Cohesion: 0.29
Nodes (6): hreflang ro/en/x-default + canonical, JSON-LD structured data, next-intl, Payload localisation, Person JSON-LD, Ramona Nichifor (author, illustrator, counsellor)

### Community 22 - "Core CMS Content"
Cohesion: 0.33
Nodes (6): about-page global, books collection, counselling-page global, Home page, site-settings global, universes collection

### Community 23 - "Shop (M7)"
Cohesion: 0.33
Nodes (6): M7 Shop (Stripe, SmartBill e-Factura), Milestone M7 Shop, Payload e-commerce plugin, products collection, SmartBill e-Factura, Stripe

### Community 24 - "Motion & Performance"
Cohesion: 0.50
Nodes (3): WCAG 2.2 AA + performance budgets (LCP<2.5s, CLS<0.05, INP<200ms), Butterfly flight and landing, Pollen canvas

### Community 25 - "Mug Asset"
Cohesion: 0.40
Nodes (5): Sculpted Berry Motif, Handmade Ceramics, Merch / Shop Product, Handmade Ceramic Mug (berry on handle), Ramona Nichifor

### Community 26 - "Wash Asset"
Cohesion: 0.40
Nodes (5): Pastel wildflower sprays (lavender, pink blossoms), Empty central/left area for text overlay, Pastel palette: lavender, powder blue, blush pink, Poiana design direction, Watercolour wash background (wash.webp)

### Community 28 - "Stack & M1 Fixes"
Cohesion: 0.50
Nodes (4): DESIGN.md (design system source of truth), M1 fixes from mockup review (eyebrow, font weight 600, 44px nav), Next.js 16 + TypeScript + Tailwind v4 + Motion stack, Orb focus grow (1.22 / 0.9 / 0.7)

### Community 29 - "Butterfly Sprites"
Cohesion: 0.83
Nodes (4): Watercolor pink-purple butterfly illustration (full), Butterfly wing-flap animation (split-wing technique), Butterfly left wing (split sprite), Butterfly right wing (split sprite)

### Community 30 - "Meadow Assets"
Cohesion: 0.83
Nodes (4): Pastel violet/pink floral palette, Top fade into pale sky, Watercolor wildflower meadow (meadow.webp), Wide watercolor meadow strip (meadow-wide.webp)

### Community 32 - "Portrait Asset"
Cohesion: 0.67
Nodes (3): About-the-author section, Author portrait photo (portrait.webp), Warm natural palette (off-white, brown, grey, sage green)

## Ambiguous Edges - Review These
- `Fluturele dansator de step (book)` → `Imprint: Băiuț 2026`  [AMBIGUOUS]
  mockups/public/img/cover-fluturele.webp · relation: conceptually_related_to
- `Handmade Ceramic Mug (berry on handle)` → `Ramona Nichifor`  [AMBIGUOUS]
  mockups/public/img/mug.webp · relation: references

## Knowledge Gaps
- **125 isolated node(s):** `Props`, `Mote`, `FocusState`, `Spot`, `Geometry` (+120 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 144 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Fluturele dansator de step (book)` and `Imprint: Băiuț 2026`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Handmade Ceramic Mug (berry on handle)` and `Ramona Nichifor`?**
  _Edge tagged AMBIGUOUS (relation: references) - confidence is low._
- **Why does `Ramona Nichifor Website Spec` connect `Spec Pages & Booking` to `Design System Rules`, `Payload Collections`, `Motion Rules`, `Inner Page Components`, `Universe & Product Pages`, `Poiana Concept`, `Hosting`, `SEO & i18n`, `Core CMS Content`, `Shop (M7)`, `Cover North Star`, `Stack & M1 Fixes`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._
- **Why does `react` connect `Counselling Booking` to `Book Pages`, `Butterflies & About`, `Contact & Home`, `Dependencies`, `Universe Creatures`, `Art Gallery`, `Page Entrypoints`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Why does `DESIGN.md (Design System: Ramona Nichifor)` connect `Design System Rules` to `Spec Pages & Booking`, `Motion Rules`, `Typography`, `Inner Page Components`, `Universe & Product Pages`, `Product Brief`, `Cover North Star`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **What connects `Props`, `Mote`, `FocusState` to the rest of the system?**
  _125 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Book Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.08488612836438923 - nodes in this community are weakly interconnected._