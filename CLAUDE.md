# CLAUDE.md — Portfolio Business orienté ROI

Ce fichier guide Claude Code dans le développement de ce projet.

---

## 1. Vision

Portfolio commercial orienté performance, conçu comme un **outil de vente** pour répondre à la question :

> "Est-ce que travailler avec nous va me faire gagner de l'argent ?"

**Ce site n'est PAS** : un site vitrine, une galerie, un site esthétique.

**Ce site EST** :
- une bibliothèque d'études de cas business
- un outil de closing utilisable en rendez-vous client
- une démonstration de capacité à générer du ROI

---

## 2. Objectifs business

- Augmenter le taux de conversion des prospects
- Démontrer une capacité à générer du chiffre d'affaires
- Faciliter les rendez-vous commerciaux
- Permettre un usage direct en call client
- Être duplicable pour une logique de franchise

---

## 3. Stack technique (OBLIGATOIRE)

### Frontend
- **Next.js 16** (App Router, Turbopack)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4** (CSS-first config via `@theme inline`)
- **shadcn/ui**
- **Framer Motion** (animations)

### Backend / Database
- **Supabase** (PostgreSQL)
- **Supabase Auth**
- **Supabase Storage** (images / vidéos)

### Déploiement
- **Vercel**

---

## 4. Structure du site public

Ordre stratégique des sections (UX de conversion) :

1. **Hero** — promesse forte
2. **Résultats globaux** — crédibilité + effet de masse
3. **Études de cas** — SECTION PRINCIPALE
4. **Réalisations visuelles** — support secondaire
5. **Services** — rappel
6. **CTA final** — closing

---

## 5. Études de cas — Structure obligatoire

Chaque étude de cas doit démontrer : **problème → stratégie → exécution → résultats → ROI**.

Structure complète par étude de cas :

1. **Présentation client** — secteur, situation initiale, problématique
2. **Objectif business** — leads, CA, créneaux, coût d'acquisition
3. **Stratégie** (section clé, visuellement dominante) — angle marketing, positionnement, offre, tunnel, ciblage
4. **Exécution**
   - Publicités (images, vidéos, copies)
   - Contenus (TikTok / Reels / UGC / shooting)
   - Tunnel (landing page, formulaire, WhatsApp, call)
5. **Résultats** (ultra important)
   - Chiffres : leads, CPL, clients, CA, ROAS
   - Preuves : captures ads, stats, CRM, formulaires
6. **ROI** (différenciateur majeur) — bloc dédié : budget ads / CA généré / ROI (ex: x8.5)
7. **Avant / Après** — trafic, CA, visibilité
8. **Conclusion** — impact business, bénéfice client

### Contraintes UX des études de cas

- Rapide à lire (compréhensible en 30 secondes)
- Visuel et structuré
- Pattern recommandé : carte projet → clic → page détaillée
- Filtres obligatoires : **secteur**, **type de service**, **type de résultat**

---

## 6. Design System

### Style
- SaaS premium, épuré, moderne

### Typographie
- **Inter**

### Couleurs
```
--primary:   #5694bd
--secondary: #3e6493
--accent:    #2a2e5e
```

### Animations (Framer Motion)
- fade-in
- slide-up
- transitions fluides
- parallax léger
- hover interactions
- **jamais brutales**

### À éviter
- trop de texte
- jargon marketing
- absence de chiffres
- absence de preuves
- effets visuels gratuits qui nuisent au message

---

## 7. Différenciation

> Un portfolio classique montre **"ce qu'on a fait"**.
> Ce portfolio montre **"combien ça a rapporté"**.

Chaque décision UX/design doit servir cette promesse.

---

## 8. Admin Dashboard

Le back-office doit permettre à l'équipe de gérer tout le contenu **sans toucher au code**.

### Capacités requises
- CRUD études de cas (créer, modifier, archiver, dupliquer, publier/dépublier)
- Upload images, vidéos, preuves (drag & drop)
- Gérer secteurs, services, résultats globaux
- Gérer le branding franchisé

### Routes

| Route | Fonction |
|-------|----------|
| `/admin/login` | Connexion Supabase Auth |
| `/admin` | Dashboard (widgets : total cas, leads, CA cumulé, ROI moyen) |
| `/admin/case-studies` | Liste + filtres + actions |
| `/admin/case-studies/new` | Création |
| `/admin/case-studies/[id]` | Édition |
| `/admin/sectors` | Gestion secteurs |
| `/admin/services` | Gestion services |
| `/admin/global-stats` | Chiffres globaux du site |
| `/admin/franchise-branding` | Branding duplicable |

### UX admin
- Sidebar fixe
- Header avec recherche
- Formulaires en sections claires
- Autosave ou bouton save visible
- Preview avant publication
- Upload drag & drop
- Tableaux filtrables
- Simple, rapide, premium, responsive

### Formulaire étude de cas — blocs

