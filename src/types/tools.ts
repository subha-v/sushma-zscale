// Investor Tier-List Types
export type InvestmentStage = 'Pre-Seed' | 'Seed' | 'Series A' | 'Series B' | 'Growth';
export type ActivityStatus = 'active' | 'moderate' | 'quiet';

export interface Investor {
  id: string;
  name: string;
  firm: string;
  focusAreas: string[];
  stages: InvestmentStage[];
  checkSize: { min: number; max: number };
  activityStatus: ActivityStatus;
  lastDealDate: string;
  portfolioCompanies: string[];
  contactEmail?: string;
  linkedIn?: string;
  website?: string;
  isPremium: boolean;
}

// Equity Calculator Types
export type CompanyStage = 'idea' | 'mvp' | 'preRevenue' | 'revenue' | 'growth';
export type AdvisorRole = 'mentor' | 'strategic' | 'board' | 'technical';
export type ExperienceLevel = 'expert' | 'executive' | 'serialFounder';

export interface EquityInputs {
  stage: CompanyStage;
  role: AdvisorRole;
  hoursPerMonth: number;
  experience: ExperienceLevel;
}

export interface EquityResult {
  minEquity: number;
  maxEquity: number;
  recommendedEquity: number;
  vestingMonths: number;
  vestingSchedule: string;
}

export interface EquityBenchmark {
  role: AdvisorRole;
  stage: CompanyStage;
  minEquity: number;
  maxEquity: number;
  label: string;
}

// Accelerator Checklist Types
export type ChecklistCategoryId = 'product' | 'market' | 'team' | 'traction' | 'pitch';

export interface ChecklistItem {
  id: string;
  categoryId: ChecklistCategoryId;
  title: string;
  description: string;
  points: number;
}

export interface ChecklistCategory {
  id: ChecklistCategoryId;
  title: string;
  description: string;
  maxPoints: number;
  icon: string;
}

export interface ChecklistState {
  completedItems: string[];
  score: number;
  categoryScores: Record<ChecklistCategoryId, number>;
}

// Lead Capture Types
export type ToolType = 'investor-list' | 'equity-calculator' | 'accelerator-checklist';

export interface LeadCaptureConfig {
  tool: ToolType;
  title: string;
  description: string;
  buttonText: string;
  benefits: string[];
}
