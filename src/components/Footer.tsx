import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-black pt-[60px] pb-8 border-t border-white/[0.08]">
      <div className="max-w-[1200px] mx-auto px-6 max-md:px-4">
        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1.8fr] gap-12 md:gap-20 mb-12">
          {/* Left: Logo + Tagline */}
          <div className="flex flex-col gap-5">
            <div className="mb-2">
              <Link to="/" className="inline-block no-underline hover:opacity-80 transition-opacity">
                <img
                  src="/images/zscale-capital-logo.png"
                  alt="zScale Capital"
                  className="h-12 w-auto object-contain"
                />
              </Link>
            </div>
            <p className="text-[15px] leading-relaxed text-white/60 max-w-[320px]">
              Texas Market Intelligence Platform for<br />
              Economic Development Professionals
            </p>
          </div>

          {/* Right: Navigation Columns */}
          <div className="grid grid-cols-3 max-md:grid-cols-1 gap-10 max-md:gap-8">
            <div>
              <h4 className="text-xs font-bold text-white/90 tracking-[1.5px] uppercase mb-4">
                Platform
              </h4>
              <ul className="list-none space-y-3">
                <li>
                  <Link to="/preview" className="text-sm text-white/60 no-underline hover:text-[#10B981] transition-colors">
                    Free Preview
                  </Link>
                </li>
                <li>
                  <Link to="/demo" className="text-sm text-white/60 no-underline hover:text-[#10B981] transition-colors">
                    Request Demo
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white/90 tracking-[1.5px] uppercase mb-4">
                Solutions
              </h4>
              <ul className="list-none space-y-3">
                <li>
                  <Link to="/solutions#edc" className="text-sm text-white/60 no-underline hover:text-[#10B981] transition-colors">
                    Economic Development
                  </Link>
                </li>
                <li>
                  <Link to="/solutions#college" className="text-sm text-white/60 no-underline hover:text-[#10B981] transition-colors">
                    Community Colleges
                  </Link>
                </li>
                <li>
                  <Link to="/solutions#consultant" className="text-sm text-white/60 no-underline hover:text-[#10B981] transition-colors">
                    Site Consultants
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white/90 tracking-[1.5px] uppercase mb-4">
                Company
              </h4>
              <ul className="list-none space-y-3">
                <li>
                  <Link to="/about" className="text-sm text-white/60 no-underline hover:text-[#10B981] transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <a href="mailto:info@zscalecapital.com" className="text-sm text-white/60 no-underline hover:text-[#10B981] transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="flex justify-between items-center pt-8 border-t border-white/[0.08] max-md:flex-col max-md:gap-4 max-md:text-center">
          <p className="text-[13px] text-white/40">&copy; 2025 zScale Capital. All rights reserved.</p>
          <a
            href="https://www.linkedin.com/in/sushma-vad"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 text-white/60 hover:text-[#10B981] transition-colors"
            aria-label="LinkedIn"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};
