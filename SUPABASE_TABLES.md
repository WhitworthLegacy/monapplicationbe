# Tables Supabase Requises

## Tables à créer dans Supabase SQL Editor

### 1. profiles
```sql
-- Already exists (created by Supabase Auth)
-- Add custom columns:
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'staff';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
```

### 2. clients
Voir: `supabase_migrations/create_clients_table.sql`

### 3. contacts
Voir: `supabase_migrations/create_contacts_table.sql` ✅ Créé

### 4. appointments
```sql
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  appointment_type TEXT NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  status TEXT DEFAULT 'scheduled',
  assigned_to UUID REFERENCES profiles(id),
  notes TEXT
);
```

### 5. quotes
```sql
CREATE TABLE quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  client_id UUID REFERENCES clients(id),
  quote_number TEXT UNIQUE,
  title TEXT,
  status TEXT DEFAULT 'draft',
  subtotal INTEGER DEFAULT 0,
  tax_rate NUMERIC DEFAULT 21.00,
  total INTEGER DEFAULT 0,
  pdf_url TEXT,
  notes TEXT
);
```

### 6. quote_items
```sql
CREATE TABLE quote_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity NUMERIC DEFAULT 1,
  unit_price INTEGER NOT NULL,
  line_total INTEGER NOT NULL,
  position INTEGER DEFAULT 0
);
```

### 7. activities
```sql
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id),
  user_email TEXT,
  user_role TEXT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  description TEXT,
  metadata JSONB,
  ip_address TEXT,
  user_agent TEXT
);
```

### 8. settings
```sql
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES profiles(id)
);
```

## État actuel
- ✅ contacts - Créé via migration
- ⏳ Les autres - À vérifier/créer
