# Tokyo by rail — Project Brief for AI Sessions

> **URL.** Production (from `main`): **https://tokyorail.tanishk.ai** — always
> share this evolving link, never a per-deployment URL.

The standalone site for the Tokyo by rail project, deployed on Vercel as a
static site from `main`. It is ONE file — `index.html` — holding three
sections, switched by the top tab bar and each with its own URL
(`vercel.json` rewrites `/stations` and `/quiz` onto the same page; JS reads
`location.pathname`):

- **Trains** (`/`) — all 98 Greater-Tokyo passenger lines across 22
  companies, each with its official color, line symbol and station-number
  badge, its Japanese name and that name's hiragana reading, its riders a
  day, its route length and its stop count. The card wall is the ONLY view:
  the whole-network map mode and its toggle were retired 22 Aug 2026, and
  `map.svg` (the CC0 Greater-Tokyo diagram by Naoki Hashimoto) now serves
  the popup alone. Sorted seven ways — ridership, length, stops, age, name,
  company, colour — each one comparator in `ORDER_BY`, with the lines
  missing that figure sorted LAST rather than as a zero pretending to be
  the shortest or the quietest. Filtered by
  area (inside Tokyo / to the suburbs / outside) and company, BOTH
  multi-select: each holds a set, picking a second widens the wall rather
  than replacing what you had, and the sheet stays open while you pick.
  Sort stays single, an order being one thing by definition. The company
  sheet groups its twenty-two names BY AREA — where most of that company's
  own lines run — because one column of twenty-two is a wall to read and
  three short lists are a place to look. Every pick is its own chip under
  the headline with its own cross, and a Clear all appears once more than
  one is on. The URL carries them comma-separated (`?op=a,b&area=x,y`) and
  drops anything it does not recognise. A per-line
  detail dialog carries the map with that line highlighted, filling the
  whole top of the popup — one finger pans, two fingers pinch, the wheel
  zooms — plus a zoom pill. Every control mirrors into the URL.
  Company marks are GREY on the CARDS: twenty-two corporate palettes
  across one screen fought the line colours, which are the only colours
  there that mean anything. A SECTION HEADING is the exception, amended
  22 Aug 2026 — one mark per section, at size, with nothing beside it to
  fight, so it wears the company's own wordmark in full colour, and from
  23 Aug its brand colour three ways: a pale wash as the face, the name in
  a deepened cut of it, and a rule of it along the foot, which answers the
  line cards' colour band below without competing with it. The colours in
  `OP_BRAND` were READ OUT of each company's own artwork in `/logos`, never
  looked up and typed in, so a heading cannot claim a colour its mark does
  not use; the four companies that draw their mark in one ink get no brand
  colour and keep the plain heading. `--brand-ink-mix` (60% on paper, 52%
  in the dark) is solved against all 21 so the worst of them still clears
  4.5:1 on its own wash. Half those
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
  Over the wall sits the HEADLINE, on the WALL'S left edge and not the
  page's — `fitColumns()` hands it the grid's own width, since the wall is
  centred on fixed tracks and floats some way in. One line naming the
  count, the subject and the order, and under it the applied filters as removable pills. The
  model is lifted from the feed page on tanishksharma.com — state in one
  object, every control mirrors it, every applied filter is a pill you can
  take off, and the whole state lives in the URL. Every state the controls
  can reach has its own sentence: the subject comes from the filters (a
  company names itself, an area describes itself, both read as one
  phrase), and the order is named always so the line ends the same way.
  A company FILTER also earns its heading card, whatever the arrangement:
  sorting by company gives every company one, and filtering to a single
  company used to throw away the one heading certain to be right.
  Every line wears a HEART anyone can leave without an account (see The
  backend below) — red once this browser has left one, with the count
  rolling up beside it.
  The bottom bar is a row of frosted-glass pills, one per control (arrange,
  area, company): each carries an icon for what it controls and
  the WORD it is currently set to, and wears the accent while that is not
  the default — which is why there is no longer a dot or a count badge.
  Each opens a panel, and a panel
  opens OUT OF ITS OWN PILL: `placePanel()` centres it on the pill,
  clamps it inside the screen, and runs its own clip wipe out of a sliver
  at the pill's x — the library's own riser hangs off a bar corner, which
  is right for a two-corner tab bar and wrong for pills in a row.
- **Stations** (`/stations`) — placeholder, and the NEXT build. A station
  is a building, not a dot, and the interesting part of Shibuya or
  Shinjuku is how it stacks: the plan is to walk one floor by floor, with
  the concourses and the levels between them, where the stairs, escalators
  and lifts run, and which platform on each floor takes which line in
  which direction. The section was called Learn until 23 Aug 2026;
  `vercel.json` 308s `/learn` here and `viewFromPath()` still answers to
  the old segment, so any link out there lands right.
- **Quiz** (`/quiz`) — placeholder. Planned: scored rounds with a live
  leaderboard and sign-in to save progress.

The three sections are Trains · Stations · Quiz, in the tab bar and in the
code (`VIEWS`, `#view-trains`, `#trains-bar`).

The bar convention: the TOP bar navigates between the three sections; the
BOTTOM bar belongs to whichever section is open and controls its state (on
Trains: one pill per control, laid along the bottom edge).

