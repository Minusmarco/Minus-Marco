# Intro Splash Reel — Implementation Spec

Spec date: 2026-08-23. Feature: a short, Sanity-managed highlight/b-roll reel that plays when a
visitor first opens the site, then fades into the homepage. Framed as the site's "attract
screen" — the studio-splash moment before a game's main menu, which is exactly the register the
menu-hero already established.

This document makes ALL taste/UX decisions in advance. Implement it as written; where a choice
isn't specified, prefer the boring option. Do not add knobs, variants, or options beyond what's
here — restraint is the feature.

---

## 0. The philosophy (read first, it explains every rule below)

Intro videos kill sites when they cost the visitor something: time, control, data, or a second
viewing. This one must cost nothing:
- It plays **at most once per browser session**, ever. Returning within a session, refreshing,
  or navigating back to `/` never replays it.
- It is **skippable from the first frame**, with an obvious control.
- It is **short**: authored at 5–8s, hard-capped at 10s in code no matter what Marco uploads.
- It **never blocks the page**: the homepage renders and is interactive underneath; the reel is
  an overlay that fades in only once the video is actually ready to play, and if it can't get
  ready fast, it silently never appears. A visitor on a slow connection must never stare at a
  black screen or a spinner. The intro is an enhancement with a deadline, not a gate.
- It is **silent by design** (muted autoplay is browser-required anyway). No audio track means
  no captions problem and no jump-scare.
- It **respects signals**: `prefers-reduced-motion` and Data Saver users never see it.
- It shows **only on the homepage** (`/`). A visitor deep-linking to an article came for the
  article — hijacking that entry is exactly the anti-pattern we're avoiding. (Deliberate
  decision; do not extend to other routes.)

## 1. Sanity schema — new `introVideo` document type

New file `src/sanity/schemaTypes/introVideo.ts`, registered in `schemaTypes/index.ts`.
Follow the existing schema file conventions (defineType/defineField, descriptions for Marco).

Fields:
- `title` — string, required. Internal label only (e.g. "Spring 2027 reel").
- `video` — type `file`, required, `options: { accept: "video/mp4" }`. Description for Marco:
  "A 5–8 second highlight reel, MP4 (H.264), 1080p or 720p, exported WITHOUT an audio track,
  ideally under 5MB. Plays silently when visitors first open the site."
- `poster` — image (hotspot), optional. Description: "First-frame image shown while the video
  loads. Export the video's first frame as a JPG." (Used as the `<video poster>`; also
  prevents a black flash.)
- `active` — boolean, initialValue false. Description: "Only one intro should be active at a
  time. Turn off to disable the intro entirely." (Mirror the poll/debate `active` pattern.)

Preview: title + active state. No frequency knob, no duration field — the code owns those
(session-once and 10s cap). Fewer knobs = fewer ways to accidentally ship an obnoxious intro.

## 2. Query

In `src/sanity/lib/queries.ts`:

```groq
export const activeIntroVideoQuery = groq`
  *[_type == "introVideo" && active == true] | order(_updatedAt desc)[0] {
    _id,
    "videoUrl": video.asset->url,
    poster
  }
`;
```

Guard downstream on `videoUrl` being present (`defined(video.asset)` is implicit — if the file
is missing the URL is null and the component must bail).

## 3. Component — `src/components/IntroSplash.tsx` (client)

Rendered ONLY from the homepage: fetch `activeIntroVideoQuery` in `src/app/page.tsx` alongside
the existing Promise.all, pass the result as a prop (`intro`), and render `<IntroSplash
intro={intro} />` as the FIRST child of `<main>`. Server component fetch + client component
playback, same pattern as the rest of the site. Do NOT put it in SiteChrome (that would show it
on every route and force a client-side fetch).

