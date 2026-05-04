import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { TOOL_DEFINITIONS, type ToolKey } from '../data/tool-definitions';
import { joinToolWaitlist } from '../lib/tool-waitlist';

interface Props {
  toolKey: ToolKey;
}

export default function ToolPlaceholderPage({ toolKey }: Props) {
  const tool = TOOL_DEFINITIONS[toolKey];
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || loading) return;
    setLoading(true);
    await joinToolWaitlist(email, toolKey);
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>{tool.title} | zScale Capital</title>
        <meta name="description" content={tool.subtitle} />
      </Helmet>

      <section className="relative min-h-screen flex items-center pt-[120px] pb-20 bg-black">
        {/* Grid background */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(1, 249, 198, 0.04) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(1, 249, 198, 0.04) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black z-0" />

        <div className="relative z-[1] max-w-[700px] mx-auto px-6 max-md:px-4 w-full">
          {/* Back link */}
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-[#707070] hover:text-accent transition-colors no-underline mb-10"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to home
          </Link>

          {/* Status badge */}
          <span className="inline-block px-3 py-1 text-xs font-semibold text-accent bg-accent/10 border border-accent/20 rounded-full mb-6">
            {tool.status}
          </span>

          <h1 className="text-[32px] md:text-[42px] lg:text-[52px] font-bold text-white leading-[1.1] tracking-tight mb-5">
            {tool.title}
          </h1>
          <p className="text-base md:text-lg text-[#A0A0A0] leading-relaxed mb-10 max-w-[600px]">
            {tool.subtitle}
          </p>

          {/* Features */}
          <div className="bg-[#111111] border border-[#1A1A1A] rounded-xl p-6 mb-10">
            <p className="text-xs uppercase tracking-[0.15em] text-[#707070] font-semibold mb-4">
              What to expect
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {tool.features.map((feature) => (
                <div key={feature} className="flex items-start gap-2.5">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent shrink-0 mt-0.5">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <span className="text-sm text-[#C0C0C0]">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Waitlist form */}
          <div className="bg-[#111111] border border-[#1A1A1A] rounded-xl p-6">
            {submitted ? (
              <div className="text-center py-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent mx-auto mb-3">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <p className="text-white font-medium mb-1">You're on the list</p>
                <p className="text-sm text-[#707070]">We will notify you when {tool.title.toLowerCase()} launches.</p>
              </div>
            ) : (
              <>
                <p className="text-white font-medium mb-1">Get notified at launch</p>
                <p className="text-sm text-[#707070] mb-4">Join the waitlist and be the first to access this tool.</p>
                <form onSubmit={handleSubmit} className="flex gap-3 max-sm:flex-col">
                  <input
                    type="email"
                    required
                    placeholder="you@institution.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-black border border-[#2A2A2A] rounded-lg text-white text-sm placeholder:text-[#555] focus:outline-none focus:border-accent/50 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 bg-accent text-black text-sm font-semibold rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-50 shrink-0"
                  >
                    {loading ? 'Joining...' : 'Join waitlist'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
