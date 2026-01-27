// Investment Readiness Index - Scoring Model & Questions

export interface QuestionOption {
  value: string;
  label: string;
  description: string;
  score: number;
  icon?: string;
}

export interface Question {
  id: string;
  question: string;
  options: QuestionOption[];
}

export interface Vector {
  id: string;
  name: string;
  weight: number;
  maxRawScore: number;
  questions: Question[];
}

// PMF Evidence Vector (25%)
const pmfEvidenceVector: Vector = {
  id: 'pmf',
  name: 'PMF Evidence',
  weight: 0.25,
  maxRawScore: 30,
  questions: [
    {
      id: 'pmfCustomerValidation',
      question: 'How have you validated customer demand?',
      options: [
        {
          value: 'paying_customers',
          label: 'Paying Customers',
          description: 'We have recurring revenue from paying customers',
          score: 10,
          icon: '💰',
        },
        {
          value: 'pilot_programs',
          label: 'Pilot Programs',
          description: 'Running paid or unpaid pilots with real users',
          score: 7,
          icon: '🧪',
        },
        {
          value: 'waitlist_signups',
          label: 'Waitlist/Signups',
          description: 'Strong waitlist or letter of intent from prospects',
          score: 4,
          icon: '📝',
        },
        {
          value: 'idea_stage',
          label: 'Idea Stage',
          description: 'Still validating the problem and solution',
          score: 1,
          icon: '💡',
        },
      ],
    },
    {
      id: 'pmfRetention',
      question: 'What does your user retention look like?',
      options: [
        {
          value: 'strong_retention',
          label: 'Strong Retention',
          description: '60%+ monthly retention, users keep coming back',
          score: 10,
          icon: '📈',
        },
        {
          value: 'moderate_retention',
          label: 'Moderate Retention',
          description: '30-60% retention, working on improving',
          score: 6,
          icon: '📊',
        },
        {
          value: 'early_data',
          label: 'Early Data',
          description: 'Just started tracking, insufficient data',
          score: 3,
          icon: '🔬',
        },
        {
          value: 'not_tracking',
          label: 'Not Tracking',
          description: 'Haven\'t implemented retention tracking yet',
          score: 1,
          icon: '❓',
        },
      ],
    },
    {
      id: 'pmfOrganicGrowth',
      question: 'How are customers finding you?',
      options: [
        {
          value: 'word_of_mouth',
          label: 'Word of Mouth',
          description: '50%+ growth from referrals and organic',
          score: 10,
          icon: '🗣️',
        },
        {
          value: 'mixed_channels',
          label: 'Mixed Channels',
          description: 'Combination of paid and organic acquisition',
          score: 6,
          icon: '🔄',
        },
        {
          value: 'paid_acquisition',
          label: 'Paid Acquisition',
          description: 'Primarily through paid marketing',
          score: 3,
          icon: '💸',
        },
        {
          value: 'no_customers',
          label: 'No Customers Yet',
          description: 'Still building the product',
          score: 1,
          icon: '🏗️',
        },
      ],
    },
  ],
};

// Unit Economics Vector (30%)
const unitEconomicsVector: Vector = {
  id: 'unit_economics',
  name: 'Unit Economics',
  weight: 0.30,
  maxRawScore: 30,
  questions: [
    {
      id: 'unitEconomicsKnowledge',
      question: 'How well do you understand your unit economics?',
      options: [
        {
          value: 'fully_modeled',
          label: 'Fully Modeled',
          description: 'Complete CAC, LTV, margins, and cohort analysis',
          score: 10,
          icon: '📐',
        },
        {
          value: 'basic_understanding',
          label: 'Basic Understanding',
          description: 'Know our key metrics but still refining',
          score: 6,
          icon: '📊',
        },
        {
          value: 'early_stage',
          label: 'Early Stage',
          description: 'Have estimates but limited real data',
          score: 3,
          icon: '🌱',
        },
        {
          value: 'dont_know',
          label: "I Don't Know My Unit Economics",
          description: 'Haven\'t calculated these metrics yet',
          score: 0, // This triggers the -20 penalty
          icon: '🚨',
        },
      ],
    },
    {
      id: 'cacLtvRatio',
      question: 'What is your CAC to LTV ratio?',
      options: [
        {
          value: 'excellent',
          label: '3:1 or Better',
          description: 'Strong unit economics with healthy margins',
          score: 10,
          icon: '🎯',
        },
        {
          value: 'good',
          label: '2:1 to 3:1',
          description: 'Solid ratio with room for optimization',
          score: 7,
          icon: '✅',
        },
        {
          value: 'improving',
          label: '1:1 to 2:1',
          description: 'Break-even or slightly profitable per customer',
          score: 4,
          icon: '📈',
        },
        {
          value: 'unknown',
          label: 'Not Calculated',
          description: 'Haven\'t determined this ratio yet',
          score: 1,
          icon: '❓',
        },
      ],
    },
    {
      id: 'revenueModel',
      question: 'How predictable is your revenue?',
      options: [
        {
          value: 'recurring',
          label: 'Recurring Revenue',
          description: 'SaaS or subscription-based model',
          score: 10,
          icon: '🔁',
        },
        {
          value: 'repeat_purchase',
          label: 'Repeat Purchases',
          description: 'Customers buy regularly but not subscription',
          score: 7,
          icon: '🛒',
        },
        {
          value: 'transactional',
          label: 'Transactional',
          description: 'One-time purchases or project-based',
          score: 4,
          icon: '💳',
        },
        {
          value: 'pre_revenue',
          label: 'Pre-Revenue',
          description: 'Not generating revenue yet',
          score: 1,
          icon: '🚀',
        },
      ],
    },
  ],
};

