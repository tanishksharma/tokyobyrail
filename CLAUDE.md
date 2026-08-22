# Tokyo by rail — Project Brief for AI Sessions

> **URL.** Production (from `main`): **https://tokyorail.tanishk.ai** — always
> share this evolving link, never a per-deployment URL.

The standalone site for the Tokyo by rail project, deployed on Vercel as a
static site from `main`. It is ONE file — `index.html` — holding three
sections, switched by the top tab bar and each with its own URL
(`vercel.json` rewrites `/learn` and `/quiz` onto the same page; JS reads
`location.pathname`):

- **Explore** (`/`) — all 98 Greater-Tokyo passenger lines across 22
  companies, each with its official color, line symbol and station-number
  badge, its riders a day, its route length and its stop count. Two view
  modes: the card wall, and the network map (`map.svg`, the CC0 Greater-Tokyo
  diagram by Naoki Hashimoto — one finger pans, two fingers pinch, the wheel
  zooms, a tap opens a line, and the current filters dim everything else).
  Sorted by ridership, company or colour; filtered by area (inside Tokyo / to
  the suburbs / outside) and company; a per-line detail dialog carries the map
  with that line highlighted, filling the whole top of the popup and taking
  the same gestures plus a zoom pill. Every control mirrors into the URL.
  Every line wears a HEART anyone can leave without an account (see The
  backend below) — red once this browser has left one, with the count
  rolling up beside it.
  The two bottom-bar buttons report their own state: the sort button wears a
  dot once the order leaves its default, the filter button a count of applied
  filters.
- **Learn** (`/learn`) — placeholder. Planned: a grid of topics on the
  network's history, each opening as an Instagram-style story.
- **Quiz** (`/quiz`) — placeholder. Planned: scored rounds with a live
  leaderboard and sign-in to save progress.

The bar convention: the TOP bar navigates between the three sections; the
BOTTOM bar belongs to whichever section is open and controls its state (on
Explore: view mode in the pill, sort behind the left button, filters behind
the right one). Line data is baked into the file as constants, verified Aug
2026 against the line articles on English/Japanese Wikipedia and the Japanese
railway line-color compendium (日本の鉄道ラインカラー一覧). Shinkansen is out
of scope.

This project GREW OUT OF the tanishksharmacom mini app (`/apps/tokyo-lines`,
never shipped to its live grid) but is NOT bound by that repo's mini-app
conventions: no `/apps` plumbing, no shared About page, no Supabase
`app_meta`/`app_views` rows, no single-file requirement — the site can grow
real pages and its own structure. Its own PWA files live at the root:
`sw.js` (network-first, registered by facet.js via `data-service-worker`),
`manifest.webmanifest`, `icon.png` (the roundel of subway line colors
around 東).

## Branching — NO staging, ever

This repo deliberately has no staging environment. This overrides the
staging-first workflow used in the other projects:

- `main` IS production. Vercel deploys it on every push.
- Every change, however large: create a feature branch, build on it, then
  merge it DIRECTLY into `main`. No intermediate branch of any kind.
- Never create, push to, or merge through a `staging` branch. If one ever
  appears, it is a mistake — say so instead of using it.
- Feature-branch previews (Vercel deploys every branch) are the only
  pre-production look.

## The backend

The site is static except for one thing: the heart on a line. It runs in
the `tanishksharmacom` Supabase project (`ndgzwmyqnldlkmjwlmwr`), sharing
that database and its `VIEW_IP_SALT` secret, with every object prefixed
`rail_` so the two sites never touch each other's rows. `supabase/` in this
repo mirrors what is deployed: the migration, the Edge Function and a
README explaining the shape and its consequences. Change the deployed
object and the mirror in the same commit.

The rules it establishes for anything added later:

- The browser reads with the public anon key and writes NOTHING directly.
  A write goes through an Edge Function that checks the Origin, so a branch
  preview and localhost can never move production numbers.
- Anything derived from a visitor (an IP) is salted and hashed server-side,
  and the table holding it carries zero RLS policies, so it is service-role
  only and never reaches a browser.
- Public tables get a SELECT policy and no other policy. Never grant the
  anon key insert, update or delete.
- No account, no sign-in, no cookie. If a feature needs identity, raise it
  before building it.

## Stack rules

- Vanilla HTML, CSS and JS. No frameworks, no build step, no npm runtime
  deps, no TypeScript.
- Styling comes from the Facet design system, loaded LIVE from
  `https://facet.tanishksharma.com/lib/facet.css` + `facet.js` — never
  vendored, never copied in. Component reference:
  https://facet.tanishksharma.com/llms.txt (source repo `tanishksharma/facet`;
  improve the library upstream, never fork it here). Default theme, library
  components only; bespoke CSS is tokens-only and justified in a banner
  comment (currently: the station-number badge and line-color card underline —
  official signage colors are data, not theme).
- `vercel.json` ships every file no-cache (`max-age=0, must-revalidate`) and
  `cleanUrls`, so internal links are extensionless and every deploy shows up
  immediately.

## What NOT to do

- Do not add a staging branch or environment (see above).
- Do not introduce a bundler, framework, or package.json.
- Do not let the browser write to the database directly, and do not put a
  service-role key anywhere near the client (see The backend above).
- Do not vendor the Facet library or pin its files locally.
- Do not import anything from the tanishksharmacom repo's `/apps` area — this
  site stands alone.
