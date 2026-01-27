import { useEffect, useState } from 'react';

interface IRICalculatingViewProps {
  onComplete: () => void;
}

const stages = [
  { text: 'Analyzing PMF Evidence...', delay: 0 },
  { text: 'Evaluating Unit Economics...', delay: 600 },
  { text: 'Assessing Team Composition...', delay: 1200 },
  { text: 'Reviewing Infrastructure...', delay: 1800 },
  { text: 'Calculating Capital Position...', delay: 2400 },
  { text: 'Generating Your Score...', delay: 3000 },
];

export const IRICalculatingView = ({ onComplete }: IRICalculatingViewProps) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 70);

    // Stage text animation
    stages.forEach((stage, index) => {
      setTimeout(() => {
        setCurrentStage(index);
      }, stage.delay);
    });

    // Complete after all stages
    const completeTimeout = setTimeout(() => {
      onComplete();
    }, 3800);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(completeTimeout);
    };
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] py-12">
      {/* Animated gauge circle */}
      <div className="relative mb-8">
        <svg width="160" height="160" viewBox="0 0 160 160" className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke="#1a1a1b"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke="#01F9C6"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 70}
            strokeDashoffset={2 * Math.PI * 70 * (1 - progress / 100)}
            className="transition-all duration-200 ease-out"
          />
          {/* Glow effect */}
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke="#01F9C6"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 70}
            strokeDashoffset={2 * Math.PI * 70 * (1 - progress / 100)}
            opacity={0.3}
            filter="blur(6px)"
            className="transition-all duration-200 ease-out"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-[#01F9C6]">{progress}%</span>
        </div>
      </div>

      {/* Stage text */}
      <div className="text-center">
        <p className="text-lg text-white font-medium mb-2 h-7">
          {stages[currentStage]?.text || 'Calculating...'}
        </p>
        <p className="text-sm text-neutral-500">
          Applying zScale's proprietary scoring model
        </p>
      </div>

      {/* Processing indicators */}
      <div className="flex gap-2 mt-6">
        {stages.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index <= currentStage ? 'bg-[#01F9C6]' : 'bg-ink-medium'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
