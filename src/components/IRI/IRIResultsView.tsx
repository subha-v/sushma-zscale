import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IRIResult, IRIContactInfo } from './types';
import { isPremiumMember } from '../../config/api';

interface IRIResultsViewProps {
  result: IRIResult;
  contact: IRIContactInfo;
  onClose: () => void;
}

// Radial Gauge Component
const RadialGauge = ({ score, animated = true }: { score: number; animated?: boolean }) => {
  const [displayScore, setDisplayScore] = useState(animated ? 0 : score);
  const size = 280;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min((displayScore / 100) * 100, 100);
  const offset = circumference - (percentage / 100) * circumference;

  // Color based on score
  const getColor = () => {
    if (score > 70) return '#01F9C6'; // Teal for high scores
    if (score > 40) return '#F59E0B'; // Yellow for medium
    return '#EF4444'; // Red for low
  };

  const color = getColor();

  useEffect(() => {
    if (!animated) return;

    const duration = 2000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentScore = Math.round(score * eased);

      setDisplayScore(currentScore);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [score, animated]);

  return (
    <div className="relative inline-flex flex-col items-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1a1a1b"
          strokeWidth={strokeWidth}
        />

        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: animated ? 'stroke-dashoffset 2s ease-out' : 'none',
          }}
        />

        {/* Glow effect */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth / 2}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          opacity={0.4}
          filter="blur(10px)"
          style={{
            transition: animated ? 'stroke-dashoffset 2s ease-out' : 'none',
          }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-6xl md:text-7xl font-bold transition-colors duration-300"
          style={{ color }}
        >
          {displayScore}
        </span>
        <span className="text-neutral-500 text-lg mt-1">/ 100</span>
        <span className="text-sm font-medium text-neutral-400 mt-2 uppercase tracking-wider">
          IRI Score
        </span>
      </div>
    </div>
  );
};

