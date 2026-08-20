# Tokyo by rail — Project Brief for AI Sessions

> **URL.** Production (from `main`): **https://tokyorail.tanishk.ai** — always
> share this evolving link, never a per-deployment URL.

The standalone site for the Tokyo by rail project, deployed on Vercel as a
static site from `main`. The site's root page (`index.html`) IS the Tokyo rail
lines app: all 98 Greater-Tokyo passenger lines across 22 companies, each with
its official color, line symbol and station-number badge — a card grid
arranged by company, color or ridership, an area filter (entirely inside
Tokyo / linking Tokyo with the suburbs / outside Tokyo), a company filter,
bilingual search, and a per-line detail dialog. Every control mirrors into the
URL. Data is baked into the file as constants, verified Aug 2026 against the
line articles on English/Japanese Wikipedia and the Japanese railway
line-color compendium (日本の鉄道ラインカラー一覧). Shinkansen is out of scope.

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
- Do not vendor the Facet library or pin its files locally.
- Do not import anything from the tanishksharmacom repo's `/apps` area — this
  site stands alone.
