interface TrafficLightProps {
  status: 'green' | 'yellow' | 'red';
  label?: string;
  score?: number;
  maxScore?: number;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: {
    dot: 'w-3 h-3',
    text: 'text-sm',
  },
  md: {
    dot: 'w-4 h-4',
    text: 'text-base',
  },
  lg: {
    dot: 'w-6 h-6',
    text: 'text-lg',
  },
};

const statusColors = {
  green: {
    bg: 'bg-green-500',
    text: 'text-green-600',
    glow: 'shadow-[0_0_8px_rgba(16,185,129,0.5)]',
  },
  yellow: {
    bg: 'bg-yellow-500',
    text: 'text-yellow-600',
    glow: 'shadow-[0_0_8px_rgba(245,158,11,0.5)]',
  },
  red: {
    bg: 'bg-red-500',
    text: 'text-red-600',
    glow: 'shadow-[0_0_8px_rgba(239,68,68,0.5)]',
  },
};

export const TrafficLight = ({
  status,
  label,
  score,
  maxScore,
  showPercentage = false,
  size = 'md',
}: TrafficLightProps) => {
  const colors = statusColors[status];
  const sizes = sizeClasses[size];

  const percentage = maxScore ? Math.round((score || 0) / maxScore * 100) : null;

  return (
    <div className="flex items-center gap-2">
      {/* Dot indicator */}
      <div
        className={`${sizes.dot} ${colors.bg} ${colors.glow} rounded-full animate-pulse-dot`}
      />

      {/* Label */}
      {label && <span className={`${sizes.text} text-neutral-900`}>{label}</span>}

      {/* Score/Percentage */}
      {(score !== undefined || showPercentage) && (
        <span className={`${sizes.text} font-medium ${colors.text}`}>
          {showPercentage && percentage !== null ? `${percentage}%` : score}
          {maxScore && !showPercentage && `/${maxScore}`}
        </span>
      )}
    </div>
  );
};

// Progress bar variant
interface TrafficLightBarProps {
  status: 'green' | 'yellow' | 'red';
  percentage: number;
  label: string;
  showLabel?: boolean;
}

export const TrafficLightBar = ({
  status,
  percentage,
  label,
  showLabel = true,
}: TrafficLightBarProps) => {
  const colors = {
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-neutral-600">{label}</span>
          <span className="text-sm font-medium text-neutral-900">{percentage}%</span>
        </div>
      )}
      <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${colors[status]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
