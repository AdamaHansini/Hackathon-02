import express from 'express';
import { resultController } from '../controllers/resultController.js';
import { userController } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/history', protect, userController.getHistory);
router.get('/statistics', protect, userController.getStatistics);
router.get('/:gameId', protect, resultController.getGameResult);

export default router;
