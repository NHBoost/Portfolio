-- =====================================================================
-- Portfolio ROI — Seed data
-- =====================================================================
-- Base values for sectors, services, global_stats, franchise_settings.
-- Idempotent (ON CONFLICT DO NOTHING).
-- =====================================================================

-- ---------- Sectors ----------
insert into public.sectors (name, slug) values
  ('Restaurant',    'restaurant'),
  ('Beaute',        'beaute'),
  ('Immobilier',    'immobilier'),
  ('Construction',  'construction'),
  ('Medical',       'medical'),
  ('E-commerce',    'ecommerce')
on conflict (slug) do nothing;

-- ---------- Services ----------
insert into public.services (name, slug) values
  ('Meta Ads',              'meta-ads'),
  ('Creation de contenu',   'creation-contenu'),
  ('Site web',              'site-web'),
  ('Funnel',                'funnel'),
  ('SEO',                   'seo'),
  ('Branding',              'branding')
on conflict (slug) do nothing;

-- ---------- global_stats (singleton) ----------
insert into public.global_stats (total_views, total_leads, total_clients, average_roas, total_revenue)
select 0, 0, 0, 0, 0
where not exists (select 1 from public.global_stats);

-- ---------- franchise_settings (singleton) ----------
insert into public.franchise_settings (franchise_name, primary_color, secondary_color, accent_color, cta_text)
select 'Portfolio ROI', '#5694bd', '#3e6493', '#2a2e5e', 'Prendre rendez-vous'
where not exists (select 1 from public.franchise_settings);
