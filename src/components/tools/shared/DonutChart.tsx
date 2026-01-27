import { useEffect, useState } from 'react';

interface DonutSegment {
  value: number;
  color: string;
  label: string;
}

interface DonutChartProps {
  segments: DonutSegment[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  centerValue?: string;
  animated?: boolean;
}

export const DonutChart = ({
  segments,
  size = 200,
  strokeWidth = 32,
  centerLabel,
  centerValue,
  animated = true,
}: DonutChartProps) => {
  const [animationProgress, setAnimationProgress] = useState(animated ? 0 : 1);

  // Calculate total value
  const total = segments.reduce((sum, seg) => sum + seg.value, 0);

  // Calculate dimensions
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Animate on mount
  useEffect(() => {
    if (!animated) return;

    const duration = 1000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimationProgress(eased);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [animated]);

  // Calculate segment offsets
  let accumulatedPercentage = 0;
  const segmentData = segments.map((segment) => {
    const percentage = (segment.value / total) * 100;
    const offset = accumulatedPercentage;
    accumulatedPercentage += percentage;

    return {
      ...segment,
      percentage,
      offset,
      dashArray: (percentage / 100) * circumference,
      dashOffset: -(offset / 100) * circumference,
    };
  });

  return (
    <div className="relative inline-flex flex-col items-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1C1C1E"
          strokeWidth={strokeWidth}
        />

        {/* Segment circles */}
        {segmentData.map((segment, index) => (
          <circle
            key={index}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={segment.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${segment.dashArray * animationProgress} ${circumference}`}
            strokeDashoffset={segment.dashOffset * animationProgress}
            style={{
              transition: animated ? 'stroke-dasharray 1s ease-out' : 'none',
            }}
          />
        ))}
      </svg>

      {/* Center content */}
      {(centerLabel || centerValue) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {centerValue && (
            <span className="text-3xl font-bold text-white">{centerValue}</span>
          )}
          {centerLabel && <span className="text-neutral-500 text-sm">{centerLabel}</span>}
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 flex flex-wrap justify-center gap-4">
        {segments.map((segment, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: segment.color }}
            />
            <span className="text-sm text-neutral-400">
              {segment.label} ({segment.value.toFixed(2)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
