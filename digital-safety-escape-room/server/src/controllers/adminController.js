import { User } from '../models/User.js';
import { GameSession } from '../models/GameSession.js';
import { Challenge } from '../models/Challenge.js';
import { Answer } from '../models/Answer.js';
import { GoogleGenAI } from '@google/genai';

export const adminController = {
  async getUsers(req, res, next) {
    try {
      const users = await User.find({});
      res.json({
        success: true,
        users: users.map(u => ({
          _id: u._id,
          id: u._id,
          name: u.name,
          email: u.email,
          role: u.role,
          gamesPlayed: u.gamesPlayed || 0,
          gamesCompleted: u.gamesCompleted || 0,
          bestScore: u.bestScore || 0,
          averageScore: u.averageScore || 0,
          accuracy: u.accuracy || 0,
          badges: u.badges || [],
          achievements: u.achievements || [],
          createdAt: u.createdAt
        }))
      });
    } catch (error) {
      next(error);
    }
  },

  async getUserPerformance(req, res, next) {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      const sessions = await GameSession.find({ userId });
      const answers = await Answer.find({ userId });

      // Calculate category breakdown for this cadet
      const categoryStats = {
        PHISHING: { total: 0, correct: 0 },
        PASSWORD: { total: 0, correct: 0 },
        FAKE_QR: { total: 0, correct: 0 },
        SCAM_MESSAGE: { total: 0, correct: 0 }
      };

      for (const ans of answers) {
        const challenge = await Challenge.findById(ans.challengeId);
        if (challenge && categoryStats[challenge.category]) {
          categoryStats[challenge.category].total++;
          if (ans.isCorrect) {
            categoryStats[challenge.category].correct++;
          }
        }
      }

      const categoryPerformance = {};
      for (const [cat, data] of Object.entries(categoryStats)) {
        categoryPerformance[cat] = {
          total: data.total,
          correct: data.correct,
          accuracy: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0
        };
      }

      // Recent sessions
      const recentSessions = sessions
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 10)
        .map(s => ({
          _id: s._id,
          status: s.status,
          score: s.score,
          livesRemaining: s.livesRemaining,
          totalChallenges: s.challenges?.length || 0,
          completedAt: s.completedAt,
          createdAt: s.createdAt
        }));

      res.json({
        success: true,
        user: {
          _id: user._id,
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          gamesPlayed: user.gamesPlayed || sessions.length,
          gamesCompleted: user.gamesCompleted || sessions.filter(s => s.status === 'COMPLETED').length,
          bestScore: user.bestScore || 0,
          averageScore: user.averageScore || 0,
          accuracy: user.accuracy || 0,
          badges: user.badges || [],
          achievements: user.achievements || [],
          createdAt: user.createdAt
        },
        categoryPerformance,
        recentSessions,
        totalAnswers: answers.length,
        correctAnswers: answers.filter(a => a.isCorrect).length
      });
    } catch (error) {
      next(error);
    }
  },

  async updateUserRole(req, res, next) {
    try {
      const { id } = req.params;
      const { role } = req.body;

      if (!['user', 'admin'].includes(role)) {
        return res.status(400).json({ success: false, message: 'Invalid role. Must be user or admin.' });
      }

      // Prevent demoting the root seeded admin
      const targetUser = await User.findById(id);
      if (!targetUser) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      if ((targetUser.email === 'admin@gmail.com' || targetUser.email === 'admin@example.com') && role !== 'admin') {
        return res.status(400).json({ success: false, message: 'Primary System Admin role cannot be removed.' });
      }

      const updated = await User.findByIdAndUpdate(id, { role });
      res.json({
        success: true,
        message: `User role updated to ${role}.`,
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

  async resetUserStats(req, res, next) {
    try {
      const { id } = req.params;
      const targetUser = await User.findById(id);
      if (!targetUser) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      const updated = await User.findByIdAndUpdate(id, {
        gamesPlayed: 0,
        gamesCompleted: 0,
        bestScore: 0,
        averageScore: 0,
        accuracy: 0,
        badges: [],
        achievements: []
      });

      res.json({
        success: true,
        message: `Cadet stats reset successfully for ${targetUser.name}.`,
        user: updated
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;

      if (String(req.user._id) === String(id)) {
        return res.status(400).json({ success: false, message: 'Self-deletion is prohibited.' });
      }

      const targetUser = await User.findById(id);
      if (!targetUser) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      if (targetUser.email === 'admin@gmail.com' || targetUser.email === 'admin@example.com') {
        return res.status(400).json({ success: false, message: 'Primary System Admin account cannot be deleted.' });
      }

      await User.findByIdAndDelete(id);
      res.json({
        success: true,
        message: `User ${targetUser.name} (${targetUser.email}) removed from system.`
      });
    } catch (error) {
      next(error);
    }
  },

  async getStatistics(req, res, next) {
    try {
      const totalUsers = await User.countDocuments({ role: 'user' });
      const totalAdmins = await User.countDocuments({ role: 'admin' });
      const allSessions = await GameSession.find({});
      const allChallenges = await Challenge.find({});
      const activeChallenges = allChallenges.filter(c => c.active !== false);
      const allAnswers = await Answer.find({});

      const gamesPlayed = allSessions.length;
      const gamesCompleted = allSessions.filter(s => s.status === 'COMPLETED').length;
      const gamesFailed = allSessions.filter(s => s.status === 'FAILED').length;
      const completionRate = gamesPlayed > 0 ? Math.round((gamesCompleted / gamesPlayed) * 100) : 0;

      const scores = allSessions.map(s => s.score || 0);
      const averageScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

      // Missed challenges and difficulty by category
      const challengeFailures = {};
      const challengeAttempts = {};
      const categoryFails = {
        PHISHING: { attempts: 0, correct: 0, wrong: 0 },
        PASSWORD: { attempts: 0, correct: 0, wrong: 0 },
        FAKE_QR: { attempts: 0, correct: 0, wrong: 0 },
        SCAM_MESSAGE: { attempts: 0, correct: 0, wrong: 0 }
      };

      for (const ans of allAnswers) {
        const ch = await Challenge.findById(ans.challengeId);
        if (ch) {
          if (!categoryFails[ch.category]) {
            categoryFails[ch.category] = { attempts: 0, correct: 0, wrong: 0 };
          }
          categoryFails[ch.category].attempts++;
          challengeAttempts[ch._id] = (challengeAttempts[ch._id] || 0) + 1;

          if (ans.isCorrect) {
            categoryFails[ch.category].correct++;
          } else {
            categoryFails[ch.category].wrong++;
            challengeFailures[ch._id] = (challengeFailures[ch._id] || 0) + 1;
          }
        }
      }

      // Find most difficult category and category performance data
      let mostDifficultCategory = 'PHISHING';
      let highestFailRate = -1;
      const categoryPerformance = {};

      const catLabels = {
        PHISHING: 'Phishing Vectors',
        PASSWORD: 'Password Entropy',
        FAKE_QR: 'Quishing & Fake QR',
        SCAM_MESSAGE: 'Scam Messages'
      };

      for (const [cat, data] of Object.entries(categoryFails)) {
        const failRate = data.attempts > 0 ? Math.round((data.wrong / data.attempts) * 100) : 0;
        const successRate = data.attempts > 0 ? Math.round((data.correct / data.attempts) * 100) : 100;
        
        let threatLevel = 'SECURE';
        if (failRate > 40) threatLevel = 'CRITICAL RISK';
        else if (failRate > 25) threatLevel = 'HIGH VULNERABILITY';
        else if (failRate > 10) threatLevel = 'MODERATE RISK';

        categoryPerformance[cat] = {
          label: catLabels[cat] || cat,
          attempts: data.attempts,
          correct: data.correct,
          wrong: data.wrong,
          successRate,
          failRate,
          threatLevel
        };

        if (failRate > highestFailRate && data.attempts > 0) {
          highestFailRate = failRate;
          mostDifficultCategory = catLabels[cat] || cat;
        }
      }

      // Most frequently missed challenge
      let mostMissedChallengeId = null;
      let maxFails = 0;
      for (const [chId, fails] of Object.entries(challengeFailures)) {
        if (fails > maxFails) {
          maxFails = fails;
          mostMissedChallengeId = chId;
        }
      }

      let mostMissedChallenge = {
        title: 'None recorded yet',
        missCount: 0
      };
      if (mostMissedChallengeId) {
        const found = await Challenge.findById(mostMissedChallengeId);
        if (found) {
          mostMissedChallenge = {
            id: found._id,
            title: found.title,
            category: found.category,
            missCount: maxFails
          };
        }
      }

      // User performance metrics
      const users = await User.find({ role: 'user' });
      const topCadet = users.length > 0
        ? [...users].sort((a, b) => (b.bestScore || 0) - (a.bestScore || 0))[0]
        : null;

      const statsData = {
        totalUsers,
        totalAdmins,
        gamesPlayed,
        gamesCompleted,
        gamesFailed,
        completionRate,
        averageScore,
        totalChallenges: allChallenges.length,
        activeChallenges: activeChallenges.length,
        inactiveChallenges: allChallenges.length - activeChallenges.length,
        mostDifficultCategory,
        mostMissedChallenge,
        categoryPerformance,
        categoryBreakdown: categoryPerformance,
        topCadet: topCadet ? { name: topCadet.name, bestScore: topCadet.bestScore, accuracy: topCadet.accuracy } : null
      };

      res.json({
        success: true,
        stats: statsData,
        analytics: statsData
      });
    } catch (error) {
      next(error);
    }
  },

  async getChallenges(req, res, next) {
    try {
      const challenges = await Challenge.find({});
      res.json({
        success: true,
        challenges
      });
    } catch (error) {
      next(error);
    }
  },

  async generateAiChallenge(req, res, next) {
    try {
      const { category, difficulty } = req.body;
      const validCategory = ['PHISHING', 'PASSWORD', 'FAKE_QR', 'SCAM_MESSAGE'].includes(category)
        ? category
        : 'PHISHING';
      const validDifficulty = ['EASY', 'MEDIUM', 'HARD'].includes(difficulty)
        ? difficulty
        : 'MEDIUM';

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(503).json({
          success: false,
          message: 'GEMINI_API_KEY is not configured on the server.'
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are a cybersecurity expert creating realistic interactive challenges for an escape room educational game.
Generate a brand-new, realistic cybersecurity challenge for category: "${validCategory}" with difficulty "${validDifficulty}".
Categories explain:
- PHISHING: Realistic email / login alert with subtle telltale signs (sender domain spoofing, urgency, forged links).
- PASSWORD: User is presented with realistic password scenarios to select the strongest or safest password practice.
- FAKE_QR: Real-world QR code scan scenario (e.g., parking meter overlay, restaurant sticker, prize claim) where user decides SAFE or SUSPICIOUS.
- SCAM_MESSAGE: Realistic SMS / instant message pretending to be bank, parcel delivery, tax agency, or prize claim.

Return ONLY a valid JSON object with EXACTLY this structure (no markdown formatting, no code blocks):
{
  "title": "Short descriptive title",
  "category": "${validCategory}",
  "scenario": "Detailed realistic narrative/preview text representing what the user sees",
  "question": "Clear question asking the user to decide or choose the safest option",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "correctAnswer": "Exact text of the correct option from options array",
  "explanation": "Clear, instructive reason why this answer is safe and why others are dangerous",
  "warningSigns": ["First warning sign", "Second warning sign", "Third warning sign"],
  "difficulty": "${validDifficulty}",
  "points": ${validDifficulty === 'HARD' ? 30 : validDifficulty === 'MEDIUM' ? 20 : 10}
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      const text = response.text?.trim() || '';
      // Clean possible markdown code fence
      const cleanJson = text.replace(/^```json/i, '').replace(/^```/i, '').replace(/```$/i, '').trim();
      const parsed = JSON.parse(cleanJson);

      const created = await Challenge.create({
        ...parsed,
        active: true,
        createdBy: req.user._id
      });

      res.status(201).json({
        success: true,
        message: 'AI challenge generated and added successfully!',
        challenge: created
      });
    } catch (error) {
      console.error('AI Generation Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate AI scenario: ' + (error.message || 'Unknown error')
      });
    }
  }
};
