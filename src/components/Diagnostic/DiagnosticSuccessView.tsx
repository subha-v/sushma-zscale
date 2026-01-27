import { Link } from 'react-router-dom';
import { isPremiumMember } from '../../config/api';

interface DiagnosticSuccessViewProps {
  firstName: string;
  sector: string;
  companyName?: string;
  onClose: () => void;
}

// Sector-specific advisor profiles
const SECTOR_ADVISORS: Record<
  string,
  {
    primary: AdvisorProfile;
    locked: AdvisorProfile[];
  }
> = {
  aerospace: {
    primary: {
      id: 'aerospace-primary',
      initials: 'RK',
      title: 'Aerospace & Defense Specialist',
      subtitle: 'Former VP of Operations, Major Defense Contractor',
      expertise: [
        'SBIR/STTR Grant Navigation',
        'Lockheed Martin Network',
        'Raytheon Procurement Channels',
      ],
      credibility: '25+ years in defense tech ecosystems',
      icon: '✈️',
    },
    locked: [
      {
        id: 'aerospace-locked-1',
        initials: 'JT',
        title: '30-Year Supply Chain Veteran',
        subtitle: 'Former SVP, Boeing Commercial',
        expertise: ['DoD Contracts', 'Tier-1 Supplier Networks'],
        credibility: 'Built $500M+ supply chain operations',
        icon: '🔧',
      },
      {
        id: 'aerospace-locked-2',
        initials: 'MR',
        title: 'Space Tech Commercialization Expert',
        subtitle: 'NASA Technology Transfer Specialist',
        expertise: ['SBIR Phase III', 'Space Force Contracts'],
        credibility: 'Spun out 8 NASA technologies',
        icon: '🚀',
      },
    ],
  },
  manufacturing: {
    primary: {
      id: 'manufacturing-primary',
      initials: 'JM',
      title: 'Manufacturing & Supply Chain Veteran',
      subtitle: '30-Year Veteran of Fortune 500 Operations',
      expertise: [
        'ISO Certification Pathways',
        'Contract Manufacturing',
        'Supply Chain Optimization',
      ],
      credibility: 'Built 3 exits in industrial automation',
      icon: '🏭',
    },
    locked: [
      {
        id: 'manufacturing-locked-1',
        initials: 'DW',
        title: 'Industrial Automation Specialist',
        subtitle: 'Former CTO, Major Robotics Firm',
        expertise: ['Industry 4.0', 'Predictive Maintenance'],
        credibility: '15 patents in manufacturing tech',
        icon: '⚙️',
      },
      {
        id: 'manufacturing-locked-2',
        initials: 'KL',
        title: 'FinTech Regulatory Specialist',
        subtitle: 'Former VP Compliance, Major Bank',
        expertise: ['Equipment Financing', 'Trade Finance'],
        credibility: 'Structured $2B+ in industrial finance',
        icon: '💰',
      },
    ],
  },
  healthcare: {
    primary: {
      id: 'healthcare-primary',
      initials: 'SP',
      title: 'Healthcare & MedTech Advisor',
      subtitle: 'Former Physician Advisor to Major Hospital Networks',
      expertise: [
        'FDA Regulatory Pathways',
        'Clinical Trial Design',
        'Hospital System Procurement',
      ],
      credibility: 'Guided 12 MedTech companies through FDA approval',
      icon: '🏥',
    },
    locked: [
      {
        id: 'healthcare-locked-1',
        initials: 'AB',
        title: 'Digital Health Strategist',
        subtitle: 'Former Chief Digital Officer, Major Health System',
        expertise: ['HIPAA Compliance', 'EHR Integration'],
        credibility: 'Deployed telemedicine across 200+ facilities',
        icon: '💊',
      },
      {
        id: 'healthcare-locked-2',
        initials: 'CT',
        title: 'FinTech Regulatory Specialist',
        subtitle: 'Former Healthcare M&A Partner',
        expertise: ['PE Exits', 'Strategic Acquisitions'],
        credibility: '$1.5B+ in healthcare exits',
        icon: '📊',
      },
    ],
  },
  fintech: {
    primary: {
      id: 'fintech-primary',
      initials: 'MK',
      title: 'FinTech Regulatory Specialist',
      subtitle: 'Former Chief Compliance Officer, Major Bank',
      expertise: [
        'Banking Charter Navigation',
        'SEC/FINRA Compliance',
        'Payment Rails Architecture',
      ],
      credibility: 'Led compliance for $50B+ in transactions',
      icon: '📊',
    },
    locked: [
      {
        id: 'fintech-locked-1',
        initials: 'RJ',
        title: 'Payments Infrastructure Expert',
        subtitle: 'Former VP Engineering, Payment Processor',
        expertise: ['PCI Compliance', 'Real-time Payments'],
        credibility: 'Built payment systems processing $10B/year',
        icon: '💳',
      },
      {
        id: 'fintech-locked-2',
        initials: 'NP',
        title: '30-Year Supply Chain Veteran',
        subtitle: 'Former CFO, Regional Bank',
        expertise: ['Bank Partnerships', 'BaaS Integrations'],
        credibility: 'Structured 25+ FinTech partnerships',
        icon: '🏦',
      },
    ],
  },
  saas: {
    primary: {
      id: 'saas-primary',
      initials: 'TH',
      title: 'Enterprise SaaS GTM Leader',
      subtitle: 'Former CRO, B2B Software Company',
      expertise: [
        'Enterprise Sales Playbooks',
        'Channel Partner Strategy',
        'Product-Led Growth',
      ],
      credibility: 'Scaled ARR from $2M to $50M',
      icon: '☁️',
    },
    locked: [
      {
        id: 'saas-locked-1',
        initials: 'EK',
        title: 'Platform Architecture Specialist',
        subtitle: 'Former VP Engineering, Cloud Platform',
        expertise: ['Multi-tenant Architecture', 'SOC 2 Compliance'],
        credibility: 'Architected platforms serving 10M+ users',
        icon: '🔐',
      },
      {
        id: 'saas-locked-2',
        initials: 'LM',
        title: 'FinTech Regulatory Specialist',
        subtitle: 'Former VP Strategy, Major SaaS Co',
        expertise: ['M&A Preparation', 'Strategic Partnerships'],
        credibility: 'Advised on 3 successful exits',
        icon: '🎯',
      },
    ],
  },
  energy: {
    primary: {
      id: 'energy-primary',
      initials: 'BW',
      title: 'Energy & CleanTech Specialist',
      subtitle: 'Former VP Operations, Major Energy Company',
      expertise: [
        'Grid Integration',
        'Utility Partnerships',
        'ERCOT Navigation',
      ],
      credibility: '20+ years in Texas energy markets',
      icon: '⚡',
    },
    locked: [
      {
        id: 'energy-locked-1',
        initials: 'RP',
        title: 'Renewable Project Finance Expert',
        subtitle: 'Former MD, Energy Investment Bank',
        expertise: ['Tax Equity Structures', 'PPA Negotiations'],
        credibility: 'Financed $3B+ in renewable projects',
        icon: '🌱',
      },
      {
        id: 'energy-locked-2',
        initials: 'HG',
        title: '30-Year Supply Chain Veteran',
        subtitle: 'Former Chief Innovation Officer',
        expertise: ['Carbon Markets', 'ESG Strategy'],
        credibility: 'Led sustainability at Fortune 100',
        icon: '🌍',
      },
    ],
  },
};

