import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export const AboutPage = () => {
  return (
    <>
      <Helmet>
        <title>About zScale | Economic Intelligence for Regions Building the AI Economy</title>
        <meta name="description" content="zScale connects the data behind regional economic decisions. Founded by Sushma Vadlamannati, we bring business activity, labor signals, capital flows and benchmarking into one source of truth for universities, EDCs, employers and workforce boards." />
        <meta property="og:title" content="About zScale: Economic Intelligence Layer for the AI Economy" />
        <meta property="og:description" content="The connection layer behind regional economic decisions. Built by an operator with 15 years of enterprise data experience." />
        <link rel="canonical" href="https://zscalecapital.com/about" />
      </Helmet>

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

        <div className="relative z-[1] max-w-[1200px] mx-auto px-6">
          <div className="max-w-[720px]">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-semibold mb-6">
              About
            </p>
            <h1 className="text-[36px] md:text-[48px] lg:text-[64px] font-bold text-white leading-[1.05] tracking-[-0.03em] mb-6">
              We connect the data behind regional economic decisions
            </h1>
            <p className="text-lg md:text-xl text-[#B0B0B0] leading-relaxed">
              zScale is the economic intelligence layer for regions building the AI economy. We bring business activity, labor market signals, capital flows and regional benchmarking into one source of truth, so universities, EDCs, employers and workforce boards can run on the same numbers.
            </p>
          </div>
        </div>
      </section>

      {/* ==================== THE STORY ==================== */}
      <section className="py-16 md:py-24 bg-[#0A0A0A] border-t border-[#1E1E1E]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-10 md:gap-16">
            {/* Left: Label + H2 */}
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-semibold mb-3">
                The story
              </p>
              <h2 className="text-[28px] md:text-[36px] font-bold text-white leading-tight tracking-[-0.02em]">
                Why zScale exists
              </h2>
            </div>

            {/* Right: Body */}
            <div className="space-y-5 text-[#B0B0B0] leading-relaxed text-base md:text-lg">
              <p>
                The data behind every regional economic decision exists. Business registrations, labor projections, academic outcomes, capital programs, corporate filings, agency reports. The information is public. Most of it is updated quarterly or better. The problem zScale solves is not access. It is connection.
              </p>
              <p>
                A university provost designing a new program needs to see employer demand, regional wage trends and graduate outcomes side by side. An EDC director responding to a corporate prospect needs talent supply data, capital program eligibility and competitive benchmarks in the same view. A site selector evaluating Texas needs to compare regions across costs, talent pools and incentive packages in minutes, not weeks.
              </p>
              <p>
                These decisions are happening every day, with the same underlying data. zScale is the connection layer that brings the data into the same conversation, in real time, in one query interface. The question driving the work: are the skills we are using today actually matching where the economy is heading tomorrow?
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== HOW WE WORK ==================== */}
      <section className="py-16 md:py-24 bg-[#050505] border-t border-[#1E1E1E]">
        <div className="max-w-[1200px] mx-auto px-6">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-semibold mb-3">
            How we work
          </p>
          <h2 className="text-[28px] md:text-[36px] font-bold text-white mb-12 leading-tight tracking-[-0.02em]">
            Operating principles
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                number: '01',
                title: 'Data is the work',
                body: 'We do not sell models. We sell connected, verifiable, current data. Every signal in the platform traces back to a public source. Every recommendation comes with the underlying numbers attached.',
              },
              {
                number: '02',
                title: 'Decisions are the unit',
                body: 'The platform exists to make specific decisions easier. A site selection. A program redesign. A capital application. A workforce strategy. We measure ourselves by whether the decision got made faster and with more confidence.',
              },
              {
                number: '03',
                title: 'Speed is a feature',
                body: 'Most institutional intelligence takes weeks to compile. We aim for seconds. Real-time data means our customers can react to economic signals as they emerge, not after they have shaped the next quarter.',
              },
            ].map((principle) => (
              <div key={principle.number}>
                <span className="text-accent font-mono text-sm font-bold mb-3 block">
                  {principle.number}
                </span>
                <h3 className="text-lg font-semibold text-white mb-3">
                  {principle.title}
                </h3>
                <p className="text-[#A0A0A0] text-base leading-relaxed">
                  {principle.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FOUNDER ==================== */}
      <section className="py-16 md:py-24 bg-[#0A0A0A] border-t border-[#1E1E1E]">
        <div className="max-w-[1200px] mx-auto px-6">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-semibold mb-3">
            Founder
          </p>
          <h2 className="text-[28px] md:text-[36px] font-bold text-white mb-10 leading-tight tracking-[-0.02em]">
            Built by an operator
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 lg:gap-16 items-start">
            {/* Photo */}
            <div>
              <div className="w-full max-w-[200px] lg:max-w-[280px] aspect-[4/5] rounded-2xl overflow-hidden bg-ink-card mx-auto lg:mx-0">
                <img
                  src="/images/sushma-headshot.png"
                  alt="Sushma Vadlamannati, Founder of zScale"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <h3 className="text-[28px] md:text-[36px] font-bold text-white leading-tight tracking-[-0.02em] mb-1">
                Sushma Vadlamannati
              </h3>
              <p className="text-accent text-sm font-semibold uppercase tracking-[0.15em] mb-8">
                Founder
              </p>

              <div className="space-y-5 text-[#B0B0B0] leading-relaxed text-base">
                <p>
                  Before zScale, I spent 15 years building enterprise data systems at Fortune 100 companies, leading programs with $500M+ budgets and teams of 200+ people. The work taught me that connected, real-time data is what separates organizations that move from organizations that wait.
                </p>
                <p>
                  I started zScale after working alongside universities, EDCs and workforce boards across Texas. The pattern I kept hearing was the same: skilled teams producing thoughtful analysis, asking for a way to see the full picture in one place, in real time. zScale is what they described.
                </p>
              </div>

              {/* Credentials data row */}
              <div className="mt-8 pt-8 border-t border-[#1E1E1E]">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {[
                    { label: 'Experience', value: '15 years enterprise data' },
                    { label: 'Programs led', value: '$500M+ budget responsibility' },
                    { label: 'Team scale', value: '200+ direct and indirect reports' },
                  ].map((item) => (
                    <div key={item.label}>
                      <span className="text-xs text-[#606060] uppercase tracking-[0.1em] block mb-1">
                        {item.label}
                      </span>
                      <span className="text-sm text-white">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
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

      {/* ==================== WHAT WE PUBLISH ==================== */}
      <section className="py-16 md:py-24 bg-[#050505] border-t border-[#1E1E1E]">
        <div className="max-w-[1200px] mx-auto px-6">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-semibold mb-3">
            What we publish
          </p>
          <h2 className="text-[28px] md:text-[36px] font-bold text-white mb-12 leading-tight tracking-[-0.02em]">
            Open research, available to everyone
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#0D0D0D] border border-[#1E1E1E] rounded-xl p-6 hover:border-accent/20 transition-colors">
              <h3 className="text-lg font-semibold text-white mb-3">
                The Workforce Intelligence Brief
              </h3>
              <p className="text-[#A0A0A0] text-sm leading-relaxed mb-4">
                Bi-weekly research on the regional economic shifts shaping talent, capital and policy decisions.
              </p>
              <Link
                to="/intelligence"
                className="text-accent text-sm font-medium hover:underline no-underline"
              >
                Read the latest issue &rarr;
              </Link>
            </div>

            <div className="bg-[#0D0D0D] border border-[#1E1E1E] rounded-xl p-6 hover:border-accent/20 transition-colors">
              <h3 className="text-lg font-semibold text-white mb-3">
                The Texas Talent Pipeline Tracker
              </h3>
              <p className="text-[#A0A0A0] text-sm leading-relaxed mb-4">
                A continuously updated public database of institutional expansions, corporate moves, innovation programs, talent pipelines and site selection signals across Texas.
              </p>
              <Link
                to="/tracker"
                className="text-accent text-sm font-medium hover:underline no-underline"
              >
                Explore the tracker &rarr;
              </Link>
            </div>

            <div className="bg-[#0D0D0D] border border-[#1E1E1E] rounded-xl p-6 hover:border-accent/20 transition-colors">
              <h3 className="text-lg font-semibold text-white mb-3">
                Tools (coming soon)
              </h3>
              <p className="text-[#A0A0A0] text-sm leading-relaxed mb-4">
                Region comparison, expansion readiness scoring, EDC directory and talent source finder. Self-serve tools for the people making regional decisions.
              </p>
              <Link
                to="/tools/region-comparison"
                className="text-accent text-sm font-medium hover:underline no-underline"
              >
                See what's coming &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CREDENTIALS ==================== */}
      <section className="py-16 md:py-24 bg-[#0A0A0A] border-t border-[#1E1E1E]">
        <div className="max-w-[1100px] mx-auto px-6">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-semibold mb-3">
            Credentials
          </p>
          <h2 className="text-[28px] md:text-[36px] font-bold text-white mb-4 leading-tight tracking-[-0.02em]">
            Built for institutional partnerships
          </h2>
          <p className="text-[#808080] text-base mb-10 max-w-[700px]">
            zScale is operated by zScale Capital LLC and maintains the credentials required for institutional and government partnerships.
          </p>

          <div className="bg-[#0D0D0D] border border-[#1E1E1E] rounded-xl overflow-hidden max-w-[700px]">
            <div className="divide-y divide-[#111111]">
              {[
                { label: 'SAM.gov registration', value: 'Active' },
                { label: 'Unique Entity ID (UEI)', value: 'DPKYDLDKEFG9' },
                { label: 'CAGE Code', value: '1A0X9' },
                { label: 'NAICS Codes', value: '541611, 541511, 541512, 541612, 541720, 541910' },
                { label: 'Legal entity', value: 'zScale Capital LLC' },
                { label: 'State of registration', value: 'Texas' },
              ].map((row) => (
                <div key={row.label} className="px-6 py-3.5 flex items-center justify-between gap-4">
                  <span className="text-sm text-[#808080]">{row.label}</span>
                  <span className="text-sm text-white font-mono text-right">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[#808080] text-sm mt-8">
            For procurement, partnership or formal contracting inquiries:{' '}
            <a href="mailto:sushma@zscalecapital.com" className="text-accent hover:underline">
              sushma@zscalecapital.com
            </a>
          </p>
        </div>
      </section>

      {/* ==================== GET IN TOUCH ==================== */}
      <section className="py-16 md:py-24 bg-[#050505] border-t border-[#1E1E1E]">
        <div className="max-w-[700px] mx-auto px-6 text-center">
          <h2 className="text-[28px] md:text-[36px] font-bold text-white mb-4 leading-tight tracking-[-0.02em]">
            Get in touch
          </h2>
          <p className="text-[#808080] text-base md:text-lg mb-10">
            For demos, partnerships, press or research collaboration:{' '}
            <a href="mailto:sushma@zscalecapital.com" className="text-accent hover:underline">
              sushma@zscalecapital.com
            </a>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/demo"
              className="px-8 py-3.5 bg-accent text-black font-semibold rounded-lg hover:bg-accent/90 transition-colors text-sm no-underline"
            >
              Request a demo
            </Link>
            <Link
              to="/preview"
              className="px-8 py-3.5 bg-[#111111] border border-[#1E1E1E] text-white font-semibold rounded-lg hover:border-accent/40 transition-colors text-sm no-underline"
            >
              Explore the platform
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
