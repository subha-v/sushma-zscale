import { useState } from 'react';
import { Link } from 'react-router-dom';

interface FormData {
  fullName: string;
  email: string;
  organization: string;
  organizationType: string;
  countyRegion: string;
  phone: string;
  goals: string;
}

const initialFormData: FormData = {
  fullName: '',
  email: '',
  organization: '',
  organizationType: '',
  countyRegion: '',
  phone: '',
  goals: '',
};

const organizationTypes = [
  'EDC',
  'Community College',
  'Site Selection Consultant',
  'Workforce Board',
  'Chamber of Commerce',
  'Regional Planning Council',
  'Other',
];

const whyCards = [
  {
    title: 'See Your Region\'s Data',
    description:
      'We\'ll pull live data for your specific county or region so you can see exactly what zScale looks like with the information that matters to you.',
  },
  {
    title: 'No Pressure, No Sales Pitch',
    description:
      'This is a working session, not a sales call. We walk through the platform, answer your questions, and let you decide if it fits your workflow.',
  },
  {
    title: 'Customized to Your Needs',
    description:
      'Whether you\'re focused on business retention, RFP responses, workforce data, or board reporting, we\'ll tailor the demo to your priorities.',
  },
  {
    title: 'Get Trial Access',
    description:
      'After the demo, qualified organizations receive complimentary trial access so you can explore the platform with your own team before committing.',
  },
];

