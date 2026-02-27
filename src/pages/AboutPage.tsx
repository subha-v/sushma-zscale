import { Link } from 'react-router-dom';

const stats = [
  { value: '47,312', label: 'Texas Businesses Tracked' },
  { value: '254', label: 'Counties Covered' },
  { value: '50K+', label: 'Active Job Postings' },
  { value: '13,000+', label: 'Manufacturing Companies' },
];

export const AboutPage = () => {
  return (
    <>
      {/* ==================== HERO ==================== */}
      <section className="relative pt-[140px] pb-20 bg-black overflow-hidden">
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(1, 249, 198, 0.04) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(1, 249, 198, 0.04) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />

        <div className="relative z-[1] max-w-[1200px] mx-auto px-6 text-center">
          <h1 className="text-[36px] md:text-[48px] lg:text-[56px] font-bold text-white leading-[1.1] tracking-tight mb-5">
            About
          </h1>
          <p className="text-lg md:text-xl text-[#C0C0C0] leading-relaxed max-w-[700px] mx-auto">
            Market intelligence platform for Texas economic development.
          </p>
        </div>
      </section>

      {/* ==================== PLATFORM STATS ==================== */}
      <section className="py-16 md:py-20 bg-[#0D0D0D]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-[#111111] border border-[#1A1A1A] rounded-xl p-6 text-center"
              >
                <div className="text-[28px] md:text-[36px] font-bold text-accent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-[#A0A0A0] leading-snug">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FOUNDER SECTION ==================== */}
      <section className="py-16 md:py-24 bg-black">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid md:grid-cols-[auto_1fr] gap-10 md:gap-16 items-start">
            {/* Photo */}
            <div className="flex justify-center md:justify-start">
              <div className="w-[180px] h-[180px] rounded-full overflow-hidden border-[3px] border-[#10B981] flex-shrink-0">
                <img
                  src="/images/sushma-headshot.jpg"
                  alt="Sushma Vadlamannati"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <h2 className="text-[28px] md:text-[36px] font-bold text-white mb-2">
                Sushma Vadlamannati
              </h2>
              <p className="text-sm uppercase tracking-[0.15em] text-accent font-semibold mb-6">
                Founder
              </p>

              <div className="space-y-5 text-[#C0C0C0] leading-relaxed text-base">
                <p>
                  I built zScale after spending 15 years at Fortune 100 companies including
                  T-Mobile, Costco, and Nordstrom. Across those roles I managed $500M+ budgets,
                  led 200+ person teams, and oversaw programs that touched millions of customers.
                  The common thread in every role was the same: the teams that won were the ones
                  with better data.
                </p>
                <p>
                  When I moved into economic development, I kept running into the same problem.
                  The data existed, but it was scattered across dozens of state agencies, federal
                  databases, and proprietary sources. EDCs were spending days pulling together
                  basic business lists for RFPs. Workforce boards were making decisions on
                  gut feel instead of labor market signals. Site selectors were relying on
                  outdated spreadsheets. Everyone needed good data, and nobody had time to
                  compile it.
                </p>
                <p>
                  zScale consolidates official Texas state data — business registrations,
                  employment figures, wage trends, industry concentrations, capital programs —
                  into a single platform built for the people doing the actual work of economic
                  development. No consultants required. No six-month implementation. Just the
                  data you need, organized the way you think about your region.
                </p>
              </div>

              <div className="mt-8">
                <a
                  href="https://www.linkedin.com/in/sushma-vad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#111111] border border-[#1A1A1A] rounded-lg text-accent text-sm font-medium hover:border-accent/40 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section className="py-16 md:py-20 bg-[#0D0D0D] border-t border-[#1A1A1A]">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <h2 className="text-[28px] md:text-[36px] font-bold text-white mb-4">
            See zScale Capital in Action
          </h2>
          <p className="text-[#A0A0A0] text-base md:text-lg mb-8 max-w-[550px] mx-auto">
            Get a personalized walkthrough of the platform for your region.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link
              to="/demo"
              className="px-8 py-3.5 bg-accent text-black font-semibold rounded-lg hover:bg-accent/90 transition-colors text-sm"
            >
              Request Demo
            </Link>
            <Link
              to="/preview"
              className="px-8 py-3.5 bg-[#111111] border border-[#1A1A1A] text-white font-semibold rounded-lg hover:border-accent/40 transition-colors text-sm"
            >
              Try Free Preview
            </Link>
          </div>

          <p className="text-sm text-[#A0A0A0]">
            Or reach out directly at{' '}
            <a
              href="mailto:info@zscalecapital.com"
              className="text-accent hover:underline"
            >
              info@zscalecapital.com
            </a>
          </p>
        </div>
      </section>
    </>
  );
};
