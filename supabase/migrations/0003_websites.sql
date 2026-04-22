-- =====================================================================
-- Portfolio ROI — Websites showcase
-- =====================================================================
-- Table to store client websites displayed in the phone mockup carousel
-- on the public homepage.
-- =====================================================================

create table if not exists public.websites (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  title text not null,
  activity text,
  sort_order integer not null default 0,
  case_study_id uuid references public.case_studies(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists websites_sort_idx on public.websites (sort_order);

drop trigger if exists websites_touch_updated_at on public.websites;
create trigger websites_touch_updated_at
  before update on public.websites
  for each row execute function public.touch_updated_at();

alter table public.websites enable row level security;

drop policy if exists "websites public read" on public.websites;
drop policy if exists "websites staff write" on public.websites;

create policy "websites public read"
  on public.websites for select
  using (true);

create policy "websites staff write"
  on public.websites for all
  using (public.is_staff())
  with check (public.is_staff());
