import { Link } from 'react-router-dom';

interface HeroProps {
  onOpenShadowCapital?: () => void;
}

export const Hero = ({ onOpenShadowCapital }: HeroProps) => {
  return (
    <section
      className="min-h-[calc(100vh-100px)] flex flex-col justify-center relative overflow-hidden"
      style={{ backgroundColor: '#0A0A0B' }}
    >
      {/* Terminal Grid Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.03,
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.4) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px'
          }}
        />
        {/* Subtle vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 0%, #0A0A0B 70%)'
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-20 md:py-24 text-center">
        {/* Technical Label */}
        <div className="reveal mb-8 flex justify-center">
          <span
            className="inline-flex items-center gap-3 font-mono text-xs tracking-widest uppercase"
            style={{ color: '#D1D5DB' }}
          >
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: '#01F9C6' }}
            />
            Venture Operating System
          </span>
        </div>

        {/* Main Headline - Centered */}
        <div className="max-w-4xl mx-auto">
          <h1
            className="reveal reveal-delay-1 font-serif text-5xl md:text-6xl lg:text-7xl font-medium mb-8 leading-[1.1] tracking-tight"
            style={{ color: '#FFFFFF' }}
          >
            Built to Bridge the{' '}
            <em className="italic" style={{ color: '#01F9C6' }}>Exit Gap.</em>
          </h1>

          <p
            className="reveal reveal-delay-2 font-sans text-lg md:text-xl max-w-2xl mx-auto mb-14 leading-relaxed"
            style={{ color: '#D1D5DB' }}
          >
            Intelligence and infrastructure to move Dallas founders from bootstrap to institutional-ready.
          </p>

          {/* CTAs - Minimalist High-Status Buttons */}
          <div className="reveal reveal-delay-3 flex flex-col sm:flex-row gap-4 justify-center">
            {/* Solid Teal Button */}
            <button
              onClick={onOpenShadowCapital}
              className="group inline-flex items-center justify-center gap-3 py-4 px-8 font-sans text-sm font-semibold tracking-wide transition-all duration-300 no-underline rounded-full cursor-pointer border-none"
              style={{
                backgroundColor: '#01F9C6',
                color: '#0A0A0B',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#00D9AB';
                e.currentTarget.style.boxShadow = '0 0 24px rgba(1, 249, 198, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#01F9C6';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Access Shadow Capital Map
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>

            {/* Ghost/Outline Button */}
            <Link
              to="/library"
              className="group inline-flex items-center justify-center gap-3 py-4 px-8 bg-transparent font-sans text-sm font-medium tracking-wide transition-all duration-300 no-underline rounded-full"
              style={{
                color: '#D1D5DB',
                border: '1px solid #1F2937'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#01F9C6';
                e.currentTarget.style.color = '#01F9C6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#1F2937';
                e.currentTarget.style.color = '#D1D5DB';
              }}
            >
              Explore the Library
            </Link>
          </div>
        </div>

        {/* Terminal Status Bar */}
        <div className="reveal reveal-delay-4 mt-24 md:mt-32 flex justify-center px-4 md:px-0">
          <div
            className="inline-flex flex-wrap md:flex-nowrap items-center justify-center gap-1 md:gap-2 py-2 px-3 md:py-3 md:px-5 rounded-2xl md:rounded-full"
            style={{
              backgroundColor: '#1F2937',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}
          >
            <span className="flex items-center gap-1">
              <span style={{ color: '#01F9C6' }} className="font-mono text-xs md:text-sm">$</span>
              <span style={{ color: '#D1D5DB' }} className="font-mono text-xs md:text-sm">zscale</span>
              <span style={{ color: '#FFFFFF' }} className="font-mono text-xs md:text-sm">--status</span>
              <span style={{ color: '#01F9C6' }} className="font-mono text-xs md:text-sm">|</span>
            </span>
            <span style={{ color: '#D1D5DB' }} className="font-mono text-xs md:text-sm text-center">45+ investors · 12 sectors · $150M+ mapped</span>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 z-0"
        style={{
          background: 'linear-gradient(to top, #0A0A0B, transparent)'
        }}
      />
    </section>
  );
};
