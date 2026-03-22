/**
 * zScale Capital - Main JavaScript
 * Version: 2.1.0
 * Vanilla JS, no dependencies
 * Security: No inline handlers, input validation, XSS prevention
 */

'use strict';

/**
 * DOM Ready Handler
 */
document.addEventListener('DOMContentLoaded', function() {
  initNavigation();
  initScrollEffects();
  initFAQ();
  initForms();
  initLazyLoading();
  initAnalytics();
});

/**
 * ================================
 * NAVIGATION
 * ================================
 */
function initNavigation() {
  const nav = document.getElementById('mainNav');
  const menuBtn = document.getElementById('navMenuBtn');
  const mobileMenu = document.getElementById('navMobile');
  const mobileLinks = document.querySelectorAll('.nav-mobile-link');

  if (!nav) return;

  // Mobile menu toggle
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', function() {
      const isActive = menuBtn.classList.contains('active');
      menuBtn.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      menuBtn.setAttribute('aria-expanded', !isActive);

      // Prevent body scroll when menu is open
      document.body.style.overflow = isActive ? '' : 'hidden';
    });

    // Close menu when clicking a link
    mobileLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        menuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        menuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // Scroll effects for nav
  let lastScrollY = 0;
  let ticking = false;

  function updateNav() {
    const scrollY = window.scrollY;

    // Add shadow when scrolled
    if (scrollY > 10) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    lastScrollY = scrollY;
    ticking = false;
  }

  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(updateNav);
      ticking = true;
    }
  }, { passive: true });

  // Active link highlighting
  highlightActiveLink();
}

/**
 * Highlight active navigation link based on current page
 */
function highlightActiveLink() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link, .nav-mobile-link');

  navLinks.forEach(function(link) {
    const href = link.getAttribute('href');
    if (href === currentPath ||
        (currentPath === '/' && href === 'index.html') ||
        (currentPath.endsWith(href))) {
      link.classList.add('active');
    }
  });
}

/**
 * ================================
 * SCROLL EFFECTS
 * ================================
 */
function initScrollEffects() {
  initStatsBar();
  initRevealOnScroll();
  initSmoothScroll();
}

/**
 * Stats bar visibility on scroll
 */
function initStatsBar() {
  const statsBar = document.getElementById('statsBar');
  if (!statsBar) return;

  const threshold = 300;
  let ticking = false;

  function updateStatsBar() {
    if (window.scrollY > threshold) {
      statsBar.classList.add('visible');
    } else {
      statsBar.classList.remove('visible');
    }
    ticking = false;
  }

  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(updateStatsBar);
      ticking = true;
    }
  }, { passive: true });
}

/**
 * Reveal elements on scroll with Intersection Observer
 */
function initRevealOnScroll() {
  const revealElements = document.querySelectorAll('.reveal');

  if (!revealElements.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(function(el) {
    observer.observe(el);
  });
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      e.preventDefault();

      const nav = document.getElementById('mainNav');
      const navHeight = nav ? nav.offsetHeight : 0;
      const statsBar = document.getElementById('statsBar');
      const statsBarHeight = statsBar && statsBar.classList.contains('visible')
        ? statsBar.offsetHeight
        : 0;
      const offset = navHeight + statsBarHeight + 20;

      const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });

      // Update URL without triggering scroll
      history.pushState(null, '', targetId);
    });
  });
}

/**
 * ================================
 * FAQ ACCORDION
 * ================================
 */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  if (!faqItems.length) return;

  faqItems.forEach(function(item) {
    const question = item.querySelector('.faq-question');

    if (!question) return;

    question.addEventListener('click', function() {
      const isOpen = item.classList.contains('open');
      const answer = item.querySelector('.faq-answer');

      // Close all other items
      faqItems.forEach(function(otherItem) {
        if (otherItem !== item) {
          otherItem.classList.remove('open');
          const otherQuestion = otherItem.querySelector('.faq-question');
          if (otherQuestion) {
            otherQuestion.setAttribute('aria-expanded', 'false');
          }
        }
      });

      // Toggle current item
      if (isOpen) {
        item.classList.remove('open');
        question.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
      }
    });

    // Keyboard accessibility
    question.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        question.click();
      }
    });
  });
}

