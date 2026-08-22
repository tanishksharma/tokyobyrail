-- Tokyo by rail (tokyorail.tanishk.ai): a heart per railway line, left by
-- anyone, with no account. The same shape as the site's content likes:
-- a counter table the browser may read, a log table it may never read, and
-- one service-role RPC that toggles the two together.
--
-- The line key is built from the operator and the line name in the app
-- ("tokyo-metro-ginza-line"); the app owns the line list, so there is no
-- foreign key and no seeding — the first heart creates the counter row.

-- What the page reads: one row per line that has ever been hearted.
create table if not exists public.rail_line_likes (
  line_key text primary key,
  likes integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.rail_line_likes enable row level security;

-- Public read: a count is public, and the browser needs every count in one
-- request when the wall loads. No insert/update/delete policy exists, so
-- only the service role writes.
drop policy if exists "rail line likes are public" on public.rail_line_likes;
create policy "rail line likes are public"
  on public.rail_line_likes for select to anon, authenticated using (true);

-- One row per ACTIVE heart: line + salted sha256 of the visitor's IP. A
-- second tap deletes the row, so this table holds current hearts, not
-- history. Zero policies: the hash never leaves the database.
create table if not exists public.rail_like_log (
  line_key text not null,
  ip_hash text not null,
  created_at timestamptz not null default now(),
  primary key (line_key, ip_hash)
);

alter table public.rail_like_log enable row level security;

-- The toggle. Locks per line+visitor so two quick taps cannot race, then
-- returns the true count and whether this visitor now holds a heart.
create or replace function public.record_rail_like(p_line text, p_ip_hash text)
returns table(likes integer, liked boolean)
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_line is null or p_line = '' or length(p_line) > 120 then
    return;
  end if;

  perform pg_advisory_xact_lock(hashtext('rail-like:' || p_line || ':' || p_ip_hash));

  insert into public.rail_line_likes (line_key) values (p_line)
    on conflict (line_key) do nothing;

  if exists (
    select 1 from public.rail_like_log l
    where l.line_key = p_line and l.ip_hash = p_ip_hash
  ) then
    delete from public.rail_like_log l
      where l.line_key = p_line and l.ip_hash = p_ip_hash;
    -- the right-hand side is table-qualified: the bare name is shadowed
    -- by the OUT parameter of the same name
    update public.rail_line_likes r
      set likes = greatest(r.likes - 1, 0), updated_at = now()
      where r.line_key = p_line;
    return query select r.likes, false from public.rail_line_likes r where r.line_key = p_line;
  else
    insert into public.rail_like_log (line_key, ip_hash) values (p_line, p_ip_hash);
    update public.rail_line_likes r
      set likes = r.likes + 1, updated_at = now()
      where r.line_key = p_line;
    return query select r.likes, true from public.rail_line_likes r where r.line_key = p_line;
  end if;
end
$$;

revoke execute on function public.record_rail_like(text, text) from public, anon, authenticated;
grant execute on function public.record_rail_like(text, text) to service_role;
