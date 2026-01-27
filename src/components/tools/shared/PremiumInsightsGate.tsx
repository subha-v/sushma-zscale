import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { isPremiumMember } from '../../../config/api';

interface PremiumInsightsGateProps {
  /** Content shown to premium members */
  children: ReactNode;
  /** Title for the locked section */
  lockedTitle?: string;
  /** Description for the locked section */
  lockedDescription?: string;
  /** List of insights that are locked (teaser) */
  lockedInsights?: string[];
}

/**
 * Strategic Gate Component
 * Shows premium content to Alpha members, shows CTA to free users
 */
export const PremiumInsightsGate = ({
  children,
  lockedTitle = 'Institutional Analysis Locked',
  lockedDescription = 'Get the full strategic audit and personalized investor path with zScale Alpha.',
  lockedInsights = [
    'Personalized investor match recommendations',
    'Detailed competitive positioning analysis',
    'Custom fundraising timeline & strategy',
    'Direct introductions to aligned VCs',
  ],
}: PremiumInsightsGateProps) => {
  const isPremium = isPremiumMember();

  // Premium members see full content
  if (isPremium) {
    return <>{children}</>;
  }

  // Free users see the strategic gate
  return (
    <div className="relative">
      {/* Locked Content Overlay */}
      <div className="bg-gradient-to-b from-ink-card to-ink border border-ink-border rounded-2xl p-8 text-center">
        {/* Lock Icon */}
        <div className="w-16 h-16 mx-auto mb-6 bg-accent/10 rounded-full flex items-center justify-center border border-accent/20">
          <svg
            className="w-8 h-8 text-accent"
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

        {/* Locked Title */}
        <h3 className="text-xl font-bold text-white mb-2">{lockedTitle}</h3>
        <p className="text-neutral-400 mb-6 max-w-md mx-auto">{lockedDescription}</p>

        {/* Teaser - What's Locked */}
        <div className="bg-ink-medium border border-ink-border rounded-xl p-6 mb-8 max-w-md mx-auto">
          <p className="text-sm text-neutral-500 uppercase tracking-wider mb-4">
            Alpha Members Unlock:
          </p>
          <ul className="space-y-3 text-left">
            {lockedInsights.map((insight, index) => (
              <li key={index} className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-accent/50 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-neutral-300 text-sm">{insight}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA Button */}
        <Link
          to="/membership"
          className="inline-flex items-center gap-2 px-8 py-4 bg-[#01F9C6] text-[#0A0A0B] font-semibold rounded-xl hover:brightness-110 transition-all duration-200 shadow-[0_0_20px_rgba(1,249,198,0.3)] no-underline"
        >
          <span>Join zScale Alpha to Unlock Your Full Strategic Audit & Investor Path</span>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </Link>

        {/* Subtle Note */}
        <p className="text-xs text-neutral-600 mt-4">
          Join 50+ Dallas founders already using zScale Alpha
        </p>
      </div>
    </div>
  );
};

/**
 * Compact version for inline use within result cards
 */
export const PremiumInsightsBanner = () => {
  const isPremium = isPremiumMember();

  if (isPremium) return null;

  return (
    <div className="mt-6 p-4 bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20 rounded-xl">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
            <svg
              className="w-5 h-5 text-accent"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-white">Unlock Full Strategic Analysis</p>
            <p className="text-xs text-neutral-400">
              Get personalized insights & investor introductions
            </p>
          </div>
        </div>
        <Link
          to="/membership"
          className="px-4 py-2 bg-[#01F9C6] text-[#0A0A0B] text-sm font-semibold rounded-lg hover:brightness-110 transition-all no-underline whitespace-nowrap"
        >
          Join Alpha
        </Link>
      </div>
    </div>
  );
};
