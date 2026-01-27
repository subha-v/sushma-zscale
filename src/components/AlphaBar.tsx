export const AlphaBar = () => {
  const dataPoints = [
    { value: '$150M+', label: 'Capital Mapped' },
    { value: '45+', label: 'Tier-1 Investors' },
    { value: '12', label: 'Global Exits Tracked' },
    { value: '85%', label: 'Founder Match Rate' },
    { value: '24hr', label: 'Avg Response Time' },
    { value: '3x', label: 'Faster to Term Sheet' },
  ];

  // Duplicate for seamless loop
  const allDataPoints = [...dataPoints, ...dataPoints];

  return (
    <section className="py-6 bg-ink-light border-y border-ink-border overflow-hidden">
      <div className="relative">
        {/* Gradient Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-ink-light to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-ink-light to-transparent z-10" />

        {/* Scrolling Content */}
        <div className="flex animate-marquee">
          {allDataPoints.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-8 px-8 whitespace-nowrap"
            >
              <div className="flex items-center gap-3">
                <span className="text-accent font-mono font-bold text-lg">
                  {item.value}
                </span>
                <span className="text-neutral-500 text-sm uppercase tracking-wider">
                  {item.label}
                </span>
              </div>
              <span className="text-ink-border">•</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
