import { StepProps } from '../types';
import { OptionCard } from '../shared/OptionCard';

const RUNWAY_OPTIONS = [
  { id: 'under-6', label: 'Under 6 months', icon: '⚠️', description: 'Immediate funding need' },
  { id: '6-12', label: '6-12 months', icon: '📅', description: 'Planning next raise' },
  { id: '12-18', label: '12-18 months', icon: '✅', description: 'Comfortable runway' },
  { id: '18-plus', label: '18+ months', icon: '🏦', description: 'Strong cash position' },
];

const FUNDRAISING_OPTIONS = [
  { id: 'exploring', label: 'Exploring', icon: '🔍', description: 'Learning about options' },
  { id: 'preparing', label: 'Preparing', icon: '📋', description: 'Building materials' },
  { id: 'conversations', label: 'In Conversations', icon: '💬', description: 'Actively talking to investors' },
  { id: 'term-sheet', label: 'Term Sheet', icon: '📝', description: 'Negotiating terms' },
];

const METRICS_OPTIONS = [
  { id: 'mrr-arr', label: 'MRR/ARR', icon: '📊', description: 'Tracking recurring revenue' },
  { id: 'cac-ltv', label: 'CAC/LTV', icon: '💵', description: 'Customer economics' },
  { id: 'churn', label: 'Churn', icon: '📉', description: 'Retention tracking' },
  { id: 'unit-economics', label: 'Unit Economics', icon: '🧮', description: 'Per-unit profitability' },
  { id: 'building', label: 'Still Building', icon: '🔧', description: 'Pre-metrics stage' },
];

export const FinancialModelingStep = ({ answers, updateAnswers }: StepProps) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-2">
          Financial Readiness
        </h2>
        <p className="text-neutral-400">
          Help us understand your financial position and fundraising plans
        </p>
      </div>

      {/* Q1: Runway */}
      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-3">
          Current runway?
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {RUNWAY_OPTIONS.map((option) => (
            <OptionCard
              key={option.id}
              icon={option.icon}
              label={option.label}
              description={option.description}
              selected={answers.financialRunway === option.id}
              onClick={() => updateAnswers({ financialRunway: option.id })}
            />
          ))}
        </div>
      </div>

      {/* Q2: Fundraising Stage */}
      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-3">
          Fundraising stage?
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {FUNDRAISING_OPTIONS.map((option) => (
            <OptionCard
              key={option.id}
              icon={option.icon}
              label={option.label}
              description={option.description}
              selected={answers.financialFundraisingReady === option.id}
              onClick={() => updateAnswers({ financialFundraisingReady: option.id })}
            />
          ))}
        </div>
      </div>

      {/* Q3: Metrics Tracking */}
      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-3">
          Metrics tracking?
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {METRICS_OPTIONS.map((option) => (
            <OptionCard
              key={option.id}
              icon={option.icon}
              label={option.label}
              description={option.description}
              selected={answers.financialMetrics === option.id}
              onClick={() => updateAnswers({ financialMetrics: option.id })}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
