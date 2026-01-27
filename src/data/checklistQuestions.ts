import { ChecklistCategory, ChecklistItem, ChecklistCategoryId } from '../types/tools';

export const checklistCategories: ChecklistCategory[] = [
  {
    id: 'product',
    title: 'Product Readiness',
    description: 'How developed and validated is your product?',
    maxPoints: 25,
    icon: '🚀',
  },
  {
    id: 'market',
    title: 'Market Validation',
    description: 'How well do you understand your market and customers?',
    maxPoints: 25,
    icon: '📊',
  },
  {
    id: 'team',
    title: 'Team Composition',
    description: 'Does your team have the right skills and commitment?',
    maxPoints: 20,
    icon: '👥',
  },
  {
    id: 'traction',
    title: 'Traction Metrics',
    description: 'What evidence of market demand do you have?',
    maxPoints: 20,
    icon: '📈',
  },
  {
    id: 'pitch',
    title: 'Pitch Materials',
    description: 'Are you ready to present to investors and accelerators?',
    maxPoints: 10,
    icon: '🎯',
  },
];

export const checklistItems: ChecklistItem[] = [
  // Product Readiness (25 points)
  {
    id: 'product-1',
    categoryId: 'product',
    title: 'MVP is live and functional',
    description: 'Your minimum viable product is deployed and accessible to users',
    points: 8,
  },
  {
    id: 'product-2',
    categoryId: 'product',
    title: 'User feedback collected and analyzed',
    description: 'You have gathered feedback from at least 10 real users',
    points: 6,
  },
  {
    id: 'product-3',
    categoryId: 'product',
    title: 'Clear problem-solution fit documented',
    description: 'You can articulate the problem and how your solution addresses it',
    points: 6,
  },
  {
    id: 'product-4',
    categoryId: 'product',
    title: 'Technical documentation exists',
    description: 'Architecture diagrams, API docs, or technical specs are available',
    points: 5,
  },

  // Market Validation (25 points)
  {
    id: 'market-1',
    categoryId: 'market',
    title: 'TAM/SAM/SOM defined',
    description: 'You have calculated Total, Serviceable, and Obtainable Market sizes',
    points: 6,
  },
  {
    id: 'market-2',
    categoryId: 'market',
    title: 'Customer interviews completed (10+)',
    description: 'You have conducted structured interviews with potential customers',
    points: 7,
  },
  {
    id: 'market-3',
    categoryId: 'market',
    title: 'Competitive analysis done',
    description: 'You understand competitors and can articulate your differentiation',
    points: 6,
  },
  {
    id: 'market-4',
    categoryId: 'market',
    title: 'Go-to-market strategy outlined',
    description: 'You have a plan for customer acquisition and channel strategy',
    points: 6,
  },

  // Team Composition (20 points)
  {
    id: 'team-1',
    categoryId: 'team',
    title: 'Technical co-founder on team',
    description: 'At least one founder can build the core product',
    points: 6,
  },
  {
    id: 'team-2',
    categoryId: 'team',
    title: 'Full-time commitment from founders',
    description: 'Key founders are working on the startup full-time',
    points: 6,
  },
  {
    id: 'team-3',
    categoryId: 'team',
    title: 'Complementary skills across team',
    description: 'Team covers technical, business, and domain expertise',
    points: 4,
  },
  {
    id: 'team-4',
    categoryId: 'team',
    title: 'Previous startup or relevant experience',
    description: 'At least one founder has prior startup or deep industry experience',
    points: 4,
  },

  // Traction Metrics (20 points)
  {
    id: 'traction-1',
    categoryId: 'traction',
    title: 'Active users or paying customers',
    description: 'You have real users engaging with your product or paying for it',
    points: 7,
  },
  {
    id: 'traction-2',
    categoryId: 'traction',
    title: 'Month-over-month growth',
    description: 'You can demonstrate positive growth trends in key metrics',
    points: 5,
  },
  {
    id: 'traction-3',
    categoryId: 'traction',
    title: 'Customer testimonials available',
    description: 'You have documented positive feedback from customers',
    points: 4,
  },
  {
    id: 'traction-4',
    categoryId: 'traction',
    title: 'Partnerships or LOIs secured',
    description: 'You have formal commitments or partnerships with other companies',
    points: 4,
  },

  // Pitch Materials (10 points)
  {
    id: 'pitch-1',
    categoryId: 'pitch',
    title: 'Pitch deck complete (10-15 slides)',
    description: 'You have a polished investor deck covering all key areas',
    points: 4,
  },
  {
    id: 'pitch-2',
    categoryId: 'pitch',
    title: 'One-pager executive summary ready',
    description: 'You have a single-page summary of your startup',
    points: 3,
  },
  {
    id: 'pitch-3',
    categoryId: 'pitch',
    title: 'Demo video or live demo available',
    description: 'You can show your product in action through video or live demo',
    points: 3,
  },
];

// Calculate score based on completed items
export function calculateScore(completedItemIds: string[]): {
  totalScore: number;
  categoryScores: Record<ChecklistCategoryId, number>;
  categoryPercentages: Record<ChecklistCategoryId, number>;
} {
  const categoryScores: Record<ChecklistCategoryId, number> = {
    product: 0,
    market: 0,
    team: 0,
    traction: 0,
    pitch: 0,
  };

  // Calculate points per category
  completedItemIds.forEach((itemId) => {
    const item = checklistItems.find((i) => i.id === itemId);
    if (item) {
      categoryScores[item.categoryId] += item.points;
    }
  });

  // Calculate percentages
  const categoryPercentages: Record<ChecklistCategoryId, number> = {} as Record<
    ChecklistCategoryId,
    number
  >;
  checklistCategories.forEach((cat) => {
    categoryPercentages[cat.id] = Math.round((categoryScores[cat.id] / cat.maxPoints) * 100);
  });

  // Calculate total score
  const totalScore = Object.values(categoryScores).reduce((a, b) => a + b, 0);

  return {
    totalScore,
    categoryScores,
    categoryPercentages,
  };
}

// Get traffic light status based on percentage
export function getTrafficLightStatus(percentage: number): 'green' | 'yellow' | 'red' {
  if (percentage >= 80) return 'green';
  if (percentage >= 50) return 'yellow';
  return 'red';
}

// Get overall readiness message
export function getReadinessMessage(score: number): {
  title: string;
  message: string;
  color: string;
} {
  if (score >= 71) {
    return {
      title: 'Accelerator Ready!',
      message:
        'Your startup shows strong fundamentals. You are well-prepared to apply to top accelerators.',
      color: '#10B981',
    };
  } else if (score >= 41) {
    return {
      title: 'Almost There',
      message:
        'You have a solid foundation but should address the red areas before applying to accelerators.',
      color: '#F59E0B',
    };
  }
  return {
    title: 'More Work Needed',
    message:
      'Focus on building your product and team before accelerator applications. The checklist highlights key areas.',
    color: '#EF4444',
  };
}
