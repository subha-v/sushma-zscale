import { useState, FormEvent } from 'react';
import { Modal } from '../../Modal';
import { LeadCaptureConfig } from '../../../types/tools';

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  config: LeadCaptureConfig;
}

export const LeadCaptureModal = ({
  isOpen,
  onClose,
  onSuccess,
  config,
}: LeadCaptureModalProps) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Submit to Google Apps Script endpoint
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('source', config.tool);
      formData.append('timestamp', new Date().toISOString());

      // For now, we'll simulate the submission
      // In production, this would be the actual Google Apps Script URL
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Store in localStorage to persist unlock state
      localStorage.setItem(`unlocked_${config.tool}`, 'true');
      localStorage.setItem(`lead_email`, email);

      onSuccess();
      onClose();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center">
        {/* Lock Icon */}
        <div className="w-16 h-16 mx-auto mb-6 bg-accent/10 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-accent"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>

        <h2 id="modal-title" className="text-2xl font-semibold text-white mb-2">
          {config.title}
        </h2>
        <p className="text-neutral-400 mb-6">{config.description}</p>

        {/* Benefits List */}
        <ul className="text-left mb-8 space-y-3">
          {config.benefits.map((benefit, index) => (
            <li key={index} className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-accent flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-neutral-300">{benefit}</span>
            </li>
          ))}
        </ul>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full py-3 px-4 border border-ink-border rounded-xl bg-ink-medium text-white transition-all duration-200 focus:outline-none focus:border-accent placeholder:text-neutral-500"
          />
          <input
            type="email"
            placeholder="Work email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full py-3 px-4 border border-ink-border rounded-xl bg-ink-medium text-white transition-all duration-200 focus:outline-none focus:border-accent placeholder:text-neutral-500"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 bg-accent text-ink font-semibold rounded-xl transition-all duration-200 hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Unlocking...' : config.buttonText}
          </button>
        </form>

        {/* Privacy Note */}
        <p className="text-xs text-neutral-500 mt-4">
          We respect your privacy. No spam, unsubscribe anytime.
        </p>
      </div>
    </Modal>
  );
};
