import { useState } from 'react';
import { Link } from 'react-router-dom';

interface Benchmark {
  name: string;
  sector: string;
  tooltip: string;
  logo: string;
}

const benchmarks: Benchmark[] = [
  {
    name: 'Island',
    sector: 'Enterprise Security',
    tooltip: 'Unicorn Benchmark: Enterprise Browser Sector',
    logo: 'https://logo.clearbit.com/island.io',
  },
  {
    name: 'LTK',
    sector: 'Consumer Platform',
    tooltip: 'Unicorn Benchmark: Creator Economy & Retail Tech',
    logo: 'https://logo.clearbit.com/ltk.com',
  },
  {
    name: 'StackPath',
    sector: 'Edge Computing',
    tooltip: 'Growth Benchmark: Edge Computing & CDN Infrastructure',
    logo: 'https://logo.clearbit.com/stackpath.com',
  },
  {
    name: 'Match Group',
    sector: 'Consumer Tech',
    tooltip: 'Corporate Scale Benchmark: Consumer Platform & M&A Strategy',
    logo: 'https://logo.clearbit.com/match.com',
  },
  {
    name: 'Alkami',
    sector: 'Fintech',
    tooltip: 'IPO Benchmark: Digital Banking Infrastructure',
    logo: 'https://logo.clearbit.com/alkami.com',
  },
];

export const SuccessBenchmarks = () => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  return (
    <section className="py-20 px-6 lg:px-12 bg-ink border-y border-ink-border">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          {/* Source Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-ink-light border border-ink-border rounded-full text-xs font-medium text-neutral-400 mb-6">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            SOURCE: 2026 NORTH TEXAS ECOSYSTEM MAP
          </div>

          {/* Headline */}
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
            Mapping the North Texas Innovation Landscape
          </h2>

          {/* Sub-headline */}
          <p className="text-neutral-400 max-w-2xl mx-auto text-base leading-relaxed">
            We analyze the growth trajectories of Dallas's unicorns to help you replicate their path to funding.{' '}
            <span className="text-white font-medium">Featured in our 2026 Founder's Manual:</span>
          </p>
        </div>

        {/* Logo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center mb-10">
          {benchmarks.map((benchmark) => (
            <div
              key={benchmark.name}
              className="relative group cursor-pointer"
              onMouseEnter={() => setActiveTooltip(benchmark.name)}
              onMouseLeave={() => setActiveTooltip(null)}
            >
              {/* Logo Container */}
              <div className="w-28 h-16 flex items-center justify-center p-3 rounded-lg transition-all duration-300 hover:bg-ink-light">
                <img
                  src={benchmark.logo}
                  alt={`${benchmark.name} - ${benchmark.sector} benchmark`}
                  className="max-w-full max-h-full object-contain brightness-0 invert opacity-40 transition-all duration-300 group-hover:opacity-70"
                  onError={(e) => {
                    // Fallback to text if logo fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = `<span class="text-lg font-bold text-neutral-500 group-hover:text-neutral-300 transition-colors">${benchmark.name}</span>`;
                  }}
                />
              </div>

              {/* Sector Label */}
              <div className="text-center mt-2">
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium">
                  {benchmark.sector}
                </span>
              </div>

              {/* Tooltip */}
              {activeTooltip === benchmark.name && (
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 z-10 animate-fade-in">
                  <div className="bg-accent text-ink text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
                    {benchmark.tooltip}
                    {/* Arrow */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-accent" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Link */}
        <div className="text-center">
          <Link
            to="/ecosystem-map"
            className="inline-flex items-center gap-2 text-sm text-accent font-medium hover:underline transition-all group"
          >
            Download the case studies in the 2026 Founder's Manual
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Disclaimer - subtle */}
        <p className="text-center text-[10px] text-neutral-600 mt-8 max-w-lg mx-auto">
          These companies are featured as ecosystem benchmarks in our research.
          They are not portfolio companies of zScale Capital.
        </p>
      </div>
    </section>
  );
};
