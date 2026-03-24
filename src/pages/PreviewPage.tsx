import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const dashboardFeatures = [
  {
    title: "AI-Powered Q&A",
    description:
      "Ask any question about programs, employers, or labor markets. Get evidence-based answers in seconds.",
    stats: "30+ data tools",
  },
  {
    title: "Program Scorecards",
    description:
      "ROI scoring, HB8 compliance tracking, and curriculum gap analysis across all academic programs.",
    stats: "180+ programs",
  },
  {
    title: "Employer Intelligence",
    description:
      "Hiring signals, partnership opportunities, and talent pipeline mapping for your region.",
    stats: "55+ employers",
  },
  {
    title: "Predictive Analytics",
    description:
      "Salary forecasts, emerging skills trends, and program success predictions powered by BLS data.",
    stats: "5-year outlook",
  },
];

const sampleData = [
  { program: "Computer Science BS", salary: "$71,500", employment: "94%", growth: "+18%" },
  { program: "Nursing BSN", salary: "$73,200", employment: "98%", growth: "+12%" },
  { program: "Mechanical Engineering BS", salary: "$65,800", employment: "91%", growth: "+8%" },
  { program: "Data Science MS", salary: "$82,400", employment: "96%", growth: "+24%" },
  { program: "Cybersecurity BS", salary: "$68,900", employment: "95%", growth: "+21%" },
  { program: "Business Administration BBA", salary: "$52,100", employment: "87%", growth: "+5%" },
];

