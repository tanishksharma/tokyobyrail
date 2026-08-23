-- Tokyo by rail: how many times the app has been opened. One row a day,
-- a tally and nothing else — no address, no hash, no session. The About
-- page reads the table directly; only the service role writes, through
-- the rail-open edge function.

create table if not exists public.rail_app_opens (
  day date primary key,
  opens integer not null default 0
);

alter table public.rail_app_opens enable row level security;

drop policy if exists "rail app opens are public" on public.rail_app_opens;
create policy "rail app opens are public"
  on public.rail_app_opens for select to anon, authenticated using (true);

create or replace function public.record_rail_open()
returns integer
language plpgsql security definer set search_path = ''
as $$
declare total integer;
begin
  insert into public.rail_app_opens (day, opens) values (current_date, 1)
    on conflict (day) do update set opens = public.rail_app_opens.opens + 1;
  select sum(opens) into total from public.rail_app_opens;
  return total;
end $$;

revoke execute on function public.record_rail_open() from public, anon, authenticated;
grant execute on function public.record_rail_open() to service_role;
