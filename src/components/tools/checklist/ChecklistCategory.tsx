import { useState } from 'react';
import { ChecklistCategory as CategoryType, ChecklistItem as ItemType } from '../../../types/tools';
import { ChecklistItem } from './ChecklistItem';
import { TrafficLightBar } from '../shared/TrafficLight';
import { getTrafficLightStatus } from '../../../data/checklistQuestions';

interface ChecklistCategoryProps {
  category: CategoryType;
  items: ItemType[];
  completedItems: string[];
  onToggleItem: (id: string) => void;
}

export const ChecklistCategory = ({
  category,
  items,
  completedItems,
  onToggleItem,
}: ChecklistCategoryProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Calculate category score
  const categoryScore = items.reduce((sum, item) => {
    return completedItems.includes(item.id) ? sum + item.points : sum;
  }, 0);

  const percentage = Math.round((categoryScore / category.maxPoints) * 100);
  const status = getTrafficLightStatus(percentage);

  const completedCount = items.filter((item) => completedItems.includes(item.id)).length;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
      {/* Category Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-5 flex items-center justify-between hover:bg-neutral-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <span className="text-2xl">{category.icon}</span>
          <div className="text-left">
            <h3 className="font-semibold text-neutral-900">{category.title}</h3>
            <p className="text-sm text-neutral-500">{category.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Score badge */}
          <div className="text-right">
            <p className="text-sm text-neutral-500">
              {completedCount}/{items.length} complete
            </p>
            <p className="text-lg font-semibold text-neutral-900">
              {categoryScore}/{category.maxPoints} pts
            </p>
          </div>

          {/* Expand/collapse icon */}
          <svg
            className={`w-5 h-5 text-neutral-400 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {/* Progress bar */}
      <div className="px-6 pb-4">
        <TrafficLightBar
          status={status}
          percentage={percentage}
          label=""
          showLabel={false}
        />
      </div>

      {/* Items */}
      {isExpanded && (
        <div className="px-6 pb-6 space-y-3">
          {items.map((item) => (
            <ChecklistItem
              key={item.id}
              id={item.id}
              title={item.title}
              description={item.description}
              points={item.points}
              isChecked={completedItems.includes(item.id)}
              onToggle={onToggleItem}
            />
          ))}
        </div>
      )}
    </div>
  );
};