export const PreviewPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    institution: "",
    roleTitle: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      // Insert lead into Supabase
      const { error: insertError } = await supabase
        .from("demo_leads")
        .insert({
          full_name: formData.fullName,
          email: formData.email,
          institution: formData.institution,
          role_title: formData.roleTitle,
          source: "preview_page",
        });

      if (insertError) {
        console.warn("Lead capture insert failed:", insertError);
        // Continue even if insert fails — don't block access
      }

      // Grant access and redirect
      sessionStorage.setItem("zscale_authenticated", "true");
      sessionStorage.setItem("zscale_user", formData.email);
      navigate("/demo-login");
    } catch (err) {
      console.warn("Lead capture error:", err);
      // Still grant access on error — lead capture should never block the demo
      sessionStorage.setItem("zscale_authenticated", "true");
      sessionStorage.setItem("zscale_user", formData.email);
      navigate("/demo-login");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid =
    formData.fullName.trim() &&
    formData.email.trim() &&
    formData.institution.trim() &&
    formData.roleTitle.trim();

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(16,185,129,0.05)] to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-[rgba(16,185,129,0.1)] text-accent border border-accent/20 mb-6">
            Live Platform Preview
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            See the Dashboard Before You Buy
          </h1>
          <p className="text-xl text-[#A0A0A0] max-w-3xl mx-auto">
            Explore role-based dashboards, AI-powered analytics, and real
            workforce data. Enter your details below for instant access.
          </p>
        </div>
      </section>

      {/* What You'll See Inside */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-sm font-semibold tracking-widest uppercase text-accent mb-8 text-center">
          What You'll See Inside
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {dashboardFeatures.map((feature) => (
            <div
              key={feature.title}
              className="bg-[#111111] border border-[#1A1A1A] rounded-xl p-5"
            >
              <p className="text-accent text-xs font-semibold tracking-wider uppercase mb-3">
                {feature.stats}
              </p>
              <h3 className="text-base font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-[#A0A0A0] text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Lead Capture Form */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-lg mx-auto">
          <div className="bg-[#111111] border border-accent/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-2 text-center">
              Access the Live Dashboard
            </h2>
            <p className="text-[#A0A0A0] text-sm text-center mb-8">
              Your information is secure. Instant access — no sales call
              required.
            </p>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-6 text-center">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-[#A0A0A0] mb-1.5"
                >
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  placeholder="Dr. Sarah Mitchell"
                  className="w-full px-4 py-3 bg-black border border-[#1A1A1A] rounded-lg text-white placeholder-[#555] focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[#A0A0A0] mb-1.5"
                >
                  Work Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="sarah.mitchell@uta.edu"
                  className="w-full px-4 py-3 bg-black border border-[#1A1A1A] rounded-lg text-white placeholder-[#555] focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="institution"
                  className="block text-sm font-medium text-[#A0A0A0] mb-1.5"
                >
                  Institution / Organization
                </label>
                <input
                  id="institution"
                  type="text"
                  required
                  value={formData.institution}
                  onChange={(e) => handleChange("institution", e.target.value)}
                  placeholder="UT Arlington"
                  className="w-full px-4 py-3 bg-black border border-[#1A1A1A] rounded-lg text-white placeholder-[#555] focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="roleTitle"
                  className="block text-sm font-medium text-[#A0A0A0] mb-1.5"
                >
                  Role / Title
                </label>
                <input
                  id="roleTitle"
                  type="text"
                  required
                  value={formData.roleTitle}
                  onChange={(e) => handleChange("roleTitle", e.target.value)}
                  placeholder="Dean of Engineering"
                  className="w-full px-4 py-3 bg-black border border-[#1A1A1A] rounded-lg text-white placeholder-[#555] focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={!isFormValid || submitting}
                className="w-full py-3.5 bg-accent text-black font-semibold rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {submitting ? "Connecting..." : "Access the Live Dashboard"}
              </button>
            </form>

            <p className="text-[#555] text-xs text-center mt-4">
              By continuing, you agree to receive platform updates. Unsubscribe
              anytime.
            </p>
          </div>
        </div>
      </section>

      {/* Sample Data Teaser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-3">
            Sample: Program Outcomes Data
          </h2>
          <p className="text-[#A0A0A0] text-sm">
            Real salary and employment data from the live platform
          </p>
        </div>

        <div className="bg-[#111111] border border-[#1A1A1A] rounded-xl overflow-hidden max-w-3xl mx-auto">
          {/* Table Header */}
          <div className="grid grid-cols-4 gap-4 px-6 py-3 bg-[#0D0D0D] border-b border-[#1A1A1A] text-xs font-semibold text-[#707070] uppercase tracking-wider">
            <span>Program</span>
            <span className="text-right">Starting Salary</span>
            <span className="text-right">Employment Rate</span>
            <span className="text-right">Growth</span>
          </div>

          {/* Table Rows */}
          {sampleData.map((row) => (
            <div
              key={row.program}
              className="grid grid-cols-4 gap-4 px-6 py-3.5 border-b border-[#1A1A1A] last:border-b-0 hover:bg-white/[0.02] transition-colors"
            >
              <span className="text-white text-sm font-medium">
                {row.program}
              </span>
              <span className="text-accent text-sm text-right font-medium">
                {row.salary}
              </span>
              <span className="text-[#A0A0A0] text-sm text-right">
                {row.employment}
              </span>
              <span className="text-emerald-400 text-sm text-right">
                {row.growth}
              </span>
            </div>
          ))}

          {/* Blurred rows to hint at more data */}
          <div className="relative">
            <div className="grid grid-cols-4 gap-4 px-6 py-3.5 blur-[3px] select-none">
              <span className="text-white text-sm">Electrical Engineering BS</span>
              <span className="text-accent text-sm text-right">$64,200</span>
              <span className="text-[#A0A0A0] text-sm text-right">92%</span>
              <span className="text-emerald-400 text-sm text-right">+11%</span>
            </div>
            <div className="grid grid-cols-4 gap-4 px-6 py-3.5 blur-[3px] select-none">
              <span className="text-white text-sm">Social Work MSW</span>
              <span className="text-accent text-sm text-right">$48,900</span>
              <span className="text-[#A0A0A0] text-sm text-right">89%</span>
              <span className="text-emerald-400 text-sm text-right">+6%</span>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[#A0A0A0] text-sm font-medium bg-[#111111] px-4 py-1.5 rounded-full border border-[#1A1A1A]">
                180+ programs in live dashboard
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[#555] text-xs">
          <span className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            SAM.gov Registered
          </span>
          <span className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            Women-Owned Small Business
          </span>
          <span className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            Built for Texas Universities & EDCs
          </span>
          <span>UEI: DPKYDLDKEFG9</span>
          <span>CAGE: 1A0X9</span>
        </div>
      </section>
    </div>
  );
};
