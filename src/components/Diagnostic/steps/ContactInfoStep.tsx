import { StepProps, STAGES } from '../types';
import { SectorSelector } from '../shared/SectorSelector';
import { OptionCard } from '../shared/OptionCard';

export const ContactInfoStep = ({
  contact,
  updateContact,
  hasPrefilledContact,
}: StepProps) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-2">
          Let's Get Started
        </h2>
        <p className="text-neutral-400">
          {hasPrefilledContact
            ? 'Confirm your details and tell us about your company'
            : 'Tell us about yourself and your company'}
        </p>
      </div>

      {/* Pre-filled contact confirmation */}
      {hasPrefilledContact ? (
        <div className="p-4 bg-ink-medium border border-ink-border rounded-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-accent/20 border border-accent/30 rounded-lg flex items-center justify-center">
              <svg
                className="w-4 h-4 text-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <span className="text-sm text-neutral-400">
              We already have your contact info
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="px-4 py-3 bg-ink-light border border-ink-border rounded-lg">
              <p className="text-xs text-neutral-500 mb-1">First Name</p>
              <p className="text-white font-medium">{contact.firstName}</p>
            </div>
            <div className="px-4 py-3 bg-ink-light border border-ink-border rounded-lg">
              <p className="text-xs text-neutral-500 mb-1">Last Name</p>
              <p className="text-white font-medium">{contact.lastName || '—'}</p>
            </div>
            <div className="col-span-2 px-4 py-3 bg-ink-light border border-ink-border rounded-lg">
              <p className="text-xs text-neutral-500 mb-1">Email</p>
              <p className="text-white font-medium">{contact.email}</p>
            </div>
          </div>

          {/* Company name field (may not be prefilled) */}
          {!contact.companyName && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                value={contact.companyName}
                onChange={(e) => updateContact({ companyName: e.target.value })}
                placeholder="Acme Inc."
                className="w-full px-4 py-3 bg-ink-light border border-ink-border rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
              />
            </div>
          )}
          {contact.companyName && (
            <div className="mt-3 px-4 py-3 bg-ink-light border border-ink-border rounded-lg">
              <p className="text-xs text-neutral-500 mb-1">Company</p>
              <p className="text-white font-medium">{contact.companyName}</p>
            </div>
          )}
        </div>
      ) : (
        /* Contact fields for non-prefilled users */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              First Name *
            </label>
            <input
              type="text"
              value={contact.firstName}
              onChange={(e) => updateContact({ firstName: e.target.value })}
              placeholder="John"
              className="w-full px-4 py-3 bg-ink-medium border border-ink-border rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Last Name *
            </label>
            <input
              type="text"
              value={contact.lastName}
              onChange={(e) => updateContact({ lastName: e.target.value })}
              placeholder="Doe"
              className="w-full px-4 py-3 bg-ink-medium border border-ink-border rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Email *
            </label>
            <input
              type="email"
              value={contact.email}
              onChange={(e) => updateContact({ email: e.target.value })}
              placeholder="john@company.com"
              className="w-full px-4 py-3 bg-ink-medium border border-ink-border rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Company Name *
            </label>
            <input
              type="text"
              value={contact.companyName}
              onChange={(e) => updateContact({ companyName: e.target.value })}
              placeholder="Acme Inc."
              className="w-full px-4 py-3 bg-ink-medium border border-ink-border rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
            />
          </div>
        </div>
      )}

      {/* Sector selection */}
      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-3">
          Industry Sector *
        </label>
        <SectorSelector
          selected={contact.sector}
          onSelect={(sector) => updateContact({ sector })}
        />
      </div>

      {/* Stage selection */}
      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-3">
          Current Stage *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {STAGES.map((stage) => (
            <OptionCard
              key={stage.id}
              label={stage.label}
              description={stage.description}
              selected={contact.stage === stage.id}
              onClick={() => updateContact({ stage: stage.id })}
              compact
            />
          ))}
        </div>
      </div>
    </div>
  );
};
