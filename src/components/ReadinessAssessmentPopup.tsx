import { Modal } from './Modal';

interface ReadinessAssessmentPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReadinessAssessmentPopup = ({ isOpen, onClose }: ReadinessAssessmentPopupProps) => {
  const handleSignup = () => {
    window.open('https://docs.google.com/forms/d/e/1FAIpQLSeOkrgPlESpmmDavnJwthxQDdKg0U-saa-in0zMZtKq-zveLA/viewform?usp=sharing', '_blank');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-xs mb-4">
          <span className="text-accent-green font-mono">IRI</span>
          <span className="text-neutral-400">Investment Readiness Index</span>
        </div>

        <h2 id="modal-title" className="text-h2 text-white mb-3">
          Startup Readiness Assessment
        </h2>

        <p className="text-body text-neutral-400 mb-8">
          Discover your startup's strengths and growth opportunities with our comprehensive readiness evaluation.
        </p>

        <div className="bg-ink-medium border border-ink-border rounded-xl p-6 mb-8 text-left">
          <h3 className="text-h4 text-white mb-4">
            Get Your Personalized Assessment
          </h3>

          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-accent flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-body text-neutral-300">Industry-specific readiness score</span>
            </li>
            <li className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-accent flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-body text-neutral-300">Tailored improvement recommendations</span>
            </li>
            <li className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-accent flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-body text-neutral-300">Advisor matching suggestions</span>
            </li>
            <li className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-accent flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-body text-neutral-300">Resource recommendations for your sector</span>
            </li>
          </ul>
        </div>

        <button
          onClick={handleSignup}
          className="w-full bg-accent text-ink text-button py-4 px-8 rounded-full hover:bg-accent-hover transition-all duration-300 hover:shadow-glow"
        >
          Run IRI Assessment
        </button>
      </div>
    </Modal>
  );
};