/**
 * ================================
 * FORMS - Secure Input Handling
 * ================================
 */
function initForms() {
  const forms = document.querySelectorAll('form[data-validate]');

  forms.forEach(function(form) {
    form.addEventListener('submit', handleFormSubmit);

    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(function(input) {
      input.addEventListener('blur', function() {
        validateField(input);
      });

      input.addEventListener('input', function() {
        // Clear error on input
        const errorEl = input.parentElement.querySelector('.form-error');
        if (errorEl) {
          errorEl.textContent = '';
        }
        input.classList.remove('invalid');
      });
    });
  });
}

/**
 * Handle form submission with validation
 */
function handleFormSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const inputs = form.querySelectorAll('input, textarea, select');
  let isValid = true;

  // Validate all fields
  inputs.forEach(function(input) {
    if (!validateField(input)) {
      isValid = false;
    }
  });

  if (!isValid) {
    return;
  }

  // Collect form data
  const formData = new FormData(form);
  const data = {};

  formData.forEach(function(value, key) {
    // Sanitize input to prevent XSS
    data[key] = sanitizeInput(value);
  });

  // Submit form (placeholder - would connect to backend)
  console.log('Form submitted:', data);

  // Show success message
  showFormSuccess(form);
}

/**
 * Validate individual form field
 */
function validateField(input) {
  const value = input.value.trim();
  const type = input.type;
  const required = input.hasAttribute('required');
  const minLength = input.getAttribute('minlength');
  const maxLength = input.getAttribute('maxlength');
  const pattern = input.getAttribute('pattern');

  let errorMessage = '';

  // Required validation
  if (required && !value) {
    errorMessage = 'This field is required';
  }

  // Email validation
  if (type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      errorMessage = 'Please enter a valid email address';
    }
  }

  // Min length validation
  if (minLength && value.length < parseInt(minLength)) {
    errorMessage = 'Minimum ' + minLength + ' characters required';
  }

  // Max length validation
  if (maxLength && value.length > parseInt(maxLength)) {
    errorMessage = 'Maximum ' + maxLength + ' characters allowed';
  }

  // Pattern validation
  if (pattern && value) {
    const regex = new RegExp(pattern);
    if (!regex.test(value)) {
      errorMessage = input.getAttribute('data-pattern-error') || 'Invalid format';
    }
  }

  // Show/hide error
  const errorEl = input.parentElement.querySelector('.form-error');
  if (errorEl) {
    errorEl.textContent = errorMessage;
  }

  if (errorMessage) {
    input.classList.add('invalid');
    return false;
  } else {
    input.classList.remove('invalid');
    return true;
  }
}

/**
 * Sanitize user input to prevent XSS
 */
function sanitizeInput(value) {
  if (typeof value !== 'string') {
    return value;
  }

  const div = document.createElement('div');
  div.textContent = value;
  return div.innerHTML;
}

/**
 * Show form success message
 */
function showFormSuccess(form) {
  const successMessage = form.querySelector('.form-success');
  if (successMessage) {
    successMessage.classList.add('visible');
  }

  // Reset form
  form.reset();

  // Hide success message after 5 seconds
  setTimeout(function() {
    if (successMessage) {
      successMessage.classList.remove('visible');
    }
  }, 5000);
}

/**
 * ================================
 * LAZY LOADING
 * ================================
 */
function initLazyLoading() {
  // Check for native lazy loading support
  if ('loading' in HTMLImageElement.prototype) {
    // Native lazy loading is supported
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(function(img) {
      img.src = img.dataset.src;
      img.loading = 'lazy';
    });
  } else {
    // Fallback to Intersection Observer
    const images = document.querySelectorAll('img[data-src]');

    if (!images.length) return;

    const imageObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px'
    });

    images.forEach(function(img) {
      imageObserver.observe(img);
    });
  }
}

/**
 * ================================
 * ANALYTICS (Privacy-Respecting)
 * ================================
 */
