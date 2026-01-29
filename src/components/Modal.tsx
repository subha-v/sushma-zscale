import { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const isOpenRef = useRef(isOpen);

  // Keep ref in sync with prop
  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  // Store the onClose callback in a ref to avoid effect re-runs
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Handle ESC key press and body scroll lock
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpenRef.current) {
        onCloseRef.current();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Store current focus and prevent body scroll
      previousFocusRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      // Only restore focus when modal is actually closing
      if (!isOpenRef.current && previousFocusRef.current) {
        previousFocusRef.current.focus();
        previousFocusRef.current = null;
      }
    };
  }, [isOpen]);

  // Handle click outside modal
  const handleBackdropClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onCloseRef.current();
    }
  }, []);

  // Focus trap - only run once when modal opens
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const modal = modalRef.current;

    const getFocusableElements = () => {
      return modal.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
    };

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTab);

    // Focus the first input if available, otherwise the first focusable element
    const focusableElements = getFocusableElements();
    const firstInput = modal.querySelector<HTMLElement>('input, textarea, select');
    if (firstInput) {
      firstInput.focus();
    } else if (focusableElements[0]) {
      focusableElements[0].focus();
    }

    return () => {
      document.removeEventListener('keydown', handleTab);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
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
        aria-labelledby="modal-title"
        className="fixed w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-[#0A0A0B] border border-ink-border rounded-2xl shadow-2xl animate-scaleIn"
        style={{
          zIndex: 9999,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
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

        {/* Modal content */}
        <div className="p-8 md:p-12">
          {children}
        </div>
      </div>
    </>,
    document.body
  );
};
