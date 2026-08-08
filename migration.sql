-- migration.sql — one-time migration of the live project from a single
-- shared (anon-accessible) tasks table to per-user data isolation.
-- Run PART 1 first, then sign up for a real account in the app, then run PART 2.

-- ============================================================
-- PART 1 — run this first (safe: does not remove existing access)
-- ============================================================

-- Add the column that will own each row, without breaking existing rows.
alter table public.tasks
  add column if not exists user_id uuid references auth.users(id) on delete cascade;

-- New inserts made while logged in will be stamped with the current user automatically.
alter table public.tasks alter column user_id set default auth.uid();

-- Add per-user access alongside the old anon policy (both coexist for now).
drop policy if exists "Users manage own tasks" on public.tasks;
create policy "Users manage own tasks"
  on public.tasks
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- Now: sign up in the app (locally or on the deployed site) with your
-- real email/password. This creates your auth.users row. Then come back
-- and run PART 2 below, replacing YOUR_EMAIL with the email you just used.
-- ============================================================

-- ============================================================
-- PART 2 — run this after signing up
-- ============================================================

-- Attach the 3 pre-existing tasks (created before login existed) to your account.
update public.tasks
set user_id = (select id from auth.users where email = 'YOUR_EMAIL')
where user_id is null;

-- Now that every row has an owner, enforce it going forward.
alter table public.tasks alter column user_id set not null;

-- Remove the old fully-open policy — from now on, only signed-in owners
-- can see or change their own rows; anonymous access is gone entirely.
drop policy if exists "Allow anon full access to tasks" on public.tasks;

-- Sanity check: should return 0.
select count(*) as orphaned_rows from public.tasks where user_id is null;
