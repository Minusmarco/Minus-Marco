# Minus Marco — Polish Round 2

Review date: 2026-08-23. This is (a) a code review of the POLISH_PLAN.md implementation and
(b) the next instruction set. Same rules as round 1: execute top-to-bottom, `npm run build`
after each item, preserve the light theme / Barlow+Inter / Sanity-owns-content conventions.

## Review verdict on round 1

Implementation was faithful. Verified: build passes clean; article pages converted from
force-dynamic to SSG (visible as `●` in build output); sitemap/robots/JSON-LD/OG metadata all
present; SiteChrome correctly un-breaks the Studio (a pre-existing bug — the navbar had been
overlaying the Sanity UI); arrow-key gating uses an IntersectionObserver + refs correctly;
`brand.ts` dedupe also fixed an invisible near-white dot on the Community page's X card;
contrast tokens (`--color-accent-text` #0f6f91, `--color-gold-text` #8a5c07) measure ≥4.5:1
on white and were applied only to genuine resting-state small text. Footer/404/mascot are
on-brand and original (no copyrighted characters). The items below are what a close re-read
found — two real bugs, several paper cuts, then genuinely-new improvements.

---

## TIER 1 — Bugs found in review (fix first)

### 1.1 Homepage Enter key double-fires navigation
**Why (bug):** `src/components/HeroSection.tsx` — the global `keydown` handler runs
`router.push(MENU[selRef.current].href)` on ANY Enter press while the hero is in view. If
keyboard focus is on the Feature Reel's prev/next `<button>`s or any link (Player One row,
Read Now), Enter both activates the focused element AND navigates to the selected menu item —
a race with unpredictable outcome.
**What:** In the handler's Enter branch, only navigate when nothing interactive has focus:
`if (e.key === "Enter") { if (document.activeElement === document.body) router.push(...) }`.
Tab-flow users already get native link activation; the menu Enter-shortcut is only for the
arrow-key flow. Arrow branches can stay as they are.
**Files:** `src/components/HeroSection.tsx`.

### 1.2 SubscribeBanner `compact` prop is broken dead code
**Why (bug):** `src/components/SubscribeBanner.tsx` — in `compact` mode the outer div becomes
the flex row but its ONLY child is the inner wrapper (className `""`), so `justify-between`
does nothing and the text/button stack unstyled. No call site uses `compact`.
**What:** Delete the prop and the conditional classNames; keep only the full-width variant.
**Files:** `src/components/SubscribeBanner.tsx`.

### 1.3 Ticker calls every article "New"
**Why:** `src/app/page.tsx` labels all 5 ticker headlines `"New — {title}"` regardless of age —
a February article marked "New" in August reads as neglect, the opposite of the intended energy.
**What:** Only prefix "New — " when `publishedAt` is within the last 14 days; otherwise pass the
bare title. (`allArticles` already carries `publishedAt`.)
**Files:** `src/app/page.tsx`.

---

## TIER 2 — Paper cuts

### 2.1 Silence the workspace-root build warning
Every build warns about a stray `C:\Users\haebe\package-lock.json`. Add to `next.config.ts`:
`turbopack: { root: __dirname }` (or the path string). One line; cleans every future build log.

### 2.2 Doubled section borders on the article page
`Keep Playing` (bg-surface, border-t) is immediately followed by `SubscribeBanner`
(bg-surface, border-y) → two same-color bands with a doubled divider. Give the related-articles
block `bg-bg` (page background) OR drop SubscribeBanner's top border when it directly follows
(`border-b` only is fine there since the Footer supplies the final divider anyway).
**Files:** `src/app/articles/[slug]/page.tsx` and/or `src/components/SubscribeBanner.tsx`.

### 2.3 robots: also disallow /api/
`src/app/robots.ts` — add `"/api/"` to `disallow` (vote endpoints have no business in crawlers).

### 2.4 Targeted lint-error cleanup (errors only — do NOT chase the ~5k warnings)
Pre-existing `react-hooks/set-state-in-effect` errors: `CommunityPoll.tsx:30`,
`DebateOfWeek.tsx:27` (initialize `counts`/`voted` from props/localStorage lazily or move the
localStorage read into a `useSyncExternalStore`/lazy initializer pattern — behavior must not
change: server-rendered counts still hydrate, stored vote still restores), and
`HeroSection.tsx:57` (the `idx` clamp effect — replace with a render-time derived
`const safeIdx = idx < reel.length ? idx : 0` and use `safeIdx`). Plus the
`react/no-unescaped-entities` errors in `AboutContent.tsx` (straight quotes/apostrophes in JSX
text → `&apos;`/`&ldquo;`/`&rdquo;`). Run
`npx eslint src --quiet` afterward — target: 0 errors (warnings are out of scope).

