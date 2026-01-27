import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Modal } from './Modal';
import { Logo } from './Logo';
import { GOOGLE_SCRIPT_URL, FORM_TYPES, STORAGE_KEYS } from '../config/api';

// Shadow Capital PDF download URL
const SHADOW_CAPITAL_DOWNLOAD_URL = 'https://drive.google.com/uc?export=download&id=1-2TstJI8cGBvIIkeRYFTe3Zh88Smab4w';

// Startup stage options
const STAGE_OPTIONS = [
  { value: '', label: 'Select your stage...' },
  { value: 'idea', label: 'Idea Stage' },
  { value: 'mvp', label: 'MVP / Pre-Revenue' },
  { value: 'early_revenue', label: 'Early Revenue ($0-$500K ARR)' },
  { value: 'growth', label: 'Growth ($500K-$2M ARR)' },
  { value: 'scaling', label: 'Scaling ($2M+ ARR)' },
];

// Common consumer email domains
const consumerEmailDomains = [
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com',
  'icloud.com', 'mail.com', 'protonmail.com', 'zoho.com', 'yandex.com',
];

const getEmailTier = (email: string): 'Business' | 'Personal' => {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return 'Personal';
  return consumerEmailDomains.includes(domain) ? 'Personal' : 'Business';
};

interface ShadowCapitalModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadSource: string; // 'Hero_Button', 'Library_Card', 'Header_Nav', 'Intelligence_Hub', etc.
}

type ModalMode = 'form' | 'success' | 'error';

export const ShadowCapitalModal = ({ isOpen, onClose, leadSource }: ShadowCapitalModalProps) => {
  const [modalMode, setModalMode] = useState<ModalMode>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [startupName, setStartupName] = useState('');
  const [currentStage, setCurrentStage] = useState('');

  // Trigger download
  const triggerDownload = () => {
    const link = document.createElement('a');
    link.href = SHADOW_CAPITAL_DOWNLOAD_URL;
    link.setAttribute('download', 'zScale-Shadow-Capital-Landscape-2026.pdf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Submit lead to Google Sheets
  const submitLead = async (): Promise<boolean> => {
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formType: FORM_TYPES.SHADOW_CAPITAL,
          firstName,
          lastName,
          email,
          companyName: startupName,
          currentStage,
          emailTier: getEmailTier(email),
          leadSource: leadSource,
          leadTag: 'Shadow_Capital_Interest',
          assetDownloaded: 'Shadow_Capital_Landscape_2026',
          source: `shadow-capital-${leadSource.toLowerCase().replace(/_/g, '-')}`,
          timestamp: new Date().toISOString(),
        }),
      });
      return true;
    } catch (error) {
      console.error('Error submitting Shadow Capital lead:', error);
      return false;
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return;

    // Validate stage selection
    if (!currentStage) return;

    setIsSubmitting(true);

    try {
      const success = await submitLead();

      if (success) {
        // Save user info for future sessions
        localStorage.setItem(STORAGE_KEYS.USER_EMAIL, email);
        localStorage.setItem(STORAGE_KEYS.USER_FIRST_NAME, firstName);
        localStorage.setItem(STORAGE_KEYS.USER_LAST_NAME, lastName);
        localStorage.setItem(STORAGE_KEYS.USER_COMPANY, startupName);

        // Trigger download immediately
        triggerDownload();

        // Show success modal with Alpha Hook
        setModalMode('success');
      } else {
        setModalMode('error');
      }
    } catch {
      setModalMode('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form state
  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setStartupName('');
    setCurrentStage('');
  };

  // Handle modal close
  const handleClose = () => {
    setModalMode('form');
    resetForm();
    onClose();
  };

  // Handle download after success (for manual re-download)
  const handleDownloadClick = () => {
    triggerDownload();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      {/* Success State - Download Complete + Alpha Hook */}
      {modalMode === 'success' ? (
        <div className="text-center">
          {/* Success Animation */}
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 bg-accent/20 rounded-full animate-ping" />
            <div className="absolute inset-0 bg-accent/10 rounded-full animate-pulse" />
            <div className="relative w-full h-full bg-accent/20 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Success Message */}
          <h2 id="modal-title" className="text-2xl font-bold text-accent mb-2">
            Intelligence Unlocked
          </h2>
          <p className="text-white/70 mb-6">
            Your 2026 Shadow Capital Report is downloading now.
          </p>

          {/* Alpha Hook - Key Conversion Driver */}
          <div className="bg-[#0A0A0B] border border-accent/30 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-center gap-2 mb-3">
              <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-sm font-semibold text-accent">Upgrade to Alpha Tier</span>
            </div>
            <p className="text-sm text-white/60 mb-4">
              Get warm introductions to these family offices. Alpha members receive direct handshakes to the Shadow Network.
            </p>
            <Link
              to="/membership"
              onClick={handleClose}
              className="block w-full py-3 bg-accent text-[#0A0A0B] font-semibold rounded-lg hover:brightness-110 transition-all text-center"
            >
              Apply for Alpha Access
            </Link>
          </div>

          {/* Secondary download button */}
          <button
            onClick={handleDownloadClick}
            className="text-sm text-white/50 hover:text-accent transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download again
          </button>
        </div>
      ) : modalMode === 'error' ? (
        /* Error State */
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 id="modal-title" className="text-xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-white/60 mb-6">
            Please try again or contact us directly.
          </p>
          <button
            onClick={() => setModalMode('form')}
            className="px-6 py-3 bg-accent text-[#0A0A0B] font-semibold rounded-xl hover:brightness-110 transition-all"
          >
            Try Again
          </button>
        </div>
      ) : (
        /* Form State */
        <div>
          <div className="text-center mb-6">
            <div className="mb-4">
              <Logo size="sm" />
            </div>
            <h2 id="modal-title" className="text-2xl font-bold text-accent mb-2">
              2026 Shadow Capital Landscape
            </h2>
            <p className="text-sm text-white/70">
              35+ Dallas family offices and private capital sources. Complete with investment thesis, check sizes, and sector focus.
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

            {/* Startup Name */}
            <div>
              <label htmlFor="startupName" className="block text-sm font-medium text-white/70 mb-2">
                Startup Name
              </label>
              <input
                id="startupName"
                type="text"
                placeholder="Acme Inc."
                value={startupName}
                onChange={(e) => setStartupName(e.target.value)}
                required
                className="w-full py-3 px-4 bg-white/[0.03] border border-white/[0.1] rounded-xl text-white transition-all duration-300 focus:outline-none focus:border-accent focus:bg-white/[0.05] placeholder:text-white/30"
              />
            </div>

            {/* Current Stage Dropdown */}
            <div>
              <label htmlFor="currentStage" className="block text-sm font-medium text-white/70 mb-2">
                Current Stage
              </label>
              <select
                id="currentStage"
                value={currentStage}
                onChange={(e) => setCurrentStage(e.target.value)}
                required
                className="w-full py-3 px-4 bg-white/[0.03] border border-white/[0.1] rounded-xl text-white transition-all duration-300 focus:outline-none focus:border-accent focus:bg-white/[0.05] appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23666'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                  backgroundSize: '1.25rem',
                }}
              >
                {STAGE_OPTIONS.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    className="bg-[#1a1a1a] text-white"
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !currentStage}
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
                  Download Shadow Capital Report
                </>
              )}
            </button>
          </form>

          <p className="text-xs text-white/30 mt-6 text-center">
            No spam. Your data stays in the vault.
          </p>
        </div>
      )}
    </Modal>
  );
};