// Team & Advisors Vector (20%)
const teamAdvisorsVector: Vector = {
  id: 'team',
  name: 'Team & Advisors',
  weight: 0.20,
  maxRawScore: 30,
  questions: [
    {
      id: 'founderBackground',
      question: 'What is the founding team\'s relevant experience?',
      options: [
        {
          value: 'domain_experts',
          label: 'Domain Experts',
          description: '10+ years in industry or previous exits',
          score: 10,
          icon: '🏆',
        },
        {
          value: 'experienced',
          label: 'Experienced',
          description: 'Strong relevant background, first startup',
          score: 7,
          icon: '💼',
        },
        {
          value: 'adjacent',
          label: 'Adjacent Experience',
          description: 'Transferable skills from related field',
          score: 4,
          icon: '🔄',
        },
        {
          value: 'first_time',
          label: 'First-Time Founders',
          description: 'Learning as we go, fresh perspective',
          score: 2,
          icon: '🌟',
        },
      ],
    },
    {
      id: 'teamCompleteness',
      question: 'How complete is your core team?',
      options: [
        {
          value: 'complete',
          label: 'Complete Team',
          description: 'CEO, CTO, and key roles filled full-time',
          score: 10,
          icon: '👥',
        },
        {
          value: 'mostly_complete',
          label: 'Mostly Complete',
          description: 'Core founders + 1-2 key hires',
          score: 7,
          icon: '👤',
        },
        {
          value: 'building',
          label: 'Building Team',
          description: 'Founders only, actively hiring',
          score: 4,
          icon: '🔍',
        },
        {
          value: 'solo',
          label: 'Solo Founder',
          description: 'Running everything alone for now',
          score: 2,
          icon: '🦸',
        },
      ],
    },
    {
      id: 'advisorNetwork',
      question: 'What does your advisor network look like?',
      options: [
        {
          value: 'strong_network',
          label: 'Strong Network',
          description: '3+ advisors with investor connections and domain expertise',
          score: 10,
          icon: '🌐',
        },
        {
          value: 'developing',
          label: 'Developing',
          description: '1-2 advisors, building relationships',
          score: 6,
          icon: '🤝',
        },
        {
          value: 'informal',
          label: 'Informal Mentors',
          description: 'Have mentors but no formal advisory board',
          score: 3,
          icon: '💬',
        },
        {
          value: 'none',
          label: 'No Advisors',
          description: 'Haven\'t established advisor relationships yet',
          score: 1,
          icon: '🏝️',
        },
      ],
    },
  ],
};

// Infrastructure Vector (15%)
const infrastructureVector: Vector = {
  id: 'infrastructure',
  name: 'Infrastructure',
  weight: 0.15,
  maxRawScore: 30,
  questions: [
    {
      id: 'legalStructure',
      question: 'What is your legal/corporate structure?',
      options: [
        {
          value: 'delaware_c',
          label: 'Delaware C-Corp',
          description: 'Properly structured for VC investment',
          score: 10,
          icon: '🏛️',
        },
        {
          value: 'other_corp',
          label: 'Other Corporation',
          description: 'C-Corp in another state or LLC',
          score: 6,
          icon: '📋',
        },
        {
          value: 'in_progress',
          label: 'In Progress',
          description: 'Currently setting up corporate structure',
          score: 3,
          icon: '⏳',
        },
        {
          value: 'not_incorporated',
          label: 'Not Incorporated',
          description: 'Operating informally or as sole prop',
          score: 1,
          icon: '📝',
        },
      ],
    },
    {
      id: 'financialTracking',
      question: 'How do you track your financials?',
      options: [
        {
          value: 'professional',
          label: 'Professional Systems',
          description: 'Accounting software + bookkeeper/CFO',
          score: 10,
          icon: '📈',
        },
        {
          value: 'organized',
          label: 'Organized',
          description: 'Using accounting software, self-managed',
          score: 7,
          icon: '📊',
        },
        {
          value: 'basic',
          label: 'Basic Tracking',
          description: 'Spreadsheets and bank statements',
          score: 4,
          icon: '📑',
        },
        {
          value: 'minimal',
          label: 'Minimal Tracking',
          description: 'Haven\'t set up proper financial systems',
          score: 1,
          icon: '⚠️',
        },
      ],
    },
    {
      id: 'dataRoom',
      question: 'Do you have an investor data room ready?',
      options: [
        {
          value: 'complete',
          label: 'Complete Data Room',
          description: 'All docs ready: pitch, financials, cap table, legal',
          score: 10,
          icon: '📁',
        },
        {
          value: 'mostly_ready',
          label: 'Mostly Ready',
          description: 'Core documents in place, some gaps',
          score: 7,
          icon: '📂',
        },
        {
          value: 'in_progress',
          label: 'Building It',
          description: 'Started compiling materials',
          score: 4,
          icon: '🔧',
        },
        {
          value: 'not_started',
          label: 'Not Started',
          description: 'Haven\'t created a data room yet',
          score: 1,
          icon: '📭',
        },
      ],
    },
  ],
};

