interface Benchmark {
  label: string;
  description: string;
  minEquity: number;
  maxEquity: number;
}

interface BenchmarkComparisonProps {
  benchmarks: Benchmark[];
  recommendedEquity: number;
  maxDisplayEquity?: number;
}

export const BenchmarkComparison = ({
  benchmarks,
  recommendedEquity,
  maxDisplayEquity = 1.5,
}: BenchmarkComparisonProps) => {
  // Calculate bar widths as percentages
  const getBarWidth = (value: number) => {
    return Math.min((value / maxDisplayEquity) * 100, 100);
  };

  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-white mb-4">Market Benchmarks</h3>

      {/* Your recommendation */}
      <div className="p-4 bg-accent/10 rounded-xl border border-accent/20">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium text-accent">Your Recommended Equity</span>
          <span className="font-bold text-accent">{recommendedEquity.toFixed(2)}%</span>
        </div>
        <div className="h-3 bg-ink-medium rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-500"
            style={{ width: `${getBarWidth(recommendedEquity)}%` }}
          />
        </div>
      </div>

      {/* Benchmark bars */}
      {benchmarks.map((benchmark, index) => (
        <div key={index} className="group">
          <div className="flex justify-between items-center mb-2">
            <div>
              <span className="font-medium text-white">{benchmark.label}</span>
              <p className="text-xs text-neutral-500">{benchmark.description}</p>
            </div>
            <span className="text-sm text-neutral-400">
              {benchmark.minEquity.toFixed(2)}% - {benchmark.maxEquity.toFixed(2)}%
            </span>
          </div>
          <div className="relative h-3 bg-ink-medium rounded-full overflow-hidden">
            {/* Range bar */}
            <div
              className="absolute h-full bg-neutral-600 rounded-full transition-all duration-500"
              style={{
                left: `${getBarWidth(benchmark.minEquity)}%`,
                width: `${getBarWidth(benchmark.maxEquity - benchmark.minEquity)}%`,
              }}
            />
          </div>
        </div>
      ))}

      {/* Scale labels */}
      <div className="flex justify-between text-xs text-neutral-500 pt-2 border-t border-ink-border">
        <span>0%</span>
        <span>{(maxDisplayEquity / 2).toFixed(1)}%</span>
        <span>{maxDisplayEquity.toFixed(1)}%+</span>
      </div>
    </div>
  );
};

// Simple comparison card
interface ComparisonCardProps {
  title: string;
  value: string;
  description: string;
  highlight?: boolean;
}

export const ComparisonCard = ({
  title,
  value,
  description,
  highlight = false,
}: ComparisonCardProps) => {
  return (
    <div
      className={`p-4 rounded-xl border ${
        highlight
          ? 'bg-accent/10 border-accent/20'
          : 'bg-ink-medium border-ink-border'
      }`}
    >
      <p
        className={`text-sm font-medium ${
          highlight ? 'text-accent' : 'text-neutral-400'
        }`}
      >
        {title}
      </p>
      <p
        className={`text-2xl font-bold mt-1 ${
          highlight ? 'text-accent' : 'text-white'
        }`}
      >
        {value}
      </p>
      <p className="text-xs text-neutral-500 mt-1">{description}</p>
    </div>
  );
};
