# Intelligence Pipeline — RSS Ingest

Aggregates RSS feeds from DFW business journals, Texas state sources, higher ed publications, federal data releases, competitor blogs, and HR/employer outlets. Items are deduplicated by URL, auto-tagged by topic and audience, and stored in Supabase `intelligence_items`.

## Setup

```bash
pip install -r scripts/requirements.txt
```

Required environment variables (in `.env` at repo root):
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

Run the SQL schema first:
```
sql/uta-workforce/21-intelligence-pipeline.sql
```

## Usage

```bash
# Full ingest
python scripts/intelligence/rss_ingest.py

# Preview without writing to database
python scripts/intelligence/rss_ingest.py --dry-run

# Process only one category
python scripts/intelligence/rss_ingest.py --category data_releases
```

## Feed Configuration

Edit `feeds.json` to add/remove RSS sources. Each feed entry:

| Field | Required | Description |
|-------|----------|-------------|
| `name` | yes | Human-readable source name |
| `url` | yes | RSS/Atom feed URL |
| `category` | yes | One of: `local_dfw`, `texas_state`, `national_higher_ed`, `national_workforce`, `data_releases`, `competitors`, `hr_employers`, `google_alerts` |
| `priority` | yes | `high` or `medium` — maps to `relevance` column |
| `notes` | no | Setup instructions (e.g., for Google Alerts) |

### Google Alerts

To add Google Alerts as feeds:
1. Go to https://www.google.com/alerts
2. Create an alert (e.g., "workforce intelligence platform")
3. Click the pencil icon → Deliver to: RSS feed
4. Copy the RSS URL and replace `PASTE_YOUR_GOOGLE_ALERT_RSS_URL_HERE` in `feeds.json`

## Auto-Tagging

The `tag_mapping` section in `feeds.json` defines keyword-to-tag mappings scanned against each item's title and content:

- **topic_keywords**: workforce_development, skills_gap, hb8_funding, economic_development, higher_ed, ai_technology, labor_market, competitor_intel
- **audience_keywords**: university, community_college, edc, workforce_board, employer_hr

Tags are stored as PostgreSQL text arrays with GIN indexes for fast filtering.

## Database Tables

| Table | Purpose |
|-------|---------|
| `intelligence_items` | RSS articles, news, data releases |
| `speaking_opportunities` | Conferences and CFP tracking |
| `content_calendar` | LinkedIn/blog post drafts and scheduling |
