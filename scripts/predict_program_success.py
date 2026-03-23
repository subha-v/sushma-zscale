"""
Program Success Prediction Pipeline
Computes composite program success scores and salary trajectories
for each active UTA program using BLS projections, outcomes data,
skills alignment, and employer demand.

Usage: python scripts/predict_program_success.py
Schedule: Monthly (1st of each month via GitHub Actions)
"""

import os
from datetime import date

from dotenv import load_dotenv
from supabase import create_client

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]

# Score weights (must sum to 1.0)
WEIGHT_EMPLOYMENT = 0.25
WEIGHT_SALARY = 0.20
WEIGHT_SKILLS = 0.20
WEIGHT_EMPLOYER = 0.20
WEIGHT_INDUSTRY = 0.15

# BLS outlook to score mapping
BLS_OUTLOOK_SCORES = {
    "much_faster_than_average": 95,
    "faster_than_average": 80,
    "as_fast_as_average": 65,
    "slower_than_average": 45,
    "little_or_no_change": 30,
    "declining": 15,
}


def normalize_score(value: float, min_val: float, max_val: float) -> float:
    """Normalize a value to 0-100 scale."""
    if max_val == min_val:
        return 50.0
    return max(0, min(100, ((value - min_val) / (max_val - min_val)) * 100))


