// =============================================================================
// zScale Capital - API Configuration
// Centralized endpoint for all form submissions
// =============================================================================

// Master API Endpoint - All forms route through this single endpoint
export const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxjXknH9slBjPfbrHlnU813HC3LrsXs0LLwuX_jG4CTWg1EVIWKNrYKi6m7jNyp9Q/exec';

// Form Type Identifiers - Used for routing in the Apps Script
export const FORM_TYPES = {
  ECOSYSTEM_MAP: 'ecosystem_map',      // Venture Map Download -> Ecosystem_Map tab
  ADVISOR_MATCH: 'advisor_match',      // Advisor Diagnostic -> Advisor_Matches tab
  READINESS_INDEX: 'readiness_index',  // IRI Assessment -> IRI_Audits tab
  NEWSLETTER: 'newsletter',            // Newsletter signup -> Newsletter_Subscribers tab
  TOOL_ACCESS: 'tool_access',          // Tool access gate -> Tool_Access tab
  VALUATION_TOOL: 'valuation_tool',    // Valuation benchmarks -> Valuation_Benchmarks tab
  EQUITY_EVALUATOR: 'equity_evaluator', // Equity calculations -> Equity_Calculations tab
  INTELLIGENCE_BRIEFING: 'intelligence_briefing', // Playbook interest -> Intelligence_Briefing tab
  SHADOW_CAPITAL: 'shadow_capital',    // Shadow Capital Report -> Ecosystem_Map tab + special tagging
  LIBRARY_SIGNUP: 'library_signup',    // Library/Briefing signup -> Lead_Source: Venture_Library, Intent: Education
  ASSET_INTERACTION: 'asset_interaction', // Asset click/download tracking -> Asset_Interactions column in Master_Registry
  VENTURE_BENCHMARKS: 'venture_benchmarks', // Venture Benchmarks PDF -> Venture_Benchmarks tab
  BUILD_APPLICATION: 'build_application', // Build with zScale application -> Build_Applications tab
} as const;

// ============================================================================
// User Progress Persistence (localStorage keys)
// ============================================================================
export const STORAGE_KEYS = {
  IRI_SCORE: 'zscale_iri_score',
  IRI_COMPLETED: 'zscale_iri_completed',
  USER_EMAIL: 'zscale_user_email',
  USER_FIRST_NAME: 'zscale_user_first_name',
  USER_LAST_NAME: 'zscale_user_last_name',
  USER_COMPANY: 'zscale_user_company',
  USER_SECTOR: 'zscale_user_sector',
  IS_PREMIUM: 'zscale_is_premium',  // Alpha Tier membership flag
} as const;

// ============================================================================
// Progression Thresholds
// ============================================================================
export const PROGRESSION_THRESHOLDS = {
  ADVISOR_MATCH_UNLOCK: 50,   // Score 50+ unlocks Advisor Match
  ADVANCED_TOOLS_UNLOCK: 70,  // Score 70+ unlocks Valuation & Equity tools
} as const;

// Helper function to get user progress
export function getUserProgress(): {
  iriScore: number | null;
  iriCompleted: boolean;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  company: string | null;
  sector: string | null;
  isPremium: boolean;
} {
  return {
    iriScore: localStorage.getItem(STORAGE_KEYS.IRI_SCORE)
      ? Number(localStorage.getItem(STORAGE_KEYS.IRI_SCORE))
      : null,
    iriCompleted: localStorage.getItem(STORAGE_KEYS.IRI_COMPLETED) === 'true',
    email: localStorage.getItem(STORAGE_KEYS.USER_EMAIL),
    firstName: localStorage.getItem(STORAGE_KEYS.USER_FIRST_NAME),
    lastName: localStorage.getItem(STORAGE_KEYS.USER_LAST_NAME),
    company: localStorage.getItem(STORAGE_KEYS.USER_COMPANY),
    sector: localStorage.getItem(STORAGE_KEYS.USER_SECTOR),
    isPremium: localStorage.getItem(STORAGE_KEYS.IS_PREMIUM) === 'true',
  };
}

// Check if user is a premium Alpha member
export function isPremiumMember(): boolean {
  return localStorage.getItem(STORAGE_KEYS.IS_PREMIUM) === 'true';
}

// Set premium status (called after membership verification)
export function setPremiumStatus(isPremium: boolean): void {
  localStorage.setItem(STORAGE_KEYS.IS_PREMIUM, isPremium ? 'true' : 'false');
}

// Helper function to save user progress after IRI completion
export function saveUserProgress(data: {
  iriScore: number;
  email: string;
  firstName: string;
  lastName: string;
  company?: string;
  sector?: string;
}): void {
  localStorage.setItem(STORAGE_KEYS.IRI_SCORE, String(data.iriScore));
  localStorage.setItem(STORAGE_KEYS.IRI_COMPLETED, 'true');
  localStorage.setItem(STORAGE_KEYS.USER_EMAIL, data.email);
  localStorage.setItem(STORAGE_KEYS.USER_FIRST_NAME, data.firstName);
  localStorage.setItem(STORAGE_KEYS.USER_LAST_NAME, data.lastName);
  if (data.company) localStorage.setItem(STORAGE_KEYS.USER_COMPANY, data.company);
  if (data.sector) localStorage.setItem(STORAGE_KEYS.USER_SECTOR, data.sector);
}

export type FormType = typeof FORM_TYPES[keyof typeof FORM_TYPES];

// Helper function to submit data to the Google Apps Script
export async function submitToMasterDatabase(payload: Record<string, unknown>): Promise<boolean> {
  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...payload,
        timestamp: new Date().toISOString(),
      }),
    });
    return true;
  } catch (error) {
    console.error('Error submitting to master database:', error);
    return false;
  }
}
