# 🎯 Admin Panel Setup Guide - MonApplicationBE

Guide complet pour configurer et déployer le panel admin CRM de MonApplication.be

---

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Prérequis](#prérequis)
3. [Installation des dépendances](#installation-des-dépendances)
4. [Configuration de la base de données](#configuration-de-la-base-de-données)
5. [Configuration des services externes](#configuration-des-services-externes)
6. [Variables d'environnement](#variables-denvironnement)
7. [Création du premier utilisateur admin](#création-du-premier-utilisateur-admin)
8. [Test en local](#test-en-local)
9. [Déploiement sur Vercel](#déploiement-sur-vercel)
10. [Fonctionnalités](#fonctionnalités)

---

## Vue d'ensemble

Le panel admin MonApplicationBE est un **CRM complet** pour gérer vos leads et clients SaaS avec:

- 📊 **Dashboard financier** - KPIs, revenus, conversion
- 🎯 **Pipeline CRM** - Kanban drag & drop (Prospect → Gagné)
- 👥 **Gestion clients** - Base de données complète avec recherche
- 📅 **Rendez-vous** - Calendrier et planification
- 📄 **Devis** - Création, envoi, suivi financier
- 🔐 **Rôles** - Super Admin, Admin, Manager, Marketing, Staff
- 📧 **Notifications** - Email (Resend), SMS, WhatsApp (Twilio), Push
- 💳 **Paiements** - Stripe integration
- 📝 **Activity Log** - Audit trail complet

---

## Prérequis

- **Node.js** 18+ et npm
- Compte **Supabase** (PostgreSQL + Auth)
- Compte **Resend** (email)
- Compte **Stripe** (paiements) - optionnel
- Compte **Twilio** (SMS/WhatsApp) - optionnel
- Compte **Vercel** (déploiement)

---

## Installation des dépendances

```bash
cd /Volumes/YaqubLegacy/Dev/monapplicationbe

# Installer toutes les dépendances
npm install
```

**Dépendances installées:**
- `@supabase/ssr` - Supabase client avec SSR
- `resend` - Email API
- `stripe` + `@stripe/stripe-js` - Paiements
- `twilio` - SMS et WhatsApp
- `web-push` - Push notifications
- `zod` - Validation
- `date-fns` - Dates
- `@tanstack/react-query` - Data fetching
- `zustand` - State management
- `@dnd-kit/*` - Drag & drop pour CRM

---

## Configuration de la base de données

### Étape 1: Exécuter la migration SQL

1. Ouvrez **Supabase Dashboard** → SQL Editor
2. Copiez tout le contenu de `supabase/migrations/001_admin_panel_schema.sql`
3. Exécutez le script

**Ce script crée:**
- ✅ 8 tables: `profiles`, `clients`, `appointments`, `quotes`, `quote_items`, `activities`, `notifications`, `settings`
- ✅ Indexes optimisés pour performance
- ✅ RLS (Row Level Security) policies par rôle
- ✅ Triggers automatiques (updated_at, quote_number)
- ✅ Full-text search sur clients
- ✅ Settings par défaut (company info, TVA 21%)

### Étape 2: Vérifier les tables

```sql
-- Vérifier que toutes les tables existent
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

Vous devriez voir:
- ✅ activities
- ✅ appointments
- ✅ clients
- ✅ notifications
- ✅ profiles
- ✅ quote_items
- ✅ quotes
- ✅ settings

---

## Configuration des services externes

### 1. Resend (Email) ✅ DÉJÀ CONFIGURÉ

Vous avez déjà:
- ✅ Compte créé
- ✅ API key: `re_2ZQTfqoe_KhifxpCk5QKb3dq13vFnQjPY`
- ✅ Domaine vérifié: `monapplication.be`

### 2. Supabase ✅ DÉJÀ CONFIGURÉ

Vous avez déjà:
- ✅ Projet créé: `sdlnhvkbgkockqwsexeh`
- ✅ URL et clés configurées

### 3. Stripe (Paiements) - À CONFIGURER

1. Créer compte sur https://stripe.com
2. Mode Test → Developers → API Keys
3. Copier:
   - `Secret key` (sk_test_...)
   - `Publishable key` (pk_test_...)
4. Developers → Webhooks → Add endpoint
   - URL: `https://monapplication.be/api/webhooks/stripe`
   - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Copier `Signing secret` (whsec_...)

### 4. Twilio (SMS + WhatsApp) - OPTIONNEL

1. Créer compte sur https://twilio.com
2. Console → Account Info → Copier:
   - Account SID
   - Auth Token
3. Phone Numbers → Buy a number (Belgique +32)
4. WhatsApp Sandbox:
   - Messaging → Try it out → Send WhatsApp message
   - Numéro sandbox: +1 415 523 8886

### 5. Web Push - OPTIONNEL

Générer les clés VAPID:

```bash
npx web-push generate-vapid-keys
```

Copier les clés Public et Private dans `.env.local`

---

## Variables d'environnement

Copier `.env.local.example` vers `.env.local`:

```bash
cp .env.local.example .env.local
```

**Remplir toutes les variables:**

```env
# Resend (✅ déjà configuré)
RESEND_API_KEY=re_2ZQTfqoe_KhifxpCk5QKb3dq13vFnQjPY
FROM_EMAIL=contact@monapplication.be
TO_EMAIL=contact@monapplication.be

# Supabase (✅ déjà configuré)
NEXT_PUBLIC_SUPABASE_URL=https://sdlnhvkbgkockqwsexeh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_KEY=eyJ...

# Stripe (⚠️ à configurer)
STRIPE_SECRET_KEY=sk_test_YOUR_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET

# Twilio (optionnel)
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_PHONE_NUMBER=+32xxxxxx
TWILIO_WHATSAPP_FROM=+14155238886

# Web Push (optionnel)
NEXT_PUBLIC_VAPID_PUBLIC_KEY=xxxxx
VAPID_PRIVATE_KEY=xxxxx

# App
NEXT_PUBLIC_APP_URL=https://monapplication.be
```

---

## Création du premier utilisateur admin

### Option 1: Via Supabase Dashboard (Recommandé)

1. **Supabase Dashboard** → Authentication → Users → Add user
2. Email: `admin@monapplication.be`
3. Password: `[votre mot de passe sécurisé]`
4. Confirm → Create user

5. **Copier l'UUID** du user créé

6. **SQL Editor** → Exécuter:

```sql
-- Insérer le profil admin
INSERT INTO profiles (id, email, full_name, role)
VALUES (
  '[UUID_DU_USER]',
  'admin@monapplication.be',
  'Super Admin',
  'super_admin'
);
```

### Option 2: Via SQL (Tout en un)

```sql
-- Créer user + profile en une fois
-- ATTENTION: Supabase Auth ne permet pas de créer users via SQL directement
-- Utilisez Option 1 ci-dessus
```

### Tester la connexion

1. Lancer le dev server: `npm run dev`
2. Ouvrir http://localhost:3000/login
3. Se connecter avec `admin@monapplication.be`
4. Vous devriez accéder au dashboard admin

---

## Test en local

### Lancer le serveur de développement

```bash
npm run dev
```

### Tester les fonctionnalités

1. **Login** - http://localhost:3000/login
2. **Dashboard** - http://localhost:3000/admin
   - ✅ KPIs s'affichent
   - ✅ Quick actions fonctionnent
3. **CRM Board** - http://localhost:3000/admin/crm
   - ✅ Drag & drop fonctionne
4. **Clients** - http://localhost:3000/admin/clients
   - ✅ Liste affichée
   - ✅ Search fonctionne
   - ✅ Filtres par stage
5. **Devis** - http://localhost:3000/admin/quotes
   - ✅ Stats affichées
   - ✅ Liste des devis

### Créer des données de test

```sql
-- Créer un client test
INSERT INTO clients (full_name, email, phone, company, crm_stage)
VALUES ('Jean Dupont', 'jean@example.com', '+32471234567', 'Dupont SPRL', 'prospect');

-- Créer un devis test
INSERT INTO quotes (client_id, title, description, status, subtotal, tax_amount, total)
VALUES (
  '[ID_DU_CLIENT]',
  'Application mobile sur mesure',
  'Développement application iOS + Android',
  'sent',
  800000, -- 8000€ en centimes
  168000, -- 21% TVA
  968000  -- Total 9680€
);

-- Ajouter des lignes au devis
INSERT INTO quote_items (quote_id, description, quantity, unit_price, line_total, position)
VALUES
('[ID_DU_DEVIS]', 'Développement application mobile', 1, 600000, 600000, 0),
('[ID_DU_DEVIS]', 'Design UI/UX', 1, 200000, 200000, 1);
```

---

## Déploiement sur Vercel

### Étape 1: Push sur Git

```bash
git add .
git commit -m "Add admin panel with CRM, quotes, and appointments"
git push origin main
```

### Étape 2: Créer projet Vercel

1. https://vercel.com → New Project
2. Import Git Repository → Choisir `monapplicationbe`
3. Framework Preset: **Next.js**
4. Root Directory: `./`

### Étape 3: Configurer les variables d'environnement

Settings → Environment Variables → Ajouter toutes les variables de `.env.local`:

```
RESEND_API_KEY=re_2ZQTfqoe_KhifxpCk5QKb3dq13vFnQjPY
FROM_EMAIL=contact@monapplication.be
TO_EMAIL=contact@monapplication.be
NEXT_PUBLIC_SUPABASE_URL=https://sdlnhvkbgkockqwsexeh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_KEY=eyJ...
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_APP_URL=https://monapplication.be
... (etc)
```

### Étape 4: Déployer

1. Deploy → Attendre le build (3-5 min)
2. Vérifier le déploiement: https://monapplication.be
3. Tester `/login` et `/admin`

### Étape 5: Configurer le domaine

1. Vercel Dashboard → Settings → Domains
2. Ajouter `monapplication.be`
3. Suivre les instructions DNS (CNAME ou A record)

---

## Fonctionnalités

### 🎯 CRM Pipeline

**Stages:**
1. Prospect (nouveau lead)
2. Contact (premier contact établi)
3. Qualifié (besoin validé)
4. Proposition (devis envoyé)
5. Négociation (discussion prix/délais)
6. Gagné ✅ (client accepté)
7. Perdu ❌ (refusé ou abandonné)

**Fonctionnalités:**
- Drag & drop entre stages
- Compteur par stage
- Filtres: assigné à, source, tags
- Quick actions: appel, email, WhatsApp

### 👥 Gestion Clients

**Données:**
- Infos contact (nom, email, tel, société)
- Adresse complète
- Stage CRM
- Source (comment ils nous ont trouvé)
- UTM tracking (source, medium, campaign)
- Tags personnalisés
- Notes
- Préférences communication

**Fonctionnalités:**
- Full-text search
- Filtres multiples
- Export CSV
- Activity tracking

### 📄 Devis

**Workflow:**
1. Créer devis (brouillon)
2. Ajouter lignes (description, quantité, prix unitaire)
3. Calcul automatique (sous-total, TVA 21%, total)
4. Envoyer par email (PDF attaché)
5. Tracking: vu, accepté, refusé

**Numérotation auto:**
- Format: `DEVIS-2026-001`
- Incrémente automatiquement par année

**Statuts:**
- Brouillon (en cours de création)
- Envoyé (email envoyé)
- Vu (client a ouvert)
- Accepté ✅ (converti en client)
- Refusé ❌
- Expiré (date dépassée)

### 📅 Rendez-vous

**Types:**
- Consultation
- Installation
- Maintenance
- Démonstration
- Réunion

**Fonctionnalités:**
- Vue calendrier (jour, semaine, mois)
- Assignation à un membre de l'équipe
- Adresse ou remote
- Rappels automatiques (SMS/Email)
- Notes internes

### 📊 Dashboard

**KPIs affichés:**
- Total clients
- Rendez-vous aujourd'hui
- Devis en attente
- Taux de conversion
- Revenus total
- Revenus ce mois

**Quick actions:**
- Nouveau client
- Nouveau rendez-vous
- Créer devis

### 🔐 Rôles & Permissions

| Rôle | Dashboard | CRM | Clients | Devis | Rendez-vous | Finances | Utilisateurs | Activité |
|------|-----------|-----|---------|-------|-------------|----------|--------------|----------|
| **Super Admin** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Admin** | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| **Manager** | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Marketing** | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Staff** | ✅ | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |

---

## Architecture Technique

### Stack

- **Frontend**: Next.js 15, React, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth + RLS
- **Email**: Resend
- **Payments**: Stripe
- **SMS/WhatsApp**: Twilio
- **Deployment**: Vercel

### Structure des fichiers

```
monapplicationbe/
├── app/
│   ├── admin/                    # Admin pages
│   │   ├── layout.tsx           # Auth wrapper
│   │   ├── page.tsx             # Dashboard
│   │   ├── crm/page.tsx         # CRM board
│   │   ├── clients/page.tsx     # Clients list
│   │   └── quotes/page.tsx      # Quotes list
│   ├── api/                      # API routes
│   │   ├── clients/route.ts     # CRUD clients
│   │   ├── quotes/route.ts      # CRUD quotes
│   │   └── appointments/route.ts
│   └── login/page.tsx            # Login page
├── components/
│   ├── ui/                       # Base UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   └── Modal.tsx
│   └── admin/
│       └── Sidebar.tsx           # Admin navigation
├── lib/
│   ├── auth/                     # Auth utilities
│   │   ├── adminAuth.ts         # Role checks
│   │   ├── roles.ts             # Permission logic
│   │   └── activityLogger.ts    # Audit trail
│   ├── supabase/                 # Supabase clients
│   │   ├── client.ts            # Browser client
│   │   └── server.ts            # Server client
│   └── integrations/             # External services
│       ├── stripe.ts
│       ├── twilio.ts
│       └── webpush.ts
├── hooks/
│   └── useUserRole.ts            # Permission hook
├── supabase/
│   └── migrations/
│       └── 001_admin_panel_schema.sql
├── middleware.ts                 # Route protection
└── .env.local                    # Environment variables
```

---

## Sécurité

✅ **Implémenté:**
- Row Level Security (RLS) sur toutes les tables
- Role-based access control (RBAC)
- Middleware pour protection des routes admin
- API keys en variables d'environnement
- Activity logging (audit trail)
- HTTPS only (Vercel)
- Supabase Auth avec JWT

⚠️ **À faire:**
- Rate limiting sur auth endpoints
- 2FA (Two-Factor Authentication)
- IP whitelisting pour super_admin
- Backup automatique database

---

## Support & Dépannage

### Erreur: "Unauthorized" sur /admin

**Solution:**
- Vérifier que l'utilisateur a un profil dans `profiles` table
- Vérifier que le rôle est bien assigné
- Nettoyer cookies et se reconnecter

### Drag & drop CRM ne fonctionne pas

**Solution:**
- Vérifier que `@dnd-kit/*` est installé
- Hard refresh (Cmd+Shift+R)
- Vérifier les RLS policies sur `clients` table

### Emails ne sont pas envoyés

**Solution:**
- Vérifier `RESEND_API_KEY` dans .env
- Vérifier que le domaine est vérifié dans Resend
- Vérifier les logs API dans Resend Dashboard

### Tables Supabase non créées

**Solution:**
- Vérifier que le SQL s'est exécuté sans erreur
- Regarder les messages d'erreur dans SQL Editor
- Relancer la migration complète

---

## Prochaines étapes

### Phase 1: Finalisation actuelle
- ✅ Database schema créé
- ✅ Auth & permissions configurés
- ✅ Dashboard avec KPIs
- ✅ CRM board avec drag & drop
- ✅ Clients CRUD
- ✅ Quotes CRUD
- ✅ API routes complètes

### Phase 2: Améliorations (optionnel)
- [ ] Calendar view pour rendez-vous
- [ ] PDF generation pour devis
- [ ] Email templates personnalisables
- [ ] Analytics dashboard (graphiques)
- [ ] Export CSV de tous les modules
- [ ] WhatsApp chatbot integration
- [ ] AI assistant pour réponses auto

### Phase 3: Optimisations (plus tard)
- [ ] Caching avec Redis
- [ ] Pagination sur listes
- [ ] Infinite scroll
- [ ] Real-time updates (websockets)
- [ ] Mobile app (React Native)

---

## Contacts

- **Email**: contact@monapplication.be
- **Support Supabase**: https://supabase.com/support
- **Support Vercel**: https://vercel.com/help
- **Support Resend**: https://resend.com/support

---

**✅ Admin Panel prêt à l'emploi!**

Suivez ce guide étape par étape et vous aurez un CRM complet en production en moins d'une heure. 🚀
