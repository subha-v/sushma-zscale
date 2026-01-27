import { Investor } from '../../../types/tools';
import { ActivePulse } from './ActivePulse';

interface InvestorTableProps {
  investors: Investor[];
  freeCount: number;
  isUnlocked: boolean;
  onUnlockClick: () => void;
}

// Format check size for display
const formatCheckSize = (min: number, max: number): string => {
  const formatNum = (n: number) => {
    if (n >= 1000000) return `$${(n / 1000000).toFixed(0)}M`;
    if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
    return `$${n}`;
  };
  return `${formatNum(min)} - ${formatNum(max)}`;
};

// Format date for display
const formatLastActive = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
};

export const InvestorTable = ({
  investors,
  freeCount,
  isUnlocked,
  onUnlockClick,
}: InvestorTableProps) => {
  const visibleInvestors = isUnlocked ? investors : investors.slice(0, freeCount);
  const lockedInvestors = isUnlocked ? [] : investors.slice(freeCount);

  return (
    <div className="card-skeuomorphic overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full" aria-label="Dallas investor directory">
          <thead className="bg-ink-medium border-b border-ink-border">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                Investor / Firm
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                Focus Areas
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                Stages
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                Check Size
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                Last Active
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-border">
            {visibleInvestors.map((investor) => (
              <tr
                key={investor.id}
                className="hover:bg-ink-medium transition-colors"
              >
                <td className="px-6 py-4">
                  <ActivePulse status={investor.activityStatus} />
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-white">{investor.name}</p>
                    <p className="text-sm text-neutral-500">{investor.firm}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {investor.focusAreas.slice(0, 2).map((area) => (
                      <span
                        key={area}
                        className="px-2 py-1 text-xs bg-accent/10 text-accent rounded-full"
                      >
                        {area}
                      </span>
                    ))}
                    {investor.focusAreas.length > 2 && (
                      <span className="px-2 py-1 text-xs bg-ink-medium text-neutral-500 rounded-full">
                        +{investor.focusAreas.length - 2}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {investor.stages.map((stage) => (
                      <span
                        key={stage}
                        className="px-2 py-1 text-xs bg-ink-medium text-neutral-400 rounded-full"
                      >
                        {stage}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-white">
                  {formatCheckSize(investor.checkSize.min, investor.checkSize.max)}
                </td>
                <td className="px-6 py-4 text-sm text-neutral-500">
                  {formatLastActive(investor.lastDealDate)}
                </td>
              </tr>
            ))}

            {/* Blurred locked rows */}
            {lockedInvestors.slice(0, 3).map((investor) => (
              <tr key={investor.id} className="relative">
                <td colSpan={6} className="px-6 py-4">
                  <div className="flex items-center gap-6 blur-[6px] select-none pointer-events-none opacity-60">
                    <div className="w-3 h-3 bg-neutral-600 rounded-full" />
                    <div>
                      <div className="h-4 w-32 bg-ink-medium rounded" />
                      <div className="h-3 w-24 bg-ink-border rounded mt-1" />
                    </div>
                    <div className="flex gap-1">
                      <div className="h-6 w-16 bg-ink-border rounded-full" />
                      <div className="h-6 w-20 bg-ink-border rounded-full" />
                    </div>
                    <div className="h-6 w-14 bg-ink-border rounded-full" />
                    <div className="h-4 w-20 bg-ink-border rounded" />
                    <div className="h-4 w-16 bg-ink-border rounded" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden divide-y divide-ink-border">
        {visibleInvestors.map((investor) => (
          <div key={investor.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-medium text-white">{investor.name}</p>
                <p className="text-sm text-neutral-500">{investor.firm}</p>
              </div>
              <ActivePulse status={investor.activityStatus} showLabel />
            </div>
            <div className="flex flex-wrap gap-1 mb-3">
              {investor.focusAreas.map((area) => (
                <span
                  key={area}
                  className="px-2 py-1 text-xs bg-accent/10 text-accent rounded-full"
                >
                  {area}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-500">
                {investor.stages.join(', ')}
              </span>
              <span className="font-medium text-white">
                {formatCheckSize(investor.checkSize.min, investor.checkSize.max)}
              </span>
            </div>
          </div>
        ))}

        {/* Blurred locked cards */}
        {lockedInvestors.slice(0, 2).map((investor) => (
          <div key={investor.id} className="p-4 relative">
            <div className="blur-[6px] select-none pointer-events-none opacity-60">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="h-4 w-32 bg-ink-medium rounded" />
                  <div className="h-3 w-24 bg-ink-border rounded mt-1" />
                </div>
                <div className="w-3 h-3 bg-neutral-600 rounded-full" />
              </div>
              <div className="flex gap-1 mb-3">
                <div className="h-6 w-16 bg-ink-border rounded-full" />
                <div className="h-6 w-20 bg-ink-border rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Unlock CTA */}
      {!isUnlocked && lockedInvestors.length > 0 && (
        <div className="relative">
          {/* Gradient fade */}
          <div className="absolute inset-x-0 -top-20 h-20 bg-gradient-to-t from-ink-light via-ink-light/80 to-transparent pointer-events-none" />

          {/* CTA Section */}
          <div className="p-8 text-center bg-gradient-to-b from-ink-light to-ink-medium border-t border-ink-border">
            <p className="text-neutral-300 mb-6 max-w-md mx-auto">
              Join zScale Premium Membership to access the complete Dallas investor database
              with contact info, portfolio companies, and investment thesis notes.
            </p>
            <button
              onClick={onUnlockClick}
              className="inline-flex items-center gap-3 px-8 py-4 bg-accent text-ink font-semibold rounded-xl hover:bg-accent-hover transition-all duration-200 shadow-glow hover:shadow-xl hover:scale-[1.02]"
            >
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              Access +{lockedInvestors.length} Investors
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
