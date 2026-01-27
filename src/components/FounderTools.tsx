import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IRIModal } from './IRI';
import { DiagnosticModal } from './Diagnostic/DiagnosticModal';

interface ToolCardProps {
  title: string;
  description: string;
  highlight?: string;
  icon: React.ReactNode;
  link: string;
  phase: string;
  phaseNumber: number;
  badge?: string;
  isExternal?: boolean;
  onClick?: () => void;
}

const ToolCard = ({
  title,
  description,
  highlight,
  icon,
  link,
  phase,
  phaseNumber,
  badge,
  isExternal,
  onClick,
}: ToolCardProps) => {
  const CardContent = () => (
    <>
      {/* Phase Badge */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-accent/20">
          <span className="font-mono font-bold text-sm text-accent">{phaseNumber}</span>
        </div>
        <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">
          {phase}
        </span>

        {/* Optional Badge */}
        {badge && (
          <div className="ml-auto flex items-center gap-1.5 px-2 py-1 bg-accent/10 border border-accent/30 rounded-full">
            <span className="text-xs text-accent font-medium">{badge}</span>
          </div>
        )}
      </div>

      {/* Icon */}
      <div className="w-14 h-14 border rounded-xl flex items-center justify-center mb-6 transition-all duration-300 bg-ink-card border-ink-border group-hover:bg-accent group-hover:border-accent">
        <div className="transition-colors text-accent group-hover:text-white">{icon}</div>
      </div>

      {/* Content */}
      <h3 className="text-xl font-semibold mb-2 transition-colors text-white group-hover:text-accent">
        {title}
      </h3>

      {/* Highlight Badge */}
      {highlight && (
        <div className="inline-block px-3 py-1 mb-3 border rounded-full bg-accent/10 border-accent/30">
          <span className="text-xs font-semibold text-accent">{highlight}</span>
        </div>
      )}

      <p className="mb-6 text-sm leading-relaxed text-[#D1D5DB]">{description}</p>

      {/* CTA */}
      <div className="flex items-center font-medium text-sm text-accent">
        <span>Launch Tool</span>
        <svg
          className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
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
      </div>
    </>
  );

  // If onClick is provided, render a button
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="group block p-8 bg-ink-card border border-ink-border rounded-2xl hover:border-accent/50 hover:shadow-glow transition-all duration-300 text-left w-full"
      >
        <CardContent />
      </button>
    );
  }

  if (isExternal) {
    return (
      <a
        href={link}
        className="group block p-8 bg-ink-card border border-ink-border rounded-2xl hover:border-accent/50 hover:shadow-glow transition-all duration-300 no-underline"
      >
        <CardContent />
      </a>
    );
  }

  return (
    <Link
      to={link}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="group block p-8 bg-ink-card border border-ink-border rounded-2xl hover:border-accent/50 hover:shadow-glow transition-all duration-300 no-underline"
    >
      <CardContent />
    </Link>
  );
};

export const FounderTools = () => {
  const [isIRIOpen, setIsIRIOpen] = useState(false);
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);

  // All tools are now freely accessible (Freemium Model)
  const tools = [
    {
      title: 'Investment Readiness Index',
      description:
        'Diagnose your fundraise readiness with our proprietary IRI assessment. Get a venture-grade score and strategic recommendations.',
      highlight: 'Free Assessment',
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      link: '#',
      phase: 'Step 1',
      phaseNumber: 1,
      badge: 'Start Here',
      onClick: () => setIsIRIOpen(true),
    },
    {
      title: 'Advisor Match',
      description:
        'Get matched with Dallas-based industry veterans who specialize in your sector. Find advisors aligned with your stage and goals.',
      highlight: 'Find Your Match',
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      link: '#',
      phase: 'Step 2',
      phaseNumber: 2,
      onClick: () => setIsDiagnosticOpen(true),
    },
    {
      title: 'Valuation Tool',
      description:
        "Understand your startup's worth with Dallas-sector valuation multiples. Essential before any investor conversation.",
      highlight: 'Know Your Worth',
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      link: '/tools/valuation',
      phase: 'Step 3',
      phaseNumber: 3,
    },
    {
      title: 'Equity Evaluator',
      description:
        'Optimize your cap table with market-rate advisor compensation. Avoid the "messy cap table" that kills deals.',
      highlight: 'Fair Equity Splits',
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
          />
        </svg>
      ),
      link: '/tools/equity-calculator',
      phase: 'Step 4',
      phaseNumber: 4,
    },
  ];

  return (
    <section id="tools" className="py-24 px-6 lg:px-12 bg-ink">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 reveal">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full text-sm mb-6">
            <span className="text-accent font-mono text-xs">FREE_TOOLS</span>
            <span className="text-neutral-500">for Founders</span>
          </div>
          <h2 className="text-h2 text-white mb-4">Your Founder Command Center</h2>
          <p className="text-body-lg text-[#D1D5DB] max-w-2xl mx-auto">
            Four essential tools to navigate your startup journey.
            <span className="text-accent font-medium"> All free to use.</span>
          </p>
        </div>

        {/* Value Chain Visualization */}
        <div className="hidden lg:flex items-center justify-center gap-4 mb-12 reveal">
          {['IRI', 'Advisor', 'Valuation', 'Equity'].map((step, index, arr) => (
            <div key={step} className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/50 rounded-lg">
                <span className="w-3 h-3 rounded-full bg-accent" />
                <span className="text-sm text-accent">{step}</span>
              </div>
              {index < arr.length - 1 && (
                <svg
                  className="w-8 h-8 text-accent/50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              )}
            </div>
          ))}
        </div>

        {/* Tool Cards Grid - 2x2 layout */}
        <div className="grid md:grid-cols-2 gap-6 reveal">
          {tools.map((tool) => (
            <ToolCard key={tool.title} {...tool} />
          ))}
        </div>

        {/* IRI Modal */}
        <IRIModal isOpen={isIRIOpen} onClose={() => setIsIRIOpen(false)} />

        {/* Diagnostic Modal (Advisor Match) */}
        <DiagnosticModal isOpen={isDiagnosticOpen} onClose={() => setIsDiagnosticOpen(false)} />

        {/* Alpha Membership CTA */}
        <div className="mt-12 text-center reveal">
          <div className="inline-block p-6 bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20 rounded-2xl">
            <p className="text-neutral-400 mb-3">
              Want personalized insights & investor introductions?
            </p>
            <Link
              to="/membership"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#01F9C6] text-[#0A0A0B] font-semibold rounded-xl hover:brightness-110 transition-all no-underline"
            >
              <span>Join zScale Alpha</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* Additional Resources Link */}
        <div className="text-center mt-8 reveal">
          <Link
            to="/tools/investor-tier-list"
            className="inline-flex items-center gap-2 text-neutral-400 hover:text-accent transition-colors no-underline"
          >
            <span>Explore Dallas Investor Network</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};
