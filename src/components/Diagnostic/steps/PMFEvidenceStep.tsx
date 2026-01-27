import { StepProps } from '../types';
import { OptionCard } from '../shared/OptionCard';

const VALIDATION_OPTIONS = [
  { id: 'interviews', label: 'Customer Interviews', icon: '💬', description: 'Validated through user research' },
  { id: 'pilots', label: 'Pilot Customers', icon: '🎯', description: 'Running early pilots' },
  { id: 'recurring', label: 'Recurring Revenue', icon: '💰', description: 'Paying customers returning' },
  { id: 'retention', label: 'Strong Retention', icon: '📈', description: 'High retention metrics' },
];

const MONETIZATION_OPTIONS = [
  { id: 'subscription', label: 'Subscription', icon: '🔄', description: 'Monthly/annual recurring' },
  { id: 'usage', label: 'Usage-Based', icon: '📊', description: 'Pay per use pricing' },
  { id: 'enterprise', label: 'Enterprise', icon: '🏢', description: 'Large contract sales' },
  { id: 'marketplace', label: 'Marketplace', icon: '🛒', description: 'Transaction fees' },
  { id: 'figuring-out', label: 'Still Figuring Out', icon: '🤔', description: 'Exploring options' },
];

const ADVANTAGE_OPTIONS = [
  { id: 'proprietary', label: 'Proprietary Tech', icon: '🔬', description: 'Unique technology moat' },
  { id: 'network', label: 'Network Effects', icon: '🌐', description: 'Value grows with users' },
  { id: 'first-mover', label: 'First-Mover', icon: '🚀', description: 'Early market entry' },
  { id: 'domain', label: 'Domain Expertise', icon: '🎓', description: 'Deep industry knowledge' },
  { id: 'partnerships', label: 'Partnerships', icon: '🤝', description: 'Strategic alliances' },
];

export const PMFEvidenceStep = ({ answers, updateAnswers }: StepProps) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-2">
          Product-Market Fit
        </h2>
        <p className="text-neutral-400">
          Tell us about your validation and go-to-market strategy
        </p>
      </div>

      {/* Q1: Customer Validation */}
      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-3">
          How have you validated customer demand?
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {VALIDATION_OPTIONS.map((option) => (
            <OptionCard
              key={option.id}
              icon={option.icon}
              label={option.label}
              description={option.description}
              selected={answers.pmfCustomerValidation === option.id}
              onClick={() => updateAnswers({ pmfCustomerValidation: option.id })}
            />
          ))}
        </div>
      </div>

      {/* Q2: Monetization */}
      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-3">
          What's your monetization approach?
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {MONETIZATION_OPTIONS.map((option) => (
            <OptionCard
              key={option.id}
              icon={option.icon}
              label={option.label}
              description={option.description}
              selected={answers.pmfRevenueModel === option.id}
              onClick={() => updateAnswers({ pmfRevenueModel: option.id })}
            />
          ))}
        </div>
      </div>

      {/* Q3: Competitive Advantage */}
      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-3">
          What's your competitive advantage?
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ADVANTAGE_OPTIONS.map((option) => (
            <OptionCard
              key={option.id}
              icon={option.icon}
              label={option.label}
              description={option.description}
              selected={answers.pmfCompetitiveAdvantage === option.id}
              onClick={() => updateAnswers({ pmfCompetitiveAdvantage: option.id })}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
