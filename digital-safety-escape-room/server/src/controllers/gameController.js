import { gameService } from '../services/gameService.js';
import { GameSession } from '../models/GameSession.js';

export const gameController = {
  async start(req, res, next) {
    try {
      const challengeCount = req.body.challengeCount || 4;
      const result = await gameService.startGame(req.user._id, challengeCount);

      res.status(201).json({
        success: true,
        message: 'Escape room game session initialized.',
        ...result
      });
    } catch (error) {
      next(error);
    }
  },

  async getSession(req, res, next) {
    try {
      const result = await gameService.getSessionState(req.user._id, req.params.id);
      res.json({
        success: true,
        ...result
      });
    } catch (error) {
      next(error);
    }
  },

  async submitAnswer(req, res, next) {
    try {
      const { challengeId, selectedAnswer } = req.body;

      if (!challengeId || selectedAnswer === undefined || selectedAnswer === null || String(selectedAnswer).trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Challenge ID and selected answer are required.'
        });
      }

      const result = await gameService.submitAnswer(
        req.user._id,
        req.params.id,
        challengeId,
        selectedAnswer
      );

      res.json({
        success: true,
        ...result
      });
    } catch (error) {
      next(error);
    }
  },

  async nextChallenge(req, res, next) {
    try {
      const result = await gameService.nextChallenge(req.user._id, req.params.id);
      res.json({
        success: true,
        ...result
      });
    } catch (error) {
      next(error);
    }
  },

  async restart(req, res, next) {
    try {
      const current = await GameSession.findById(req.params.id);
      if (!current) {
        return res.status(404).json({ success: false, message: 'Game session not found.' });
      }
      if (String(current.userId) !== String(req.user._id)) {
        return res.status(403).json({ success: false, message: 'You are not allowed to restart this game session.' });
      }

      // Mark the caller's current session as abandoned before creating a new one.
      if (current && current.status === 'IN_PROGRESS') {
        await GameSession.findByIdAndUpdate(req.params.id, { status: 'ABANDONED' });
      }

      // Start fresh session
      const result = await gameService.startGame(req.user._id, 4);

      res.status(201).json({
        success: true,
        message: 'Game restarted successfully.',
        ...result
      });
    } catch (error) {
      next(error);
    }
  },

  async getActiveSession(req, res, next) {
    try {
      // Check if user has an ongoing session
      const active = await GameSession.findOne({
        userId: req.user._id,
        status: 'IN_PROGRESS'
      });

      if (!active) {
        return res.json({ success: true, activeSession: null });
      }

      const state = await gameService.getSessionState(req.user._id, active._id);
      res.json({
        success: true,
        activeSession: state
      });
    } catch (error) {
      next(error);
    }
  }
};
