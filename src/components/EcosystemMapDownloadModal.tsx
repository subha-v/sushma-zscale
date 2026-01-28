import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from './Modal';
import { Logo } from './Logo';
import { GOOGLE_SCRIPT_URL, FORM_TYPES, STORAGE_KEYS, getUserProgress } from '../config/api';

// PDF download URL - Update with actual Google Drive file ID
const ECOSYSTEM_MAP_PDF_URL = 'https://drive.google.com/uc?export=download&id=1lPaQMT65gmhh-Q8KT-bm13x0HMNRvF0u';

interface EcosystemMapDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EcosystemMapDownloadModal = ({ isOpen, onClose }: EcosystemMapDownloadModalProps) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const userProgress = getUserProgress();
  const isAlreadyCaptured = !!userProgress.email;

  // If user already provided info, download and redirect immediately
  if (isOpen && isAlreadyCaptured) {
    // Trigger download
    const link = document.createElement('a');
    link.href = ECOSYSTEM_MAP_PDF_URL;
    link.setAttribute('download', 'zScale-Dallas-Venture-Map-2026.pdf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Navigate to ecosystem map page
    navigate('/ecosystem-map');
    onClose();
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return;

    setIsSubmitting(true);

    try {
      // Submit to Google Sheets
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formType: FORM_TYPES.ECOSYSTEM_MAP,
          firstName,
          lastName,
          email,
          leadSource: 'Header_Ecosystem_Map',
          leadTag: 'Ecosystem_Map_Download',
          assetDownloaded: 'Dallas_Venture_Map_2026',
          source: 'ecosystem-map-header',
          timestamp: new Date().toISOString(),
        }),
      });

      // Save to localStorage
      localStorage.setItem(STORAGE_KEYS.USER_EMAIL, email);
      localStorage.setItem(STORAGE_KEYS.USER_FIRST_NAME, firstName);
      localStorage.setItem(STORAGE_KEYS.USER_LAST_NAME, lastName);

      // Trigger download
      const link = document.createElement('a');
      link.href = ECOSYSTEM_MAP_PDF_URL;
      link.setAttribute('download', 'zScale-Dallas-Venture-Map-2026.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Navigate to ecosystem map page
      navigate('/ecosystem-map');
      onClose();
    } catch (error) {
      console.error('Error submitting ecosystem map lead:', error);
      // Still navigate on error for better UX
      navigate('/ecosystem-map');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>
        <div className="text-center mb-6">
          <div className="mb-4">
            <Logo size="sm" />
          </div>
          <h2 id="modal-title" className="text-2xl font-bold text-accent mb-2">
            2026 Dallas Venture Map
          </h2>
          <p className="text-sm text-white/70">
            68-page institutional intelligence report. Your PDF will download automatically.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First Name & Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-white/70 mb-2">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full py-3 px-4 bg-white/[0.03] border border-white/[0.1] rounded-xl text-white transition-all duration-300 focus:outline-none focus:border-accent focus:bg-white/[0.05] placeholder:text-white/30"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-white/70 mb-2">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                placeholder="Smith"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full py-3 px-4 bg-white/[0.03] border border-white/[0.1] rounded-xl text-white transition-all duration-300 focus:outline-none focus:border-accent focus:bg-white/[0.05] placeholder:text-white/30"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full py-3 px-4 bg-white/[0.03] border border-white/[0.1] rounded-xl text-white transition-all duration-300 focus:outline-none focus:border-accent focus:bg-white/[0.05] placeholder:text-white/30"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 bg-accent text-[#0A0A0B] font-semibold rounded-xl transition-all duration-300 hover:brightness-110 shadow-[0_0_30px_rgba(1,249,198,0.3)] hover:shadow-[0_0_50px_rgba(1,249,198,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </span>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download & View Map
              </>
            )}
          </button>
        </form>

        <p className="text-xs text-white/30 mt-6 text-center">
          No spam. Your data stays in the vault.
        </p>
      </div>
    </Modal>
  );
};
