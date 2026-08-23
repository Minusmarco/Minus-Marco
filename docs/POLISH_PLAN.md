# Minus Marco — Polish & Finishing-Touches Plan

Audit date: 2026-08-23. This is an implementation checklist written to be executed item-by-item
by an AI coding session. Each item has: **why**, **what to do**, and **files**. Work top to bottom
within a tier. Verify with `npm run build` after each item; visually check in the dev server.

Conventions to preserve throughout: light theme, Barlow (`font-display`) + Inter (`font-sans`),
brand blue `--color-accent` (#2cabe2), gold `#f6b327`, Tailwind v4 tokens in `src/app/globals.css`,
motion via framer-motion with `useReducedMotion` respected, Sanity as the only content source
(never hardcode content that Marco should own). Do not add placeholder/fake content.

---

## TIER 1 — Structural gaps (site feels unfinished without these)

### 1.1 Footer (the site currently just… ends)
**Why:** Every page stops dead after its last section. A footer is the #1 "unfinished" signal
and doubles as nav + credibility.
**What:** Create `src/components/Footer.tsx`, render it in `src/app/layout.tsx` after `{children}`.
Contents: logo + one-line mission ("The expansion pack to your game."), column of page links
(Home/Articles/Videos/Community/About), social icon row (reuse `iconFor` from
`src/lib/socialIcons.ts` with the links currently hardcoded in `src/app/community/page.tsx`
PLATFORMS), `mailto:minusmarcoh@gmail.com`, and a bottom strip: `© {year} Minus Marco` +
"Made in Fresno, CA". Style: `border-t border-border bg-surface`, generous padding, muted text.
**Files:** new `src/components/Footer.tsx`; edit `src/app/layout.tsx`.

### 1.2 Shared socials constant (dedupe before the footer multiplies it)
**Why:** Marco's social URLs are hardcoded in three places (`src/app/community/page.tsx`
PLATFORMS, `src/components/AboutContent.tsx` PLATFORMS, and soon the footer). One edit = three misses.
**What:** Create `src/lib/brand.ts` exporting `MARCO_SOCIALS: { platform, url, desc }[]` and
`CONTACT_EMAIL`. Refactor the two existing PLATFORMS arrays and the footer to consume it.
Keep the hand-drawn SVG icon components in AboutContent if they look better there; the data
(labels/urls/descriptions) is what must be shared.
**Files:** new `src/lib/brand.ts`; edit `src/app/community/page.tsx`,
`src/components/AboutContent.tsx`, `src/components/Footer.tsx`.

### 1.3 Newsletter / follow loop (the retention hook — nothing on the site captures a visitor)
**Why:** A non-gamer who likes ONE essay has no way to hear about the next one. For a journalist,
this is the single highest-value addition. Marco publishes on Substack, which handles email.
**What:** New `src/components/SubscribeBanner.tsx` — a slim section: headline ("Never miss a drop"),
one line of copy, and a button linking to Marco's Substack subscribe page
(`https://substack.com/@itsminusmarco` — confirm exact subscribe URL with the user; do NOT
build a custom email form). Place it: (a) on the homepage between Community Pulse and the
CommunityBanner, (b) at the end of every article after `GameInfoBox`. Optional per-article
later; don't over-engineer.
**Files:** new `src/components/SubscribeBanner.tsx`; edit `src/app/page.tsx`,
`src/app/articles/[slug]/page.tsx`.

### 1.4 Branded 404 page ("Game Over" screen)
**Why:** Default Next 404 is a bare white page — off-brand and a dead end. Also the one place a
video-game joke is universally understood.
**What:** Create `src/app/not-found.tsx`: big Barlow "GAME OVER", subline "404 — this level
doesn't exist.", two buttons: "↺ Continue" → `/` and "Level Select" → `/articles`. Match the
homepage hero's light styling + grid texture. Keep it a server component (no motion needed).
**Files:** new `src/app/not-found.tsx`.

### 1.5 Navbar search is a dead button
**Why:** `src/components/Navbar.tsx` renders a search icon button with no handler. Dead UI erodes trust.
**What:** Two options — pick based on effort budget:
  - **Minimum (do first):** remove the button until search exists.
  - **Full (Tier 3.6):** implement search.
**Files:** edit `src/components/Navbar.tsx`.

