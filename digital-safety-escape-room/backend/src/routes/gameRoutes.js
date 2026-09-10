import express from 'express';
import { gameController } from '../controllers/gameController.js';
import { protect } from '../middleware/authMiddleware.js';
import { cadetOnly } from '../middleware/cadetMiddleware.js';

const router = express.Router();

router.use(protect, cadetOnly);
router.post('/start', gameController.start);
router.get('/active', gameController.getActiveSession);
router.get('/:id', gameController.getSession);
router.post('/:id/answer', gameController.submitAnswer);
router.post('/:id/submit', gameController.submitAnswer);
router.post('/:id/next', gameController.nextChallenge);
router.post('/:id/restart', gameController.restart);

export default router;
