-- ============================================
-- Admin Panel Database Schema
-- MonApplicationBE - CRM & Lead Management
-- ============================================

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Auto-generate quote numbers
CREATE OR REPLACE FUNCTION generate_quote_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.quote_number IS NULL THEN
    NEW.quote_number := 'DEVIS-' ||
      TO_CHAR(NOW(), 'YYYY') || '-' ||
      LPAD((SELECT COALESCE(MAX(CAST(SPLIT_PART(quote_number, '-', 3) AS INTEGER)), 0) + 1
            FROM quotes
            WHERE quote_number LIKE 'DEVIS-' || TO_CHAR(NOW(), 'YYYY') || '-%')::TEXT, 3, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TABLE 1: PROFILES (Admin Users)
-- ============================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'admin', 'manager', 'marketing', 'staff')),
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX idx_profiles_role ON profiles(role);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles viewable by authenticated users" ON profiles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Profiles updatable by self or admin" ON profiles
  FOR UPDATE TO authenticated USING (
    auth.uid() = id OR
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'super_admin')
  );

-- Updated_at trigger
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

COMMENT ON TABLE profiles IS 'Admin users with role-based access control';

-- ============================================
-- TABLE 2: CLIENTS (CRM)
-- ============================================

CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Contact Info
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  company TEXT,

  -- Address
  address TEXT,
  zip_code TEXT,
  city TEXT,
  country TEXT DEFAULT 'BE',

  -- CRM Fields
  crm_stage TEXT NOT NULL DEFAULT 'prospect' CHECK (crm_stage IN ('prospect', 'contact', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost')),
  source TEXT, -- How they found us
  notes TEXT,
  tags TEXT[], -- Array of tags

  -- Tracking
  tracking_id SERIAL UNIQUE, -- Human-readable ID
  assigned_to UUID REFERENCES profiles(id), -- Assigned team member

  -- Metadata
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,

  -- Communication Preferences
  prefers_email BOOLEAN DEFAULT true,
  prefers_whatsapp BOOLEAN DEFAULT false,
  prefers_sms BOOLEAN DEFAULT false,
  language TEXT DEFAULT 'fr' CHECK (language IN ('fr', 'nl', 'en'))
);

-- Indexes
CREATE INDEX idx_clients_stage ON clients(crm_stage);
CREATE INDEX idx_clients_assigned ON clients(assigned_to);
CREATE INDEX idx_clients_tracking ON clients(tracking_id);
CREATE INDEX idx_clients_phone ON clients(phone);
CREATE INDEX idx_clients_email ON clients(email);

-- Full-text search
CREATE INDEX idx_clients_search ON clients USING gin(to_tsvector('french',
  coalesce(full_name, '') || ' ' ||
  coalesce(email, '') || ' ' ||
  coalesce(phone, '') || ' ' ||
  coalesce(company, '')
));

-- RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients viewable by staff" ON clients
  FOR SELECT TO authenticated USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('super_admin', 'admin', 'manager', 'staff')
  );

CREATE POLICY "Clients manageable by admin" ON clients
  FOR ALL TO authenticated USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('super_admin', 'admin')
  );

-- Trigger
CREATE TRIGGER clients_updated_at BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

COMMENT ON TABLE clients IS 'CRM clients/leads with full contact information and pipeline tracking';

-- ============================================
-- TABLE 3: APPOINTMENTS (Rendez-vous)
-- ============================================

CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Client
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,

  -- Appointment Details
  title TEXT NOT NULL,
  description TEXT,
  appointment_type TEXT NOT NULL, -- 'consultation', 'installation', 'maintenance', 'demo', etc.

  -- Scheduling
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')),

  -- Assignment
  assigned_to UUID REFERENCES profiles(id),

  -- Location
  address TEXT,
  is_remote BOOLEAN DEFAULT false,

  -- Notes
  notes TEXT,
  internal_notes TEXT, -- Only visible to staff

  -- Reminders
  reminder_sent BOOLEAN DEFAULT false,
  reminder_sent_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_appointments_client ON appointments(client_id);
CREATE INDEX idx_appointments_scheduled ON appointments(scheduled_at);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_assigned ON appointments(assigned_to);

-- RLS
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Appointments viewable by staff" ON appointments
  FOR SELECT TO authenticated USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('super_admin', 'admin', 'manager', 'staff')
  );

CREATE POLICY "Appointments manageable by admin" ON appointments
  FOR ALL TO authenticated USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('super_admin', 'admin')
  );

-- Trigger
CREATE TRIGGER appointments_updated_at BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

COMMENT ON TABLE appointments IS 'Client appointments and meetings with scheduling and reminders';

-- ============================================
-- TABLE 4: QUOTES (Devis)
-- ============================================

CREATE TABLE quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Client
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,

  -- Quote Details
  quote_number TEXT UNIQUE NOT NULL, -- e.g., "DEVIS-2026-001"
  title TEXT NOT NULL,
  description TEXT,

  -- Status
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'accepted', 'refused', 'expired')),

  -- Amounts (in cents to avoid float precision issues)
  subtotal INTEGER NOT NULL DEFAULT 0,
  tax_rate NUMERIC(5,2) DEFAULT 21.00, -- 21% VAT in Belgium
  tax_amount INTEGER DEFAULT 0,
  total INTEGER NOT NULL DEFAULT 0,

  -- Dates
  sent_at TIMESTAMPTZ,
  viewed_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,
  refused_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,

  -- Files
  pdf_url TEXT,

  -- Notes
  notes TEXT,
  terms_and_conditions TEXT
);