interface AdvisorProfile {
  id: string;
  initials: string;
  title: string;
  subtitle: string;
  expertise: string[];
  credibility: string;
  icon: string;
}

// Shadow Capital Partners - Additional Locked Content
const SHADOW_PARTNERS = [
  { initials: 'DL', label: 'Shadow Capital Partner', tier: 'Platinum' },
  { initials: 'AS', label: 'Shadow Capital Partner', tier: 'Gold' },
  { initials: 'TB', label: 'Shadow Capital Partner', tier: 'Gold' },
  { initials: 'CH', label: 'Shadow Capital Partner', tier: 'Silver' },
  { initials: 'WR', label: 'Shadow Capital Partner', tier: 'Silver' },
];

// Default advisors for unknown sectors
const DEFAULT_ADVISORS = SECTOR_ADVISORS.manufacturing;

export const DiagnosticSuccessView = ({
  firstName,
  sector,
  companyName,
  onClose,
}: DiagnosticSuccessViewProps) => {
  // Check if user is Alpha member
  const isAlphaMember = isPremiumMember();

  // Get sector-specific advisors
  const sectorKey = sector?.toLowerCase() || 'manufacturing';
  const advisors = SECTOR_ADVISORS[sectorKey] || DEFAULT_ADVISORS;
  const primaryAdvisor = advisors.primary;
  const lockedAdvisors = advisors.locked;

  // Format sector for display
  const sectorDisplay = sector
    ? sector.charAt(0).toUpperCase() + sector.slice(1).replace('-', ' ')
    : 'Technology';

  return (
    <div className="animate-fadeIn">
      {/* Status Bar - Institutional Grade */}
      <div className="mb-8 p-4 bg-ink-medium border border-ink-border rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-accent animate-pulse" />
            <span className="text-sm font-mono text-accent uppercase tracking-wide">
              Institutional Grade
            </span>
          </div>
          <span className="text-sm text-neutral-500 font-medium">
            Verification Pending
          </span>
        </div>
      </div>

      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">
          Diagnostic Complete: 3 High-Tier Advisor Matches Identified
        </h2>

        <p className="text-neutral-400 max-w-lg mx-auto">
          {firstName ? `${firstName}, based` : 'Based'} on your{' '}
          <span className="text-white font-medium">{sectorDisplay}</span> focus
          {companyName && (
            <>
              {' '}
              and <span className="text-white font-medium">{companyName}</span>
              's stage
            </>
          )}
          , we've matched you with advisors who have operational moats in the
          Dallas-Fort Worth ecosystem.
        </p>
      </div>

      {/* Match 1 - Active/Unlocked */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-sm font-medium text-white uppercase tracking-wide">
            Match 1
          </h3>
          <span className="px-2 py-0.5 bg-accent/10 border border-accent/30 rounded text-xs text-accent">
            Active
          </span>
        </div>

        <div className="p-5 bg-ink-medium border border-accent/30 rounded-xl">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 flex-shrink-0 bg-gradient-to-br from-accent/20 to-ink-light border border-accent/30 rounded-xl flex items-center justify-center">
              <span className="text-2xl">{primaryAdvisor.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-white font-semibold">
                  {primaryAdvisor.title}
                </h4>
              </div>
              <p className="text-neutral-400 text-sm mb-3">
                {primaryAdvisor.subtitle}
              </p>

              {/* Expertise Tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                {primaryAdvisor.expertise.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-ink-light border border-ink-border rounded text-xs text-neutral-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <p className="text-xs text-accent mb-4">{primaryAdvisor.credibility}</p>

              {/* Request Intro Button - Only for Alpha members */}
              {isAlphaMember ? (
                <button className="px-4 py-2 bg-accent text-ink font-semibold text-sm rounded-lg hover:brightness-110 transition-all">
                  Request Warm Introduction
                </button>
              ) : (
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Upgrade to Alpha to request intro</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Matches 2 & 3 - Locked for non-Alpha, Unlocked for Alpha */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wide">
            Matches 2 & 3
          </h3>
          <span className={`px-2 py-0.5 rounded text-xs ${
            isAlphaMember
              ? 'bg-accent/10 border border-accent/30 text-accent'
              : 'bg-neutral-800 border border-ink-border text-neutral-500'
          }`}>
            {isAlphaMember ? 'Unlocked' : 'Locked'}
          </span>
        </div>

        <div className="space-y-4">
          {lockedAdvisors.map((advisor) => (
            <div
              key={advisor.id}
              className={`relative p-5 bg-ink-medium rounded-xl overflow-hidden ${
                isAlphaMember ? 'border border-accent/30' : 'border border-ink-border'
              }`}
            >
              {/* Blur overlay with lock - Only show for non-Alpha members */}
              {!isAlphaMember && (
                <div className="absolute inset-0 backdrop-blur-[6px] bg-ink/60 z-10 flex items-center justify-center">
                  <div className="flex items-center gap-3 px-4 py-2 bg-ink-medium/80 border border-ink-border rounded-lg">
                    <svg
                      className="w-5 h-5 text-neutral-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    <span className="text-sm text-neutral-400">
                      {advisor.title}
                    </span>
                  </div>
                </div>
              )}

              {/* Content - Blurred for non-Alpha, clear for Alpha */}
              <div className={`flex items-start gap-4 ${!isAlphaMember ? 'blur-[2px]' : ''}`}>
                <div className="w-14 h-14 flex-shrink-0 bg-gradient-to-br from-accent/20 to-ink-light border border-accent/30 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">{advisor.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-white font-semibold">
                      {advisor.title}
                    </h4>
                  </div>
                  <p className="text-neutral-400 text-sm mb-3">
                    {advisor.subtitle}
                  </p>

                  {/* Expertise Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {advisor.expertise.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-ink-light border border-ink-border rounded text-xs text-neutral-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs text-accent">{advisor.credibility}</p>

                  {/* Request Intro Button - Only for Alpha members */}
                  {isAlphaMember && (
                    <button className="mt-4 px-4 py-2 bg-accent text-ink font-semibold text-sm rounded-lg hover:brightness-110 transition-all">
                      Request Warm Introduction
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* The Paid Gap - Urgency Message - Only for non-Alpha */}
      {!isAlphaMember && (
        <div className="mb-8 p-5 bg-gradient-to-r from-accent/5 via-accent/10 to-accent/5 border border-accent/20 rounded-xl">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-accent/10 border border-accent/30 rounded-full">
              <svg
                className="w-6 h-6 text-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>

            <h4 className="text-white font-semibold text-lg mb-2">
              You are currently missing 80% of the "Handshake" network
            </h4>

            <p className="text-neutral-400 text-sm max-w-md mx-auto">
              The Dallas "Rolodex Economy" runs on warm introductions. Without
              institutional-grade credentialing, founders miss access to the
              Shadow Capital partners who write $2M+ checks.
            </p>
          </div>
        </div>
      )}

      {/* Shadow Network Gallery - Conditional based on Alpha status */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wide">
            Shadow Capital Network
          </h3>
          <span className={`text-xs ${isAlphaMember ? 'text-accent' : 'text-neutral-600'}`}>
            {isAlphaMember ? '5 Partners Available' : '5 Partners Locked'}
          </span>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {SHADOW_PARTNERS.map((partner, index) => (
            <div
              key={index}
              className={`relative p-3 bg-ink-medium rounded-lg overflow-hidden ${
                isAlphaMember ? 'border border-accent/30' : 'border border-ink-border'
              }`}
            >
              {/* Blur overlay with lock - Only for non-Alpha */}
              {!isAlphaMember && (
                <div className="absolute inset-0 backdrop-blur-sm bg-ink/70 z-10 flex flex-col items-center justify-center">
                  <svg
                    className="w-4 h-4 text-neutral-600 mb-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
              )}

              {/* Content - Blurred for non-Alpha, clear for Alpha */}
              <div className={`text-center ${!isAlphaMember ? 'blur-sm' : ''}`}>
                <div className="w-8 h-8 mx-auto mb-1 bg-gradient-to-br from-accent/20 to-ink-light border border-accent/30 rounded-lg flex items-center justify-center text-accent text-sm font-medium">
                  {partner.initials}
                </div>
                <span className="text-[10px] text-accent">{partner.tier}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action - Upgrade CTA for non-Alpha OR Success message for Alpha */}
      <div className="text-center mb-8">
        {isAlphaMember ? (
          <>
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-accent/10 border border-accent/30 rounded-full mb-3">
              <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-accent font-semibold">Alpha Access Verified</span>
            </div>
            <p className="text-sm text-neutral-400">
              You have full access to all advisor profiles and warm introduction requests.
            </p>
          </>
        ) : (
          <>
            <Link
              to="/membership"
              className="inline-flex items-center gap-3 px-8 py-4 bg-accent text-ink font-semibold rounded-full hover:brightness-110 transition-all duration-300 hover:shadow-glow no-underline"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                />
              </svg>
              Join Alpha Tier Membership
            </Link>

            <p className="text-xs text-neutral-600 mt-3">
              Unlock all advisors + direct warm introduction requests
            </p>
          </>
        )}
      </div>

      {/* Closing the Dallas Exit Gap */}
      <div className="p-4 bg-ink-light border border-ink-border rounded-xl text-center">
        <p className="text-sm text-neutral-400">
          <span className="text-white font-medium">The Dallas Exit Gap:</span>{' '}
          Founders with institutional credentialing close 3.2x faster than those
          without warm network access.
        </p>
      </div>

      {/* Close / Done */}
      <div className="mt-8 pt-6 border-t border-ink-border text-center">
        <button
          onClick={onClose}
          className="text-neutral-500 hover:text-white text-sm transition-colors"
        >
          Close & Return
        </button>
      </div>
    </div>
  );
};
