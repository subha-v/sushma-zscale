-- =============================================================================
-- 25. Tool Waitlist Table
-- Captures email signups for upcoming tool pages
-- =============================================================================

CREATE TABLE IF NOT EXISTS tool_waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  tool_key TEXT NOT NULL,
  email_domain TEXT GENERATED ALWAYS AS (split_part(email, '@', 2)) STORED,
  is_edu_email BOOLEAN GENERATED ALWAYS AS (email LIKE '%.edu') STORED,
  is_gov_email BOOLEAN GENERATED ALWAYS AS (email LIKE '%.gov' OR email LIKE '%.us' OR email LIKE '%.mil') STORED,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(email, tool_key)
);

ALTER TABLE tool_waitlist ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anon insert" ON tool_waitlist;
CREATE POLICY "Allow anon insert" ON tool_waitlist FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Allow service role read" ON tool_waitlist;
CREATE POLICY "Allow service role read" ON tool_waitlist FOR SELECT TO service_role USING (true);

CREATE INDEX IF NOT EXISTS idx_tool_waitlist_tool_key ON tool_waitlist(tool_key);
CREATE INDEX IF NOT EXISTS idx_tool_waitlist_email ON tool_waitlist(email);
