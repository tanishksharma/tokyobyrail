# The backend

Tokyo by rail is a static site with exactly one server-side feature: the
heart you can leave on a line. Everything else is baked into `index.html`.

It lives in the `tanishksharmacom` Supabase project
(`ndgzwmyqnldlkmjwlmwr`), sharing that database and its `VIEW_IP_SALT`
secret. Every object here is prefixed `rail_` so the two sites never touch
each other's rows.

## Hearts

Three pieces, all mirrored in this folder:

- `rail_line_likes` — what the page reads: one row per line that has ever
  been hearted, `line_key` and `likes`. Public SELECT, and nothing else:
  RLS carries no insert, update or delete policy, so a forged PATCH from
  the browser is accepted with a 204 and changes nothing.
- `rail_like_log` — one row per ACTIVE heart, `line_key` plus a salted
  sha256 of the visitor's IP. Zero policies: only the service role reads
  it, so no address and no hash ever reaches a browser. A second tap
  deletes the row, so this is current hearts, not history.
- `record_rail_like(p_line, p_ip_hash)` — the toggle. Takes an advisory
  lock on the line and visitor, moves both tables together, and returns
  `{ likes, liked }`. Service role only; `anon` calling it gets a 401.

The browser never touches any of that. It POSTs `{ line }` to the
`rail-like` Edge Function, which answers only the live origin
(`https://tokyorail.tanishk.ai`), hashes the caller's IP with
`VIEW_IP_SALT`, and calls the RPC. Deployed `verify_jwt=false`, because
the whole point is that no account is involved.

**Consequences worth knowing.** One heart per line per IP address, so
people behind one office or one phone network share a heart. Hearts do not
count from a branch preview or from localhost, since the function refuses
those origins; the page still turns red locally, it just never reaches the
database. `localStorage["hearted"]` is the browser's own record of which
lines it hearted and is only a hint for the colour: the server owns the
number.

## The line key

`line_key` is built in the page from the operator and the line name, e.g.
`tokyo-metro-ginza-line`. The app owns the line list, so there is no
foreign key and no seeding: the first heart creates the counter row.
Renaming a line in `LINES` starts its count over, so rename with care.
