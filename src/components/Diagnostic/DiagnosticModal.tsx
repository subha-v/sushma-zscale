import { useState, useEffect, useRef, useCallback } from 'react';
import { ContactInfo, DiagnosticAnswers, PrefilledLeadData } from './types';
import { DiagnosticProgress } from './DiagnosticProgress';
import { ContactInfoStep } from './steps/ContactInfoStep';
import { PMFEvidenceStep } from './steps/PMFEvidenceStep';
import { FinancialModelingStep } from './steps/FinancialModelingStep';
import { TeamCompositionStep } from './steps/TeamCompositionStep';
import { AdvisorNetworkStep } from './steps/AdvisorNetworkStep';
import { SearchingAnimation } from './shared/SearchingAnimation';
import { DiagnosticSuccessView } from './DiagnosticSuccessView';
import { GOOGLE_SCRIPT_URL, FORM_TYPES } from '../../config/api';

interface DiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
  prefilledData?: PrefilledLeadData;
}

const TOTAL_STEPS = 5;

const createInitialContact = (prefilled?: PrefilledLeadData): ContactInfo => ({
  firstName: prefilled?.firstName || '',
  lastName: prefilled?.lastName || '',
  email: prefilled?.email || '',
  companyName: prefilled?.companyName || '',
  sector: '',
  stage: '',
});

const initialAnswers: DiagnosticAnswers = {
  pmfCustomerValidation: '',
  pmfRevenueModel: '',
  pmfCompetitiveAdvantage: '',
  financialRunway: '',
  financialFundraisingReady: '',
  financialMetrics: '',
  teamCoFounders: '',
  teamKeyHires: '',
  teamAdvisoryGaps: '',
  advisorCurrentNetwork: '',
  advisorNeededExpertise: '',
  advisorEngagementStyle: '',
};

type ViewState = 'form' | 'searching' | 'success';

