-- webapp-template Supabase Schema
-- Run this in the Supabase SQL Editor before deploying.

-- User roles table
create table if not exists app_roles (
  user_id  uuid references auth.users(id) on delete cascade primary key,
  role     text not null default 'viewer' check (role in ('admin', 'manager', 'viewer')),
  name     text,
  email    text,
  created_at timestamptz default now()
);

-- RLS
alter table app_roles enable row level security;

-- Users can read their own role
create policy "users_read_own_role" on app_roles
  for select using (auth.uid() = user_id);

-- Admins can read all roles
create policy "admins_read_all_roles" on app_roles
  for select using (
    exists (select 1 from app_roles where user_id = auth.uid() and role = 'admin')
  );

-- Users can insert their own role (first login auto-create)
create policy "users_insert_own_role" on app_roles
  for insert with check (auth.uid() = user_id);

-- Admins can update any role
create policy "admins_update_roles" on app_roles
  for update using (
    exists (select 1 from app_roles where user_id = auth.uid() and role = 'admin')
  );

-- Admins can delete roles
create policy "admins_delete_roles" on app_roles
  for delete using (
    exists (select 1 from app_roles where user_id = auth.uid() and role = 'admin')
  );
