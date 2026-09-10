import { getPointsForDifficulty, calculatePercentage, calculateBadge } from '../utils/calculateScore.js';

export const scoringService = {
  getPoints(difficulty) {
    return getPointsForDifficulty(difficulty);
  },

  calculateSessionPercentage(score, totalChallenges, maxPossibleScore) {
    const theoreticalMax = maxPossibleScore || (totalChallenges * 20);
    return calculatePercentage(score, theoreticalMax);
  },

  calculateAccuracy(correctCount, totalCount) {
    if (!totalCount || totalCount === 0) return 0;
    return Math.round((correctCount / totalCount) * 100);
  }
};
