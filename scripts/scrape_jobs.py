"""
Weekly Job Scraping Pipeline
Scrapes DFW-area job postings using JobSpy, extracts skills,
and upserts into skills_catalog and skills_trend_snapshots.

Usage: python scripts/scrape_jobs.py
Schedule: Weekly (Monday 6 AM UTC via GitHub Actions)
"""

import os
import re
from datetime import date

import pandas as pd
from dotenv import load_dotenv
from jobspy import scrape_jobs
from supabase import create_client

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]

# DFW area search parameters
SEARCH_LOCATION = "Arlington, TX"
SEARCH_RADIUS_MILES = 30
RESULTS_WANTED = 500

# Skills to track — must match skills_catalog entries
SKILL_KEYWORDS = {
    "Python": [r"\bpython\b"],
    "SQL": [r"\bsql\b", r"\bpostgres\b", r"\bmysql\b"],
    "Java": [r"\bjava\b(?!script)"],
    "JavaScript/TypeScript": [r"\bjavascript\b", r"\btypescript\b", r"\bjs\b", r"\bts\b"],
    "React/Next.js": [r"\breact\b", r"\bnext\.?js\b"],
    "Generative AI / LLMs": [r"\bgenerative ai\b", r"\bllm\b", r"\bchatgpt\b", r"\bgpt-?\d\b", r"\bclaude\b", r"\blarge language model\b"],
    "Prompt Engineering": [r"\bprompt engineer\b"],
    "Kubernetes": [r"\bkubernetes\b", r"\bk8s\b"],
    "Terraform": [r"\bterraform\b", r"\biac\b"],
    "Docker": [r"\bdocker\b", r"\bcontainer\b"],
    "AWS": [r"\baws\b", r"\bamazon web services\b"],
    "Machine Learning": [r"\bmachine learning\b", r"\bml\b", r"\bdeep learning\b"],
    "MLOps": [r"\bmlops\b", r"\bml ops\b", r"\bmodel deployment\b"],
    "Rust": [r"\brust\b(?!\s+(?:belt|color|stain))"],
    "Cybersecurity (Zero Trust)": [r"\bzero trust\b", r"\bcybersecurity\b", r"\binfosec\b"],
    "Cloud Architecture (Multi-Cloud)": [r"\bmulti.?cloud\b", r"\bcloud architect\b"],
    "Data Engineering (dbt/Spark)": [r"\bdbt\b", r"\bapache spark\b", r"\bdata engineer\b", r"\bairflow\b"],
    "Robotic Process Automation": [r"\brpa\b", r"\buipath\b", r"\bautomation anywhere\b"],
    "Telehealth Systems": [r"\btelehealth\b", r"\btelemedicine\b", r"\bvirtual care\b"],
    "Agile/Scrum": [r"\bagile\b", r"\bscrum\b"],
    "Six Sigma": [r"\bsix sigma\b", r"\blean\b(?=.*manufactur)"],
    "AutoCAD": [r"\bautocad\b", r"\bcad\b"],
    "MATLAB": [r"\bmatlab\b"],
    "Patient Assessment": [r"\bpatient assessment\b", r"\bclinical assessment\b"],
    "Financial Analysis": [r"\bfinancial analy\b", r"\bfinancial model\b"],
    # Declining skills to track
    "jQuery": [r"\bjquery\b"],
    "COBOL": [r"\bcobol\b"],
    "On-Premise Server Admin": [r"\bon.?prem\b(?!.*cloud)"],
    "Manual QA Testing": [r"\bmanual\s+(?:qa|test)\b"],
    "Flash/ActionScript": [r"\bflash\b(?=.*develop)", r"\bactionscript\b"],
}


def extract_skills(description: str) -> list[str]:
    """Extract skills from a job description using keyword matching."""
    if not description:
        return []
    desc_lower = description.lower()
    found = []
    for skill_name, patterns in SKILL_KEYWORDS.items():
        for pattern in patterns:
            if re.search(pattern, desc_lower):
                found.append(skill_name)
                break
    return found


