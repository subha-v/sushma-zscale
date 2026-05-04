import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getLatestIssues } from '../data/intelligence-issues';
import IntelligenceSubscribeForm from '../components/intelligence/IntelligenceSubscribeForm';
import { getFeaturedEntries } from '../lib/tracker-queries';
import type { TrackerEntry } from '../lib/tracker-types';
import TrackerCard from '../components/tracker/TrackerCard';

const tickerItems = [
  { label: 'Pipelines Tracked:', value: '1,200+' },
  { label: 'Active Jobs:', value: '52,847' },
  { label: 'Counties:', value: '254' },
  { label: 'Programs Scored:', value: '180+' },
  { label: 'Regions:', value: '4 Texas MSAs' },
  { label: 'Last Update:', value: 'Q2 2026' },
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
          setTimeout(() => setStep(1), 300);
          setTimeout(() => setStep(2), 1200);
          setTimeout(() => setStep(3), 2400);
          setTimeout(() => setStep(4), 3000);
          setTimeout(() => setStep(5), 3300);
          setTimeout(() => setStep(6), 3600);
          setTimeout(() => setStep(7), 3900);
          setTimeout(() => setStep(8), 4200);
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
        {step >= 1 && (
          <div className="flex justify-end" style={{ animation: 'slideInRight 0.4s ease-out' }}>
            <div className="bg-accent/10 border border-accent/20 rounded-lg rounded-br-sm px-4 py-2.5 max-w-[85%]">
              <p className="text-sm text-white">What are the highest-paying programs at UTA?</p>
            </div>
          </div>
        )}

        {step >= 2 && step < 3 && (
          <div className="flex justify-start" style={{ animation: 'fadeIn 0.3s ease-out' }}>
            <div className="bg-[#1A1A1A] rounded-lg rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#555] animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#555] animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#555] animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        {step >= 3 && (
          <div className="flex justify-start" style={{ animation: 'fadeIn 0.4s ease-out' }}>
            <div className="bg-[#1A1A1A] rounded-lg rounded-bl-sm px-4 py-3 max-w-[92%]">
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
  const [featuredTrackerEntries, setFeaturedTrackerEntries] = useState<TrackerEntry[]>([]);

  useEffect(() => {
    getFeaturedEntries(3).then(setFeaturedTrackerEntries);
  }, []);

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'zScale',
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web',
          description: 'Economic intelligence layer for regions building the AI economy. Real-time data on businesses, jobs, capital flows and talent pipelines for universities, EDCs, employers and workforce boards.',
          url: 'https://zscalecapital.com',
          image: 'https://zscalecapital.com/images/zscale-social-card.png',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
            description: 'Request a demo',
          },
          publisher: {
            '@type': 'Organization',
            name: 'zScale',
            url: 'https://zscalecapital.com',
            logo: 'https://zscalecapital.com/images/zscale-logo.png',
          },
        })}</script>
      </Helmet>

      {/* ==================== HERO ==================== */}
      <section className="relative min-h-screen flex items-center pt-[120px] pb-20 overflow-hidden bg-black">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{ backgroundImage: "url('/images/dallas-skyline.jpg')", backgroundPosition: 'center 30%' }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/85" />
        </div>

        <div className="absolute top-0 -right-[20%] w-[60%] h-full bg-[radial-gradient(ellipse_at_center,rgba(1,249,198,0.15)_0%,transparent_70%)] pointer-events-none z-[1]" />

        <div className="relative z-[2] max-w-[1200px] mx-auto px-6 max-md:px-4 w-full">
          <div className="max-w-[900px] mx-auto text-center">
            <h1 className="text-[32px] md:text-[42px] lg:text-[52px] font-bold text-white leading-[1.15] tracking-tight mb-5 md:mb-6">
              The economic intelligence layer for regions building the AI economy
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-[#C8C8C8] leading-relaxed mb-7 md:mb-8 max-w-[700px] mx-auto">
              Real-time data on businesses, jobs, capital flows and talent pipelines, connected into one source of truth. Universities, EDCs, employers and workforce boards run on the same numbers. Ask any question, get evidence-based answers in seconds not weeks.
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
                Request a demo
              </Link>
              <Link
                to="/preview"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold bg-transparent text-accent border-2 border-accent rounded-lg hover:bg-[rgba(16,185,129,0.1)] hover:-translate-y-0.5 transition-all no-underline"
              >
                Explore the live platform
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== TRUST STRIP ==================== */}
      <section className="py-5 bg-[#0D0D0D] border-y border-white/[0.06]">
        <div className="max-w-[1200px] mx-auto px-6 max-md:px-4">
          <div className="flex items-center justify-center gap-6 md:gap-10 flex-wrap text-sm text-white/50">
            <span className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span>SAM.gov registered</span>
            </span>
            <span className="text-white/20">|</span>
            <span className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span>Serves 4 Texas regions</span>
            </span>
            <span className="text-white/20">|</span>
            <span className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span>Updated weekly</span>
            </span>
          </div>
        </div>
      </section>

      {/* ==================== WHO USES THIS ==================== */}
      <section className="py-[100px] bg-black" id="audience">
        <div className="max-w-[1200px] mx-auto px-6 max-md:px-4">
          <div className="text-center mb-16">
            <h2 className="text-[28px] md:text-[32px] lg:text-4xl font-bold text-white mb-3 md:mb-4">Who uses this</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Universities and colleges',
                description: 'See which employers absorb your graduates and which programs produce surplus talent the market has already priced in.',
              },
              {
                title: 'Economic development corporations',
                description: 'Track corporate expansions, site selection signals and talent availability before your competitors publish a press release.',
              },
              {
                title: 'Workforce boards',
                description: 'Align training programs with verified employer demand. Stop funding credentials nobody is hiring for.',
              },
              {
                title: 'Site selection consultants',
                description: 'Access talent density maps, wage benchmarks and institutional partnerships for any Texas MSA in one query.',
              },
            ].map((card) => (
              <div
                key={card.title}
                className="group relative bg-[#111111] border border-[#1A1A1A] rounded-xl py-8 px-6 transition-all duration-300 overflow-hidden hover:-translate-y-1 hover:shadow-glow hover:border-accent"
              >
                <div className="absolute top-0 left-0 w-1 h-0 bg-accent transition-all duration-300 group-hover:h-full" />
                <h3 className="text-lg font-semibold text-white mb-3">{card.title}</h3>
                <p className="text-sm text-[#A0A0A0] leading-[1.7]">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== WHAT THE PLATFORM DOES ==================== */}
      <section className="py-[100px] bg-[#0D0D0D]">
        <div className="max-w-[1200px] mx-auto px-6 max-md:px-4">
          <div className="text-center mb-16">
            <h2 className="text-[28px] md:text-[32px] lg:text-4xl font-bold text-white mb-3 md:mb-4">What the platform does</h2>
          </div>

          {/* Row 1: Text left, visual right */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h3 className="text-2xl md:text-[28px] font-bold text-white mb-4 leading-tight">
                Talent pipeline tracking
              </h3>
              <p className="text-base md:text-lg text-[#A0A0A0] leading-relaxed">
                Every week we ingest public filings, university disclosures, press releases and job postings to map who is training talent, who is hiring it and where the mismatches are.
              </p>
            </div>
            <div className="bg-[#111111] border border-[#1A1A1A] rounded-2xl p-6 md:p-8">
              <div className="space-y-3">
                {[
                  { label: 'University disclosures', icon: 'M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5' },
                  { label: 'Job postings ingested', icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8' },
                  { label: 'Employer expansions', icon: 'M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11' },
                  { label: 'Skills gap analysis', icon: 'M18 20V10M12 20V4M6 20v-6' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3 bg-[#0A0A0A] border border-[#1E1E1E] rounded-lg px-4 py-3">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent shrink-0">
                      <path d={item.icon} />
                    </svg>
                    <span className="text-sm text-[#C0C0C0]">{item.label}</span>
                    <span className="ml-auto w-2 h-2 rounded-full bg-accent/40 animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 2: Visual left, text right */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="md:order-2">
              <h3 className="text-2xl md:text-[28px] font-bold text-white mb-4 leading-tight">
                AI question layer
              </h3>
              <p className="text-base md:text-lg text-[#A0A0A0] leading-relaxed mb-6">
                Ask a plain-English question about any Texas program, employer or region. The agent queries live data and returns a sourced answer in seconds, not weeks.
              </p>
              <Link
                to="/demo-login"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold bg-accent text-black rounded-lg hover:bg-accent-hover hover:-translate-y-0.5 transition-all no-underline"
              >
                Try the live demo
              </Link>
            </div>
            <div className="md:order-1">
              <ChatPreview />
            </div>
          </div>
        </div>
      </section>

      {/* ==================== TEXAS TALENT PIPELINE TRACKER ==================== */}
      {featuredTrackerEntries.length > 0 && (
        <section className="py-[100px] bg-black">
          <div className="max-w-[1200px] mx-auto px-6 max-md:px-4">
            <div className="text-center mb-12">
              <p className="text-xs uppercase tracking-[0.2em] text-accent font-semibold mb-3">
                Texas Talent Pipeline Tracker
              </p>
              <h2 className="text-[28px] md:text-[32px] lg:text-4xl font-bold text-white mb-3 md:mb-4">
                Texas talent pipelines, mapped continuously
              </h2>
              <p className="text-base md:text-lg text-[#A0A0A0] max-w-[600px] mx-auto leading-relaxed">
                How talent flows from universities to employers. Expansions, programs, site selection signals and editorial analysis.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {featuredTrackerEntries.map(entry => (
                <TrackerCard key={entry.id} entry={entry} compact />
              ))}
            </div>

            <div className="text-center">
              <Link
                to="/tracker"
                className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent-hover transition-colors no-underline"
              >
                Explore the full tracker
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ==================== PUBLISHED RESEARCH ==================== */}
      <section className="py-[100px] bg-[#0D0D0D]">
        <div className="max-w-[1100px] mx-auto px-6 max-md:px-4">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.2em] text-accent font-semibold mb-3">
              PUBLISHED RESEARCH
            </p>
            <h2 className="text-[28px] md:text-[32px] lg:text-4xl font-bold text-white mb-3">
              Workforce Intelligence Brief
            </h2>
            <p className="text-base md:text-lg text-[#A0A0A0] max-w-[600px] mx-auto leading-relaxed">
              Bi-weekly data-driven analysis on workforce, higher ed and economic development
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {getLatestIssues(2).map((issue) => (
              <Link
                key={issue.slug}
                to={`/intelligence/${issue.slug}`}
                className="group block bg-[#111111] border border-[#1A1A1A] rounded-2xl p-6 hover:shadow-glow-teal hover:border-accent transition-all duration-300 no-underline"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-accent text-xs font-semibold">
                    Issue #{issue.issueNumber}
                  </span>
                  <span className="text-[#707070] text-xs">
                    {new Date(issue.publishedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white leading-snug mb-2 group-hover:text-accent transition-colors">
                  {issue.title}
                </h3>
                <p className="text-sm text-[#A0A0A0] leading-relaxed mb-3 line-clamp-2">
                  {issue.summary}
                </p>
                <span className="text-accent text-sm font-medium">
                  {issue.readTimeMinutes} min read <span className="group-hover:translate-x-1 inline-block transition-transform">&rarr;</span>
                </span>
              </Link>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              to="/intelligence"
              className="text-accent hover:underline text-sm font-medium no-underline"
            >
              View the archive &rarr;
            </Link>
            <IntelligenceSubscribeForm variant="inline-small" source="homepage_footer" />
          </div>
        </div>
      </section>

      {/* ==================== FINAL CTA ==================== */}
      <section className="py-[100px] bg-black" id="demo">
        <div className="max-w-[1200px] mx-auto px-6 max-md:px-4">
          <div className="bg-[#111111] border border-[#1A1A1A] rounded-2xl py-16 px-12 max-md:px-6 text-center max-w-[800px] mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              See your region's pipeline
            </h2>
            <p className="text-lg text-[#A0A0A0] mb-8 max-w-[550px] mx-auto">
              Request a walkthrough. We will show you the talent flows, employer signals and program gaps specific to your geography.
            </p>
            <div className="flex justify-center">
              <Link
                to="/demo"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold bg-accent text-black rounded-lg hover:bg-accent-hover hover:-translate-y-0.5 transition-all shadow-glow hover:shadow-glow-teal no-underline"
              >
                Request a demo
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
