import { IRIContactInfo } from '../types';

interface ContactStepProps {
  contact: IRIContactInfo;
  updateContact: (updates: Partial<IRIContactInfo>) => void;
}

const sectors = [
  { value: 'saas', label: 'SaaS / Software', icon: '💻' },
  { value: 'fintech', label: 'FinTech', icon: '💳' },
  { value: 'healthcare', label: 'Healthcare / BioTech', icon: '🏥' },
  { value: 'ecommerce', label: 'E-Commerce / Retail', icon: '🛒' },
  { value: 'proptech', label: 'PropTech / Real Estate', icon: '🏢' },
  { value: 'other', label: 'Other', icon: '🚀' },
];

export const ContactStep = ({ contact, updateContact }: ContactStepProps) => {
  return (
    <div className="space-y-6">
      <p className="text-neutral-400 text-center mb-8">
        Let's start by getting to know you and your company.
      </p>

      {/* Name row */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            First Name
          </label>
          <input
            type="text"
            value={contact.firstName}
            onChange={(e) => updateContact({ firstName: e.target.value })}
            placeholder="John"
            className="w-full px-4 py-3 bg-ink-medium border border-ink-border rounded-xl text-white placeholder-neutral-600 focus:border-[#01F9C6] focus:outline-none focus:ring-1 focus:ring-[#01F9C6]/50 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            Last Name
          </label>
          <input
            type="text"
            value={contact.lastName}
            onChange={(e) => updateContact({ lastName: e.target.value })}
            placeholder="Founder"
            className="w-full px-4 py-3 bg-ink-medium border border-ink-border rounded-xl text-white placeholder-neutral-600 focus:border-[#01F9C6] focus:outline-none focus:ring-1 focus:ring-[#01F9C6]/50 transition-colors"
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-2">
          Email
        </label>
        <input
          type="email"
          value={contact.email}
          onChange={(e) => updateContact({ email: e.target.value })}
          placeholder="john@startup.com"
          className="w-full px-4 py-3 bg-ink-medium border border-ink-border rounded-xl text-white placeholder-neutral-600 focus:border-[#01F9C6] focus:outline-none focus:ring-1 focus:ring-[#01F9C6]/50 transition-colors"
        />
      </div>

      {/* Company Name */}
      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-2">
          Company Name
        </label>
        <input
          type="text"
          value={contact.companyName}
          onChange={(e) => updateContact({ companyName: e.target.value })}
          placeholder="Your Startup Inc."
          className="w-full px-4 py-3 bg-ink-medium border border-ink-border rounded-xl text-white placeholder-neutral-600 focus:border-[#01F9C6] focus:outline-none focus:ring-1 focus:ring-[#01F9C6]/50 transition-colors"
        />
      </div>

      {/* Sector Selection */}
      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-3">
          Industry Sector
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {sectors.map((sector) => (
            <button
              key={sector.value}
              type="button"
              onClick={() => updateContact({ sector: sector.value })}
              className={`
                flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left
                ${
                  contact.sector === sector.value
                    ? 'bg-[#01F9C6]/10 border-[#01F9C6] shadow-[0_0_15px_rgba(1,249,198,0.2)]'
                    : 'bg-ink-medium border-ink-border hover:border-[#01F9C6]/50'
                }
              `}
            >
              <span className="text-2xl">{sector.icon}</span>
              <span
                className={`text-sm font-medium ${
                  contact.sector === sector.value ? 'text-[#01F9C6]' : 'text-white'
                }`}
              >
                {sector.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
