interface EquitySliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  label: string;
  valueLabel?: string;
  onChange: (value: number) => void;
}

export const EquitySlider = ({
  value,
  min,
  max,
  step = 1,
  label,
  valueLabel,
  onChange,
}: EquitySliderProps) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-3">
        <label className="font-medium text-white">{label}</label>
        <span className="text-lg font-semibold text-accent">
          {valueLabel || value}
        </span>
      </div>
      <div className="relative">
        {/* Custom track */}
        <div className="h-2 bg-ink-medium rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-150"
            style={{ width: `${percentage}%` }}
          />
        </div>
        {/* Native range input (styled with opacity 0, positioned over track) */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          style={{ margin: 0 }}
        />
        {/* Custom thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-accent rounded-full shadow-md pointer-events-none transition-all duration-150"
          style={{ left: `calc(${percentage}% - 10px)` }}
        />
      </div>
      {/* Min/Max labels */}
      <div className="flex justify-between mt-2 text-xs text-neutral-500">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};

// Select dropdown styled to match
interface EquitySelectProps<T extends string> {
  value: T;
  options: { value: T; label: string }[];
  label: string;
  onChange: (value: T) => void;
}

export function EquitySelect<T extends string>({
  value,
  options,
  label,
  onChange,
}: EquitySelectProps<T>) {
  return (
    <div className="w-full">
      <label className="block font-medium text-white mb-3">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as T)}
          className="w-full py-3 px-4 pr-10 bg-ink-medium border border-ink-border rounded-xl text-white appearance-none cursor-pointer transition-colors focus:outline-none focus:border-accent hover:border-neutral-600"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {/* Custom dropdown arrow */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            className="w-5 h-5 text-neutral-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
