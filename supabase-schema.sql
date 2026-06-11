-- webapp-template Supabase Schema (v2)
-- Run this in the Supabase SQL Editor. Safe to re-run, and safe to run
-- on top of v1 (it drops the old policies first).

-- 1) Roles table
create table if not exists public.app_roles (
  user_id    uuid references auth.users(id) on delete cascade primary key,
  role       text not null default 'viewer' check (role in ('admin', 'manager', 'viewer')),
  name       text,
  email      text,
  created_at timestamptz default now()
);

alter table public.app_roles enable row level security;

-- 2) Helper functions
-- SECURITY DEFINER lets these read app_roles WITHOUT re-triggering RLS.
-- (v1 policies queried app_roles inside policies ON app_roles -> infinite
-- recursion, error 42P17, which broke every select on this table.)
-- search_path = '' blocks search-path hijacking; all names are schema-qualified.
create or replace function public.is_admin()
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.app_roles
    where user_id = (select auth.uid()) and role = 'admin'
  );
$$;

create or replace function public.is_admin_or_manager()
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.app_roles
    where user_id = (select auth.uid()) and role in ('admin', 'manager')
  );
$$;

revoke execute on function public.is_admin() from anon, public;
revoke execute on function public.is_admin_or_manager() from anon, public;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_admin_or_manager() to authenticated;

-- 3) New-user trigger
-- Creates the viewer row server-side at signup. The browser never inserts,
-- so there is no way to self-assign a role with the anon key.
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer
set search_path = ''
as $$
begin
  insert into public.app_roles (user_id, role, name, email)
  values (
    new.id,
    'viewer',
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.email
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 4) Policies (non-recursive)
drop policy if exists "users_read_own_role"            on public.app_roles;
drop policy if exists "admins_read_all_roles"          on public.app_roles;
drop policy if exists "users_insert_own_role"          on public.app_roles;
drop policy if exists "admins_update_roles"            on public.app_roles;
drop policy if exists "admins_delete_roles"            on public.app_roles;
drop policy if exists "admins_managers_read_all_roles" on public.app_roles;

-- (select ...) wrappers let Postgres cache the result per-statement instead of
-- per-row (Supabase RLS performance guidance).
create policy "users_read_own_role" on public.app_roles
  for select using ((select auth.uid()) = user_id);

create policy "admins_managers_read_all_roles" on public.app_roles
  for select using ((select public.is_admin_or_manager()));

-- NO insert policy on purpose: rows are only ever created by the trigger above.

create policy "admins_update_roles" on public.app_roles
  for update
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "admins_delete_roles" on public.app_roles
  for delete using ((select public.is_admin()));

-- 5) Belt-and-braces grants
-- RLS already blocks these, but removing the privilege entirely costs nothing.
revoke all on table public.app_roles from anon;
revoke insert on table public.app_roles from authenticated;

-- 6) Backfill (no-op on fresh projects; fixes v1 installs)
insert into public.app_roles (user_id, role, name, email)
select id, 'viewer',
       coalesce(raw_user_meta_data ->> 'full_name', raw_user_meta_data ->> 'name'),
       email
from auth.users
on conflict (user_id) do nothing;

update public.app_roles r
set name  = coalesce(r.name,  u.raw_user_meta_data ->> 'full_name', u.raw_user_meta_data ->> 'name'),
    email = coalesce(r.email, u.email)
from auth.users u
where u.id = r.user_id and (r.name is null or r.email is null);
