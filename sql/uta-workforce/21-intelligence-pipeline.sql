-- ============================================================================
-- 21-intelligence-pipeline.sql
-- Content Intelligence Pipeline — RSS articles, speaking opportunities,
-- and content calendar for zScale Capital's B2G marketing workflow.
--
-- Tables: intelligence_items, speaking_opportunities, content_calendar
-- Safe re-run: IF NOT EXISTS, ON CONFLICT DO NOTHING, DROP POLICY IF EXISTS
-- ============================================================================

-- ============================================================================
-- ENUM TYPES (guarded for safe re-runs)
-- ============================================================================

DO $$ BEGIN
  CREATE TYPE intelligence_relevance AS ENUM ('high', 'medium', 'low');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE intelligence_status AS ENUM ('new', 'reviewed', 'used', 'archived', 'priority');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE speaking_status AS ENUM ('researching', 'drafting', 'submitted', 'accepted', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE content_platform AS ENUM ('linkedin', 'twitter', 'blog', 'newsletter');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE content_status AS ENUM ('draft', 'scheduled', 'posted', 'skipped');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================================
-- TABLE 1: intelligence_items
-- RSS articles, news items, data releases, competitor intel
-- ============================================================================

CREATE TABLE IF NOT EXISTS intelligence_items (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title           TEXT NOT NULL,
  url             TEXT UNIQUE NOT NULL,
  source          TEXT NOT NULL,
  source_category TEXT NOT NULL,
  published_at    TIMESTAMPTZ,
  scraped_at      TIMESTAMPTZ DEFAULT now(),
  raw_content     TEXT,                        -- first ~500 chars of article
  summary         TEXT,                        -- AI-generated summary (Phase 4+)
  key_insight     TEXT,                        -- AI-extracted insight (Phase 4+)
  relevance       intelligence_relevance DEFAULT 'medium',
  status          intelligence_status DEFAULT 'new',
  topic_tags      TEXT[] DEFAULT '{}',
  audience_tags   TEXT[] DEFAULT '{}',
  repurpose_ideas TEXT,                        -- AI-suggested repurpose angles
  enriched_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_intelligence_items_status
  ON intelligence_items(status);
CREATE INDEX IF NOT EXISTS idx_intelligence_items_relevance
  ON intelligence_items(relevance);
CREATE INDEX IF NOT EXISTS idx_intelligence_items_scraped_at
  ON intelligence_items(scraped_at DESC);
CREATE INDEX IF NOT EXISTS idx_intelligence_items_source
  ON intelligence_items(source);
CREATE INDEX IF NOT EXISTS idx_intelligence_items_source_category
  ON intelligence_items(source_category);
CREATE INDEX IF NOT EXISTS idx_intelligence_items_topic_tags
  ON intelligence_items USING GIN(topic_tags);
CREATE INDEX IF NOT EXISTS idx_intelligence_items_audience_tags
  ON intelligence_items USING GIN(audience_tags);
CREATE INDEX IF NOT EXISTS idx_intelligence_items_url
  ON intelligence_items(url);
CREATE INDEX IF NOT EXISTS idx_intelligence_items_published_at
  ON intelligence_items(published_at DESC);

-- Trigger: auto-update updated_at (reuses existing function from 01-schema.sql)
DROP TRIGGER IF EXISTS intelligence_items_updated_at ON intelligence_items;
CREATE TRIGGER intelligence_items_updated_at
  BEFORE UPDATE ON intelligence_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE intelligence_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anonymous read on intelligence_items" ON intelligence_items;
CREATE POLICY "Allow anonymous read on intelligence_items" ON intelligence_items
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow anonymous insert on intelligence_items" ON intelligence_items;
CREATE POLICY "Allow anonymous insert on intelligence_items" ON intelligence_items
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anonymous update on intelligence_items" ON intelligence_items;
CREATE POLICY "Allow anonymous update on intelligence_items" ON intelligence_items
  FOR UPDATE USING (true) WITH CHECK (true);

-- ============================================================================
-- TABLE 2: speaking_opportunities
-- Conferences, CFPs, events for founder speaking track
-- ============================================================================

CREATE TABLE IF NOT EXISTS speaking_opportunities (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conference_name   TEXT NOT NULL,
  organizer         TEXT,
  cfp_url           TEXT,
  cfp_deadline      DATE,
  event_date_start  DATE,
  event_date_end    DATE,
  location          TEXT,
  audience_size     INTEGER,
  status            speaking_status DEFAULT 'researching',
  proposal_title    TEXT,
  proposal_abstract TEXT,
  estimated_cost    NUMERIC(10,2),
  notes             TEXT,
  topic_tags        TEXT[] DEFAULT '{}',
  intelligence_item_id UUID REFERENCES intelligence_items(id) ON DELETE SET NULL,
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_speaking_opportunities_status
  ON speaking_opportunities(status);
CREATE INDEX IF NOT EXISTS idx_speaking_opportunities_cfp_deadline
  ON speaking_opportunities(cfp_deadline);
CREATE INDEX IF NOT EXISTS idx_speaking_opportunities_event_date
  ON speaking_opportunities(event_date_start);

-- Trigger
DROP TRIGGER IF EXISTS speaking_opportunities_updated_at ON speaking_opportunities;
CREATE TRIGGER speaking_opportunities_updated_at
  BEFORE UPDATE ON speaking_opportunities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE speaking_opportunities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anonymous read on speaking_opportunities" ON speaking_opportunities;
CREATE POLICY "Allow anonymous read on speaking_opportunities" ON speaking_opportunities
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow anonymous insert on speaking_opportunities" ON speaking_opportunities;
CREATE POLICY "Allow anonymous insert on speaking_opportunities" ON speaking_opportunities
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anonymous update on speaking_opportunities" ON speaking_opportunities;
CREATE POLICY "Allow anonymous update on speaking_opportunities" ON speaking_opportunities
  FOR UPDATE USING (true) WITH CHECK (true);

-- ============================================================================
-- TABLE 3: content_calendar
-- LinkedIn drafts, scheduled posts, content planning
-- ============================================================================

CREATE TABLE IF NOT EXISTS content_calendar (
  id                   UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  intelligence_item_id UUID REFERENCES intelligence_items(id) ON DELETE SET NULL,
  platform             content_platform NOT NULL,
  content_pillar       TEXT,
  draft_text           TEXT,
  final_text           TEXT,
  scheduled_date       DATE,
  posted_at            TIMESTAMPTZ,
  status               content_status DEFAULT 'draft',
  engagement_notes     TEXT,
  topic_tags           TEXT[] DEFAULT '{}',
  created_at           TIMESTAMPTZ DEFAULT now(),
  updated_at           TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_content_calendar_status
  ON content_calendar(status);
CREATE INDEX IF NOT EXISTS idx_content_calendar_scheduled_date
  ON content_calendar(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_content_calendar_platform
  ON content_calendar(platform);
CREATE INDEX IF NOT EXISTS idx_content_calendar_intelligence_item
  ON content_calendar(intelligence_item_id);

-- Trigger
DROP TRIGGER IF EXISTS content_calendar_updated_at ON content_calendar;
CREATE TRIGGER content_calendar_updated_at
  BEFORE UPDATE ON content_calendar
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE content_calendar ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anonymous read on content_calendar" ON content_calendar;
CREATE POLICY "Allow anonymous read on content_calendar" ON content_calendar
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow anonymous insert on content_calendar" ON content_calendar;
CREATE POLICY "Allow anonymous insert on content_calendar" ON content_calendar
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anonymous update on content_calendar" ON content_calendar;
CREATE POLICY "Allow anonymous update on content_calendar" ON content_calendar
  FOR UPDATE USING (true) WITH CHECK (true);

-- ============================================================================
-- VERIFICATION
-- ============================================================================

SELECT 'intelligence_items' AS table_name, count(*) FROM intelligence_items
UNION ALL
SELECT 'speaking_opportunities', count(*) FROM speaking_opportunities
UNION ALL
SELECT 'content_calendar', count(*) FROM content_calendar;
