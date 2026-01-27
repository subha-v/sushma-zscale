import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollReveal = () => {
  const location = useLocation();

  useEffect(() => {
    let scrollHandler: (() => void) | null = null;

    // Small delay to ensure DOM has updated after route change
    const initTimeout = setTimeout(() => {
      const revealOnScroll = () => {
        const revealElements = document.querySelectorAll('.reveal');
        const windowHeight = window.innerHeight;
        const revealPoint = 120;

        revealElements.forEach((element) => {
          const elementTop = element.getBoundingClientRect().top;

          if (elementTop < windowHeight - revealPoint) {
            element.classList.add('visible');
          }
        });
      };

      // Initial check
      revealOnScroll();

      // Throttled scroll listener
      let ticking = false;
      scrollHandler = () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            revealOnScroll();
            ticking = false;
          });
          ticking = true;
        }
      };

      window.addEventListener('scroll', scrollHandler);
    }, 50);

    return () => {
      clearTimeout(initTimeout);
      if (scrollHandler) {
        window.removeEventListener('scroll', scrollHandler);
      }
    };
  }, [location.pathname]); // Re-run when route changes
};
