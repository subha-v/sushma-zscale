import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

const TOOLS_ITEMS = [
  { label: 'Region Comparison', to: '/tools/region-comparison', description: 'Side-by-side MSA talent data' },
  { label: 'Expansion Readiness Scorecard', to: '/tools/expansion-readiness', description: '12-factor county scoring' },
  { label: 'EDC Directory', to: '/tools/edc-directory', description: 'Every Texas EDC, searchable' },
  { label: 'Talent Source Finder', to: '/tools/talent-source-finder', description: 'Match roles to institutions' },
];

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const toolsTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.pageYOffset > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setIsToolsOpen(false);
  }, [location.pathname]);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = '';
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    document.body.style.overflow = !isMobileMenuOpen ? 'hidden' : '';
  };

  const handleToolsEnter = () => {
    if (toolsTimeout.current) clearTimeout(toolsTimeout.current);
    setIsToolsOpen(true);
  };

  const handleToolsLeave = () => {
    toolsTimeout.current = setTimeout(() => setIsToolsOpen(false), 150);
  };

  const isToolsActive = location.pathname.startsWith('/tools');

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 backdrop-blur-xl ${
          isScrolled
            ? 'bg-black/95 border-b border-[#1A1A1A]'
            : 'bg-black/80 border-b border-transparent'
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-6 max-md:px-4 flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="/images/zscale-logo.png"
              alt="zScale"
              className="h-20 w-auto max-w-[320px] max-md:h-14 max-md:max-w-[240px]"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="flex items-center gap-8 max-md:hidden">
            <Link
              to="/solutions"
              className={`text-sm font-medium transition-colors no-underline ${
                location.pathname === '/solutions' ? 'text-accent' : 'text-[#A0A0A0] hover:text-accent'
              }`}
            >
              Solutions
            </Link>

            <Link
              to="/tracker"
              className={`text-sm font-medium transition-colors no-underline ${
                location.pathname.startsWith('/tracker') ? 'text-accent' : 'text-[#A0A0A0] hover:text-accent'
              }`}
            >
              Tracker
            </Link>

            {/* Tools Dropdown */}
            <div
              className="relative"
              onMouseEnter={handleToolsEnter}
              onMouseLeave={handleToolsLeave}
            >
              <button
                className={`flex items-center gap-1 text-sm font-medium transition-colors bg-transparent border-none cursor-pointer ${
                  isToolsActive ? 'text-accent' : 'text-[#A0A0A0] hover:text-accent'
                }`}
              >
                Tools
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className={`transition-transform duration-150 ${isToolsOpen ? 'rotate-180' : ''}`}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {/* Dropdown Panel */}
              <div
                className={`absolute top-full left-0 pt-2 transition-all duration-150 ${
                  isToolsOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-1'
                }`}
              >
                <div className="w-[280px] bg-ink-card border border-ink-border rounded-xl shadow-2xl overflow-hidden">
                  {TOOLS_ITEMS.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`block px-4 py-3 no-underline transition-colors ${
                        location.pathname === item.to
                          ? 'bg-accent/5'
                          : 'hover:bg-white/[0.03]'
                      }`}
                    >
                      <span className={`block text-sm font-medium ${
                        location.pathname === item.to ? 'text-accent' : 'text-white'
                      }`}>
                        {item.label}
                      </span>
                      <span className="block text-xs text-neutral-500 mt-0.5">{item.description}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link
              to="/intelligence"
              className={`text-sm font-medium transition-colors no-underline ${
                location.pathname.startsWith('/intelligence') ? 'text-accent' : 'text-[#A0A0A0] hover:text-accent'
              }`}
            >
              The Brief
            </Link>

            <Link
              to="/about"
              className={`text-sm font-medium transition-colors no-underline ${
                location.pathname === '/about' ? 'text-accent' : 'text-[#A0A0A0] hover:text-accent'
              }`}
            >
              About
            </Link>
            <Link
              to="/login"
              className={`text-sm font-medium transition-colors no-underline ${
                location.pathname === '/login' ? 'text-accent' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Login
            </Link>
          </nav>

          {/* Desktop CTA */}
          <div className="flex items-center max-md:hidden">
            <Link
              to="/demo"
              className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold bg-accent text-black rounded-lg hover:bg-accent-hover hover:-translate-y-0.5 transition-all no-underline"
            >
              Request Demo
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMobileMenu}
            className="hidden max-md:flex flex-col justify-center items-center w-11 h-11 gap-1.5 bg-transparent border-none cursor-pointer"
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span
              className={`block w-6 h-0.5 bg-white rounded-sm transition-all duration-300 ${
                isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-white rounded-sm transition-all duration-300 ${
                isMobileMenuOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-white rounded-sm transition-all duration-300 ${
                isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            />
          </button>
        </div>
      </header>

      {/* Mobile Nav */}
      <nav
        className={`fixed top-[72px] left-0 right-0 bottom-0 bg-black z-[999] flex-col gap-4 p-6 transition-all duration-300 hidden max-md:flex overflow-y-auto ${
          isMobileMenuOpen
            ? 'opacity-100 visible translate-y-0'
            : 'opacity-0 invisible -translate-y-2.5'
        }`}
      >
        <Link to="/solutions" onClick={closeMobileMenu} className="block py-4 text-white text-lg font-medium border-b border-[#1A1A1A] no-underline">
          Solutions
        </Link>

        <Link to="/tracker" onClick={closeMobileMenu} className="block py-4 text-white text-lg font-medium border-b border-[#1A1A1A] no-underline">
          Tracker
        </Link>

        {/* Tools section — expanded inline */}
        <div className="border-b border-[#1A1A1A]">
          <p className="py-4 text-white text-lg font-medium">Tools</p>
          <div className="pb-4 pl-4 space-y-1">
            {TOOLS_ITEMS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={closeMobileMenu}
                className="block py-3 no-underline"
              >
                <span className="block text-base text-white/80">{item.label}</span>
                <span className="block text-xs text-neutral-500 mt-0.5">{item.description}</span>
              </Link>
            ))}
          </div>
        </div>

        <Link to="/intelligence" onClick={closeMobileMenu} className="block py-4 text-white text-lg font-medium border-b border-[#1A1A1A] no-underline">
          The Brief
        </Link>
        <Link to="/about" onClick={closeMobileMenu} className="block py-4 text-white text-lg font-medium border-b border-[#1A1A1A] no-underline">
          About
        </Link>
        <div className="h-px bg-[#1A1A1A] my-2" />
        <Link to="/login" onClick={closeMobileMenu} className="block py-4 text-zinc-400 text-lg font-medium border-b border-[#1A1A1A] no-underline">
          Login
        </Link>
        <Link
          to="/demo"
          onClick={closeMobileMenu}
          className="w-full inline-flex items-center justify-center px-6 py-3 text-sm font-semibold bg-accent text-black rounded-lg no-underline"
        >
          Request Demo
        </Link>
      </nav>
    </>
  );
};
