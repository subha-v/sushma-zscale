import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { IRIContactInfo, IRIAnswers, IRIResult, IRIViewState, VectorScore } from './types';
import { vectors, UNIT_ECONOMICS_PENALTY, UNIT_ECONOMICS_TRIGGER_VALUE, getWorkshopRecommendation } from './scoringData';
import { GOOGLE_SCRIPT_URL, FORM_TYPES, saveUserProgress } from '../../config/api';
import { IRIProgress } from './IRIProgress';
import { ContactStep } from './steps/ContactStep';
import { VectorStep } from './steps/VectorStep';
import { IRICalculatingView } from './IRICalculatingView';
import { IRIResultsView } from './IRIResultsView';

interface IRIModalProps {
  isOpen: boolean;
  onClose: () => void;
  source?: string; // For tracking: 'Header_IRI', 'Exit_Gap_IRI', 'Team_Page_IRI', etc.
}

const TOTAL_STEPS = 6; // Contact + 5 vectors

const initialContact: IRIContactInfo = {
  firstName: '',
  lastName: '',
  email: '',
  companyName: '',
  sector: '',
};

const initialAnswers: IRIAnswers = {
  pmfCustomerValidation: '',
  pmfRetention: '',
  pmfOrganicGrowth: '',
  unitEconomicsKnowledge: '',
  cacLtvRatio: '',
  revenueModel: '',
  founderBackground: '',
  teamCompleteness: '',
  advisorNetwork: '',
  legalStructure: '',
  financialTracking: '',
  dataRoom: '',
  fundraisingExperience: '',
  investorRelations: '',
};

