import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { IRIModal } from '../components/IRI';

// Schema.org structured data for the IRI tool
const iriSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Investment Readiness Index (IRI)",
  "description": "Free 2-minute diagnostic tool for startup founders. Get your Venture Readiness Scorecard showing exactly what VCs will flag before you pitch.",
  "url": "https://zscalecapital.com/iri",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "provider": {
    "@type": "Organization",
    "name": "zScale Capital",
    "url": "https://zscalecapital.com"
  }
};

export function IRI() {
  const [isIRIOpen, setIsIRIOpen] = useState(false);

  // Auto-open the IRI modal on page load
  useEffect(() => {
    // Small delay to ensure smooth page load before modal opens
    const timer = setTimeout(() => {
      setIsIRIOpen(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Helmet>
        <title>Investment Readiness Index (IRI) - Free Founder Assessment | zScale Capital</title>
        <meta
          name="description"
          content="Free 2-minute diagnostic tool for startup founders. Get your Venture Readiness Scorecard showing exactly what VCs will flag before you pitch."
        />
        <link rel="canonical" href="https://zscalecapital.com/iri" />
        <meta property="og:title" content="Investment Readiness Index (IRI) - Free Founder Assessment" />
        <meta property="og:description" content="Free 2-minute diagnostic tool for startup founders. Get your Venture Readiness Scorecard showing exactly what VCs will flag before you pitch." />
        <meta property="og:url" content="https://zscalecapital.com/iri" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Investment Readiness Index (IRI) - Free Founder Assessment" />
        <meta name="twitter:description" content="Free 2-minute diagnostic tool for startup founders. Get your Venture Readiness Scorecard showing exactly what VCs will flag before you pitch." />
        <script type="application/ld+json">
          {JSON.stringify(iriSchema)}
        </script>
      </Helmet>

      {/* Background with noise texture */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />

      <div className="min-h-screen bg-[#0A0A0B] pt-20 relative">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 px-6 lg:px-12 overflow-hidden">
          {/* Background gradient effects */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl" />
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-8">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span className="text-accent text-sm font-medium">Free Assessment</span>
            </div>

            {/* Main headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Know if you're investor-ready{' '}
              <span className="text-accent">before you pitch</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-gray-400 mb-8">
              Free 2-minute diagnostic. Instant results.
            </p>

            {/* Description */}
            <p className="text-gray-500 max-w-2xl mx-auto mb-10 text-lg">
              Get your personalized Venture Readiness Scorecard showing exactly what VCs will flag
              during due diligence. Based on patterns from 1,000+ successful raises.
            </p>

            {/* CTA Button */}
            <button
              onClick={() => setIsIRIOpen(true)}
              className="group inline-flex items-center gap-3 bg-accent text-ink font-semibold px-8 py-4 rounded-lg hover:opacity-90 transition-all duration-200 text-lg shadow-lg shadow-accent/20 hover:shadow-accent/30"
            >
              <span>Start Assessment</span>
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>

            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap justify-center gap-8 text-gray-500 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>2-minute assessment</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Instant scorecard</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>100% free</span>
              </div>
            </div>
          </div>
        </section>

        {/* What You'll Learn Section */}
        <section className="py-16 px-6 lg:px-12 bg-gray-900/30">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">
              What Your Scorecard Reveals
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: '📊',
                  title: 'PMF Evidence',
                  description: 'How VCs will evaluate your product-market fit signals',
                },
                {
                  icon: '💰',
                  title: 'Unit Economics',
                  description: 'Whether your metrics meet institutional investor standards',
                },
                {
                  icon: '👥',
                  title: 'Team Strength',
                  description: 'How your founding team stacks up against VC expectations',
                },
                {
                  icon: '⚙️',
                  title: 'Infrastructure',
                  description: 'Legal, financial, and operational readiness gaps',
                },
                {
                  icon: '🎯',
                  title: 'Capital Positioning',
                  description: 'How well you\'re positioned to tell your fundraising story',
                },
                {
                  icon: '📋',
                  title: 'Action Plan',
                  description: 'Prioritized recommendations to close your gaps',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-accent/30 transition-colors"
                >
                  <div className="text-3xl mb-4">{item.icon}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-20 px-6 lg:px-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to See Where You Stand?
            </h2>
            <p className="text-gray-400 mb-8">
              Join 500+ founders who've used IRI to prepare for successful raises.
            </p>
            <button
              onClick={() => setIsIRIOpen(true)}
              className="inline-flex items-center gap-2 bg-accent text-ink font-semibold px-8 py-4 rounded-lg hover:opacity-90 transition-opacity text-lg"
            >
              Start Your Free Assessment
            </button>
          </div>
        </section>
      </div>

      {/* IRI Modal */}
      <IRIModal
        isOpen={isIRIOpen}
        onClose={() => setIsIRIOpen(false)}
        source="IRI_Landing_Page"
      />
    </>
  );
}