### 2.5 Homepage bottom CTA stack — judgment call, review with the user
The page now ends SubscribeBanner → CommunityBanner: two full-width CTA bands back-to-back.
Options: (a) accept (they ask for different things — inbox vs. community), (b) move
SubscribeBanner above Community Pulse, (c) fold a small subscribe button into CommunityBanner
and drop the band from the homepage only (keep it on articles, where intent is highest).
Recommendation: (c), but ask the user before doing it.

---

## TIER 3 — New improvements

### 3.1 Generated OG share cards (replaces the "designed image" ops item)
The OG default is currently the raw logo PNG (wrong aspect, washed on light backgrounds).
Next supports code-generated cards: add `src/app/opengraph-image.tsx` exporting an
`ImageResponse` (1200×630) — brand-blue band, logo mark, "MINUS MARCO", tagline, light bg,
matching the site look. Keep fonts simple (fetch Barlow once via `fetch` in the module or use
the default sans — do not ship a 300KB font into the edge bundle). Articles with covers already
get per-article images from `generateMetadata`; this card covers the homepage, listing pages,
and articles without covers. Verify with a share-preview debugger after deploy.
**Files:** new `src/app/opengraph-image.tsx`; remove the `images: [{ url: "/logo-full.png" }]`
default from `layout.tsx` metadata once the generated card exists (Next auto-wires the file).

### 3.2 Site search (carried over — the one big remaining feature)
Spec unchanged from POLISH_PLAN.md §3.6: `/api/search` route handler GROQ-querying
articles+videos by title match, a Cmd/Ctrl+K modal styled like the LevelLoader aesthetic,
debounced 200ms, "no results — try another quest" empty state. Restore a search button to the
navbar only once this works.

### 3.3 Category deep-links on the Articles page
`ArticleFilter` keeps the active tab in local state only — a filtered view can't be shared or
survive refresh. Sync it to `?category=` via `useSearchParams`/`router.replace` (shallow), read
the param as the initial state. Cheap, makes category links possible from category pills
elsewhere later.
**Files:** `src/components/ArticleFilter.tsx`, `src/app/articles/page.tsx` (Suspense boundary
for `useSearchParams` if required).

### 3.4 Reduced-motion pass for the remaining framer pulses (small)
The CSS animations were guarded in round 1; the infinite framer pulses (hero "Online" dot,
LevelLoader progress) still animate under reduced-motion. `useReducedMotion()` is already
imported in LevelLoader — extend the same guard to the hero dot. Two-line change; skip anything
that requires restructuring.

---

## TIER 4 — UI/UX composition (density, rhythm, digestibility)

Diagnosis: components are clean; the composition is dense. The homepage is 8 stacked bands
with 3–4 autonomous motions running at once, duplicate CTAs (About reachable 4 ways), and an
identical eyebrow-heading-band formula on every section. These items are edits, not redesigns.
Do NOT touch: the menu hero concept, the card system, the palette, the article header panel —
that's the site's identity.

