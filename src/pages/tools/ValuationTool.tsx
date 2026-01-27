import { useState, useMemo, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { DonutChart } from '../../components/tools/shared/DonutChart';
import { AlphaUpgradeCard, AlphaUpgradeBanner } from '../../components/tools/shared/AlphaUpgradeCard';
import { GOOGLE_SCRIPT_URL, FORM_TYPES, getUserProgress } from '../../config/api';

type CompanyStage = 'idea' | 'mvp' | 'early_revenue' | 'growth' | 'scale';
type Sector = 'saas' | 'fintech' | 'healthcare' | 'aerospace' | 'manufacturing' | 'energy' | 'consumer';

interface ValuationRange {
  low: number;
  mid: number;
  high: number;
  multiple: string;
}

// Dallas-specific valuation benchmarks by stage and sector
const VALUATION_DATA: Record<CompanyStage, Record<Sector, ValuationRange>> = {
  idea: {
    saas: { low: 250000, mid: 500000, high: 1000000, multiple: '10-20x future ARR' },
    fintech: { low: 300000, mid: 600000, high: 1200000, multiple: '8-15x future ARR' },
    healthcare: { low: 400000, mid: 750000, high: 1500000, multiple: 'N/A - milestone based' },
    aerospace: { low: 500000, mid: 1000000, high: 2000000, multiple: 'Contract-based' },
    manufacturing: { low: 200000, mid: 400000, high: 800000, multiple: '3-6x EBITDA potential' },
    energy: { low: 350000, mid: 700000, high: 1400000, multiple: 'Asset-based' },
    consumer: { low: 150000, mid: 350000, high: 700000, multiple: '2-4x revenue potential' },
  },
  mvp: {
    saas: { low: 750000, mid: 1500000, high: 3000000, multiple: '8-15x ARR' },
    fintech: { low: 1000000, mid: 2000000, high: 4000000, multiple: '6-12x ARR' },
    healthcare: { low: 1200000, mid: 2500000, high: 5000000, multiple: '10-20x ARR' },
    aerospace: { low: 1500000, mid: 3000000, high: 6000000, multiple: '2-4x contract value' },
    manufacturing: { low: 600000, mid: 1200000, high: 2400000, multiple: '4-8x EBITDA' },
    energy: { low: 1000000, mid: 2000000, high: 4000000, multiple: '1.5-3x assets' },
    consumer: { low: 500000, mid: 1000000, high: 2000000, multiple: '2-5x revenue' },
  },
  early_revenue: {
    saas: { low: 2000000, mid: 4000000, high: 8000000, multiple: '6-12x ARR' },
    fintech: { low: 3000000, mid: 6000000, high: 12000000, multiple: '5-10x ARR' },
    healthcare: { low: 4000000, mid: 8000000, high: 16000000, multiple: '8-15x ARR' },
    aerospace: { low: 5000000, mid: 10000000, high: 20000000, multiple: '2-3x backlog' },
    manufacturing: { low: 2000000, mid: 4000000, high: 8000000, multiple: '5-10x EBITDA' },
    energy: { low: 3000000, mid: 6000000, high: 12000000, multiple: '2-4x assets' },
    consumer: { low: 1500000, mid: 3000000, high: 6000000, multiple: '3-6x revenue' },
  },
  growth: {
    saas: { low: 8000000, mid: 15000000, high: 30000000, multiple: '8-15x ARR' },
    fintech: { low: 10000000, mid: 20000000, high: 40000000, multiple: '6-12x ARR' },
    healthcare: { low: 15000000, mid: 30000000, high: 60000000, multiple: '10-18x ARR' },
    aerospace: { low: 20000000, mid: 40000000, high: 80000000, multiple: '2.5-4x backlog' },
    manufacturing: { low: 8000000, mid: 16000000, high: 32000000, multiple: '6-12x EBITDA' },
    energy: { low: 12000000, mid: 24000000, high: 48000000, multiple: '3-5x assets' },
    consumer: { low: 6000000, mid: 12000000, high: 24000000, multiple: '4-8x revenue' },
  },
  scale: {
    saas: { low: 30000000, mid: 60000000, high: 120000000, multiple: '10-20x ARR' },
    fintech: { low: 40000000, mid: 80000000, high: 160000000, multiple: '8-15x ARR' },
    healthcare: { low: 50000000, mid: 100000000, high: 200000000, multiple: '12-25x ARR' },
    aerospace: { low: 80000000, mid: 160000000, high: 320000000, multiple: '3-5x backlog' },
    manufacturing: { low: 30000000, mid: 60000000, high: 120000000, multiple: '8-15x EBITDA' },
    energy: { low: 50000000, mid: 100000000, high: 200000000, multiple: '4-6x assets' },
    consumer: { low: 25000000, mid: 50000000, high: 100000000, multiple: '5-10x revenue' },
  },
};

const stageLabels: Record<CompanyStage, string> = {
  idea: 'Idea Stage',
  mvp: 'MVP / Pre-Revenue',
  early_revenue: 'Early Revenue ($0-$500K ARR)',
  growth: 'Growth ($500K-$2M ARR)',
  scale: 'Scale ($2M+ ARR)',
};

const sectorLabels: Record<Sector, string> = {
  saas: 'SaaS / Software',
  fintech: 'FinTech',
  healthcare: 'Healthcare / MedTech',
  aerospace: 'Aerospace & Defense',
  manufacturing: 'Manufacturing / Industrial',
  energy: 'Energy / CleanTech',
  consumer: 'Consumer / E-Commerce',
};

const formatCurrency = (value: number): string => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  return `$${(value / 1000).toFixed(0)}K`;
};

