import { GameSession } from '../models/GameSession.js';
import { Answer } from '../models/Answer.js';
import { Challenge } from '../models/Challenge.js';
import { User } from '../models/User.js';
import { badgeService } from '../services/badgeService.js';

export const resultController = {
  async getGameResult(req, res, next) {
    try {
      const session = await GameSession.findById(req.params.gameId);
      if (!session) {
        return res.status(404).json({ success: false, message: 'Game session not found.' });
      }
      if (String(session.userId) !== String(req.user._id)) {
        return res.status(403).json({ success: false, message: 'You are not allowed to view this game result.' });
      }

      // Fetch answers for this game
      const answers = await Answer.find({ gameId: req.params.gameId });
      const detailedAnswers = [];

      for (const ans of answers) {
        const challenge = await Challenge.findById(ans.challengeId);
        detailedAnswers.push({
          challengeId: ans.challengeId,
          title: challenge?.title || 'Cyber Challenge',
          category: challenge?.category || 'PHISHING',
          selectedAnswer: ans.selectedAnswer,
          correctAnswer: ans.correctAnswer,
          isCorrect: ans.isCorrect,
          pointsEarned: ans.pointsEarned,
          lifeLost: ans.lifeLost,
          explanation: challenge?.explanation,
          warningSigns: challenge?.warningSigns || []
        });
      }

      const totalChallenges = session.challengeIds.length;
      const accuracy = totalChallenges > 0 ? Math.round((session.correctAnswers / totalChallenges) * 100) : 0;
      const badgeInfo = badgeService.resolveBadge(session.percentage);

      // Category breakdown calculation
      const categorySummary = {
        Phishing: { total: 0, correct: 0, percentage: 0 },
        Passwords: { total: 0, correct: 0, percentage: 0 },
        'Fake QR': { total: 0, correct: 0, percentage: 0 },
        'Scam Messages': { total: 0, correct: 0, percentage: 0 }
      };

      const categoryMap = {
        PHISHING: 'Phishing',
        PASSWORD: 'Passwords',
        FAKE_QR: 'Fake QR',
        SCAM_MESSAGE: 'Scam Messages'
      };

      for (const a of detailedAnswers) {
        const catKey = categoryMap[a.category] || 'Phishing';
        categorySummary[catKey].total++;
        if (a.isCorrect) categorySummary[catKey].correct++;
      }

      let strongest = { category: 'Phishing', percentage: -1 };
      let weakest = { category: 'Fake QR', percentage: 101 };

      for (const [cat, data] of Object.entries(categorySummary)) {
        data.percentage = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
        if (data.total > 0) {
          if (data.percentage > strongest.percentage) {
            strongest = { category: cat, percentage: data.percentage };
          }
          if (data.percentage < weakest.percentage) {
            weakest = { category: cat, percentage: data.percentage };
          }
        }
      }

      if (strongest.percentage === -1) strongest = { category: 'N/A', percentage: 0 };
      if (weakest.percentage === 101) weakest = { category: 'N/A', percentage: 0 };

      // Learning recommendations
      const recommendations = [];
      if (categorySummary['Fake QR'].percentage < 100 && categorySummary['Fake QR'].total > 0) {
        recommendations.push({
          area: 'QR Code Safety',
          recommendation: 'Verify QR destinations carefully, avoid scanning unexpected public stickers, and never input credentials after scanning.'
        });
      }
      if (categorySummary['Phishing'].percentage < 100 && categorySummary['Phishing'].total > 0) {
        recommendations.push({
          area: 'Phishing Detection',
          recommendation: 'Look closely at domain spellings (e.g. .co vs .com, lookalike characters), verify urgent security alerts separately, and do not trust forged sender names.'
        });
      }
      if (categorySummary['Passwords'].percentage < 100 && categorySummary['Passwords'].total > 0) {
        recommendations.push({
          area: 'Password Security',
          recommendation: 'Prioritize password length and randomness. Avoid common words, birth years, and predictable sequential substitutions.'
        });
      }
      if (categorySummary['Scam Messages'].percentage < 100 && categorySummary['Scam Messages'].total > 0) {
        recommendations.push({
          area: 'Scam Messaging',
          recommendation: 'Disregard unexpected prize or urgent bank KYC SMS messages. Legitimate organizations never demand instant panic responses over SMS.'
        });
      }

      res.json({
        success: true,
        result: {
          gameId: session._id,
          finalScore: session.score,
          percentage: session.percentage,
          correctAnswers: session.correctAnswers,
          incorrectAnswers: session.wrongAnswers,
          accuracy,
          livesRemaining: session.lives,
          status: session.status,
          isEscaped: session.status === 'COMPLETED' && session.lives > 0,
          badge: badgeInfo,
          categorySummary,
          strongestCategory: strongest.category,
          weakestCategory: weakest.category,
          recommendations,
          detailedAnswers
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async getLeaderboard(req, res, next) {
    try {
      const users = await User.find({ role: 'user' });

      // Rank by bestScore descending, then accuracy descending
      const ranked = users
        .filter(u => (u.gamesPlayed || 0) > 0)
        .map((u, index) => ({
          rank: 0,
          name: u.name,
          bestScore: u.bestScore || 0,
          accuracy: u.accuracy || 0,
          gamesCompleted: u.gamesCompleted || 0,
          badge: u.badges && u.badges.length > 0 ? u.badges[u.badges.length - 1] : 'CYBER BEGINNER'
        }))
        .sort((a, b) => b.bestScore - a.bestScore || b.accuracy - a.accuracy)
        .slice(0, 50)
        .map((item, idx) => ({ ...item, rank: idx + 1 }));

      res.json({
        success: true,
        leaderboard: ranked
      });
    } catch (error) {
      next(error);
    }
  }
};
