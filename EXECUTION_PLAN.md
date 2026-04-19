# PLAN D'EXÉCUTION — Portfolio Business ROI

Plan séquentiel pour construire le projet de zéro jusqu'à la mise en production. Chaque phase livre un incrément testable.

---

## Phase 0 — Préparation (1 jour)

**Objectif** : poser les fondations avant toute ligne de code produit.

1. **Créer le projet Supabase**
   - Nouveau projet sur supabase.com
   - Récupérer : `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
2. **Créer le repo Git** + push initial
3. **Initialiser Next.js 14**
   ```bash
   npx create-next-app@latest . --typescript --tailwind --app --src-dir --import-alias "@/*"
   ```
4. **Installer les dépendances de base**
   - `@supabase/supabase-js`, `@supabase/ssr`
   - `framer-motion`
   - `lucide-react`
   - `zod`, `react-hook-form`, `@hookform/resolvers`
5. **Initialiser shadcn/ui**
   ```bash
   npx shadcn@latest init
   ```
6. **Configurer `.env.local`** avec les clés Supabase
7. **Créer les clients Supabase** dans `src/lib/supabase/` (server, browser, admin)
8. **Configurer Tailwind** : ajouter la palette `#5694bd`, `#3e6493`, `#2a2e5e` et la font Inter

**Livrable** : app Next.js qui démarre, connectée à Supabase, shadcn prêt.

---

## Phase 1 — Base de données (1 jour)

**Objectif** : schéma complet + RLS + types générés.

1. **Créer les tables via SQL migration** (`supabase/migrations/0001_init.sql`)
   - `profiles`, `sectors`, `services`
   - `case_studies`, `case_study_services`
   - `case_study_media`, `case_study_proofs`
   - `global_stats`, `franchise_settings`
2. **Créer les buckets Storage**
   - `case-study-images`, `case-study-videos`, `logos`
3. **Activer RLS sur toutes les tables**
4. **Policies** :
   - Public : lecture `case_studies` où `status = 'published'` + tables associées
   - `editor` / `admin` / `super_admin` : selon la matrice du CLAUDE.md
5. **Seed** : 1 secteur, 1 service, `global_stats` avec valeurs à zéro, `franchise_settings` par défaut
6. **Générer les types TypeScript**
   ```bash
   npx supabase gen types typescript --project-id <id> > src/types/database.ts
   ```

**Livrable** : DB prête, types TS dispos, policies testées.

---

## Phase 2 — Auth admin (0.5 jour)

**Objectif** : pouvoir se connecter au dashboard.

1. Créer un utilisateur admin via Supabase (dashboard → Auth → Invite)
2. Insérer son profil dans `profiles` avec `role = 'super_admin'`
3. Page `/admin/login` : formulaire email/password (shadcn `Form` + `Input`)
4. Middleware `src/middleware.ts` : protéger `/admin/*` (redirige vers login si non auth ou rôle insuffisant)
5. Layout `/admin/layout.tsx` : sidebar fixe + header avec user menu + logout

**Livrable** : login fonctionnel, routes `/admin` protégées.

---

## Phase 3 — Admin : CRUD études de cas (2-3 jours)

**Objectif** : pouvoir créer tout le contenu sans toucher au code. C'est la feature la plus critique.

### 3.1 Liste `/admin/case-studies`
- Table shadcn avec : nom, secteur, statut, budget, CA, ROI, date, actions
- Filtres : secteur, statut, service, résultat
- Actions : voir, modifier, dupliquer, supprimer, publier/dépublier

### 3.2 Formulaire `/admin/case-studies/new` et `/[id]`
Découpé en 9 blocs (tabs ou accordéons) conformes au CLAUDE.md :
1. Infos générales (nom, slug auto, client, secteur, logo, cover, statut)
2. Présentation initiale
3. Stratégie
4. Exécution
5. Résultats (leads, CPL, clients, CA, ROAS, budget, ROI — calcul auto du ROI à partir de budget + CA)
6. Avant / Après
7. Preuves (upload multiple, lié à `case_study_proofs`)
8. Médias (upload multiple avec `sort_order` drag & drop, lié à `case_study_media`)
9. Conclusion + témoignage

### 3.3 Server actions
- `createCaseStudy`, `updateCaseStudy`, `deleteCaseStudy`, `duplicateCaseStudy`, `togglePublish`
- Validation Zod côté serveur avant tout insert

### 3.4 Upload médias
- Composant `MediaUploader` (drag & drop, progress, preview)
- Écriture directe dans les buckets Supabase Storage
- Insertion ligne dans `case_study_media` / `case_study_proofs`

**Livrable** : une étude de cas peut être créée, modifiée, publiée, supprimée entièrement depuis le dashboard.

---

## Phase 4 — Admin : gestion des entités annexes (0.5 jour)

1. `/admin/sectors` — CRUD simple (table + modal création/édition)
2. `/admin/services` — CRUD simple
3. `/admin/global-stats` — formulaire des 5 chiffres globaux
4. `/admin/franchise-branding` — formulaire branding + preview couleurs

**Livrable** : tout le contenu du site est pilotable depuis l'admin.

---

## Phase 5 — Dashboard principal admin (0.5 jour)

