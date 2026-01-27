import { useState, FormEvent, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Modal } from '../components/Modal';
import { Logo } from '../components/Logo';
import { GOOGLE_SCRIPT_URL, FORM_TYPES, getUserProgress, isPremiumMember, STORAGE_KEYS } from '../config/api';

// Direct download URLs
const PMF_AUDIT_DOWNLOAD_URL = 'https://drive.google.com/uc?export=download&id=1-2TstJI8cGBvIIkeRYFTe3Zh88Smab4w';
const SHADOW_CAPITAL_DOWNLOAD_URL = 'https://drive.google.com/uc?export=download&id=1-2TstJI8cGBvIIkeRYFTe3Zh88Smab4w'; // Update with actual Shadow Capital PDF ID

// Shadow Capital - Family Offices
interface FamilyOffice {
  id: string;
  name: string;
  sector: string;
  aum: string;
  location: string;
  investmentFocus: string;
}

const familyOffices: FamilyOffice[] = [
  { id: 'highland-park', name: 'Highland Park Family Office', sector: 'Technology & Healthcare', aum: '$500M+', location: 'Highland Park, TX', investmentFocus: 'Series A-B' },
  { id: 'lone-star', name: 'Lone Star Capital Partners', sector: 'Energy & Infrastructure', aum: '$750M+', location: 'Dallas, TX', investmentFocus: 'Growth Equity' },
  { id: 'turtle-creek', name: 'Turtle Creek Ventures', sector: 'Consumer & Retail', aum: '$300M+', location: 'Dallas, TX', investmentFocus: 'Seed to Series A' },
  { id: 'preston-hollow', name: 'Preston Hollow Holdings', sector: 'Real Estate Tech', aum: '$400M+', location: 'Preston Hollow, TX', investmentFocus: 'Series A' },
  { id: 'park-cities', name: 'Park Cities Capital', sector: 'FinTech & SaaS', aum: '$600M+', location: 'University Park, TX', investmentFocus: 'Pre-Seed to Seed' },
  { id: 'lakewood', name: 'Lakewood Legacy Fund', sector: 'Healthcare & Life Sciences', aum: '$450M+', location: 'Lakewood, TX', investmentFocus: 'Series B+' },
  { id: 'uptown', name: 'Uptown Venture Partners', sector: 'Enterprise Software', aum: '$350M+', location: 'Uptown Dallas, TX', investmentFocus: 'Seed' },
  { id: 'oak-lawn', name: 'Oak Lawn Capital Group', sector: 'CleanTech & Sustainability', aum: '$250M+', location: 'Oak Lawn, TX', investmentFocus: 'Series A-B' },
];

// Institutional Partners (Alpha-only)
interface InstitutionalPartner {
  id: string;
  name: string;
  type: string;
  checkSize: string;
  focus: string;
  dealFlow: string;
}

const institutionalPartners: InstitutionalPartner[] = [
  { id: 'dvc', name: 'Dallas Venture Capital', type: 'Venture Fund', checkSize: '$500K - $5M', focus: 'B2B Software', dealFlow: 'High Activity' },
  { id: 'perot-jain', name: 'Perot Jain', type: 'Venture Fund', checkSize: '$1M - $10M', focus: 'Enterprise Tech', dealFlow: 'Selective' },
  { id: 'revolution', name: 'Revolution Rise of Rest', type: 'Seed Fund', checkSize: '$250K - $1M', focus: 'Regional Startups', dealFlow: 'Moderate' },
  { id: 'next-coast', name: 'Next Coast Ventures', type: 'Venture Fund', checkSize: '$2M - $15M', focus: 'B2B & FinTech', dealFlow: 'High Activity' },
];

interface PlaybookCard {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  status: 'available' | 'coming-soon' | 'alpha-early-access';
  icon: React.ReactNode;
}

// Common consumer email domains - used for Email_Tier tagging
const consumerEmailDomains = [
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com',
  'icloud.com', 'mail.com', 'protonmail.com', 'zoho.com', 'yandex.com',
  'gmx.com', 'live.com', 'msn.com', 'me.com', 'inbox.com'
];

const getEmailTier = (email: string): 'Business' | 'Personal' => {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return 'Personal';
  return consumerEmailDomains.includes(domain) ? 'Personal' : 'Business';
};