export const DemoPage = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate submission
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1000);
  };

  return (
    <>
      {/* ==================== HERO ==================== */}
      <section className="relative pt-[140px] pb-16 bg-black overflow-hidden">
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
          <h1 className="text-[32px] md:text-[44px] lg:text-[52px] font-bold text-white leading-[1.1] tracking-tight mb-5">
            Request a Personalized Demo
          </h1>
          <p className="text-lg md:text-xl text-[#C0C0C0] leading-relaxed max-w-[650px] mx-auto">
            See how zScale can streamline economic development research for your
            region. We'll walk through the platform using your county's actual data.
          </p>
        </div>
      </section>

      {/* ==================== FORM + SIDEBAR ==================== */}
      <section className="py-16 md:py-20 bg-[#0D0D0D]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid lg:grid-cols-[1fr_380px] gap-10 lg:gap-14 items-start">
            {/* ---- Form Column ---- */}
            <div className="bg-[#111111] border border-[#1A1A1A] rounded-xl p-6 md:p-8">
              {success ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg
                      className="w-8 h-8 text-accent"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Demo Request Received
                  </h3>
                  <p className="text-[#A0A0A0] mb-6 max-w-md mx-auto">
                    Thank you, {formData.fullName.split(' ')[0]}! We'll send you a
                    calendar invite within 24 hours to schedule your personalized demo.
                  </p>
                  <Link
                    to="/"
                    className="inline-block px-6 py-3 bg-accent text-black font-semibold rounded-lg hover:bg-accent/90 transition-colors text-sm"
                  >
                    Back to Home
                  </Link>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-white mb-6">
                    Tell Us About Your Organization
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm text-[#A0A0A0] mb-1.5">
                        Full Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full bg-black border border-[#1A1A1A] rounded-lg px-4 py-3 text-white text-sm placeholder-[#555] focus:border-accent focus:outline-none transition-colors"
                        placeholder="Jane Smith"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm text-[#A0A0A0] mb-1.5">
                        Email <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-black border border-[#1A1A1A] rounded-lg px-4 py-3 text-white text-sm placeholder-[#555] focus:border-accent focus:outline-none transition-colors"
                        placeholder="jane@organization.com"
                      />
                    </div>

                    {/* Organization */}
                    <div>
                      <label className="block text-sm text-[#A0A0A0] mb-1.5">
                        Organization <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="organization"
                        required
                        value={formData.organization}
                        onChange={handleChange}
                        className="w-full bg-black border border-[#1A1A1A] rounded-lg px-4 py-3 text-white text-sm placeholder-[#555] focus:border-accent focus:outline-none transition-colors"
                        placeholder="Dallas Regional Chamber"
                      />
                    </div>

                    {/* Organization Type */}
                    <div>
                      <label className="block text-sm text-[#A0A0A0] mb-1.5">
                        Organization Type <span className="text-red-400">*</span>
                      </label>
                      <select
                        name="organizationType"
                        required
                        value={formData.organizationType}
                        onChange={handleChange}
                        className="w-full bg-black border border-[#1A1A1A] rounded-lg px-4 py-3 text-white text-sm focus:border-accent focus:outline-none transition-colors appearance-none"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23A0A0A0' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 14px center',
                        }}
                      >
                        <option value="" disabled>
                          Select type...
                        </option>
                        {organizationTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* County/Region */}
                    <div>
                      <label className="block text-sm text-[#A0A0A0] mb-1.5">
                        County / Region
                      </label>
                      <input
                        type="text"
                        name="countyRegion"
                        value={formData.countyRegion}
                        onChange={handleChange}
                        className="w-full bg-black border border-[#1A1A1A] rounded-lg px-4 py-3 text-white text-sm placeholder-[#555] focus:border-accent focus:outline-none transition-colors"
                        placeholder="Dallas County / North Texas"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm text-[#A0A0A0] mb-1.5">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-black border border-[#1A1A1A] rounded-lg px-4 py-3 text-white text-sm placeholder-[#555] focus:border-accent focus:outline-none transition-colors"
                        placeholder="(555) 123-4567"
                      />
                    </div>

                    {/* Goals */}
                    <div>
                      <label className="block text-sm text-[#A0A0A0] mb-1.5">
                        What are you hoping to accomplish with zScale?
                      </label>
                      <textarea
                        name="goals"
                        rows={4}
                        value={formData.goals}
                        onChange={handleChange}
                        className="w-full bg-black border border-[#1A1A1A] rounded-lg px-4 py-3 text-white text-sm placeholder-[#555] focus:border-accent focus:outline-none transition-colors resize-none"
                        placeholder="e.g., Faster RFP responses, business retention tracking, board reporting..."
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 bg-accent text-black font-semibold rounded-lg hover:bg-accent/90 transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <svg
                            className="animate-spin w-4 h-4"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        'Request Demo'
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>

            {/* ---- Sidebar Column ---- */}
            <div className="space-y-6">
              {/* What to Expect */}
              <div className="bg-[#111111] border border-[#1A1A1A] rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-5">What to Expect</h3>
                <div className="space-y-5">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-accent/10 text-accent text-sm font-bold flex items-center justify-center flex-shrink-0">
                      1
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">Confirmation email within 24 hours</p>
                      <p className="text-[#A0A0A0] text-xs mt-0.5">
                        We'll send a calendar invite with available time slots.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-accent/10 text-accent text-sm font-bold flex items-center justify-center flex-shrink-0">
                      2
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">30-minute personalized demo</p>
                      <p className="text-[#A0A0A0] text-xs mt-0.5">
                        We'll walk through the platform using data from your region.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-accent/10 text-accent text-sm font-bold flex items-center justify-center flex-shrink-0">
                      3
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">Q&A and use case discussion</p>
                      <p className="text-[#A0A0A0] text-xs mt-0.5">
                        Ask anything about data sources, pricing, or implementation.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-accent/10 text-accent text-sm font-bold flex items-center justify-center flex-shrink-0">
                      4
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">Trial access for your team</p>
                      <p className="text-[#A0A0A0] text-xs mt-0.5">
                        Qualified organizations get complimentary trial access after the demo.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Questions */}
              <div className="bg-[#111111] border border-[#1A1A1A] rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-2">Questions?</h3>
                <p className="text-[#A0A0A0] text-sm mb-3">
                  Prefer to reach out directly? Send us an email and we'll get back to
                  you within one business day.
                </p>
                <a
                  href="mailto:info@zscalecapital.com"
                  className="text-accent text-sm font-medium hover:underline"
                >
                  info@zscalecapital.com
                </a>
              </div>

              {/* Testimonial */}
              <div className="bg-[#111111] border border-[#1A1A1A] rounded-xl p-6">
                <svg
                  className="w-8 h-8 text-accent/30 mb-3"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11h4v10H0z" />
                </svg>
                <p className="text-[#C0C0C0] text-sm leading-relaxed italic mb-4">
                  "The demo showed us exactly how zScale could streamline our RFP
                  responses. We went from days of research to minutes."
                </p>
                <div>
                  <p className="text-white text-sm font-medium">
                    Economic Development Director
                  </p>
                  <p className="text-[#A0A0A0] text-xs">Texas EDC</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== WHY REQUEST A DEMO ==================== */}
      <section className="py-16 md:py-20 bg-black border-t border-[#1A1A1A]">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-[28px] md:text-[36px] font-bold text-white text-center mb-4">
            Why Request a Demo
          </h2>
          <p className="text-[#A0A0A0] text-base md:text-lg text-center mb-12 max-w-[600px] mx-auto">
            A 30-minute conversation that could save your team hundreds of hours.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyCards.map((card) => (
              <div
                key={card.title}
                className="bg-[#111111] border border-[#1A1A1A] rounded-xl p-6"
              >
                <h3 className="text-white font-semibold text-base mb-3">
                  {card.title}
                </h3>
                <p className="text-[#A0A0A0] text-sm leading-relaxed">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== BOTTOM CTA ==================== */}
      <section className="py-14 bg-[#0D0D0D] border-t border-[#1A1A1A]">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <p className="text-[#A0A0A0] text-sm">
            Not ready for a demo?{' '}
            <Link to="/solutions" className="text-accent hover:underline">
              Explore our solutions
            </Link>{' '}
            or{' '}
            <Link to="/about" className="text-accent hover:underline">
              learn more about zScale
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
};