export const DiagnosticModal = ({
  isOpen,
  onClose,
  onComplete,
  prefilledData,
}: DiagnosticModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [contact, setContact] = useState<ContactInfo>(() =>
    createInitialContact(prefilledData)
  );
  const [answers, setAnswers] = useState<DiagnosticAnswers>(initialAnswers);
  const [viewState, setViewState] = useState<ViewState>('form');
  const [validationError, setValidationError] = useState('');

  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Check if contact info is pre-filled
  const hasPrefilledContact = Boolean(
    prefilledData?.firstName && prefilledData?.email
  );

  // Update contact state when prefilled data changes
  useEffect(() => {
    if (prefilledData && isOpen) {
      setContact(createInitialContact(prefilledData));
    }
  }, [prefilledData, isOpen]);

  // Handle ESC key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      previousFocusRef.current = document.activeElement as HTMLElement;
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
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen]);

  // Scroll to top of modal content and window when step changes or modal opens
  useEffect(() => {
    if (isOpen) {
      // Scroll modal content to top
      if (contentRef.current) {
        contentRef.current.scrollTo({ top: 0, behavior: 'instant' });
      }
      // Also scroll window to ensure modal is visible at top
      window.scrollTo(0, 0);
    }
  }, [currentStep, viewState, isOpen]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleClose = () => {
    // Reset state when closing
    setCurrentStep(1);
    setContact(createInitialContact(prefilledData));
    setAnswers(initialAnswers);
    setViewState('form');
    setValidationError('');
    onClose();
  };

  const updateContact = (updates: Partial<ContactInfo>) => {
    setContact((prev) => ({ ...prev, ...updates }));
    setValidationError('');
  };

  const updateAnswers = (updates: Partial<DiagnosticAnswers>) => {
    setAnswers((prev) => ({ ...prev, ...updates }));
    setValidationError('');
  };

  const validateStep = (): boolean => {
    switch (currentStep) {
      case 1:
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
        if (!contact.sector) {
          setValidationError('Please select an industry sector');
          return false;
        }
        if (!contact.stage) {
          setValidationError('Please select your current stage');
          return false;
        }
        return true;
      case 2:
        if (!answers.pmfCustomerValidation) {
          setValidationError('Please select how you validated customer demand');
          return false;
        }
        if (!answers.pmfRevenueModel) {
          setValidationError('Please select your monetization approach');
          return false;
        }
        if (!answers.pmfCompetitiveAdvantage) {
          setValidationError('Please select your competitive advantage');
          return false;
        }
        return true;
      case 3:
        if (!answers.financialRunway) {
          setValidationError('Please select your current runway');
          return false;
        }
        if (!answers.financialFundraisingReady) {
          setValidationError('Please select your fundraising stage');
          return false;
        }
        if (!answers.financialMetrics) {
          setValidationError('Please select your metrics tracking');
          return false;
        }
        return true;
      case 4:
        if (!answers.teamCoFounders) {
          setValidationError('Please select your co-founder structure');
          return false;
        }
        if (!answers.teamKeyHires) {
          setValidationError('Please select your key hires');
          return false;
        }
        if (!answers.teamAdvisoryGaps) {
          setValidationError('Please select where you need help');
          return false;
        }
        return true;
      case 5:
        if (!answers.advisorCurrentNetwork) {
          setValidationError('Please select your current advisor network');
          return false;
        }
        if (!answers.advisorNeededExpertise) {
          setValidationError('Please select the expertise you need');
          return false;
        }
        if (!answers.advisorEngagementStyle) {
          setValidationError('Please select your preferred engagement style');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateStep()) return;

    // Scroll to top before advancing
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      // Scroll to top before going back
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (contentRef.current) {
        contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
      setCurrentStep((prev) => prev - 1);
      setValidationError('');
    }
  };

  const handleSubmit = async () => {
    setViewState('searching');

    const payload = {
      formType: FORM_TYPES.ADVISOR_MATCH,
      source: 'advisor-diagnostic',

      // Contact info
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      companyName: contact.companyName,
      currentStage: contact.stage,
      sector: contact.sector,

      // Diagnostic answers (mapped to DB columns)
      pmfCustomerValidation: answers.pmfCustomerValidation,
      pmfRevenueModel: answers.pmfRevenueModel,
      pmfCompetitiveAdvantage: answers.pmfCompetitiveAdvantage,
      financialRunway: answers.financialRunway,
      financialFundraisingReady: answers.financialFundraisingReady,
      financialMetrics: answers.financialMetrics,
      teamCoFounders: answers.teamCoFounders,
      teamKeyHires: answers.teamKeyHires,
      teamAdvisoryGaps: answers.teamAdvisoryGaps,
      advisorCurrentNetwork: answers.advisorCurrentNetwork,
      advisorNeededExpertise: answers.advisorNeededExpertise,
      advisorEngagementStyle: answers.advisorEngagementStyle,

      // Membership page URL for email template
      membershipUrl: `${window.location.origin}/membership`,

      // Full email next step text for backend to use
      emailNextStepText: `NEXT STEP: To unlock warm introductions to these advisors, a zScale Alpha Membership is required to verify your data room readiness. Learn more: ${window.location.origin}/membership`,
      emailNextStepUrl: `${window.location.origin}/membership`,

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
      console.error('Error submitting diagnostic:', error);
    }
  };

  const handleSearchComplete = useCallback(() => {
    // Instead of closing, show success view
    setViewState('success');
    // Scroll to top of modal
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleSuccessClose = () => {
    handleClose();
    if (onComplete) {
      onComplete();
    }
  };

  const renderStep = () => {
    const stepProps = {
      contact,
      answers,
      updateContact,
      updateAnswers,
      hasPrefilledContact,
    };

    switch (currentStep) {
      case 1:
        return <ContactInfoStep {...stepProps} />;
      case 2:
        return <PMFEvidenceStep {...stepProps} />;
      case 3:
        return <FinancialModelingStep {...stepProps} />;
      case 4:
        return <TeamCompositionStep {...stepProps} />;
      case 5:
        return <AdvisorNetworkStep {...stepProps} />;
      default:
        return null;
    }
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
        aria-labelledby="diagnostic-title"
        className="fixed w-full max-w-3xl max-h-[85vh] bg-[#0A0A0B] border border-ink-border rounded-2xl shadow-2xl animate-scaleIn flex flex-col overflow-hidden"
        style={{
          zIndex: 9999,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        {/* Close button */}
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

        {viewState === 'searching' ? (
          <div className="p-6 md:p-10">
            <SearchingAnimation onComplete={handleSearchComplete} />
          </div>
        ) : viewState === 'success' ? (
          <div className="p-6 md:p-10 overflow-y-auto flex-1">
            <DiagnosticSuccessView
              firstName={contact.firstName}
              sector={contact.sector}
              companyName={contact.companyName}
              onClose={handleSuccessClose}
            />
          </div>
        ) : (
          <>
            {/* Fixed Header - Progress */}
            <div className="p-6 md:p-10 pb-4">
              <DiagnosticProgress
                currentStep={currentStep}
                totalSteps={TOTAL_STEPS}
              />
            </div>

            {/* Scrollable Content */}
            <div
              ref={contentRef}
              className="px-6 md:px-10 overflow-y-auto flex-1"
            >
              {renderStep()}

              {validationError && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {validationError}
                </div>
              )}
            </div>

            {/* Fixed Navigation Footer */}
            <div className="p-6 md:p-10 pt-4 border-t border-ink-border bg-[#0A0A0B]">
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
                  className="flex items-center gap-2 px-6 py-3 bg-accent text-ink font-semibold rounded-xl hover:brightness-110 transition-all duration-200 hover:shadow-glow"
                >
                  {currentStep === TOTAL_STEPS ? 'Find My Match' : 'Next'}
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