def main():
    print("=== Job Scraping Pipeline ===")
    print(f"Date: {date.today()}")
    print(f"Location: {SEARCH_LOCATION} ({SEARCH_RADIUS_MILES}mi radius)")

    # Scrape jobs from multiple sites
    print("\nScraping job postings...")
    try:
        jobs_df = scrape_jobs(
            site_name=["indeed", "linkedin"],
            search_term="",  # Broad search
            location=SEARCH_LOCATION,
            distance=SEARCH_RADIUS_MILES,
            results_wanted=RESULTS_WANTED,
            hours_old=168,  # Past week
            country_indeed="USA",
        )
    except Exception as e:
        print(f"Error scraping jobs: {e}")
        print("Using empty dataframe as fallback.")
        jobs_df = pd.DataFrame()

    if jobs_df.empty:
        print("No jobs found. Exiting.")
        return

    total_postings = len(jobs_df)
    print(f"Found {total_postings} job postings")

    # Extract skills from each posting
    print("Extracting skills from descriptions...")
    skill_counts: dict[str, int] = {}
    skill_salaries: dict[str, list[float]] = {}

    for _, row in jobs_df.iterrows():
        description = str(row.get("description", ""))
        skills = extract_skills(description)
        salary = None
        if pd.notna(row.get("max_amount")):
            salary = float(row["max_amount"])
        elif pd.notna(row.get("min_amount")):
            salary = float(row["min_amount"])

        for skill in skills:
            skill_counts[skill] = skill_counts.get(skill, 0) + 1
            if salary and salary > 20000:  # Filter out hourly rates misread as annual
                if skill not in skill_salaries:
                    skill_salaries[skill] = []
                skill_salaries[skill].append(salary)

    print(f"Tracked {len(skill_counts)} unique skills")

    # Connect to Supabase
    sb = create_client(SUPABASE_URL, SUPABASE_KEY)

    # Ensure all skills exist in skills_catalog
    print("Syncing skills catalog...")
    existing = sb.table("skills_catalog").select("skill_name, id").execute()
    existing_map = {r["skill_name"]: r["id"] for r in existing.data}

    # Upsert skill trend snapshots
    snapshot_date = date.today().isoformat()
    snapshots = []

    for skill_name, count in skill_counts.items():
        skill_id = existing_map.get(skill_name)
        if not skill_id:
            print(f"  Skill '{skill_name}' not in catalog, skipping snapshot.")
            continue

        posting_pct = round((count / total_postings) * 100, 3)
        avg_salary = None
        if skill_name in skill_salaries and skill_salaries[skill_name]:
            avg_salary = int(sum(skill_salaries[skill_name]) / len(skill_salaries[skill_name]))

        snapshots.append({
            "skill_id": skill_id,
            "snapshot_date": snapshot_date,
            "job_posting_count": count,
            "posting_percentage": posting_pct,
            "avg_salary_with_skill": avg_salary,
            "region": "DFW",
        })

    if snapshots:
        print(f"Upserting {len(snapshots)} skill trend snapshots...")
        sb.table("skills_trend_snapshots").upsert(
            snapshots,
            on_conflict="skill_id,snapshot_date,region"
        ).execute()
        print("Done.")
    else:
        print("No snapshots to upsert.")

    # Summary
    print("\n=== Summary ===")
    print(f"Total postings scraped: {total_postings}")
    print(f"Skills tracked: {len(skill_counts)}")
    print(f"Snapshots upserted: {len(snapshots)}")
    top_5 = sorted(skill_counts.items(), key=lambda x: x[1], reverse=True)[:5]
    print("Top 5 skills by frequency:")
    for skill, count in top_5:
        print(f"  {skill}: {count} postings ({count/total_postings*100:.1f}%)")


if __name__ == "__main__":
    main()