---

## TIER 2 — Web-standards / QoL fixes (bugs and paper cuts)

### 2.1 Homepage arrow-key hijack (real keyboard-accessibility bug)
**Why:** `src/components/HeroSection.tsx` adds a global `keydown` listener that `preventDefault()`s
ArrowUp/ArrowDown for the menu. On the homepage this breaks arrow-key page scrolling entirely,
even after scrolling far past the hero.
**What:** Only intercept arrows while the hero is in view (IntersectionObserver on the section,
or check `window.scrollY < window.innerHeight * 0.5` inside the handler before preventDefault).
Enter-to-select must also be gated the same way. Keep the existing INPUT/TEXTAREA guard.
**Files:** edit `src/components/HeroSection.tsx`.

### 2.2 SEO plumbing (journalism lives or dies on this)
**Why:** No `metadataBase`, no OpenGraph/Twitter cards, no per-article metadata, no sitemap, no
robots. Shared articles show no preview card — a killer for a publication.
**What:**
  a. `src/app/layout.tsx`: add `metadataBase: new URL("https://www.minusmarco.org")`, `openGraph`
     defaults (siteName "Minus Marco", type "website", locale, default image — use an existing
     public logo asset until a designed OG image exists), `twitter: { card: "summary_large_image" }`.
  b. `src/app/articles/[slug]/page.tsx`: add `generateMetadata` — title, description from
     `excerpt`/`subtitle`, `openGraph.type: "article"`, `publishedTime`, and `images` from
     `urlFor(coverImage).width(1200).height(630)` when present.
  c. New `src/app/sitemap.ts`: static routes + all article slugs (fetch via `sanityFetch` +
     `allArticlesQuery`).
  d. New `src/app/robots.ts`: allow all, disallow `/studio`, point at the sitemap.
  e. JSON-LD: in the article page, render a `<script type="application/ld+json">` NewsArticle
     object (headline, datePublished, author "Marco Hernandez", image, publisher).
**Files:** edit `src/app/layout.tsx`, `src/app/articles/[slug]/page.tsx`; new `src/app/sitemap.ts`,
`src/app/robots.ts`.

### 2.3 Article page is `force-dynamic` — make it ISR like everything else
**Why:** `src/app/articles/[slug]/page.tsx` has `export const dynamic = "force-dynamic"` (plus a
now-pointless `generateStaticParams`). Every article view hits Sanity live = slower TTFB. All
other pages use `revalidate = 60`.
**What:** Remove `force-dynamic`, add `export const revalidate = 60`. Keep `generateStaticParams`.
Verify a new Studio publish appears within ~a minute.
**Files:** edit `src/app/articles/[slug]/page.tsx`.

### 2.4 Reduced-motion gaps
**Why:** `Reveal`/`LevelLoader` respect `prefers-reduced-motion`, but the CSS ticker
(`.ticker-track`), the gold shine border, and various infinite framer pulses (Online dot,
scroll indicator, Now Playing dot) do not.
**What:** In `src/app/globals.css` add a `@media (prefers-reduced-motion: reduce)` block:
`.ticker-track { animation: none }`, `.gold-shine-border::before { animation: none }`. For the
framer infinite pulses, either wrap with `useReducedMotion` or accept them (small, opacity-only —
acceptable); the CSS ones are the must-fix.
**Files:** edit `src/app/globals.css`; optionally `HeroSection.tsx`, `CurrentlyPlaying.tsx`.

### 2.5 Skip link + focus visibility
**Why:** Keyboard users must tab through the whole navbar on every page; focus states on custom
cards/menu items are browser-default and near-invisible on the light theme.
**What:** Add a visually-hidden-until-focused "Skip to content" link as the first child of `<body>`
targeting `#main`; add `id="main"` to each page's `<main>`/wrapper (or add it in layout by wrapping
`{children}` in `<main id="main">` — check it doesn't break existing `<main>` in `page.tsx`).
Add a global `:focus-visible` style in `globals.css`: 2px accent outline with offset.
**Files:** edit `src/app/layout.tsx`, `src/app/globals.css`, possibly `src/app/page.tsx`.

