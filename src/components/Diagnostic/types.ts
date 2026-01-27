// Contact Info
export interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  sector: string;
  stage: string;
}

// Pre-filled lead data from previous form submission
export interface PrefilledLeadData {
  firstName?: string;
  lastName?: string;
  email?: string;
  companyName?: string;
}

// Step answers
export interface DiagnosticAnswers {
  // Step 2: PMF Evidence
  pmfCustomerValidation: string;
  pmfRevenueModel: string;
  pmfCompetitiveAdvantage: string;

  // Step 3: Financial Modeling
  financialRunway: string;
  financialFundraisingReady: string;
  financialMetrics: string;

  // Step 4: Team Composition
  teamCoFounders: string;
  teamKeyHires: string;
  teamAdvisoryGaps: string;

  // Step 5: Advisor Network
  advisorCurrentNetwork: string;
  advisorNeededExpertise: string;
  advisorEngagementStyle: string;
}

export interface DiagnosticState {
  currentStep: number;
  contact: ContactInfo;
  answers: DiagnosticAnswers;
}

export interface OptionCardProps {
  icon?: string;
  label: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
  compact?: boolean;
}

export interface StepProps {
  contact: ContactInfo;
  answers: DiagnosticAnswers;
  updateContact: (updates: Partial<ContactInfo>) => void;
  updateAnswers: (updates: Partial<DiagnosticAnswers>) => void;
  hasPrefilledContact?: boolean;
}

export const SECTORS = [
  { id: 'manufacturing', label: 'Manufacturing', icon: '🏭' },
  { id: 'aerospace', label: 'Aerospace & Defense', icon: '✈️' },
  { id: 'healthcare', label: 'Healthcare', icon: '🏥' },
  { id: 'fintech', label: 'FinTech', icon: '📊' },
  { id: 'saas', label: 'SaaS / Enterprise', icon: '☁️' },
  { id: 'energy', label: 'Energy & CleanTech', icon: '⚡' },
] as const;

export const STAGES = [
  { id: 'idea', label: 'Idea', description: 'Concept stage' },
  { id: 'mvp', label: 'MVP', description: 'Building product' },
  { id: 'pre-revenue', label: 'Pre-Revenue', description: 'Product built' },
  { id: 'revenue', label: 'Revenue', description: 'First customers' },
  { id: 'growth', label: 'Growth', description: 'Scaling up' },
  { id: 'series-a', label: 'Series A', description: 'Institutional raise' },
] as const;
