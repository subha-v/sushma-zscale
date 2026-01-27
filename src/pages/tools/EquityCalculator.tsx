import { useState, useMemo, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  calculateEquity,
  getRecommendedVesting,
  stageLabels,
  roleLabels,
  experienceLabels,
  benchmarkData,
} from '../../data/equityBenchmarks';
import { CompanyStage, AdvisorRole, ExperienceLevel } from '../../types/tools';
import { EquitySlider, EquitySelect } from '../../components/tools/equity/EquitySlider';
import { BenchmarkComparison } from '../../components/tools/equity/BenchmarkComparison';
import { DonutChart } from '../../components/tools/shared/DonutChart';
import { AlphaUpgradeCard, AlphaUpgradeBanner } from '../../components/tools/shared/AlphaUpgradeCard';
import { GOOGLE_SCRIPT_URL, FORM_TYPES, getUserProgress } from '../../config/api';

export const EquityCalculator = () => {
  const [stage, setStage] = useState<CompanyStage>('mvp');
  const [role, setRole] = useState<AdvisorRole>('strategic');
  const [hoursPerMonth, setHoursPerMonth] = useState(5);
  const [experience, setExperience] = useState<ExperienceLevel>('expert');
  const [hasCalculated, setHasCalculated] = useState(false);
  const hasSubmittedRef = useRef(false);

  // Get user progress from IRI
  const userProgress = useMemo(() => getUserProgress(), []);

  // Calculate equity based on inputs
  const equityResult = useMemo(() => {
    return calculateEquity(stage, role, hoursPerMonth, experience);
  }, [stage, role, hoursPerMonth, experience]);

  // Get vesting recommendation
  const vestingRecommendation = useMemo(() => {
    return getRecommendedVesting(role);
  }, [role]);

  // Submit to backend when user calculates
  const handleCalculate = () => {
    setHasCalculated(true);

    // Submit data to backend
    if (!hasSubmittedRef.current) {
      hasSubmittedRef.current = true;

      const payload = {
        formType: FORM_TYPES.EQUITY_EVALUATOR,
        // User info from IRI or localStorage
        email: userProgress.email || localStorage.getItem('lead_email') || '',
        firstName: userProgress.firstName || localStorage.getItem('lead_name')?.split(' ')[0] || '',
        lastName: userProgress.lastName || localStorage.getItem('lead_name')?.split(' ').slice(1).join(' ') || '',
        companyName: userProgress.company || '',
        sector: userProgress.sector || '',
        iriScore: userProgress.iriScore || '',
        // Equity Inputs
        companyStage: stage,
        advisorRole: role,
        advisorExperienceLevel: experience,
        hoursPerMonth: hoursPerMonth,
        vestingPeriodMonths: vestingRecommendation.duration,
        // Equity Outputs
        recommendedEquityPercent: equityResult.recommended,
        equityRangeMin: equityResult.min,
        equityRangeMax: equityResult.max,
        vestingSchedule: vestingRecommendation.schedule,
        source: 'equity-calculator',
        timestamp: new Date().toISOString(),
      };

      fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(console.error);
    }
  };

  // Also submit on significant changes after first calculation
  useEffect(() => {
    if (hasCalculated && hasSubmittedRef.current) {
      // Reset to allow resubmission on parameter changes
      hasSubmittedRef.current = false;
    }
  }, [stage, role, hoursPerMonth, experience, hasCalculated]);

  // Prepare dropdown options
  const stageOptions = Object.entries(stageLabels).map(([value, label]) => ({
    value: value as CompanyStage,
    label,
  }));

  const roleOptions = Object.entries(roleLabels).map(([value, label]) => ({
    value: value as AdvisorRole,
    label,
  }));

  const experienceOptions = Object.entries(experienceLabels).map(([value, label]) => ({
    value: value as ExperienceLevel,
    label,
  }));

  // Prepare donut chart data
  const donutSegments = [
    { value: equityResult.recommended, color: '#01F9C6', label: 'Advisor Equity' },
    { value: 100 - equityResult.recommended, color: '#1C1C1E', label: 'Remaining' },
  ];

  return (
    <>
      <Helmet>
        <title>Advisor Equity Calculator | Fair Startup Advisor Compensation | zScale Capital</title>
        <meta
          name="description"
          content="Calculate fair advisor equity for your startup. Get data-driven recommendations based on stage, role, and commitment level."
        />
        <meta
          name="keywords"
          content="advisor equity calculator, startup equity calculator, advisor compensation, startup advisor vesting, FAST agreement"
        />
        <link rel="canonical" href="https://zscalecapital.com/tools/equity-calculator" />

        {/* Open Graph */}
        <meta property="og:title" content="Advisor Equity Calculator | zScale Capital" />
        <meta
          property="og:description"
          content="Calculate fair equity for startup advisors with our free tool."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://zscalecapital.com/tools/equity-calculator" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Advisor Equity Calculator" />
        <meta
          name="twitter:description"
          content="Data-driven advisor equity recommendations for startups"
        />
      </Helmet>

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Advisor Equity Calculator',
          description: 'Calculate fair equity compensation for startup advisors',
          url: 'https://zscalecapital.com/tools/equity-calculator',
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
        {/* Header Section */}
        <section className="bg-ink-light border-b border-ink-border">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center gap-2 text-sm text-neutral-500 mb-4">
              <Link to="/" className="hover:text-accent transition-colors text-neutral-400">
                Home
              </Link>
              <span className="text-neutral-600">/</span>
              <span className="text-accent font-medium">Equity Calculator</span>
            </div>

            <article>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl lg:text-4xl font-bold text-white">
                  Advisor Equity Calculator
                </h1>
                <span className="px-3 py-1 bg-accent/10 border border-accent/30 rounded-full text-xs text-accent font-medium">
                  Free Tool
                </span>
              </div>
              <p className="text-lg text-neutral-400">
                Determine fair equity compensation for your startup advisors based on stage,
                involvement level, and market benchmarks.
              </p>
            </article>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="max-w-7xl mx-auto px-6 py-8">
          {/* Input Form */}
          <div className="card-skeuomorphic p-6 mb-8">
            <h2 className="text-lg font-semibold text-white mb-6">Advisor Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <EquitySelect
                value={stage}
                options={stageOptions}
                label="Company Stage"
                onChange={setStage}
              />
              <EquitySelect
                value={role}
                options={roleOptions}
                label="Advisor Role"
                onChange={setRole}
              />
              <EquitySelect
                value={experience}
                options={experienceOptions}
                label="Experience Level"
                onChange={setExperience}
              />
              <EquitySlider
                value={hoursPerMonth}
                min={1}
                max={20}
                label="Hours/Month"
                valueLabel={`${hoursPerMonth} hrs`}
                onChange={setHoursPerMonth}
              />
            </div>

            {/* Calculate Button */}
            <div className="mt-6 text-center">
              <button
                onClick={handleCalculate}
                className="px-8 py-4 bg-[#01F9C6] text-[#0A0A0B] font-semibold rounded-xl hover:brightness-110 transition-all duration-200 shadow-[0_0_20px_rgba(1,249,198,0.3)]"
              >
                Calculate Equity
              </button>
            </div>
          </div>

          {/* Results Section - Only shown after calculation */}
          {hasCalculated && (
            <>
              {/* Basic Results - Always Visible */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Main Result with Donut */}
                <div className="card-skeuomorphic p-6 text-center">
                  <h3 className="text-lg font-semibold text-white mb-4">Recommended Equity</h3>
                  <DonutChart
                    segments={donutSegments}
                    size={160}
                    strokeWidth={20}
                    centerValue={`${equityResult.recommended.toFixed(2)}%`}
                    centerLabel="Equity"
                  />
                  <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-ink-medium rounded-full">
                    <span className="text-sm text-neutral-500">Fair Range:</span>
                    <span className="font-semibold text-accent">
                      {equityResult.min.toFixed(2)}% - {equityResult.max.toFixed(2)}%
                    </span>
                  </div>

                  {/* Alpha upgrade banner for this card */}
                  <AlphaUpgradeBanner />
                </div>

                {/* Vesting Details */}
                <div className="card-skeuomorphic p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Vesting Schedule</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-accent/10 rounded-xl border border-accent/20">
                      <p className="text-sm text-neutral-500">Recommended Period</p>
                      <p className="text-2xl font-bold text-accent">
                        {vestingRecommendation.duration} months
                      </p>
                    </div>
                    <div className="p-4 bg-ink-medium rounded-xl">
                      <p className="text-sm text-neutral-500">Vesting Frequency</p>
                      <p className="text-xl font-semibold text-white">
                        {vestingRecommendation.schedule}
                      </p>
                    </div>
                    <p className="text-sm text-neutral-500">{vestingRecommendation.description}</p>
                  </div>
                </div>

                {/* Benchmark Comparison */}
                <div className="card-skeuomorphic p-6">
                  <BenchmarkComparison
                    benchmarks={benchmarkData}
                    recommendedEquity={equityResult.recommended}
                  />
                </div>
              </div>

              {/* Strategic Gate - Dilution Forecast & Cap Table Red Flags */}
              <AlphaUpgradeCard
                title="Dilution Forecast & Cap Table Analysis Locked"
                description="Get personalized equity structuring advice and cap table red flag detection."
              >
                {/* Alpha Content - Only shown to Alpha members */}
                <div className="card-skeuomorphic p-8 mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-accent"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Alpha Strategic Analysis</h3>
                      <p className="text-sm text-neutral-400">
                        Exclusive insights for zScale Alpha members
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Dilution Forecast */}
                    <div className="p-4 bg-ink-medium rounded-xl border border-accent/20">
                      <h4 className="font-semibold text-accent mb-2">Dilution Forecast</h4>
                      <p className="text-sm text-neutral-400">
                        At {equityResult.recommended.toFixed(2)}% for this advisor, you're
                        maintaining healthy founder equity. Over 3 rounds, expect ~{(equityResult.recommended * 2.5).toFixed(1)}% total advisor dilution.
                      </p>
                    </div>
                    {/* Cap Table Red Flags */}
                    <div className="p-4 bg-ink-medium rounded-xl border border-red-500/20">
                      <h4 className="font-semibold text-red-400 mb-2">Cap Table Red Flags</h4>
                      <p className="text-sm text-neutral-400">
                        {equityResult.recommended > 1
                          ? "⚠️ Equity above 1% for a single advisor may raise investor concerns. Ensure strong value justification."
                          : "✓ Equity allocation within standard ranges. No red flags detected."}
                      </p>
                    </div>
                    <div className="p-4 bg-ink-medium rounded-xl">
                      <h4 className="font-semibold text-white mb-2">Investor Alignment</h4>
                      <p className="text-sm text-neutral-400">
                        Start at {equityResult.min.toFixed(2)}% and be prepared to go up to{' '}
                        {equityResult.max.toFixed(2)}% for exceptional advisors with proven track
                        records in your sector.
                      </p>
                    </div>
                    <div className="p-4 bg-ink-medium rounded-xl">
                      <h4 className="font-semibold text-white mb-2">FAST Agreement Template</h4>
                      <p className="text-sm text-neutral-400">
                        Use FAST agreement for standard arrangements. Alpha members get access to our
                        customized templates with Dallas-specific terms.
                      </p>
                    </div>
                  </div>
                </div>
              </AlphaUpgradeCard>
            </>
          )}
        </section>

        {/* How It Works - Always Visible */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="card-skeuomorphic p-6">
            <h2 className="text-xl font-bold text-white mb-6 text-center">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-accent font-bold">1</span>
                </div>
                <h3 className="font-semibold text-white mb-1">Stage Factor</h3>
                <p className="text-sm text-neutral-400">
                  Earlier stage = more equity to compensate for risk.
                </p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-accent font-bold">2</span>
                </div>
                <h3 className="font-semibold text-white mb-1">Role & Experience</h3>
                <p className="text-sm text-neutral-400">
                  Board advisors and founders command higher equity.
                </p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-accent font-bold">3</span>
                </div>
                <h3 className="font-semibold text-white mb-1">Time Commitment</h3>
                <p className="text-sm text-neutral-400">
                  More hours per month increases equity share.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-4xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold text-white mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="card-skeuomorphic p-6">
              <h3 className="font-semibold text-white mb-2">What is a FAST Agreement?</h3>
              <p className="text-neutral-400">
                The Founder Advisor Standard Template (FAST) is a widely-used document created by
                the Founder Institute. It typically recommends 0.25% to 1% based on advisor
                involvement.
              </p>
            </div>
            <div className="card-skeuomorphic p-6">
              <h3 className="font-semibold text-white mb-2">Should advisors have vesting?</h3>
              <p className="text-neutral-400">
                Yes. Advisor equity should always vest over time (typically 1-4 years) to ensure
                continued engagement and value delivery.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto px-6 py-12">
          <div className="bg-gradient-to-br from-accent to-accent-hover rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4 text-[#0A0A0B]">
              Need Help Structuring Advisor Agreements?
            </h2>
            <p className="text-lg mb-6 max-w-xl mx-auto text-[#0A0A0B]/80">
              zScale Alpha members get personalized guidance on advisor relationships and
              agreement structures.
            </p>
            <Link
              to="/membership"
              className="inline-block px-8 py-4 bg-[#0A0A0B] text-accent font-semibold rounded-xl hover:bg-[#1a1a1b] transition-colors"
            >
              Join zScale Alpha
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};