### 2.6 Contrast audit on small accent/gold text
**Why:** Brand blue #2cabe2 and gold #f6b327 on white are low-contrast; fine for big display type
and pills with dark text, risky for small body-size text (likely below WCAG AA 4.5:1).
**What:** Audit small-text usages of `text-accent` and `text-[#f6b327]` (eyebrow labels are
borderline-acceptable as bold uppercase; body-size links are not). Where small, either darken
(e.g. use a new `--color-accent-text: #147ba8`-style token — pick by measuring to ≥4.5:1) or
bump weight/size. Do NOT change the accent used for fills/pills/buttons with dark-on-light text.
**Files:** edit `src/app/globals.css` + touched components.

### 2.7 Hide keyboard hints on touch devices
**Why:** The hero hint bar ("↑ ↓ Navigate | ⏎ Select") is meaningless on phones.
**What:** On the hint bar in `HeroSection.tsx`, add `hidden` below `sm:` breakpoint or gate with
a `(hover: hover) and (pointer: fine)` media check (Tailwind: `[@media(hover:hover)]:flex hidden`).
Mobile users should just see nothing there.
**Files:** edit `src/components/HeroSection.tsx`.

### 2.8 Scroll restoration + anchor offset under fixed navbar
**Why:** The navbar is fixed; any future in-page anchors will hide behind it.
**What:** Add `html { scroll-padding-top: 6rem; }` to `globals.css`. One line, prevents a class of bugs.
**Files:** edit `src/app/globals.css`.

### 2.9 Analytics (Marco needs to see what resonates)
**Why:** Zero measurement today. For editorial decisions ("do people read the essays?") this matters.
**What:** `npm i @vercel/analytics` and add `<Analytics />` in `src/app/layout.tsx` (site is on
Vercel). Optionally `@vercel/speed-insights` the same way. No cookie banner needed (cookieless).
**Files:** edit `src/app/layout.tsx`, `package.json`.

---

## TIER 3 — The "not average" tier (hook non-gamers, deepen the experience)

