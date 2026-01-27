import { useState, FormEvent, ReactNode } from 'react';
import { Modal } from '../../Modal';
import { GOOGLE_SCRIPT_URL, FORM_TYPES } from '../../../config/api';

interface ToolAccessGateProps {
  toolName: string;
  toolId: string;
  children: ReactNode;
}

export const ToolAccessGate = ({ toolName, toolId, children }: ToolAccessGateProps) => {
  const storageKey = `tool_access_${toolId}`;
  const [hasAccess, setHasAccess] = useState(() => {
    return localStorage.getItem(storageKey) === 'true';
  });
  const [showModal, setShowModal] = useState(!hasAccess);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Split full name into first and last name
      const nameParts = fullName.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Prepare data for Google Sheets (no email sent for tool access)
      const formData = {
        formType: FORM_TYPES.TOOL_ACCESS,
        firstName,
        lastName,
        email,
        toolAccessed: toolName,
        source: `Tool: ${toolName}`,
        timestamp: new Date().toISOString(),
      };

      // Submit to Google Apps Script
      try {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      } catch {
        // Continue even if Google Sheets fails - don't block user access
        console.log('Google Sheets submission attempted');
      }

      // Store access in localStorage
      localStorage.setItem(storageKey, 'true');
      localStorage.setItem('lead_email', email);
      localStorage.setItem('lead_name', fullName);

      setHasAccess(true);
      setShowModal(false);

      // Scroll to top of page after unlocking access
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (hasAccess) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Show blurred/locked preview */}
      <div className="min-h-screen bg-ink pt-20">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <div className="w-20 h-20 mx-auto mb-8 bg-accent/10 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-accent"
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
          <h1 className="text-3xl font-bold text-white mb-4">
            Access {toolName}
          </h1>
          <p className="text-lg text-neutral-400 mb-8 max-w-xl mx-auto">
            Enter your details below to unlock this free founder tool and get exclusive access to zScale resources.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="px-8 py-4 bg-accent text-ink font-semibold rounded-xl hover:bg-accent-hover transition-colors shadow-glow"
          >
            Unlock Free Access
          </button>
        </div>
      </div>

      {/* Access Gate Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
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

          <h2 className="text-2xl font-semibold text-white mb-2">
            Unlock {toolName}
          </h2>
          <p className="text-neutral-400 mb-6">
            Get free access to this tool and exclusive founder resources.
          </p>

          {/* Benefits */}
          <ul className="text-left mb-8 space-y-3">
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-neutral-300">Instant free access to the tool</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-neutral-300">Dallas ecosystem insights & updates</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-neutral-300">Priority access to founder events</span>
            </li>
          </ul>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full py-3 px-4 border border-ink-border rounded-xl bg-ink-medium text-white transition-all duration-200 focus:outline-none focus:border-accent placeholder:text-neutral-500"
            />
            <input
              type="email"
              placeholder="Email Address"
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
              {isSubmitting ? 'Unlocking...' : 'Get Free Access'}
            </button>
          </form>

          {/* Privacy Note */}
          <p className="text-xs text-neutral-500 mt-4">
            We respect your privacy. No spam, unsubscribe anytime.
          </p>
        </div>
      </Modal>
    </>
  );
};
