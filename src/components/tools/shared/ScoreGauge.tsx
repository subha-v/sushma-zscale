import { useEffect, useState } from 'react';

interface ScoreGaugeProps {
  score: number;
  maxScore?: number;
  size?: number;
  strokeWidth?: number;
  animated?: boolean;
  title?: string;
  subtitle?: string;
}

export const ScoreGauge = ({
  score,
  maxScore = 100,
  size = 200,
  strokeWidth = 16,
  animated = true,
  title,
  subtitle,
}: ScoreGaugeProps) => {
  const [displayScore, setDisplayScore] = useState(animated ? 0 : score);
  const [isAnimating, setIsAnimating] = useState(animated);

  // Calculate dimensions
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min((displayScore / maxScore) * 100, 100);
  const offset = circumference - (percentage / 100) * circumference;

  // Determine color based on score percentage
  const getColor = (pct: number): string => {
    if (pct >= 71) return '#10B981'; // Green
    if (pct >= 41) return '#F59E0B'; // Yellow
    return '#EF4444'; // Red
  };

  const color = getColor(percentage);

  // Animate score on mount
  useEffect(() => {
    if (!animated) return;

    const duration = 1500;
    const startTime = Date.now();
    const startScore = 0;
    const endScore = score;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentScore = Math.round(startScore + (endScore - startScore) * eased);

      setDisplayScore(currentScore);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    requestAnimationFrame(animate);
  }, [score, animated]);

  // Update display score when score prop changes (after initial animation)
  useEffect(() => {
    if (!isAnimating) {
      setDisplayScore(score);
    }
  }, [score, isAnimating]);

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
          stroke="#E5E5E5"
          strokeWidth={strokeWidth}
        />

        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: animated ? 'stroke-dashoffset 1.5s ease-out' : 'none',
          }}
        />

        {/* Glow effect */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth / 2}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          opacity={0.3}
          filter="blur(8px)"
          style={{
            transition: animated ? 'stroke-dashoffset 1.5s ease-out' : 'none',
          }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-5xl font-bold transition-colors duration-300"
          style={{ color }}
        >
          {displayScore}
        </span>
        <span className="text-neutral-400 text-sm">/ {maxScore}</span>
      </div>

      {/* Title and subtitle below gauge */}
      {(title || subtitle) && (
        <div className="mt-4 text-center">
          {title && (
            <h3 className="text-xl font-semibold" style={{ color }}>
              {title}
            </h3>
          )}
          {subtitle && <p className="text-neutral-600 text-sm mt-1">{subtitle}</p>}
        </div>
      )}
    </div>
  );
};