BOTH BARS GET OUT OF THE WAY. Reading down the wall they leave — the tabs
up past the top edge, the controls down past the bottom — so the middle of
the screen is lines and nothing else; a touch of upward scroll brings both
back at once. The trigger is TRAVEL IN ONE DIRECTION, not the raw delta: a
finger never scrolls straight, and a per-event test flickers the bars on
every wobble. Coming back is cheaper than going away (10px against 26),
because wanting the controls back is the impatient move. They stay put
while a panel is open — a panel hangs off its own pill, so taking the pill
away would leave it pointing at nothing — and near the top of the page,
where there is nothing to get out of the way of. All of it rides on
transform, so nothing reflows and the wall never moves under the finger.
This is the behaviour headed for Facet as the app-navigation component.

The material: the CHROME wears the embossed frosted glass the library gives
its tab bar — the recipe is lifted into `--glass-*` tokens and a `.glass`
class in the page, so the control pills and the library's own bars are one
material. Letters on glass are embossed with the `--emboss-up` /
`--emboss-down` pair, which swaps weight in the dark. The CARDS deliberately
do NOT: a wall of ninety-eight blurred panes cost more than it said, and a
card should read as printed, not pressed. A card is a plain 4:3 PANEL, barely
rounded (`--card-round`, 3px) and casting NO outer shadow at all: the
depth is inside it. `--card-face` is a vertical gradient, lightest at the
top and a shade darker at the foot, so the face reads as catching light
from above; `--card-emboss` is the inset pair that turns that into a
moulding — a highlight along the top edge, a dark hairline and a short
gradient at the bottom. In the dark the light comes off the TOP EDGE as a
white hairline, the way the library lights its own dark surfaces, since a
shadow there would say nothing. It cast an outer shadow until 23 Aug 2026,
first hard and then soft, and neither did as much as the light on its own
face. The wall is spaced to match — cards
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
thrown out of focus, with a fade over them. The blur is NOT on the lattice:
`#bg-soften` is an empty pane laid over it that blurs what it covers, masked
so it covers the middle and lets go toward the left and right edges — behind
the cards the ground keeps out of the way, and out past them, where there is
nothing to compete with, the badges come back into focus. One div does it;
the alternative was a second copy of six hundred badges. A phone has no bare
edge, so there the mask is dropped and the blur simply covers everything. They were a faint outline until
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
contrast behaviour.

The ground DRIFTS with the page: five pixels of scroll move it one, in the
same direction, so the wall reads as two planes rather than one sheet over
a still pattern. That is what the field's vertical REPEAT is for — the
lattice is drawn one screen plus one period tall and the offset is taken
modulo the period, so the layer slides the whole length of the wall and
never leaves its edge on screen. The period is sixteen rows, 1184px,
longer than a phone screen so the repeat never shows itself on one. The
layer is also ONE PERIOD TALLER than the screen and anchored at the top:
`.bg-fixed` is `inset: 0`, so at viewport height its own clipped bottom
edge climbs into view as it slides and the ground runs out below it — it
did, and it looked like the background blinking out. One transform per
frame on a layer nothing else touches; reduced motion holds it still. A new CHROME pane takes `.glass`; never hand-roll
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

## Staying current, and the audio session

Two things this site learned the hard way, both worth keeping.

A page left open keeps showing the build it loaded, and iOS hands a
backgrounded tab straight back from the bfcache untouched — so a deploy can
sit unseen for days and the wall reads as broken rather than merely old.
That is how a stale company ordering and a missing section were reported
when both were correct in the shipped file. On becoming visible again the
page HEADs its own URL with `cache: "no-store"`, compares the ETag against
the one it loaded with, and reloads itself if they differ. One request,
only when the tab is looked at.

The audio context is opened by the CHIME BUTTON and by nothing else, and
suspended the moment the melody ends, when the popup closes, and when the
page hides. It used to be opened and resumed by the first tap anywhere on
the page and then left running forever, which on iOS claims the device's
audio session: the page reads as playing sound and goes on reading that
way after the browser is put away. A context runs only while a note is
actually sounding.

## The backend

The site is static except for one thing: the heart on a line. It runs in
the `tanishksharmacom` Supabase project (`ndgzwmyqnldlkmjwlmwr`), sharing
that database and its `VIEW_IP_SALT` secret, with every object prefixed
`rail_` so the two sites never touch each other's rows. `supabase/` in this
repo mirrors what is deployed: the migration, the Edge Function and a
README explaining the shape and its consequences. Change the deployed
object and the mirror in the same commit.

Two failures this cost us, both now closed:

- A write that did not land was SWALLOWED. The heart went red, the number
  rolled up, and the tap was gone on the next load with nothing to show
  for it. A failed write now rolls the card back and toasts the status
  code, so the next one can be diagnosed rather than guessed at.
- Every bare `facet.` was a ReferenceError waiting for the library not to
  arrive, which it does on a flaky connection since it is loaded live and
  cross-origin. One missing script took the whole wall down with it. Calls
  go through `fx()` now; a missing library costs the icons and the toasts
  and nothing else.

One design note, found while testing: the toggle is keyed on the caller's
hashed IP, so a visitor whose address changes between taps cannot untoggle
and each tap adds another heart. Fine for a phone on one network, wrong
for anything behind a rotating egress. Revisit if it ever matters.

The origin check has one more lesson in it. `ALLOWED_ORIGINS` held only
the custom domain, and the site also serves on its production Vercel
alias; every heart left from `tokyobyrail.vercel.app` was refused with a
403 for a week. BOTH production hostnames belong in the set. Preview
deployments still do not — a branch must never move production numbers.

And the browser reconciles on load: a heart it remembers on a line the
server counts as zero is impossible, so the claim is dropped. That is what
left a red heart sitting beside a zero, and it now heals itself.

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
