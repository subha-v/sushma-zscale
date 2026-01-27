import { CompanyStage, AdvisorRole, ExperienceLevel } from '../types/tools';

// Stage multipliers - earlier stage = more equity
export const stageFactors: Record<CompanyStage, number> = {
  idea: 1.5,
  mvp: 1.2,
  preRevenue: 1.0,
  revenue: 0.8,
  growth: 0.5,
};

// Role multipliers
export const roleFactors: Record<AdvisorRole, number> = {
  mentor: 0.5,
  strategic: 1.0,
  board: 1.5,
  technical: 1.2,
};

// Experience multipliers
export const experienceFactors: Record<ExperienceLevel, number> = {
  expert: 1.2,
  executive: 1.0,
  serialFounder: 1.3,
};

// Base equity percentage
export const BASE_EQUITY = 0.25;

// Time commitment factor (per hour per month)
export const TIME_FACTOR = 0.02;

// Labels for display
export const stageLabels: Record<CompanyStage, string> = {
  idea: 'Idea Stage',
  mvp: 'MVP / Prototype',
  preRevenue: 'Pre-Revenue',
  revenue: 'Revenue Generating',
  growth: 'Growth Stage',
};

export const roleLabels: Record<AdvisorRole, string> = {
  mentor: 'Mentor / Coach',
  strategic: 'Strategic Advisor',
  board: 'Board Advisor',
  technical: 'Technical Advisor',
};

export const experienceLabels: Record<ExperienceLevel, string> = {
  expert: 'Industry Expert',
  executive: 'Corporate Executive',
  serialFounder: 'Serial Founder',
};

// Benchmark data for comparison
export const benchmarkData = [
  {
    label: 'YC Standard',
    description: 'Y Combinator advisor benchmarks',
    minEquity: 0.1,
    maxEquity: 0.25,
  },
  {
    label: 'FAST Agreement',
    description: 'Founder Advisor Standard Template',
    minEquity: 0.25,
    maxEquity: 1.0,
  },
  {
    label: 'Market Average',
    description: 'Based on industry surveys',
    minEquity: 0.15,
    maxEquity: 0.5,
  },
];

// Vesting schedule recommendations
export const vestingSchedules = [
  {
    duration: 24,
    schedule: 'Quarterly',
    description: '2 years with quarterly vesting (most common for advisors)',
  },
  {
    duration: 12,
    schedule: 'Monthly',
    description: '1 year with monthly vesting (for short-term engagements)',
  },
  {
    duration: 48,
    schedule: 'Quarterly',
    description: '4 years with quarterly vesting (for significant roles)',
  },
];

// Calculate recommended equity
export function calculateEquity(
  stage: CompanyStage,
  role: AdvisorRole,
  hoursPerMonth: number,
  experience: ExperienceLevel
): { min: number; max: number; recommended: number } {
  const stageFactor = stageFactors[stage];
  const roleFactor = roleFactors[role];
  const expFactor = experienceFactors[experience];
  const timeFactor = Math.min(hoursPerMonth * TIME_FACTOR, 0.4); // Cap time factor at 0.4

  const baseCalc = BASE_EQUITY * stageFactor * roleFactor * expFactor + timeFactor;

  // Calculate range (±20%)
  const min = Math.max(0.05, baseCalc * 0.8);
  const max = Math.min(2.0, baseCalc * 1.2);

  return {
    min: Math.round(min * 100) / 100,
    max: Math.round(max * 100) / 100,
    recommended: Math.round(baseCalc * 100) / 100,
  };
}

// Get recommended vesting based on role
export function getRecommendedVesting(role: AdvisorRole): typeof vestingSchedules[0] {
  if (role === 'board') {
    return vestingSchedules[2]; // 4 years for board
  } else if (role === 'mentor') {
    return vestingSchedules[1]; // 1 year for mentors
  }
  return vestingSchedules[0]; // 2 years for others
}
