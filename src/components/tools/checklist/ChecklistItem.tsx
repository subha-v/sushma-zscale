interface ChecklistItemProps {
  id: string;
  title: string;
  description: string;
  points: number;
  isChecked: boolean;
  onToggle: (id: string) => void;
}

export const ChecklistItem = ({
  id,
  title,
  description,
  points,
  isChecked,
  onToggle,
}: ChecklistItemProps) => {
  return (
    <label
      className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
        isChecked
          ? 'bg-brand-teal/5 border-brand-teal/30'
          : 'bg-white border-neutral-200 hover:border-neutral-300'
      }`}
    >
      {/* Custom checkbox */}
      <div className="relative flex-shrink-0 mt-0.5">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => onToggle(id)}
          className="sr-only"
        />
        <div
          className={`w-6 h-6 rounded-lg border-2 transition-all duration-200 flex items-center justify-center ${
            isChecked
              ? 'bg-brand-teal border-brand-teal'
              : 'border-neutral-300'
          }`}
        >
          {isChecked && (
            <svg
              className="w-4 h-4 text-white"
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
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4
            className={`font-medium transition-colors ${
              isChecked ? 'text-brand-teal' : 'text-neutral-900'
            }`}
          >
            {title}
          </h4>
          <span
            className={`flex-shrink-0 px-2 py-0.5 text-xs font-medium rounded-full ${
              isChecked
                ? 'bg-brand-teal text-white'
                : 'bg-neutral-100 text-neutral-500'
            }`}
          >
            +{points} pts
          </span>
        </div>
        <p className="text-sm text-neutral-500 mt-1">{description}</p>
      </div>
    </label>
  );
};
