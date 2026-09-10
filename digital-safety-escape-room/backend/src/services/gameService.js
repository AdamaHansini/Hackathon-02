import { GameSession } from '../models/GameSession.js';
import { Challenge } from '../models/Challenge.js';
import { Answer } from '../models/Answer.js';
import { User } from '../models/User.js';
import { scoringService } from './scoringService.js';
import { badgeService } from './badgeService.js';
import { achievementService } from './achievementService.js';

export const gameService = {
  /**
   * Start a new game session with randomized challenges across all 4 categories
   */
  async startGame(userId, challengeCount = 4) {
    const activeSession = await GameSession.findOne({ userId, status: 'IN_PROGRESS' });
    if (activeSession) {
      const error = new Error('You already have an escape room in progress. Resume it before starting a new game.');
      error.statusCode = 409;
      throw error;
    }

    // Get all active challenges
    const allChallenges = await Challenge.find({ active: true });
    if (allChallenges.length === 0) {
      throw new Error('No active challenges found in database.');
    }

    const categories = ['PHISHING', 'PASSWORD', 'FAKE_QR', 'SCAM_MESSAGE'];
    const selected = [];

    // Select exactly one challenge per room, in the fixed escape-room order.
    for (const cat of categories) {
      const catChallenges = allChallenges.filter(c => c.category === cat);
      if (catChallenges.length === 0) {
        throw new Error(`No active challenges available for the ${cat} room.`);
      }
      selected.push(catChallenges[Math.floor(Math.random() * catChallenges.length)]);
    }

    const finalChallenges = selected;
    const challengeIds = finalChallenges.map(c => c._id);

    // Create session
    const session = await GameSession.create({
      userId,
      challengeIds,
      currentChallengeIndex: 0,
      score: 0,
      lives: 3,
      correctAnswers: 0,
      wrongAnswers: 0,
      status: 'IN_PROGRESS',
      percentage: 0,
      badge: '',
      categoryBreakdown: {
        PHISHING: { total: 0, correct: 0 },
        PASSWORD: { total: 0, correct: 0 },
        FAKE_QR: { total: 0, correct: 0 },
        SCAM_MESSAGE: { total: 0, correct: 0 }
      },
      startedAt: new Date().toISOString(),
      completedAt: null
    });

    // Populate counts in categoryBreakdown
    for (const ch of finalChallenges) {
      if (session.categoryBreakdown[ch.category]) {
        session.categoryBreakdown[ch.category].total += 1;
      }
    }
    await GameSession.findByIdAndUpdate(session._id, { categoryBreakdown: session.categoryBreakdown });

    // Update user gamesPlayed
    const user = await User.findById(userId);
    if (user) {
      await User.findByIdAndUpdate(userId, {
        gamesPlayed: (user.gamesPlayed || 0) + 1
      });
    }

    // Safe challenge representation (omit correctAnswer)
    const firstChallenge = sanitizeChallenge(finalChallenges[0]);

    return {
      session: {
        _id: session._id,
        currentChallengeIndex: session.currentChallengeIndex,
        totalChallenges: challengeIds.length,
        score: session.score,
        lives: session.lives,
        status: session.status,
        categoryStages: getCategoryStages(finalChallenges, 0)
      },
      challenge: firstChallenge,
      currentChallenge: firstChallenge
    };
  },

  /**
   * Process answer submission
   */
  async submitAnswer(userId, sessionId, challengeId, selectedAnswer) {
    const session = await GameSession.findById(sessionId);
    if (!session) {
      throw new Error('Game session not found.');
    }
    if (session.userId !== userId) {
      throw new Error('Unauthorized access to game session.');
    }
    if (session.status !== 'IN_PROGRESS') {
      throw new Error(`Game session is already ${session.status.toLowerCase()}.`);
    }

    const currentChallengeId = String(session.challengeIds[session.currentChallengeIndex]);
    if (String(challengeId) !== currentChallengeId) {
      const error = new Error('That challenge is not the current challenge in this escape room.');
      error.statusCode = 409;
      throw error;
    }

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      throw new Error('Challenge not found.');
    }

    // Check if already answered for this challenge in this session
    const existingAnswer = await Answer.findOne({ gameId: sessionId, challengeId });
    if (existingAnswer) {
      throw new Error('Answer already submitted for this challenge.');
    }

    const isCorrect = String(selectedAnswer).trim().toLowerCase() === String(challenge.correctAnswer).trim().toLowerCase();
    const pointsAwarded = isCorrect ? scoringService.getPoints(challenge.difficulty || 'EASY') : 0;
    const newScore = session.score + pointsAwarded;
    const newLives = isCorrect ? session.lives : Math.max(0, session.lives - 1);
    const newCorrect = session.correctAnswers + (isCorrect ? 1 : 0);
    const newWrong = session.wrongAnswers + (isCorrect ? 0 : 1);

    // Update category breakdown
    const categoryBreakdown = session.categoryBreakdown || {};
    if (categoryBreakdown[challenge.category]) {
      if (isCorrect) categoryBreakdown[challenge.category].correct += 1;
    }

    // Record answer
    const answerRecord = await Answer.create({
      userId,
      gameId: sessionId,
      challengeId,
      selectedAnswer,
      correctAnswer: challenge.correctAnswer,
      isCorrect,
      pointsEarned: pointsAwarded,
      lifeLost: !isCorrect,
      answeredAt: new Date().toISOString()
    });

    let newStatus = 'IN_PROGRESS';
    let isGameOver = false;
    let isCompleted = false;

    if (newLives <= 0) {
      newStatus = 'GAME_OVER';
      isGameOver = true;
    } else if (session.currentChallengeIndex + 1 >= session.challengeIds.length) {
      newStatus = 'COMPLETED';
      isCompleted = true;
    }

    // Max theoretical score
    const maxScore = session.challengeIds.length * 20; // 20 avg
    const finalPercentage = scoringService.calculateSessionPercentage(newScore, session.challengeIds.length, maxScore);
    const badgeInfo = badgeService.resolveBadge(finalPercentage);

    const updatedSession = await GameSession.findByIdAndUpdate(sessionId, {
      score: newScore,
      lives: newLives,
      correctAnswers: newCorrect,
      wrongAnswers: newWrong,
      status: newStatus,
      percentage: finalPercentage,
      badge: isCompleted ? badgeInfo.title : session.badge,
      categoryBreakdown,
      completedAt: isGameOver || isCompleted ? new Date().toISOString() : null
    });

    let newAchievements = [];
    if (isCompleted || isGameOver) {
      // Update User aggregate statistics
      await updateUserStats(userId, updatedSession);
      // Check achievements
      newAchievements = await achievementService.checkAndAward(userId, updatedSession);
    }

    return {
      isCorrect,
      pointsEarned: pointsAwarded,
      lifeLost: !isCorrect,
      livesRemaining: newLives,
      currentScore: newScore,
      explanation: challenge.explanation,
      warningSigns: challenge.warningSigns || [],
      selectedAnswer,
      correctAnswer: challenge.correctAnswer,
      status: newStatus,
      isGameOver,
      isCompleted,
      badge: isCompleted ? badgeInfo : null,
      newAchievements
    };
  },

  /**
   * Advance to next challenge
   */
  async nextChallenge(userId, sessionId) {
    const session = await GameSession.findById(sessionId);
    if (!session) throw new Error('Game session not found.');
    if (session.userId !== userId) throw new Error('Unauthorized.');

    if (session.status !== 'IN_PROGRESS') {
      return { status: session.status, isFinished: true };
    }

    const currentChallengeId = session.challengeIds[session.currentChallengeIndex];
    const currentAnswer = await Answer.findOne({ gameId: sessionId, challengeId: currentChallengeId });
    if (!currentAnswer) {
      const error = new Error('Answer the current challenge before moving to the next room.');
      error.statusCode = 409;
      throw error;
    }

    const nextIndex = session.currentChallengeIndex + 1;
    if (nextIndex >= session.challengeIds.length) {
      // Finished all challenges
      return { status: 'COMPLETED', isFinished: true };
    }

    await GameSession.findByIdAndUpdate(sessionId, {
      currentChallengeIndex: nextIndex
    });

    const nextChallengeId = session.challengeIds[nextIndex];
    const challengeDoc = await Challenge.findById(nextChallengeId);

    const allSessionChallenges = [];
    for (const id of session.challengeIds) {
      const c = await Challenge.findById(id);
      if (c) allSessionChallenges.push(c);
    }

    const sanitizedNext = sanitizeChallenge(challengeDoc);
    return {
      session: {
        _id: session._id,
        currentChallengeIndex: nextIndex,
        totalChallenges: session.challengeIds.length,
        score: session.score,
        lives: session.lives,
        status: session.status,
        categoryStages: getCategoryStages(allSessionChallenges, nextIndex)
      },
      challenge: sanitizedNext,
      currentChallenge: sanitizedNext
    };
  },

  /**
   * Get session details with current active challenge
   */
  async getSessionState(userId, sessionId) {
    const session = await GameSession.findById(sessionId);
    if (!session) throw new Error('Game session not found.');
    if (session.userId !== userId) throw new Error('Unauthorized.');

    const allSessionChallenges = [];
    for (const id of session.challengeIds) {
      const c = await Challenge.findById(id);
      if (c) allSessionChallenges.push(c);
    }

    const currentChallengeDoc = allSessionChallenges[session.currentChallengeIndex];
    const previousAnswer = currentChallengeDoc
      ? await Answer.findOne({ gameId: sessionId, challengeId: currentChallengeDoc._id })
      : null;

    return {
      session: {
        _id: session._id,
        currentChallengeIndex: session.currentChallengeIndex,
        totalChallenges: session.challengeIds.length,
        score: session.score,
        lives: session.lives,
        status: session.status,
        correctAnswers: session.correctAnswers,
        wrongAnswers: session.wrongAnswers,
        percentage: session.percentage,
        badge: session.badge,
        categoryStages: getCategoryStages(allSessionChallenges, session.currentChallengeIndex)
      },
      currentChallenge: currentChallengeDoc ? sanitizeChallenge(currentChallengeDoc) : null,
      previousAnswer: previousAnswer ? {
        selectedAnswer: previousAnswer.selectedAnswer,
        isCorrect: previousAnswer.isCorrect,
        correctAnswer: previousAnswer.correctAnswer,
        explanation: currentChallengeDoc?.explanation,
        warningSigns: currentChallengeDoc?.warningSigns
      } : null
    };
  }
};

