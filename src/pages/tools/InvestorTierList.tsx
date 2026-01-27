import { useState, useMemo, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { investors, focusAreaOptions, stageOptions, FREE_INVESTOR_COUNT } from '../../data/investors';
import { InvestorTable } from '../../components/tools/investor/InvestorTable';
import { ActivePulseLegend } from '../../components/tools/investor/ActivePulse';
import { FilterSidebar, MobileFilterButton } from '../../components/tools/shared/FilterSidebar';
import { LeadCaptureModal } from '../../components/tools/shared/LeadCaptureModal';
import { ToolAccessGate } from '../../components/tools/shared/ToolAccessGate';
import { LeadCaptureConfig } from '../../types/tools';

const UNLOCK_STORAGE_KEY = 'unlocked_investor-list';

const leadCaptureConfig: LeadCaptureConfig = {
  tool: 'investor-list',
  title: 'Join zScale Premium Membership',
  description: 'Get full access to our Dallas investor database and exclusive founder resources.',
  buttonText: 'Join Premium Membership',
  benefits: [
    'Complete list of 25+ active Dallas investors',
    'Direct contact emails and LinkedIn profiles',
    'Portfolio company details for each investor',
    'Investment thesis and check size details',
    'Priority access to investor introductions',
  ],
};

const InvestorTierListContent = () => {
  const [isUnlocked, setIsUnlocked] = useState(() => {
    return localStorage.getItem(UNLOCK_STORAGE_KEY) === 'true';
  });
  const [showModal, setShowModal] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    focusAreas: [],
    stages: [],
  });

  // Check unlock state on mount
  useEffect(() => {
    const unlocked = localStorage.getItem(UNLOCK_STORAGE_KEY) === 'true';
    setIsUnlocked(unlocked);
  }, []);

  // Filter groups for sidebar
  const filterGroups = [
    { id: 'focusAreas', label: 'Focus Areas', options: focusAreaOptions },
    { id: 'stages', label: 'Investment Stage', options: stageOptions },
  ];

  // Filter investors based on selected filters
  const filteredInvestors = useMemo(() => {
    return investors.filter((investor) => {
      // Check focus areas filter
      if (selectedFilters.focusAreas.length > 0) {
        const hasMatchingFocus = investor.focusAreas.some((area) =>
          selectedFilters.focusAreas.includes(area)
        );
        if (!hasMatchingFocus) return false;
      }

      // Check stages filter
      if (selectedFilters.stages.length > 0) {
        const hasMatchingStage = investor.stages.some((stage) =>
          selectedFilters.stages.includes(stage)
        );
        if (!hasMatchingStage) return false;
      }

      return true;
    });
  }, [selectedFilters]);

  const handleFilterChange = (groupId: string, values: string[]) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [groupId]: values,
    }));
  };

  const handleClearFilters = () => {
    setSelectedFilters({
      focusAreas: [],
      stages: [],
    });
  };

  const handleUnlockSuccess = () => {
    setIsUnlocked(true);
    localStorage.setItem(UNLOCK_STORAGE_KEY, 'true');
  };

  const totalActiveFilters = Object.values(selectedFilters).reduce(
    (sum, arr) => sum + arr.length,
    0
  );

  return (
    <>
      <Helmet>
        <title>Dallas Investor Tier-List | Find Active VCs in DFW | zScale Capital</title>
        <meta
          name="description"
          content="Discover 25+ active Dallas investors. Filter by sector, stage, and check size. Free investor matchmaker for Texas startups."
        />
        <meta
          name="keywords"
          content="Dallas investors, Texas VC, DFW startup funding, Dallas venture capital, North Texas investors"
        />
        <link rel="canonical" href="https://zscalecapital.com/tools/investor-tier-list" />

        {/* Open Graph */}
        <meta property="og:title" content="Dallas Investor Tier-List | zScale Capital" />
        <meta
          property="og:description"
          content="Find your perfect investor match in Dallas-Fort Worth. 25+ active VCs with real-time activity data."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://zscalecapital.com/tools/investor-tier-list" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Dallas Investor Tier-List" />
        <meta
          name="twitter:description"
          content="25+ active Dallas investors with real-time activity data"
        />
      </Helmet>

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Dallas Investor Tier-List',
          description: 'Interactive investor matchmaker for Dallas startups',
          url: 'https://zscalecapital.com/tools/investor-tier-list',
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
        })}
      </script>

      <div className="min-h-screen bg-ink pt-20">
        {/* Hero Section */}
        <section className="bg-ink-light border-b border-ink-border">
          <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
            <div className="flex items-center gap-2 text-sm text-neutral-500 mb-4">
              <Link to="/" className="hover:text-accent transition-colors text-neutral-400">
                Home
              </Link>
              <span className="text-neutral-600">/</span>
              <span className="text-accent font-medium">Investor Tier-List</span>
            </div>

            <article>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Dallas Investor Tier-List
              </h1>
              <p className="text-lg text-neutral-400 max-w-2xl mb-8">
                Find investors actively deploying capital in the Dallas-Fort Worth area. Filter by
                sector, stage, and check size to find your perfect match.
              </p>

              {/* Legend */}
              <div className="p-4 bg-ink-medium border border-ink-border rounded-xl">
                <p className="text-sm font-medium text-white mb-3">Activity Indicators:</p>
                <ActivePulseLegend />
              </div>
            </article>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex gap-6">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block">
              <FilterSidebar
                filterGroups={filterGroups}
                selectedFilters={selectedFilters}
                onFilterChange={handleFilterChange}
                onClearAll={handleClearFilters}
              />
            </div>

            {/* Main Content Area */}
            <div className="flex-1">
              {/* Mobile Filter Button & Results Count */}
              <div className="flex items-center justify-between mb-4">
                <MobileFilterButton
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  activeCount={totalActiveFilters}
                />
                <p className="text-sm text-neutral-400">
                  Showing{' '}
                  <span className="font-medium text-accent">
                    {isUnlocked ? filteredInvestors.length : Math.min(FREE_INVESTOR_COUNT, filteredInvestors.length)}
                  </span>{' '}
                  of <span className="font-medium text-accent">{filteredInvestors.length}</span>{' '}
                  investors
                </p>
              </div>

              {/* Mobile Filters Panel */}
              {showMobileFilters && (
                <div className="lg:hidden mb-4 p-4 card-skeuomorphic">
                  {filterGroups.map((group) => (
                    <div key={group.id} className="mb-4 last:mb-0">
                      <p className="font-medium text-white mb-2">{group.label}</p>
                      <div className="flex flex-wrap gap-2">
                        {group.options.map((option) => {
                          const isSelected = (selectedFilters[group.id] || []).includes(option);
                          return (
                            <button
                              key={option}
                              onClick={() => {
                                const current = selectedFilters[group.id] || [];
                                handleFilterChange(
                                  group.id,
                                  isSelected
                                    ? current.filter((v) => v !== option)
                                    : [...current, option]
                                );
                              }}
                              className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                                isSelected
                                  ? 'bg-accent text-ink border-accent'
                                  : 'bg-ink-medium text-neutral-300 border-ink-border hover:border-accent hover:text-accent'
                              }`}
                            >
                              {option}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  {totalActiveFilters > 0 && (
                    <button
                      onClick={handleClearFilters}
                      className="text-sm text-accent hover:text-accent-hover mt-4"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              )}

              {/* Investor Table */}
              <section aria-labelledby="results">
                <h2 id="results" className="sr-only">
                  Matching Investors
                </h2>
                <InvestorTable
                  investors={filteredInvestors}
                  freeCount={FREE_INVESTOR_COUNT}
                  isUnlocked={isUnlocked}
                  onUnlockClick={() => setShowModal(true)}
                />
              </section>
            </div>
          </div>
        </div>

        {/* FAQ Section for SEO */}
        <section className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold text-white mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="card-skeuomorphic p-6">
              <h3 className="font-semibold text-white mb-2">
                How is investor activity measured?
              </h3>
              <p className="text-neutral-400">
                We track publicly announced deals, LinkedIn activity, and event participation
                to determine activity status. Green indicates a deal in the last 30 days,
                yellow for 90 days, and red for longer periods.
              </p>
            </div>
            <div className="card-skeuomorphic p-6">
              <h3 className="font-semibold text-white mb-2">
                How often is this list updated?
              </h3>
              <p className="text-neutral-400">
                Our investor database is updated weekly with new deals and activity data.
                We also add new investors as they become active in the Dallas ecosystem.
              </p>
            </div>
            <div className="card-skeuomorphic p-6">
              <h3 className="font-semibold text-white mb-2">
                What information is included in the premium membership?
              </h3>
              <p className="text-neutral-400">
                Premium members get access to direct contact emails, LinkedIn profiles, detailed
                portfolio company lists, investment thesis notes, and priority introductions.
              </p>
            </div>
          </div>
        </section>

        {/* Lead Capture Modal */}
        <LeadCaptureModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={handleUnlockSuccess}
          config={leadCaptureConfig}
        />
      </div>
    </>
  );
};

export const InvestorTierList = () => {
  return (
    <ToolAccessGate toolName="Dallas Investor Tier-List" toolId="investor-tier-list">
      <InvestorTierListContent />
    </ToolAccessGate>
  );
};