const playbooks: PlaybookCard[] = [
  {
    id: 'pmf-audit',
    title: 'zScale Capital PMF Audit',
    subtitle: 'The 2026 Institutional Framework for Replicable Product-Market Fit.',
    description: 'A rigorous framework for proving product-market fit beyond vanity metrics. Learn what institutional investors actually look for when evaluating PMF evidence.',
    status: 'available',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 'venture-math-guide',
    title: 'The Venture Math Guide',
    subtitle: 'The Unlearning Series',
    description: 'Master the financial models that separate fundable companies from the rest. Unit economics, cohort analysis, and runway planning.',
    status: 'alpha-early-access',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'cap-table-hygiene',
    title: 'Cap Table Hygiene',
    subtitle: 'The Unlearning Series',
    description: 'Avoid the structural mistakes that kill deals. Proper SAFE stacking, option pool sizing, and founder dilution management.',
    status: 'coming-soon',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
];

const ventureStandards = [
  {
    metric: '4x - 6x Revenue',
    label: 'Target Multiple',
    sublabel: 'Sector Dependent',
    description: 'The return multiple institutional investors expect at your stage.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    metric: '>3.0 LTV/CAC',
    label: 'Unit Economics',
    sublabel: 'Minimum Threshold',
    description: 'The customer lifetime value to acquisition cost ratio that signals sustainability.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    metric: '70+ IRI Score',
    label: 'Readiness Score',
    sublabel: 'Investment Readiness Index',
    description: 'The threshold where founders demonstrate institutional-grade preparedness.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
  },
];

// Toast Component
const Toast = ({ message, isVisible, onClose }: { message: string; isVisible: boolean; onClose: () => void }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
      <div className="flex items-center gap-3 px-6 py-4 bg-ink-light border border-accent rounded-xl shadow-[0_0_30px_rgba(1,249,198,0.2)]">
        <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-white font-medium">{message}</p>
        <button onClick={onClose} className="ml-2 text-neutral-400 hover:text-white transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// Inline Briefing Signup Component
const InlineBriefingSignup = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return;

    setIsSubmitting(true);
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formType: FORM_TYPES.INTELLIGENCE_BRIEFING,
          email: email,
          emailTier: getEmailTier(email),
          leadSource: 'Venture_Library',
          leadIntent: 'Education',
          source: 'intelligence-hub-briefing-inline',
          timestamp: new Date().toISOString(),
        }),
      });
      localStorage.setItem(STORAGE_KEYS.USER_EMAIL, email);
      setIsSuccess(true);
    } catch {
      // Still show success for better UX
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative bg-[#0A0A0B] border border-accent/30 rounded-2xl p-8 lg:p-10 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-accent/5 pointer-events-none" />

      <div className="relative flex flex-col lg:flex-row items-center gap-8">
        {/* Left: Content */}
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/30 rounded-full mb-4">
            <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-xs text-accent font-medium">Monthly Intelligence</span>
          </div>

          <h3 className="text-2xl lg:text-3xl font-bold text-[#FFFFFF] mb-3">
            Get the Institutional Standard
          </h3>
          <p className="text-[#FFFFFF]/70">
            Join the monthly briefing for the data that Dallas Family Offices require.
          </p>
        </div>

        {/* Right: Form */}
        <div className="w-full lg:w-auto">
          {isSuccess ? (
            <div className="flex items-center gap-3 px-6 py-4 bg-accent/10 border border-accent/30 rounded-xl">
              <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-accent font-medium">You're on the list!</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full sm:w-64 py-3 px-4 border border-ink-border rounded-xl bg-ink-medium text-white transition-all duration-200 focus:outline-none focus:border-accent placeholder:text-neutral-500"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-accent text-[#0A0A0B] font-semibold rounded-xl hover:brightness-110 transition-all duration-200 disabled:opacity-50 whitespace-nowrap"
              >
                {isSubmitting ? 'Joining...' : 'Join Briefing'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export const IntelligenceHub = () => {
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlaybook, setSelectedPlaybook] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<'form' | 'success' | 'error'>('form');

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  // Toast state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Shadow Capital modal state
  const [isShadowCapitalModalOpen, setIsShadowCapitalModalOpen] = useState(false);
  const [shadowCapitalModalMode, setShadowCapitalModalMode] = useState<'form' | 'success' | 'error'>('form');

  // Introduction request state
  const [introRequestSent, setIntroRequestSent] = useState<string | null>(null);

  const userProgress = getUserProgress();
  const isLoggedIn = !!userProgress.email;
  const isAlphaMember = isPremiumMember();

  const triggerDownload = () => {
    // Create invisible link and trigger download
    const link = document.createElement('a');
    link.href = PMF_AUDIT_DOWNLOAD_URL;
    link.setAttribute('download', 'zScale-Capital-PMF-Audit-2026.pdf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const showSuccessToast = () => {
    setToastMessage('Intelligence Unlocked. Your 2026 PMF Audit is downloading now.');
    setShowToast(true);
  };

  const handlePlaybookClick = (playbookId: string) => {
    setSelectedPlaybook(playbookId);

    if (playbookId === 'pmf-audit') {
      // PMF Audit - immediate download flow
      if (isLoggedIn) {
        // Already have their info, track and download immediately
        submitPMFAuditLead({
          firstName: userProgress.firstName || '',
          lastName: userProgress.lastName || '',
          email: userProgress.email!,
          companyName: userProgress.company || '',
        });
        triggerDownload();
        showSuccessToast();
      } else {
        // Need to capture lead first
        setModalMode('form');
        setIsModalOpen(true);
      }
    } else {
      // Other playbooks - notification flow
      if (isLoggedIn) {
        trackPlaybookInterest(playbookId, userProgress.email!, userProgress.firstName || '');
        setModalMode('success');
        setIsModalOpen(true);
      } else {
        setModalMode('form');
        setIsModalOpen(true);
      }
    }
  };

  const submitPMFAuditLead = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    companyName: string;
  }) => {
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formType: FORM_TYPES.ECOSYSTEM_MAP, // Log to Ecosystem_Map tab
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          companyName: data.companyName,
          emailTier: getEmailTier(data.email), // 'Business' or 'Personal'
          leadStatus: 'High Intent',
          source: 'pmf-audit-download',
          playbookInterest: 'pmf-audit',
          timestamp: new Date().toISOString(),
        }),
      });
      return true;
    } catch (error) {
      console.error('Error submitting PMF Audit lead:', error);
      return false;
    }
  };

  const trackPlaybookInterest = async (playbookId: string, userEmail: string, userName: string) => {
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formType: FORM_TYPES.INTELLIGENCE_BRIEFING,
          email: userEmail,
          name: userName,
          playbookInterest: playbookId,
          source: 'intelligence-hub',
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error('Error tracking playbook interest:', error);
    }
  };

  // Shadow Capital functions
  const triggerShadowCapitalDownload = () => {
    const link = document.createElement('a');
    link.href = SHADOW_CAPITAL_DOWNLOAD_URL;
    link.setAttribute('download', 'zScale-Shadow-Capital-Landscape-2026.pdf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUnlockShadowCapital = () => {
    if (isLoggedIn) {
      // Already have their info, download immediately
      submitShadowCapitalLead({
        firstName: userProgress.firstName || '',
        lastName: userProgress.lastName || '',
        email: userProgress.email!,
        companyName: userProgress.company || '',
      });
      triggerShadowCapitalDownload();
      // Show toast notification
      setToastMessage('Intelligence Unlocked. Your 2026 Shadow Capital Report is downloading now.');
      setShowToast(true);
      // Show success modal with Alpha Hook (for non-Alpha members)
      if (!isAlphaMember) {
        setShadowCapitalModalMode('success');
        setIsShadowCapitalModalOpen(true);
      }
    } else {
      setShadowCapitalModalMode('form');
      setIsShadowCapitalModalOpen(true);
    }
  };

  const submitShadowCapitalLead = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    companyName: string;
  }) => {
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formType: FORM_TYPES.SHADOW_CAPITAL, // Routes to Ecosystem_Map tab + tags in Master_Registry
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          companyName: data.companyName,
          emailTier: getEmailTier(data.email), // 'Business' or 'Personal'
          leadStatus: 'High Intent',
          leadTag: 'Interested_in_Shadow_Capital',
          source: 'shadow-capital-landscape-download',
          playbookInterest: 'shadow-capital-landscape',
          timestamp: new Date().toISOString(),
        }),
      });
      return true;
    } catch (error) {
      console.error('Error submitting Shadow Capital lead:', error);
      return false;
    }
  };

  const handleShadowCapitalSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) return;

    setIsSubmitting(true);
    try {
      const success = await submitShadowCapitalLead({
        firstName,
        lastName,
        email,
        companyName,
      });

      // Store lead info locally
      localStorage.setItem('lead_email', email);
      localStorage.setItem('lead_name', `${firstName} ${lastName}`);
      localStorage.setItem(STORAGE_KEYS.USER_EMAIL, email);
      localStorage.setItem(STORAGE_KEYS.USER_FIRST_NAME, firstName);
      localStorage.setItem(STORAGE_KEYS.USER_LAST_NAME, lastName);
      localStorage.setItem(STORAGE_KEYS.USER_COMPANY, companyName);

      if (success) {
        // Trigger download immediately
        triggerShadowCapitalDownload();
        // Show success modal with Alpha Hook (instead of closing)
        setShadowCapitalModalMode('success');
        // Also show toast notification
        setToastMessage('Intelligence Unlocked. Your 2026 Shadow Capital Report is downloading now.');
        setShowToast(true);
        resetForm();
      } else {
        setShadowCapitalModalMode('error');
      }
    } catch {
      setShadowCapitalModalMode('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestIntroduction = async (partnerId: string, partnerName: string) => {
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formType: FORM_TYPES.INTELLIGENCE_BRIEFING,
          email: userProgress.email,
          firstName: userProgress.firstName,
          lastName: userProgress.lastName,
          companyName: userProgress.company,
          requestType: 'warm-introduction',
          partnerId,
          partnerName,
          source: 'intelligence-hub-intro-request',
          timestamp: new Date().toISOString(),
        }),
      });
      setIntroRequestSent(partnerId);
      setToastMessage(`Introduction request sent for ${partnerName}. Our team will reach out within 48 hours.`);
      setShowToast(true);
    } catch (error) {
      console.error('Error requesting introduction:', error);
    }
  };

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setCompanyName('');
    setEmailError(null);
  };

  const validateEmail = (emailValue: string): boolean => {
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
      setEmailError('Please enter a valid email address.');
      return false;
    }

    setEmailError(null);
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate work email
    if (!validateEmail(email)) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (selectedPlaybook === 'pmf-audit') {
        // PMF Audit download flow
        const success = await submitPMFAuditLead({
          firstName,
          lastName,
          email,
          companyName,
        });

        // Store lead info locally
        localStorage.setItem('lead_email', email);
        localStorage.setItem('lead_name', `${firstName} ${lastName}`);
        localStorage.setItem('zscale_user_email', email);
        localStorage.setItem('zscale_user_first_name', firstName);
        localStorage.setItem('zscale_user_last_name', lastName);
        localStorage.setItem('zscale_user_company', companyName);

        if (success) {
          // Trigger download and show toast
          triggerDownload();
          setIsModalOpen(false);
          showSuccessToast();
        } else {
          // Error but still provide download as fallback
          setModalMode('error');
        }
      } else {
        // Other playbooks - just notification signup
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            formType: FORM_TYPES.INTELLIGENCE_BRIEFING,
            firstName,
            lastName,
            email,
            companyName,
            emailTier: getEmailTier(email), // 'Business' or 'Personal'
            playbookInterest: selectedPlaybook,
            source: 'intelligence-hub',
            timestamp: new Date().toISOString(),
          }),
        });

        // Store lead info
        localStorage.setItem('lead_email', email);
        localStorage.setItem('lead_name', `${firstName} ${lastName}`);

        setModalMode('success');
      }
    } catch (error) {
      console.error('Error submitting:', error);
      if (selectedPlaybook === 'pmf-audit') {
        setModalMode('error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Reset form
    setFirstName('');
    setLastName('');
    setEmail('');
    setCompanyName('');
    setEmailError(null);
    setModalMode('form');
  };

  const getPlaybookTitle = (id: string | null) => {
    return playbooks.find((p) => p.id === id)?.title || 'Playbook';
  };

  return (
    <>
      <Helmet>
        <title>Intelligence Hub | Venture Standards & Playbooks | zScale Capital</title>
        <meta
          name="description"
          content="Access institutional-grade venture intelligence. The 2026 Venture Standards, PMF Evidence Audit, Venture Math Guide, and Cap Table Hygiene frameworks."
        />
        <meta
          name="keywords"
          content="venture capital intelligence, startup metrics, LTV CAC ratio, PMF evidence, cap table, venture math, Dallas startups"
        />
        <link rel="canonical" href="https://zscalecapital.com/intelligence" />
      </Helmet>

      <div className="min-h-screen bg-[#0A0A0B] pt-20">
        {/* Hero Section */}
        <section className="relative py-20 px-6 lg:px-12 overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />

          <div className="max-w-7xl mx-auto relative">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/30 rounded-full mb-6">
                <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                <span className="text-sm text-accent font-medium">Intelligence Hub</span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold text-[#FFFFFF] mb-6 leading-tight">
                The zScale Standard
              </h1>
              <p className="text-xl text-[#FFFFFF]/70 mb-8">
                Institutional-grade frameworks that define what 'fundable' means in North Texas.
                Built from pattern recognition across 200+ founder interactions.
              </p>

              {/* Primary CTA - Ecosystem Map */}
              <Link
                to="/ecosystem-map"
                className="inline-flex items-center gap-3 px-8 py-4 bg-accent text-[#0A0A0B] font-semibold rounded-xl hover:brightness-110 transition-all duration-200 shadow-[0_0_30px_rgba(1,249,198,0.3)]"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Access the 2026 Ecosystem Map
                <span className="px-2 py-0.5 bg-[#0A0A0B]/20 rounded text-xs">68 Pages</span>
              </Link>
            </div>
          </div>
        </section>

        {/* The 2026 Venture Standards */}
        <section className="py-20 px-6 lg:px-12 bg-ink-light border-t border-b border-ink-border">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-[#FFFFFF] mb-4">
                The 2026 Venture Standards
              </h2>
              <p className="text-lg text-[#FFFFFF]/60 max-w-2xl mx-auto">
                The three hurdle rates every founder must clear to be considered 'Institutional Grade'
                by Dallas-Fort Worth's most active investors.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {ventureStandards.map((standard, index) => (
                <div
                  key={index}
                  className="card-skeuomorphic p-8 text-center group hover:border-accent/30 transition-all duration-300"
                >
                  <div className="w-16 h-16 mx-auto mb-6 bg-accent/10 rounded-2xl flex items-center justify-center text-accent group-hover:bg-accent/20 transition-colors">
                    {standard.icon}
                  </div>

                  <div className="text-3xl lg:text-4xl font-bold text-accent mb-2">
                    {standard.metric}
                  </div>

                  <div className="text-lg font-semibold text-[#FFFFFF] mb-1">
                    {standard.label}
                  </div>

                  <div className="text-sm text-accent/80 mb-4">
                    {standard.sublabel}
                  </div>

                  <p className="text-sm text-[#FFFFFF]/60">
                    {standard.description}
                  </p>
                </div>
              ))}
            </div>

            {/* IRI CTA */}
            <div className="mt-12 text-center">
              <p className="text-[#FFFFFF]/60 mb-4">
                Not sure where you stand? Benchmark yourself against these standards.
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 border border-accent text-accent font-semibold rounded-xl hover:bg-accent hover:text-[#0A0A0B] transition-all duration-200"
              >
                Run Your IRI Assessment
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Playbook Section */}
        <section className="py-20 px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full mb-4">
                <span className="text-xs text-amber-400 font-medium">The Unlearning Series</span>
              </div>

              <h2 className="text-3xl lg:text-4xl font-bold text-[#FFFFFF] mb-4">
                Institutional Playbooks
              </h2>
              <p className="text-lg text-[#FFFFFF]/60 max-w-2xl mx-auto">
                Tactical frameworks to help you unlearn startup myths and adopt institutional thinking.
                Built from real patterns we see in fundable vs. struggling companies.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {playbooks.map((playbook) => (
                <div
                  key={playbook.id}
                  className={`relative overflow-hidden group ${
                    playbook.id === 'pmf-audit'
                      ? 'bg-[#0A0A0B] border-2 border-accent rounded-2xl p-6 shadow-[0_0_40px_rgba(1,249,198,0.15)]'
                      : 'card-skeuomorphic p-6'
                  }`}
                >
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    {playbook.status === 'available' ? (
                      <span className="px-3 py-1 bg-accent/20 border border-accent rounded-full text-xs text-accent font-semibold">
                        Available Now
                      </span>
                    ) : playbook.status === 'alpha-early-access' ? (
                      <span className="px-3 py-1 bg-accent/10 border border-accent/30 rounded-full text-xs text-accent font-medium">
                        Alpha Early Access
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-[#FFFFFF]/5 border border-[#FFFFFF]/10 rounded-full text-xs text-[#FFFFFF]/50 font-medium">
                        Coming Q1 2026
                      </span>
                    )}
                  </div>

                  {/* Logo for PMF Audit */}
                  {playbook.id === 'pmf-audit' ? (
                    <div className="mb-4">
                      <Logo size="sm" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 mb-4 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                      {playbook.icon}
                    </div>
                  )}

                  {/* Content */}
                  <h3 className={`text-xl font-bold mb-2 ${
                    playbook.id === 'pmf-audit' ? 'text-accent' : 'text-[#FFFFFF]'
                  }`}>
                    {playbook.title}
                  </h3>
                  <p className={`text-xs font-medium mb-3 ${
                    playbook.id === 'pmf-audit' ? 'text-[#FFFFFF]/80' : 'text-accent/70'
                  }`}>
                    {playbook.subtitle}
                  </p>
                  <p className="text-sm text-[#FFFFFF]/60 mb-6">
                    {playbook.description}
                  </p>

                  {/* CTA */}
                  <button
                    onClick={() => handlePlaybookClick(playbook.id)}
                    className={`w-full py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                      playbook.status === 'available'
                        ? 'bg-accent text-[#0A0A0B] hover:brightness-110 shadow-[0_0_20px_rgba(1,249,198,0.3)]'
                        : 'border border-ink-border text-[#FFFFFF] hover:border-accent hover:text-accent'
                    }`}
                  >
                    {playbook.status === 'available' ? (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download Now
                      </>
                    ) : playbook.status === 'alpha-early-access' ? (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Request Alpha Access
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        Notify Me on Launch
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Inline Lead Unit: Standardization Briefing */}
        <section className="py-12 px-6 lg:px-12 bg-ink-light border-t border-ink-border">
          <div className="max-w-4xl mx-auto">
            <InlineBriefingSignup />
          </div>
        </section>

        {/* The zScale Shadow Capital Landscape - Featured Card */}
        <section className="py-20 px-6 lg:px-12">
          <div className="max-w-4xl mx-auto">
            {/* Featured Dark Card with Teal Border */}
            <div className="relative bg-[#0A0A0B] border-2 border-accent rounded-2xl p-8 lg:p-10 shadow-[0_0_60px_rgba(1,249,198,0.15)] overflow-hidden">
              {/* Background gradient effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent pointer-events-none" />

              {/* Content */}
              <div className="relative">
                {/* Logo */}
                <div className="mb-6">
                  <Logo size="sm" />
                </div>

                {/* Title */}
                <h2 className="text-2xl lg:text-3xl font-bold text-accent mb-3">
                  The zScale Shadow Capital Landscape
                </h2>

                {/* Subtitle */}
                <p className="text-lg text-[#FFFFFF]/80 mb-8">
                  Navigating the 35+ Private Family Offices of North Texas
                </p>

                {/* Featured Frameworks - Bullet Points */}
                <div className="space-y-4 mb-8">
                  {/* Geography of Wealth */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-accent/10 border border-accent/30 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#FFFFFF] mb-1">Geography of Wealth</h4>
                      <p className="text-sm text-[#FFFFFF]/60">From Preston Hollow to Highland Park.</p>
                    </div>
                  </div>

                  {/* Sector Heatmaps */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-accent/10 border border-accent/30 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#FFFFFF] mb-1">Sector Heatmaps</h4>
                      <p className="text-sm text-[#FFFFFF]/60">PropTech, Energy, and Industrial Automation.</p>
                    </div>
                  </div>

                  {/* The Unwritten Rules */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-accent/10 border border-accent/30 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#FFFFFF] mb-1">The Unwritten Rules</h4>
                      <p className="text-sm text-[#FFFFFF]/60">Mastering the Dallas 'Handshake Economy'.</p>
                    </div>
                  </div>
                </div>

                {/* Download CTA */}
                <button
                  onClick={handleUnlockShadowCapital}
                  className="w-full sm:w-auto px-8 py-4 bg-accent text-[#0A0A0B] font-semibold rounded-xl hover:brightness-110 transition-all duration-200 shadow-[0_0_30px_rgba(1,249,198,0.3)] flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download the 2026 Shadow Capital Report
                </button>

                {/* Authority note */}
                <p className="mt-4 text-xs text-[#FFFFFF]/40">
                  Names and introduction protocols are locked. IRI Score 70+ required for handshake access.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Shadow Capital Section */}
        <section className="py-20 px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/30 rounded-full mb-4">
                <span className="text-xs text-accent font-medium">Shadow Capital Network</span>
              </div>

              <h2 className="text-3xl lg:text-4xl font-bold text-[#FFFFFF] mb-4">
                35+ Dallas Family Offices
              </h2>
              <p className="text-lg text-[#FFFFFF]/60 max-w-2xl mx-auto">
                Direct access to the private capital sources that don't advertise.
                Family offices and private investors actively deploying in North Texas.
              </p>
            </div>

            {/* Family Office Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {familyOffices.map((office, index) => {
                const isLocked = !isAlphaMember && index >= 3;

                return (
                  <div
                    key={office.id}
                    className={`relative card-skeuomorphic p-5 ${isLocked ? 'select-none' : ''}`}
                  >
                    {/* Blur overlay for locked cards */}
                    {isLocked && (
                      <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm rounded-2xl z-10" />
                    )}

                    {/* Card Content */}
                    <div className={isLocked ? 'blur-sm' : ''}>
                      <h4 className="font-semibold text-[#FFFFFF] mb-2 text-sm">
                        {office.name}
                      </h4>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-neutral-500">Sector:</span>
                          <span className="text-xs text-accent">{office.sector}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-neutral-500">AUM:</span>
                          <span className="text-xs text-[#FFFFFF]/80">{office.aum}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-neutral-500">Focus:</span>
                          <span className="text-xs text-[#FFFFFF]/60">{office.investmentFocus}</span>
                        </div>
                      </div>

                      {/* Alpha-only: Request Introduction Button */}
                      {isAlphaMember && (
                        <button
                          onClick={() => handleRequestIntroduction(office.id, office.name)}
                          disabled={introRequestSent === office.id}
                          className={`mt-4 w-full py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1.5 ${
                            introRequestSent === office.id
                              ? 'bg-accent/20 text-accent cursor-default'
                              : 'border border-accent/50 text-accent hover:bg-accent hover:text-[#0A0A0B]'
                          }`}
                        >
                          {introRequestSent === office.id ? (
                            <>
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Request Sent
                            </>
                          ) : (
                            <>
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                              Request Warm Introduction
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Unlock CTA - Only show for non-Alpha members */}
            {!isAlphaMember && (
              <div className="text-center">
                <button
                  onClick={handleUnlockShadowCapital}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-accent text-[#0A0A0B] font-semibold rounded-xl hover:brightness-110 transition-all duration-200 shadow-[0_0_30px_rgba(1,249,198,0.3)]"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                  Unlock Full Shadow Capital List
                </button>
                <p className="mt-3 text-sm text-[#FFFFFF]/40">
                  Download the complete 2026 Shadow Capital Landscape Report
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Institutional Partners - Alpha Members Only */}
        {isAlphaMember && (
          <section className="py-20 px-6 lg:px-12">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/20 border border-accent rounded-full mb-4">
                  <svg className="w-3.5 h-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  <span className="text-xs text-accent font-semibold">Alpha Member Access</span>
                </div>

                <h2 className="text-3xl lg:text-4xl font-bold text-[#FFFFFF] mb-4">
                  Institutional Partners
                </h2>
                <p className="text-lg text-[#FFFFFF]/60 max-w-2xl mx-auto">
                  Tier-1 venture funds actively deploying in Dallas-Fort Worth.
                  Request warm introductions through your Alpha membership.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {institutionalPartners.map((partner) => (
                  <div
                    key={partner.id}
                    className="card-skeuomorphic p-5 border border-accent/20"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        partner.dealFlow === 'High Activity'
                          ? 'bg-green-500/20 text-green-400'
                          : partner.dealFlow === 'Selective'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {partner.dealFlow}
                      </span>
                    </div>

                    <h4 className="font-semibold text-accent mb-1">
                      {partner.name}
                    </h4>
                    <p className="text-xs text-[#FFFFFF]/60 mb-3">{partner.type}</p>

                    <div className="space-y-1.5 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-neutral-500">Check Size:</span>
                        <span className="text-xs text-[#FFFFFF]/80">{partner.checkSize}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-neutral-500">Focus:</span>
                        <span className="text-xs text-accent">{partner.focus}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRequestIntroduction(partner.id, partner.name)}
                      disabled={introRequestSent === partner.id}
                      className={`w-full py-2.5 px-3 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 ${
                        introRequestSent === partner.id
                          ? 'bg-accent/20 text-accent cursor-default'
                          : 'bg-accent text-[#0A0A0B] hover:brightness-110'
                      }`}
                    >
                      {introRequestSent === partner.id ? (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Introduction Requested
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          Request Warm Introduction
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Authority Bar */}
        <section className="py-12 px-6 lg:px-12 bg-ink-light border-t border-ink-border">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm text-[#FFFFFF]/40 mb-4">
              The zScale Standard is built from
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-[#FFFFFF]/60">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-accent">200+</span>
                <span className="text-sm">Founder Interactions</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-accent">68</span>
                <span className="text-sm">Pages of Research</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-accent">35+</span>
                <span className="text-sm">Family Office Relationships</span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 lg:px-12">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-accent to-accent-hover rounded-2xl p-8 lg:p-12 text-center">
              <h2 className="text-2xl lg:text-3xl font-bold mb-4 text-[#0A0A0B]">
                Ready to Meet the Standard?
              </h2>
              <p className="text-lg mb-8 max-w-xl mx-auto text-[#0A0A0B]/80">
                Start with the Investment Readiness Index to see where you stand against the 2026 Venture Standards.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#0A0A0B] text-accent font-semibold rounded-xl hover:bg-[#1a1a1b] transition-colors"
                >
                  Run IRI Assessment
                </Link>
                <Link
                  to="/ecosystem-map"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#0A0A0B]/10 text-[#0A0A0B] font-semibold rounded-xl hover:bg-[#0A0A0B]/20 transition-colors border border-[#0A0A0B]/20"
                >
                  Download Ecosystem Map
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Lead Capture Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        {modalMode === 'success' ? (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-accent/10 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 id="modal-title" className="text-2xl font-semibold text-white mb-2">
              You're on the List!
            </h2>
            <p className="text-neutral-400 mb-6">
              We'll notify you when <span className="text-accent font-medium">{getPlaybookTitle(selectedPlaybook)}</span> drops.
              Alpha members get early access.
            </p>
            <Link
              to="/membership"
              onClick={handleCloseModal}
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-[#0A0A0B] font-semibold rounded-xl hover:brightness-110 transition-all"
            >
              Join Alpha for Early Access
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        ) : modalMode === 'error' ? (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-amber-500/10 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 id="modal-title" className="text-2xl font-semibold text-white mb-2">
              Something went wrong
            </h2>
            <p className="text-neutral-400 mb-6">
              We couldn't complete the registration, but you can still download your PMF Audit.
            </p>
            <a
              href={PMF_AUDIT_DOWNLOAD_URL}
              onClick={() => {
                handleCloseModal();
                showSuccessToast();
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-[#0A0A0B] font-semibold rounded-xl hover:brightness-110 transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download PMF Audit
            </a>
          </div>
        ) : (
          <div>
            {/* PMF Audit Modal Header */}
            {selectedPlaybook === 'pmf-audit' ? (
              <div className="text-center mb-6">
                <div className="mb-4">
                  <Logo size="sm" />
                </div>
                <h2 id="modal-title" className="text-2xl font-bold text-accent mb-2">
                  zScale Capital PMF Audit
                </h2>
                <p className="text-sm text-[#FFFFFF]/70">
                  The 2026 Institutional Framework for Replicable Product-Market Fit.
                </p>
              </div>
            ) : (
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-accent/10 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <h2 id="modal-title" className="text-2xl font-semibold text-white mb-2">
                  Get the Intelligence Briefing
                </h2>
                <p className="text-neutral-400">
                  Sign up to be notified when <span className="text-accent font-medium">{getPlaybookTitle(selectedPlaybook)}</span> drops.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-neutral-400 mb-1">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="w-full py-3 px-4 border border-ink-border rounded-xl bg-ink-medium text-white transition-all duration-200 focus:outline-none focus:border-accent placeholder:text-neutral-500"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-neutral-400 mb-1">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="w-full py-3 px-4 border border-ink-border rounded-xl bg-ink-medium text-white transition-all duration-200 focus:outline-none focus:border-accent placeholder:text-neutral-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-400 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError(null);
                  }}
                  onBlur={() => email && validateEmail(email)}
                  required
                  className={`w-full py-3 px-4 border rounded-xl bg-ink-medium text-white transition-all duration-200 focus:outline-none placeholder:text-neutral-500 ${
                    emailError ? 'border-red-500 focus:border-red-500' : 'border-ink-border focus:border-accent'
                  }`}
                />
                {emailError ? (
                  <p className="mt-1 text-xs text-red-400">{emailError}</p>
                ) : (
                  <p className="mt-1.5 text-xs text-neutral-500">
                    Your data is secured. We accept personal emails for stealth-mode founders.
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-neutral-400 mb-1">
                  Company Name
                </label>
                <input
                  id="companyName"
                  type="text"
                  placeholder="Your company"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  className="w-full py-3 px-4 border border-ink-border rounded-xl bg-ink-medium text-white transition-all duration-200 focus:outline-none focus:border-accent placeholder:text-neutral-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 bg-accent text-[#0A0A0B] font-semibold rounded-xl transition-all duration-200 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  'Processing...'
                ) : selectedPlaybook === 'pmf-audit' ? (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download PMF Audit
                  </>
                ) : (
                  'Notify Me on Launch'
                )}
              </button>
            </form>

            <p className="text-xs text-neutral-500 mt-4 text-center">
              We respect your privacy. No spam, unsubscribe anytime.
            </p>
          </div>
        )}
      </Modal>

      {/* Shadow Capital Lead Capture Modal */}
      <Modal
        isOpen={isShadowCapitalModalOpen}
        onClose={() => {
          setIsShadowCapitalModalOpen(false);
          setShadowCapitalModalMode('form');
          resetForm();
        }}
      >
        {shadowCapitalModalMode === 'success' ? (
          <div className="text-center">
            {/* Success Icon */}
            <div className="w-16 h-16 mx-auto mb-6 bg-accent/10 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            {/* Success Message */}
            <h2 id="modal-title" className="text-2xl font-bold text-accent mb-2">
              Intelligence Unlocked
            </h2>
            <p className="text-[#FFFFFF]/70 mb-6">
              Your 2026 Shadow Capital Report is downloading now.
            </p>

            {/* Alpha Hook - Key Conversion Driver */}
            <div className="bg-[#0A0A0B] border border-accent/30 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-center gap-2 mb-3">
                <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-sm font-semibold text-accent">Ready for the Handshake?</span>
              </div>
              <p className="text-sm text-[#FFFFFF]/60 mb-4">
                Alpha Members get direct introduction paths to the names in this report.
              </p>
              <Link
                to="/membership"
                onClick={() => {
                  setIsShadowCapitalModalOpen(false);
                  setShadowCapitalModalMode('form');
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-[#0A0A0B] font-semibold rounded-xl hover:brightness-110 transition-all"
              >
                Unlock Alpha Access
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            {/* IRI Score Requirement Note */}
            <p className="text-xs text-[#FFFFFF]/40">
              IRI Score 70+ required. <Link to="/" className="text-accent hover:underline">Run your assessment</Link> to check eligibility.
            </p>
          </div>
        ) : shadowCapitalModalMode === 'error' ? (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-amber-500/10 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 id="modal-title" className="text-2xl font-semibold text-white mb-2">
              Something went wrong
            </h2>
            <p className="text-neutral-400 mb-6">
              We couldn't complete the registration, but you can still download the report.
            </p>
            <a
              href={SHADOW_CAPITAL_DOWNLOAD_URL}
              onClick={() => {
                setIsShadowCapitalModalOpen(false);
                setToastMessage('Intelligence Unlocked. Your 2026 Shadow Capital Report is downloading now.');
                setShowToast(true);
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-[#0A0A0B] font-semibold rounded-xl hover:brightness-110 transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Report
            </a>
          </div>
        ) : (
          <div>
            <div className="text-center mb-6">
              <div className="mb-4">
                <Logo size="sm" />
              </div>
              <h2 id="modal-title" className="text-2xl font-bold text-accent mb-2">
                2026 Shadow Capital Landscape
              </h2>
              <p className="text-sm text-[#FFFFFF]/70">
                35+ Dallas family offices and private capital sources. Complete with investment thesis, check sizes, and sector focus.
              </p>
            </div>

            <form onSubmit={handleShadowCapitalSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="sc-firstName" className="block text-sm font-medium text-neutral-400 mb-1">
                    First Name
                  </label>
                  <input
                    id="sc-firstName"
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="w-full py-3 px-4 border border-ink-border rounded-xl bg-ink-medium text-white transition-all duration-200 focus:outline-none focus:border-accent placeholder:text-neutral-500"
                  />
                </div>
                <div>
                  <label htmlFor="sc-lastName" className="block text-sm font-medium text-neutral-400 mb-1">
                    Last Name
                  </label>
                  <input
                    id="sc-lastName"
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="w-full py-3 px-4 border border-ink-border rounded-xl bg-ink-medium text-white transition-all duration-200 focus:outline-none focus:border-accent placeholder:text-neutral-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="sc-email" className="block text-sm font-medium text-neutral-400 mb-1">
                  Email Address
                </label>
                <input
                  id="sc-email"
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError(null);
                  }}
                  onBlur={() => email && validateEmail(email)}
                  required
                  className={`w-full py-3 px-4 border rounded-xl bg-ink-medium text-white transition-all duration-200 focus:outline-none placeholder:text-neutral-500 ${
                    emailError ? 'border-red-500 focus:border-red-500' : 'border-ink-border focus:border-accent'
                  }`}
                />
                {emailError ? (
                  <p className="mt-1 text-xs text-red-400">{emailError}</p>
                ) : (
                  <p className="mt-1.5 text-xs text-neutral-500">
                    Your data is secured. We accept personal emails for stealth-mode founders.
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="sc-companyName" className="block text-sm font-medium text-neutral-400 mb-1">
                  Company Name
                </label>
                <input
                  id="sc-companyName"
                  type="text"
                  placeholder="Your company"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  className="w-full py-3 px-4 border border-ink-border rounded-xl bg-ink-medium text-white transition-all duration-200 focus:outline-none focus:border-accent placeholder:text-neutral-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 bg-accent text-[#0A0A0B] font-semibold rounded-xl transition-all duration-200 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  'Processing...'
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

            <p className="text-xs text-neutral-500 mt-4 text-center">
              We respect your privacy. No spam, unsubscribe anytime.
            </p>
          </div>
        )}
      </Modal>

      {/* Success Toast */}
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </>
  );
};
