"""
RSS Intelligence Ingest Pipeline
Fetches RSS feeds from feeds.json, deduplicates by URL, auto-tags by topic
and audience keywords, and stores items in Supabase intelligence_items table.

Usage:
  python scripts/intelligence/rss_ingest.py              # Full run
  python scripts/intelligence/rss_ingest.py --dry-run     # Preview without inserting
  python scripts/intelligence/rss_ingest.py --category local_dfw  # Single category

Prerequisites:
  pip install -r scripts/requirements.txt
  SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env
"""

import argparse
import json
import os
import re
import urllib.request
from datetime import datetime, timezone

import feedparser
from dotenv import load_dotenv
from supabase import create_client

# Load .env from project root
load_dotenv(os.path.join(os.path.dirname(__file__), "..", "..", ".env"))

SUPABASE_URL = os.environ.get("SUPABASE_URL", os.environ.get("VITE_SUPABASE_URL", ""))
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")

FEEDS_PATH = os.path.join(os.path.dirname(__file__), "feeds.json")
PLACEHOLDER_URL = "PASTE_YOUR_GOOGLE_ALERT_RSS_URL_HERE"
MAX_RAW_CONTENT = 500
FEED_TIMEOUT_SECONDS = 30


def load_feeds(category_filter: str | None = None) -> tuple[list[dict], dict]:
    """Load feeds.json and return (feeds_list, tag_mapping)."""
    with open(FEEDS_PATH, "r") as f:
        config = json.load(f)

    feeds = config["feeds"]
    tag_mapping = config["tag_mapping"]

    # Skip placeholder URLs
    feeds = [fd for fd in feeds if fd["url"] != PLACEHOLDER_URL]

    if category_filter:
        feeds = [fd for fd in feeds if fd["category"] == category_filter]

    return feeds, tag_mapping


def auto_tag(text: str, tag_mapping: dict) -> tuple[list[str], list[str]]:
    """Scan text against keyword mappings, return (topic_tags, audience_tags)."""
    text_lower = text.lower()

    topic_tags = []
    for tag, keywords in tag_mapping.get("topic_keywords", {}).items():
        for kw in keywords:
            if kw in text_lower:
                topic_tags.append(tag)
                break

    audience_tags = []
    for tag, keywords in tag_mapping.get("audience_keywords", {}).items():
        for kw in keywords:
            if kw in text_lower:
                audience_tags.append(tag)
                break

    return topic_tags, audience_tags


def parse_published(entry) -> str | None:
    """Extract published date from feed entry as ISO string."""
    published_parsed = entry.get("published_parsed") or entry.get("updated_parsed")
    if published_parsed:
        try:
            dt = datetime(*published_parsed[:6], tzinfo=timezone.utc)
            return dt.isoformat()
        except Exception:
            pass
    return None


def get_raw_content(entry) -> str:
    """Extract first N chars of content from feed entry."""
    content = ""
    if hasattr(entry, "content") and entry.content:
        content = entry.content[0].get("value", "")
    elif hasattr(entry, "summary"):
        content = entry.get("summary", "")
    elif hasattr(entry, "description"):
        content = entry.get("description", "")

    # Strip HTML tags
    content = re.sub(r"<[^>]+>", " ", content)
    content = re.sub(r"\s+", " ", content).strip()
    return content[:MAX_RAW_CONTENT]


def fetch_existing_urls(sb) -> set[str]:
    """Batch-fetch all existing URLs from intelligence_items for dedup."""
    result = sb.table("intelligence_items").select("url").execute()
    return {row["url"] for row in result.data}


