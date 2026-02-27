import { useState } from 'react';
import { Link } from 'react-router-dom';

type TabKey = 'edc' | 'colleges' | 'consultants';

interface UseCase {
  number: string;
  challenge: string;
  solution: string;
  outcome: string;
}

interface TabData {
  label: string;
  title: string;
  lead: string;
  useCases: UseCase[];
  features: string[];
  roi: { value: string; label: string }[];
}

const tabData: Record<TabKey, TabData> = {
  edc: {
    label: 'Economic Development',
    title: 'For Economic Development Corporations',
    lead: 'Stop spending days compiling business lists for RFPs. Get data-backed answers in minutes. Track retention risks before businesses close.',
    useCases: [
      {
        number: '01',
        challenge: 'We need labor market data for an RFP response due in 48 hours.',
        solution:
          'Pull industry-specific employment, wage data, and competitor analysis for any Texas county in under 10 minutes.',
        outcome: 'Win more projects with faster, data-backed proposals',
      },
      {
        number: '02',
        challenge: 'A major employer is considering leaving. We had no warning signs.',
        solution:
          'Monitor hiring freezes, layoff signals, and expansion indicators across your top 50 employers automatically.',
        outcome: 'Prevent 2-3 business closures per year through early intervention',
      },
      {
        number: '03',
        challenge: "Board members want monthly updates but I'm spending 20+ hours on reports.",
        solution:
          'Generate board-ready reports in minutes with pre-built templates covering jobs, wages, and industry trends.',
        outcome: 'Save 100+ hours annually on reporting',
      },
      {
        number: '04',
        challenge: "We want to target aerospace suppliers but don't know where to start.",
        solution:
          'Identify supply chain gaps, track competitor counties, and build targeted prospect lists by NAICS code.',
        outcome: 'Build data-driven industry targeting strategies',
      },
    ],
    features: [
      'County-level dashboard with employment trends',
      'Business retention early warning system',
      'Board report templates (PDF, PowerPoint)',
      'Industry cluster analysis and targeting',
      'Multi-county regional comparisons',
    ],
    roi: [
      { value: '100+', label: 'hours saved' },
      { value: '5x', label: 'more RFPs' },
      { value: '2-3', label: 'closures prevented' },
      { value: '10X', label: 'ROI' },
    ],
  },
  colleges: {
    label: 'Community Colleges',
    title: 'For Community Colleges',
    lead: "Align training programs with real employer demand. Track 50,000+ job openings. Show advisory boards what skills are actually needed in your service region.",
    useCases: [
      {
        number: '01',
        challenge: "We're launching a new welding program but don't know actual employer demand.",
        solution:
          'See real-time job postings, wage ranges, and employer counts for any occupation in your service area.',
        outcome: 'Launch programs with proven employment demand',
      },
      {
        number: '02',
        challenge: 'Advisory board members want data on industry trends, not just our opinions.',
        solution:
          'Generate employer-specific reports showing hiring trends, skill requirements, and wage growth by industry.',
        outcome: 'Build 50+ employer partnerships with data-backed outreach',
      },
      {
        number: '03',
        challenge: 'HB 8 requires us to demonstrate workforce alignment. We need proof.',
        solution:
          'Track graduate placement rates against actual job openings. Map program outcomes to employer needs.',
        outcome: 'Secure $8M-$12M in Tier 1 performance funding',
      },
      {
        number: '04',
        challenge: 'Should we expand our healthcare programs or pivot to manufacturing?',
        solution:
          'Compare job growth trajectories, wage premiums, and employer concentration across industries.',
        outcome: 'Make data-backed program expansion decisions',
      },
    ],
    features: [
      'Skills gap dashboard by occupation',
      'Employer contact lists by industry',
      'Program-to-job alignment scoring',
      'Advisory board report templates',
      'Graduate placement tracking',
    ],
    roi: [
      { value: '15-25%', label: 'placement increase' },
      { value: '$8-12M', label: 'funding' },
      { value: '50+', label: 'employer partnerships' },
      { value: '100%', label: 'data-backed decisions' },
    ],
  },
  consultants: {
    label: 'Site Consultants',
    title: 'For Site Selection Consultants',
    lead: 'Respond to client RFPs faster. Compare labor markets across 254 Texas counties. Export professional white-label reports in seconds.',
    useCases: [
      {
        number: '01',
        challenge: "Client wants labor analysis for 5 Texas markets by Friday. It's Wednesday.",
        solution:
          'Generate comparative labor market reports for multiple counties in under 30 minutes with standardized metrics.',
        outcome: 'Deliver client reports 20 hours faster per project',
      },
      {
        number: '02',
        challenge: 'We need to verify labor availability claims from competing EDCs.',
        solution:
          'Access verified state employment data, commute patterns, and occupation concentrations independent of EDC marketing.',
        outcome: 'Provide clients with unbiased, third-party data',
      },
      {
        number: '03',
        challenge: 'Each client project requires rebuilding the same analysis from scratch.',
        solution:
          'Save project templates, comparison frameworks, and custom metrics. Reuse across similar engagements.',
        outcome: 'Save 400+ hours annually across all projects',
      },
      {
        number: '04',
        challenge: "Clients want reports with our branding, not a third-party platform watermark.",
        solution:
          "Export white-label PDF and PowerPoint reports with your firm's logo, colors, and formatting.",
        outcome: 'Deliver premium client deliverables instantly',
      },
    ],
    features: [
      'Statewide access to all 254 Texas counties',
      'Side-by-side market comparison tool',
      'White-label PDF and PowerPoint exports',
      'API access for custom integrations',
      'Project management and saved templates',
    ],
    roi: [
      { value: '20 hrs', label: 'saved per project' },
      { value: '400 hrs', label: 'annually' },
      { value: '$80K+', label: 'value' },
      { value: '2X', label: 'faster turnaround' },
    ],
  },
};

