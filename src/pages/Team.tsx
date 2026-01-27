import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { IRIModal } from '../components/IRI';

// Person Schema for SEO/AI optimization (GEO - Generative Engine Optimization)
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Sushma Vadlamannati",
  "jobTitle": "Founder & Managing Partner",
  "worksFor": {
    "@type": "Organization",
    "name": "zScale Capital",
    "url": "https://zscalecapital.com"
  },
  "alumniOf": [
    {
      "@type": "CollegeOrUniversity",
      "name": "Wharton Business School",
      "sameAs": "https://www.wharton.upenn.edu/"
    },
    {
      "@type": "CollegeOrUniversity",
      "name": "Columbia Business School",
      "sameAs": "https://www8.gsb.columbia.edu/"
    }
  ],
  "knowsAbout": [
    "Venture Capital Benchmarking",
    "Sequoia Capital Standards",
    "a16z Investment Patterns",
    "M&A Integration",
    "Program Management",
    "Enterprise Technology",
    "Supply Chain",
    "Retail Technology",
    "Bio-Tech",
    "Health Tech"
  ],
  "description": "Execution-first venture partner with Fortune 100 operating experience at T-Mobile, Costco, and Nordstrom. Managed $500M+ budgets and 200+ person teams. Executive certifications in Venture Capital from Columbia Business School and Private Equity from The Wharton School.",
  "image": "https://zscalecapital.com/sushma-vadlamannati.jpg",
  "url": "https://zscalecapital.com/team",
  "sameAs": [
    "https://www.linkedin.com/in/sushma-vad/"
  ]
};

export const Team = () => {
  // IRI Modal state
  const [isIRIOpen, setIsIRIOpen] = useState(false);

  return (
    <>
      <Helmet>
        <title>Sushma Vadlamannati | Founder & Managing Partner | zScale Capital</title>
        <meta
          name="description"
          content="Sushma Vadlamannati is the Founder & Managing Partner of zScale Capital. Former T-Mobile, Costco, and Nordstrom executive with $500M+ budget management experience. Wharton & Columbia certified in Venture Capital and Private Equity."
        />
        <link rel="canonical" href="https://zscalecapital.com/team" />
        {/* Person Schema for AI/SEO optimization */}
        <script type="application/ld+json">
          {JSON.stringify(personSchema)}
        </script>
      </Helmet>

      {/* Noise texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />

      <div className="min-h-screen bg-[#0A0A0B] pt-20 relative">
        {/* ================================================================= */}
        {/* HERO SECTION - Profile & Immutable Bio */}
        {/* ================================================================= */}
        <section className="relative py-20 lg:py-28 px-6 lg:px-12 overflow-hidden">
          {/* Background gradient blobs - Liquid Glass effect */}
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-accent/8 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[120px]" />

          <div className="max-w-4xl mx-auto relative">
            <div className="flex flex-col items-center text-center">
              {/* Profile Image - Circle with Teal Glow (Liquid Glass) */}
              <div className="relative mb-10">
                {/* Outer glow ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent via-accent/50 to-accent/30 blur-md opacity-50 scale-105" />

                {/* Teal border ring */}
                <div className="relative w-48 h-48 lg:w-56 lg:h-56 rounded-full p-[3px] bg-gradient-to-br from-accent via-accent/60 to-accent/40 shadow-[0_0_50px_rgba(1,249,198,0.25)]">
                  {/* Inner dark ring for depth */}
                  <div className="w-full h-full rounded-full p-[3px] bg-[#0A0A0B]">
                    {/* Image container */}
                    <div className="w-full h-full rounded-full overflow-hidden">
                      <img
                        src="/sushma-vadlamannati.jpg"
                        alt="Sushma Vadlamannati - Founder & Managing Partner of zScale Capital"
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Name & Title */}
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-3">
                Sushma Vadlamannati
              </h1>
              <p className="text-xl text-accent font-medium mb-10">
                Founder & Managing Partner
              </p>

              {/* The Immutable Bio - Exact Text */}
              <div className="max-w-3xl space-y-6 text-lg text-white/70 leading-relaxed">
                <p>
                  I believe that scaling a venture is a discipline of execution. Before building zScale, I spent 15 years in the trenches at Fortune 100 companies—including <span className="text-white font-medium">T-Mobile</span>, <span className="text-white font-medium">Costco</span>, and <span className="text-white font-medium">Nordstrom</span>—leading enterprise-scale transformations. My career has been defined by large-scale reality: managing budgets exceeding $500 million and leading teams of over 200 to deliver complex technology and operations.
                </p>
                <p>
                  Over the last several years, I have transitioned this analytical rigor into the early-stage landscape as an active investor and advisor. During this time, I audited the growth patterns of top-tier accelerators like <span className="text-white font-medium">Y-Combinator</span> and indexed the investment benchmarks utilized by institutional firms like <span className="text-white font-medium">Sequoia</span> and <span className="text-white font-medium">a16z</span> to decode the specific standards of fundability.
                </p>
                <p>
                  Complementing this investment and operational track record, I hold executive certifications in <span className="text-white font-medium">Venture Capital from Columbia Business School</span> and <span className="text-white font-medium">Private Equity from The Wharton School</span>. At zScale, I leverage this research alongside a deep advisory network in Supply Chain, Retail, Technology, Bio-Tech, and Health Tech to help founders clear the hurdle to institutional capital.
                </p>
              </div>

              {/* LinkedIn Link */}
              <div className="mt-10">
                <a
                  href="https://www.linkedin.com/in/sushma-vad/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-white/50 hover:text-accent transition-colors duration-300"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                  <span className="text-sm font-medium">LinkedIn</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* OPERATING MARKERS - Clean Horizontal Row (No Boxes) */}
        {/* ================================================================= */}
        <section className="py-12 px-6 lg:px-12 border-t border-white/[0.05]">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0 text-center">
              {/* Enterprise Scale */}
              <div className="md:flex-1">
                <span className="text-sm text-white/40 tracking-wide">
                  Enterprise Scale: <span className="text-white/70">$500M+ Scope</span>
                </span>
              </div>

              {/* Divider */}
              <div className="hidden md:block w-px h-4 bg-white/20 mx-6" />

              {/* Network Impact */}
              <div className="md:flex-1">
                <span className="text-sm text-white/40 tracking-wide">
                  Network Impact: <span className="text-white/70">1M+ Customer Activations</span>
                </span>
              </div>

              {/* Divider */}
              <div className="hidden md:block w-px h-4 bg-white/20 mx-6" />

              {/* Ivy League */}
              <div className="md:flex-1">
                <span className="text-sm text-white/40 tracking-wide">
                  Ivy League: <span className="text-white/70">Wharton & Columbia</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* SOFT CTA - Elegant Text Link with Arrow */}
        {/* ================================================================= */}
        <section className="py-16 px-6 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <button
              onClick={() => setIsIRIOpen(true)}
              className="group inline-flex items-center gap-3 text-accent hover:text-white transition-colors duration-300"
            >
              <span className="text-lg font-medium">
                Request an Institutional Readiness Audit
              </span>
              <svg
                className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </section>
      </div>

      {/* IRI Modal */}
      <IRIModal isOpen={isIRIOpen} onClose={() => setIsIRIOpen(false)} source="Team_Page_IRI" />
    </>
  );
};