### 4.1 Motion budget — one ambient motion per viewport
a. **FeatureReel** (`HeroSection.tsx`): stop auto-advance after one full pass through the reel
   (cycle each item once, then require dots/arrows). Keep the 4s interval while cycling (user-
   chosen). Also pause cycling while the hero is off-screen (reuse the existing
   IntersectionObserver `inView` state — it's already in the component).
b. **Ticker** (`Ticker.tsx` + `globals.css`): pause the CSS animation when off-screen — add an
   IntersectionObserver that toggles a class setting `animation-play-state: paused`.
c. **LevelLoader** (`LevelLoader.tsx`) — the important one: only show the loading screen when
   navigation actually takes time. On link click, start a ~150ms timer; if the pathname commits
   before it fires (prefetched routes do), never show the overlay. Also cut the post-commit
   hold from 480ms to ~250ms. Result: instant navs feel instant, slow navs still get the
   branded screen.

### 4.2 Cut homepage bands from 8 to ~6 (CTA dedupe) — confirm with user first
a. Execute 2.5 option (c): fold a subscribe button into `CommunityBanner` and remove the
   standalone `SubscribeBanner` band from the homepage (keep it on article pages, where intent
   is highest).
b. Remove the hero "Player One" row — `MissionStrip` already delivers the human hook with the
   same photo and destination; the hero doesn't need a second About link and it crowds 1280×800.
c. Community Pulse: recommend showing the poll only, with the link copy teasing the rest
   ("Vote — then weigh in on this week's debate →"). Halves the duplication with /community.
   Judgment call; the two-card version is defensible if the user prefers it.

### 4.3 Break the border-and-eyebrow monotony
a. Border fatigue: nearly every band has `border-t`/`border-y`, producing a ruled-notebook
   feel. Remove section borders from `MissionStrip` and `CommunityBanner` (rely on background
   shift + spacing); keep borders only on the ticker and footer.
b. Make `MissionStrip` the tonal break it was meant to be: drop its eyebrow label, set the
   headline in a quieter register (e.g. `font-sans font-light` at large size, or Barlow at
   normal weight, sentence case) so it reads editorial against the game-UI sections around it.

### 4.4 Article reading measure + subtitle/excerpt dupe
a. Prose width: the body column is `max-w-4xl` at `text-lg` ≈ 90+ characters per line. Wrap
   the PortableText (and excerpt pull) in a ~70ch measure (`max-w-3xl` on the text container is
   fine) while leaving the header/cover full width.
b. Dupe bug: when `subtitle` and `excerpt` are the same string (true on the Fresno article),
   the sentence renders twice within one screen — in the header panel and as the italic pull.
   Only render the excerpt pull-quote when it differs from the subtitle
   (`excerpt.trim().toLowerCase() !== subtitle?.trim().toLowerCase()`).

### 4.5 Mobile hero compression
At 375×812 the wordmark + menu + reel is a very long first scroll, and the menu duplicates the
hamburger nav. Compress on mobile only: menu rows `py-2` (from `py-3`), keep `text-2xl` labels
(current), tighten the tagline margin. Goal: menu + top of the Featured Reel visible within the
first two screens. Do not remove the menu — it's the signature.

### 4.6 Community page trim
It's a hub, not a landing: hero `py-20 sm:py-28` → `py-14 sm:py-20`. Optional: the Quote of the
Week band can lose its own full-band treatment and sit inside the shoutouts section header area
if it looks sparse in practice.

### 4.7 Footer: make it the site's dark end cap
**Why:** `Footer.tsx` currently uses `border-t border-border bg-surface` — the identical
treatment as the content bands, so it reads as one more section rather than the end of the
page (user-reported, confirmed).
**What:** Invert it — the footer becomes the ONLY dark band on the site:
  a. Add a token in `globals.css`: `--color-ink: #0D0E18` (same value as text-primary; semantic
     name for dark surfaces). Footer root: `bg-ink` with a **3px gold top seam**
     (`border-t-[3px] border-[#f6b327]`) replacing the hairline — the one gold rule on the
     page, an unmistakable "end of level" marker.
  b. Recolor contents for dark: wordmark + column headings in near-white (#EDEFF6), body/links
     in a muted cool gray (#8A8FA8), link hover → `text-accent` (blue pops on ink). Social
     icon buttons: `border-white/15 text-[#8A8FA8]` with the same accent hover. Bottom strip
     divider: `border-white/10`; copyright in the muted gray.
  c. Keep the existing structure (brand / Explore / Connect / legal strip) and the mascot —
     the blue/gold mascot reads far better on ink than on white. Optional single flourish: a
     tiny gold "● EST. 2026" or "● ONLINE" chip in the bottom strip echoing the hero HUD —
     at most one such echo, no more.
  d. Contrast: #EDEFF6 and #8A8FA8 on #0D0E18 both clear WCAG AA at these sizes; accent
     #2cabe2 on ink is fine for the short hover/link text. No small gold body text on ink.
This also settles 4.3 for the footer: the gold seam IS its separation; no hairline needed.
**Files:** `src/components/Footer.tsx`, `src/app/globals.css`.

---

## Ops (user-action, unchanged from round 1)
- Confirm the exact Substack subscribe URL with Marco (the `@itsminusmarco` profile link works
  but a direct `?subscribe=true` landing converts better).
- After deploy: submit `sitemap.xml` in Search Console; re-run a share-card debugger.
- `SANITY_API_WRITE_TOKEN` in Vercel prod (votes still 503 without it).
- Commit cadence: commit per tier, `npm run build` before each.
