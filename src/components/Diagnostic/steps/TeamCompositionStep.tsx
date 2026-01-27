import { StepProps } from '../types';
import { OptionCard } from '../shared/OptionCard';

const COFOUNDER_OPTIONS = [
  { id: 'solo', label: 'Solo', icon: '👤', description: 'Single founder' },
  { id: 'tech-business', label: 'Tech + Business', icon: '👥', description: 'Balanced duo' },
  { id: 'multiple-tech', label: 'Multiple Tech', icon: '💻', description: 'Technical team' },
  { id: 'multiple-business', label: 'Multiple Business', icon: '📈', description: 'Business-focused team' },
  { id: 'looking', label: 'Looking', icon: '🔍', description: 'Seeking co-founders' },
];

const KEY_HIRES_OPTIONS = [
  { id: 'engineering', label: 'Engineering Lead', icon: '⚙️', description: 'Technical leadership' },
  { id: 'sales', label: 'Sales Lead', icon: '📞', description: 'Revenue driver' },
  { id: 'marketing', label: 'Marketing Lead', icon: '📣', description: 'Growth & brand' },
  { id: 'finance', label: 'Finance', icon: '💰', description: 'Financial operations' },
  { id: 'founding-only', label: 'Founding Only', icon: '🌱', description: 'Just founders so far' },
];

const ADVISORY_GAPS_OPTIONS = [
  { id: 'connections', label: 'Industry Connections', icon: '🔗', description: 'Network access' },
  { id: 'fundraising', label: 'Fundraising', icon: '💸', description: 'Capital raising help' },
  { id: 'operations', label: 'Operations', icon: '📋', description: 'Scaling processes' },
  { id: 'legal', label: 'Legal', icon: '⚖️', description: 'Legal guidance' },
  { id: 'gtm', label: 'GTM Strategy', icon: '🎯', description: 'Go-to-market planning' },
];

export const TeamCompositionStep = ({ answers, updateAnswers }: StepProps) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-2">
          Team Structure
        </h2>
        <p className="text-neutral-400">
          Tell us about your team and where you need support
        </p>
      </div>

      {/* Q1: Co-founder Structure */}
      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-3">
          Co-founder structure?
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {COFOUNDER_OPTIONS.map((option) => (
            <OptionCard
              key={option.id}
              icon={option.icon}
              label={option.label}
              description={option.description}
              selected={answers.teamCoFounders === option.id}
              onClick={() => updateAnswers({ teamCoFounders: option.id })}
            />
          ))}
        </div>
      </div>

      {/* Q2: Key Hires */}
      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-3">
          Key hires made?
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {KEY_HIRES_OPTIONS.map((option) => (
            <OptionCard
              key={option.id}
              icon={option.icon}
              label={option.label}
              description={option.description}
              selected={answers.teamKeyHires === option.id}
              onClick={() => updateAnswers({ teamKeyHires: option.id })}
            />
          ))}
        </div>
      </div>

      {/* Q3: Advisory Gaps */}
      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-3">
          Where do you need help?
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ADVISORY_GAPS_OPTIONS.map((option) => (
            <OptionCard
              key={option.id}
              icon={option.icon}
              label={option.label}
              description={option.description}
              selected={answers.teamAdvisoryGaps === option.id}
              onClick={() => updateAnswers({ teamAdvisoryGaps: option.id })}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
