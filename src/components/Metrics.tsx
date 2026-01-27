export const Metrics = () => {
  return (
    <section className="py-24 px-6 lg:px-12 bg-ink-light text-white relative overflow-hidden max-md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 max-w-7xl mx-auto relative z-[1]">
        <div className="reveal">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-xs mb-6">
            <span className="w-1.5 h-1.5 bg-accent-green rounded-full animate-pulse" />
            <span className="text-neutral-400 font-mono">LIVE DATA</span>
          </div>
          <h2 className="text-h2 leading-tight mb-4">
            North Texas Venture Pulse
          </h2>
          <p className="text-body text-neutral-400">
            We've spent hundreds of hours mapping the North Texas landscape so you can
            spend your time building your company, not chasing the wrong leads.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="reveal reveal-delay-1 card-skeuomorphic p-6 transition-all duration-300 hover:border-accent/30 hover:-translate-y-1">
            <div className="text-5xl font-bold text-accent leading-none mb-2">
              45+
            </div>
            <div className="text-sm text-neutral-400">Local Investors Tracked</div>
          </div>
          <div className="reveal reveal-delay-2 card-skeuomorphic p-6 transition-all duration-300 hover:border-accent/30 hover:-translate-y-1">
            <div className="text-5xl font-bold text-accent leading-none mb-2">
              12+
            </div>
            <div className="text-sm text-neutral-400">Industry Sectors Mapped</div>
          </div>
          <div className="reveal reveal-delay-3 card-skeuomorphic p-6 transition-all duration-300 hover:border-accent/30 hover:-translate-y-1">
            <div className="text-5xl font-bold text-accent leading-none mb-2">
              $150M+
            </div>
            <div className="text-sm text-neutral-400">
              Local Early-Stage Capital
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
