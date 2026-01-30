# ⚡ Quick Start - Admin Panel

**Temps estimé:** 15-30 minutes pour avoir l'admin panel fonctionnel en local

---

## ✅ Étape 1: Migration Database (5 min)

### 1.1 Ouvrir Supabase
👉 https://supabase.com/dashboard/project/sdlnhvkbgkockqwsexeh

### 1.2 Exécuter le SQL
1. Menu gauche → **SQL Editor**
2. New query
3. Copier **TOUT** le contenu de:
   ```
   /Volumes/YaqubLegacy/Dev/monapplicationbe/supabase/migrations/001_admin_panel_schema.sql
   ```
4. Paste dans l'éditeur
5. Click **RUN** (en bas à droite)

### 1.3 Vérifier
Exécuter cette query dans SQL Editor:
```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' ORDER BY table_name;
```

**Vous devez voir:**
- activities
- appointments
- clients
- contact_submissions *(déjà existante)*
- notifications
- profiles
- quote_items
- quotes
- settings

✅ **Si vous voyez ces 9 tables → Succès!**

---

## ✅ Étape 2: Créer Admin User (3 min)

### 2.1 Créer l'utilisateur dans Supabase Auth
1. Menu gauche → **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Remplir:
   - Email: `admin@monapplication.be`
   - Password: `[votre mot de passe sécurisé]`
   - ✅ **Auto Confirm User** (cocher cette case!)
4. Click **Create user**

