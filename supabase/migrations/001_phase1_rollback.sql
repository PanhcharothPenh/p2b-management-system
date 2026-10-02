-- Rollback for 001. Only safe if nothing else depends on these tables yet.
-- Review before running. Back up first.
begin;
drop policy if exists user_branches_write on public.user_branches;
drop policy if exists user_branches_select on public.user_branches;
drop policy if exists profiles_write on public.profiles;
drop policy if exists profiles_select on public.profiles;
drop policy if exists role_permissions_write on public.role_permissions;
drop policy if exists role_permissions_select on public.role_permissions;
drop policy if exists permissions_select on public.permissions;
drop policy if exists roles_write on public.roles;
drop policy if exists roles_select on public.roles;
drop policy if exists branches_write on public.branches;
drop policy if exists branches_select on public.branches;
drop function if exists public.can_access_branch(uuid);
drop function if exists public.has_permission(text);
-- Tables are left in place on purpose to avoid data loss. Drop them manually only if empty/unused.
commit;
