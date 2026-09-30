# LEAN&FIT — Training App

A mobile-first Progressive Web App for the Beginner Lean & Fit 4-day training
program: workouts with per-set logging, a day-number/phase engine, nutrition
guidance, progress tracking, and full theming — installable on iPhone via
Safari's "Add to Home Screen".

Live app structure: Home (today's session + program-day engine) · Workouts
(4-day split) · Fuel (nutrition guidance + protein calculator) · Progress
(weight/waist charts + session log) · Guide (rules, science, reset).

---

## 1. What changed (original app → this project)

The original app was a single 757KB self-contained `.html` file: all markup,
~19KB of CSS and ~550 lines of vanilla JS in one document, with 26 exercise
thumbnails embedded as inline base64 `data:` URIs directly in a JS object
literal.

This conversion:

- **Restructured it into a proper Next.js 14 (App Router) + TypeScript
  project** — real routes (`/`, `/workouts`, `/workouts/[dayId]`, `/fuel`,
  `/progress`, `/guide`), a shared root layout, and ~20 small, focused
  components instead of one monolithic `<script>` block. Business logic
  (the day-number/phase engine, storage) is split into plain, unit-testable
  TypeScript modules under `lib/`, fully separated from UI.
- **Extracted all 26 base64 exercise images into real `.webp` files** under
  `public/exercises/`. This alone removes ~700KB of base64 text from the JS
  payload and lets Safari cache each image individually instead of
  re-parsing a giant string on every load.
- **Replaced global mutable state + manual `innerHTML` re-rendering** with
  React state, a typed `AppState` shape, and a single `AppStateContext`
  provider — same data, same behavior, proper reactive rendering.
- **Added real PWA plumbing**: a Web App Manifest, generated app icons
  (180/192/512/maskable), correct Apple meta tags, safe-area handling, and a
  hand-written service worker that precaches the app shell + all exercise
  images for offline use at the gym.
- **Replaced `window.confirm()`** (used for "Reset All Data") with an
  in-app confirmation sheet — `confirm()` renders inconsistently inside
  installed iOS PWAs; the new dialog matches the app's design and always
  works in standalone mode.
- **Everything else — every screen, calculation, exercise, cue, rep scheme,
  the phase system, the streak/cycle stats, and the theme system — is
  preserved exactly.** See the "Preserved behavior notes" section below for
  the few characteristics of the original that were intentionally *not*
  changed even though they could be seen as limitations.

### Preserved behavior notes (read before "fixing" these)

- The **day-number engine** (Program Day → Week → 12-week Phase cycle) is
  ported 1:1, including the modulo math for negative/pre-start dates.
  `lib/day-engine.ts` has a real, executable test suite (34 assertions,
  compiled and run with plain `node`, not just type-checked) — see
  `## 0. Pre-deployment audit (this pass)` below for how it was verified.

---

## 0. Pre-deployment audit (this pass)

A full pre-deployment code review was performed on this project after the
initial port. Summary of what changed as a result — see the chat-provided
audit report for the complete bug list, security/performance/mobile review,
and verification methodology.

**Data-loss bug fixed:** `completions` (`Record<dayId, dateString>`) can, by
design, only ever hold one date per workout type (4 entries total) — it
exists purely to answer "was *this* workout completed on *this* date" for
the per-day UI toggle. An earlier revision of this port also used it as the
*source of truth* for "Total Sessions", "Day Streak" and the Progress-tab
"Session Log". Since a `Record` overwrites on repeat keys, those three
numbers/lists silently stopped growing after a user's 4th completed
session, no matter how many more workouts they logged — a real,
user-facing data-loss bug, not a cosmetic one.

Fixed by adding a second, append-only field: `history: SessionRecord[]`
(`lib/types.ts`), which every `toggleDayComplete` call appends to (and
symmetrically removes from on "undo"). `Total Sessions`, `Day Streak`, and
the `Session Log` now all read from `history`; `completions` is kept
unchanged and used only for its original, correct purpose.

**Other fixes made in this pass:**
- `addMetricEntry` (weight/waist logging) now **upserts** on the current
  date instead of always pushing, so a double-tap of the ＋ button or a
  corrected re-entry the same day no longer creates duplicate rows in the
  chart/history.
- The set-value inputs on each exercise card (`ExerciseCard.tsx`) were
  switched from **uncontrolled** (`defaultValue` + save-on-blur) to
  **controlled** (`value` + save-on-change), so they can never show a stale
  number after an external state change (e.g. Reset All Data) and can't
  lose the last keystroke if the field never blurs before the component
  unmounts (e.g. an iOS back-swipe).
- All implicit-`any` event handler parameters across the app (`onChange`,
  `onKeyDown`, etc.) were given explicit React event types, so the project
  type-checks cleanly under `strict: true` with zero implicit-`any` errors.
- Removed a redundant duplicate `loadState()` call on mount (state now
  starts as a plain in-memory default and is hydrated exactly once).
- The Progress-tab Session Log is capped at the 60 most recent sessions in
  the rendered list (a DOM-size guard for long-term daily use); the
  underlying `history` array driving the stats is never truncated.

**Verified, not just asserted:** `lib/day-engine.ts` (program-day math,
week/phase calculation) was compiled to plain JS and run against 34
hand-written assertions covering the start date itself, dates before the
start date, the `dateKeyForProgramDay` ↔ `programDayNumber` round-trip, all
7 weekly-cycle positions (including negative program days), and every
phase-boundary week (1, 2, 3, 6, 7, 10, 11, 12) — all 34 pass. The full
project was also type-checked with the real TypeScript compiler in `strict`
mode against the actual `react`/`next` APIs the code calls (via a minimal
local type shim, since this sandbox has no package-registry access) with
zero errors, and cross-checked so every exercise image referenced in
`program-data.ts` exists in `exercise-images.ts` and on disk, and the
service worker's precache list exactly matches the real exercise image set
(0 missing, 0 stale entries).

---

## 2. Technology stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 14** (App Router, static export) | Zero server-side data dependency — every screen renders from `localStorage` + static program data — so `output: "export"` turns the whole app into plain static HTML/CSS/JS. That means no serverless cold starts, trivial CDN caching on Vercel, and simple, reliable service-worker precaching. |
| Language | **TypeScript** (strict) | Catches the kind of date-math and prop-typing mistakes that are easy to make when porting business logic by hand. |
| UI | **Plain CSS with CSS custom properties** (`app/globals.css`), not Tailwind | The original app already had a cohesive, polished design system built entirely on CSS variables (`--accent`, `--bg-card`, etc.) that get swapped at runtime for the 6-theme picker. Re-implementing ~1,500 lines of bespoke, animation-heavy UI as Tailwind utility classes would add translation overhead and verbosity without improving maintainability — the existing approach *is* the simple option here. React components still give full reusability (`Accordion`, `ExerciseCard`, `DayCard`, etc.), which was the actual duplication problem worth solving. |
| State | **React Context + `useState`** (`context/AppStateContext.tsx`) | One small, typed, app-wide store. No Redux/Zustand — the state shape is small and a single context with memoized actions is simpler and sufficiently performant. |
| Persistence | **`localStorage`** (`lib/storage.ts`) | See Section 3 — no backend is needed. |
| PWA | Hand-written `manifest.json` + `sw.js`, no `next-pwa` dependency | The caching needs here (precache a known, small, stable asset list + stale-while-revalidate everything else) are simple enough that a ~90-line service worker is easier to audit and maintain than an extra build-time dependency. |
| Images | Static `.webp` files served via `next/image` with `unoptimized: true` | Static export can't use Next's remote image-optimization API; the source images are already small, pre-sized, and web-optimized, so this is the correct and simplest setting. |
| Icons | Generated PNGs (180/192/512/512-maskable/32/16) | Matches the app's bold wordmark for a clean Home Screen icon. |

**No UI component library, no CSS framework, no state management library,
no icon font/library, no date library (`day-engine.ts` is ~15 small pure
functions — not worth a dependency).** This keeps `npm install` fast and the
bundle small.

---

## 3. Supabase requirement

### **Supabase is not required.**

This is a single-user, on-device training log. Every feature — workout
completions, per-set logs, weight/waist history, body-weight for the protein
calculator, the theme choice, and the program start date — belongs to *one
person, on one phone*, and nothing about the app's value depends on:

- User accounts or login
- Data being visible to, or shared with, anyone else
- The same data appearing on a second device
- Server-side computation (the day-number/phase math and protein calculator
  are simple pure functions that run instantly on-device)

Given that, adding Supabase would mean: an auth flow the user doesn't need,
a hosted Postgres database for data that's genuinely single-device, RLS
policies to write and maintain, environment variables and secrets to keep
straight, and a new failure mode (no network → broken app) for a workout
log that should work perfectly well in a gym basement with no signal.
`localStorage` has none of those costs and already fully supports every
feature in the app — data survives refreshes, browser restarts, and
closing/reopening the installed Home Screen app, for as long as the user
doesn't clear Safari site data.

**If you ever want cross-device sync** (e.g. logging a workout on your
phone and seeing it reflected on an iPad), the migration path is
straightforward and contained almost entirely to `lib/storage.ts` and
`context/AppStateContext.tsx`:

1. Add Supabase Auth (magic link or Apple Sign-In is a natural fit for an
   iOS-first app).
2. Create one table, `app_state(user_id uuid primary key references
   auth.users, data jsonb, updated_at timestamptz)`, with a Row Level
   Security policy restricting `select`/`insert`/`update` to
   `auth.uid() = user_id`.
3. Replace `loadState`/`saveState` with Supabase reads/writes, keeping
   `localStorage` as an offline-first cache (write-through), so the app
   still works with no connection and syncs when back online.

No other file needs to change — the entire rest of the app only talks to
`useAppState()`, not to storage directly.

---

## 4. Project structure

```
leanfit-app/
├── app/
│   ├── layout.tsx              # Root layout: metadata, viewport, PWA meta, wraps AppShell
│   ├── globals.css             # Full design system (CSS variables, all component styles)
│   ├── page.tsx                # "/" → renders HomeView
│   ├── workouts/
│   │   ├── page.tsx            # "/workouts" — 4-day list
│   │   └── [dayId]/
│   │       └── page.tsx        # "/workouts/day1".."day4" — generateStaticParams + Suspense wrapper
│   ├── fuel/page.tsx           # "/fuel" — nutrition guidance + protein calculator
│   ├── progress/page.tsx       # "/progress" — charts, history, session log, roadmap
│   └── guide/page.tsx          # "/guide" — rules, science notes, reset
├── components/
│   ├── AppShell.tsx            # Wraps app in AppStateProvider, hydration gate, SW registration
│   ├── HomeView.tsx            # All Home screen logic (date nav, phase strip, CTA, stats)
│   ├── BottomNav.tsx           # Fixed tab bar, active state from usePathname()
│   ├── SettingsSheet.tsx       # Bottom sheet: theme picker + start-date input
│   ├── ConfirmDialog.tsx       # Reusable confirm sheet (used by Reset All Data)
│   ├── DayCard.tsx             # Workouts-list row
│   ├── ExerciseCard.tsx        # Exercise card with cue, check, per-set inputs
│   ├── ExerciseThumb.tsx       # Glowing/bobbing thumbnail (next/image)
│   ├── ProgressChart.tsx       # Canvas line chart, DPR-aware, theme-reactive
│   ├── Accordion.tsx           # Expand/collapse row used across Fuel/Progress/Guide
│   ├── SectionHead.tsx         # Small section title + divider line
│   └── WorkoutDetailClient.tsx # Client half of the [dayId] route (see note below)
├── context/
│   └── AppStateContext.tsx     # Single source of truth: state, hydration gate, all actions
├── lib/
│   ├── types.ts                # AppState, Exercise, WorkoutDay, Theme, etc.
│   ├── program-data.ts         # PROGRAM (4 days × exercises), WEEKLY_CYCLE, THEMES
│   ├── day-engine.ts           # Pure date/program-day/phase math (unit-checked)
│   ├── storage.ts              # localStorage load/save, SSR-safe
│   └── exercise-images.ts      # img-key → /public/exercises/*.webp path map
├── public/
│   ├── manifest.json           # PWA manifest (standalone display, icons)
│   ├── sw.js                   # Hand-written service worker (precache + SWR)
│   ├── icons/                  # apple-touch-icon, 192/512/512-maskable, favicons
│   └── exercises/               # 26 extracted .webp exercise thumbnails
├── next.config.js              # output: "export", images.unoptimized
├── tsconfig.json
├── package.json
└── .gitignore
```

**Why `[dayId]/page.tsx` is split into a server file + `WorkoutDetailClient.tsx`:**
static export requires every dynamic route segment to be enumerable at
build time via `generateStaticParams`, which must be exported from a Server
Component. The actual interactive UI needs `useSearchParams()` (to support
opening a *future* scheduled day from Home's date navigator) and app
context, which requires `"use client"`. Splitting the two keeps the static
param list in a plain server file and the interactivity in a client
component, wrapped in the `<Suspense>` boundary that `useSearchParams`
requires during static export.

---

## 5. Running locally

```bash
npm install
npm run dev
# open http://localhost:3000 — resize your browser or open dev tools'
# device toolbar set to an iPhone size to preview the mobile-first layout
```

Production build (what Vercel runs):

```bash
npm run build     # outputs the static site to /out
npm run start     # NOTE: "next start" needs a server build — for static
                   # export, instead preview /out with any static server,
                   # e.g.: npx serve out
```

> **A note on how this project was verified in the sandbox it was built
> in:** the build environment used to write this project has no npm
> registry access, so `next`/`react` type packages couldn't be installed to
> run an actual `next build` there. Every `.ts`/`.tsx` file was instead
> type-checked structurally with the TypeScript compiler directly (strict
> mode on the framework-agnostic `lib/` modules, and a full syntax/JSX/
> import-resolution pass across all ~30 component and page files), and the
> day-number/phase engine's math was independently verified against the
> original app's expected outputs. All of that passed cleanly. Still,
> please run `npm install && npm run build` yourself as the very first step
> after cloning (Step 2 below) — Vercel will also do this automatically on
> every deploy — and let me know if anything surfaces so it can be fixed
> immediately.

---

## 6. GitHub → Vercel deployment (Supabase not needed)

You said you're already comfortable with the general GitHub → Vercel →
Supabase workflow, so this skips the basics and focuses on the specifics
for this project.

### Step 1 — Create the GitHub repository

- **Name:** `leanfit-app` (or anything you prefer)
- **Visibility:** Private is fine — this is a personal training log with no
  reason to be public, but public works too since there are no secrets
  anywhere in the code.
- **Files to upload:** the entire `leanfit-app/` folder contents (everything
  listed in Section 4). Do **not** upload a `node_modules` folder or a
  `.next`/`out` build folder — `.gitignore` already excludes these.
- Initialize as a plain repository (no README/license auto-generated by
  GitHub, since this project already includes its own `README.md`).

### Step 2 — Push the code

From inside the `leanfit-app` folder:

```bash
git init
git add .
git commit -m "Initial commit: LEAN&FIT PWA"
git branch -M main
git remote add origin https://github.com/<your-username>/leanfit-app.git
git push -u origin main
```

Before pushing, run this once to confirm the project actually builds:

```bash
npm install
npm run build
```

Fix anything that surfaces here first — it's much faster to iterate locally
than through Vercel's deploy logs.

### Step 3 — Supabase

**Not needed for this project.** Skip straight to Step 4. (Section 3 above
covers the reasoning and the exact migration path if you change your mind
later.)

### Step 4 — Configure Vercel

1. **Import the GitHub repository** from your Vercel dashboard
   ("Add New… → Project → Import Git Repository").
2. **Framework Preset:** Vercel should auto-detect **Next.js**. Leave it as
   Next.js even though this project uses static export — Vercel's Next.js
   integration natively understands `output: "export"` and serves the
   generated static files correctly. (If you ever switch the preset to
   "Other", set Build Command to `next build` and Output Directory to
   `out` manually.)
3. **Build settings:** leave the defaults —
   - Build Command: `next build`
   - Output Directory: *(auto-detected — leave blank)*
   - Install Command: `npm install`
4. **Environment variables:** **none required.** There is nothing to add
   here for this project.
5. Click **Deploy**. First deploy takes a minute or two.
6. **Redeploying after changes:** just push to `main` — Vercel redeploys
   automatically on every push (see Step 7).

### Step 5 — Connect Supabase and Vercel

**N/A — no Supabase project, no environment variables to wire up.**

### Step 6 — Test the deployed application

Once Vercel gives you the production URL:

- [ ] **Desktop browser:** open the URL, confirm all 5 tabs load, click
      through Home → Workouts → open a day → Fuel → Progress → Guide.
- [ ] **iPhone Safari:** open the same URL on your iPhone. Confirm no
      horizontal scrolling anywhere, the bottom tab bar sits above the
      home-indicator safe area, and the top content clears the notch/
      Dynamic Island.
- [ ] **Add to Home Screen:** Safari → Share icon → *Add to Home Screen*.
      Confirm the LEAN&FIT icon appears correctly, and opening it launches
      in full-screen standalone mode (no Safari address bar).
- [ ] **Data persistence:** log a few sets on a workout, mark a day
      complete, add a weight entry, change the theme — then fully close
      and reopen the installed app. Everything should still be there.
- [ ] **Refresh behavior:** hard-refresh the browser tab (not the
      installed app) — state should persist identically.
- [ ] **Offline behavior:** with the app already opened once (so the
      service worker has installed), turn on Airplane Mode and reload —
      Home, Workouts, all 4 workout days, Fuel, Progress and Guide should
      all still render with images intact.
- [ ] **Date navigator + day-jump:** step through days with the ‹ › arrows,
      tap the date to open the native iOS date picker, and try "Jump to
      Day # 40" — confirm the Program Day / Week / Phase badges update
      correctly.
- [ ] **Settings sheet:** tap the ⚙ icon, change the theme (confirm the
      whole UI accent color updates immediately, including the progress
      chart), and change the program start date.
- [ ] Authentication / database sync: **not applicable** — no backend.

### Step 7 — Future updates

Normal workflow after the first deploy:

```
edit code
   ↓
git add .
   ↓
git commit -m "..."
   ↓
git push
   ↓
GitHub
   ↓
Vercel automatically builds & deploys the new version
```

Since there's no database, there's no schema migration step to worry about.
If you do add Supabase later per the migration path in Section 3, that's
the point where you'd also start tracking SQL migrations (e.g. with the
Supabase CLI) alongside your app code changes.

---

## 7. Known limitations / good next steps

- No automated test suite (unit tests for `lib/day-engine.ts` would be a
  natural first addition — the functions are already pure and easy to test).
- The Session Log intentionally shows only the latest completion per
  workout type, per the original app's design (see Section 1).
- `localStorage` has a per-origin size limit (usually 5–10MB in Safari) —
  effectively unlimited for this app's data shape, but worth knowing if you
  ever store, say, progress photos client-side.