export const ValuationTool = () => {
  const [stage, setStage] = useState<CompanyStage>('mvp');
  const [sector, setSector] = useState<Sector>('saas');
  const [monthlyRevenue, setMonthlyRevenue] = useState<string>('');
  const [hasCalculated, setHasCalculated] = useState(false);
  const hasSubmittedRef = useRef(false);

  // Get user progress from IRI
  const userProgress = useMemo(() => getUserProgress(), []);

  // Get valuation data
  const valuationData = useMemo(() => {
    return VALUATION_DATA[stage][sector];
  }, [stage, sector]);

  // Calculate custom valuation if revenue provided
  const customValuation = useMemo(() => {
    const revenue = parseFloat(monthlyRevenue) || 0;
    if (revenue === 0) return null;

    const annualRevenue = revenue * 12;
    const multiplier = sector === 'saas' || sector === 'fintech' || sector === 'healthcare'
      ? { low: 6, mid: 10, high: 15 }
      : { low: 3, mid: 5, high: 8 };

    return {
      low: annualRevenue * multiplier.low,
      mid: annualRevenue * multiplier.mid,
      high: annualRevenue * multiplier.high,
    };
  }, [monthlyRevenue, sector]);

  // Submit to backend
  const handleCalculate = () => {
    setHasCalculated(true);

    if (!hasSubmittedRef.current) {
      hasSubmittedRef.current = true;

      const payload = {
        formType: FORM_TYPES.VALUATION_TOOL,
        email: userProgress.email || localStorage.getItem('lead_email') || '',
        firstName: userProgress.firstName || localStorage.getItem('lead_name')?.split(' ')[0] || '',
        lastName: userProgress.lastName || localStorage.getItem('lead_name')?.split(' ').slice(1).join(' ') || '',
        companyName: userProgress.company || '',
        iriScore: userProgress.iriScore || '',
        companyStage: stage,
        sector: sector,
        monthlyRevenue: monthlyRevenue || 'Not provided',
        valuationLow: customValuation?.low || valuationData.low,
        valuationMid: customValuation?.mid || valuationData.mid,
        valuationHigh: customValuation?.high || valuationData.high,
        source: 'valuation-tool',
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

  // Prepare donut chart data
  const displayValuation = customValuation || valuationData;
  const donutSegments = [
    { value: 70, color: '#01F9C6', label: 'Base Valuation' },
    { value: 30, color: '#1C1C1E', label: 'Growth Premium' },
  ];

  return (
    <>
      <Helmet>
        <title>Startup Valuation Tool | Dallas Sector Benchmarks | zScale Capital</title>
        <meta
          name="description"
          content="Calculate your startup's valuation using Dallas-specific sector benchmarks. Get data-driven insights for investor conversations."
        />
        <link rel="canonical" href="https://zscalecapital.com/tools/valuation" />
      </Helmet>

      <div className="min-h-screen bg-ink pt-20">
        {/* Header Section */}
        <section className="bg-ink-light border-b border-ink-border">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center gap-2 text-sm text-neutral-500 mb-4">
              <Link to="/" className="hover:text-accent transition-colors text-neutral-400">
                Home
              </Link>
              <span className="text-neutral-600">/</span>
              <span className="text-accent font-medium">Valuation Tool</span>
            </div>

            <article>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl lg:text-4xl font-bold text-white">
                  Startup Valuation Tool
                </h1>
                <span className="px-3 py-1 bg-accent/10 border border-accent/30 rounded-full text-xs text-accent font-medium">
                  Free Tool
                </span>
              </div>
              <p className="text-lg text-neutral-400">
                Understand your startup's worth with Dallas-sector valuation multiples. Essential before any investor conversation.
              </p>
            </article>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="max-w-7xl mx-auto px-6 py-8">
          {/* Input Form */}
          <div className="card-skeuomorphic p-6 mb-8">
            <h2 className="text-lg font-semibold text-white mb-6">Company Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm text-neutral-400 mb-2">Company Stage</label>
                <select
                  value={stage}
                  onChange={(e) => setStage(e.target.value as CompanyStage)}
                  className="w-full py-3 px-4 border border-ink-border rounded-xl bg-ink-medium text-white focus:outline-none focus:border-accent"
                >
                  {Object.entries(stageLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-neutral-400 mb-2">Industry Sector</label>
                <select
                  value={sector}
                  onChange={(e) => setSector(e.target.value as Sector)}
                  className="w-full py-3 px-4 border border-ink-border rounded-xl bg-ink-medium text-white focus:outline-none focus:border-accent"
                >
                  {Object.entries(sectorLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-neutral-400 mb-2">Monthly Revenue (Optional)</label>
                <input
                  type="number"
                  value={monthlyRevenue}
                  onChange={(e) => setMonthlyRevenue(e.target.value)}
                  placeholder="e.g., 25000"
                  className="w-full py-3 px-4 border border-ink-border rounded-xl bg-ink-medium text-white placeholder:text-neutral-500 focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            {/* Calculate Button */}
            <div className="mt-6 text-center">
              <button
                onClick={handleCalculate}
                className="px-8 py-4 bg-[#01F9C6] text-[#0A0A0B] font-semibold rounded-xl hover:brightness-110 transition-all duration-200 shadow-[0_0_20px_rgba(1,249,198,0.3)]"
              >
                Calculate Valuation
              </button>
            </div>
          </div>

          {/* Results Section */}
          {hasCalculated && (
            <>
              {/* Basic Results - Always Visible */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Main Valuation Result */}
                <div className="card-skeuomorphic p-6 text-center">
                  <h3 className="text-lg font-semibold text-white mb-4">Estimated Valuation</h3>
                  <DonutChart
                    segments={donutSegments}
                    size={160}
                    strokeWidth={20}
                    centerValue={formatCurrency(displayValuation.mid)}
                    centerLabel="Mid-Range"
                  />
                  <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-ink-medium rounded-full">
                    <span className="text-sm text-neutral-500">Range:</span>
                    <span className="font-semibold text-accent">
                      {formatCurrency(displayValuation.low)} - {formatCurrency(displayValuation.high)}
                    </span>
                  </div>

                  <AlphaUpgradeBanner />
                </div>

                {/* Sector Benchmark */}
                <div className="card-skeuomorphic p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Sector Benchmark</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-accent/10 rounded-xl border border-accent/20">
                      <p className="text-sm text-neutral-500">Typical Multiple</p>
                      <p className="text-2xl font-bold text-accent">{valuationData.multiple}</p>
                    </div>
                    <div className="p-4 bg-ink-medium rounded-xl">
                      <p className="text-sm text-neutral-500">Stage</p>
                      <p className="text-xl font-semibold text-white">{stageLabels[stage]}</p>
                    </div>
                    <div className="p-4 bg-ink-medium rounded-xl">
                      <p className="text-sm text-neutral-500">Sector</p>
                      <p className="text-xl font-semibold text-white">{sectorLabels[sector]}</p>
                    </div>
                  </div>
                </div>

                {/* Dallas Context */}
                <div className="card-skeuomorphic p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Dallas Market Context</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-ink-medium rounded-xl">
                      <p className="text-sm text-neutral-500">Local Deals (2024-2025)</p>
                      <p className="text-xl font-semibold text-white">127 Seed Rounds</p>
                    </div>
                    <div className="p-4 bg-ink-medium rounded-xl">
                      <p className="text-sm text-neutral-500">Median Seed Size</p>
                      <p className="text-xl font-semibold text-white">$2.1M</p>
                    </div>
                    <p className="text-sm text-neutral-500">
                      Dallas valuations typically run 15-25% below Bay Area for comparable companies at seed stage.
                    </p>
                  </div>
                </div>
              </div>

              {/* Strategic Gate - Multiple Analysis & Investor Alignment */}
              <AlphaUpgradeCard
                title="Multiple Analysis & Investor Alignment Locked"
                description="Unlock detailed valuation breakdown and investor-specific insights for your sector."
              >
                {/* Alpha Content - Only shown to Alpha members */}
                <div className="card-skeuomorphic p-8 mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
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
                    {/* Multiple Analysis */}
                    <div className="p-4 bg-ink-medium rounded-xl border border-accent/20">
                      <h4 className="font-semibold text-accent mb-2">Multiple Analysis</h4>
                      <p className="text-sm text-neutral-400 mb-3">
                        Your {sectorLabels[sector]} company at {stageLabels[stage]} typically commands {valuationData.multiple}.
                      </p>
                      <ul className="text-sm text-neutral-400 space-y-1">
                        <li>• Revenue multiple: Based on trailing 12-month ARR</li>
                        <li>• Growth adjustment: +20% for 100%+ YoY growth</li>
                        <li>• Dallas discount: -15% vs coastal markets</li>
                      </ul>
                    </div>

                    {/* Investor Alignment */}
                    <div className="p-4 bg-ink-medium rounded-xl border border-accent/20">
                      <h4 className="font-semibold text-accent mb-2">Investor Alignment</h4>
                      <p className="text-sm text-neutral-400 mb-3">
                        Dallas investors aligned with your valuation range:
                      </p>
                      <ul className="text-sm text-neutral-400 space-y-1">
                        <li>• 12 active seed funds targeting {sectorLabels[sector]}</li>
                        <li>• Average check size: $500K-$1.5M</li>
                        <li>• Typical ownership target: 10-15%</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-ink-medium rounded-xl">
                      <h4 className="font-semibold text-white mb-2">Negotiation Positioning</h4>
                      <p className="text-sm text-neutral-400">
                        Start conversations at {formatCurrency(displayValuation.high)} and be prepared to settle at {formatCurrency(displayValuation.mid)} with strong terms.
                      </p>
                    </div>

                    <div className="p-4 bg-ink-medium rounded-xl">
                      <h4 className="font-semibold text-white mb-2">Comparable Deals</h4>
                      <p className="text-sm text-neutral-400">
                        3 recent Dallas {sectorLabels[sector]} deals closed at similar valuations. Alpha members get access to the full deal database.
                      </p>
                    </div>
                  </div>
                </div>
              </AlphaUpgradeCard>
            </>
          )}
        </section>

        {/* How It Works */}
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
                  Earlier stage = higher risk premium, lower absolute valuation.
                </p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-accent font-bold">2</span>
                </div>
                <h3 className="font-semibold text-white mb-1">Sector Multiple</h3>
                <p className="text-sm text-neutral-400">
                  SaaS commands highest multiples; manufacturing uses EBITDA-based metrics.
                </p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-accent font-bold">3</span>
                </div>
                <h3 className="font-semibold text-white mb-1">Dallas Context</h3>
                <p className="text-sm text-neutral-400">
                  Local market dynamics adjust coastal benchmarks to regional reality.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto px-6 py-12">
          <div className="bg-gradient-to-br from-accent to-accent-hover rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4 text-[#0A0A0B]">
              Need Help With Investor Conversations?
            </h2>
            <p className="text-lg mb-6 max-w-xl mx-auto text-[#0A0A0B]/80">
              zScale Alpha members get personalized valuation coaching and direct investor introductions.
            </p>
            <Link
              to="/membership"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
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
