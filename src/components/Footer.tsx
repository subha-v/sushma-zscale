import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Logo } from './Logo';
import { IRIModal } from './IRI';
import { GOOGLE_SCRIPT_URL, FORM_TYPES } from '../config/api';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isIRIOpen, setIsIRIOpen] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formType: FORM_TYPES.NEWSLETTER,
          email,
          source: 'footer-newsletter',
          timestamp: new Date().toISOString(),
        }),
      });
      setIsSubscribed(true);
      setEmail('');
    } catch {
      // Handle silently
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-ink text-white py-20 px-6 lg:px-12 max-md:py-12 border-t border-ink-border">
      {/* Newsletter Section */}
      <div className="max-w-7xl mx-auto mb-16">
        <div className="card-skeuomorphic p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-xs mb-4">
                <span className="text-accent font-mono">INTEL</span>
              </div>
              <h3 className="text-h3 text-white mb-2">Dallas Venture Intelligence</h3>
              <p className="text-neutral-400">
                Monthly insights on Dallas startup ecosystem, investor activity, and fundraising trends.
              </p>
            </div>
            <div>
              {isSubscribed ? (
                <div className="flex items-center gap-3 text-accent">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-medium">You're on the list. Watch your inbox.</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex gap-3 max-sm:flex-col">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 bg-ink-medium border border-ink-border rounded-lg text-white placeholder:text-neutral-600 focus:outline-none focus:border-accent transition-colors"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-accent text-ink rounded-lg font-medium hover:bg-accent-hover transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 max-w-7xl mx-auto mb-16">
        <div className="lg:col-span-2">
          <Link to="/" className="inline-block no-underline mb-4">
            <Logo size="sm" />
          </Link>
          <p className="text-neutral-400 text-sm leading-relaxed max-w-[320px] mb-6">
            The Venture Operating System for North Texas. Bridging the exit gap with
            institutional-grade tools, data, and mentorship.
          </p>
          <div className="flex gap-3">
            <a
              href="https://linkedin.com/company/zscale-capital"
              aria-label="LinkedIn"
              className="w-10 h-10 bg-ink-light border border-ink-border rounded-lg flex items-center justify-center text-neutral-400 transition-colors duration-300 hover:bg-accent hover:border-accent hover:text-ink"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-[18px] h-[18px]"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            <a
              href="https://x.com/zScaleCapital"
              aria-label="X (Twitter)"
              className="w-10 h-10 bg-ink-light border border-ink-border rounded-lg flex items-center justify-center text-neutral-400 transition-colors duration-300 hover:bg-accent hover:border-accent hover:text-ink"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-[18px] h-[18px]"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-6">
            Platform
          </h4>
          <ul className="list-none space-y-3">
            <li>
              <button
                onClick={() => setIsIRIOpen(true)}
                className="text-neutral-400 text-sm transition-colors duration-300 hover:text-accent bg-transparent border-none cursor-pointer p-0 text-left"
              >
                Investment Readiness Index
              </button>
            </li>
            <li>
              <Link
                to="/tools/equity-calculator"
                className="text-neutral-400 no-underline text-sm transition-colors duration-300 hover:text-accent"
              >
                Equity Calculator
              </Link>
            </li>
            <li>
              <Link
                to="/tools/accelerator-checklist"
                className="text-neutral-400 no-underline text-sm transition-colors duration-300 hover:text-accent"
              >
                Accelerator Prep
              </Link>
            </li>
            <li>
              <Link
                to="/tools/investor-tier-list"
                className="text-neutral-400 no-underline text-sm transition-colors duration-300 hover:text-accent"
              >
                Investor Tier-List
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-6">
            Intelligence
          </h4>
          <ul className="list-none space-y-3">
            <li>
              <Link
                to="/ecosystem-map"
                className="text-neutral-400 no-underline text-sm transition-colors duration-300 hover:text-accent"
              >
                2026 Ecosystem Map
              </Link>
            </li>
            <li>
              <a
                href="#exit-gap"
                className="text-neutral-400 no-underline text-sm transition-colors duration-300 hover:text-accent"
              >
                Dallas Exit Gap
              </a>
            </li>
            <li>
              <a
                href="#advisors"
                className="text-neutral-400 no-underline text-sm transition-colors duration-300 hover:text-accent"
              >
                Advisor Network
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-6">
            Coverage
          </h4>
          <ul className="list-none space-y-3">
            <li>
              <span className="text-neutral-400 text-sm">Dallas</span>
            </li>
            <li>
              <span className="text-neutral-400 text-sm">Fort Worth</span>
            </li>
            <li>
              <span className="text-neutral-400 text-sm">Plano</span>
            </li>
            <li>
              <span className="text-neutral-400 text-sm">Frisco</span>
            </li>
            <li>
              <span className="text-neutral-400 text-sm">Richardson</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex justify-between items-center pt-8 border-t border-ink-border max-w-7xl mx-auto max-md:flex-col max-md:gap-4 max-md:text-center">
        <p className="text-sm text-neutral-600">&copy; 2026 zScale Capital. All rights reserved.</p>
        <div className="flex gap-8">
          <a
            href="#"
            className="text-sm text-neutral-600 no-underline transition-colors duration-300 hover:text-accent"
          >
            Terms
          </a>
          <a
            href="#"
            className="text-sm text-neutral-600 no-underline transition-colors duration-300 hover:text-accent"
          >
            Privacy
          </a>
        </div>
      </div>

      {/* IRI Modal */}
      <IRIModal isOpen={isIRIOpen} onClose={() => setIsIRIOpen(false)} />
    </footer>
  );
};
