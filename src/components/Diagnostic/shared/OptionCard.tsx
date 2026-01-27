import { OptionCardProps } from '../types';

export const OptionCard = ({
  icon,
  label,
  description,
  selected,
  onClick,
  compact = false,
}: OptionCardProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        group w-full text-left rounded-xl border-2 transition-all duration-200
        ${compact ? 'p-4' : 'p-5'}
        ${
          selected
            ? 'bg-accent/10 border-accent scale-[1.02] shadow-glow'
            : 'bg-ink-medium border-ink-border hover:border-accent/50 hover:bg-ink-light'
        }
      `}
    >
      <div className={`flex items-${description ? 'start' : 'center'} gap-3`}>
        {icon && (
          <div
            className={`
              flex-shrink-0 rounded-xl flex items-center justify-center text-xl
              ${compact ? 'w-10 h-10' : 'w-12 h-12'}
              ${selected ? 'bg-accent/20' : 'bg-ink-light'}
            `}
          >
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h4
            className={`
              font-semibold truncate
              ${selected ? 'text-accent' : 'text-white'}
              ${compact ? 'text-sm' : 'text-base'}
            `}
          >
            {label}
          </h4>
          {description && (
            <p className="text-sm text-neutral-500 mt-0.5 line-clamp-2">
              {description}
            </p>
          )}
        </div>
        {selected && (
          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-accent flex items-center justify-center">
            <svg
              className="w-3 h-3 text-ink"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        )}
      </div>
    </button>
  );
};
