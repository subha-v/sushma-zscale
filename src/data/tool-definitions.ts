export const TOOL_DEFINITIONS = {
  'region-comparison': {
    title: 'Region comparison',
    subtitle: 'Compare talent pipelines, employer density and wage levels across any two Texas MSAs side by side.',
    features: ['Talent density by SOC code', 'Wage percentile comparison', 'Employer concentration index', 'Program output by CIP'],
    status: 'Coming Q3 2026',
  },
  'expansion-readiness': {
    title: 'Expansion readiness scorecard',
    subtitle: 'Score any Texas county on 12 readiness factors for corporate relocation or expansion.',
    features: ['Labor availability score', 'Skills match index', 'Infrastructure rating', 'Incentive landscape'],
    status: 'Coming Q3 2026',
  },
  'edc-directory': {
    title: 'EDC directory',
    subtitle: 'Searchable directory of every economic development corporation in Texas with contact info, budget size and focus sectors.',
    features: ['254 counties covered', 'Filter by focus sector', 'Budget and staff size', 'Direct contact details'],
    status: 'Coming Q4 2026',
  },
  'talent-source-finder': {
    title: 'Talent source finder',
    subtitle: 'Enter a job title or SOC code and see which Texas institutions produce the most qualified graduates for that role.',
    features: ['Program-to-occupation mapping', 'Graduate volume by institution', 'Salary outcome data', 'Geographic distribution'],
    status: 'Coming Q4 2026',
  },
} as const;

export type ToolKey = keyof typeof TOOL_DEFINITIONS;
