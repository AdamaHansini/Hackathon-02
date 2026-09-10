import { User } from '../models/User.js';
import { GameSession } from '../models/GameSession.js';
import { Answer } from '../models/Answer.js';
import { Challenge } from '../models/Challenge.js';
import { UserAchievement } from '../models/UserAchievement.js';

export const userController = {
  async getProfile(req, res, next) {
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      const achievements = await UserAchievement.find({ userId: req.user._id });

      res.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          gamesPlayed: user.gamesPlayed || 0,
          gamesCompleted: user.gamesCompleted || 0,
          bestScore: user.bestScore || 0,
          averageScore: user.averageScore || 0,
          accuracy: user.accuracy || 0,
          badges: user.badges || [],
          achievements
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async updateProfile(req, res, next) {
    try {
      const { name } = req.body;
      if (!name || name.trim().length < 2) {
        return res.status(400).json({ success: false, message: 'Valid name is required.' });
      }

      const updated = await User.findByIdAndUpdate(req.user._id, {
        name: name.trim()
      });

      res.json({
        success: true,
        message: 'Profile updated successfully.',
        user: {
          id: updated._id,
          name: updated.name,
          email: updated.email,
          role: updated.role
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async getHistory(req, res, next) {
    try {
      const games = await GameSession.find({ userId: req.user._id });
      // Sort newest first
      games.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());

      res.json({
        success: true,
        history: games.map(g => ({
          id: g._id,
          date: g.completedAt || g.startedAt,
          score: g.score,
          livesRemaining: g.lives,
          correctAnswers: g.correctAnswers,
          wrongAnswers: g.wrongAnswers,
          status: g.status,
          percentage: g.percentage,
          badge: g.badge || 'N/A'
        }))
      });
    } catch (error) {
      next(error);
    }
  },

  async getStatistics(req, res, next) {
    try {
      const user = await User.findById(req.user._id);
      const userAnswers = await Answer.find({ userId: req.user._id });

      const categoryStats = {
        PHISHING: { total: 0, correct: 0, percentage: 0 },
        PASSWORD: { total: 0, correct: 0, percentage: 0 },
        FAKE_QR: { total: 0, correct: 0, percentage: 0 },
        SCAM_MESSAGE: { total: 0, correct: 0, percentage: 0 }
      };

      for (const ans of userAnswers) {
        const ch = await Challenge.findById(ans.challengeId);
        if (ch && categoryStats[ch.category]) {
          categoryStats[ch.category].total++;
          if (ans.isCorrect) {
            categoryStats[ch.category].correct++;
          }
        }
      }

      const categoryPercentages = {};
      let strongest = { category: 'Phishing', percentage: -1 };
      let weakest = { category: 'Fake QR', percentage: 101 };

      const categoryLabels = {
        PHISHING: 'Phishing',
        PASSWORD: 'Passwords',
        FAKE_QR: 'Fake QR',
        SCAM_MESSAGE: 'Scam Messages'
      };

      for (const [cat, data] of Object.entries(categoryStats)) {
        const pct = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
        categoryStats[cat].percentage = pct;
        categoryPercentages[categoryLabels[cat]] = pct;

        if (data.total > 0) {
          if (pct > strongest.percentage) {
            strongest = { category: categoryLabels[cat], percentage: pct };
          }
          if (pct < weakest.percentage) {
            weakest = { category: categoryLabels[cat], percentage: pct };
          }
        }
      }

      if (strongest.percentage === -1) strongest = { category: 'None yet', percentage: 0 };
      if (weakest.percentage === 101) weakest = { category: 'None yet', percentage: 0 };

      // Recommendations based on weak areas
      const recommendations = [];
      if (categoryStats.FAKE_QR.percentage < 70) {
        recommendations.push({
          category: 'Fake QR',
          tip: 'Always preview URLs encoded in QR codes and avoid scanning untrusted physical stickers.'
        });
      }
      if (categoryStats.PHISHING.percentage < 70) {
        recommendations.push({
          category: 'Phishing',
          tip: 'Inspect sender domains thoroughly, watch for artificial urgency, and never click direct login links.'
        });
      }
      if (categoryStats.PASSWORD.percentage < 70) {
        recommendations.push({
          category: 'Passwords',
          tip: 'Adopt unique, multi-word passphrases with mixed symbols rather than predictable dictionary substitutions.'
        });
      }
      if (categoryStats.SCAM_MESSAGE.percentage < 70) {
        recommendations.push({
          category: 'Scam Messages',
          tip: 'Treat unsolicited prize, parcel, or KYC SMS alerts as fraudulent until verified via official company channels.'
        });
      }

      res.json({
        success: true,
        stats: {
          gamesPlayed: user.gamesPlayed || 0,
          gamesCompleted: user.gamesCompleted || 0,
          bestScore: user.bestScore || 0,
          averageScore: user.averageScore || 0,
          accuracy: user.accuracy || 0,
          categoryBreakdown: categoryStats,
          categoryPercentages,
          strongestArea: strongest.category,
          weakestArea: weakest.category,
          recommendations
        }
      });
    } catch (error) {
      next(error);
    }
  }
};
