import { StepProps } from '../types';
import { OptionCard } from '../shared/OptionCard';

const CURRENT_NETWORK_OPTIONS = [
  { id: 'none', label: 'None', icon: '🆕', description: 'Starting fresh' },
  { id: '1-2', label: '1-2 Mentors', icon: '👥', description: 'Some informal guidance' },
  { id: 'small-board', label: 'Small Board', icon: '📋', description: 'Formal advisory board' },
  { id: 'established', label: 'Established Network', icon: '🌐', description: 'Strong advisor relationships' },
];

const EXPERTISE_NEEDED_OPTIONS = [
  { id: 'domain', label: 'Domain Expert', icon: '🎓', description: 'Industry knowledge' },
  { id: 'fundraising', label: 'Fundraising', icon: '💸', description: 'Capital connections' },
  { id: 'gtm-sales', label: 'GTM/Sales', icon: '📈', description: 'Revenue growth' },
  { id: 'technical', label: 'Technical', icon: '⚙️', description: 'Engineering guidance' },
  { id: 'operations', label: 'Operations', icon: '📋', description: 'Scaling operations' },
];

const ENGAGEMENT_STYLE_OPTIONS = [
  { id: 'monthly', label: 'Monthly Check-ins', icon: '📅', description: 'Regular touchpoints' },
  { id: 'on-demand', label: 'On-Demand', icon: '📞', description: 'As-needed support' },
  { id: 'deep-strategic', label: 'Deep Strategic', icon: '🎯', description: 'Hands-on involvement' },
  { id: 'board-level', label: 'Board-Level', icon: '🏛️', description: 'Governance role' },
];

export const AdvisorNetworkStep = ({ answers, updateAnswers }: StepProps) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-2">
          Advisor Network
        </h2>
        <p className="text-neutral-400">
          Tell us about your current network and what you're looking for
        </p>
      </div>

      {/* Q1: Current Network */}
      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-3">
          Current advisors?
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {CURRENT_NETWORK_OPTIONS.map((option) => (
            <OptionCard
              key={option.id}
              icon={option.icon}
              label={option.label}
              description={option.description}
              selected={answers.advisorCurrentNetwork === option.id}
              onClick={() => updateAnswers({ advisorCurrentNetwork: option.id })}
            />
          ))}
        </div>
      </div>

      {/* Q2: Expertise Needed */}
      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-3">
          Expertise needed?
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {EXPERTISE_NEEDED_OPTIONS.map((option) => (
            <OptionCard
              key={option.id}
              icon={option.icon}
              label={option.label}
              description={option.description}
              selected={answers.advisorNeededExpertise === option.id}
              onClick={() => updateAnswers({ advisorNeededExpertise: option.id })}
            />
          ))}
        </div>
      </div>

      {/* Q3: Engagement Style */}
      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-3">
          Engagement style?
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ENGAGEMENT_STYLE_OPTIONS.map((option) => (
            <OptionCard
              key={option.id}
              icon={option.icon}
              label={option.label}
              description={option.description}
              selected={answers.advisorEngagementStyle === option.id}
              onClick={() => updateAnswers({ advisorEngagementStyle: option.id })}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