-- Indexes
CREATE INDEX idx_quotes_client ON quotes(client_id);
CREATE INDEX idx_quotes_status ON quotes(status);
CREATE INDEX idx_quotes_number ON quotes(quote_number);

-- RLS
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Quotes viewable by staff" ON quotes
  FOR SELECT TO authenticated USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('super_admin', 'admin', 'manager', 'marketing')
  );

CREATE POLICY "Quotes manageable by admin" ON quotes
  FOR ALL TO authenticated USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('super_admin', 'admin')
  );

-- Trigger
CREATE TRIGGER quotes_updated_at BEFORE UPDATE ON quotes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER quotes_generate_number BEFORE INSERT ON quotes
  FOR EACH ROW EXECUTE FUNCTION generate_quote_number();

COMMENT ON TABLE quotes IS 'Customer quotes/devis with automatic numbering and status tracking';

-- ============================================
-- TABLE 5: QUOTE ITEMS (Lignes de devis)
-- ============================================

CREATE TABLE quote_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,

  -- Item Details
  description TEXT NOT NULL,
  quantity NUMERIC(10,2) NOT NULL DEFAULT 1,
  unit_price INTEGER NOT NULL, -- in cents
  line_total INTEGER NOT NULL, -- in cents

  -- Ordering
  position INTEGER DEFAULT 0
);

-- Index
CREATE INDEX idx_quote_items_quote ON quote_items(quote_id);

-- RLS (inherit from quotes)
ALTER TABLE quote_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Quote items viewable by staff" ON quote_items
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM quotes
      WHERE quotes.id = quote_items.quote_id
    )
  );

CREATE POLICY "Quote items manageable by admin" ON quote_items
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM quotes
      WHERE quotes.id = quote_items.quote_id
    ) AND
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('super_admin', 'admin')
  );

COMMENT ON TABLE quote_items IS 'Line items for quotes with pricing and quantities';

-- ============================================
-- TABLE 6: ACTIVITIES (Activity Log / Audit Trail)
-- ============================================

CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Who
  user_id UUID REFERENCES profiles(id),
  user_email TEXT,
  user_role TEXT,

  -- What
  action TEXT NOT NULL, -- 'created', 'updated', 'deleted', 'viewed', etc.
  entity_type TEXT NOT NULL, -- 'client', 'appointment', 'quote', etc.
  entity_id UUID NOT NULL,

  -- Details
  description TEXT,
  metadata JSONB, -- Additional context

  -- Request context
  ip_address TEXT,
  user_agent TEXT
);

-- Indexes
CREATE INDEX idx_activities_entity ON activities(entity_type, entity_id);
CREATE INDEX idx_activities_user ON activities(user_id);
CREATE INDEX idx_activities_created ON activities(created_at DESC);

-- RLS (only super_admin can view)
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Activities viewable by super_admin" ON activities
  FOR SELECT TO authenticated USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'super_admin'
  );

COMMENT ON TABLE activities IS 'Audit trail of all user actions for compliance and tracking';

-- ============================================
-- TABLE 7: NOTIFICATIONS (Email, SMS, WhatsApp queue)
-- ============================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Recipient
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  recipient_email TEXT,
  recipient_phone TEXT,

  -- Notification Details
  type TEXT NOT NULL, -- 'email', 'sms', 'whatsapp', 'push'
  template TEXT NOT NULL, -- 'booking_confirmation', 'quote_sent', etc.
  subject TEXT,
  message TEXT NOT NULL,

  -- Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed', 'bounced')),
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  error_message TEXT,

  -- Provider IDs (for tracking)
  provider_message_id TEXT,

  -- Metadata
  metadata JSONB
);

-- Indexes
CREATE INDEX idx_notifications_client ON notifications(client_id);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Notifications viewable by admin" ON notifications
  FOR SELECT TO authenticated USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('super_admin', 'admin')
  );

COMMENT ON TABLE notifications IS 'Notification queue for tracking all communications sent to clients';

-- ============================================
-- TABLE 8: SETTINGS (System Configuration)
-- ============================================

CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES profiles(id)
);

-- RLS
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Settings viewable by staff" ON settings
  FOR SELECT TO authenticated USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('super_admin', 'admin', 'manager')
  );

CREATE POLICY "Settings updatable by super_admin" ON settings
  FOR ALL TO authenticated USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'super_admin'
  );

-- Trigger
CREATE TRIGGER settings_updated_at BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

COMMENT ON TABLE settings IS 'System-wide configuration key-value store';

-- ============================================
-- DEFAULT SETTINGS
-- ============================================

INSERT INTO settings (key, value, description) VALUES
  ('company_name', '"AJ SRL"', 'Company legal name'),
  ('company_vat', '"BE0748911660"', 'Company VAT number'),
  ('company_address', '"Rue des colonies 11, 1000 Bruxelles, Belgique"', 'Company address'),
  ('default_quote_validity_days', '30', 'Default number of days before quote expires'),
  ('default_tax_rate', '21.00', 'Default VAT rate in Belgium (%)'),
  ('email_signature', '"L''équipe MonApplication.be"', 'Default email signature');

-- ============================================
-- MIGRATION COMPLETE
-- ============================================

COMMENT ON SCHEMA public IS 'MonApplicationBE Admin Panel Schema - v1.0';
