"""
Skills Trend Analysis Pipeline
Analyzes skills_trend_snapshots over a 12-week window to flag
skills as emerging or declining using linear regression.

Usage: python scripts/compute_skills_trends.py
Schedule: Weekly (after scrape_jobs.py)
"""

import os
from datetime import date, timedelta

import numpy as np
from dotenv import load_dotenv
from supabase import create_client

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]

# Thresholds for classification
EMERGING_SLOPE_THRESHOLD = 0.15     # Posting % growth per week
DECLINING_SLOPE_THRESHOLD = -0.10   # Posting % decline per week
MIN_SNAPSHOTS_EMERGING = 4          # Need at least 4 data points
MIN_SNAPSHOTS_DECLINING = 8         # Need 8+ declining weeks to flag


def linear_slope(x: list[float], y: list[float]) -> float:
    """Compute slope of linear regression using least squares."""
    if len(x) < 2:
        return 0.0
    x_arr = np.array(x, dtype=float)
    y_arr = np.array(y, dtype=float)
    n = len(x_arr)
    sum_x = np.sum(x_arr)
    sum_y = np.sum(y_arr)
    sum_xy = np.sum(x_arr * y_arr)
    sum_x2 = np.sum(x_arr ** 2)
    denom = n * sum_x2 - sum_x ** 2
    if denom == 0:
        return 0.0
    return float((n * sum_xy - sum_x * sum_y) / denom)


def main():
    print("=== Skills Trend Analysis ===")
    print(f"Date: {date.today()}")

    sb = create_client(SUPABASE_URL, SUPABASE_KEY)

    # Get all skills
    skills_resp = sb.table("skills_catalog").select("id, skill_name, is_emerging, is_declining").execute()
    skills = skills_resp.data
    print(f"Analyzing {len(skills)} skills")

    # Get snapshots from past 12 weeks
    cutoff = (date.today() - timedelta(weeks=12)).isoformat()
    snapshots_resp = (
        sb.table("skills_trend_snapshots")
        .select("skill_id, snapshot_date, posting_percentage")
        .gte("snapshot_date", cutoff)
        .order("snapshot_date")
        .execute()
    )

    # Group snapshots by skill_id
    snapshots_by_skill: dict[str, list[dict]] = {}
    for s in snapshots_resp.data:
        sid = s["skill_id"]
        if sid not in snapshots_by_skill:
            snapshots_by_skill[sid] = []
        snapshots_by_skill[sid].append(s)

    updates_emerging = []
    updates_declining = []

    for skill in skills:
        skill_id = skill["id"]
        skill_name = skill["skill_name"]
        snaps = snapshots_by_skill.get(skill_id, [])

        if len(snaps) < 2:
            continue

        # Convert snapshot dates to week indices for regression
        base_date = date.fromisoformat(snaps[0]["snapshot_date"])
        x_weeks = []
        y_pcts = []
        for s in snaps:
            d = date.fromisoformat(s["snapshot_date"])
            week_idx = (d - base_date).days / 7.0
            x_weeks.append(week_idx)
            y_pcts.append(float(s["posting_percentage"]))

        slope = linear_slope(x_weeks, y_pcts)

        # Determine emerging/declining status
        should_be_emerging = slope >= EMERGING_SLOPE_THRESHOLD and len(snaps) >= MIN_SNAPSHOTS_EMERGING
        should_be_declining = slope <= DECLINING_SLOPE_THRESHOLD and len(snaps) >= MIN_SNAPSHOTS_DECLINING

        if should_be_emerging != skill["is_emerging"]:
            updates_emerging.append({
                "id": skill_id,
                "name": skill_name,
                "is_emerging": should_be_emerging,
                "slope": slope,
            })

        if should_be_declining != skill["is_declining"]:
            updates_declining.append({
                "id": skill_id,
                "name": skill_name,
                "is_declining": should_be_declining,
                "slope": slope,
            })

    # Apply updates
    print(f"\nEmerging status changes: {len(updates_emerging)}")
    for u in updates_emerging:
        action = "FLAGGED" if u["is_emerging"] else "UNFLAGGED"
        print(f"  {action} emerging: {u['name']} (slope={u['slope']:.3f})")
        sb.table("skills_catalog").update({"is_emerging": u["is_emerging"]}).eq("id", u["id"]).execute()

    print(f"\nDeclining status changes: {len(updates_declining)}")
    for u in updates_declining:
        action = "FLAGGED" if u["is_declining"] else "UNFLAGGED"
        print(f"  {action} declining: {u['name']} (slope={u['slope']:.3f})")
        sb.table("skills_catalog").update({"is_declining": u["is_declining"]}).eq("id", u["id"]).execute()

    print("\n=== Summary ===")
    print(f"Skills analyzed: {len(skills)}")
    print(f"Skills with snapshots: {len(snapshots_by_skill)}")
    print(f"Emerging status changes: {len(updates_emerging)}")
    print(f"Declining status changes: {len(updates_declining)}")


if __name__ == "__main__":
    main()