function initAnalytics() {
  // Only track if user hasn't opted out
  if (navigator.doNotTrack === '1') {
    console.log('Do Not Track enabled - analytics disabled');
    return;
  }

  // Track page views
  trackPageView();

  // Track outbound links
  trackOutboundLinks();

  // Track CTA clicks
  trackCTAClicks();
}

/**
 * Track page view
 */
function trackPageView() {
  const pageData = {
    path: window.location.pathname,
    title: document.title,
    referrer: document.referrer,
    timestamp: new Date().toISOString()
  };

  // Would send to analytics endpoint
  console.log('Page view:', pageData);
}

/**
 * Track outbound links
 */
function trackOutboundLinks() {
  document.querySelectorAll('a[href^="http"]').forEach(function(link) {
    // Only track external links
    if (link.hostname !== window.location.hostname) {
      link.addEventListener('click', function() {
        const linkData = {
          type: 'outbound_link',
          url: link.href,
          text: link.textContent.trim().substring(0, 50),
          timestamp: new Date().toISOString()
        };
        console.log('Outbound link:', linkData);
      });
    }
  });
}

/**
 * Track CTA button clicks
 */
function trackCTAClicks() {
  document.querySelectorAll('[data-track-cta]').forEach(function(cta) {
    cta.addEventListener('click', function() {
      const ctaData = {
        type: 'cta_click',
        name: cta.getAttribute('data-track-cta'),
        text: cta.textContent.trim().substring(0, 50),
        timestamp: new Date().toISOString()
      };
      console.log('CTA click:', ctaData);
    });
  });
}

/**
 * ================================
 * UTILITY FUNCTIONS
 * ================================
 */

/**
 * Debounce function for performance
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction() {
    const context = this;
    const args = arguments;
    const later = function() {
      timeout = null;
      func.apply(context, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for scroll events
 */
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(function() {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Format number with commas
 */
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Format currency
 */
function formatCurrency(num) {
  if (num >= 1e9) {
    return '$' + (num / 1e9).toFixed(1) + 'B';
  } else if (num >= 1e6) {
    return '$' + (num / 1e6).toFixed(0) + 'M';
  } else if (num >= 1e3) {
    return '$' + (num / 1e3).toFixed(0) + 'K';
  }
  return '$' + num.toString();
}

/**
 * ================================
 * DYNAMIC DATA LOADING
 * ================================
 */

/**
 * Load stats from JSON file
 */
async function loadStats() {
  try {
    const response = await fetch('data/stats.json');
    if (!response.ok) {
      throw new Error('Failed to load stats');
    }
    const data = await response.json();
    updateStatsDisplay(data);
    return data;
  } catch (error) {
    console.error('Error loading stats:', error);
    return null;
  }
}

/**
 * Update stats display with loaded data
 */
function updateStatsDisplay(data) {
  if (!data || !data.metrics) return;

  const metrics = data.metrics;

  // Update stat elements by data attribute
  document.querySelectorAll('[data-stat]').forEach(function(el) {
    const statKey = el.getAttribute('data-stat');
    const metric = metrics[statKey];

    if (metric) {
      const valueEl = el.querySelector('.stat-value, .hero-stat-value, .stats-bar-value');
      if (valueEl) {
        valueEl.textContent = metric.formatted || formatNumber(metric.value) + (metric.unit || '');
      }

      const sourceEl = el.querySelector('.stat-source');
      if (sourceEl) {
        sourceEl.textContent = 'Source: ' + metric.source;
      }
    }
  });
}

/**
 * ================================
 * ERROR HANDLING
 * ================================
 */
window.addEventListener('error', function(e) {
  console.error('JavaScript error:', e.message, e.filename, e.lineno);
});

window.addEventListener('unhandledrejection', function(e) {
  console.error('Unhandled promise rejection:', e.reason);
});

/**
 * ================================
 * EXPORTS (for testing)
 * ================================
 */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    sanitizeInput,
    validateField,
    formatNumber,
    formatCurrency,
    debounce,
    throttle
  };
}
