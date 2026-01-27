import { useState, FormEvent } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { GOOGLE_SCRIPT_URL, setPremiumStatus, getUserProgress } from '../config/api';

const ALPHA_PILLARS = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Sector Benchmarks',
    description: 'Compare against 200+ Dallas startups in your vertical. Get unfiltered valuation multiples and dilution forecasts.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: 'Cap Table Audit',
    description: 'Institutional-grade analysis of your equity structure. Identify red flags before investors do.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: 'Shadow Network Intros',
    description: 'Direct warm introductions to sector-specific advisors and Shadow Capital partners who write $2M+ checks.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
    title: 'Venture Math Roadmap',
    description: 'Your personalized path to institutional readiness. Track progress and get strategic recommendations.',
  },
];

const TESTIMONIALS = [
  {
    quote: "The warm introductions alone were worth 10x the membership. Closed our seed round with a zScale-connected investor.",
    name: "Sarah K.",
    title: "Founder, HealthTech Startup",
    result: "$2.1M Seed"
  },
  {
    quote: "Finally, benchmarks that actually reflect the Dallas market. Stopped underselling ourselves in negotiations.",
    name: "Marcus J.",
    title: "CEO, SaaS Platform",
    result: "3x Valuation"
  },
  {
    quote: "The advisor matching saved me months of networking. Found our board advisor in 2 weeks.",
    name: "David L.",
    title: "CTO, Aerospace Startup",
    result: "Board Advisor"
  },
];

export const Membership = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-fill from existing user data
  const userProgress = getUserProgress();
  if (userProgress.firstName && !firstName) setFirstName(userProgress.firstName);
  if (userProgress.lastName && !lastName) setLastName(userProgress.lastName);
  if (userProgress.email && !email) setEmail(userProgress.email);
  if (userProgress.company && !company) setCompany(userProgress.company);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        formType: 'alpha_membership',
        firstName,
        lastName,
        email,
        companyName: company,
        iriScore: userProgress.iriScore || '',
        source: 'membership-page',
        timestamp: new Date().toISOString(),
      };

      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      // Set premium status in localStorage
      setPremiumStatus(true);

      setIsSuccess(true);

      // Scroll to top of page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-ink pt-20">
        <div className="max-w-2xl mx-auto px-6 py-24 text-center">
          <div className="w-20 h-20 mx-auto mb-8 bg-accent/20 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">
            Welcome to the Inner Circle
          </h1>
          <p className="text-lg text-neutral-400 mb-8">
            Your Alpha Tier membership is now active. Check your email for your welcome package and next steps.
          </p>
          <div className="space-y-4">
            <Link
              to="/"
              className="inline-block px-8 py-4 bg-accent text-ink font-semibold rounded-xl hover:brightness-110 transition-all"
            >
              Access Your Alpha Dashboard
            </Link>
            <p className="text-sm text-neutral-500">
              All tools are now fully unlocked with institutional-grade insights.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Alpha Tier Membership | Institutional Access | zScale Capital</title>
        <meta
          name="description"
          content="Join the zScale Alpha Tier for institutional-grade startup tools, sector benchmarks, and warm introductions to Dallas investors and advisors."
        />
        <link rel="canonical" href="https://zscalecapital.com/membership" />
      </Helmet>

      <div className="min-h-screen bg-ink pt-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
          <div className="max-w-7xl mx-auto px-6 py-16 relative">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full text-sm mb-6">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-accent font-mono text-xs">INSTITUTIONAL_GRADE</span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Join the Alpha Tier
              </h1>

              <p className="text-xl text-neutral-400 mb-8">
                Stop guessing. Start operating with the same data institutional investors use.
                Get sector benchmarks, cap table audits, and warm introductions to the Dallas network.
              </p>

              <div className="flex items-center justify-center gap-4 text-sm text-neutral-500">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  50+ Active Members
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Dallas-Focused
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Curated Network
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Pillars Section */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-2 gap-6">
            {ALPHA_PILLARS.map((pillar) => (
              <div
                key={pillar.title}
                className="card-skeuomorphic p-6 border-l-4 border-l-accent"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0 text-accent">
                    {pillar.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{pillar.title}</h3>
                    <p className="text-neutral-400">{pillar.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            What Alpha Members Say
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((testimonial, index) => (
              <div key={index} className="card-skeuomorphic p-6">
                <div className="mb-4">
                  <span className="px-3 py-1 bg-accent/10 border border-accent/30 rounded-full text-xs text-accent font-medium">
                    {testimonial.result}
                  </span>
                </div>
                <p className="text-neutral-300 mb-4 italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold text-white">{testimonial.name}</p>
                  <p className="text-sm text-neutral-500">{testimonial.title}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Signup Form */}
        <section className="max-w-2xl mx-auto px-6 py-12">
          <div className="card-skeuomorphic p-8 border-2 border-accent/30">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-accent/10 border border-accent/30 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Join Alpha Tier Membership
              </h2>
              <p className="text-neutral-400">
                Get instant access to institutional-grade tools and the Dallas founder network.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="py-3 px-4 border border-ink-border rounded-xl bg-ink-medium text-white placeholder:text-neutral-500 focus:outline-none focus:border-accent"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="py-3 px-4 border border-ink-border rounded-xl bg-ink-medium text-white placeholder:text-neutral-500 focus:outline-none focus:border-accent"
                />
              </div>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full py-3 px-4 border border-ink-border rounded-xl bg-ink-medium text-white placeholder:text-neutral-500 focus:outline-none focus:border-accent"
              />
              <input
                type="text"
                placeholder="Company Name"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full py-3 px-4 border border-ink-border rounded-xl bg-ink-medium text-white placeholder:text-neutral-500 focus:outline-none focus:border-accent"
              />

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 bg-accent text-ink font-bold rounded-xl hover:brightness-110 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-glow"
              >
                {isSubmitting ? 'Processing...' : 'Join Alpha Tier Membership'}
              </button>

              <p className="text-xs text-neutral-500 text-center">
                By joining, you agree to receive updates about your membership and the Dallas startup ecosystem.
              </p>
            </form>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div className="card-skeuomorphic p-6">
              <h3 className="font-semibold text-white mb-2">What do I get with Alpha membership?</h3>
              <p className="text-neutral-400">
                Full access to all locked insights: dilution forecasts, cap table red flags, investor alignment analysis,
                and warm introductions to the Shadow Capital network and sector-specific advisors.
              </p>
            </div>
            <div className="card-skeuomorphic p-6">
              <h3 className="font-semibold text-white mb-2">Is this only for Dallas-based startups?</h3>
              <p className="text-neutral-400">
                Our benchmarks and network are Dallas-focused, but any founder seeking to raise in the DFW ecosystem can benefit.
              </p>
            </div>
            <div className="card-skeuomorphic p-6">
              <h3 className="font-semibold text-white mb-2">How do warm introductions work?</h3>
              <p className="text-neutral-400">
                Once you're an Alpha member, you can request introductions directly through the platform.
                We facilitate the intro and provide context to both parties.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
