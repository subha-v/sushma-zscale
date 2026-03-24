import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const tickerItems = [
  { label: 'Businesses Tracked:', value: '47,312' },
  { label: 'Active Jobs:', value: '52,847' },
  { label: 'Counties:', value: '254' },
  { label: 'Manufacturing Companies:', value: '13,000+' },
  { label: 'State Capital:', value: '$753M' },
  { label: 'Last Update:', value: 'Q1 2026' },
];

const CHAT_PROGRAMS = [
  { rank: 1, name: 'Nursing BSN', salary: '$73,200' },
  { rank: 2, name: 'Computer Science BS', salary: '$71,500' },
  { rank: 3, name: 'Software Engineering BS', salary: '$70,800' },
  { rank: 4, name: 'Data Science BS', salary: '$69,500' },
  { rank: 5, name: 'Aerospace Engineering BS', salary: '$69,000' },
];

function ChatPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const hasTriggered = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggered.current) {
          hasTriggered.current = true;
          // step 1: user bubble appears
          setTimeout(() => setStep(1), 300);
          // step 2: typing dots
          setTimeout(() => setStep(2), 1200);
          // step 3: response text
          setTimeout(() => setStep(3), 2400);
          // steps 4-8: each data row
          setTimeout(() => setStep(4), 3000);
          setTimeout(() => setStep(5), 3300);
          setTimeout(() => setStep(6), 3600);
          setTimeout(() => setStep(7), 3900);
          setTimeout(() => setStep(8), 4200);
          // step 9: live indicator
          setTimeout(() => setStep(9), 4600);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="bg-[#111111] border border-[#1A1A1A] rounded-2xl p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#1A1A1A]">
        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
          <span className="text-accent text-sm font-bold">Z</span>
        </div>
        <div>
          <p className="text-white text-sm font-medium">zScale Intelligence Agent</p>
          <p className="text-[#707070] text-xs">Powered by Claude + Supabase</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-[#707070] text-xs">Online</span>
        </div>
      </div>

      <div className="space-y-4 min-h-[280px]">
        {/* User question */}
        {step >= 1 && (
          <div className="flex justify-end" style={{ animation: 'slideInRight 0.4s ease-out' }}>
            <div className="bg-accent/10 border border-accent/20 rounded-lg rounded-br-sm px-4 py-2.5 max-w-[85%]">
              <p className="text-sm text-white">What are the highest-paying programs at UTA?</p>
            </div>
          </div>
        )}

        {/* Typing indicator */}
        {step >= 2 && step < 3 && (
          <div className="flex justify-start" style={{ animation: 'fadeIn 0.3s ease-out' }}>
            <div className="bg-[#1A1A1A] rounded-lg rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#555] animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#555] animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#555] animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        {/* AI response */}
        {step >= 3 && (
          <div className="flex justify-start" style={{ animation: 'fadeIn 0.4s ease-out' }}>
            <div className="bg-[#1A1A1A] rounded-lg rounded-bl-sm px-4 py-3 max-w-[92%]">
              {/* Tool activity pill */}
              <div className="flex items-center gap-1.5 mb-2.5 text-xs text-accent/70">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent/60">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                Queried program_outcomes
              </div>
              <p className="text-sm text-[#C0C0C0] leading-relaxed">
                Based on the latest outcome data, the top 5 highest-paying programs at UTA are:
              </p>
              <div className="mt-3 space-y-0">
                {CHAT_PROGRAMS.map((prog) => (
                  <div
                    key={prog.rank}
                    className="flex justify-between text-[#A0A0A0] text-sm py-1.5 border-b border-[#222] last:border-b-0"
                    style={{
                      opacity: step >= 3 + prog.rank ? 1 : 0,
                      transform: step >= 3 + prog.rank ? 'translateY(0)' : 'translateY(8px)',
                      transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
                    }}
                  >
                    <span>{prog.rank}. {prog.name}</span>
                    <span className="text-accent font-mono font-medium">{prog.salary}</span>
                  </div>
                ))}
              </div>
              {step >= 9 && (
                <div className="mt-3 flex items-center gap-1.5" style={{ animation: 'fadeIn 0.4s ease-out' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  <span className="text-xs text-[#707070]">Live data from Supabase</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

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
              Workforce Intelligence That Moves Institutions Forward
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-[#C8C8C8] leading-relaxed mb-7 md:mb-8 max-w-[650px] mx-auto">
              AI-powered labor market analytics for universities, EDCs, and workforce boards. Ask any question — get evidence-based answers in seconds, not weeks.
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

      {/* ==================== TRUST BAR ==================== */}
      <section className="py-5 bg-[#0D0D0D] border-y border-white/[0.06]">
        <div className="max-w-[1200px] mx-auto px-6 max-md:px-4">
          <div className="flex items-center justify-center gap-6 md:gap-10 flex-wrap text-sm text-white/50">
            <span className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span>Built for Texas Universities & EDCs</span>
            </span>
            <span className="text-white/20">|</span>
            <span className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span>SAM.gov Registered</span>
            </span>
            <span className="text-white/20">|</span>
            <span className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span>Women-Owned Small Business</span>
            </span>
            <span className="text-white/20 max-md:hidden">|</span>
            <span className="flex items-center gap-2 max-md:hidden">
              <span className="text-white/40 text-xs font-mono">UEI: DPKYDLDKEFG9</span>
              <span className="text-white/20 mx-1">|</span>
              <span className="text-white/40 text-xs font-mono">CAGE: 1A0X9</span>
            </span>
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
                title: 'Universities & Colleges',
                description: 'Align academic programs with employer demand. Track graduate outcomes, HB8 compliance, and skills gaps across your institution.',
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

      {/* ==================== AI CHAT PREVIEW ==================== */}
      <section className="py-[100px] bg-[#0D0D0D]" id="ai-agent">
        <div className="max-w-[1200px] mx-auto px-6 max-md:px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left: Description */}
            <div>
              <p className="text-sm uppercase tracking-[0.15em] text-accent font-semibold mb-3">
                AI-Powered
              </p>
              <h2 className="text-[28px] md:text-[32px] lg:text-4xl font-bold text-white mb-4 leading-tight">
                Ask Any Workforce Question
              </h2>
              <p className="text-base md:text-lg text-[#A0A0A0] leading-relaxed mb-8">
                Our AI assistant draws from real-time employer demand data, BLS projections, and institutional outcomes to give you specific, actionable answers — not generic reports.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  '"What are the top 5 in-demand skills in DFW healthcare?"',
                  '"Which programs have strongest employer alignment?"',
                  '"Compare our nursing outcomes to regional job openings."',
                  '"Generate a site selection package for an aerospace company."',
                ].map((q) => (
                  <div key={q} className="flex items-start gap-3 bg-[#111111] border border-[#1A1A1A] rounded-lg px-4 py-3">
                    <span className="text-accent mt-0.5 shrink-0">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                      </svg>
                    </span>
                    <span className="text-sm text-[#C0C0C0]">{q}</span>
                  </div>
                ))}
              </div>
              <Link
                to="/demo-login"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold bg-accent text-black rounded-lg hover:bg-accent-hover hover:-translate-y-0.5 transition-all no-underline"
              >
                Try the Live Demo
              </Link>
            </div>

            {/* Right: Animated Chat Visual */}
            <ChatPreview />
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
