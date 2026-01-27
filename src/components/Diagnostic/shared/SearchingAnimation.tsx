import { useEffect, useState } from 'react';

interface SearchingAnimationProps {
  onComplete: () => void;
}

const PHASES = [
  { text: 'Calculating IRI Score...', duration: 1000 },
  { text: 'Scanning Shadow Network...', duration: 1000 },
  { text: 'Matching sector advisors...', duration: 1000 },
  { text: 'Verifying institutional fit...', duration: 600 },
];

export const SearchingAnimation = ({ onComplete }: SearchingAnimationProps) => {
  const [currentPhase, setCurrentPhase] = useState(0);

  useEffect(() => {
    let phaseIndex = 0;
    let timeoutId: ReturnType<typeof setTimeout>;

    const advancePhase = () => {
      phaseIndex++;
      if (phaseIndex < PHASES.length) {
        setCurrentPhase(phaseIndex);
        timeoutId = setTimeout(advancePhase, PHASES[phaseIndex].duration);
      } else {
        onComplete();
      }
    };

    timeoutId = setTimeout(advancePhase, PHASES[0].duration);

    return () => clearTimeout(timeoutId);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center py-16">
      {/* Verification Pending Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full text-xs mb-8">
        <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
        <span className="text-amber-400 font-mono uppercase tracking-wide">
          Verification Pending
        </span>
      </div>

      {/* Scanning circle animation */}
      <div className="relative w-36 h-36 mb-8">
        {/* Outer ring with glow */}
        <div className="absolute inset-0 rounded-full border-2 border-accent/20 shadow-[0_0_20px_rgba(1,249,198,0.1)]" />

        {/* Secondary rotating ring */}
        <div
          className="absolute inset-2 rounded-full border border-accent/10 animate-spin"
          style={{ animationDuration: '3s', animationDirection: 'reverse' }}
        />

        {/* Primary rotating scan line */}
        <div
          className="absolute inset-0 rounded-full border-t-2 border-r-2 border-accent animate-spin"
          style={{ animationDuration: '1.2s' }}
        />

        {/* Inner pulse */}
        <div className="absolute inset-6 rounded-full bg-gradient-to-br from-accent/20 to-transparent animate-pulse" />

        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-ink-medium rounded-xl border border-ink-border flex items-center justify-center">
            <svg
              className="w-8 h-8 text-accent"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Phase text */}
      <p className="text-lg font-semibold text-white mb-2">
        {PHASES[currentPhase].text}
      </p>

      {/* Subtext */}
      <p className="text-sm text-neutral-500 mb-6">
        Accessing institutional network...
      </p>

      {/* Scanning bars animation */}
      <div className="flex gap-1 h-6 items-end mb-6">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="w-1.5 bg-accent/60 rounded-full animate-pulse"
            style={{
              height: `${12 + Math.sin((currentPhase + i) * 0.8) * 12}px`,
              animationDelay: `${i * 0.1}s`,
              animationDuration: '0.6s',
            }}
          />
        ))}
      </div>

      {/* Progress indicator */}
      <div className="w-64 h-1.5 bg-ink-medium rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-accent/80 to-accent rounded-full transition-all duration-700 ease-out"
          style={{ width: `${((currentPhase + 1) / PHASES.length) * 100}%` }}
        />
      </div>

      {/* Step counter */}
      <p className="mt-4 text-xs text-neutral-600 font-mono">
        Step {currentPhase + 1} of {PHASES.length}
      </p>
    </div>
  );
};