/**
 * Remove internal answer keys before passing to client
 */
function sanitizeChallenge(challenge) {
  if (!challenge) return null;
  const { correctAnswer, ...safeObj } = challenge;
  // Randomize answer option display order slightly if options exist
  const options = challenge.options ? [...challenge.options] : [];
  return {
    ...safeObj,
    options
  };
}

/**
 * Returns visual stages for escape room progress
 */
function getCategoryStages(challenges, currentIndex) {
  const categories = ['PHISHING', 'PASSWORD', 'FAKE_QR', 'SCAM_MESSAGE'];
  return categories.map(cat => {
    // Find challenges of this category
    const catIndices = challenges
      .map((c, idx) => (c.category === cat ? idx : -1))
      .filter(idx => idx !== -1);
    
    // If all past or equal to currentIndex
    const isCompleted = catIndices.length > 0 && catIndices.every(idx => idx < currentIndex);
    const isCurrent = catIndices.includes(currentIndex);
    return {
      category: cat,
      label: cat.replace('_', ' '),
      status: isCompleted ? 'UNLOCKED' : isCurrent ? 'IN_PROGRESS' : 'LOCKED',
      icon: isCompleted ? 'Unlock' : isCurrent ? 'Key' : 'Lock'
    };
  });
}

/**
 * Update aggregate user metrics
 */
async function updateUserStats(userId, session) {
  const user = await User.findById(userId);
  if (!user) return;

  const allUserSessions = await GameSession.find({ userId });
  const completedSessions = allUserSessions.filter(s => s.status === 'COMPLETED');
  
  const gamesPlayed = allUserSessions.length;
  const gamesCompleted = completedSessions.length;

  const scores = allUserSessions.map(s => s.score || 0);
  const bestScore = scores.length > 0 ? Math.max(...scores) : 0;
  const averageScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  const totalCorrect = allUserSessions.reduce((acc, s) => acc + (s.correctAnswers || 0), 0);
  const totalWrong = allUserSessions.reduce((acc, s) => acc + (s.wrongAnswers || 0), 0);
  const totalAnswers = totalCorrect + totalWrong;
  const accuracy = totalAnswers > 0 ? Math.round((totalCorrect / totalAnswers) * 100) : 0;

  const userBadges = new Set(user.badges || []);
  if (session.badge) {
    userBadges.add(session.badge);
  }

  await User.findByIdAndUpdate(userId, {
    gamesPlayed,
    gamesCompleted,
    bestScore,
    averageScore,
    accuracy,
    badges: Array.from(userBadges)
  });
}
