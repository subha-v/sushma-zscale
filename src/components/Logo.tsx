interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

// zScale Logo - Horizontal Lockup (Icon + Text)
// Uses the official uploaded brand asset without modification
// Responsive sizing: 60px desktop, 40px mobile per 2026 institutional standards
export const Logo = ({ className = '', size = 'md' }: LogoProps) => {
  const sizes = {
    sm: 'h-8',
    md: 'h-10 lg:h-[60px]', // 40px mobile, 60px desktop
    lg: 'h-14',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Icon - Official zScale brand asset (read-only, unmodified) */}
      <img
        src="/zscale-logo.svg?v=2.1"
        alt="zScale Capital - Dallas Venture Operating System"
        className={`${sizes[size]} w-auto`}
      />

      {/* Logo Text - Horizontal Lockup */}
      <div className="flex flex-col leading-none">
        <span className="text-white font-bold text-xl tracking-tight">
          zScale
        </span>
        <span className="text-neutral-500 text-xs font-medium tracking-wider uppercase">
          Capital
        </span>
      </div>
    </div>
  );
};

// Compact logo for mobile/smaller spaces (Z-monogram only)
// Uses the official uploaded favicon asset without modification
// Responsive sizing: 40px mobile per 2026 institutional standards
export const LogoMark = ({ className = '' }: { className?: string }) => {
  return (
    <img
      src="/zscale-logo.svg?v=2.1"
      alt="zScale Capital - Dallas Venture Operating System"
      className={`h-10 w-auto ${className}`}
    />
  );
};
