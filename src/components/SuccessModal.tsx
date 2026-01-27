import { Modal } from './Modal';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDiagnostic?: () => void;
}

export const SuccessModal = ({ isOpen, onClose, onOpenDiagnostic }: SuccessModalProps) => {
  const handleFindAdvisor = () => {
    onClose();
    if (onOpenDiagnostic) {
      onOpenDiagnostic();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center">
        {/* Success Icon */}
        <div className="mx-auto mb-6 w-20 h-20 bg-accent/20 border border-accent/30 rounded-2xl flex items-center justify-center">
          <svg
            className="w-12 h-12 text-accent"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Heading */}
        <h2 className="text-h2 text-white mb-4">
          Success! Check Your Email
        </h2>

        {/* Description */}
        <p className="text-body text-white mb-8">
          The Dallas Startup Ecosystem Map PDF has been sent to your inbox. It should arrive within 2 minutes.
        </p>

        {/* What's Next Section */}
        <div className="bg-[#161618] rounded-2xl p-8 mb-6 border border-accent/20">
          <h3 className="text-h3 text-white mb-6">
            What's Next?
          </h3>

          <div className="space-y-4 text-left">
            <div className="flex items-start gap-3">
              <span className="text-2xl">📧</span>
              <p className="text-body text-white pt-1">
                Check your email for the PDF download
              </p>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">📋</span>
              <p className="text-body text-white pt-1">
                Review the investor matching matrix
              </p>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">🎯</span>
              <p className="text-body text-white pt-1">
                Get matched with Dallas advisors
              </p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleFindAdvisor}
          className="w-full bg-accent text-ink text-button font-semibold py-4 px-8 rounded-full hover:brightness-110 transition-all duration-300 hover:shadow-xl hover:shadow-accent/20"
        >
          Find Your Advisor Match
        </button>
      </div>
    </Modal>
  );
};
