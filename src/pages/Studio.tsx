import { Link } from 'react-router-dom';

const services = [
  {
    name: 'GTM Bot',
    value: '$5,000',
    description: 'Go-to-market strategy & lead generation',
    icon: '🚀',
  },
  {
    name: 'Equity Architect',
    value: '$2,500',
    description: 'Cap table modeling & equity planning',
    icon: '📊',
  },
  {
    name: 'Pitch Deck Generator',
    value: '$3,000',
    description: 'Investor-ready pitch deck content',
    icon: '🎯',
  },
  {
    name: 'Investor Match',
    value: '$2,000',
    description: 'Find the right investors for your startup',
    icon: '🤝',
  },
  {
    name: 'Competitive Intel',
    value: '$3,000',
    description: 'Market research & competitor analysis',
    icon: '🔍',
  },
  {
    name: 'Financial Model',
    value: '$4,000',
    description: '3-year projections & unit economics',
    icon: '💰',
  },
];

export function Studio() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero Section */}
      <section className="pt-28 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-accent">
              Venture OS
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-4">
            AI-Powered Startup Services
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
            Replace expensive consultants with our AI-powered toolkit. 
            Get the same deliverables for a fraction of the cost.
          </p>
          <div className="inline-block bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 rounded-full px-6 py-3">
            <span className="text-2xl font-bold text-accent">$19,500+</span>
            <span className="text-gray-400 ml-2">in consultant value</span>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">Service Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.name}
                className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-cyan-500/50 transition-colors"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                <p className="text-gray-400 mb-4">{service.description}</p>
                <div className="text-accent font-bold">{service.value} value</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-gray-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-cyan-400 font-bold">1</span>
              </div>
              <h3 className="font-semibold mb-2">Apply</h3>
              <p className="text-gray-400 text-sm">Tell us about your startup and what you need</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-cyan-400 font-bold">2</span>
              </div>
              <h3 className="font-semibold mb-2">Match</h3>
              <p className="text-gray-400 text-sm">We assess fit and discuss partnership terms</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-cyan-400 font-bold">3</span>
              </div>
              <h3 className="font-semibold mb-2">Build</h3>
              <p className="text-gray-400 text-sm">Access Venture OS and start building together</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Build?</h2>
          <p className="text-gray-400 mb-8">
            We partner with technical founders in Texas. You build the product, we handle the rest.
          </p>
          <Link
            to="/apply"
            className="inline-block bg-accent text-ink font-semibold px-8 py-4 rounded-lg hover:opacity-90 transition-opacity"
          >
            Apply to Build with zScale
          </Link>
        </div>
      </section>
    </div>
  );
}