-- =====================================================================
-- Portfolio ROI — Realisations storage bucket (images, vidéos, audio)
-- =====================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'realisations',
  'realisations',
  true,
  524288000, -- 500 MB
  array[
    'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif',
    'video/mp4', 'video/quicktime', 'video/webm',
    'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav',
    'audio/m4a', 'audio/x-m4a', 'audio/mp4', 'audio/ogg', 'audio/webm'
  ]
)
on conflict (id) do nothing;

-- Ensure existing portfolio buckets also cover audio in case the user wants
-- to reuse them (safe to re-run: on conflict we just keep the current list)
update storage.buckets
set allowed_mime_types = array[
  'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'
]
where id = 'case-study-images';

update storage.buckets
set allowed_mime_types = array[
  'video/mp4', 'video/quicktime', 'video/webm'
]
where id = 'case-study-videos';

-- Rebuild unified storage policies to include the new bucket
drop policy if exists "portfolio_public_read"  on storage.objects;
drop policy if exists "portfolio_staff_insert" on storage.objects;
drop policy if exists "portfolio_staff_update" on storage.objects;
drop policy if exists "portfolio_staff_delete" on storage.objects;

create policy "portfolio_public_read"
  on storage.objects for select
  using (bucket_id in ('case-study-images', 'case-study-videos', 'logos', 'realisations'));

create policy "portfolio_staff_insert"
  on storage.objects for insert
  with check (
    bucket_id in ('case-study-images', 'case-study-videos', 'logos', 'realisations')
    and public.is_staff()
  );

create policy "portfolio_staff_update"
  on storage.objects for update
  using (
    bucket_id in ('case-study-images', 'case-study-videos', 'logos', 'realisations')
    and public.is_staff()
  )
  with check (
    bucket_id in ('case-study-images', 'case-study-videos', 'logos', 'realisations')
    and public.is_staff()
  );

create policy "portfolio_staff_delete"
  on storage.objects for delete
  using (
    bucket_id in ('case-study-images', 'case-study-videos', 'logos', 'realisations')
    and public.is_staff()
  );