def main():
    print("=== Program Success Prediction Pipeline ===")
    print(f"Date: {date.today()}")

    sb = create_client(SUPABASE_URL, SUPABASE_KEY)
    prediction_date = date.today().isoformat()

    # Fetch all active programs
    programs = sb.table("uta_programs").select("*").eq("is_active", True).execute().data
    print(f"Active programs: {len(programs)}")

    # Fetch supporting data
    crosswalk = sb.table("cip_soc_crosswalk").select("*").execute().data
    bls = sb.table("bls_occupation_projections").select("*").execute().data
    outcomes = sb.table("uta_program_outcomes").select("*").execute().data
    skills = sb.table("uta_skills_alignment").select("*").execute().data
    partnerships = sb.table("uta_employer_partnerships").select("*").eq("is_active", True).execute().data
    industries = sb.table("arlington_industries").select("*").execute().data
    job_openings = sb.table("arlington_job_openings").select("*").eq("is_active", True).execute().data

    # Build lookup maps
    cip_to_soc = {}
    for c in crosswalk:
        cip = c["cip_code"]
        if cip not in cip_to_soc:
            cip_to_soc[cip] = []
        cip_to_soc[cip].append(c)

    soc_to_bls = {b["soc_code"]: b for b in bls}
    outcomes_by_program = {o["program_id"]: o for o in outcomes}
    skills_by_program: dict[str, list] = {}
    for s in skills:
        pid = s["program_id"]
        if pid not in skills_by_program:
            skills_by_program[pid] = []
        skills_by_program[pid].append(s)

    partnerships_by_program: dict[str, list] = {}
    for p in partnerships:
        pid = p["program_id"]
        if pid not in partnerships_by_program:
            partnerships_by_program[pid] = []
        partnerships_by_program[pid].append(p)

    # Collect salary data for normalization
    all_salaries = [o["median_starting_salary"] for o in outcomes if o.get("median_starting_salary")]
    salary_min = min(all_salaries) if all_salaries else 40000
    salary_max = max(all_salaries) if all_salaries else 80000

    program_predictions = []
    salary_predictions = []

    for prog in programs:
        prog_id = prog["id"]
        cip_code = prog.get("cip_code")

        # 1. Employment outlook score (from BLS)
        emp_outlook_score = 50.0  # default
        best_bls = None
        if cip_code and cip_code in cip_to_soc:
            for mapping in cip_to_soc[cip_code]:
                if mapping["match_quality"] == "primary" and mapping["soc_code"] in soc_to_bls:
                    best_bls = soc_to_bls[mapping["soc_code"]]
                    break
            if not best_bls:
                for mapping in cip_to_soc[cip_code]:
                    if mapping["soc_code"] in soc_to_bls:
                        best_bls = soc_to_bls[mapping["soc_code"]]
                        break
        if best_bls:
            emp_outlook_score = BLS_OUTLOOK_SCORES.get(best_bls.get("job_outlook", ""), 50)

        # 2. Salary growth score (from outcomes)
        outcome = outcomes_by_program.get(prog_id)
        salary_score = 50.0
        current_salary = None
        if outcome and outcome.get("median_starting_salary"):
            current_salary = outcome["median_starting_salary"]
            salary_score = normalize_score(current_salary, salary_min, salary_max)

        # 3. Skills alignment score
        prog_skills = skills_by_program.get(prog_id, [])
        skills_score = 50.0
        if prog_skills:
            aligned = sum(1 for s in prog_skills if s.get("gap_status") == "aligned")
            total = len(prog_skills)
            skills_score = (aligned / total) * 100 if total > 0 else 50.0

        # 4. Employer demand score
        prog_partners = partnerships_by_program.get(prog_id, [])
        employer_score = 50.0
        total_hires = sum(p.get("avg_hires_per_year", 0) for p in prog_partners)
        if total_hires > 0:
            employer_score = min(100, normalize_score(total_hires, 0, 50))

        # 5. Industry growth score
        industry_score = 50.0
        if best_bls and best_bls.get("change_percent"):
            # Map BLS change percent to score
            change_pct = float(best_bls["change_percent"])
            industry_score = min(100, max(0, 50 + change_pct * 2))

        # Composite score
        overall = (
            WEIGHT_EMPLOYMENT * emp_outlook_score +
            WEIGHT_SALARY * salary_score +
            WEIGHT_SKILLS * skills_score +
            WEIGHT_EMPLOYER * employer_score +
            WEIGHT_INDUSTRY * industry_score
        )

        # Confidence level
        has_bls = best_bls is not None
        has_outcome = outcome is not None
        has_skills = len(prog_skills) > 0
        data_points = sum([has_bls, has_outcome, has_skills, len(prog_partners) > 0])
        confidence = "high" if data_points >= 3 else "medium" if data_points >= 2 else "low"

        program_predictions.append({
            "program_id": prog_id,
            "prediction_date": prediction_date,
            "overall_score": round(overall, 2),
            "employment_outlook_score": round(emp_outlook_score, 2),
            "salary_growth_score": round(salary_score, 2),
            "skills_alignment_score": round(skills_score, 2),
            "employer_demand_score": round(employer_score, 2),
            "industry_growth_score": round(industry_score, 2),
            "confidence_level": confidence,
            "methodology_notes": f"Composite: {WEIGHT_EMPLOYMENT:.0%} emp + {WEIGHT_SALARY:.0%} sal + {WEIGHT_SKILLS:.0%} skills + {WEIGHT_EMPLOYER:.0%} emp_demand + {WEIGHT_INDUSTRY:.0%} industry",
        })

        # Salary predictions
        if current_salary and best_bls:
            bls_wage = best_bls.get("median_annual_wage", current_salary)
            bls_growth = float(best_bls.get("change_percent", 3)) / 10  # Approximate annual from 10-year
            annual_rate = max(2.0, min(6.0, bls_growth + 1.5))  # Add base wage growth, cap at 2-6%

            y1 = int(current_salary * (1 + annual_rate / 100))
            y3 = int(current_salary * (1 + annual_rate / 100) ** 3)
            y5 = int(current_salary * (1 + annual_rate / 100) ** 5)
            y10 = int(current_salary * (1 + annual_rate / 100) ** 10)

            salary_predictions.append({
                "program_id": prog_id,
                "prediction_date": prediction_date,
                "current_median_salary": current_salary,
                "year_1_projected": y1,
                "year_3_projected": y3,
                "year_5_projected": y5,
                "year_10_projected": y10,
                "annual_growth_rate": round(annual_rate, 2),
                "confidence_level": confidence,
                "methodology": f"BLS wage growth ({best_bls.get('change_percent', 'N/A')}% 10yr) + base inflation adjustment",
            })

    # Upsert predictions
    if program_predictions:
        print(f"\nUpserting {len(program_predictions)} program predictions...")
        sb.table("program_predictions").upsert(
            program_predictions,
            on_conflict="program_id,prediction_date"
        ).execute()

    if salary_predictions:
        print(f"Upserting {len(salary_predictions)} salary predictions...")
        sb.table("salary_predictions").upsert(
            salary_predictions,
            on_conflict="program_id,prediction_date"
        ).execute()

    print("\n=== Summary ===")
    print(f"Programs scored: {len(program_predictions)}")
    print(f"Salary forecasts: {len(salary_predictions)}")

    # Print top 5
    top5 = sorted(program_predictions, key=lambda x: x["overall_score"], reverse=True)[:5]
    print("\nTop 5 programs by prediction score:")
    for i, p in enumerate(top5, 1):
        prog = next((pr for pr in programs if pr["id"] == p["program_id"]), None)
        name = prog["program_name"] if prog else p["program_id"]
        print(f"  {i}. {name}: {p['overall_score']:.1f} ({p['confidence_level']})")


if __name__ == "__main__":
    main()