const tabs: { key: TabKey; label: string }[] = [
  { key: 'edc', label: 'Economic Development' },
  { key: 'colleges', label: 'Community Colleges' },
  { key: 'consultants', label: 'Site Consultants' },
];

const includedStats = [
  { value: '47,312', label: 'Texas Businesses' },
  { value: '50K+', label: 'Active Job Postings' },
  { value: 'Quarterly', label: 'Trend Updates' },
  { value: 'Unlimited', label: 'Report Exports' },
];

export const SolutionsPage = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('edc');
  const current = tabData[activeTab];

  return (
    <div className="bg-black min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-4">
            Solutions
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Solutions Built for Your Mission
          </h1>
          <p className="text-[#A0A0A0] text-lg md:text-xl max-w-3xl mx-auto">
            Whether you're recruiting new businesses, aligning workforce programs, or advising
            corporate clients, zScale gives you the data and tools to move faster and win more.
          </p>
        </div>
      </section>

      {/* Tabbed Interface Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          {/* Tab Navigation */}
          <div className="flex flex-col sm:flex-row border-b border-[#1A1A1A] mb-12">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-4 text-sm font-semibold tracking-wide uppercase transition-colors duration-200 border-b-2 ${
                  activeTab === tab.key
                    ? 'text-accent border-accent'
                    : 'text-[#707070] border-transparent hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div>
            {/* Tab Header */}
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{current.title}</h2>
              <p className="text-[#A0A0A0] text-lg max-w-3xl">{current.lead}</p>
            </div>

            {/* Use Case Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
              {current.useCases.map((useCase) => (
                <div
                  key={useCase.number}
                  className="bg-[#111111] border border-[#1A1A1A] rounded-lg p-6 md:p-8"
                >
                  <span className="text-accent text-sm font-bold tracking-widest">
                    {useCase.number}
                  </span>
                  <div className="mt-4 space-y-4">
                    <div>
                      <p className="text-[#707070] text-xs font-semibold uppercase tracking-wider mb-1">
                        Challenge
                      </p>
                      <p className="text-white font-medium">"{useCase.challenge}"</p>
                    </div>
                    <div>
                      <p className="text-[#707070] text-xs font-semibold uppercase tracking-wider mb-1">
                        Solution
                      </p>
                      <p className="text-[#A0A0A0]">{useCase.solution}</p>
                    </div>
                    <div>
                      <p className="text-[#707070] text-xs font-semibold uppercase tracking-wider mb-1">
                        Outcome
                      </p>
                      <p className="text-accent font-semibold">{useCase.outcome}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Key Features */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold text-white mb-6">Key Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {current.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 bg-[#111111] border border-[#1A1A1A] rounded-lg p-4"
                  >
                    <span className="text-accent mt-0.5">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>
                    <span className="text-[#A0A0A0]">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ROI Stats Grid */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Expected ROI</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {current.roi.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-[#111111] border border-[#1A1A1A] rounded-lg p-6 text-center"
                  >
                    <p className="text-accent text-3xl md:text-4xl font-bold mb-2">{stat.value}</p>
                    <p className="text-[#707070] text-sm uppercase tracking-wider">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included Section */}
      <section className="py-16 md:py-24 border-t border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What's Included in Every Plan
            </h2>
            <p className="text-[#A0A0A0] text-lg max-w-2xl mx-auto">
              Core capabilities available across all zScale licenses
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {includedStats.map((stat, index) => (
              <div
                key={index}
                className="bg-[#111111] border border-[#1A1A1A] rounded-lg p-6 md:p-8 text-center"
              >
                <p className="text-accent text-3xl md:text-4xl font-bold mb-2">{stat.value}</p>
                <p className="text-[#A0A0A0] text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 md:py-24 border-t border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to See zScale in Action?
          </h2>
          <p className="text-[#A0A0A0] text-lg max-w-2xl mx-auto mb-8">
            Schedule a personalized demo and see how zScale can transform your workflow.
          </p>
          <Link
            to="/demo"
            className="inline-block bg-accent text-black font-semibold px-8 py-4 rounded-lg hover:opacity-90 transition-opacity"
          >
            Request Demo
          </Link>
        </div>
      </section>
    </div>
  );
};
