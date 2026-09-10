import express from 'express';
import { gameController } from '../controllers/gameController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/start', protect, gameController.start);
router.get('/active', protect, gameController.getActiveSession);
router.get('/:id', protect, gameController.getSession);
router.post('/:id/answer', protect, gameController.submitAnswer);
router.post('/:id/submit', protect, gameController.submitAnswer);
router.post('/:id/next', protect, gameController.nextChallenge);
router.post('/:id/restart', protect, gameController.restart);

export default router;
