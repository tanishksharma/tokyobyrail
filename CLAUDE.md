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
  badge, its Japanese name and that name's hiragana reading, its riders a
  day, its route length and its stop count. Two view
  modes: the card wall, and the network map (`map.svg`, the CC0 Greater-Tokyo
  diagram by Naoki Hashimoto — one finger pans, two fingers pinch, the wheel
  zooms, a tap opens a line, and the current filters dim everything else).
  Sorted by ridership, company or colour; filtered by area (inside Tokyo / to
  the suburbs / outside) and company; a per-line detail dialog carries the map
  with that line highlighted, filling the whole top of the popup and taking
  the same gestures plus a zoom pill. Every control mirrors into the URL.
  Company marks are GREY on the CARDS: twenty-two corporate palettes
  across one screen fought the line colours, which are the only colours
  there that mean anything. A SECTION HEADING is the exception, amended
  22 Aug 2026 — one mark per section, at size, with nothing beside it to
  fight, so it wears the company's own wordmark in full colour. Half those
  wordmarks set their type in black for a printed timetable, so in the
  dark they take a white clear-space chip (`--mark-plate`) rather than an
  inversion into colours the company never uses. The popup likewise shows
  its mark once, at size, in colour.
  Sorted by company, the sections run by SIZE — JR East and its seventeen
  first, down to the two-line operators, companies level on count split by
  ridership. The ten companies that run a single line share one section at
  the end, "One line each", whose heading carries their ten marks in a row
  instead of one. A section heading is a CARD inside its own grid,
  spanning every track, and `fitColumns()` gives each grid only as many
  tracks as it has cards, so a heading ends exactly where its last card
  does.
  Every line wears a HEART anyone can leave without an account (see The
  backend below) — red once this browser has left one, with the count
  rolling up beside it.
  The bottom bar is a row of frosted-glass pills, one per control (view,
  arrange, area, company): each carries an icon for what it controls and
  the WORD it is currently set to, and wears the accent while that is not
  the default — which is why there is no longer a dot or a count badge.
  The view pill toggles; the other three open a panel each, and a panel
  opens OUT OF ITS OWN PILL: `placePanel()` centres it on the pill,
  clamps it inside the screen, and runs its own clip wipe out of a sliver
  at the pill's x — the library's own riser hangs off a bar corner, which
  is right for a two-corner tab bar and wrong for pills in a row.
- **Learn** (`/learn`) — placeholder. Planned: a grid of topics on the
  network's history, each opening as an Instagram-style story.
- **Quiz** (`/quiz`) — placeholder. Planned: scored rounds with a live
  leaderboard and sign-in to save progress.

The bar convention: the TOP bar navigates between the three sections; the
BOTTOM bar belongs to whichever section is open and controls its state (on
Explore: one pill per control, laid along the bottom edge).

The material: the CHROME wears the embossed frosted glass the library gives
its tab bar — the recipe is lifted into `--glass-*` tokens and a `.glass`
class in the page, so the control pills and the library's own bars are one
material. Letters on glass are embossed with the `--emboss-up` /
`--emboss-down` pair, which swaps weight in the dark. The CARDS deliberately
do NOT: a wall of ninety-eight blurred panes cost more than it said, and a
card should read as printed, not pressed. A card is a plain 4:3 PLACARD on
`--surface`: square corners and one hard, unblurred shadow (`--placard`,
3px down and across), so it reads as a board hung against a wall rather
than a rounded pane floating over one. The wall is spaced to match — cards
1.35rem apart, a heading a little further from its own cards than they are
from each other, and 4.5rem between one company and the next. Its content:
the badge, then the line's reading over its Japanese name
(four units to six, from one `--u` the card works out from the name's
length; both hold to one line and cut with an ellipsis, the name sized to
fit first so the reading is the one that cuts). The trailing 線 is dropped
from the displayed name, and its せん from the reading with it: 85 of the
98 names end in it, so on a wall of nothing but lines it is the one
character that never says anything, and dropping it lets the part that
differs stand a size larger. It goes wherever it ENDS a name, which on
宇都宮線・高崎線 is twice. Names that end another way keep every character.
The data keeps the true name — the popup, the tooltip and the search all
read `j`, the English name underneath at the size the extra width bought,
and the same Japanese name again behind all of it as a very large, very
bold, almost-gone watermark in the lower right.

