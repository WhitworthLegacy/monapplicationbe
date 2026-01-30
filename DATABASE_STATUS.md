# État de la Base de Données Supabase

## ✅ Tables Existantes (Toutes créées!)

### 1. **profiles**
Utilisateurs admin avec rôles
- Colonnes: id, email, full_name, role, avatar_url, phone, created_at, updated_at
- Utilisé par: Auth, adminAuth.ts, toutes les pages admin

### 2. **clients**
Base CRM - tous les clients
- Colonnes: id, full_name, email, phone, company, address, crm_stage, source, notes, tags, tracking_id, assigned_to, etc.
- Utilisé par: /admin/clients, /admin/crm, API /api/clients

### 3. **contact_submissions**
Formulaires de contact du site web
- Colonnes: id, name, email, phone, message, created_at
- Utilisé par: API /api/contact (site web)

### 4. **appointments**
Rendez-vous clients
- Colonnes: id, client_id, title, description, scheduled_at, duration_minutes, status, assigned_to, notes, etc.
- Utilisé par: /admin/appointments, API /api/appointments

### 5. **quotes**
Devis clients
- Colonnes: id, client_id, quote_number, title, status, subtotal, tax_rate, total, pdf_url, etc.
- Utilisé par: /admin/quotes, API /api/quotes

### 6. **quote_items**
Lignes de devis
- Colonnes: id, quote_id, description, quantity, unit_price, line_total, position
- Utilisé par: API /api/quotes (création/modification devis)

### 7. **notifications**
Queue emails/SMS/WhatsApp
- Colonnes: id, client_id, recipient_email, type, template, status, sent_at, etc.
- Utilisé par: Système de notifications

### 8. **activities**
Audit log / Activity tracking
- Colonnes: id, user_id, action, entity_type, entity_id, description, metadata, ip_address, etc.
- Utilisé par: activityLogger.ts, /admin/activities

### 9. **settings**
Configuration système
- Colonnes: key, value (jsonb), description, updated_at, updated_by
- Utilisé par: /admin/settings

## 🎯 Architecture Actuelle

### **apps/web** (Site vitrine)
- ✅ Utilise: `contact_submissions` (via /api/contact)
- ✅ Resend pour emails
- ✅ Supabase pour sauvegarder contacts

### **apps/admin** (Panel admin)
- ✅ Utilise: Toutes les tables sauf contact_submissions
- ✅ APIs complètes pour CRUD
- ✅ Frontend avec Dashboard, Clients, Quotes, Appointments, etc.

## 📝 Notes
- Pas besoin de migrations SQL - tout existe déjà!
- RLS policies probablement déjà configurées
- contact_submissions vs contacts: On utilise contact_submissions (table existante)