def process_feed(feed_config: dict, tag_mapping: dict, existing_urls: set[str]) -> list[dict]:
    """Parse a single RSS feed and return list of new items to insert."""
    name = feed_config["name"]
    url = feed_config["url"]
    category = feed_config["category"]
    priority = feed_config["priority"]

    try:
        response = urllib.request.urlopen(url, timeout=FEED_TIMEOUT_SECONDS)
        raw_feed = response.read()
        parsed = feedparser.parse(raw_feed)
    except urllib.error.URLError as e:
        print(f"  TIMEOUT/ERROR fetching {name}: {e.reason}")
        return []
    except Exception as e:
        print(f"  ERROR fetching {name}: {e}")
        return []

    if parsed.bozo and not parsed.entries:
        print(f"  WARNING: {name} — feed parse error: {parsed.bozo_exception}")
        return []

    new_items = []
    for entry in parsed.entries:
        entry_url = entry.get("link", "").strip()
        if not entry_url or entry_url in existing_urls:
            continue

        title = entry.get("title", "").strip()
        if not title:
            continue

        raw_content = get_raw_content(entry)
        tag_text = f"{title} {raw_content}"
        topic_tags, audience_tags = auto_tag(tag_text, tag_mapping)

        item = {
            "title": title,
            "url": entry_url,
            "source": name,
            "source_category": category,
            "published_at": parse_published(entry),
            "raw_content": raw_content if raw_content else None,
            "relevance": priority,
            "status": "new",
            "topic_tags": topic_tags,
            "audience_tags": audience_tags,
        }

        new_items.append(item)
        existing_urls.add(entry_url)  # prevent cross-feed duplicates

    return new_items


def main():
    parser = argparse.ArgumentParser(description="RSS Intelligence Ingest Pipeline")
    parser.add_argument("--dry-run", action="store_true", help="Preview without inserting")
    parser.add_argument("--category", type=str, help="Only process feeds from this category")
    args = parser.parse_args()

    print("=== RSS Intelligence Ingest ===")
    print(f"Date: {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}")
    if args.dry_run:
        print("MODE: Dry run (no database writes)")
    if args.category:
        print(f"FILTER: category={args.category}")
    print()

    # Load feed config
    feeds, tag_mapping = load_feeds(args.category)
    print(f"Feeds to process: {len(feeds)}")

    if not feeds:
        print("No feeds found. Check feeds.json or --category filter.")
        return

    # Connect to Supabase (skip in dry-run if no credentials)
    sb = None
    existing_urls: set[str] = set()

    if not args.dry_run:
        if not SUPABASE_URL or not SUPABASE_KEY:
            print("ERROR: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required.")
            print("Set them in .env or environment variables.")
            return
        sb = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("Fetching existing URLs for dedup...")
        existing_urls = fetch_existing_urls(sb)
        print(f"Existing items in database: {len(existing_urls)}")
    print()

    # Process feeds
    total_new = 0
    total_skipped = 0
    total_errors = 0
    all_new_items: list[dict] = []

    for feed in feeds:
        print(f"Processing: {feed['name']} ({feed['category']})...")
        try:
            new_items = process_feed(feed, tag_mapping, existing_urls)
            if new_items:
                all_new_items.extend(new_items)
                total_new += len(new_items)
                print(f"  -> {len(new_items)} new items")
            else:
                print(f"  -> 0 new items")
        except Exception as e:
            print(f"  ERROR: {e}")
            total_errors += 1

    # Insert into Supabase
    if all_new_items and not args.dry_run and sb:
        print(f"\nInserting {len(all_new_items)} items into intelligence_items...")
        try:
            result = sb.table("intelligence_items").upsert(
                all_new_items, on_conflict="url"
            ).execute()
            print(f"Upserted {len(result.data)} rows.")
        except Exception as e:
            print(f"ERROR inserting: {e}")
            total_errors += 1

    if args.dry_run and all_new_items:
        print(f"\n--- Dry Run Preview ({len(all_new_items)} items) ---")
        for item in all_new_items[:10]:
            tags = ", ".join(item["topic_tags"]) if item["topic_tags"] else "(none)"
            print(f"  [{item['source_category']}] {item['title'][:80]}")
            print(f"    Tags: {tags}")
        if len(all_new_items) > 10:
            print(f"  ... and {len(all_new_items) - 10} more")

    # Summary
    print(f"\n=== Summary ===")
    print(f"Feeds processed: {len(feeds)}")
    print(f"New items:       {total_new}")
    print(f"Errors:          {total_errors}")


if __name__ == "__main__":
    main()
