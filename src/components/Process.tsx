export const Process = () => {
  const steps = [
    {
      number: '01',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
      ),
      title: 'Audit',
      description:
        'Identify blind spots in your fundability using local VC standards and Dallas market criteria.',
      features: [
        'UTD Blackstone readiness',
        'SMU Cox criteria',
        'Capital Factory scoring',
      ],
    },
    {
      number: '02',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          />
        </svg>
      ),
      title: 'Optimize',
      description:
        'Fix gaps with our standardized decks and financial models tailored to North Texas investors.',
      features: [
        'Dallas pitch templates',
        'Revenue-focused models',
        'Local market sizing',
      ],
    },
    {
      number: '03',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      title: 'Deploy',
      description:
        'Approach the right investors at the right time with confidence and warm introductions.',
      features: [
        'Angel network intros',
        'Timing optimization',
        'Follow-up strategy',
      ],
    },
  ];

  return (
    <section id="process" className="py-32 px-12 max-w-[1400px] mx-auto max-md:py-16 max-md:px-6">
      <div className="reveal text-center max-w-[700px] mx-auto mb-20">
        <div className="text-xs font-bold uppercase tracking-[0.15em] text-accent-teal mb-4">
          Our Process
        </div>
        <h2 className="text-h2 mb-4 text-brand-teal">
          Bridging the Gap to Capital
        </h2>
        <p className="text-body opacity-70">
          We simplify the path to fundraising through a 3-step readiness system designed
          specifically for North Texas founders.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-8 max-lg:grid-cols-2 max-md:grid-cols-1">
        {steps.map((step, index) => (
          <div
            key={step.number}
            className={`reveal reveal-delay-${index + 1} relative bg-white rounded-[20px] p-10 transition-all duration-400 ease-out-quart border border-dark-green/8 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(40,54,24,0.12)]`}
          >
            <div className="absolute top-8 right-8 font-display text-[4rem] italic text-light-sage/40 leading-none">
              {step.number}
            </div>

            <div className="w-14 h-14 bg-gradient-to-br from-accent-teal to-accent-teal-dark rounded-[14px] flex items-center justify-center mb-6 text-white">
              <div className="w-7 h-7">{step.icon}</div>
            </div>

            <h3 className="text-h3 mb-3 text-brand-teal">
              {step.title}
            </h3>

            <p className="text-body opacity-70 mb-6">
              {step.description}
            </p>

            <ul className="list-none">
              {step.features.map((feature, idx) => (
                <li
                  key={idx}
                  className={`flex items-center gap-2 text-sm py-2 ${
                    idx === 0 ? '' : 'border-t border-dark-green/6'
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-4 h-4 text-accent-teal flex-shrink-0"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};