1. Informations générales (nom, slug, client, secteur, logo, cover, statut)
2. Présentation initiale (situation, problématique, objectif)
3. Stratégie (angle, positionnement, offre, tunnel, ciblage, retargeting)
4. Exécution (contenus, ads, pages, WhatsApp/call/landing)
5. Résultats (leads, CPL, clients, CA, ROAS, budget, ROI)
6. Avant / Après (trafic, CA, visibilité)
7. Preuves (captures ads, CRM, formulaires, stats, témoignage)
8. Médias (galerie images, vidéos ads, UGC, créatifs)
9. Conclusion (impact, bénéfice, closing)

---

## 9. Schéma Supabase

### `profiles`
- `id` (uuid, lié à `auth.users`), `full_name`, `email`, `role`, `created_at`
- Rôles : `super_admin` | `admin` | `editor`

### `sectors`
- `id`, `name`, `slug`, `created_at`

### `services`
- `id`, `name`, `slug`, `created_at`

### `case_studies`
- `id`, `slug`, `project_name`, `client_name`, `sector_id`
- `short_problem`, `initial_situation`, `business_goal`
- `strategy_angle`, `positioning`, `offer_details`, `funnel_details`, `targeting_details`
- `execution_details`
- `leads_count`, `cost_per_lead`, `clients_count`, `revenue_generated`, `roas`, `ad_budget`, `roi`
- `traffic_before`, `traffic_after`, `revenue_before`, `revenue_after`, `visibility_before`, `visibility_after`
- `conclusion`, `testimonial`
- `cover_image_url`, `client_logo_url`
- `status` (`draft` | `published` | `archived`)
- `created_by`, `created_at`, `updated_at`

### `case_study_services` (pivot)
- `id`, `case_study_id`, `service_id`

### `case_study_media`
- `id`, `case_study_id`, `media_type`, `file_url`, `title`, `description`, `sort_order`, `created_at`
- `media_type` : `image` | `video` | `screenshot` | `proof` | `ad_creative` | `ugc`

### `case_study_proofs`
- `id`, `case_study_id`, `proof_type`, `title`, `file_url`, `note`, `created_at`
- `proof_type` : `ads_manager` | `crm` | `lead_form` | `analytics` | `testimonial`

### `global_stats`
- `id`, `total_views`, `total_leads`, `total_clients`, `average_roas`, `total_revenue`, `updated_at`

### `franchise_settings`
- `id`, `franchise_name`, `logo_url`
- `primary_color`, `secondary_color`, `accent_color`
- `email`, `phone`, `whatsapp_url`, `address`, `cta_text`
- `created_at`, `updated_at`

---

## 10. Supabase Storage

Buckets à créer :

| Bucket | Contenu |
|--------|---------|
| `case-study-images` | covers, screenshots, proofs, branding visuals |
| `case-study-videos` | ads videos, UGC, reels, case videos |
| `logos` | logos clients, logos franchisés |

---

## 11. Règles d'accès (RLS)

- **Public (non authentifié)** : lecture des `case_studies` avec `status = 'published'` uniquement, plus `global_stats`, `franchise_settings`, `sectors`, `services`, et médias liés aux cas publiés
- **`editor`** : création et édition du contenu, pas de suppression critique
- **`admin`** : gestion complète du contenu
- **`super_admin`** : accès complet incluant gestion des profils

Toutes les tables doivent avoir RLS activée. Aucune donnée admin exposée côté public.

---

## 12. Franchisation

Le site doit être **duplicable**. La table `franchise_settings` permet de modifier sans toucher au code :
- logo, nom commercial
- couleurs (primary, secondary, accent)
- coordonnées (téléphone, email, WhatsApp, adresse)
- CTA texte

La structure des études de cas reste identique entre franchisés.

---

## 13. Usage en rendez-vous client

Workflow à optimiser :
1. Filtrer par secteur
2. Afficher un cas similaire au prospect
3. Montrer : stratégie → résultats → ROI
4. Effet : crédibilité immédiate, déclencheur de closing

L'UX doit rendre ce flow **rapide en direct devant un client**.

---

## 14. Conventions de code

- **TypeScript strict** partout
- **Server Components** par défaut ; `"use client"` seulement quand nécessaire (interactivité, hooks, Framer Motion)
- Composants shadcn/ui dans `components/ui/`
- Composants métier dans `components/`
- Accès Supabase côté serveur via server actions / route handlers quand possible
- Variables d'env dans `.env.local` (jamais commitées)
- Alias d'import `@/*` pour la racine `src/`

### Arborescence cible
```
src/
  app/
    (public)/          # site public
    admin/             # dashboard admin
    api/               # route handlers
  components/
    ui/                # shadcn
    case-study/
    admin/
  lib/
    supabase/          # clients (server, browser, admin)
    utils.ts
  types/
    database.ts        # types générés Supabase
```

---

## 15. Checklist avant d'implémenter une feature

- [ ] Sert-elle la promesse "combien ça a rapporté" ?
- [ ] Est-elle lisible en 30 secondes ?
- [ ] Présente-t-elle des chiffres ou des preuves ?
- [ ] Respecte-t-elle le design system (Inter, palette, animations douces) ?
- [ ] Les permissions RLS sont-elles cohérentes ?
- [ ] Est-elle duplicable pour un franchisé ?
