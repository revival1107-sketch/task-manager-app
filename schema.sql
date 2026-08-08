-- schema.sql — run once in the Supabase SQL Editor (Project → SQL Editor → New query)

create table if not exists public.tasks (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  is_complete boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint title_not_empty check (char_length(trim(title)) > 0)
);

comment on table public.tasks is 'Personal task list items for 업무 관리 센터.';

-- Row Level Security: single-user app, no auth yet, anon key only.
-- RLS stays enabled with an explicit permissive policy (rather than disabling RLS)
-- so Supabase's security advisor doesn't flag it, and so a future auth-based
-- policy is a simple edit instead of a structural on/off flip.
alter table public.tasks enable row level security;

drop policy if exists "Allow anon full access to tasks" on public.tasks;
create policy "Allow anon full access to tasks"
  on public.tasks
  for all
  to anon
  using (true)
  with check (true);