Route `/admin` — widgets :
- Total études de cas (publiées / brouillons)
- Total leads affichés (somme `leads_count` sur cas publiés)
- CA cumulé
- ROI moyen
- Nombre de secteurs
- Derniers cas modifiés
- Bouton rapide "Créer une étude de cas"

**Livrable** : vue d'ensemble opérationnelle.

---

## Phase 6 — Site public : layout + hero + résultats globaux (1 jour)

1. Layout public (`src/app/(public)/layout.tsx`) : navbar + footer lisant `franchise_settings`
2. **Hero** : promesse forte orientée ROI, CTA principal, animation fade-in Framer Motion
3. **Résultats globaux** : bandeau avec les 5 chiffres de `global_stats`, animation compteur
4. CTA final réutilisable

**Livrable** : home avec hero + stats globales.

---

## Phase 7 — Site public : liste études de cas (1 jour)

Route `/` section cas + route dédiée `/etudes-de-cas` :
- Grille de **cartes projet** (cover, nom, secteur, ROI, CA badge, 1 chiffre clé)
- Filtres : secteur, type de service, type de résultat (querystring)
- Hover interactions, animation slide-up en entrée
- Rendu Server Component (ISR/revalidate court ou tag-based)

**Livrable** : liste filtrable des cas publiés.

---

## Phase 8 — Site public : page étude de cas détaillée (2 jours)

**La page la plus importante du site.** Route `/etudes-de-cas/[slug]`.

Sections dans l'ordre (voir CLAUDE.md §5) :
1. Hero de cas (cover + client + secteur + résumé)
2. Présentation client
3. Objectif business
4. **Stratégie** (visuellement dominant, layout différenciant)
5. Exécution (pub / contenus / tunnel — 3 sous-blocs)
6. **Résultats** (chiffres clés en gros, preuves visuelles)
7. **Bloc ROI** (budget / CA / ROI xN.N — grand, simple, visuel)
8. Avant / Après (tableau ou comparatif visuel)
9. Conclusion + témoignage
10. CTA final + cas similaires (2-3 cartes du même secteur)

**Contraintes à tenir** :
- Compréhensible en 30 secondes sur scroll rapide
- Chaque bloc a un chiffre ou une preuve visible
- Animations douces seulement (fade-in, slide-up)

**Livrable** : page de cas utilisable en rendez-vous client.

---

## Phase 9 — Site public : sections secondaires (0.5 jour)

1. **Réalisations visuelles** (galerie images/vidéos agrégée depuis `case_study_media` — support visuel, pas de texte)
2. **Services** — rappel des services proposés (depuis table `services`)
3. **CTA final** en bas de page avec WhatsApp / email / tel depuis `franchise_settings`

**Livrable** : home complète.

---

## Phase 10 — Polish design + animations (1 jour)

1. Passe typographique Inter (tailles, line-height, hiérarchie)
2. Palette appliquée uniformément
3. Framer Motion : fade-in, slide-up, parallax léger, hover cards
4. Vérifier : **jamais d'animation brutale**
5. Responsive mobile (la démo en rendez-vous peut se faire sur tablette/mobile)
6. États vides, états de chargement, skeletons
7. SEO basique (metadata, OG images par étude de cas)

**Livrable** : site premium, cohérent, fluide.

---

## Phase 11 — Qualité + performance (0.5 jour)

- Lighthouse ≥ 90 sur toutes les pages publiques
- Images via `next/image` + formats optimisés (bucket Supabase ou transformations)
- Lazy load vidéos
- Accessibilité : contraste, alt, navigation clavier
- Vérifier RLS en production (tester avec utilisateur non auth)

---

## Phase 12 — Déploiement (0.5 jour)

1. Projet Vercel connecté au repo
2. Variables d'env sur Vercel (Supabase URL / keys)
3. Domaine custom
4. Tester le flow complet en prod :
   - Admin login → créer cas → publier → visible côté public
   - Upload média → affichage correct
5. Vérifier les policies RLS en conditions réelles

**Livrable** : site en production.

---

## Phase 13 — Franchisation (extension, optionnel)

Une fois le site stable :
- Mécanisme de clonage : script qui duplique le schéma Supabase + seed `franchise_settings` pour un nouveau franchisé
- Documentation interne : "comment déployer une instance franchisée"

---

## Ordre de priorité si pressé

Si tu dois livrer vite, suis ce chemin minimal :
1. Phase 0 → 1 → 2
2. Phase 3 (CRUD études de cas complet)
3. Phase 6 → 7 → 8 (hero + liste + page détail)
4. Phase 4.3 (`global-stats`) + Phase 10 polish
5. Phase 12 déploiement

Tout le reste (dashboard widgets, sectors/services admin UI, galerie visuelle) peut suivre.

---

## Estimation totale

**~11-12 jours** de dev sérieux pour la version complète.
**~6-7 jours** pour le chemin minimal publiable.

---

## Checklist de démarrage

- [ ] Projet Supabase créé, clés récupérées
- [ ] Repo Git initialisé
- [ ] `.env.local` configuré
- [ ] Palette + Inter dans Tailwind
- [ ] shadcn initialisé
- [ ] Clients Supabase créés dans `src/lib/supabase/`

Une fois cette checklist cochée : attaquer Phase 1.
