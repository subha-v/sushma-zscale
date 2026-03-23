"""
Employer Hiring Prediction Pipeline
Classifies employer hiring outlook based on current job openings,
industry growth rates, and development projects.

Usage: python scripts/predict_employer_hiring.py
Schedule: Monthly (1st of each month via GitHub Actions)
"""

import os
from datetime import date

from dotenv import load_dotenv
from supabase import create_client

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]


def classify_outlook(
    active_openings: int,
    employee_count: int,
    industry_growth: float,
    has_dev_project: bool,
) -> str:
    """Classify hiring outlook based on multiple signals."""
    score = 0

    # Opening rate (openings as % of workforce)
    if employee_count > 0:
        opening_rate = (active_openings / employee_count) * 100
        if opening_rate >= 3.0:
            score += 3
        elif opening_rate >= 1.5:
            score += 2
        elif opening_rate >= 0.5:
            score += 1

    # Industry growth rate
    if industry_growth >= 5.0:
        score += 3
    elif industry_growth >= 3.0:
        score += 2
    elif industry_growth >= 1.0:
        score += 1

    # Development project boost
    if has_dev_project:
        score += 1

    # Classify
    if score >= 5:
        return "rapidly_growing"
    elif score >= 3:
        return "growing"
    elif score >= 1:
        return "stable"
    else:
        return "declining"


def main():
    print("=== Employer Hiring Prediction Pipeline ===")
    print(f"Date: {date.today()}")

    sb = create_client(SUPABASE_URL, SUPABASE_KEY)
    prediction_date = date.today().isoformat()

    # Fetch data
    employers = sb.table("arlington_employers").select("*").execute().data
    job_openings = sb.table("arlington_job_openings").select("*").eq("is_active", True).execute().data
    industries = sb.table("arlington_industries").select("*").execute().data
    development = sb.table("arlington_development").select("*").execute().data

    print(f"Employers: {len(employers)}")
    print(f"Active openings: {len(job_openings)}")

    # Build lookups
    industry_growth = {}
    for ind in industries:
        industry_growth[ind["industry_name"]] = float(ind.get("growth_rate", 0))

    openings_by_employer: dict[str, int] = {}
    for jo in job_openings:
        eid = jo["employer_id"]
        count = jo.get("openings_count", 1)
        openings_by_employer[eid] = openings_by_employer.get(eid, 0) + count

    # Check which employers have associated development projects
    dev_employers = set()
    for d in development:
        developer = d.get("developer", "").lower()
        for e in employers:
            if e["company_name"].lower() in developer or developer in e["company_name"].lower():
                dev_employers.add(e["id"])

    predictions = []
    for emp in employers:
        emp_id = emp["id"]
        active_openings = openings_by_employer.get(emp_id, 0)
        employee_count = emp.get("employee_count", 0)
        industry = emp.get("industry", "")

        # Find matching industry growth rate
        growth = 0.0
        for ind_name, rate in industry_growth.items():
            if ind_name.lower() in industry.lower() or industry.lower() in ind_name.lower():
                growth = rate
                break

        has_dev = emp_id in dev_employers
        outlook = classify_outlook(active_openings, employee_count, growth, has_dev)

        # Project openings
        growth_multiplier = 1 + (growth / 100)
        proj_6mo = int(active_openings * growth_multiplier * 0.5) if active_openings > 0 else int(employee_count * 0.005)
        proj_12mo = int(active_openings * growth_multiplier) if active_openings > 0 else int(employee_count * 0.01)

        # Build factors
        factors = {}
        if growth > 3:
            factors["industry_growth"] = f"{industry} sector growing at {growth}%"
        if has_dev:
            factors["development_project"] = "Active economic development project"
        if active_openings > 10:
            factors["active_hiring"] = f"{active_openings} active job openings"

        # Confidence
        has_openings_data = active_openings > 0
        has_industry_data = growth > 0
        confidence = "high" if has_openings_data and has_industry_data else "medium" if has_openings_data or has_industry_data else "low"

        predictions.append({
            "employer_id": emp_id,
            "prediction_date": prediction_date,
            "hiring_outlook": outlook,
            "projected_openings_6mo": proj_6mo,
            "projected_openings_12mo": proj_12mo,
            "industry_growth_rate": round(growth, 2),
            "confidence_level": confidence,
            "factors": factors,
        })

    # Upsert
    if predictions:
        print(f"\nUpserting {len(predictions)} employer predictions...")
        sb.table("employer_predictions").upsert(
            predictions,
            on_conflict="employer_id,prediction_date"
        ).execute()

    # Summary
    outlook_counts: dict[str, int] = {}
    for p in predictions:
        o = p["hiring_outlook"]
        outlook_counts[o] = outlook_counts.get(o, 0) + 1

    print("\n=== Summary ===")
    print(f"Employers scored: {len(predictions)}")
    print("Outlook distribution:")
    for outlook, count in sorted(outlook_counts.items()):
        print(f"  {outlook}: {count}")


if __name__ == "__main__":
    main()
