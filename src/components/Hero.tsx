import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShadowCapitalModal } from './ShadowCapitalModal';

export const Hero = () => {
  const [isShadowCapitalOpen, setIsShadowCapitalOpen] = useState(false);

  return (
    <section className="min-h-screen flex flex-col justify-center px-6 pt-32 pb-24 relative overflow-hidden lg:px-12 max-md:pt-24 max-md:pb-16 bg-ink">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/95 to-ink" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Status Badge */}
        <div className="reveal flex justify-center mb-12">
          <Link
            to="/ecosystem-map"
            className="inline-flex items-center gap-3 py-2 px-5 bg-accent/10 border border-accent/20 rounded-full text-sm font-medium text-accent hover:bg-accent/20 transition-colors no-underline"
          >
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse-dot" />
            <span className="text-accent font-mono text-xs">LIVE</span>
            <span className="text-[#D1D5DB]">2026 Dallas Venture Map Available</span>
          </Link>
        </div>

        {/* Main Headline - Centered */}
        <div className="text-center max-w-5xl mx-auto">
          <h1 className="reveal reveal-delay-1 text-h1 text-white mb-8 max-md:text-4xl max-md:leading-tight">
            Dallas Grit.<br />
            <span className="text-gradient">Institutional Standards.</span>
          </h1>

          <p className="reveal reveal-delay-2 text-body-lg text-[#D1D5DB] max-w-3xl mx-auto mb-12 leading-relaxed">
            The Venture Operating System for North Texas. We bridge the Exit Gap by moving
            Dallas founders from <span className="text-white font-medium">Bootstrap Mindset</span> to{' '}
            <span className="text-accent font-medium">Institutional-Ready</span>.
          </p>

          {/* CTAs */}
          <div className="reveal reveal-delay-3 flex gap-4 flex-wrap justify-center mb-16">
            <button
              onClick={() => setIsShadowCapitalOpen(true)}
              className="group inline-flex items-center gap-3 py-4 px-8 text-button no-underline rounded-full transition-all duration-300 cursor-pointer border-none bg-accent text-ink hover:bg-accent-hover hover:shadow-glow"
            >
              Access Shadow Capital Map
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-5 h-5 transition-transform group-hover:translate-x-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
            <Link
              to="/library"
              className="inline-flex items-center gap-3 py-4 px-8 text-button no-underline rounded-full transition-all duration-300 cursor-pointer bg-transparent text-white border border-ink-border hover:border-accent hover:text-accent"
            >
              Explore the Library
            </Link>
          </div>

          {/* Terminal-Style Data Display */}
          <div className="reveal reveal-delay-4 inline-flex items-center gap-2 py-3 px-6 bg-ink-card border border-ink-border rounded-full">
            <span className="text-accent font-mono text-sm">$</span>
            <span className="text-neutral-500 font-mono text-sm">zscale</span>
            <span className="text-white font-mono text-sm">--status</span>
            <span className="text-accent font-mono text-sm animate-pulse">|</span>
            <span className="text-[#D1D5DB] font-mono text-xs ml-2">
              45+ investors · 12 sectors · $150M+ mapped
            </span>
          </div>
        </div>
      </div>

      {/* Gradient Fade to Next Section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-ink-light to-transparent z-0" />

      {/* Shadow Capital Modal */}
      <ShadowCapitalModal
        isOpen={isShadowCapitalOpen}
        onClose={() => setIsShadowCapitalOpen(false)}
        leadSource="Hero_Button"
      />
    </section>
  );
};
