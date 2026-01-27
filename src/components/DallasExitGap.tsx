import { useState } from 'react';
import { IRIModal } from './IRI';

export const DallasExitGap = () => {
  const [isIRIOpen, setIsIRIOpen] = useState(false);

  const markets = [
    { name: 'Silicon Valley', exits: 847, color: 'bg-neutral-600' },
    { name: 'New York', exits: 412, color: 'bg-neutral-600' },
    { name: 'Boston', exits: 298, color: 'bg-neutral-600' },
    { name: 'Austin', exits: 156, color: 'bg-neutral-600' },
    { name: 'Dallas-Fort Worth', exits: 42, color: 'bg-accent', highlight: true },
  ];

  const maxExits = Math.max(...markets.map((m) => m.exits));

  return (
    <section id="exit-gap" className="py-24 px-6 lg:px-12 bg-ink-light">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="reveal">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full text-sm mb-6">
              <span className="text-accent font-mono text-xs">DATA</span>
              <span className="text-neutral-500">2026 Analysis</span>
            </div>

            <h2 className="text-h2 text-white mb-6">
              The Dallas Exit Gap
            </h2>

            <p className="text-body-lg text-neutral-400 mb-8 leading-relaxed">
              Dallas has the talent, the capital, and the corporate infrastructure. What's missing?
              <span className="text-white font-medium"> Institutional startup operating discipline.</span>
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center mt-0.5">
                  <svg className="w-3 h-3 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="text-white font-medium">$150M+ in local early-stage capital</div>
                  <div className="text-neutral-500 text-sm">Mapped and ready to deploy</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center mt-0.5">
                  <svg className="w-3 h-3 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="text-white font-medium">45+ active tier-1 investors</div>
                  <div className="text-neutral-500 text-sm">Deploying capital in DFW</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center mt-0.5">
                  <svg className="w-3 h-3 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="text-white font-medium">12 global exits tracked</div>
                  <div className="text-neutral-500 text-sm">From DFW-founded companies</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsIRIOpen(true)}
              className="inline-flex items-center gap-2 py-4 px-8 text-button no-underline rounded-full transition-all duration-300 cursor-pointer border-none bg-accent text-ink hover:bg-accent-hover hover:shadow-glow"
            >
              Run IRI Assessment
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
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>

            {/* IRI Modal */}
            <IRIModal isOpen={isIRIOpen} onClose={() => setIsIRIOpen(false)} source="Exit_Gap_IRI" />
          </div>

          {/* Right - Data Visualization */}
          <div className="reveal reveal-delay-2">
            <div className="card-skeuomorphic p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="text-sm text-neutral-500 uppercase tracking-wider mb-1">
                    VC-Backed Exits (2020-2025)
                  </div>
                  <div className="text-2xl font-bold text-white">
                    By Metro Area
                  </div>
                </div>
                <div className="text-xs text-neutral-600 font-mono">
                  SOURCE: PITCHBOOK
                </div>
              </div>

              <div className="space-y-4">
                {markets.map((market, index) => (
                  <div key={market.name} className="reveal" style={{ transitionDelay: `${index * 0.1}s` }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm ${market.highlight ? 'text-accent font-medium' : 'text-neutral-400'}`}>
                        {market.name}
                      </span>
                      <span className={`font-mono text-sm ${market.highlight ? 'text-accent' : 'text-neutral-500'}`}>
                        {market.exits}
                      </span>
                    </div>
                    <div className="h-2 bg-ink-medium rounded-full overflow-hidden">
                      <div
                        className={`h-full ${market.color} rounded-full transition-all duration-1000 ease-out-expo`}
                        style={{ width: `${(market.exits / maxExits) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Gap Indicator */}
              <div className="mt-8 pt-6 border-t border-ink-border">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-accent rounded-full animate-pulse" />
                  <span className="text-sm text-neutral-400">
                    Dallas represents <span className="text-accent font-bold">~5%</span> of Silicon Valley's exit volume
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
