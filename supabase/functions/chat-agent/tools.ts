import {
  queryColleges,
  queryPrograms,
  queryProgramOutcomes,
  queryEmployers,
  queryJobOpenings,
  queryDevelopment,
  queryIndustries,
  queryPartnerships,
  querySkillsAlignment,
  queryLaborStats,
  queryProgramPredictions,
  queryEmergingSkills,
  queryDecliningSkills,
  queryEmployerPredictions,
  querySalaryPredictions,
  queryPredictiveSkillsGap,
  queryProgramComparison,
} from "./queries.ts";

export const TOOL_DEFINITIONS = [
  {
    name: "get_colleges",
    description: "Get all UTA colleges/schools with enrollment numbers, deans, and descriptions. UTA has 10 colleges including Engineering, Business, Nursing, Science, Liberal Arts, Education, Architecture, Social Work, Honors, and University College.",
    input_schema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "get_programs",
    description: "Search UTA academic programs (BS, BA, MS, PhD, certificates). Can filter by college. Returns program name, degree level/type, STEM status, credit hours, and online availability.",
    input_schema: {
      type: "object" as const,
      properties: {
        college_id: {
          type: "string",
          description: "Optional UUID of a specific college to filter programs. Omit to get all programs.",
        },
      },
      required: [],
    },
  },
  {
    name: "get_program_outcomes",
    description: "Get career outcomes for UTA programs: graduation rates, employment rates, starting salaries, mid-career salaries, top employers, and top job titles. This is the key tool for salary and employment questions.",
    input_schema: {
      type: "object" as const,
      properties: {
        program_id: {
          type: "string",
          description: "Optional UUID of a specific program. Omit to get outcomes for all programs.",
        },
      },
      required: [],
    },
  },
  {
    name: "get_employers",
    description: "Search Arlington/DFW area employers. Returns company name, industry, employee count, Fortune 500 status, and whether they hire UTA graduates. Can filter by industry.",
    input_schema: {
      type: "object" as const,
      properties: {
        industry: {
          type: "string",
          description: "Optional industry filter (e.g. 'Healthcare', 'Aerospace & Defense', 'Automotive Manufacturing'). Uses partial matching.",
        },
      },
      required: [],
    },
  },
  {
    name: "get_job_openings",
    description: "Search active job openings in the Arlington/DFW area. Returns job title, salary range, required/preferred skills, education requirements, and remote options. Can filter by employer.",
    input_schema: {
      type: "object" as const,
      properties: {
        employer_id: {
          type: "string",
          description: "Optional UUID of a specific employer to filter job openings.",
        },
      },
      required: [],
    },
  },
  {
    name: "get_development_projects",
    description: "Get economic development projects in Arlington (e.g. Globe Life Field, GM plant modernization, E-Space HQ). Returns investment amounts, estimated jobs created, and status.",
    input_schema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "get_industries",
    description: "Get Arlington/DFW industry sectors with employment counts, average wages, growth rates, location quotients, and key employers. Good for understanding the local economy.",
    input_schema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "get_partnerships",
    description: "Get UTA employer partnerships: which companies recruit from which programs, average hires per year, intern salaries, and partnership types (hiring pipeline, internship, co-op, advisory board).",
    input_schema: {
      type: "object" as const,
      properties: {
        program_id: {
          type: "string",
          description: "Optional UUID of a specific program to filter partnerships.",
        },
      },
      required: [],
    },
  },
  {
    name: "get_skills_alignment",
    description: "Get skills gap analysis: which skills programs teach vs. what industry demands. Shows gap status (aligned, gap, surplus) and demand levels. Critical for curriculum alignment questions.",
    input_schema: {
      type: "object" as const,
      properties: {
        program_id: {
          type: "string",
          description: "Optional UUID of a specific program to filter skills alignment.",
        },
      },
      required: [],
    },
  },
  {
    name: "get_labor_stats",
    description: "Get BLS/TWC labor market statistics: employment counts, unemployment rate, wages, population, UTA enrollment and graduation metrics. Can filter by category: 'employment', 'wages', 'education', 'demographics', 'occupation'.",
    input_schema: {
      type: "object" as const,
      properties: {
        category: {
          type: "string",
          description: "Optional category filter: 'employment', 'wages', 'education', 'demographics', or 'occupation'.",
        },
      },
      required: [],
    },
  },
  {
    name: "get_program_prediction",
    description: "Get predictive success scores for UTA programs. Returns overall score (0-100), sub-scores for employment outlook, salary growth, skills alignment, employer demand, and industry growth. Use this for forward-looking program quality questions.",
    input_schema: {
      type: "object" as const,
      properties: {
        program_id: {
          type: "string",
          description: "Optional UUID of a specific program. Omit to get predictions for all scored programs.",
        },
        min_score: {
          type: "number",
          description: "Optional minimum overall score filter (0-100). E.g. 80 to get only top-scoring programs.",
        },
      },
      required: [],
    },
  },
  {
    name: "get_emerging_skills",
    description: "Get skills that are growing in demand in the DFW job market. Returns skill name, category, job posting counts, posting percentage, and average salary for jobs requiring that skill. Use for questions about trending skills, what to learn, or future-proof careers.",
    input_schema: {
      type: "object" as const,
      properties: {
        category: {
          type: "string",
          description: "Optional skill category filter: 'programming', 'data_science', 'cloud_infrastructure', 'cybersecurity', 'ai_ml', 'devops', 'healthcare', 'engineering', 'business'.",
        },
      },
      required: [],
    },
  },
  {
    name: "get_declining_skills",
    description: "Get skills that are losing demand in the job market. Returns skill name, category, and description of why it's declining. Use for questions about obsolete skills or what NOT to focus on.",
    input_schema: {
      type: "object" as const,
      properties: {
        category: {
          type: "string",
          description: "Optional skill category filter.",
        },
      },
      required: [],
    },
  },
  {
    name: "get_employer_outlook",
    description: "Get hiring outlook predictions for Arlington/DFW employers. Returns outlook (declining/stable/growing/rapidly_growing), projected openings for 6 and 12 months, industry growth rate, and key factors driving the outlook.",
    input_schema: {
      type: "object" as const,
      properties: {
        employer_id: {
          type: "string",
          description: "Optional UUID of a specific employer.",
        },
        outlook: {
          type: "string",
          enum: ["declining", "stable", "growing", "rapidly_growing"],
          description: "Optional filter by hiring outlook level.",
        },
      },
      required: [],
    },
  },
  {
    name: "get_salary_forecast",
    description: "Get salary trajectory projections for UTA programs. Returns current median salary and projected salary at 1, 3, 5, and 10 years, plus annual growth rate. Use for questions about earning potential and salary growth over time.",
    input_schema: {
      type: "object" as const,
      properties: {
        program_id: {
          type: "string",
          description: "Optional UUID of a specific program. Omit to get salary forecasts for all programs.",
        },
      },
      required: [],
    },
  },
  {
    name: "get_predictive_skills_gap",
    description: "Get future-aware skills gap analysis combining current program-industry alignment with emerging/declining skill trends. Enriches standard skills gap data with flags for skills that are trending up or becoming obsolete.",
    input_schema: {
      type: "object" as const,
      properties: {
        program_id: {
          type: "string",
          description: "Optional UUID of a specific program to analyze.",
        },
      },
      required: [],
    },
  },
  {
    name: "compare_programs",
    description: "Side-by-side comparison of 2-5 UTA programs. Returns prediction scores, salary data, employment rates, salary forecasts, skills alignment counts, and partnership counts for each program. Perfect for 'CS vs Data Science' type questions.",
    input_schema: {
      type: "object" as const,
      properties: {
        program_ids: {
          type: "array",
          items: { type: "string" },
          description: "Array of 2-5 program UUIDs to compare. Get program IDs from get_programs first.",
          minItems: 2,
          maxItems: 5,
        },
      },
      required: ["program_ids"],
    },
  },
  {
    name: "generate_visualization",
    description: "Generate a chart visualization. Build a CLEAN data array with short string labels (x_key) and raw numeric values (y_key). Do NOT pass raw database results — reshape them into simple objects first. Limit to 5-8 data items.",
    input_schema: {
      type: "object" as const,
      properties: {
        chart_type: {
          type: "string",
          enum: ["bar", "horizontal_bar", "pie", "donut", "line"],
          description: "Chart type. Use bar/horizontal_bar for comparisons, pie/donut for proportions, line for trends over time.",
        },
        title: {
          type: "string",
          description: "Chart title (e.g. 'Top 5 Starting Salaries by Program')",
        },
        data: {
          type: "array",
          items: { type: "object" },
          description: "Array of simple objects with ONLY the fields needed. x_key field must be a short string label (max ~20 chars). y_key field must be a raw number (e.g. 70300, NOT '$70,300'). Example: [{\"program\": \"Nursing BSN\", \"salary\": 70300}]",
        },
        x_key: {
          type: "string",
          description: "Key for the LABEL/category field in each data object (the text labels, e.g. 'program'). This goes on the x-axis for bar charts.",
        },
        y_key: {
          type: "string",
          description: "Key for the NUMERIC VALUE field in each data object (the numbers to plot, e.g. 'salary'). This goes on the y-axis for bar charts. Must be a number, not a string.",
        },
        x_label: {
          type: "string",
          description: "Optional axis label for x-axis",
        },
        y_label: {
          type: "string",
          description: "Optional axis label for y-axis",
        },
        insight: {
          type: "string",
          description: "One-sentence insight about the data shown in the chart",
        },
      },
      required: ["chart_type", "title", "data", "x_key", "y_key"],
    },
  },
];

