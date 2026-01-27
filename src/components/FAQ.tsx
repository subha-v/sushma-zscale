import { useState, useEffect, useRef } from 'react';

export const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const faqs = [
    {
      question: 'How do I find Dallas advisors?',
      answer:
        'Complete our startup readiness audit to get matched with Dallas-based industry experts who align with your sector and stage. Our network includes executives across manufacturing, healthcare, fintech, deep tech, and more.',
    },
    {
      question: 'What areas do you service?',
      answer:
        'We serve the entire North Texas startup ecosystem including Dallas, Plano, Richardson, Frisco, Fort Worth, and surrounding areas. Our resources and advisor network are specifically tailored to the DFW metroplex.',
    },
    {
      question: 'How is advisor equity calculated?',
      answer:
        'Use our equity calculator for Dallas market-standard recommendations. We factor in company stage, advisor involvement level, and expertise type to provide fair equity allocation guidelines based on local norms.',
    },
    {
      question: 'Why choose zScale?',
      answer:
        'We offer a data-driven system versus generic consulting. Our structured audits, industry-specific matching, and deep local network provide actionable insights tailored to the Dallas ecosystem rather than one-size-fits-all advice.',
    },
    {
      question: 'How long does the audit take?',
      answer:
        "The complete startup readiness assessment takes 45-60 minutes. You'll receive your personalized readiness score, tailored improvement recommendations, and advisor matching suggestions immediately upon completion.",
    },
    {
      question: 'Is zScale for early-stage startups?',
      answer:
        "Yes! We specialize in idea-to-Series A Dallas startups. Whether you're pre-revenue or have early traction, our resources and advisor network are designed to help you navigate each stage of your fundraising journey.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Handle visibility with IntersectionObserver to avoid conflicts with React state updates
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0', 10);
            setVisibleItems((prev) => new Set(prev).add(index));
          }
        });
      },
      { rootMargin: '-80px 0px', threshold: 0.1 }
    );

    itemRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="faq" className="py-24 px-6 lg:px-12 bg-ink max-md:py-16">
      <div className="max-w-3xl mx-auto">
        <div className="reveal text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-xs mb-6">
            <span className="text-accent font-mono">FAQ</span>
          </div>
          <h2 className="text-h2 text-white">
            Quick Answers
          </h2>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <div
              key={index}
              ref={(el) => (itemRefs.current[index] = el)}
              data-index={index}
              className={`card-skeuomorphic overflow-hidden transition-all duration-500 ease-out ${
                visibleItems.has(index)
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              } ${activeIndex === index ? 'border-accent/30' : ''}`}
              style={{ transitionDelay: `${Math.min(index, 4) * 0.1}s` }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-6 bg-transparent border-none text-white font-medium text-left cursor-pointer transition-colors duration-300 hover:text-accent"
              >
                {faq.question}
                <span className="w-6 h-6 relative flex-shrink-0 ml-4">
                  <span
                    className="absolute w-3 h-0.5 bg-accent top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-300"
                  />
                  <span
                    className={`absolute w-0.5 h-3 bg-accent top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 ${
                      activeIndex === index ? 'rotate-90' : ''
                    }`}
                  />
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-out-quart ${
                  activeIndex === index ? 'max-h-[300px]' : 'max-h-0'
                }`}
              >
                <p className="px-6 pb-6 text-neutral-400 leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
