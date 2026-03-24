import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.pageYOffset > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = '';
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    document.body.style.overflow = !isMobileMenuOpen ? 'hidden' : '';
  };

  const handleHashClick = (e: React.MouseEvent, hash: string) => {
    closeMobileMenu();
    if (location.pathname === '/') {
      e.preventDefault();
      const el = document.querySelector(hash);
      if (el) {
        const headerHeight = 72;
        const top = el.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  };

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
              src="/images/zscale-capital-logo.png"
              alt="zScale Capital"
              className="h-16 w-auto max-w-[280px] max-md:h-12 max-md:max-w-[200px]"
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
              to="/#how-it-works"
              onClick={(e) => handleHashClick(e, '#how-it-works')}
              className="text-sm font-medium text-[#A0A0A0] hover:text-accent transition-colors no-underline"
            >
              How It Works
            </Link>
            <Link
              to="/preview"
              className={`text-sm font-medium transition-colors no-underline ${
                location.pathname === '/preview' ? 'text-accent' : 'text-[#A0A0A0] hover:text-accent'
              }`}
            >
              Preview
            </Link>
            <Link
              to="/about"
              className={`text-sm font-medium transition-colors no-underline ${
                location.pathname === '/about' ? 'text-accent' : 'text-[#A0A0A0] hover:text-accent'
              }`}
            >
              About
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="flex items-center gap-6 max-md:hidden">
            <Link
              to="/login"
              className="text-sm font-medium text-[#A0A0A0] hover:text-white transition-colors no-underline"
            >
              Login
            </Link>
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
        className={`fixed top-[72px] left-0 right-0 bottom-0 bg-black z-[999] flex-col gap-4 p-6 transition-all duration-300 hidden max-md:flex ${
          isMobileMenuOpen
            ? 'opacity-100 visible translate-y-0'
            : 'opacity-0 invisible -translate-y-2.5'
        }`}
      >
        <Link to="/solutions" onClick={closeMobileMenu} className="block py-4 text-white text-lg font-medium border-b border-[#1A1A1A] no-underline">
          Solutions
        </Link>
        <Link
          to="/#how-it-works"
          onClick={(e) => handleHashClick(e, '#how-it-works')}
          className="block py-4 text-white text-lg font-medium border-b border-[#1A1A1A] no-underline"
        >
          How It Works
        </Link>
        <Link to="/preview" onClick={closeMobileMenu} className="block py-4 text-white text-lg font-medium border-b border-[#1A1A1A] no-underline">
          Preview
        </Link>
        <Link to="/about" onClick={closeMobileMenu} className="block py-4 text-white text-lg font-medium border-b border-[#1A1A1A] no-underline">
          About
        </Link>
        <div className="h-px bg-[#1A1A1A] my-2" />
        <Link to="/login" onClick={closeMobileMenu} className="block py-4 text-white text-lg font-medium border-b border-[#1A1A1A] no-underline">
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