### Show/never-show decision (all checked on mount, before rendering anything):
Never show when ANY of these is true:
1. `!intro?.videoUrl`
2. `sessionStorage.getItem("mm-intro-seen") === "1"`
3. `useReducedMotion()` returns true (framer's hook, already used elsewhere)
4. `navigator.connection?.saveData === true`, or `navigator.connection?.effectiveType` is
   `"2g"`/`"slow-2g"` (feature-detect; absent API = no objection)
If any guard fails → return null forever. The `<video>` element must not even mount (no
wasted bytes).

### The readiness deadline (the most important mechanic):
When the guards pass, mount the video element **hidden** (overlay at opacity 0,
pointer-events none) with `preload="auto"`, `muted`, `playsInline`, `poster` (from Sanity via
`urlFor`, 1920w). Start a **1500ms deadline timer**.
- If the video reaches readiness (`canplaythrough`, or `canplay` as acceptable fallback) BEFORE
  the deadline: set `sessionStorage.mm-intro-seen = "1"` (at start, so a mid-video refresh
  doesn't replay), call `video.play()` (in a try/catch — if the play() promise rejects, abort
  as below), and fade the overlay in over ~300ms (framer `AnimatePresence`/`motion.div`,
  opacity only).
- If the deadline fires first, or `play()` rejects, or the video element errors: **abort
  permanently** — unmount everything, do NOT set the seen flag (they haven't seen it; let a
  faster future session try). No spinner, no placeholder, no evidence it exists.

### Playback + exit:
- Overlay: `fixed inset-0 z-[120]` (above LevelLoader's z-[100] and SearchModal's z-[90]),
  background `bg-ink` (#0D0E18 token, already exists). Video `h-full w-full object-cover`.
- Brand chrome on top of the video, subtle: bottom-left, the "M" logo mark + "MINUS MARCO" in
  Barlow with the gold underline treatment from the hero — small (think broadcast bug, not
  title card). Nothing else. No text animation.
- Skip control: bottom-right, a bordered pill button — `Skip intro ▸` — styled like the site's
  game-UI chips (font-display uppercase tracking, `border-white/25 text-[#EDEFF6]`,
  hover border-accent). Visible from the moment the overlay fades in. Also skippable via
  **Escape** and **Enter** keys.
- Focus management: when the overlay becomes visible, move focus to the Skip button
  (`role="dialog"`, `aria-label="Intro video"`, `aria-modal="true"`). On exit, blur/restore.
  (Because focus sits on a button, the hero's Enter-to-navigate handler correctly ignores
  Enter — it only fires when focus is on `document.body`. Verified interaction, don't change
  the hero.)
- Body scroll: lock while visible (`document.body.style.overflow`, same pattern as Navbar
  drawer / video lightbox), restore on exit.
- End conditions (whichever first): video `ended` event, **10s hard cap timer**, or skip.
  All three funnel into one `finish()` that: fades the overlay out over **600ms** (opacity
  only — the homepage is already rendered underneath, so this IS the "fade into the mainpage"),
  pauses the video, unmounts via AnimatePresence, restores scroll/focus.
- No replay affordance anywhere. If Marco wants to watch it repeatedly he can open the file in
  Studio (or use an incognito window).

### What NOT to do:
- No sound, no mute button (there is no audio).
- No progress bar, no countdown ring — one Skip button is the whole UI.
- No "click anywhere to skip" (too easy to lose the intro to an accidental click).
- No cookie/localStorage persistence beyond sessionStorage — a returning visitor next week
  seeing it once more is fine and keeps the reel fresh in memory.
- Do not delay LCP: the homepage renders normally; do not conditionally hide the hero.

## 4. Perf budget
- Video: target ≤5MB; the component imposes no limit but the schema description sets the
  expectation. H.264 MP4 only (universal); no WebM second source (not worth the Studio
  complexity for one asset).
- The Sanity CDN serves files with range-request support; `preload="auto"` on a ~5MB file
  within a 1.5s deadline is realistic on decent connections and correctly self-cancels on bad
  ones. That asymmetry is the design.
- Poster image via `urlFor(poster).width(1920).url()`, plain `<video poster>` attribute (no
  next/image needed inside the overlay).

## 5. QA checklist (verify each before calling it done)
1. `npm run build` passes; `npx eslint src --quiet` stays at 0 errors. Mind the
   `set-state-in-effect` rule — put state updates inside event/timer callbacks (the codebase
   has precedent in `LevelLoader`/`SearchModal`; there's also `useLocalStorageValue` to copy
   from if a sessionStorage hook is cleaner).
2. First visit to `/` (fresh session, dev tools → Application → clear sessionStorage): reel
   fades in, plays, fades out; homepage visible and correct after.
3. Refresh: no replay. Navigate away and back to `/`: no replay.
4. Deep-link straight to `/articles/...`: never shows.
5. Skip via click, Escape, and Enter all work from the first visible frame.
6. Emulate reduced motion (dev tools rendering tab): never shows.
7. Dev tools network throttle "Slow 3G", fresh session: never shows (deadline abort), homepage
   unaffected, nothing in console.
8. A video longer than 10s (test with any long MP4): cuts to fade at 10s.
9. Keyboard-only pass: focus lands on Skip, Tab stays sensible, focus restored after exit.
10. No `introVideo` doc / `active: false` / missing file asset: silently absent.
11. Sanity Studio: create the doc, upload an MP4, toggle active — appears within 60s
    (homepage `revalidate = 60`).

## 6. For the user + Marco (content side, no code)
- Export: 5–8s, 1920×1080 (or 1280×720) H.264 MP4, 24–30fps, ~3–5 Mbps, **no audio track**,
  "web optimized"/faststart enabled (HandBrake: Web Optimized checkbox). Keep cuts fast but
  not strobing — this plays under reduced-motion-OFF only, but epilepsy-safe pacing is still
  good manners (no full-frame flashing).
- Use only footage Marco owns (his own videos/b-roll). Game capture he recorded is normal
  practice for a games outlet; avoid clips containing licensed music (silent export sidesteps
  most of it anyway).
- First frame should be visually strong — it's also the poster.
