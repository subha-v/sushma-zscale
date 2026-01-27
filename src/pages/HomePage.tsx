import { useState, useEffect } from 'react';
import { Hero } from '../components/Hero';
import { AlphaBar } from '../components/AlphaBar';
import { FounderTools } from '../components/FounderTools';
import { DallasExitGap } from '../components/DallasExitGap';
import { SuccessBenchmarks } from '../components/SuccessBenchmarks';
import { Advisors } from '../components/Advisors';
import { FAQ } from '../components/FAQ';
import { ReadinessAssessmentPopup } from '../components/ReadinessAssessmentPopup';
import { DiagnosticModal } from '../components/Diagnostic';

const POPUP_STORAGE_KEY = 'hasSeenReadinessPopup';
const TIME_DELAY = 10000; // 10 seconds
const SCROLL_THRESHOLD = 0.5; // 50% scroll

export const HomePage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showDiagnosticModal, setShowDiagnosticModal] = useState(false);

  useEffect(() => {
    // Check if user has already seen the popup
    const hasSeenPopup = localStorage.getItem(POPUP_STORAGE_KEY);
    if (hasSeenPopup) return;

    let hasTriggered = false;

    // Timer trigger - 10 seconds
    const timeoutId = setTimeout(() => {
      if (!hasTriggered) {
        hasTriggered = true;
        setShowPopup(true);
      }
    }, TIME_DELAY);

    // Scroll trigger - 50% down the page
    const handleScroll = () => {
      if (hasTriggered) return;

      const scrollPercentage = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;

      if (scrollPercentage >= SCROLL_THRESHOLD) {
        hasTriggered = true;
        setShowPopup(true);
        clearTimeout(timeoutId);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleClosePopup = () => {
    setShowPopup(false);
    localStorage.setItem(POPUP_STORAGE_KEY, new Date().toISOString());
  };

  const handleOpenDiagnostic = () => {
    setShowDiagnosticModal(true);
  };

  const handleCloseDiagnostic = () => {
    setShowDiagnosticModal(false);
  };

  const handleDiagnosticComplete = () => {
    setShowDiagnosticModal(false);
    // Could show a success toast here
  };

  return (
    <>
      <Hero />
      <AlphaBar />
      <FounderTools />
      <DallasExitGap />
      <SuccessBenchmarks />
      <Advisors onOpenDiagnostic={handleOpenDiagnostic} />
      <FAQ />

      <ReadinessAssessmentPopup isOpen={showPopup} onClose={handleClosePopup} />
      <DiagnosticModal
        isOpen={showDiagnosticModal}
        onClose={handleCloseDiagnostic}
        onComplete={handleDiagnosticComplete}
      />
    </>
  );
};
