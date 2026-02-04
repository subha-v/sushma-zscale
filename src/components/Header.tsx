import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { IRIModal } from './IRI';
import { ShadowCapitalModal } from './ShadowCapitalModal';
import { VentureBenchmarksModal } from './VentureBenchmarksModal';
import { EcosystemMapDownloadModal } from './EcosystemMapDownloadModal';
import { ToolLeadCaptureModal } from './ToolLeadCaptureModal';
import { FORM_TYPES } from '../config/api';

interface DropdownItem {
  label: string;
  href: string;
  description?: string;
  isIRI?: boolean;
  isShadowCapital?: boolean;
  isVentureBenchmarks?: boolean;
  isEcosystemMap?: boolean;
  isAcceleratorPrep?: boolean;
}

interface NavItem {
  label: string;
  href?: string;
  dropdown?: DropdownItem[];
}

const navItems: NavItem[] = [
  {
    label: 'The Platform',
    dropdown: [
      { label: 'Venture Studio', href: '/studio', description: 'AI-powered startup services' },
      { label: 'Apply to Build', href: '/apply', description: 'Partner with zScale' },
      { label: 'Investment Readiness Index', href: '#', description: 'Assess your fundraise readiness', isIRI: true },
      { label: 'Advisor Equity Calculator', href: '/tools/equity-calculator', description: 'Calculate fair advisor equity' },
      { label: 'Accelerator Prep', href: '/tools/accelerator-checklist', description: 'Get accelerator-ready', isAcceleratorPrep: true },
    ],
  },
  {
    label: 'Investor Network',
    dropdown: [
      { label: 'Shadow Capital List', href: '#', description: '35+ Dallas Family Offices', isShadowCapital: true },
      { label: 'Tier-1 Partners', href: '/tools/investor-tier-list', description: 'DVC, Perot Jain & more' },
      { label: 'Advisor Network', href: '/#advisors', description: 'Shadow Network specialists' },
    ],
  },
  {
    label: 'Intelligence',
    dropdown: [
      { label: 'Intelligence Hub', href: '/intelligence', description: 'The 2026 Venture Standards' },
      { label: 'Venture Library', href: '/library', description: 'Frameworks, playbooks & research' },
      { label: 'Dallas Venture Map', href: '/ecosystem-map', description: 'Institutional report', isEcosystemMap: true },
      { label: 'Venture Benchmarks', href: '/tools/valuation', description: 'Valuation & multiplier data', isVentureBenchmarks: true },
    ],
  },
  {
    label: 'Advisors',
    href: '/#advisors',
  },
  {
    label: 'Team',
    href: '/team',
  },
];

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isIRIOpen, setIsIRIOpen] = useState(false);
  const [isShadowCapitalOpen, setIsShadowCapitalOpen] = useState(false);
  const [isVentureBenchmarksOpen, setIsVentureBenchmarksOpen] = useState(false);
  const [isEcosystemMapOpen, setIsEcosystemMapOpen] = useState(false);
  const [isAcceleratorPrepOpen, setIsAcceleratorPrepOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle navigation to hash links (e.g., /#advisors)
  const handleHashNavigation = (href: string) => {
    closeMobileMenu();
    setActiveDropdown(null);

    if (href.startsWith('/#')) {
      const hash = href.substring(1); // Get "#advisors" from "/#advisors"
      if (location.pathname === '/') {
        // Already on homepage, just scroll to the section
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // Navigate to homepage first, then scroll
        navigate('/');
        setTimeout(() => {
          const element = document.querySelector(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.pageYOffset > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    document.body.style.overflow = !isMobileMenuOpen ? 'hidden' : '';
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = '';
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[1000] flex justify-between items-center transition-all duration-300 ${
        isScrolled
          ? 'py-3 px-6 lg:px-12 bg-ink/95 border-b border-ink-border'
          : 'py-4 px-6 lg:px-12 bg-ink/80'
      } backdrop-blur-md`}
    >
      <Link
        to="/"
        className="flex items-center gap-3 no-underline"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <Logo size="md" />
      </Link>

      <nav
        ref={dropdownRef}
        className={`flex items-center gap-1 max-md:fixed max-md:top-0 max-md:w-full max-md:h-screen max-md:bg-ink max-md:flex-col max-md:justify-start max-md:pt-20 max-md:gap-4 max-md:transition-all max-md:duration-300 max-md:overflow-y-auto ${
          isMobileMenuOpen ? 'max-md:right-0' : 'max-md:-right-full'
        }`}
      >
        {navItems.map((item) => (
          <div key={item.label} className="relative max-md:static">
            {item.dropdown ? (
              <>
                <button
                  onClick={() => setActiveDropdown(activeDropdown === item.label ? null : item.label)}
                  className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-neutral-300 no-underline hover:text-white transition-colors max-md:text-xl bg-transparent border-none cursor-pointer"
                >
                  {item.label}
                  <svg
                    className={`w-4 h-4 transition-transform ${activeDropdown === item.label ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {activeDropdown === item.label && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-ink-light border border-ink-border rounded-xl shadow-card overflow-hidden animate-fade-in max-md:relative max-md:top-auto max-md:left-0 max-md:translate-x-0 max-md:w-full max-md:mt-2 max-md:animate-none max-md:z-50 max-md:bg-[#0A0A0B]">
                    {item.dropdown.map((dropdownItem) => (
                      dropdownItem.isIRI ? (
                        <button
                          key={dropdownItem.label}
                          onClick={() => {
                            closeMobileMenu();
                            setActiveDropdown(null);
                            setIsIRIOpen(true);
                          }}
                          className="block w-full text-left px-4 py-3 hover:bg-ink-medium transition-colors bg-transparent border-none cursor-pointer"
                        >
                          <div className="text-sm font-medium text-white">{dropdownItem.label}</div>
                          {dropdownItem.description && (
                            <div className="text-xs text-neutral-500 mt-0.5">{dropdownItem.description}</div>
                          )}
                        </button>
                      ) : dropdownItem.isShadowCapital ? (
                        <button
                          key={dropdownItem.label}
                          onClick={() => {
                            closeMobileMenu();
                            setActiveDropdown(null);
                            setIsShadowCapitalOpen(true);
                          }}
                          className="block w-full text-left px-4 py-3 hover:bg-ink-medium transition-colors bg-transparent border-none cursor-pointer"
                        >
                          <div className="text-sm font-medium text-white">{dropdownItem.label}</div>
                          {dropdownItem.description && (
                            <div className="text-xs text-neutral-500 mt-0.5">{dropdownItem.description}</div>
                          )}
                        </button>
                      ) : dropdownItem.isVentureBenchmarks ? (
                        <button
                          key={dropdownItem.label}
                          onClick={() => {
                            closeMobileMenu();
                            setActiveDropdown(null);
                            setIsVentureBenchmarksOpen(true);
                          }}
                          className="block w-full text-left px-4 py-3 hover:bg-ink-medium transition-colors bg-transparent border-none cursor-pointer"
                        >
                          <div className="text-sm font-medium text-white">{dropdownItem.label}</div>
                          {dropdownItem.description && (
                            <div className="text-xs text-neutral-500 mt-0.5">{dropdownItem.description}</div>
                          )}
                        </button>
                      ) : dropdownItem.isEcosystemMap ? (
                        <button
                          key={dropdownItem.label}
                          onClick={() => {
                            closeMobileMenu();
                            setActiveDropdown(null);
                            setIsEcosystemMapOpen(true);
                          }}
                          className="block w-full text-left px-4 py-3 hover:bg-ink-medium transition-colors bg-transparent border-none cursor-pointer"
                        >
                          <div className="text-sm font-medium text-white">{dropdownItem.label}</div>
                          {dropdownItem.description && (
                            <div className="text-xs text-neutral-500 mt-0.5">{dropdownItem.description}</div>
                          )}
                        </button>
                      ) : dropdownItem.isAcceleratorPrep ? (
                        <button
                          key={dropdownItem.label}
                          onClick={() => {
                            closeMobileMenu();
                            setActiveDropdown(null);
                            setIsAcceleratorPrepOpen(true);
                          }}
                          className="block w-full text-left px-4 py-3 hover:bg-ink-medium transition-colors bg-transparent border-none cursor-pointer"
                        >
                          <div className="text-sm font-medium text-white">{dropdownItem.label}</div>
                          {dropdownItem.description && (
                            <div className="text-xs text-neutral-500 mt-0.5">{dropdownItem.description}</div>
                          )}
                        </button>
                      ) : dropdownItem.href.startsWith('/#') ? (
                        <button
                          key={dropdownItem.label}
                          onClick={() => handleHashNavigation(dropdownItem.href)}
                          className="block w-full text-left px-4 py-3 hover:bg-ink-medium transition-colors bg-transparent border-none cursor-pointer"
                        >
                          <div className="text-sm font-medium text-white">{dropdownItem.label}</div>
                          {dropdownItem.description && (
                            <div className="text-xs text-neutral-500 mt-0.5">{dropdownItem.description}</div>
                          )}
                        </button>
                      ) : dropdownItem.href.startsWith('http') ? (
                        <a
                          key={dropdownItem.label}
                          href={dropdownItem.href}
                          onClick={closeMobileMenu}
                          className="block px-4 py-3 hover:bg-ink-medium transition-colors no-underline"
                        >
                          <div className="text-sm font-medium text-white">{dropdownItem.label}</div>
                          {dropdownItem.description && (
                            <div className="text-xs text-neutral-500 mt-0.5">{dropdownItem.description}</div>
                          )}
                        </a>
                      ) : (
                        <Link
                          key={dropdownItem.label}
                          to={dropdownItem.href}
                          onClick={closeMobileMenu}
                          className="block px-4 py-3 hover:bg-ink-medium transition-colors no-underline"
                        >
                          <div className="text-sm font-medium text-white">{dropdownItem.label}</div>
                          {dropdownItem.description && (
                            <div className="text-xs text-neutral-500 mt-0.5">{dropdownItem.description}</div>
                          )}
                        </Link>
                      )
                    ))}
                  </div>
                )}
              </>
            ) : item.href?.startsWith('/#') ? (
              <button
                onClick={() => handleHashNavigation(item.href!)}
                className="px-4 py-2 text-sm font-medium text-neutral-300 no-underline hover:text-white transition-colors max-md:text-xl bg-transparent border-none cursor-pointer"
              >
                {item.label}
              </button>
            ) : item.href?.startsWith('/') ? (
              <Link
                to={item.href}
                onClick={closeMobileMenu}
                className="px-4 py-2 text-sm font-medium text-neutral-300 no-underline hover:text-white transition-colors max-md:text-xl"
              >
                {item.label}
              </Link>
            ) : (
              <a
                href={item.href}
                onClick={closeMobileMenu}
                className="px-4 py-2 text-sm font-medium text-neutral-300 no-underline hover:text-white transition-colors max-md:text-xl"
              >
                {item.label}
              </a>
            )}
          </div>
        ))}
        <Link
          to="/ecosystem-map"
          onClick={closeMobileMenu}
          className="ml-4 py-2.5 px-6 bg-accent text-ink rounded-full font-semibold text-sm transition-all hover:bg-accent-hover hover:shadow-glow max-md:ml-0 max-md:mt-4 no-underline inline-block"
        >
          Dallas Venture Map
        </Link>
      </nav>

      {/* IRI Modal */}
      <IRIModal isOpen={isIRIOpen} onClose={() => setIsIRIOpen(false)} source="Header_IRI" />

      {/* Shadow Capital Modal */}
      <ShadowCapitalModal
        isOpen={isShadowCapitalOpen}
        onClose={() => setIsShadowCapitalOpen(false)}
        leadSource="Header_Nav"
      />

      {/* Venture Benchmarks Modal */}
      <VentureBenchmarksModal
        isOpen={isVentureBenchmarksOpen}
        onClose={() => setIsVentureBenchmarksOpen(false)}
      />

      {/* Ecosystem Map Download Modal */}
      <EcosystemMapDownloadModal
        isOpen={isEcosystemMapOpen}
        onClose={() => setIsEcosystemMapOpen(false)}
      />

      {/* Accelerator Prep Lead Capture */}
      <ToolLeadCaptureModal
        isOpen={isAcceleratorPrepOpen}
        onClose={() => setIsAcceleratorPrepOpen(false)}
        toolName="Accelerator Prep"
        toolPath="/tools/accelerator-checklist"
        toolDescription="Complete checklist to get accelerator-ready and maximize your acceptance chances."
        formType={FORM_TYPES.TOOL_ACCESS}
      />

      <button
        onClick={toggleMobileMenu}
        className="hidden max-md:flex flex-col gap-[5px] bg-transparent border-none cursor-pointer p-2 z-[1001]"
        aria-label="Toggle menu"
      >
        <span
          className={`w-6 h-0.5 bg-white transition-all duration-300 ${
            isMobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''
          }`}
        />
        <span
          className={`w-6 h-0.5 bg-white transition-all duration-300 ${
            isMobileMenuOpen ? 'opacity-0' : ''
          }`}
        />
        <span
          className={`w-6 h-0.5 bg-white transition-all duration-300 ${
            isMobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''
          }`}
        />
      </button>
    </header>
  );
};
