interface AdvisorsProps {
  onOpenDiagnostic?: () => void;
}

export const Advisors = ({ onOpenDiagnostic }: AdvisorsProps) => {
  const advisors = [
    {
      initials: 'ME',
      title: 'Manufacturing Executive',
      location: 'Dallas-based',
      tags: ['2 Exits', 'Supply Chain Expert'],
    },
    {
      initials: 'HS',
      title: 'Healthcare SaaS Founder',
      location: 'Plano-based',
      tags: ['Series A', 'Regulatory Expert'],
    },
    {
      initials: 'TI',
      title: 'Tech Industry Veteran',
      location: 'Richardson-based',
      tags: ['15+ Years', 'AI/Robotics'],
    },
    {
      initials: 'LE',
      title: 'Legal Expert',
      location: 'Downtown Dallas',
      tags: ['Startup Law', 'IP Specialist'],
    },
    {
      initials: 'FE',
      title: 'Fintech Executive',
      location: 'Frisco-based',
      tags: ['3 Exits', 'Payment Systems'],
    },
    {
      initials: 'AE',
      title: 'Aerospace Engineer',
      location: 'Fort Worth-based',
      tags: ['Defense Contracts', 'Deep Tech'],
    },
  ];

  return (
    <section id="advisors" className="py-24 px-6 lg:px-12 bg-ink-light max-md:py-16">
      <div className="max-w-7xl mx-auto">
        <div className="reveal text-center max-w-[700px] mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-xs mb-6">
            <span className="text-accent font-mono">NETWORK</span>
          </div>
          <h2 className="text-h2 text-white mb-4">
            Dallas Advisor Network
          </h2>
          <p className="text-body-lg text-neutral-400">
            Meet some of the industry veterans building the North Texas startup ecosystem
            with us.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6 max-lg:grid-cols-2 max-md:grid-cols-1">
          {advisors.map((advisor, index) => (
            <div
              key={index}
              className={`reveal reveal-delay-${
                (index % 3) + 1
              } card-skeuomorphic p-7 transition-all duration-300 ease-out-quart hover:-translate-y-1 hover:border-accent/30`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-ink-medium border border-ink-border rounded-xl flex items-center justify-center font-display text-lg text-accent">
                  {advisor.initials}
                </div>
                <div>
                  <h4 className="text-base font-semibold mb-0.5 text-white">{advisor.title}</h4>
                  <span className="text-sm text-neutral-500">{advisor.location}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {advisor.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="py-1 px-2.5 bg-ink-medium border border-ink-border rounded-full text-xs font-medium text-neutral-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <a
                href="https://zscalecapital.com/startup-readiness-audit/"
                className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-accent text-ink text-sm font-semibold rounded-lg no-underline hover:bg-accent-hover transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  className="w-4 h-4 text-white"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Unlock via IRI
              </a>
            </div>
          ))}
        </div>

        {/* Find Your Advisor Match CTA */}
        <div className="reveal mt-12 text-center">
          <button
            onClick={onOpenDiagnostic}
            className="inline-flex items-center gap-3 px-8 py-4 bg-accent text-ink text-button font-semibold rounded-full hover:brightness-110 transition-all duration-300 hover:shadow-glow"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Find Your Advisor Match
          </button>
          <p className="text-sm text-neutral-500 mt-3">
            Take our 2-minute diagnostic to get matched with the right advisors
          </p>
        </div>
      </div>
    </section>
  );
};