### 3.1 Mission strip on the homepage (THE non-gamer hook)
**Why:** The strongest thing Minus Marco has for someone who doesn't care about games is the
human story: Mexican-immigrant household, Central Valley, journalism degree, amplifying voices
gaming forgot. Today that story only lives on /about. A non-gamer landing on a "game menu" hero
has no reason to stay.
**What:** New homepage section between "From the desk" and Community Pulse: a full-width quiet
band — eyebrow "Why Minus Marco", one big Barlow line ("Amplifying the voices gaming forgot to
invite."), 2–3 sentences from the About mission, Marco's photo (`/marco.avif`) small and round,
and a "Meet Marco →" link to /about. Reuse `Reveal` for entrance. Keep it airy — this is an
editorial beat between game-UI beats, and the tonal contrast is the point.
**Files:** new `src/components/MissionStrip.tsx`; edit `src/app/page.tsx`.

### 3.2 Article-page reading experience upgrades
**Why:** The article page is where a curious visitor converts to a fan. It currently ends at
"Back to Articles."
**What (in priority order):**
  a. **Reading time**: compute from `body` portable text word count (~200wpm) in the page
     component; show next to the byline ("· 6 min read").
  b. **Related articles**: after `GameInfoBox`/SubscribeBanner, a 3-card "Keep Playing" row —
     other articles sharing a category (new GROQ: same-category, `_id != current`, limit 3,
     fallback to latest). Reuse the card markup pattern from `ArticlesPreview`.
  c. **Share row**: copy-link button + X/Bluesky/Facebook share-intent links (plain anchor URLs,
     no SDKs). Small icon buttons under the article body.
  d. **Prev/next**: optional; skip if related-articles lands well.
**Files:** edit `src/app/articles/[slug]/page.tsx`, `src/sanity/lib/queries.ts`; possibly a small
client component for the copy-link button.

### 3.3 Ticker → real headlines
**Why:** The ticker currently loops static labels ("Game Journalism", "AAA Titles"…). Cute, but
inert. Making it show live headlines turns decoration into content.
**What:** Make `Ticker` accept an optional `items: string[]` prop; on the homepage pass the 5
latest article titles (data already fetched in `page.tsx` via `allArticlesQuery`) formatted like
`"NEW — {title}"`, falling back to the current static list when no articles exist. Keep the
existing hover-pause. Each item ideally links to its article (wrap in `Link`, keep it one line).
**Files:** edit `src/components/Ticker.tsx`, `src/app/page.tsx`.

### 3.4 "Player One" card on About → homepage cross-pollination
**Why:** People follow people. The About page has personality (favorites grid, Est. 2026 tag)
that first-time homepage visitors never see.
**What:** In the homepage hero's right column, under the Featured Reel card, add a slim
"Player One: Marco Hernandez" row — tiny round photo, one line ("Journalist · Fresno, CA"),
links to /about. 10-line component, big warmth payoff. Skip if it crowds the hero on laptop
heights — check at 1280×800 and 375×812.
**Files:** edit `src/components/HeroSection.tsx`.

### 3.5 Currently Playing on the homepage sidebar (optional)
**Why:** The "Now Playing" card (already built for /community) is the most human, low-stakes
content object the site has — good ambient life for the homepage.
**What:** Only if the hero right column has room after 3.4 — otherwise skip. Reuse
`CurrentlyPlaying` with a compact variant prop.
**Files:** edit `src/components/HeroSection.tsx`, `src/app/page.tsx`, `CurrentlyPlaying.tsx`.

### 3.6 Site search (completes 1.5 the ambitious way)
**Why:** Small content volume today, but a search that works makes the site feel like a real
publication.
**What:** Client-side search over articles + videos: a modal (Cmd/Ctrl+K + navbar button) that
fetches `/api/search?q=` OR receives a pre-fetched index. Simplest robust version: a route
handler that GROQ-queries `*[_type in ["article","video"] && title match $q + "*"]` and returns
title/type/href; debounce input 200ms. Game-UI styling: the LevelLoader aesthetic, "no results —
try another quest" empty state. Wire the navbar button + Cmd+K to open it.
**Files:** new `src/app/api/search/route.ts`, `src/components/SearchModal.tsx`; edit
`src/components/Navbar.tsx`.

### 3.7 Original mascot easter egg (replaces the earlier Pikmin/Samus idea — those are
copyrighted; do NOT use Nintendo characters)
**Why:** The user loved the idea of small character moments. An original "M-buddy" sprite
(simple SVG creature built from the M logo mark) can peek from the footer, hide in the 404 page,
and wave in the loading screen. Delight without legal risk.
**What:** Design one tiny SVG character (flat, 2-3 poses as separate SVGs). Place: 404 page,
footer corner (subtle, static or gentle idle bob), and optionally 1-in-10 loading screens.
No interaction needed v1. Keep total added weight < 10KB.
**Files:** new `public/mascot-*.svg` or inline component `src/components/Mascot.tsx`;
edit `not-found.tsx`, `Footer.tsx`, optionally `LevelLoader.tsx`.

---

## TIER 4 — Content/ops checklist (no code, or user-action required)

- **Commit cadence:** everything ships through the user's manual GitHub commits — remind them to
  commit after each tier lands. Run `npm run build` before each commit.
- **OG image:** a designed 1200×630 default share card (logo + tagline) — ask the user/Marco for
  one, or generate a simple branded one; drop in `src/app/opengraph-image.png`.
- **Google re-index:** after SEO tier ships, submit the sitemap in Search Console.
- **Write token:** `SANITY_API_WRITE_TOKEN` must exist in Vercel prod env for poll/debate votes
  to persist (route returns 503 without it).
- **Studio content nudges for Marco:** subtitles on articles, `gameInfo` on the review, team
  members for the About staff section, video `embedOnSite` flags, shoutout socials + badges.
- **Domain canonicalization:** confirm `www.minusmarco.org` vs apex redirect is set in Vercel.

---

## Explicitly considered and REJECTED (don't do these)

- **Dark mode toggle** — the light theme is a deliberate brand decision made with Marco; a
  toggle doubles every visual QA pass for near-zero audience value right now.
- **Nintendo/other copyrighted character sprites** — legal risk; use the original mascot (3.7).
- **Custom email-capture backend** — Substack already owns this; don't build subscriber storage.
- **Comment system** — moderation burden for a one-person editorial team; the community page
  (polls/debates/shoutouts) is the participation surface instead.
- **Heavy page-transition takeovers beyond the existing LevelLoader** — it's already at the
  tasteful limit; more would slow perceived nav.