// deno-lint-ignore no-explicit-any
type ToolExecutor = (args: Record<string, any>) => Promise<any>;

export const TOOL_EXECUTORS: Record<string, ToolExecutor> = {
  get_colleges: () => queryColleges(),
  get_programs: (args) => queryPrograms(args),
  get_program_outcomes: (args) => queryProgramOutcomes(args),
  get_employers: (args) => queryEmployers(args),
  get_job_openings: (args) => queryJobOpenings(args),
  get_development_projects: () => queryDevelopment(),
  get_industries: () => queryIndustries(),
  get_partnerships: (args) => queryPartnerships(args),
  get_skills_alignment: (args) => querySkillsAlignment(args),
  get_labor_stats: (args) => queryLaborStats(args),
  get_program_prediction: (args) => queryProgramPredictions(args),
  get_emerging_skills: (args) => queryEmergingSkills(args),
  get_declining_skills: (args) => queryDecliningSkills(args),
  get_employer_outlook: (args) => queryEmployerPredictions(args),
  get_salary_forecast: (args) => querySalaryPredictions(args),
  get_predictive_skills_gap: (args) => queryPredictiveSkillsGap(args),
  compare_programs: (args) => queryProgramComparison(args),
  generate_visualization: (args) =>
    Promise.resolve({ displayed: true, chart_type: args.chart_type, title: args.title }),
};
