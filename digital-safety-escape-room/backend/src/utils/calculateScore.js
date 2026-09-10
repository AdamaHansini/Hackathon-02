/**
 * Central scoring utility
 * Default:
 * Easy = 10 points
 * Medium = 20 points
 * Hard = 30 points
 * Wrong Answer = -1 Life
 */

export const getPointsForDifficulty = (difficulty) => {
  switch (difficulty?.toUpperCase()) {
    case 'HARD':
      return 30;
    case 'MEDIUM':
      return 20;
    case 'EASY':
    default:
      return 10;
  }
};

export const calculatePercentage = (obtainedScore, maxScore) => {
  if (!maxScore || maxScore <= 0) return 0;
  return Math.min(100, Math.round((obtainedScore / maxScore) * 100));
};

export const calculateBadge = (percentage) => {
  if (percentage >= 76) {
    return {
      title: 'CYBER SAFETY EXPERT',
      tier: 'EXPERT',
      description: 'Strong awareness of common cyber threats.',
      minPercentage: 76
    };
  } else if (percentage >= 41) {
    return {
      title: 'CYBER SMART',
      tier: 'SMART',
      description: 'Understands most common digital safety risks.',
      minPercentage: 41
    };
  } else {
    return {
      title: 'CYBER BEGINNER',
      tier: 'BEGINNER',
      description: 'Needs more practice with basic cyber safety.',
      minPercentage: 0
    };
  }
};
