-- =====================================================================
-- Portfolio ROI — Storage buckets + policies
-- =====================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('case-study-images', 'case-study-images', true,  10485760,
   array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']),
  ('case-study-videos', 'case-study-videos', true, 524288000,
   array['video/mp4', 'video/quicktime', 'video/webm']),
  ('logos',             'logos',             true,   5242880,
   array['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'])
on conflict (id) do nothing;

-- =====================================================================
-- Storage policies
-- Public read (buckets are already marked public, but we add explicit
-- SELECT policies to be safe). Staff can upload / update / delete.
-- =====================================================================
drop policy if exists "portfolio_public_read"  on storage.objects;
drop policy if exists "portfolio_staff_insert" on storage.objects;
drop policy if exists "portfolio_staff_update" on storage.objects;
drop policy if exists "portfolio_staff_delete" on storage.objects;

create policy "portfolio_public_read"
  on storage.objects for select
  using (bucket_id in ('case-study-images', 'case-study-videos', 'logos'));

create policy "portfolio_staff_insert"
  on storage.objects for insert
  with check (
    bucket_id in ('case-study-images', 'case-study-videos', 'logos')
    and public.is_staff()
  );

create policy "portfolio_staff_update"
  on storage.objects for update
  using (
    bucket_id in ('case-study-images', 'case-study-videos', 'logos')
    and public.is_staff()
  )
  with check (
    bucket_id in ('case-study-images', 'case-study-videos', 'logos')
    and public.is_staff()
  );

create policy "portfolio_staff_delete"
  on storage.objects for delete
  using (
    bucket_id in ('case-study-images', 'case-study-videos', 'logos')
    and public.is_staff()
  );
