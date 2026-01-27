export const Resources = () => {
  const resources = [
    {
      tag: 'Directory',
      title: 'The Dallas Investor Tier-List',
      description:
        'Complete ranking of North Texas investors by sector, check size, and founder-friendliness.',
      link: '#',
      linkText: 'Download Free',
    },
    {
      tag: 'Calculator',
      title: 'The Equity Calculator',
      description:
        'Interactive tool to determine fair advisor equity based on Dallas market standards.',
      link: '#',
      linkText: 'Use Calculator',
    },
    {
      tag: 'Checklist',
      title: 'Accelerator Prep-Checklist',
      description:
        'Exactly what UTD Blackstone, SMU Cox, and Capital Factory look for in applications.',
      link: '#',
      linkText: 'Download Free',
    },
  ];

  return (
    <section
      id="resources"
      className="py-24 px-12 bg-gradient-to-b from-off-white to-[#E8E7E3] max-md:py-16 max-md:px-6"
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="reveal text-center max-w-[700px] mx-auto mb-20">
          <div className="text-xs font-bold uppercase tracking-[0.15em] text-accent-teal mb-4">
            Founder's Toolkit
          </div>
          <h2 className="font-display text-[clamp(2rem,5vw,3rem)] font-normal leading-[1.2] mb-4">
            The Founder's Survival Kit
          </h2>
          <p className="text-lg opacity-70">
            Ground Zero Edition - Everything you need to navigate the Dallas startup
            ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6 max-lg:grid-cols-2 max-md:grid-cols-1">
          {resources.map((resource, index) => (
            <a
              key={index}
              href={resource.link}
              className={`reveal reveal-delay-${index + 1} relative bg-white rounded-[20px] p-8 no-underline text-dark-green transition-all duration-400 ease-out-quart overflow-hidden border border-dark-green/6 flex flex-col hover:-translate-y-1.5 hover:shadow-[0_16px_48px_rgba(40,54,24,0.1)] before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-accent-teal before:scale-x-0 before:origin-left before:transition-transform before:duration-400 before:ease-out-quart hover:before:scale-x-100`}
            >
              <span className="inline-block py-1.5 px-3 bg-off-white rounded-full text-xs font-semibold uppercase tracking-wider text-accent-teal mb-5 w-fit">
                {resource.tag}
              </span>

              <h3 className="font-display text-2xl font-normal mb-3 leading-[1.3]">
                {resource.title}
              </h3>

              <p className="text-[0.9375rem] opacity-70 leading-[1.6] flex-grow">
                {resource.description}
              </p>

              <span className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-accent-teal group">
                {resource.linkText}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
