import { ActivityStatus } from '../../../types/tools';

interface ActivePulseProps {
  status: ActivityStatus;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig = {
  active: {
    color: 'bg-green-500',
    glow: 'shadow-[0_0_8px_rgba(34,197,94,0.6)]',
    label: 'Active',
    description: 'Deal closed in last 30 days',
  },
  moderate: {
    color: 'bg-yellow-500',
    glow: 'shadow-[0_0_8px_rgba(234,179,8,0.6)]',
    label: 'Moderate',
    description: 'Activity in last 90 days',
  },
  quiet: {
    color: 'bg-red-500',
    glow: 'shadow-[0_0_8px_rgba(239,68,68,0.6)]',
    label: 'Quiet',
    description: 'No recent activity',
  },
};

const sizeConfig = {
  sm: 'w-2 h-2',
  md: 'w-3 h-3',
  lg: 'w-4 h-4',
};

export const ActivePulse = ({
  status,
  showLabel = false,
  size = 'md',
}: ActivePulseProps) => {
  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-2" title={config.description}>
      <div className="relative">
        {/* Glow ring */}
        <div
          className={`absolute inset-0 ${sizeConfig[size]} ${config.color} rounded-full opacity-40 animate-ping`}
        />
        {/* Solid dot */}
        <div
          className={`relative ${sizeConfig[size]} ${config.color} ${config.glow} rounded-full`}
        />
      </div>
      {showLabel && (
        <span className="text-sm text-neutral-400">{config.label}</span>
      )}
    </div>
  );
};

// Legend component for explaining status indicators
export const ActivePulseLegend = () => {
  return (
    <div className="flex flex-wrap gap-6 text-sm">
      {(Object.entries(statusConfig) as [ActivityStatus, typeof statusConfig.active][]).map(
        ([status, config]) => (
          <div key={status} className="flex items-center gap-2">
            <div className={`w-3 h-3 ${config.color} rounded-full`} />
            <span className="text-neutral-400">
              <strong className="text-white">{config.label}:</strong>{' '}
              {config.description}
            </span>
          </div>
        )
      )}
    </div>
  );
};
