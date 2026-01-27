import { useState, useRef, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Logo } from '../components/Logo';
import { SuccessModal } from '../components/SuccessModal';
import { DiagnosticModal, PrefilledLeadData } from '../components/Diagnostic';
import { GOOGLE_SCRIPT_URL, FORM_TYPES } from '../config/api';

export const EcosystemMap = () => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDiagnosticModal, setShowDiagnosticModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [capturedLeadData, setCapturedLeadData] = useState<PrefilledLeadData | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Family Offices data for Shadow Capital teaser
  const familyOffices = [
    { name: 'Highland Park Family Capital', focus: 'Real Estate Tech, Consumer', aum: '$2.5B' },
    { name: 'Lone Star Legacy Partners', focus: 'Energy, Manufacturing', aum: '$1.8B' },
    { name: 'Preston Hollow Investments', focus: 'Healthcare, FinTech', aum: '$950M' },
    { name: 'Turtle Creek Ventures', focus: 'SaaS, Enterprise', aum: '$750M' },
    { name: 'Park Cities Capital', focus: 'Consumer, Retail Tech', aum: '$620M' },
    { name: 'Northwood Family Office', focus: 'PropTech, Hospitality', aum: '$1.2B' },
    { name: 'Uptown Investment Group', focus: 'FinTech, Insurance', aum: '$880M' },
    { name: 'Lakewood Partners', focus: 'Healthcare IT, Biotech', aum: '$540M' },
  ];

  // Tier-1 Investor data
  const tier1Investors = [
    { name: 'Dallas Venture Capital', logo: 'DVC', focus: 'Enterprise SaaS', checkSize: '$2-10M' },
    { name: 'Perot Jain', logo: 'PJ', focus: 'Healthcare Tech', checkSize: '$1-5M' },
    { name: 'Silverton Partners', logo: 'SP', focus: 'B2B Software', checkSize: '$5-25M' },
    { name: 'Tritium Partners', logo: 'TP', focus: 'Energy Tech', checkSize: '$3-15M' },
  ];

  // Venture Benchmarks data
  const benchmarks = {
    dallas: { seedMedian: 4.2, seedTop: 8.5, seriesAMedian: 12.5 },
    siliconValley: { seedMedian: 12.8, seedTop: 25.0, seriesAMedian: 45.0 },
  };

  // What's inside the manual
  const manualContents = [
    { title: 'Shadow Capital List', desc: '35+ Family Offices actively deploying' },
    { title: 'The Dallas Multiplier Table', desc: 'Valuation benchmarks by sector' },
    { title: 'Unwritten Rules', desc: 'What VCs won\'t tell you (Page 6)' },
    { title: 'Investor Matching Matrix', desc: 'Find your ideal VC fit' },
    { title: 'Success Case Studies', desc: 'Island, LTK, Alkami playbooks' },
    { title: '2026 Event Calendar', desc: 'Every pitch night & demo day' },
  ];

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const firstName = (formData.get('firstName') as string || '').trim();
    const lastName = (formData.get('lastName') as string || '').trim();
    const email = formData.get('email') as string;
    const companyName = formData.get('companyName') as string || '';

    const data = {
      formType: FORM_TYPES.ECOSYSTEM_MAP,
      source: 'ecosystem-map-2026',
      firstName,
      lastName,
      email,
      companyName,
      currentStage: formData.get('currentStage') as string || '',
      timestamp: new Date().toISOString(),
    };

    // Capture lead data for diagnostic pre-fill (with split name)
    setCapturedLeadData({
      firstName,
      lastName,
      email,
      companyName,
    });

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      setShowSuccessModal(true);
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    if (formRef.current) formRef.current.reset();
  };

  const handleOpenDiagnostic = () => {
    setShowDiagnosticModal(true);
  };

  const handleCloseDiagnostic = () => {
    setShowDiagnosticModal(false);
  };

  const handleDiagnosticComplete = () => {
    setShowDiagnosticModal(false);
  };

  return (
    <>
      <Helmet>
        <title>2026 Dallas Ecosystem Map | Shadow Capital & Venture Intelligence | zScale Capital</title>
        <meta name="description" content="Access the complete Dallas startup ecosystem map. 35+ Family Offices, 45+ VCs, and insider intelligence. The institutional-grade guide to North Texas venture capital." />
        <meta name="keywords" content="Dallas family offices, Dallas venture capital, North Texas investors, DFW startup funding, Dallas ecosystem map, shadow capital Dallas" />
        <link rel="canonical" href="https://zscalecapital.com/ecosystem-map" />

        <meta property="og:title" content="2026 Dallas Ecosystem Map | zScale Capital" />
        <meta property="og:description" content="35+ Family Offices. 45+ VCs. The Shadow Capital List that isn't on Google." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://zscalecapital.com/ecosystem-map" />
      </Helmet>

      <div className="min-h-screen bg-[#0A0A0B]">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0B]/90 backdrop-blur-xl border-b border-ink-border">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link to="/">
              <Logo size="md" />
            </Link>
            <Link
              to="https://zscalecapital.com/startup-readiness-audit/"
              className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-[#0A0A0B] font-semibold rounded-lg hover:bg-accent-hover transition-colors text-sm"
            >
              Run IRI Assessment
            </Link>
          </div>
        </nav>

        {/* =================================================================
            SECTION 1: DOWNLOAD FORM (Hook-First - Moved to Top)
            ================================================================= */}
        <section id="download-form" className="pt-32 pb-20 px-6 lg:px-12">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left: What's Inside */}
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-xs mb-6">
                  <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                  <span className="text-accent font-mono">INSTITUTIONAL_INTELLIGENCE</span>
                </div>
                <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-[#FFFFFF] mb-6" style={{ letterSpacing: '-0.02em' }}>
                  Access the 2026
                  <span className="text-accent block mt-2">Institutional Intelligence Report</span>
                </h1>
                <p className="text-[#FFFFFF]/80 text-lg mb-8">
                  68 pages of proprietary venture benchmarks and Dallas-specific operational playbooks.
                </p>

                <div className="space-y-3">
                  {manualContents.map((item, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-ink-medium rounded-lg border border-ink-border">
                      <svg className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <span className="text-[#FFFFFF] font-medium text-sm">{item.title}</span>
                        <span className="text-[#FFFFFF]/60 text-sm ml-2">{item.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Form */}
              <div className="card-skeuomorphic p-8">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-[#FFFFFF] mb-2">Get Instant Access</h3>
                  <p className="text-[#FFFFFF]/60 text-sm">PDF delivered to your inbox in 30 seconds</p>
                </div>

                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-[#FFFFFF]/70 mb-2">First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        placeholder="Alex"
                        required
                        className="w-full px-4 py-3 bg-ink-medium border border-ink-border rounded-lg text-[#FFFFFF] placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#FFFFFF]/70 mb-2">Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Chen"
                        required
                        className="w-full px-4 py-3 bg-ink-medium border border-ink-border rounded-lg text-[#FFFFFF] placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#FFFFFF]/70 mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="alex@startup.com"
                      required
                      className="w-full px-4 py-3 bg-ink-medium border border-ink-border rounded-lg text-[#FFFFFF] placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#FFFFFF]/70 mb-2">Startup Name</label>
                    <input
                      type="text"
                      name="companyName"
                      placeholder="Acme Inc."
                      className="w-full px-4 py-3 bg-ink-medium border border-ink-border rounded-lg text-[#FFFFFF] placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#FFFFFF]/70 mb-2">Current Stage</label>
                    <select
                      name="currentStage"
                      className="w-full px-4 py-3 bg-ink-medium border border-ink-border rounded-lg text-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                      defaultValue=""
                    >
                      <option value="" disabled className="text-neutral-600">Select your stage...</option>
                      <option value="idea">Idea Stage</option>
                      <option value="mvp">MVP / Pre-Launch</option>
                      <option value="pre-revenue">Pre-Revenue</option>
                      <option value="revenue">Revenue ($1K-$50K MRR)</option>
                      <option value="growth">Growth ($50K+ MRR)</option>
                      <option value="series-a">Raising Series A</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-accent text-[#0A0A0B] font-bold rounded-lg hover:bg-accent-hover transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-glow"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download Free Intelligence Report
                      </>
                    )}
                  </button>

                  <p className="text-xs text-[#FFFFFF]/40 text-center mt-4">
                    By downloading, you agree to receive occasional emails about Dallas startup resources. Unsubscribe anytime.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            SECTION 2: READINESS GAP (The Problem)
            ================================================================= */}
        <section className="py-20 px-6 lg:px-12 border-t border-ink-border">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left: Headline */}
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-xs mb-8">
                  <span className="text-accent font-mono">THE_PROBLEM</span>
                </div>

                <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-[#FFFFFF] mb-6" style={{ letterSpacing: '-0.02em' }}>
                  The North Texas
                  <span className="block text-accent mt-2">Readiness Gap</span>
                </h2>

                <p className="text-lg text-[#FFFFFF]/70 mb-8 max-w-lg leading-relaxed">
                  Dallas has the capital. Dallas has the talent. What's missing?
                  <span className="text-[#FFFFFF] font-medium"> The institutional playbook</span> that turns bootstrap grit into venture-scale exits.
                </p>

                {/* Trust Badges */}
                <div className="flex items-center gap-6 pt-8 border-t border-ink-border">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-[#FFFFFF]/70">Venture Standard</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm text-[#FFFFFF]/70">Institutional Grade</span>
                  </div>
                </div>
              </div>

              {/* Right: Stats Card */}
              <div className="relative">
                <div className="card-skeuomorphic p-8 lg:p-10">
                  <div className="flex items-center gap-2 mb-8">
                    <span className="text-accent font-mono text-sm">ECOSYSTEM_STATS</span>
                    <span className="text-neutral-600">|</span>
                    <span className="text-[#FFFFFF]/60 text-sm">2026 Q1</span>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-4 bg-ink-medium rounded-xl border border-ink-border">
                      <div className="text-3xl font-bold text-accent mb-1">$150M+</div>
                      <div className="text-sm text-[#FFFFFF]/60">Local Early-Stage Capital</div>
                    </div>
                    <div className="p-4 bg-ink-medium rounded-xl border border-ink-border">
                      <div className="text-3xl font-bold text-[#FFFFFF] mb-1">45+</div>
                      <div className="text-sm text-[#FFFFFF]/60">Active VC Firms</div>
                    </div>
                    <div className="p-4 bg-ink-medium rounded-xl border border-ink-border">
                      <div className="text-3xl font-bold text-[#FFFFFF] mb-1">35+</div>
                      <div className="text-sm text-[#FFFFFF]/60">Family Offices</div>
                    </div>
                    <div className="p-4 bg-ink-medium rounded-xl border border-ink-border">
                      <div className="text-3xl font-bold text-[#FFFFFF] mb-1">12</div>
                      <div className="text-sm text-[#FFFFFF]/60">Global Exits Tracked</div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-ink-border">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#FFFFFF]/60">Intelligence Freshness</span>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                        <span className="text-accent font-mono">2026 Q1 Verified</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative glow */}
                <div className="absolute -inset-4 bg-accent/5 rounded-3xl blur-3xl -z-10" />
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            SECTION 3: MULTIPLIER THESIS (The Opportunity)
            ================================================================= */}
        <section className="py-20 px-6 lg:px-12 border-t border-ink-border">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-xs mb-6">
                <span className="text-accent font-mono">VENTURE_BENCHMARKS</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#FFFFFF] mb-4" style={{ letterSpacing: '-0.02em' }}>
                The Dallas Multiplier Thesis
              </h2>
              <p className="text-[#FFFFFF]/70 max-w-2xl mx-auto">
                Lower entry valuations + proven exit paths = asymmetric returns. Here's why smart capital is moving to DFW.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Dallas */}
              <div className="card-skeuomorphic p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 bg-accent rounded-full" />
                  <h3 className="text-xl font-bold text-[#FFFFFF]">Dallas-Fort Worth</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-ink-medium rounded-lg">
                    <span className="text-[#FFFFFF]/70">Seed Median (Pre-Money)</span>
                    <span className="text-2xl font-bold text-accent">${benchmarks.dallas.seedMedian}M</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-ink-medium rounded-lg">
                    <span className="text-[#FFFFFF]/70">Seed Top Decile</span>
                    <span className="text-2xl font-bold text-[#FFFFFF]">${benchmarks.dallas.seedTop}M</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-ink-medium rounded-lg">
                    <span className="text-[#FFFFFF]/70">Series A Median</span>
                    <span className="text-2xl font-bold text-[#FFFFFF]">${benchmarks.dallas.seriesAMedian}M</span>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-ink-border">
                  <span className="text-sm text-accent font-medium">3x lower entry = 3x more ownership</span>
                </div>
              </div>

              {/* Silicon Valley */}
              <div className="card-skeuomorphic p-8 opacity-60">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 bg-neutral-500 rounded-full" />
                  <h3 className="text-xl font-bold text-[#FFFFFF]/70">Silicon Valley</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-ink-medium rounded-lg">
                    <span className="text-[#FFFFFF]/50">Seed Median (Pre-Money)</span>
                    <span className="text-2xl font-bold text-[#FFFFFF]/70">${benchmarks.siliconValley.seedMedian}M</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-ink-medium rounded-lg">
                    <span className="text-[#FFFFFF]/50">Seed Top Decile</span>
                    <span className="text-2xl font-bold text-[#FFFFFF]/70">${benchmarks.siliconValley.seedTop}M</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-ink-medium rounded-lg">
                    <span className="text-[#FFFFFF]/50">Series A Median</span>
                    <span className="text-2xl font-bold text-[#FFFFFF]/70">${benchmarks.siliconValley.seriesAMedian}M</span>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-ink-border">
                  <span className="text-sm text-[#FFFFFF]/50">Higher competition, compressed returns</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            SECTION 4: SHADOW CAPITAL (Authority Proof)
            ================================================================= */}
        <section id="shadow-capital" className="py-20 px-6 lg:px-12 bg-ink-light border-t border-b border-ink-border">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full text-xs mb-6">
                <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span className="text-red-400 font-mono">SHADOW_CAPITAL</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#FFFFFF] mb-4" style={{ letterSpacing: '-0.02em' }}>
                35+ Dallas Family Offices
              </h2>
              <p className="text-[#FFFFFF]/70 max-w-2xl mx-auto">
                The "Shadow Capital" that doesn't show up on Crunchbase. These family offices actively deploy into
                early-stage ventures—but only take warm intros.
              </p>
            </div>

            {/* Blurred Preview Grid */}
            <div className="relative">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {familyOffices.map((office, index) => (
                  <div
                    key={index}
                    className={`p-5 bg-ink-medium rounded-xl border border-ink-border ${index > 1 ? 'blur-[6px]' : ''}`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-ink-light rounded-lg flex items-center justify-center border border-ink-border">
                        <span className="text-accent font-bold text-sm">{office.name.split(' ').map(w => w[0]).join('').slice(0, 2)}</span>
                      </div>
                      <div>
                        <h4 className="text-[#FFFFFF] font-medium text-sm">{office.name}</h4>
                        <p className="text-[#FFFFFF]/50 text-xs">{office.focus}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-ink-border">
                      <span className="text-xs text-[#FFFFFF]/50">AUM</span>
                      <span className="text-accent font-mono text-sm">{office.aum}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Unlock Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink-light via-ink-light/80 to-transparent flex items-end justify-center pb-12">
                <a
                  href="#download-form"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-accent text-[#0A0A0B] font-bold rounded-xl hover:bg-accent-hover transition-all duration-200 shadow-glow"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Unlock Full Shadow Capital List
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            SECTION 5: INSTITUTIONAL PARTNERS (Authority Proof)
            ================================================================= */}
        <section className="py-20 px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-xs mb-6">
                <span className="text-accent font-mono">TIER_1_NETWORK</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#FFFFFF] mb-4" style={{ letterSpacing: '-0.02em' }}>
                Institutional Partners
              </h2>
              <p className="text-[#FFFFFF]/70 max-w-2xl mx-auto">
                Dallas's most active venture firms. Our ecosystem map includes investment thesis, check sizes, and portfolio company case studies.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {tier1Investors.map((investor, index) => (
                <div key={index} className="card-skeuomorphic p-6 text-center group hover:border-accent/30 transition-colors">
                  <div className="w-16 h-16 mx-auto mb-4 bg-ink-medium rounded-2xl flex items-center justify-center border border-ink-border group-hover:border-accent/30 transition-colors">
                    <span className="text-2xl font-bold text-accent">{investor.logo}</span>
                  </div>
                  <h3 className="text-[#FFFFFF] font-semibold mb-1">{investor.name}</h3>
                  <p className="text-[#FFFFFF]/60 text-sm mb-3">{investor.focus}</p>
                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-accent/10 rounded-full">
                    <span className="text-accent text-xs font-medium">{investor.checkSize}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Venture Standard Badges */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-ink-medium rounded-full border border-ink-border">
                <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-[#FFFFFF]/80">Venture Standard Verified</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-ink-medium rounded-full border border-ink-border">
                <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                  <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                </svg>
                <span className="text-sm text-[#FFFFFF]/80">Data-Driven Intelligence</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-ink-medium rounded-full border border-ink-border">
                <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-[#FFFFFF]/80">Dallas-Native Network</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 lg:px-12 border-t border-ink-border">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <Link to="/">
              <Logo size="sm" />
            </Link>
            <p className="text-[#FFFFFF]/40 text-sm">
              &copy; 2026 zScale Capital. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/" className="text-[#FFFFFF]/60 hover:text-accent transition-colors text-sm">
                Home
              </Link>
              <Link to="https://zscalecapital.com/startup-readiness-audit/" className="text-[#FFFFFF]/60 hover:text-accent transition-colors text-sm">
                IRI Assessment
              </Link>
            </div>
          </div>
        </footer>
      </div>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
        onOpenDiagnostic={handleOpenDiagnostic}
      />

      <DiagnosticModal
        isOpen={showDiagnosticModal}
        onClose={handleCloseDiagnostic}
        onComplete={handleDiagnosticComplete}
        prefilledData={capturedLeadData || undefined}
      />
    </>
  );
};
