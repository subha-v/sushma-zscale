interface IRIProgressProps {
  currentStep: number;
  totalSteps: number;
}

const stepLabels = [
  'Info',
  'PMF',
  'Economics',
  'Team',
  'Infra',
  'Capital',
];

export const IRIProgress = ({ currentStep, totalSteps }: IRIProgressProps) => {
  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="relative h-2 bg-ink-medium rounded-full overflow-hidden mb-4">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#01F9C6] to-[#00D9AB] transition-all duration-500 ease-out rounded-full"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
        {/* Glow effect */}
        <div
          className="absolute inset-y-0 left-0 bg-[#01F9C6] blur-sm opacity-50 transition-all duration-500 ease-out"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>

      {/* Step indicators */}
      <div className="hidden md:flex justify-between">
        {stepLabels.map((label, index) => {
          const stepNum = index + 1;
          const isCompleted = currentStep > stepNum;
          const isCurrent = currentStep === stepNum;

          return (
            <div
              key={label}
              className={`flex flex-col items-center transition-all duration-300 ${
                isCurrent
                  ? 'text-[#01F9C6]'
                  : isCompleted
                  ? 'text-[#01F9C6]/60'
                  : 'text-neutral-600'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                  isCurrent
                    ? 'bg-[#01F9C6]/20 border-2 border-[#01F9C6] text-[#01F9C6]'
                    : isCompleted
                    ? 'bg-[#01F9C6]/10 border border-[#01F9C6]/30 text-[#01F9C6]/60'
                    : 'bg-ink-medium border border-ink-border text-neutral-600'
                }`}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  stepNum
                )}
              </div>
              <span className="text-xs mt-2 font-medium">{label}</span>
            </div>
          );
        })}
      </div>

      {/* Mobile step indicator */}
      <div className="flex md:hidden justify-center">
        <span className="text-sm text-neutral-400">
          Step <span className="text-[#01F9C6] font-semibold">{currentStep}</span> of {totalSteps}
        </span>
      </div>
    </div>
  );
};
