"""
Intelligence Item Enrichment Pipeline
Fetches intelligence_items with status='new', sends each to Claude Haiku
for summarization, and updates enrichment columns in Supabase.

Usage:
  python scripts/intelligence/enrich_items.py              # Enrich up to 50 items
  python scripts/intelligence/enrich_items.py --dry-run     # Preview without updating
  python scripts/intelligence/enrich_items.py --limit 10    # Enrich up to 10 items

Prerequisites:
  pip install -r scripts/requirements.txt
  ANTHROPIC_API_KEY, SUPABASE_URL, and SUPABASE_SERVICE_ROLE_KEY in .env
"""

import argparse
import json
import os
import time
from datetime import datetime, timezone

from anthropic import Anthropic
from dotenv import load_dotenv
from supabase import create_client

# Load .env from project root
load_dotenv(os.path.join(os.path.dirname(__file__), "..", "..", ".env"))

SUPABASE_URL = os.environ.get("SUPABASE_URL", os.environ.get("VITE_SUPABASE_URL", ""))
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")

ENRICHMENT_MODEL = "claude-haiku-4-5-20251001"
RATE_LIMIT_SLEEP = 0.5  # seconds between API calls

ENRICHMENT_PROMPT = """Analyze this article and return a JSON object with exactly these fields:

1. "summary": A 2-3 sentence summary of the article's key points.
2. "key_insight": One actionable takeaway relevant to workforce development, higher education, or economic development professionals.
3. "repurpose_ideas": 2-3 content angles this could be repurposed into (LinkedIn post, newsletter blurb, conference talking point, etc.).

Article title: {title}
Article content: {content}

Return ONLY valid JSON, no markdown fences or extra text."""


def fetch_new_items(sb, limit: int) -> list[dict]:
    """Fetch intelligence_items with status='new', ordered by scraped_at."""
    result = (
        sb.table("intelligence_items")
        .select("id, title, raw_content, source, source_category")
        .eq("status", "new")
        .order("scraped_at", desc=True)
        .limit(limit)
        .execute()
    )
    return result.data


def enrich_item(client: Anthropic, item: dict) -> dict | None:
    """Call Claude Haiku to generate summary, key_insight, and repurpose_ideas."""
    title = item.get("title", "")
    content = item.get("raw_content", "") or ""

    if not title:
        return None

    prompt = ENRICHMENT_PROMPT.format(title=title, content=content)

    try:
        response = client.messages.create(
            model=ENRICHMENT_MODEL,
            max_tokens=512,
            messages=[{"role": "user", "content": prompt}],
        )

        text = response.content[0].text.strip()
        # Strip markdown fences if present
        if text.startswith("```"):
            text = text.split("\n", 1)[1] if "\n" in text else text[3:]
        if text.endswith("```"):
            text = text[:-3].strip()
        if text.startswith("json"):
            text = text[4:].strip()

        parsed = json.loads(text)
        return {
            "summary": parsed.get("summary", ""),
            "key_insight": parsed.get("key_insight", ""),
            "repurpose_ideas": parsed.get("repurpose_ideas", ""),
        }
    except json.JSONDecodeError as e:
        print(f"  JSON parse error: {e}")
        return None
    except Exception as e:
        print(f"  API error: {e}")
        return None


def update_item(sb, item_id: str, enrichment: dict) -> bool:
    """Update intelligence_item with enrichment data."""
    try:
        # Convert repurpose_ideas list to string if needed
        repurpose = enrichment.get("repurpose_ideas", "")
        if isinstance(repurpose, list):
            repurpose = "; ".join(repurpose)

        sb.table("intelligence_items").update(
            {
                "summary": enrichment["summary"],
                "key_insight": enrichment["key_insight"],
                "repurpose_ideas": repurpose,
                "enriched_at": datetime.now(timezone.utc).isoformat(),
                "status": "reviewed",
            }
        ).eq("id", item_id).execute()
        return True
    except Exception as e:
        print(f"  Update error: {e}")
        return False


def main():
    parser = argparse.ArgumentParser(description="Intelligence Item Enrichment Pipeline")
    parser.add_argument("--dry-run", action="store_true", help="Preview without updating")
    parser.add_argument("--limit", type=int, default=50, help="Max items to enrich (default 50)")
    args = parser.parse_args()

    print("=== Intelligence Enrichment Pipeline ===")
    print(f"Date: {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}")
    print(f"Model: {ENRICHMENT_MODEL}")
    if args.dry_run:
        print("MODE: Dry run (no database writes)")
    print(f"Limit: {args.limit}")
    print()

    # Validate credentials
    if not ANTHROPIC_API_KEY:
        print("ERROR: ANTHROPIC_API_KEY required.")
        print("Set it in .env or environment variables.")
        return

    if not args.dry_run and (not SUPABASE_URL or not SUPABASE_KEY):
        print("ERROR: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required.")
        print("Set them in .env or environment variables.")
        return

    # Connect
    sb = create_client(SUPABASE_URL, SUPABASE_KEY)
    client = Anthropic(api_key=ANTHROPIC_API_KEY)

    # Fetch new items
    print("Fetching unenriched items...")
    items = fetch_new_items(sb, args.limit)
    print(f"Found {len(items)} items with status='new'")
    print()

    if not items:
        print("No items to enrich. Done.")
        return

    # Process items
    enriched_count = 0
    error_count = 0

    for i, item in enumerate(items, 1):
        title = item["title"][:80]
        print(f"[{i}/{len(items)}] {title}...")

        enrichment = enrich_item(client, item)

        if enrichment:
            if args.dry_run:
                print(f"  Summary: {enrichment['summary'][:100]}...")
                print(f"  Insight: {enrichment['key_insight'][:100]}...")
                enriched_count += 1
            else:
                if update_item(sb, item["id"], enrichment):
                    enriched_count += 1
                    print(f"  Enriched and updated.")
                else:
                    error_count += 1
        else:
            error_count += 1

        # Rate limiting
        if i < len(items):
            time.sleep(RATE_LIMIT_SLEEP)

    # Summary
    print(f"\n=== Summary ===")
    print(f"Items processed: {len(items)}")
    print(f"Enriched:        {enriched_count}")
    print(f"Errors:          {error_count}")


if __name__ == "__main__":
    main()
