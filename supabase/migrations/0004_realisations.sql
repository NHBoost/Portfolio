-- =====================================================================
-- Portfolio ROI — Realisations (ads, vidéos clients, social, podcasts)
-- =====================================================================

do $$ begin
  create type realisation_type as enum ('ads', 'video', 'social', 'podcast');
exception when duplicate_object then null; end $$;

create table if not exists public.realisations (
  id uuid primary key default gen_random_uuid(),
  type realisation_type not null,
  title text,
  description text,
  media_url text,
  thumbnail_url text,
  external_url text,
  client_name text,
  sort_order integer not null default 0,
  case_study_id uuid references public.case_studies(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists realisations_type_sort_idx
  on public.realisations (type, sort_order);

drop trigger if exists realisations_touch_updated_at on public.realisations;
create trigger realisations_touch_updated_at
  before update on public.realisations
  for each row execute function public.touch_updated_at();

alter table public.realisations enable row level security;

drop policy if exists "realisations public read" on public.realisations;
drop policy if exists "realisations staff write" on public.realisations;

create policy "realisations public read"
  on public.realisations for select
  using (true);

create policy "realisations staff write"
  on public.realisations for all
  using (public.is_staff())
  with check (public.is_staff());
