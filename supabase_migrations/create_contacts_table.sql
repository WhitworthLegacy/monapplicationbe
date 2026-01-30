-- Create contacts table for website contact form submissions
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Contact Info
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  message TEXT NOT NULL,

  -- Tracking
  source TEXT DEFAULT 'website_contact_form',
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'closed')),

  -- Metadata
  assigned_to UUID REFERENCES profiles(id),
  notes TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
CREATE INDEX IF NOT EXISTS idx_contacts_created ON contacts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_assigned ON contacts(assigned_to);

-- Full-text search
CREATE INDEX IF NOT EXISTS idx_contacts_search ON contacts USING gin(to_tsvector('french',
  coalesce(full_name, '') || ' ' ||
  coalesce(email, '') || ' ' ||
  coalesce(company, '') || ' ' ||
  coalesce(message, '')
));

-- RLS (Row Level Security)
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public inserts (from website)
CREATE POLICY "Allow public contact form submissions" ON contacts
  FOR INSERT TO anon
  WITH CHECK (true);

-- Policy: Staff can view all contacts
CREATE POLICY "Contacts viewable by staff" ON contacts
  FOR SELECT TO authenticated
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('super_admin', 'admin', 'manager', 'staff')
  );

-- Policy: Staff can update contacts
CREATE POLICY "Contacts updatable by staff" ON contacts
  FOR UPDATE TO authenticated
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('super_admin', 'admin', 'manager')
  );

-- Policy: Only admin can delete
CREATE POLICY "Contacts deletable by admin" ON contacts
  FOR DELETE TO authenticated
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('super_admin', 'admin')
  );

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_contacts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER contacts_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_contacts_updated_at();

-- Comment
COMMENT ON TABLE contacts IS 'Contact form submissions from the website';
