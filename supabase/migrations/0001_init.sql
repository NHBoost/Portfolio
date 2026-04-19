-- =====================================================================
-- Portfolio ROI — Initial schema
-- =====================================================================
-- Creates all core tables, enums, RLS policies and helper functions.
-- Idempotent where possible (IF NOT EXISTS / DROP POLICY IF EXISTS).
-- =====================================================================

-- ---------- Extensions ----------
create extension if not exists "pgcrypto";

-- ---------- Enums ----------
do $$ begin
  create type user_role as enum ('super_admin', 'admin', 'editor');
exception when duplicate_object then null; end $$;

do $$ begin
  create type case_study_status as enum ('draft', 'published', 'archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type media_type as enum ('image', 'video', 'screenshot', 'proof', 'ad_creative', 'ugc');
exception when duplicate_object then null; end $$;

do $$ begin
  create type proof_type as enum ('ads_manager', 'crm', 'lead_form', 'analytics', 'testimonial');
exception when duplicate_object then null; end $$;

-- =====================================================================
-- Tables
-- =====================================================================

-- ---------- profiles ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  role user_role not null default 'editor',
  created_at timestamptz not null default now()
);

-- ---------- sectors ----------
create table if not exists public.sectors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

-- ---------- services ----------
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

-- ---------- case_studies ----------
create table if not exists public.case_studies (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  project_name text not null,
  client_name text,
  sector_id uuid references public.sectors(id) on delete set null,

  short_problem text,
  initial_situation text,
  business_goal text,

  strategy_angle text,
  positioning text,
  offer_details text,
  funnel_details text,
  targeting_details text,
  execution_details text,

  leads_count integer,
  cost_per_lead numeric(12, 2),
  clients_count integer,
  revenue_generated numeric(14, 2),
  roas numeric(8, 2),
  ad_budget numeric(14, 2),
  roi numeric(8, 2),

  traffic_before text,
  traffic_after text,
  revenue_before text,
  revenue_after text,
  visibility_before text,
  visibility_after text,

  conclusion text,
  testimonial text,

  cover_image_url text,
  client_logo_url text,

  status case_study_status not null default 'draft',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists case_studies_status_idx on public.case_studies (status);
create index if not exists case_studies_sector_idx on public.case_studies (sector_id);
create index if not exists case_studies_created_at_idx on public.case_studies (created_at desc);

-- ---------- case_study_services (pivot) ----------
create table if not exists public.case_study_services (
  id uuid primary key default gen_random_uuid(),
  case_study_id uuid not null references public.case_studies(id) on delete cascade,
  service_id uuid not null references public.services(id) on delete cascade,
  unique (case_study_id, service_id)
);

-- ---------- case_study_media ----------
create table if not exists public.case_study_media (
  id uuid primary key default gen_random_uuid(),
  case_study_id uuid not null references public.case_studies(id) on delete cascade,
  media_type media_type not null,
  file_url text not null,
  title text,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists case_study_media_case_idx on public.case_study_media (case_study_id, sort_order);

-- ---------- case_study_proofs ----------
create table if not exists public.case_study_proofs (
  id uuid primary key default gen_random_uuid(),
  case_study_id uuid not null references public.case_studies(id) on delete cascade,
  proof_type proof_type not null,
  title text,
  file_url text,
  note text,
  created_at timestamptz not null default now()
);

create index if not exists case_study_proofs_case_idx on public.case_study_proofs (case_study_id);

-- ---------- global_stats (singleton row) ----------
create table if not exists public.global_stats (
  id uuid primary key default gen_random_uuid(),
  total_views bigint not null default 0,
  total_leads bigint not null default 0,
  total_clients bigint not null default 0,
  average_roas numeric(8, 2) not null default 0,
  total_revenue numeric(14, 2) not null default 0,
  updated_at timestamptz not null default now()
);

-- ---------- franchise_settings (singleton row) ----------
create table if not exists public.franchise_settings (
  id uuid primary key default gen_random_uuid(),
  franchise_name text not null default 'Portfolio ROI',
  logo_url text,
  primary_color text not null default '#5694bd',
  secondary_color text not null default '#3e6493',
  accent_color text not null default '#2a2e5e',
  email text,
  phone text,
  whatsapp_url text,
  address text,
  cta_text text default 'Prendre rendez-vous',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =====================================================================
-- Triggers: auto-update updated_at
-- =====================================================================
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists case_studies_touch_updated_at on public.case_studies;
create trigger case_studies_touch_updated_at
  before update on public.case_studies
  for each row execute function public.touch_updated_at();

drop trigger if exists franchise_settings_touch_updated_at on public.franchise_settings;
create trigger franchise_settings_touch_updated_at
  before update on public.franchise_settings
  for each row execute function public.touch_updated_at();

drop trigger if exists global_stats_touch_updated_at on public.global_stats;
create trigger global_stats_touch_updated_at
  before update on public.global_stats
  for each row execute function public.touch_updated_at();

-- =====================================================================
-- Auto-create profile on auth.users insert
-- =====================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    'editor'
  )
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =====================================================================
-- Role helper functions (security definer, avoid RLS recursion)
-- =====================================================================
create or replace function public.current_user_role()
returns user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role in ('super_admin', 'admin', 'editor')
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role in ('super_admin', 'admin')
  );
$$;

-- =====================================================================
-- RLS
-- =====================================================================
alter table public.profiles            enable row level security;
alter table public.sectors             enable row level security;
alter table public.services            enable row level security;
alter table public.case_studies        enable row level security;
alter table public.case_study_services enable row level security;
alter table public.case_study_media    enable row level security;
alter table public.case_study_proofs   enable row level security;
alter table public.global_stats        enable row level security;
alter table public.franchise_settings  enable row level security;

-- ---------- profiles ----------
drop policy if exists "profiles self read"       on public.profiles;
drop policy if exists "profiles admin read all"  on public.profiles;
drop policy if exists "profiles admin manage"    on public.profiles;
drop policy if exists "profiles self update"     on public.profiles;

create policy "profiles self read"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles admin read all"
  on public.profiles for select
  using (public.is_admin());

create policy "profiles self update"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id and role = public.current_user_role());

