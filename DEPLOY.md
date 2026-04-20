# Déploiement — Portfolio ROI

## Variables d'environnement (Vercel)

Toutes les variables doivent être renseignées pour **Production**, **Preview** et **Development**.

| Clé | Source | Rôle |
|-----|--------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API → Project URL | Client browser + server |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API → `anon public` | Client browser + server |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → `service_role` | Server-only (sitemap, admin actions) — **ne jamais exposer côté client** |
| `NEXT_PUBLIC_SITE_URL` | URL canonique (ex: `https://portfolio-roi.vercel.app`) | `metadataBase`, sitemap, robots |

## Étapes

1. **Importer le repo** sur Vercel → New Project → sélectionner `NHBoost/Portfolio`
2. **Framework preset** : Next.js (auto-détecté)
3. **Build command** : `next build` (auto)
4. **Output directory** : `.next` (auto)
5. **Environment variables** : coller les 4 variables ci-dessus
6. **Deploy**
7. Configurer un **domaine custom** si voulu : Project → Settings → Domains

## Post-deploy — vérifications

- [ ] `/` charge avec les stats réelles
- [ ] `/etudes-de-cas` liste les études publiées (3 seedées)
- [ ] `/etudes-de-cas/horizon-immobilier-lancement` charge le détail
- [ ] `/admin/login` redirige vers `/admin` après login (`nhboostpro@gmail.com` / `1234567` → **changer le mot de passe**)
- [ ] Création d'une étude depuis l'admin, publication, visible côté public
- [ ] Upload d'un media fonctionne (upload → bucket Supabase → preview dans l'admin)
- [ ] `/sitemap.xml` liste les URLs publiées
- [ ] `/robots.txt` disallow `/admin`
- [ ] `/opengraph-image` renvoie une PNG 1200×630 valide
- [ ] Lighthouse home ≥ 90 sur Performance / Accessibility / Best Practices / SEO

## Rotation des secrets

Le `service_role` est sensible (bypass RLS). Après le premier déploiement et si le token a fuité ailleurs :

1. Supabase → Settings → API → **Generate new service_role key**
2. Mettre à jour la variable dans Vercel
3. Redeploy

## Migrations SQL

Les migrations sont dans `supabase/migrations/`. Pour appliquer une nouvelle migration sur la prod Supabase :

```bash
SUPABASE_ACCESS_TOKEN=sbp_xxx SUPABASE_PROJECT_REF=qbvjkhbsyfezgypeibbo \
  node scripts/apply-migrations.mjs supabase/migrations/000X_xxx.sql
```

Ou via le SQL Editor Supabase (paste + Run).

Puis régénérer les types TS :

```bash
SUPABASE_ACCESS_TOKEN=sbp_xxx npm run db:types
```
