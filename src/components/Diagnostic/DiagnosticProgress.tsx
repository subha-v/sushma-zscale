interface DiagnosticProgressProps {
  currentStep: number;
  totalSteps: number;
}

const STEP_LABELS = [
  'Contact',
  'PMF',
  'Financial',
  'Team',
  'Network',
];

export const DiagnosticProgress = ({
  currentStep,
  totalSteps,
}: DiagnosticProgressProps) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="mb-8">
      {/* Step indicator */}
      <div className="flex justify-between mb-3">
        <span className="text-sm font-medium text-neutral-400">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm font-medium text-accent">
          {STEP_LABELS[currentStep - 1]}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-ink-medium rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-500 ease-out-quart"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step dots */}
      <div className="flex justify-between mt-3">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div
            key={step}
            className={`
              w-2 h-2 rounded-full transition-colors duration-300
              ${
                step <= currentStep
                  ? 'bg-accent'
                  : 'bg-ink-border'
              }
            `}
          />
        ))}
      </div>
    </div>
  );
};
