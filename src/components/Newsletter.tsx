import { FormEvent } from 'react';

export const Newsletter = () => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("Thanks for subscribing! We'll keep you updated on Dallas startup news.");
    e.currentTarget.reset();
  };

  return (
    <section className="py-32 px-12 text-center max-md:py-16 max-md:px-6">
      <div className="reveal max-w-[600px] mx-auto">
        <h2 className="font-display text-[clamp(2rem,5vw,2.75rem)] font-normal mb-4">
          Dallas Startup Weekly
        </h2>
        <p className="text-lg opacity-70 mb-10">
          Get the inside scoop on Dallas startup events, funding news, and founder
          resources delivered every Tuesday.
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex gap-3 max-w-[480px] mx-auto max-md:flex-col"
        >
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            required
            className="flex-1 py-4 px-6 font-body text-base border-2 border-dark-green/15 rounded-full bg-white text-dark-green transition-all duration-300 focus:outline-none focus:border-accent-teal focus:shadow-[0_0_0_4px_rgba(42,157,143,0.1)] placeholder:text-dark-green placeholder:opacity-40"
          />
          <button
            type="submit"
            className="py-4 px-8 bg-dark-green text-off-white font-body text-base font-semibold border-none rounded-full cursor-pointer transition-all duration-300 whitespace-nowrap hover:bg-accent-teal hover:scale-105"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
};
