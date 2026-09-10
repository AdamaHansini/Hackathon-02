import { Challenge } from '../models/Challenge.js';
import { validateChallenge } from '../utils/categoryValidator.js';

export const challengeController = {
  async getAll(req, res, next) {
    try {
      const isAdmin = req.user && req.user.role === 'admin';
      const query = isAdmin ? {} : { active: true };
      const list = await Challenge.find(query);

      // Sanitize if not admin
      const sanitized = list.map(c => {
        if (isAdmin) return c;
        const { correctAnswer, ...safe } = c;
        return safe;
      });

      res.json({
        success: true,
        count: sanitized.length,
        challenges: sanitized
      });
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const challenge = await Challenge.findById(req.params.id);
      if (!challenge) {
        return res.status(404).json({ success: false, message: 'Challenge not found.' });
      }

      const isAdmin = req.user && req.user.role === 'admin';
      if (!isAdmin) {
        const { correctAnswer, ...safe } = challenge;
        return res.json({ success: true, challenge: safe });
      }

      res.json({ success: true, challenge });
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const {
        title,
        category,
        scenario,
        question,
        options,
        correctAnswer,
        explanation,
        warningSigns,
        difficulty,
        points,
        active,
        metadata
      } = req.body;

      if (!title || !category || !scenario || !question || !options || !correctAnswer || !explanation) {
        return res.status(400).json({
          success: false,
          message: 'All core challenge fields (title, category, scenario, question, options, correctAnswer, explanation) are required.'
        });
      }

      const challengeData = {
        title,
        category,
        scenario,
        question,
        options: Array.isArray(options) ? options : [options],
        correctAnswer,
        explanation,
        warningSigns: Array.isArray(warningSigns) ? warningSigns : (warningSigns ? [warningSigns] : []),
        difficulty: difficulty || 'EASY',
        points: Number(points) || (difficulty === 'HARD' ? 30 : difficulty === 'MEDIUM' ? 20 : 10),
        active: active !== undefined ? Boolean(active) : true
      };
      const validation = validateChallenge(challengeData);
      if (!validation.valid) {
        return res.status(422).json({ success: false, message: 'Challenge validation failed.', errors: validation.errors, warnings: validation.warnings });
      }

      const newChallenge = await Challenge.create({
        ...challengeData,
        metadata: metadata || {},
        createdBy: req.user._id
      });

      res.status(201).json({
        success: true,
        message: 'Challenge created successfully.',
        challenge: newChallenge
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const existing = await Challenge.findById(req.params.id);
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Challenge not found.' });
      }

      const updateData = { ...req.body };
      if (updateData.difficulty && !updateData.points) {
        updateData.points = updateData.difficulty === 'HARD' ? 30 : updateData.difficulty === 'MEDIUM' ? 20 : 10;
      }

      const candidate = {
        ...existing,
        ...updateData,
        options: Array.isArray(updateData.options) ? updateData.options : existing.options,
        warningSigns: Array.isArray(updateData.warningSigns) ? updateData.warningSigns : existing.warningSigns
      };
      const validation = validateChallenge(candidate);
      if (!validation.valid) {
        return res.status(422).json({ success: false, message: 'Challenge validation failed.', errors: validation.errors, warnings: validation.warnings });
      }

      const updated = await Challenge.findByIdAndUpdate(req.params.id, updateData);

      res.json({
        success: true,
        message: 'Challenge updated successfully.',
        challenge: updated
      });
    } catch (error) {
      next(error);
    }
  },

  async toggleActive(req, res, next) {
    try {
      const existing = await Challenge.findById(req.params.id);
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Challenge not found.' });
      }

      const nextStatus = existing.active === false ? true : false;
      if (nextStatus) {
        const validation = validateChallenge({ ...existing, active: true });
        if (!validation.valid) {
          return res.status(422).json({ success: false, message: 'Challenge cannot be activated until validation passes.', errors: validation.errors, warnings: validation.warnings });
        }
      }
      const updated = await Challenge.findByIdAndUpdate(req.params.id, {
        active: nextStatus
      });

      res.json({
        success: true,
        message: `Challenge ${nextStatus ? 'activated' : 'deactivated'} successfully.`,
        active: nextStatus,
        challenge: updated
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      const deleted = await Challenge.findByIdAndDelete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Challenge not found.' });
      }

      res.json({
        success: true,
        message: 'Challenge deleted successfully.'
      });
    } catch (error) {
      next(error);
    }
  }
};
