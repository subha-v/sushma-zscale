// Investment Readiness Index Types

export interface IRIContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  sector: string;
}

export interface IRIAnswers {
  // PMF Evidence (25%)
  pmfCustomerValidation: string;
  pmfRetention: string;
  pmfOrganicGrowth: string;

  // Unit Economics (30%)
  unitEconomicsKnowledge: string;
  cacLtvRatio: string;
  revenueModel: string;

  // Team & Advisors (20%)
  founderBackground: string;
  teamCompleteness: string;
  advisorNetwork: string;

  // Infrastructure (15%)
  legalStructure: string;
  financialTracking: string;
  dataRoom: string;

  // Capital Positioning (10%)
  fundraisingExperience: string;
  investorRelations: string;
}

export interface VectorScore {
  id: string;
  name: string;
  score: number;
  maxScore: number;
  weight: number;
  insights: string[];
}

export interface WorkshopRecommendation {
  priority: 'critical' | 'standard' | 'advanced';
  title: string;
  description: string;
  calendarLink: string;
}

export interface IRIResult {
  totalScore: number;
  vectors: VectorScore[];
  workshop: WorkshopRecommendation;
  penalty: number;
}

export type IRIViewState = 'form' | 'calculating' | 'results';