// Capital Positioning Vector (10%)
const capitalPositioningVector: Vector = {
  id: 'capital',
  name: 'Capital Positioning',
  weight: 0.10,
  maxRawScore: 20,
  questions: [
    {
      id: 'fundraisingExperience',
      question: 'What is your fundraising experience?',
      options: [
        {
          value: 'previous_raise',
          label: 'Previous Raise',
          description: 'Successfully raised institutional capital before',
          score: 10,
          icon: '🎖️',
        },
        {
          value: 'angel_friends',
          label: 'Friends & Angels',
          description: 'Raised from angels or friends/family',
          score: 7,
          icon: '👼',
        },
        {
          value: 'bootstrapped',
          label: 'Bootstrapped',
          description: 'Self-funded, first time raising',
          score: 4,
          icon: '💪',
        },
        {
          value: 'no_experience',
          label: 'No Experience',
          description: 'New to fundraising process',
          score: 2,
          icon: '🆕',
        },
      ],
    },
    {
      id: 'investorRelations',
      question: 'How are your current investor relationships?',
      options: [
        {
          value: 'warm_intros',
          label: 'Warm Introductions',
          description: 'Have multiple warm intros to target investors',
          score: 10,
          icon: '🔥',
        },
        {
          value: 'some_connections',
          label: 'Some Connections',
          description: 'Know a few investors or have 1-2 intros',
          score: 6,
          icon: '🔗',
        },
        {
          value: 'cold_outreach',
          label: 'Cold Outreach',
          description: 'Primarily reaching out cold',
          score: 3,
          icon: '❄️',
        },
        {
          value: 'no_relationships',
          label: 'No Relationships',
          description: 'Haven\'t started building investor network',
          score: 1,
          icon: '🌍',
        },
      ],
    },
  ],
};

export const vectors: Vector[] = [
  pmfEvidenceVector,
  unitEconomicsVector,
  teamAdvisorsVector,
  infrastructureVector,
  capitalPositioningVector,
];

export const UNIT_ECONOMICS_PENALTY = -20;
export const UNIT_ECONOMICS_TRIGGER_VALUE = 'dont_know';

// Workshop definitions
export const workshops = {
  pmf: {
    priority: 'critical' as const,
    title: 'PMF Workshop',
    description: 'You have an execution gap. Join our workshop to validate your product-market fit before burning more capital.',
    calendarLink: 'https://calendar.google.com/calendar/event?action=TEMPLATE&text=zScale%20PMF%20Workshop&dates=20260215T140000/20260215T170000&details=Priority%20workshop%20for%20founders%20needing%20PMF%20validation',
  },
  investment_readiness: {
    priority: 'standard' as const,
    title: 'Investment Readiness Workshop',
    description: 'Your metrics are strong but your "Venture Math" is inconsistent. Learn how to package for institutional Series A.',
    calendarLink: 'https://calendar.google.com/calendar/event?action=TEMPLATE&text=zScale%20Investment%20Readiness%20Workshop&dates=20260220T140000/20260220T170000&details=Workshop%20for%20founders%20ready%20to%20package%20for%20Series%20A',
  },
  pitch_polish: {
    priority: 'advanced' as const,
    title: 'Pitch Polish & Network Access',
    description: 'You are ready. This workshop focuses on the handshake economy and warm intros to our Family Office network.',
    calendarLink: 'https://calendar.google.com/calendar/event?action=TEMPLATE&text=zScale%20Pitch%20Polish%20%26%20Network%20Access&dates=20260225T140000/20260225T170000&details=Elite%20workshop%20for%20investor-ready%20founders',
  },
};

export function getWorkshopRecommendation(score: number) {
  if (score <= 40) {
    return workshops.pmf;
  } else if (score <= 70) {
    return workshops.investment_readiness;
  } else {
    return workshops.pitch_polish;
  }
}
