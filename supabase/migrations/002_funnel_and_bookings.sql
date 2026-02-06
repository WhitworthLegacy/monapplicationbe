-- ============================================
-- Funnel Leads & Bookings Schema
-- MonApplicationBE - Diagnostic Funnel
-- ============================================

-- ============================================
-- TABLE: FUNNEL_LEADS
-- Stores all diagnostic funnel completions
-- ============================================

CREATE TABLE funnel_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Contact Info (filled at step 8)
  name TEXT,
  email TEXT,
  phone TEXT,
  company TEXT,

  -- Funnel Answers
  sector TEXT,                    -- Category: artisan, atelier, bien_etre, services, restauration, autre
  metier TEXT,                    -- Specific métier
  admin_hours TEXT,               -- <5h, 5-10h, 10-15h, 15h+
  has_secretary BOOLEAN,          -- true/false
  pain_points TEXT[],             -- Array of selected pain points
  pain_story TEXT,                -- Free-text painful moment description
  current_tools TEXT[],           -- Array of current tools
  clients_per_month TEXT,         -- <10, 10-30, 30-50, 50+

  -- Computed Metrics
  hours_lost_year INTEGER,
  money_lost_year INTEGER,

  -- Tracking
  completed_step INTEGER DEFAULT 0,
  has_booked BOOLEAN DEFAULT FALSE,
  email_sequence TEXT,            -- 'not_booked' or 'booked'
  emails_sent INTEGER DEFAULT 0,
  last_email_at TIMESTAMPTZ,

  -- CRM Link
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL
);

-- Indexes
CREATE INDEX idx_funnel_leads_email ON funnel_leads(email);
CREATE INDEX idx_funnel_leads_email_sequence ON funnel_leads(email_sequence);
CREATE INDEX idx_funnel_leads_has_booked ON funnel_leads(has_booked);
CREATE INDEX idx_funnel_leads_created_at ON funnel_leads(created_at);

-- RLS
ALTER TABLE funnel_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Funnel leads viewable by authenticated users" ON funnel_leads
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Funnel leads insertable by anyone" ON funnel_leads
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Funnel leads updatable by authenticated users" ON funnel_leads
  FOR UPDATE TO authenticated USING (true);

-- Updated_at trigger
CREATE TRIGGER funnel_leads_updated_at BEFORE UPDATE ON funnel_leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

COMMENT ON TABLE funnel_leads IS 'Diagnostic funnel submissions with prospect qualification data';

-- ============================================
-- TABLE: BOOKINGS
-- Discovery call bookings linked to Google Calendar
-- ============================================

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Link to funnel
  funnel_lead_id UUID REFERENCES funnel_leads(id) ON DELETE SET NULL,

  -- Contact (duplicated for standalone bookings)
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,

  -- Booking Details
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  timezone TEXT DEFAULT 'Europe/Brussels',

  -- Google Calendar Integration
  google_event_id TEXT,
  google_meet_link TEXT,

  -- Status
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed', 'no_show')),
  notes TEXT
);

-- Indexes
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_funnel_lead ON bookings(funnel_lead_id);
CREATE INDEX idx_bookings_email ON bookings(email);

-- RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Bookings viewable by authenticated users" ON bookings
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Bookings insertable by anyone" ON bookings
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Bookings updatable by authenticated users" ON bookings
  FOR UPDATE TO authenticated USING (true);

-- Updated_at trigger
CREATE TRIGGER bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

COMMENT ON TABLE bookings IS 'Discovery call bookings with Google Calendar integration';
