import { Link } from 'react-router-dom';
import { isPremiumMember } from '../../../config/api';

interface AlphaUpgradeCardProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

// The 4 pillars of the Alpha Tier
const alphaPillars = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Sector Benchmarks',
    description: 'Compare against 200+ Dallas startups in your vertical',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: 'Cap Table Audit',
    description: 'Institutional-grade analysis of your equity structure',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: 'Shadow Network Intros',
    description: 'Direct warm introductions to sector-specific advisors',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
    title: 'Venture Math Roadmap',
    description: 'Your personalized path to institutional readiness',
  },
];

export const AlphaUpgradeCard = ({
  title = 'Institutional Analysis Locked',
  description = 'Unlock the full strategic insights reserved for Alpha Tier members.',
  children,
}: AlphaUpgradeCardProps) => {
  const isAlphaMember = isPremiumMember();

  // If user is Alpha member, show the children (unlocked content)
  if (isAlphaMember) {
    return <>{children}</>;
  }

  // Otherwise show the upgrade card
  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-accent/50 bg-gradient-to-br from-ink-light to-ink p-8">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2301F9C6' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Lock icon header */}
      <div className="relative flex items-center gap-4 mb-6">
        <div className="w-14 h-14 bg-accent/10 border border-accent/30 rounded-xl flex items-center justify-center">
          <svg
            className="w-7 h-7 text-accent"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <p className="text-sm text-neutral-400">{description}</p>
        </div>
      </div>

      {/* Alpha Tier Pillars */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {alphaPillars.map((pillar) => (
          <div
            key={pillar.title}
            className="flex items-start gap-3 p-4 bg-ink-medium/50 rounded-xl border border-ink-border"
          >
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0 text-accent">
              {pillar.icon}
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">{pillar.title}</h4>
              <p className="text-xs text-neutral-500 mt-0.5">{pillar.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <div className="relative text-center">
        <Link
          to="/membership"
          className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-ink font-bold rounded-xl hover:bg-accent-hover transition-all duration-200 shadow-glow"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Join Alpha Tier Membership
        </Link>
        <p className="text-xs text-neutral-500 mt-3">
          Join 50+ Dallas founders with institutional-grade access
        </p>
      </div>
    </div>
  );
};

// Compact inline version for use within tool results
export const AlphaUpgradeBanner = () => {
  const isAlphaMember = isPremiumMember();

  if (isAlphaMember) return null;

  return (
    <div className="flex items-center justify-between p-4 bg-accent/5 border border-accent/20 rounded-xl mt-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <span className="text-sm text-neutral-300">
          <span className="text-accent font-semibold">Alpha members</span> see full strategic analysis
        </span>
      </div>
      <Link
        to="/membership"
        className="text-sm font-semibold text-accent hover:text-accent-hover transition-colors"
      >
        Upgrade
      </Link>
    </div>
  );
};
