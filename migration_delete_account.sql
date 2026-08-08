-- migration_delete_account.sql — lets a signed-in user delete their own account.
-- Run this once in the Supabase SQL Editor.
--
-- The client (anon/authenticated key) can never delete rows from auth.users
-- directly — that requires elevated privileges. This function runs as
-- `security definer` (with the privileges of its owner, not the caller), but
-- its body only ever deletes `auth.uid()` — the caller's own row — so a user
-- can only ever delete themselves, never anyone else.
--
-- `public.tasks.user_id` already has `on delete cascade`, so deleting the
-- auth.users row also removes all of that user's tasks/milestones automatically.

create or replace function public.delete_user()
returns void
language sql
security definer
set search_path = public
as $$
  delete from auth.users where id = auth.uid();
$$;

grant execute on function public.delete_user() to authenticated;