create policy "profiles admin manage"
  on public.profiles for all
  using (public.is_admin())
  with check (public.is_admin());

-- ---------- sectors ----------
drop policy if exists "sectors public read" on public.sectors;
drop policy if exists "sectors staff write" on public.sectors;

create policy "sectors public read"
  on public.sectors for select
  using (true);

create policy "sectors staff write"
  on public.sectors for all
  using (public.is_staff())
  with check (public.is_staff());

-- ---------- services ----------
drop policy if exists "services public read" on public.services;
drop policy if exists "services staff write" on public.services;

create policy "services public read"
  on public.services for select
  using (true);

create policy "services staff write"
  on public.services for all
  using (public.is_staff())
  with check (public.is_staff());

-- ---------- case_studies ----------
drop policy if exists "case_studies public read"   on public.case_studies;
drop policy if exists "case_studies staff read"    on public.case_studies;
drop policy if exists "case_studies staff insert"  on public.case_studies;
drop policy if exists "case_studies staff update"  on public.case_studies;
drop policy if exists "case_studies admin delete"  on public.case_studies;

create policy "case_studies public read"
  on public.case_studies for select
  using (status = 'published');

create policy "case_studies staff read"
  on public.case_studies for select
  using (public.is_staff());

create policy "case_studies staff insert"
  on public.case_studies for insert
  with check (public.is_staff());

create policy "case_studies staff update"
  on public.case_studies for update
  using (public.is_staff())
  with check (public.is_staff());

create policy "case_studies admin delete"
  on public.case_studies for delete
  using (public.is_admin());

-- ---------- case_study_services ----------
drop policy if exists "cs_services public read"  on public.case_study_services;
drop policy if exists "cs_services staff write"  on public.case_study_services;

create policy "cs_services public read"
  on public.case_study_services for select
  using (
    exists (
      select 1 from public.case_studies cs
      where cs.id = case_study_services.case_study_id
        and cs.status = 'published'
    )
  );

create policy "cs_services staff write"
  on public.case_study_services for all
  using (public.is_staff())
  with check (public.is_staff());

-- ---------- case_study_media ----------
drop policy if exists "cs_media public read"  on public.case_study_media;
drop policy if exists "cs_media staff write"  on public.case_study_media;

create policy "cs_media public read"
  on public.case_study_media for select
  using (
    exists (
      select 1 from public.case_studies cs
      where cs.id = case_study_media.case_study_id
        and cs.status = 'published'
    )
  );

create policy "cs_media staff write"
  on public.case_study_media for all
  using (public.is_staff())
  with check (public.is_staff());

-- ---------- case_study_proofs ----------
drop policy if exists "cs_proofs public read"  on public.case_study_proofs;
drop policy if exists "cs_proofs staff write"  on public.case_study_proofs;

create policy "cs_proofs public read"
  on public.case_study_proofs for select
  using (
    exists (
      select 1 from public.case_studies cs
      where cs.id = case_study_proofs.case_study_id
        and cs.status = 'published'
    )
  );

create policy "cs_proofs staff write"
  on public.case_study_proofs for all
  using (public.is_staff())
  with check (public.is_staff());

-- ---------- global_stats ----------
drop policy if exists "global_stats public read" on public.global_stats;
drop policy if exists "global_stats staff write" on public.global_stats;

create policy "global_stats public read"
  on public.global_stats for select
  using (true);

create policy "global_stats staff write"
  on public.global_stats for all
  using (public.is_staff())
  with check (public.is_staff());

-- ---------- franchise_settings ----------
drop policy if exists "franchise_settings public read" on public.franchise_settings;
drop policy if exists "franchise_settings admin write" on public.franchise_settings;

create policy "franchise_settings public read"
  on public.franchise_settings for select
  using (true);

create policy "franchise_settings admin write"
  on public.franchise_settings for all
  using (public.is_admin())
  with check (public.is_admin());
