import { ScoreSummary, PerformanceCategory } from '../types';

export function calculateScore(
  totalQuestions: number,
  answers: Record<string, string>,
  correctAnswersMap: Record<string, string>
): ScoreSummary {
  let correct = 0;
  let incorrect = 0;
  let unanswered = 0;

  Object.entries(correctAnswersMap).forEach(([questionId, correctAns]) => {
    const candidateAns = answers[questionId];
    if (!candidateAns) {
      unanswered++;
    } else if (candidateAns === correctAns) {
      correct++;
    } else {
      incorrect++;
    }
  });

  const percentage = totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0;

  let category: PerformanceCategory;
  if (percentage >= 90) {
    category = 'Excellent';
  } else if (percentage >= 80) {
    category = 'Very Good';
  } else if (percentage >= 70) {
    category = 'Good — Review Weaker Topics';
  } else {
    category = 'More Practice Recommended';
  }

  return {
    correct,
    incorrect,
    unanswered,
    total: totalQuestions,
    percentage,
    category
  };
}

export function getCategoryBadgeClass(category: PerformanceCategory): string {
  switch (category) {
    case 'Excellent':
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    case 'Very Good':
      return 'bg-teal-100 text-teal-800 border-teal-300';
    case 'Good — Review Weaker Topics':
      return 'bg-amber-100 text-amber-800 border-amber-300';
    case 'More Practice Recommended':
    default:
      return 'bg-rose-100 text-rose-800 border-rose-300';
  }
}
