import { Link } from 'react-router-dom';

export const AboutPage = () => {
  return (
    <>
      {/* ==================== HERO ==================== */}
      <section className="relative pt-[140px] pb-24 bg-[#050505] overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(1, 249, 198, 0.06) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(1, 249, 198, 0.06) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050505] z-0" />

        <div className="relative z-[1] max-w-[900px] mx-auto px-6">
          <p className="text-xs uppercase tracking-[0.2em] text-accent font-semibold mb-6">
            About zScale Capital
          </p>
          <h1 className="text-[36px] md:text-[48px] lg:text-[64px] font-bold text-white leading-[1.05] tracking-[-0.03em] mb-6">
            The data exists.<br />
            Most institutions just can't use it.
          </h1>
          <p className="text-lg md:text-xl text-[#B0B0B0] leading-relaxed max-w-[640px]">
            Universities run on gut feel. EDCs compile RFPs by hand. Workforce boards inherit
            BLS data two years late. zScale changes that.
          </p>
        </div>
      </section>

      {/* ==================== IMPACT NUMBERS ==================== */}
      <section className="py-16 md:py-20 bg-[#0A0A0A]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#1E1E1E]">
            {[
              { value: '47,312', label: 'Texas Businesses' },
              { value: '254', label: 'Counties Covered' },
              { value: '50K+', label: 'Live Job Postings' },
              { value: '180+', label: 'Academic Programs' },
            ].map((stat) => (
              <div key={stat.label} className="px-4 md:px-8 py-4 first:pl-0 last:pr-0">
                <div className="text-[36px] md:text-[52px] font-bold text-accent leading-none tracking-tight mb-2">
                  {stat.value}
                </div>
                <div className="text-xs text-[#606060] uppercase tracking-[0.1em]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FOUNDER ==================== */}
      <section className="py-20 md:py-28 bg-[#050505]">
        <div className="max-w-[1100px] mx-auto px-6">
          <p className="text-xs uppercase tracking-[0.2em] text-[#707070] mb-8">
            Who Built This
          </p>

          <div className="grid md:grid-cols-[260px_1fr] gap-10 md:gap-14 items-start">
            {/* Photo + Company pills */}
            <div>
              <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden border border-[#1E1E1E]">
                <img
                  src="/images/sushma-headshot.jpg"
                  alt="Sushma Vadlamannati"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {['T-Mobile', 'Costco', 'Nordstrom'].map((company) => (
                  <span
                    key={company}
                    className="px-3 py-1 bg-[#111111] border border-[#1E1E1E] rounded-full text-xs text-[#808080]"
                  >
                    {company}
                  </span>
                ))}
              </div>
            </div>

            {/* Bio */}
            <div>
              <h2 className="text-[28px] md:text-[40px] font-bold text-white leading-tight tracking-[-0.02em] mb-1">
                Sushma Vadlamannati
              </h2>
              <p className="text-accent text-sm font-semibold uppercase tracking-[0.15em] mb-6">
                Founder & CEO
              </p>

              <p className="text-lg text-white leading-relaxed mb-5 font-medium">
                I spent 15 years managing enterprise data programs at Fortune 100 companies
                — $500M+ budgets, 200+ person teams. When I moved into economic development,
                I kept finding the same problem the private sector solved 20 years ago:
                the data exists, but institutions can't access it.
              </p>

              <div className="space-y-4 text-[#B0B0B0] leading-relaxed text-base">
                <p>
                  EDCs were spending days pulling together basic business lists for RFPs.
                  Workforce boards were making decisions on gut feel instead of labor market
                  signals. Site selectors were relying on outdated spreadsheets. Everyone
                  needed good data, and nobody had time to compile it.
                </p>
                <p>
                  zScale consolidates official Texas state data — business registrations,
                  employment figures, wage trends, industry concentrations, capital programs —
                  into a single platform built for the people doing the actual work of economic
                  development. No consultants required. No six-month implementation. Just the
                  data you need, organized the way you think about your region.
                </p>
              </div>

              {/* Fast-scan credential row */}
              <div className="mt-8 pt-8 border-t border-[#1E1E1E] grid grid-cols-3 gap-6">
                {[
                  { value: '15 yrs', label: 'Enterprise Data' },
                  { value: '$500M+', label: 'Budgets Managed' },
                  { value: '200+', label: 'Teams Led' },
                ].map((c) => (
                  <div key={c.label}>
                    <div className="text-[22px] font-bold text-accent tracking-tight">
                      {c.value}
                    </div>
                    <div className="text-xs text-[#707070] mt-0.5">{c.label}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <a
                  href="https://www.linkedin.com/in/sushma-vad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#111111] border border-[#1E1E1E] rounded-lg text-[#A0A0A0] text-sm font-medium hover:border-accent/40 hover:text-accent transition-colors"
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

      {/* ==================== WHO WE SERVE ==================== */}
      <section className="py-16 md:py-24 bg-[#0A0A0A] border-t border-[#1E1E1E]">
        <div className="max-w-[1200px] mx-auto px-6">
          <p className="text-xs uppercase tracking-[0.2em] text-[#707070] mb-3">
            Built for
          </p>
          <h2 className="text-[28px] md:text-[40px] font-bold text-white mb-12 max-w-[500px] leading-tight tracking-[-0.02em]">
            Three institutions. One platform.
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                audience: 'Universities',
                tagline: 'Curriculum aligned to real employer demand',
                bullets: [
                  'HB8 compliance tracking',
                  'Program ROI scorecards',
                  'Employer partnership maps',
                  'Graduate placement analytics',
                ],
              },
              {
                audience: 'EDCs',
                tagline: 'Site selection packages built in hours, not days',
                bullets: [
                  'Talent pool analysis by sector',
                  'Employer health monitoring',
                  'Regional labor comparisons',
                  'Board-ready report generation',
                ],
              },
              {
                audience: 'Workforce Boards',
                tagline: 'Labor market intelligence without the analyst overhead',
                bullets: [
                  'Real-time job posting signals',
                  'Skills gap forecasting',
                  'Apprenticeship program mapping',
                  'Salary trajectory projections',
                ],
              },
            ].map((card) => (
              <div
                key={card.audience}
                className="bg-[#0D0D0D] border border-[#1E1E1E] rounded-xl p-6 hover:border-accent/20 transition-colors"
              >
                <p className="text-accent text-sm font-semibold uppercase tracking-[0.1em] mb-2">
                  {card.audience}
                </p>
                <p className="text-white font-medium text-base leading-snug mb-5">
                  {card.tagline}
                </p>
                <ul className="space-y-2.5">
                  {card.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-2.5 text-sm text-[#A0A0A0]"
                    >
                      <span className="w-1 h-1 rounded-full bg-accent/60 mt-[7px] shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== GOVERNMENT CREDENTIALS ==================== */}
      <section className="py-16 md:py-24 bg-[#050505] border-t border-[#1E1E1E]">
        <div className="max-w-[1100px] mx-auto px-6">
          <p className="text-xs uppercase tracking-[0.2em] text-[#707070] mb-3">
            Contract Vehicles & Registrations
          </p>
          <h2 className="text-[28px] md:text-[40px] font-bold text-white mb-4 leading-tight tracking-[-0.02em]">
            Government Contracting on File
          </h2>
          <p className="text-[#808080] text-base mb-12 max-w-[600px]">
            Registered and certified for federal, state, and local government contracting.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* SAM.gov Registration */}
            <div className="bg-[#0A0A0A] border border-[#1E1E1E] rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-[#1E1E1E] flex items-center justify-between">
                <span className="text-white font-medium text-sm">SAM.gov Registration</span>
                <span className="text-xs text-accent font-medium px-2.5 py-0.5 bg-accent/10 rounded-full">
                  Active
                </span>
              </div>
              <div className="divide-y divide-[#111111]">
                {[
                  { label: 'Unique Entity ID (UEI)', value: 'DPKYDLDKEFG9' },
                  { label: 'CAGE Code', value: '1A0X9' },
                  { label: 'Registration', value: 'All Awards' },
                  { label: 'Expiration', value: 'March 2027' },
                ].map((row) => (
                  <div key={row.label} className="px-6 py-3 flex items-center justify-between">
                    <span className="text-sm text-[#808080]">{row.label}</span>
                    <span className="text-sm text-white font-mono">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Business Classification */}
            <div className="bg-[#0A0A0A] border border-[#1E1E1E] rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-[#1E1E1E] flex items-center justify-between">
                <span className="text-white font-medium text-sm">Business Classification</span>
                <span className="text-xs text-accent font-medium px-2.5 py-0.5 bg-accent/10 rounded-full">
                  Verified
                </span>
              </div>
              <div className="divide-y divide-[#111111]">
                <div className="px-6 py-3 flex items-center gap-3">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-accent shrink-0">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <span className="text-sm text-[#C0C0C0]">Women-Owned Small Business</span>
                </div>
                <div className="px-6 py-3 flex items-center gap-3">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-accent shrink-0">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <span className="text-sm text-[#C0C0C0]">Minority-Owned Business</span>
                </div>
                <div className="px-6 py-3 flex items-center gap-3">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-accent shrink-0">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <span className="text-sm text-[#C0C0C0]">Small Business (SBA)</span>
                </div>
              </div>
              <div className="px-6 py-3 border-t border-[#1E1E1E]">
                <p className="text-xs text-[#555]">
                  WOSB (SBA) and WBENC certifications in progress — expected Q3 2026
                </p>
              </div>
            </div>

            {/* NAICS Codes */}
            <div className="bg-[#0A0A0A] border border-[#1E1E1E] rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-[#1E1E1E]">
                <span className="text-white font-medium text-sm">Primary NAICS Codes</span>
              </div>
              <div className="divide-y divide-[#111111]">
                {[
                  { code: '541611', desc: 'Administrative & General Management Consulting' },
                  { code: '541511', desc: 'Custom Computer Programming Services' },
                  { code: '541512', desc: 'Computer Systems Design Services' },
                  { code: '541612', desc: 'Human Resources Consulting Services' },
                  { code: '541720', desc: 'R&D in Social Sciences & Humanities' },
                  { code: '541910', desc: 'Marketing Research & Public Opinion Polling' },
                ].map((n) => (
                  <div key={n.code} className="px-6 py-3 flex items-center gap-4">
                    <span className="font-mono text-accent text-sm w-[70px] shrink-0">{n.code}</span>
                    <span className="text-sm text-[#A0A0A0]">{n.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* PSC Codes */}
            <div className="bg-[#0A0A0A] border border-[#1E1E1E] rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-[#1E1E1E]">
                <span className="text-white font-medium text-sm">Service Codes (PSC)</span>
              </div>
              <div className="divide-y divide-[#111111]">
                {[
                  { code: 'DA01', desc: 'IT & Telecom — Application Development' },
                  { code: 'B506', desc: 'Special Studies/Analysis — Data' },
                  { code: 'B507', desc: 'Special Studies/Analysis — Economic' },
                  { code: 'R408', desc: 'Program Management/Support' },
                ].map((p) => (
                  <div key={p.code} className="px-6 py-3 flex items-center gap-4">
                    <span className="font-mono text-accent text-sm w-[70px] shrink-0">{p.code}</span>
                    <span className="text-sm text-[#A0A0A0]">{p.desc}</span>
                  </div>
                ))}
              </div>
              <div className="px-6 py-3 border-t border-[#1E1E1E] flex items-center justify-between">
                <span className="text-xs text-[#555]">Congressional District: Texas 24</span>
                <span className="text-xs text-[#555]">State of Incorporation: Texas</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section className="py-20 md:py-28 bg-[#050505] border-t border-[#1E1E1E]">
        <div className="max-w-[700px] mx-auto px-6 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-[#707070] mb-3">
            Get Started
          </p>
          <h2 className="text-[28px] md:text-[40px] font-bold text-white mb-4 leading-tight tracking-[-0.02em]">
            See what your labor market looks like right now
          </h2>
          <p className="text-[#808080] text-base md:text-lg mb-10 max-w-[500px] mx-auto">
            Walk through real dashboards with your region's data. No sales call required.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <Link
              to="/demo"
              className="px-8 py-3.5 bg-accent text-black font-semibold rounded-lg hover:bg-accent/90 transition-colors text-sm"
            >
              Request Demo
            </Link>
            <Link
              to="/preview"
              className="px-8 py-3.5 bg-[#111111] border border-[#1E1E1E] text-white font-semibold rounded-lg hover:border-accent/40 transition-colors text-sm"
            >
              Try Live Preview
            </Link>
          </div>

          <p className="text-sm text-[#555]">
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