Along the foot runs the BAND: the line's own colour, full width, carrying
the figures on the left and the company mark on the right. It is the old
hairline strip grown into a real area, and the second place a line's colour
appears at size. Everything on it is WHITE and bold — figures, icons
(set heavy by stroke-width, since the library draws its glyphs as strokes)
and the company mark alike — vertically centred, with a decent inset from
both ends. It was contrast-picked black-or-white per line for a day; the
maintainer chose one white throughout, which is how a real line band is
set, and the bold weight carries it on the pale colours. The band is SOLID,
in the primary colour only: no single ink reads on both halves of a split,
the Rinkai Line's teal and navy wanting opposite ones. The four lines that
officially carry a second colour say so with a band of it sitting directly
on top of the first — the Shonan orange over green on the Tokaido and the
Utsunomiya/Takasaki, the Nippori-Toneri's pink and green, the Rinkai's
teal and navy. A line with no second colour draws nothing there, so its
band keeps its own height and its figures stay centred in it. Those
figures are set at 700, not the 600 the strong-weight token carries.

Below 34rem the card drops the 4:3 and takes only the height it needs (on
a floor of 9.5rem, or it collapses into a thin bar around its text), or
one card would fill a third of a phone, and the watermark goes with it —
a short card leaves no clear ground and the watermark climbs behind the
names. Glass needs something to blur, so the page's first child is the ground:
a DIAMOND LATTICE of the station-number badges themselves — the same
roundels and rounded squares the cards wear, in each line's own colour,
in their real colours — white face, coloured ring, dark letters — and then
thrown out of focus: `filter: blur()` on the LAYER, not each badge, so it
costs one pass, with a fade over it. They were a faint outline until
22 Aug 2026; shown vibrant and sharp they competed with the wall for the
eye, so the vibrance stayed and the focus went. The dark ground sits back
further (more blur, less opacity) because white faces punch harder against
a dark page. The lattice is already drawn a cell past every edge, so the
blur finds no thin rim. It is drawn by `drawGround()` as
two interleaved square grids (corners and cell centres) so the rows run
on the diagonal while every glyph stays upright — rotating the layer
would tip the icons over with it. Which glyph lands where is a hash of
the lattice position, so the field looks random but is identical on every
draw and a resize re-lays it rather than reshuffling it; the seed changes
per page load. It keeps the library's `.bg-fixed` and its print and
contrast behaviour. A new CHROME pane takes `.glass`; never hand-roll
a second recipe, and never put glass on a card. Line data is baked into the file as constants, verified Aug
2026 against the line articles on English/Japanese Wikipedia and the Japanese
railway line-color compendium (日本の鉄道ラインカラー一覧). Shinkansen is out
of scope.

The `k` field is each line's reading, taken from the line article's own
lead: hiragana for the kanji, katakana kept as written, because furigana is
not set over katakana. Four lines have no `k` at all — つくばエクスプレス,
ゆりかもめ, ブルーライン, グリーンライン — since their names are already kana
and have nothing to gloss; the card simply shows the name alone.

`stations.json` is the second data file and the only one fetched at runtime:
the running order of all 98 lines, 1,631 stations, keyed by line index. A row
is `[badge, english, japanese]`. The badge is TEXT, not a number, because a
stop does not always wear its own line's code — Narita Sky Access shares
Hokuso track and shows Hokuso numbers, the Keiyo Line's last two stops carry
other lines' numbers, and the Utsunomiya and Takasaki runs beyond Omiya are
not numbered at all; an empty badge is correct and renders as an empty slot.
A row whose badge reads `head` is a heading, marking where a line forks.

Every line now carries its opening year. Riders a day is the ONE field left
blank, on 11 lines, and it stays blank on purpose: the Japanese sources
publish 輸送密度 (passenger density), which measures something else, and
mixing the two would corrupt the column. The Fun tab says so on those lines
rather than showing a gap.

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
  official signage colors are data, not theme). The badge is THE SITE'S
  badge, not a facsimile: one size knob, both shapes 16% border, equal
  AREA rather than equal width, and ONE face — Jost, the closest free cut
  of Futura, which is what Tokyo Metro sets its station numbers in.
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
