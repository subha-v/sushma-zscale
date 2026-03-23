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
};