export const IRIModal = ({ isOpen, onClose, source = 'Header_IRI' }: IRIModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [contact, setContact] = useState<IRIContactInfo>(initialContact);
  const [answers, setAnswers] = useState<IRIAnswers>(initialAnswers);
  const [viewState, setViewState] = useState<IRIViewState>('form');
  const [validationError, setValidationError] = useState('');
  const [result, setResult] = useState<IRIResult | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Handle ESC key and body scroll lock
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && viewState === 'form') {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Lock body scroll properly
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isOpen, viewState]);

  // Scroll to top when step changes
  useEffect(() => {
    if (isOpen && contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [currentStep, viewState, isOpen]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && viewState === 'form') {
      handleClose();
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setContact(initialContact);
    setAnswers(initialAnswers);
    setViewState('form');
    setValidationError('');
    setResult(null);
    onClose();
  };

  const updateContact = (updates: Partial<IRIContactInfo>) => {
    setContact(prev => ({ ...prev, ...updates }));
    setValidationError('');
  };

  const updateAnswers = (updates: Partial<IRIAnswers>) => {
    setAnswers(prev => ({ ...prev, ...updates }));
    setValidationError('');
  };

  const validateStep = (): boolean => {
    if (currentStep === 1) {
      if (!contact.firstName.trim()) {
        setValidationError('Please enter your first name');
        return false;
      }
      if (!contact.lastName.trim()) {
        setValidationError('Please enter your last name');
        return false;
      }
      if (!contact.email.trim() || !contact.email.includes('@')) {
        setValidationError('Please enter a valid email');
        return false;
      }
      if (!contact.companyName.trim()) {
        setValidationError('Please enter your company name');
        return false;
      }
      return true;
    }

    // Vector steps validation
    const vectorIndex = currentStep - 2;
    const vector = vectors[vectorIndex];

    for (const question of vector.questions) {
      const answerKey = question.id as keyof IRIAnswers;
      if (!answers[answerKey]) {
        setValidationError(`Please answer all questions in this section`);
        return false;
      }
    }

    return true;
  };

  // Calculate scores
  const calculateResults = useCallback((): IRIResult => {
    const vectorScores: VectorScore[] = [];
    let hasPenalty = false;

    for (const vector of vectors) {
      let rawScore = 0;
      const insights: string[] = [];

      for (const question of vector.questions) {
        const answerKey = question.id as keyof IRIAnswers;
        const answerValue = answers[answerKey];
        const selectedOption = question.options.find(opt => opt.value === answerValue);

        if (selectedOption) {
          rawScore += selectedOption.score;

          // Check for unit economics penalty
          if (answerKey === 'unitEconomicsKnowledge' && answerValue === UNIT_ECONOMICS_TRIGGER_VALUE) {
            hasPenalty = true;
            insights.push('Dallas VCs expect founders to know their unit economics cold.');
          }

          // Add insights for low scores
          if (selectedOption.score <= 3) {
            insights.push(`${question.question.replace('?', '')}: Area for improvement`);
          }
        }
      }

      // Normalize to weighted score (out of 100 * weight)
      const normalizedScore = (rawScore / vector.maxRawScore) * 100 * vector.weight;

      vectorScores.push({
        id: vector.id,
        name: vector.name,
        score: Math.round(normalizedScore),
        maxScore: Math.round(100 * vector.weight),
        weight: vector.weight,
        insights,
      });
    }

    // Calculate total score
    let totalScore = vectorScores.reduce((sum, v) => sum + v.score, 0);
    const penalty = hasPenalty ? UNIT_ECONOMICS_PENALTY : 0;
    totalScore = Math.max(0, totalScore + penalty);

    // Get workshop recommendation
    const workshop = getWorkshopRecommendation(totalScore);

    return {
      totalScore: Math.round(totalScore),
      vectors: vectorScores,
      workshop,
      penalty,
    };
  }, [answers]);

  const handleSubmit = async () => {
    setViewState('calculating');

    // Calculate results
    const calculatedResult = calculateResults();

    // Prepare payload for Google Sheets - Master Database format
    const payload = {
      formType: FORM_TYPES.READINESS_INDEX,

      // Contact Info
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      companyName: contact.companyName,
      sector: contact.sector,

      // Vector Scores (mapped to Master DB column names)
      totalScore: calculatedResult.totalScore,
      vector1PmfEvidence: calculatedResult.vectors.find(v => v.id === 'pmf')?.score || 0,
      vector2UnitEconomics: calculatedResult.vectors.find(v => v.id === 'unit_economics')?.score || 0,
      vector3TeamAdvisors: calculatedResult.vectors.find(v => v.id === 'team')?.score || 0,
      vector4Infrastructure: calculatedResult.vectors.find(v => v.id === 'infrastructure')?.score || 0,
      vector5CapitalPosition: calculatedResult.vectors.find(v => v.id === 'capital')?.score || 0,
      penaltyApplied: calculatedResult.penalty !== 0,
      penaltyAmount: calculatedResult.penalty,
      recommendedWorkshop: calculatedResult.workshop.title,
      workshopPriority: calculatedResult.workshop.priority,

      // Raw answers for detailed analysis (mapped to DB columns)
      pmfCustomerValidation: answers.pmfCustomerValidation,
      pmfRetention: answers.pmfRetention,
      pmfOrganicGrowth: answers.pmfOrganicGrowth,
      metricUnitEconomicsKnowledge: answers.unitEconomicsKnowledge,
      metricCacLtv: answers.cacLtvRatio,
      metricRevenueModel: answers.revenueModel,
      teamFounderBackground: answers.founderBackground,
      teamCompleteness: answers.teamCompleteness,
      teamAdvisorNetwork: answers.advisorNetwork,
      infraLegalStructure: answers.legalStructure,
      infraFinancialTracking: answers.financialTracking,
      infraDataRoom: answers.dataRoom,
      capitalFundraisingExp: answers.fundraisingExperience,
      capitalInvestorRelations: answers.investorRelations,

      // Tracking source
      source: source,
      timestamp: new Date().toISOString(),
    };

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error('Error submitting IRI:', error);
    }

    // Save user progress for progression unlocks
    saveUserProgress({
      iriScore: calculatedResult.totalScore,
      email: contact.email,
      firstName: contact.firstName,
      lastName: contact.lastName,
      company: contact.companyName,
      sector: contact.sector,
    });

    setResult(calculatedResult);
  };

  const handleCalculationComplete = useCallback(() => {
    setViewState('results');
  }, []);

  const handleNext = () => {
    if (!validateStep()) return;

    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }

    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      if (contentRef.current) {
        contentRef.current.scrollTop = 0;
      }
      setCurrentStep(prev => prev - 1);
      setValidationError('');
    }
  };

  // Get current vector for vector steps
  const currentVector = useMemo(() => {
    if (currentStep > 1 && currentStep <= TOTAL_STEPS) {
      return vectors[currentStep - 2];
    }
    return null;
  }, [currentStep]);

  const renderStep = () => {
    if (currentStep === 1) {
      return (
        <ContactStep
          contact={contact}
          updateContact={updateContact}
        />
      );
    }

    if (currentVector) {
      return (
        <VectorStep
          vector={currentVector}
          answers={answers}
          updateAnswers={updateAnswers}
        />
      );
    }

    return null;
  };

  const getStepTitle = () => {
    if (currentStep === 1) return 'Your Information';
    if (currentVector) return currentVector.name;
    return '';
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Full-screen overlay backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md animate-fadeIn"
        style={{ zIndex: 9998 }}
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Centered modal container */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="iri-title"
        className="fixed w-full max-w-2xl max-h-[85vh] bg-[#0A0A0B] border border-ink-border rounded-2xl shadow-2xl animate-scaleIn flex flex-col overflow-hidden"
        style={{
          zIndex: 9999,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        {/* Close button - always visible */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-ink-medium border border-ink-border text-neutral-400 hover:bg-accent hover:border-accent hover:text-ink transition-colors duration-200"
          style={{ zIndex: 10000 }}
          aria-label="Close modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {viewState === 'calculating' ? (
          <div className="p-6 md:p-8">
            <IRICalculatingView onComplete={handleCalculationComplete} />
          </div>
        ) : viewState === 'results' && result ? (
          <div className="p-6 md:p-8 overflow-y-auto flex-1">
            <IRIResultsView
              result={result}
              contact={contact}
              onClose={handleClose}
            />
          </div>
        ) : (
          <>
            {/* Fixed Header */}
            <div className="p-6 md:p-8 pb-0">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-xs mb-4">
                  <span className="text-[#01F9C6] font-mono">IRI</span>
                  <span className="text-neutral-400">Investment Readiness Index</span>
                </div>
                <h2 id="iri-title" className="text-2xl md:text-3xl font-bold text-white">
                  {getStepTitle()}
                </h2>
              </div>
              <IRIProgress currentStep={currentStep} totalSteps={TOTAL_STEPS} />
            </div>

            {/* Scrollable Content */}
            <div
              ref={contentRef}
              className="px-6 md:px-8 py-4 overflow-y-auto flex-1"
            >
              {renderStep()}

              {validationError && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {validationError}
                </div>
              )}
            </div>

            {/* Fixed Navigation Footer */}
            <div className="p-6 md:p-8 pt-4 border-t border-ink-border bg-[#0A0A0B]">
              <div className="flex items-center justify-between">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className={`
                    flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-colors
                    ${
                      currentStep === 1
                        ? 'text-neutral-600 cursor-not-allowed'
                        : 'text-neutral-400 hover:text-white hover:bg-ink-medium'
                    }
                  `}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Back
                </button>

                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-3 bg-[#01F9C6] text-[#0A0A0B] font-semibold rounded-xl hover:brightness-110 transition-all duration-200 hover:shadow-[0_0_20px_rgba(1,249,198,0.3)]"
                >
                  {currentStep === TOTAL_STEPS ? 'Calculate My Score' : 'Next'}
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};