### 2.2 Copier l'UUID
Dans la liste des users, **copier l'UUID** du user que vous venez de créer
(Format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

### 2.3 Créer le profil
SQL Editor → New query:
```sql
-- REMPLACER [UUID_ICI] par l'UUID copié à l'étape 2.2
INSERT INTO profiles (id, email, full_name, role)
VALUES (
  '[UUID_ICI]',
  'admin@monapplication.be',
  'Super Admin',
  'super_admin'
);
```

Click **RUN**

✅ **Si "Success. No rows returned" → C'est bon!**

---

## ✅ Étape 3: Tester en Local (2 min)

### 3.1 Lancer le serveur
```bash
cd /Volumes/YaqubLegacy/Dev/monapplicationbe
npm run dev
```

### 3.2 Ouvrir le login
👉 http://localhost:3000/login

### 3.3 Se connecter
- Email: `admin@monapplication.be`
- Password: [celui que vous avez choisi]
- Click **Se connecter**

✅ **Si vous voyez le dashboard → Succès!**

---

## ✅ Étape 4: Créer des données de test (5 min)

### 4.1 Créer un client test
SQL Editor:
```sql
INSERT INTO clients (full_name, email, phone, company, crm_stage, source)
VALUES
('Jean Dupont', 'jean.dupont@example.com', '+32471234567', 'Dupont SPRL', 'prospect', 'Website'),
('Marie Martin', 'marie@example.com', '+32472345678', 'Martin & Co', 'qualified', 'Referral'),
('Pierre Dubois', 'pierre@example.com', '+32473456789', 'Dubois SA', 'proposal', 'LinkedIn');
```

### 4.2 Récupérer les IDs
```sql
SELECT id, full_name FROM clients ORDER BY created_at DESC LIMIT 3;
```
Copier les 3 UUIDs

### 4.3 Créer des devis
```sql
-- REMPLACER [UUID_CLIENT_1], [UUID_CLIENT_2], [UUID_CLIENT_3] par les UUIDs copiés

-- Devis 1: Draft
INSERT INTO quotes (client_id, title, description, status, subtotal, tax_amount, total)
VALUES (
  '[UUID_CLIENT_1]',
  'Application mobile sur mesure',
  'Développement application iOS + Android',
  'draft',
  1000000,  -- 10,000€
  210000,   -- 21% TVA
  1210000   -- Total
);

-- Devis 2: Sent
INSERT INTO quotes (client_id, title, description, status, subtotal, tax_amount, total, sent_at)
VALUES (
  '[UUID_CLIENT_2]',
  'Plateforme e-commerce',
  'Site e-commerce avec gestion stock',
  'sent',
  500000,   -- 5,000€
  105000,   -- 21% TVA
  605000,   -- Total
  NOW()
);

-- Devis 3: Accepted
INSERT INTO quotes (client_id, title, description, status, subtotal, tax_amount, total, sent_at, accepted_at)
VALUES (
  '[UUID_CLIENT_3]',
  'Système de gestion interne',
  'CRM personnalisé pour gestion clients',
  'accepted',
  800000,   -- 8,000€
  168000,   -- 21% TVA
  968000,   -- Total
  NOW() - INTERVAL '3 days',
  NOW() - INTERVAL '1 day'
);
```

---

## ✅ Étape 5: Vérifier que tout fonctionne (5 min)

### 5.1 Dashboard
👉 http://localhost:3000/admin

**Vérifier:**
- ✅ Total Clients: 3
- ✅ Devis en attente: 1
- ✅ Taux de conversion: 33.3%
- ✅ Revenus total: €8,000

### 5.2 CRM Board
👉 http://localhost:3000/admin/crm

**Vérifier:**
- ✅ Colonne "Prospect": 1 client (Jean Dupont)
- ✅ Colonne "Qualifié": 1 client (Marie Martin)
- ✅ Colonne "Proposition": 1 client (Pierre Dubois)
- ✅ **Drag & drop** fonctionne (essayer de glisser Jean Dupont vers "Contact")

### 5.3 Liste Clients
👉 http://localhost:3000/admin/clients

**Vérifier:**
- ✅ 3 clients affichés dans le tableau
- ✅ Search fonctionne (taper "Jean")
- ✅ Filtre par stage fonctionne

### 5.4 Liste Devis
👉 http://localhost:3000/admin/quotes

**Vérifier:**
- ✅ Stats: Total 3, Draft 1, Envoyés 1, Acceptés 1
- ✅ Montant total: €8,000
- ✅ 3 devis affichés
- ✅ Numéros auto: DEVIS-2026-001, DEVIS-2026-002, DEVIS-2026-003

---

## 🎉 C'est tout!

**Si tous les ✅ sont cochés, votre admin panel fonctionne parfaitement!**

---

## 🚀 Prochaine étape: Déployer sur Vercel

### Quick Deploy (10 min)

```bash
# 1. Commit & push
git add .
git commit -m "Add admin panel with CRM, quotes, and financial tracking"
git push origin main

# 2. Vercel
# → https://vercel.com/new
# → Import monapplicationbe
# → Configure env vars (copy from .env.local)
# → Deploy
```

### Variables à configurer sur Vercel:
```
RESEND_API_KEY=re_2ZQTfqoe_KhifxpCk5QKb3dq13vFnQjPY
FROM_EMAIL=contact@monapplication.be
TO_EMAIL=contact@monapplication.be
NEXT_PUBLIC_SUPABASE_URL=https://sdlnhvkbgkockqwsexeh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... (copier depuis .env.local)
SUPABASE_SERVICE_KEY=eyJ... (copier depuis .env.local)
NEXT_PUBLIC_APP_URL=https://monapplication.be
```

---

## 🆘 Problèmes?

### "Unauthorized" au login
- ✅ Vérifier que le profil existe dans table `profiles`
- ✅ Vérifier que le rôle est `super_admin`
- ✅ Nettoyer cookies et réessayer

### Dashboard vide (0 partout)
- ✅ Vérifier que les données test sont créées
- ✅ Hard refresh (Cmd+Shift+R)
- ✅ Vérifier RLS policies (réexécuter migration SQL)

### Drag & drop ne fonctionne pas
- ✅ Hard refresh
- ✅ Vérifier que @dnd-kit est installé: `npm list @dnd-kit/core`
- ✅ Réinstaller: `npm install @dnd-kit/core @dnd-kit/sortable`

---

## 📚 Documentation complète

**Pour plus de détails:**
- 📖 [ADMIN_SETUP.md](ADMIN_SETUP.md) - Guide complet (architecture, sécurité, etc.)
- 📊 [ADMIN_PANEL_IMPLEMENTATION_SUMMARY.md](/Volumes/YaqubLegacy/Dev/ADMIN_PANEL_IMPLEMENTATION_SUMMARY.md) - Résumé de l'implémentation

---

**✅ Profitez de votre nouveau CRM!**
