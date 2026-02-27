import { Link } from 'react-router-dom';

const tickerItems = [
  { label: 'Businesses Tracked:', value: '47,312' },
  { label: 'Active Jobs:', value: '52,847' },
  { label: 'Counties:', value: '254' },
  { label: 'Manufacturing Companies:', value: '13,000+' },
  { label: 'State Capital:', value: '$753M' },
  { label: 'Last Update:', value: 'Q4 2025' },
];

export const HomePage = () => {
  return (
    <>
      {/* ==================== HERO ==================== */}
      <section className="relative min-h-screen flex items-center pt-[120px] pb-20 overflow-hidden bg-black">
        {/* Dallas skyline background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{ backgroundImage: "url('/images/dallas-skyline.jpg')", backgroundPosition: 'center 30%' }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/85" />
        </div>

        {/* Teal gradient glow */}
        <div className="absolute top-0 -right-[20%] w-[60%] h-full bg-[radial-gradient(ellipse_at_center,rgba(1,249,198,0.15)_0%,transparent_70%)] pointer-events-none z-[1]" />

        <div className="relative z-[2] max-w-[1200px] mx-auto px-6 max-md:px-4 w-full">
          <div className="max-w-[900px] mx-auto text-center">
            <h1 className="text-[32px] md:text-[42px] lg:text-[52px] font-bold text-white leading-[1.15] tracking-tight mb-5 md:mb-6">
              Market Intelligence Platform for Texas Economic Development
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-[#C8C8C8] leading-relaxed mb-7 md:mb-8 max-w-[650px] mx-auto">
              Track 47,312 businesses, workforce trends, and capital programs across 254 Texas counties. Make data-driven decisions for economic growth.
            </p>

            {/* Data Ticker */}
            <div className="overflow-hidden bg-[rgba(16,185,129,0.1)] py-4 my-8 md:my-10 border-l-4 border-accent rounded-r-lg">
              <div className="flex items-center whitespace-nowrap animate-marquee hover:[animation-play-state:paused]">
                {[...tickerItems, ...tickerItems].map((item, i) => (
                  <span key={i} className="inline-flex items-center">
                    <span className="inline-flex items-center px-4">
                      <span className="text-sm text-[#A0A0A0] mr-2">{item.label}</span>
                      <span className="text-base font-bold text-accent">{item.value}</span>
                    </span>
                    <span className="text-[#707070] mx-2">&bull;</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/demo"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold bg-accent text-black rounded-lg hover:bg-accent-hover hover:-translate-y-0.5 transition-all shadow-glow hover:shadow-glow-teal no-underline"
              >
                Request Demo
              </Link>
              <Link
                to="/preview"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold bg-transparent text-accent border-2 border-accent rounded-lg hover:bg-[rgba(16,185,129,0.1)] hover:-translate-y-0.5 transition-all no-underline"
              >
                See Free Preview
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== STATS BAR ==================== */}
      <section className="py-[60px] bg-black">
        <div className="max-w-[1200px] mx-auto px-6 max-md:px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { number: '47,312', label: 'Businesses Tracked' },
              { number: '254', label: 'Texas Counties' },
              { number: '$753M', label: 'Capital Programs' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-[#111111] border border-[#1A1A1A] rounded-xl p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-glow hover:border-accent"
              >
                <span className="block text-4xl font-bold text-accent mb-2">{stat.number}</span>
                <span className="block text-sm text-[#A0A0A0] uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== WHO IS THIS FOR ==================== */}
      <section className="py-[100px] bg-black" id="audience">
        <div className="max-w-[1200px] mx-auto px-6 max-md:px-4">
          <div className="text-center mb-16">
            <h2 className="text-[28px] md:text-[32px] lg:text-4xl font-bold text-white mb-3 md:mb-4">Who Is This For?</h2>
            <p className="text-base md:text-lg text-[#A0A0A0] max-w-[600px] mx-auto leading-relaxed">
              Purpose-built intelligence for Texas economic development professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"/>
                  </svg>
                ),
                title: 'Economic Development Corporations',
                description: 'Track regional business growth, identify expansion opportunities, and benchmark against peer counties with comprehensive market data.',
              },
              {
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5"/>
                  </svg>
                ),
                title: 'Community Colleges',
                description: 'Align workforce training programs with actual employer needs. See which skills are in demand across your service region.',
              },
              {
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8"/>
                  </svg>
                ),
                title: 'Consultants & Researchers',
                description: 'Access comprehensive Texas business data for economic impact studies, site selection projects, and regional analysis reports.',
              },
            ].map((card) => (
              <div
                key={card.title}
                className="group relative bg-[#111111] border border-[#1A1A1A] rounded-xl py-10 px-8 text-center transition-all duration-300 overflow-hidden hover:-translate-y-1 hover:shadow-glow hover:border-accent"
              >
                <div className="absolute top-0 left-0 w-1 h-0 bg-accent transition-all duration-300 group-hover:h-full" />
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-[rgba(16,185,129,0.1)] rounded-xl text-accent">
                  {card.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{card.title}</h3>
                <p className="text-base text-[#A0A0A0] leading-[1.7]">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== PREVIEW CTA ==================== */}
      <section className="py-20 bg-accent">
        <div className="max-w-[1200px] mx-auto px-6 max-md:px-4">
          <div className="text-center max-w-[600px] mx-auto">
            <h2 className="text-3xl font-bold text-black mb-4">See The Platform in Action</h2>
            <p className="text-lg text-black/70 mb-8">Explore sample data and reports before committing. No credit card required.</p>
            <Link
              to="/preview"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold bg-black text-white rounded-lg hover:bg-[#111111] hover:-translate-y-0.5 transition-all no-underline"
            >
              See Free Preview
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
      <section className="py-[100px] bg-black" id="how-it-works">
        <div className="max-w-[1200px] mx-auto px-6 max-md:px-4">
          <div className="text-center mb-16">
            <h2 className="text-[28px] md:text-[32px] lg:text-4xl font-bold text-white mb-3 md:mb-4">How It Works</h2>
            <p className="text-base md:text-lg text-[#A0A0A0] max-w-[600px] mx-auto leading-relaxed">
              Three simple steps to unlock Texas market intelligence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Select Your Region', desc: 'Choose from 254 Texas counties or define custom geographic boundaries for your analysis.' },
              { step: '2', title: 'Explore The Data', desc: 'Access business listings, workforce trends, capital programs, and competitive intelligence in real-time.' },
              { step: '3', title: 'Export & Act', desc: 'Download reports, share dashboards with stakeholders, and make informed economic development decisions.' },
            ].map((item) => (
              <div key={item.step} className="text-center p-8">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-[rgba(16,185,129,0.1)] border-2 border-accent rounded-full text-2xl font-bold text-accent">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{item.title}</h3>
                <p className="text-base text-[#A0A0A0] leading-[1.7]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== KEY FEATURES ==================== */}
      <section className="py-[100px] bg-black" id="features">
        <div className="max-w-[1200px] mx-auto px-6 max-md:px-4">
          <div className="text-center mb-16">
            <h2 className="text-[28px] md:text-[32px] lg:text-4xl font-bold text-white mb-3 md:mb-4">Key Features</h2>
            <p className="text-base md:text-lg text-[#A0A0A0] max-w-[600px] mx-auto leading-relaxed">
              Everything you need for comprehensive market intelligence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                ),
                title: 'Business Database',
                desc: 'Search 47,312 Texas businesses by industry, size, location, and growth indicators. Updated quarterly.',
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                ),
                title: 'Workforce Analytics',
                desc: 'Track 52,847 active job postings, skills gaps, and labor market trends across your target region.',
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                  </svg>
                ),
                title: 'Capital Programs',
                desc: 'Access $753M in state and federal programs. Match businesses with funding opportunities automatically.',
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
                  </svg>
                ),
                title: 'Competitive Intelligence',
                desc: 'Benchmark your county against peers. Identify competitive advantages and areas for improvement.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group relative bg-[#111111] border border-[#1A1A1A] rounded-xl p-10 transition-all duration-300 overflow-hidden hover:-translate-y-1 hover:shadow-glow hover:border-accent"
              >
                <div className="absolute top-0 left-0 w-1 h-0 bg-accent transition-all duration-300 group-hover:h-full" />
                <div className="flex items-center justify-center w-14 h-14 mb-6 bg-[rgba(16,185,129,0.1)] rounded-xl text-accent">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-base text-[#A0A0A0] leading-[1.7]">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FINAL CTA ==================== */}
      <section className="py-[100px] bg-black" id="demo">
        <div className="max-w-[1200px] mx-auto px-6 max-md:px-4">
          <div className="bg-[#111111] border border-[#1A1A1A] rounded-2xl py-16 px-12 max-md:px-6 text-center max-w-[800px] mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Economic Development Strategy?
            </h2>
            <p className="text-lg text-[#A0A0A0] mb-8 max-w-[500px] mx-auto">
              Join leading Texas EDCs and organizations using zScale for data-driven decision making.
            </p>
            <div className="flex justify-center">
              <Link
                to="/demo"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold bg-accent text-black rounded-lg hover:bg-accent-hover hover:-translate-y-0.5 transition-all shadow-glow hover:shadow-glow-teal no-underline"
              >
                Request Demo
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
