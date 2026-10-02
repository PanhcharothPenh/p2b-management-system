-- P2B Phase 1: roles, permissions, branches, branch-scoped RLS
-- DRAFT. ADDITIVE ONLY: no DROP, no DELETE, no data rewrite.
-- Before running: compare with the Phase 0 audit. If equivalent tables already exist
-- (e.g. a branches or profiles table), adapt this file to map onto them instead.
-- Run first on a Supabase branch/staging copy, never directly on production.

begin;

-- ---------- Tables ----------
create table if not exists public.branches (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  code        text unique,
  address     text,
  phone       text,
  status      text not null default 'active' check (status in ('active','inactive')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.roles (
  id           uuid primary key default gen_random_uuid(),
  code         text not null unique,          -- owner, admin, manager, staff
  name         text not null,
  all_branches boolean not null default false, -- owner/admin see every branch
  is_system    boolean not null default false,
  created_at   timestamptz not null default now()
);

create table if not exists public.permissions (
  id          uuid primary key default gen_random_uuid(),
  code        text not null unique,           -- e.g. staff.view
  module      text not null,
  description text
);

create table if not exists public.role_permissions (
  role_id       uuid not null references public.roles(id) on delete cascade,
  permission_id uuid not null references public.permissions(id) on delete cascade,
  primary key (role_id, permission_id)
);

create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete restrict,
  full_name  text,
  phone      text,
  role_id    uuid references public.roles(id),
  status     text not null default 'active' check (status in ('active','inactive')),
  language   text not null default 'en' check (language in ('en','km')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_branches (
  user_id   uuid not null references public.profiles(id) on delete cascade,
  branch_id uuid not null references public.branches(id) on delete restrict,
  primary key (user_id, branch_id)
);

create index if not exists idx_user_branches_branch on public.user_branches(branch_id);
create index if not exists idx_profiles_role on public.profiles(role_id);

-- ---------- Authorization helpers (server-side, not trusting the frontend) ----------
create or replace function public.has_permission(p_code text)
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1
    from public.profiles pr
    join public.role_permissions rp on rp.role_id = pr.role_id
    join public.permissions pe on pe.id = rp.permission_id
    where pr.id = auth.uid() and pr.status = 'active' and pe.code = p_code
  );
$$;

create or replace function public.can_access_branch(p_branch_id uuid)
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1
    from public.profiles pr
    join public.roles r on r.id = pr.role_id
    where pr.id = auth.uid() and pr.status = 'active'
      and (
        r.all_branches
        or exists (select 1 from public.user_branches ub
                   where ub.user_id = pr.id and ub.branch_id = p_branch_id)
      )
  );
$$;

revoke all on function public.has_permission(text) from public;
revoke all on function public.can_access_branch(uuid) from public;
grant execute on function public.has_permission(text) to authenticated;
grant execute on function public.can_access_branch(uuid) to authenticated;

-- ---------- Seed roles ----------
insert into public.roles (code, name, all_branches, is_system) values
  ('owner',   'Owner',   true,  true),
  ('admin',   'Admin',   true,  true),
  ('manager', 'Manager', false, true),
  ('staff',   'Staff',   false, true)
on conflict (code) do nothing;

-- ---------- Seed permissions ----------
insert into public.permissions (code, module) values
  ('dashboard.view','dashboard'),
  ('staff.view','staff'),('staff.create','staff'),('staff.edit','staff'),('staff.deactivate','staff'),
  ('attendance.view','attendance'),('attendance.manage','attendance'),
  ('revenue.view','revenue'),('revenue.create','revenue'),('revenue.edit','revenue'),
  ('expense.view','expense'),('expense.create','expense'),('expense.approve','expense'),
  ('inventory.view','inventory'),('inventory.manage','inventory'),
  ('payroll.view','payroll'),('payroll.calculate','payroll'),('payroll.approve','payroll'),
  ('reports.view','reports'),('reports.export','reports'),
  ('branch.manage','admin'),('users.manage','admin'),('telegram.manage','admin'),
  ('settings.manage','admin'),('audit.view','admin'),
  ('month.close','finance'),('month.reopen','finance')
on conflict (code) do nothing;

-- Owner + Admin: everything
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id from public.roles r cross join public.permissions p
where r.code in ('owner','admin')
on conflict do nothing;

-- Manager: day-to-day branch operations (adjust to your policy)
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id from public.roles r join public.permissions p on p.code in (
  'dashboard.view','staff.view','staff.create','staff.edit',
  'attendance.view','attendance.manage',
  'revenue.view','revenue.create','expense.view','expense.create',
  'inventory.view','inventory.manage','reports.view')
where r.code = 'manager'
on conflict do nothing;

-- Staff: minimal
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id from public.roles r join public.permissions p on p.code in ('attendance.view')
where r.code = 'staff'
on conflict do nothing;

-- ---------- RLS ----------
alter table public.branches         enable row level security;
alter table public.roles            enable row level security;
alter table public.permissions      enable row level security;
alter table public.role_permissions enable row level security;
alter table public.profiles         enable row level security;
alter table public.user_branches    enable row level security;

-- branches
create policy branches_select on public.branches for select to authenticated
  using (public.can_access_branch(id));
create policy branches_write on public.branches for all to authenticated
  using (public.has_permission('branch.manage'))
  with check (public.has_permission('branch.manage'));

-- roles / permissions: readable by signed-in users, changed only by users.manage
create policy roles_select on public.roles for select to authenticated using (true);
create policy roles_write on public.roles for all to authenticated
  using (public.has_permission('users.manage')) with check (public.has_permission('users.manage'));

create policy permissions_select on public.permissions for select to authenticated using (true);

create policy role_permissions_select on public.role_permissions for select to authenticated using (true);
create policy role_permissions_write on public.role_permissions for all to authenticated
  using (public.has_permission('users.manage')) with check (public.has_permission('users.manage'));

-- profiles: see your own, or all if users.manage. Only users.manage can change role/status
-- (prevents a user promoting themselves).
create policy profiles_select on public.profiles for select to authenticated
  using (id = auth.uid() or public.has_permission('users.manage'));
create policy profiles_write on public.profiles for all to authenticated
  using (public.has_permission('users.manage')) with check (public.has_permission('users.manage'));

-- user_branches
create policy user_branches_select on public.user_branches for select to authenticated
  using (user_id = auth.uid() or public.has_permission('users.manage'));
create policy user_branches_write on public.user_branches for all to authenticated
  using (public.has_permission('users.manage')) with check (public.has_permission('users.manage'));

-- ---------- TEMPLATE for every branch-scoped table added later (do not run as-is) ----------
-- alter table public.<table> enable row level security;
-- create policy <table>_select on public.<table> for select to authenticated
--   using (public.can_access_branch(branch_id) and public.has_permission('<module>.view'));
-- create policy <table>_insert on public.<table> for insert to authenticated
--   with check (public.can_access_branch(branch_id) and public.has_permission('<module>.create'));
-- Updates/voids: use RPC functions that also check month-closed status and write audit_logs.

commit;
