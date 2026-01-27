import { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  checklistCategories,
  checklistItems,
  calculateScore,
  getReadinessMessage,
  getTrafficLightStatus,
} from '../../data/checklistQuestions';
import { ChecklistCategoryId } from '../../types/tools';
import { ToolAccessGate } from '../../components/tools/shared/ToolAccessGate';

const STORAGE_KEY = 'accelerator_checklist_progress';

const AcceleratorChecklistContent = () => {
  // Load saved progress from localStorage
  const [completedItems, setCompletedItems] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completedItems));
  }, [completedItems]);

  // Calculate scores
  const scoreData = useMemo(() => {
    return calculateScore(completedItems);
  }, [completedItems]);

  // Get readiness message
  const readinessMessage = useMemo(() => {
    return getReadinessMessage(scoreData.totalScore);
  }, [scoreData.totalScore]);

  // Toggle item completion
  const handleToggleItem = (itemId: string) => {
    setCompletedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Reset progress
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset your progress?')) {
      setCompletedItems([]);
    }
  };

  // Group items by category
  const itemsByCategory = useMemo(() => {
    const grouped: Record<ChecklistCategoryId, typeof checklistItems> = {
      product: [],
      market: [],
      team: [],
      traction: [],
      pitch: [],
    };

    checklistItems.forEach((item) => {
      grouped[item.categoryId].push(item);
    });

    return grouped;
  }, []);

  // Get score color based on brand colors
  const getScoreColor = (score: number): string => {
    if (score >= 71) return '#01F9C6'; // bright teal (good)
    if (score >= 41) return '#F59E0B'; // amber (yellow/warning)
    return '#EF4444'; // red (needs work)
  };

  // Get status color class using brand colors
  const getStatusColorClass = (status: 'green' | 'yellow' | 'red'): string => {
    if (status === 'green') return 'bg-accent';
    if (status === 'yellow') return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <>
      <Helmet>
        <title>Accelerator Readiness Checklist | Startup Prep Tool | zScale Capital</title>
        <meta
          name="description"
          content="Evaluate your startup's readiness for accelerator programs. Get a detailed score and identify areas to improve before applying."
        />
        <meta
          name="keywords"
          content="accelerator readiness checklist, startup accelerator preparation, YC application checklist, Techstars readiness, startup accelerator requirements"
        />
        <link rel="canonical" href="https://zscalecapital.com/tools/accelerator-checklist" />

        {/* Open Graph */}
        <meta property="og:title" content="Accelerator Readiness Checklist | zScale Capital" />
        <meta
          property="og:description"
          content="Are you ready for Y Combinator, Techstars, or other accelerators? Find out with our free checklist."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://zscalecapital.com/tools/accelerator-checklist" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Accelerator Readiness Checklist" />
        <meta
          name="twitter:description"
          content="Score your startup's accelerator readiness in 5 categories"
        />
      </Helmet>

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Accelerator Readiness Checklist',
          description: 'Diagnostic tool to evaluate startup readiness for accelerator applications',
          url: 'https://zscalecapital.com/tools/accelerator-checklist',
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
        })}
      </script>

      <div className="min-h-screen bg-ink pt-20">
        {/* Header Section */}
        <div className="bg-ink-light border-b border-ink-border">
          <div className="max-w-7xl mx-auto px-6 py-12">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-neutral-500 mb-6">
              <Link to="/" className="hover:text-accent transition-colors text-neutral-400">
                Home
              </Link>
              <span className="text-neutral-600">/</span>
              <span className="text-accent font-medium">Checklist</span>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              {/* Score Gauge */}
              <div className="flex items-center gap-8">
                <div className="relative">
                  <svg width="120" height="120" viewBox="0 0 120 120" className="transform -rotate-90">
                    {/* Background circle */}
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="#1C1C1E"
                      strokeWidth="10"
                      opacity="0.5"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke={getScoreColor(scoreData.totalScore)}
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={`${(scoreData.totalScore / 100) * 314} 314`}
                      style={{ transition: 'stroke-dasharray 0.5s ease-out' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span
                      className="text-4xl font-bold"
                      style={{ color: getScoreColor(scoreData.totalScore) }}
                    >
                      {scoreData.totalScore}
                    </span>
                    <span className="text-xs text-neutral-500">/ 100</span>
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                    {readinessMessage.title}
                  </h1>
                  <p className="text-neutral-400 max-w-md">
                    {readinessMessage.message}
                  </p>
                </div>
              </div>

              {/* CTA Button */}
              <div className="flex flex-col items-start lg:items-end gap-3">
                <Link
                  to="/membership"
                  className="inline-flex items-center gap-3 px-6 py-3 bg-accent text-ink font-semibold rounded-lg hover:bg-accent-hover transition-colors shadow-glow"
                >
                  {/* Lock Icon - white for high visibility on teal */}
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Get Premium Access
                </Link>
                {completedItems.length > 0 && (
                  <button
                    onClick={handleReset}
                    className="text-sm text-neutral-500 hover:text-accent transition-colors"
                  >
                    Reset Progress
                  </button>
                )}
              </div>
            </div>

            {/* Category Progress Bars */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
              {checklistCategories.map((category) => {
                const percentage = scoreData.categoryPercentages[category.id];
                const status = getTrafficLightStatus(percentage);
                return (
                  <div key={category.id} className="bg-ink-medium rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium text-white uppercase tracking-wide">
                        {category.title}
                      </span>
                      <span className="text-xs font-bold text-accent">
                        {scoreData.categoryScores[category.id]}/{category.maxPoints}
                      </span>
                    </div>
                    <div className="h-1.5 bg-ink-border rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getStatusColorClass(status)} rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Checklist Grid - Compact Cards */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold text-white mb-8">
            Complete Your Checklist
          </h2>

          {/* 2-3 Column Grid for Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {checklistCategories.map((category) => {
              const items = itemsByCategory[category.id];
              const completedCount = items.filter((item) => completedItems.includes(item.id)).length;
              const categoryScore = items.reduce((sum, item) =>
                completedItems.includes(item.id) ? sum + item.points : sum, 0
              );

              return (
                <div
                  key={category.id}
                  className="card-skeuomorphic overflow-hidden"
                >
                  {/* Category Header */}
                  <div className="bg-ink-medium px-4 py-3 flex items-center justify-between border-b border-ink-border">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{category.icon}</span>
                      <h3 className="font-semibold text-white text-sm">{category.title}</h3>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-neutral-500">{completedCount}/{items.length}</span>
                      <span className="text-xs font-bold text-accent ml-2">
                        {categoryScore}/{category.maxPoints}
                      </span>
                    </div>
                  </div>

                  {/* Items - Compact */}
                  <div className="p-3 space-y-2">
                    {items.map((item) => {
                      const isChecked = completedItems.includes(item.id);
                      return (
                        <label
                          key={item.id}
                          className={`flex items-start gap-2 p-2 rounded-lg cursor-pointer transition-all ${
                            isChecked
                              ? 'bg-accent/10 border border-accent/30'
                              : 'bg-ink-medium border border-transparent hover:border-ink-border'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleItem(item.id)}
                            className="mt-0.5 w-4 h-4 rounded border-ink-border text-accent focus:ring-accent bg-ink-medium"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className={`text-sm font-medium ${isChecked ? 'text-accent' : 'text-white'}`}>
                                {item.title}
                              </span>
                              <span className="text-xs text-neutral-500 whitespace-nowrap">
                                +{item.points}
                              </span>
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tips Section - Compact */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 card-skeuomorphic">
              <h4 className="font-semibold text-accent mb-2">Apply Early</h4>
              <p className="text-sm text-neutral-500">
                Top accelerators review on a rolling basis. Earlier = more attention.
              </p>
            </div>
            <div className="p-4 card-skeuomorphic">
              <h4 className="font-semibold text-accent mb-2">Show Traction</h4>
              <p className="text-sm text-neutral-500">
                10 paying customers beats projections. Demonstrate real demand.
              </p>
            </div>
            <div className="p-4 card-skeuomorphic">
              <h4 className="font-semibold text-accent mb-2">Be Concise</h4>
              <p className="text-sm text-neutral-500">
                Partners read thousands of apps. Clear, direct answers win.
              </p>
            </div>
            <div className="p-4 card-skeuomorphic">
              <h4 className="font-semibold text-accent mb-2">Team Chemistry</h4>
              <p className="text-sm text-neutral-500">
                Accelerators invest in teams. Show why yours will win.
              </p>
            </div>
          </div>

          {/* FAQ Section - Compact */}
          <div className="mt-12 card-skeuomorphic p-6">
            <h3 className="text-xl font-bold text-white mb-6">FAQ</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-white mb-1">What score do I need?</h4>
                <p className="text-sm text-neutral-500">
                  Startups scoring 70+ have stronger applications. Focus on incomplete areas first.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">Is progress saved?</h4>
                <p className="text-sm text-neutral-500">
                  Yes! Progress is saved in your browser. Come back anytime.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const AcceleratorChecklist = () => {
  return (
    <ToolAccessGate toolName="Accelerator Readiness Checklist" toolId="accelerator-checklist">
      <AcceleratorChecklistContent />
    </ToolAccessGate>
  );
};
