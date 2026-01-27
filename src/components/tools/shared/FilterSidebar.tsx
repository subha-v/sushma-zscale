import { useState } from 'react';

interface FilterGroup {
  id: string;
  label: string;
  options: string[];
}

interface FilterSidebarProps {
  filterGroups: FilterGroup[];
  selectedFilters: Record<string, string[]>;
  onFilterChange: (groupId: string, values: string[]) => void;
  onClearAll: () => void;
}

export const FilterSidebar = ({
  filterGroups,
  selectedFilters,
  onFilterChange,
  onClearAll,
}: FilterSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    Object.fromEntries(filterGroups.map((g) => [g.id, true]))
  );

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const handleCheckboxChange = (groupId: string, option: string, checked: boolean) => {
    const currentValues = selectedFilters[groupId] || [];
    const newValues = checked
      ? [...currentValues, option]
      : currentValues.filter((v) => v !== option);
    onFilterChange(groupId, newValues);
  };

  const totalFilters = Object.values(selectedFilters).reduce(
    (sum, arr) => sum + arr.length,
    0
  );

  return (
    <aside
      className={`card-skeuomorphic transition-all duration-300 ${
        isCollapsed ? 'w-12' : 'w-72'
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-ink-border flex items-center justify-between">
        {!isCollapsed && (
          <>
            <h3 className="font-semibold text-white">Filters</h3>
            {totalFilters > 0 && (
              <button
                onClick={onClearAll}
                className="text-sm text-accent hover:text-accent-hover transition-colors"
              >
                Clear all ({totalFilters})
              </button>
            )}
          </>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 hover:bg-ink-medium rounded-lg transition-colors"
          aria-label={isCollapsed ? 'Expand filters' : 'Collapse filters'}
        >
          <svg
            className={`w-5 h-5 text-neutral-500 transition-transform ${
              isCollapsed ? 'rotate-180' : ''
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      {/* Filter groups */}
      {!isCollapsed && (
        <div className="p-4 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          {filterGroups.map((group) => (
            <div key={group.id} className="border-b border-ink-border pb-4 last:border-0">
              {/* Group header */}
              <button
                onClick={() => toggleGroup(group.id)}
                className="w-full flex items-center justify-between py-2 text-left"
              >
                <span className="font-medium text-white">{group.label}</span>
                <svg
                  className={`w-4 h-4 text-neutral-500 transition-transform ${
                    expandedGroups[group.id] ? 'rotate-180' : ''
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
              </button>

              {/* Options */}
              {expandedGroups[group.id] && (
                <div className="mt-2 space-y-2">
                  {group.options.map((option) => {
                    const isChecked = (selectedFilters[group.id] || []).includes(option);
                    return (
                      <label
                        key={option}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) =>
                              handleCheckboxChange(group.id, option, e.target.checked)
                            }
                            className="sr-only"
                          />
                          <div
                            className={`w-5 h-5 rounded border-2 transition-all ${
                              isChecked
                                ? 'bg-accent border-accent'
                                : 'border-ink-border group-hover:border-neutral-500'
                            }`}
                          >
                            {isChecked && (
                              <svg
                                className="w-full h-full text-ink"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={3}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </div>
                        </div>
                        <span className="text-sm text-neutral-400 group-hover:text-white transition-colors">
                          {option}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </aside>
  );
};

// Mobile filter button and drawer
interface MobileFilterButtonProps {
  onClick: () => void;
  activeCount: number;
}

export const MobileFilterButton = ({ onClick, activeCount }: MobileFilterButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="lg:hidden flex items-center gap-2 px-4 py-2 bg-ink-light border border-ink-border rounded-xl hover:bg-ink-medium transition-colors text-white"
    >
      <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
        />
      </svg>
      <span>Filters</span>
      {activeCount > 0 && (
        <span className="w-5 h-5 flex items-center justify-center bg-accent text-ink text-xs rounded-full">
          {activeCount}
        </span>
      )}
    </button>
  );
};
