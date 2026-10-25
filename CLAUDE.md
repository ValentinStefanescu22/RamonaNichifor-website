# Ramona Nichifor · website

Website for Ramona Nichifor: author and illustrator of children's books („Magia suntem noi” series), watercolour painter, and personal development counsellor. Romanian by default, English toggle. Mobile-first, strong SEO („Ramona Nichifor” should find this site first).

## Where things stand (2026-10-24)
- **Mockup phase is done.** The approved baseline is the Vite mockup in `mockups/`, published as a claude.ai artifact: https://claude.ai/artifact/ASM9hocLQERfJYaWtY6zYE (version 20).
- The repo now lives at `~/code/RamonaNichifor-website` (moved from the Desktop on 2026-10-24).
- **Milestones are now five (client, 2026-10-24):** M1 foundation + Acasă · M2 Payload · M3 Universuri + every inner page · M4 booking · M5 security, final audit and launch; M7 shop later. See spec §13.
- **M1 is done (2026-10-25)**, verified locally (plan `docs/superpowers/plans/2026-10-24-m1-foundation-home.md`); Lighthouse mobile performance 84–85 accepted until M5. Its preview link comes at the end of M2 with Vercel.
- **M2 (Payload) is built locally** (plan `docs/superpowers/plans/2026-10-25-m2-payload.md`): admin at `/admin` in Romanian, the content model, seed (`npm run seed`), © stamp on illustration uploads, Live Preview + drafts, revalidation, backups (`scripts/backup.sh`, `scripts/restore.sh`). Local dev uses Postgres 17 (db `ramona`, brew, `DATABASE_URI`); **Neon** (project `bold-bird-84523286`, branch `production`, Frankfurt) holds the same data: the app falls back to its pooled `DATABASE_URL` when `DATABASE_URI` is unset, and migrations/restore on Neon use `DATABASE_URL_UNPOOLED` (`DATABASE_URI="$DATABASE_URL_UNPOOLED" npx payload migrate`). Uploads go to the private **R2** bucket `ramona-media` when `S3_*` is set (served through `/api/media/file/…`; never give the bucket a public URL, `backups/` live there too). **Left for the end of M2, with the user:** Vercel preview + GitHub backup secrets. Booking collections wait for M4.
- Site commands: `npm run build`, `npm run test` (Playwright; phone + 3 laptop widths + CMS), `npm run test:unit`, `npm run seed`, `npx payload migrate:create <name>` then `npx payload migrate` for schema changes, `npm run lighthouse` (after an indexable build: `SITE_INDEXABLE=1 NEXT_PUBLIC_SITE_URL=http://localhost:3101 npm run build && npx next start -p 3101`).

## Read these first
| File | What it holds |
|---|---|
| `docs/superpowers/specs/2026-09-30-ramona-site-design.md` | **The approved spec**: sitemap and URLs, every page, Payload content model, SEO, architecture, privacy, hosting, **milestones M1–M5 + M7** (§13), content checklist for Ramona (§14), open questions (§15) |
| `DESIGN.md` | The design system („Poiana”): tokens, typography, components, motion values, and every client decision with its date. The mockup implements it; the real site must match it |
| `PRODUCT.md` | Who the site is for, tone, brand rules |
| `mockups/src/` | The reference implementation: copy, layouts, motion and real content to port into Next.js (`shared/content.ts`, `shared/content-pages.ts` hold all texts in RO/EN) |
| `mockups/scripts/` | `prepare-images.py` (image pipeline incl. the © stamp), `pdf-pages.swift` (renders printer PDFs), `check-routing.js` (routing test) |

## Stack for the real site (decided)
Next.js (newest version Payload supports) + Tailwind v4 + next-intl (RO default at `/`, EN at `/en`) + **Payload 3** in the same app (admin at `/admin`, Postgres on Neon, images on Cloudflare R2) + motion/react. Booking is built in (Payload + Google Calendar + Resend, M4), not Calendly. Shop later (M7, Payload e-commerce + Stripe + SmartBill). Previews on Vercel Hobby (free); launch hosting decided in M5.

## Client rules (never break)
- **Never** use „Bine ai revenit acasă, puiule!” / "Welcome home, baby" in site copy (it only appears printed inside the Fluturele back-cover image).
- No fake testimonials, no invented prices, dates, durations, sizes or titles. Anything unknown is labelled „În curând” / „În lucru”, with the clean paper placeholder (hairline frame + „Imagine în curând”), never decorative blobs.
- Her texts are used exactly as she wrote them; only diacritics/typos are fixed, and anything else is flagged, not changed.
- Artwork (covers, pages, cards, bookmarks, paintings) is **never cropped** and carries the baked-in „© Ramona Nichifor · ramonanichifor.com” stamp; decorative cut-outs (flying butterfly, ladybirds, meadow) don't. In Payload (M2+) illustrations get the stamp and a screen-size cap automatically on upload.
- In a book's „Răsfoiește”, „coperta” means the **back cover** (coperta spate).
- Only 2 card pairs are shown publicly (Broscuță–Broscoi, Ciripel–Ciripica).
- No ceramics in her own Art section; art is pre-order.
- Menu order: Acasă, Despre mine, Consiliere, Cărți, Artă, Universuri, Comunitate, Contact.

## Working rules
- Build in milestones (spec §13). Each ends with a preview link and a **stop for the user's approval**. Never "one shot".
- Commit only when the user asks. Never sign in to the user's or Ramona's accounts. Don't bypass CAPTCHAs or bot checks.
- Ask when something is unclear; don't assume. The user writes in Romanian; reply in Romanian.
- Use the skills: `superpowers:brainstorming` / `writing-plans` / `executing-plans` / `subagent-driven-development` (parallel easy tasks on disjoint files) / `verification-before-completion` / `systematic-debugging`; design and motion: `impeccable` (critique, audit, polish), `frontend-design`, `taste-skill:high-end-visual-design`, `animate`, `emil-design-eng`, `review-animations`, `mobile-native`; code: `vercel-react-best-practices`; testing: `playwright-cli`.
- **Test everything before calling it done**, with evidence: phone (393px) and laptop (1024–1440px; Ramona's laptop window is under 1280px), RO and EN, every internal link opens at the top of the page, no horizontal scroll, no console errors, no cropped artwork, reduced motion respected.

## Mockup commands (only if the mockup must change again)
From `mockups/`: `npm run build` (typecheck + build + `artifact/`), `npx vite preview --port 4173`, then `playwright-cli open http://localhost:4173/` and `playwright-cli --raw run-code --filename=scripts/check-routing.js` (must report 0 failures; also run with `--device="iPhone 15"`).
Publishing the artifact: list its live files first, publish `artifact/index.html` with the other pages and new hashed assets in `files`, set stale assets to `null`. **Other Claude sessions also publish to this artifact**: read its comments and check the live version before publishing, and port any change made elsewhere into this source. Artifact comments can only be resolved by Claude when the user sends them with „Send to Claude”.

## Still waiting on Ramona (spec §14)
Counselling availability and payment method; cancellation rule; her legal form (PFA/SRL), CUI and address for the legal pages; product texts/photos (semn, puzzle, joc de familie); artwork photos and details; AVA Art & Soul logo and description; real event dates; original high-resolution photos; domain ownership; approval of EN copy.
