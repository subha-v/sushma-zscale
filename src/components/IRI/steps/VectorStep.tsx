import { IRIAnswers } from '../types';
import { Vector } from '../scoringData';

interface VectorStepProps {
  vector: Vector;
  answers: IRIAnswers;
  updateAnswers: (updates: Partial<IRIAnswers>) => void;
}

const vectorDescriptions: Record<string, string> = {
  pmf: 'Evaluate your product-market fit signals and customer validation.',
  unit_economics: 'Dallas VCs expect founders to know these numbers cold.',
  team: 'Assess your founding team strength and advisory network.',
  infrastructure: 'Review your operational and legal readiness for investment.',
  capital: 'Evaluate your fundraising experience and investor relationships.',
};

const vectorWeights: Record<string, string> = {
  pmf: '25%',
  unit_economics: '30%',
  team: '20%',
  infrastructure: '15%',
  capital: '10%',
};

export const VectorStep = ({ vector, answers, updateAnswers }: VectorStepProps) => {
  return (
    <div className="space-y-8">
      {/* Vector description */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#01F9C6]/10 border border-[#01F9C6]/20 rounded-full text-xs mb-2">
          <span className="text-[#01F9C6] font-mono">{vectorWeights[vector.id]} Weight</span>
        </div>
        <p className="text-neutral-400">
          {vectorDescriptions[vector.id]}
        </p>
      </div>

      {/* Questions */}
      {vector.questions.map((question, qIndex) => {
        const answerKey = question.id as keyof IRIAnswers;
        const currentAnswer = answers[answerKey];

        return (
          <div key={question.id} className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-3">
              <span className="flex-shrink-0 w-7 h-7 bg-[#01F9C6]/20 rounded-full flex items-center justify-center text-[#01F9C6] text-sm font-bold">
                {qIndex + 1}
              </span>
              {question.question}
            </h3>

            <div className="grid gap-3">
              {question.options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => updateAnswers({ [answerKey]: option.value })}
                  className={`
                    group w-full text-left rounded-xl border-2 transition-all duration-200 p-4
                    ${
                      currentAnswer === option.value
                        ? 'bg-[#01F9C6]/10 border-[#01F9C6] shadow-[0_0_15px_rgba(1,249,198,0.2)]'
                        : 'bg-ink-medium border-ink-border hover:border-[#01F9C6]/50 hover:bg-ink-light'
                    }
                  `}
                >
                  <div className="flex items-center gap-4">
                    {option.icon && (
                      <div
                        className={`
                          flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl
                          ${currentAnswer === option.value ? 'bg-[#01F9C6]/20' : 'bg-ink-light'}
                        `}
                      >
                        {option.icon}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4
                        className={`
                          font-semibold
                          ${currentAnswer === option.value ? 'text-[#01F9C6]' : 'text-white'}
                        `}
                      >
                        {option.label}
                      </h4>
                      <p className="text-sm text-neutral-500 mt-0.5">
                        {option.description}
                      </p>
                    </div>
                    {currentAnswer === option.value && (
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#01F9C6] flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-[#0A0A0B]"
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
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
