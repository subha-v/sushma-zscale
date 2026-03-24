-- ============================================================================
-- 20-demo-leads-table.sql
-- Lead capture for demo access — stores prospect info before granting access
-- ============================================================================

CREATE TABLE IF NOT EXISTS demo_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  institution TEXT NOT NULL,
  role_title TEXT NOT NULL,
  email_domain TEXT GENERATED ALWAYS AS (split_part(email, '@', 2)) STORED,
  is_edu_email BOOLEAN GENERATED ALWAYS AS (email LIKE '%.edu' OR email LIKE '%.edu.%') STORED,
  is_gov_email BOOLEAN GENERATED ALWAYS AS (email LIKE '%.gov' OR email LIKE '%.gov.%' OR email LIKE '%.mil' OR email LIKE '%.mil.%') STORED,
  source TEXT DEFAULT 'preview_page',
  sessions_count INTEGER DEFAULT 0,
  last_visited_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE demo_leads ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (lead capture form uses anon key)
DROP POLICY IF EXISTS "Allow anonymous insert on demo_leads" ON demo_leads;
CREATE POLICY "Allow anonymous insert on demo_leads" ON demo_leads
  FOR INSERT WITH CHECK (true);

-- Only service role can read/update leads (admin/analytics)
DROP POLICY IF EXISTS "Service role full access on demo_leads" ON demo_leads;
CREATE POLICY "Service role full access on demo_leads" ON demo_leads
  FOR ALL USING (auth.role() = 'service_role');

-- Index for lead scoring queries
CREATE INDEX IF NOT EXISTS idx_demo_leads_email ON demo_leads(email);
CREATE INDEX IF NOT EXISTS idx_demo_leads_domain ON demo_leads(email_domain);
CREATE INDEX IF NOT EXISTS idx_demo_leads_created ON demo_leads(created_at DESC);
