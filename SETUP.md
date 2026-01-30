# Setup Guide - MonApplicationBE

## ✅ Fichiers créés

Les fichiers suivants ont été créés et sont prêts à l'emploi:

- ✅ `.env.local` - Variables d'environnement (à configurer)
- ✅ `.env.example` - Template pour les variables d'environnement
- ✅ `.gitignore` - Configuration Git
- ✅ `app/api/contact/route.ts` - API route pour le formulaire de contact
- ✅ `app/contact/page.tsx` - Formulaire connecté à l'API
- ✅ `app/mentions-legales/page.tsx` - Page mentions légales
- ✅ `app/confidentialite/page.tsx` - Page politique de confidentialité

## 🔧 Étapes de configuration

### 1. Installer les dépendances

```bash
cd /Volumes/YaqubLegacy/Dev/monapplicationbe
npm install resend @supabase/supabase-js
# ou
pnpm install resend @supabase/supabase-js
```

### 2. Configurer Resend (Email)

1. Créer un compte sur https://resend.com
2. Créer une API key
3. Ajouter votre domaine et vérifier le DNS
4. Copier l'API key dans `.env.local`:
   ```
   RESEND_API_KEY=re_votre_cle_ici
   FROM_EMAIL=contact@monapplication.be
   TO_EMAIL=admin@monapplication.be
   ```

**Documentation**: https://resend.com/docs/introduction

### 3. Configurer Supabase (Base de données)

1. Créer un projet sur https://supabase.com
2. Aller dans "Project Settings" → "API"
3. Copier les clés dans `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx
   SUPABASE_SERVICE_KEY=eyJxxx
   ```

4. Créer la table `contact_submissions`:
   - Aller dans "SQL Editor"
   - Exécuter:
   ```sql
   CREATE TABLE contact_submissions (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     name TEXT NOT NULL,
     email TEXT NOT NULL,
     phone TEXT,
     message TEXT NOT NULL,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- Index pour les requêtes
   CREATE INDEX idx_contact_created ON contact_submissions(created_at DESC);
   ```

**Documentation**: https://supabase.com/docs

### 4. Configurer Vercel (Déploiement)

1. Installer Vercel CLI (optionnel):
   ```bash
   npm install -g vercel
   ```

2. Déployer le projet:
   ```bash
   vercel
   ```

3. Configurer les variables d'environnement sur Vercel:
   - Aller sur le dashboard Vercel
   - Settings → Environment Variables
   - Ajouter toutes les variables de `.env.local`

**Important**: Les variables `NEXT_PUBLIC_*` sont exposées côté client, les autres restent côté serveur.

### 5. Mettre à jour les mentions légales

Dans les fichiers suivants, remplacez les placeholders:

- `app/mentions-legales/page.tsx`:
  - `[À COMPLÉTER]` → Numéro d'entreprise BCE
  - `[Adresse à compléter]` → Adresse du siège social

- `app/confidentialite/page.tsx`:
  - `[Adresse à compléter]` → Adresse du siège social

### 6. Tester le formulaire de contact

1. Lancer le serveur de développement:
   ```bash
   npm run dev
   ```

2. Aller sur http://localhost:3000/contact

3. Remplir et soumettre le formulaire

4. Vérifier:
   - Email reçu (admin)
   - Email de confirmation (client)
   - Entrée dans Supabase

## 🚀 Déploiement

```bash
# Build de production
npm run build

# Déployer sur Vercel
vercel --prod
```

## 📝 TODO avant la production

- [ ] Installer les dépendances (resend, supabase)
- [ ] Configurer Resend avec le domaine personnalisé
- [ ] Configurer Supabase et créer la table
- [ ] Remplir les informations légales
- [ ] Tester le formulaire de contact end-to-end
- [ ] Configurer les variables d'environnement sur Vercel
- [ ] Déployer en production
- [ ] Tester le formulaire en production
- [ ] Configurer Google Analytics (optionnel)
- [ ] Configurer Sentry pour le tracking d'erreurs (optionnel)

## 🔒 Sécurité

- ✅ `.env.local` est dans `.gitignore` (ne sera pas commité)
- ✅ Les clés API sont côté serveur uniquement
- ✅ Validation des inputs côté client ET serveur
- ✅ Protection CORS native de Next.js

## 📚 Documentation

- [Next.js App Router](https://nextjs.org/docs/app)
- [Resend Email](https://resend.com/docs)
- [Supabase](https://supabase.com/docs)
- [Vercel Deployment](https://vercel.com/docs)

## 🆘 Support

En cas de problème:
1. Vérifier les logs Vercel
2. Vérifier les logs Supabase (Logs Explorer)
3. Vérifier la console navigateur (F12)
4. Vérifier que toutes les env vars sont configurées