// Gap Analysis Bar Chart
const GapAnalysisChart = ({ vectors }: { vectors: IRIResult['vectors'] }) => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const vectorLabels: Record<string, string> = {
    pmf: 'PMF Evidence',
    unit_economics: 'Unit Economics',
    team: 'Team & Advisors',
    infrastructure: 'Infrastructure',
    capital: 'Capital Position',
  };

  const vectorWeights: Record<string, number> = {
    pmf: 25,
    unit_economics: 30,
    team: 20,
    infrastructure: 15,
    capital: 10,
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white mb-4">Gap Analysis</h3>
      {vectors.map((vector) => {
        const maxPossible = vectorWeights[vector.id] || vector.maxScore;
        const percentage = (vector.score / maxPossible) * 100;
        const barColor = percentage >= 70 ? '#01F9C6' : percentage >= 40 ? '#F59E0B' : '#EF4444';

        return (
          <div key={vector.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-neutral-300">
                {vectorLabels[vector.id] || vector.name}
              </span>
              <span className="text-sm text-neutral-500">
                {vector.score}/{maxPossible}
              </span>
            </div>
            <div className="relative h-3 bg-ink-medium rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: animated ? `${percentage}%` : '0%',
                  backgroundColor: barColor,
                }}
              />
              {/* Glow */}
              <div
                className="absolute inset-y-0 left-0 rounded-full opacity-50 blur-sm transition-all duration-1000 ease-out"
                style={{
                  width: animated ? `${percentage}%` : '0%',
                  backgroundColor: barColor,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Workshop Card
const WorkshopCard = ({ result, contact }: { result: IRIResult; contact: IRIContactInfo }) => {
  const { workshop, penalty } = result;

  const priorityConfig = {
    critical: {
      badge: 'PRIORITY: CRITICAL',
      badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30',
      borderColor: 'border-red-500/30',
    },
    standard: {
      badge: 'PRIORITY: STANDARD',
      badgeColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      borderColor: 'border-yellow-500/30',
    },
    advanced: {
      badge: 'PRIORITY: ADVANCED',
      badgeColor: 'bg-[#01F9C6]/20 text-[#01F9C6] border-[#01F9C6]/30',
      borderColor: 'border-[#01F9C6]/30',
    },
  };

  const config = priorityConfig[workshop.priority];

  // Build calendar link with pre-filled info
  const calendarUrl = `${workshop.calendarLink}&add=${encodeURIComponent(contact.email)}`;

  return (
    <div className={`bg-ink-medium border-2 ${config.borderColor} rounded-2xl p-6 md:p-8`}>
      {/* Priority badge */}
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${config.badgeColor} mb-4`}>
        {config.badge}
      </div>

      {/* Penalty warning if applicable */}
      {penalty !== 0 && (
        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg mb-4 text-red-400 text-sm">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{penalty} point penalty applied: Dallas VCs expect unit economics knowledge cold.</span>
        </div>
      )}

      {/* Workshop title */}
      <h3 className="text-2xl font-bold text-white mb-3">{workshop.title}</h3>

      {/* Description */}
      <p className="text-neutral-400 mb-6 leading-relaxed">{workshop.description}</p>

      {/* Scarcity & Authority messaging */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#01F9C6]/10 rounded-lg">
          <svg className="w-4 h-4 text-[#01F9C6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="text-sm text-[#01F9C6] font-medium">Capped at 10 Founders</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#01F9C6]/10 rounded-lg">
          <svg className="w-4 h-4 text-[#01F9C6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span className="text-sm text-[#01F9C6] font-medium">Institutional Intimacy</span>
        </div>
      </div>

      {/* Authority framing */}
      <p className="text-xs text-neutral-500 italic mb-6">
        "The Unwritten Rules of DFW Fundraising" - Exclusive workshop series
      </p>

      {/* Primary CTA */}
      <a
        href={calendarUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full text-center bg-[#01F9C6] text-[#0A0A0B] font-bold text-lg py-4 px-8 rounded-xl hover:brightness-110 transition-all duration-200 hover:shadow-[0_0_30px_rgba(1,249,198,0.4)] no-underline"
      >
        Sign Up for Workshop
      </a>
    </div>
  );
};

// Premium Strategic Insights (for Alpha members)
const PremiumStrategicInsights = ({ result, contact }: { result: IRIResult; contact: IRIContactInfo }) => {
  // Find weakest and strongest vectors
  const sortedVectors = [...result.vectors].sort((a, b) => {
    const aPercent = (a.score / a.maxScore) * 100;
    const bPercent = (b.score / b.maxScore) * 100;
    return aPercent - bPercent;
  });

  const weakestVector = sortedVectors[0];
  const strongestVector = sortedVectors[sortedVectors.length - 1];

  return (
    <div className="bg-gradient-to-b from-ink-card to-ink border border-accent/30 rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Alpha Strategic Analysis</h3>
          <p className="text-sm text-neutral-400">Exclusive insights for {contact.companyName}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 bg-ink-medium rounded-xl">
          <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
            <span className="text-red-400">Priority Fix:</span> {weakestVector.name}
          </h4>
          <p className="text-sm text-neutral-400">
            This is your biggest gap at {Math.round((weakestVector.score / weakestVector.maxScore) * 100)}%.
            Focus here first to maximize your score improvement.
          </p>
        </div>

        <div className="p-4 bg-ink-medium rounded-xl">
          <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
            <span className="text-accent">Strength:</span> {strongestVector.name}
          </h4>
          <p className="text-sm text-neutral-400">
            At {Math.round((strongestVector.score / strongestVector.maxScore) * 100)}%, lead with this in pitch conversations.
          </p>
        </div>

        <div className="p-4 bg-ink-medium rounded-xl">
          <h4 className="font-semibold text-white mb-2">Fundraising Timeline</h4>
          <p className="text-sm text-neutral-400">
            {result.totalScore >= 70
              ? "You're positioned to start investor conversations now. Focus on Series A or late-seed opportunities."
              : result.totalScore >= 50
              ? "Spend 2-3 months strengthening weak vectors before active fundraising."
              : "Recommend 4-6 months of foundation building before approaching institutional investors."}
          </p>
        </div>

        <div className="p-4 bg-ink-medium rounded-xl">
          <h4 className="font-semibold text-white mb-2">Investor Path</h4>
          <p className="text-sm text-neutral-400">
            {result.totalScore >= 70
              ? "Target: Institutional VCs (Series A ready). We can facilitate warm introductions."
              : result.totalScore >= 50
              ? "Target: Angel networks and pre-seed funds. Build relationships now for future rounds."
              : "Target: Friends & family, accelerators, and grants. Build track record first."}
          </p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-accent/10 border border-accent/20 rounded-xl">
        <p className="text-sm text-accent font-medium mb-2">Your Next Step as an Alpha Member:</p>
        <p className="text-sm text-neutral-300">
          Schedule your 1:1 strategy session with a zScale partner to review these results and create your personalized investor outreach plan.
        </p>
      </div>
    </div>
  );
};

// Locked Premium Gate
const LockedPremiumGate = () => {
  return (
    <div className="bg-gradient-to-b from-ink-card to-ink border border-ink-border rounded-2xl p-8 text-center">
      {/* Lock Icon */}
      <div className="w-16 h-16 mx-auto mb-6 bg-accent/10 rounded-full flex items-center justify-center border border-accent/20">
        <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>

      <h3 className="text-xl font-bold text-white mb-2">Institutional Analysis Locked</h3>
      <p className="text-neutral-400 mb-6 max-w-md mx-auto">
        Get personalized strategic analysis, investor matching, and a custom fundraising roadmap.
      </p>

      {/* Teaser */}
      <div className="bg-ink-medium border border-ink-border rounded-xl p-6 mb-8 max-w-md mx-auto">
        <p className="text-sm text-neutral-500 uppercase tracking-wider mb-4">Alpha Members Unlock:</p>
        <ul className="space-y-3 text-left">
          {[
            'Personalized investor match recommendations',
            'Priority fix roadmap with action items',
            'Custom fundraising timeline',
            'Direct introductions to aligned VCs',
            '1:1 strategy session with zScale partners',
          ].map((insight, index) => (
            <li key={index} className="flex items-start gap-3">
              <svg className="w-5 h-5 text-accent/50 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-neutral-300 text-sm">{insight}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <Link
        to="/membership"
        className="inline-flex items-center gap-2 px-8 py-4 bg-[#01F9C6] text-[#0A0A0B] font-semibold rounded-xl hover:brightness-110 transition-all duration-200 shadow-[0_0_20px_rgba(1,249,198,0.3)] no-underline"
      >
        <span>Join zScale Alpha to Unlock Your Full Strategic Audit & Investor Path</span>
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </Link>

      <p className="text-xs text-neutral-600 mt-4">Join 50+ Dallas founders already using zScale Alpha</p>
    </div>
  );
};

export const IRIResultsView = ({ result, contact, onClose }: IRIResultsViewProps) => {
  const isPremium = isPremiumMember();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#01F9C6]/10 border border-[#01F9C6]/20 rounded-full text-xs mb-4">
          <span className="text-[#01F9C6] font-mono">IRI COMPLETE</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Your Investment Readiness Score
        </h2>
        <p className="text-neutral-400">
          {contact.companyName} - {contact.firstName} {contact.lastName}
        </p>
      </div>

      {/* Basic Results - Always Visible */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left column: Score gauge and gap analysis */}
        <div className="space-y-8">
          {/* Radial gauge */}
          <div className="flex justify-center">
            <RadialGauge score={result.totalScore} />
          </div>

          {/* Score interpretation */}
          <div className="text-center">
            {result.totalScore > 70 ? (
              <p className="text-[#01F9C6] font-medium">Investor Ready - Strong position for institutional capital</p>
            ) : result.totalScore > 40 ? (
              <p className="text-yellow-400 font-medium">Growth Phase - Key areas need strengthening</p>
            ) : (
              <p className="text-red-400 font-medium">Foundation Building - Critical gaps to address</p>
            )}
          </div>

          {/* Gap analysis chart */}
          <div className="bg-ink-medium border border-ink-border rounded-xl p-6">
            <GapAnalysisChart vectors={result.vectors} />
          </div>
        </div>

        {/* Right column: Workshop recommendation */}
        <div className="flex flex-col">
          <WorkshopCard result={result} contact={contact} />

          {/* Secondary actions */}
          <div className="mt-6 space-y-3">
            <button
              onClick={() => {
                // Copy results to clipboard
                const summary = `IRI Score: ${result.totalScore}/100\n${result.vectors.map(v => `${v.name}: ${v.score}/${v.maxScore}`).join('\n')}\nRecommended: ${result.workshop.title}`;
                navigator.clipboard.writeText(summary);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-ink-medium border border-ink-border rounded-xl text-neutral-300 hover:text-white hover:border-[#01F9C6]/50 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              Copy Results Summary
            </button>
          </div>
        </div>
      </div>

      {/* Strategic Gate - Premium Insights Section */}
      <div className="pt-8 border-t border-ink-border">
        <h3 className="text-lg font-semibold text-white mb-6 text-center">Strategic Analysis</h3>

        {isPremium ? (
          <PremiumStrategicInsights result={result} contact={contact} />
        ) : (
          <LockedPremiumGate />
        )}
      </div>

      {/* Close button */}
      <div className="text-center pt-4 border-t border-ink-border">
        <button
          onClick={onClose}
          className="px-6 py-3 text-neutral-500 hover:text-neutral-300 transition-colors text-sm"
        >
          Close Assessment
        </button>
        <p className="text-xs text-neutral-600 mt-2">
          Your scorecard has been sent to your email.
        </p>
      </div>
    </div>
  );
};
