import express from 'express';
import { resultController } from '../controllers/resultController.js';
import { userController } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { cadetOnly } from '../middleware/cadetMiddleware.js';

const router = express.Router();

router.use(protect, cadetOnly);
router.get('/history', userController.getHistory);
router.get('/statistics', userController.getStatistics);
router.get('/:gameId', resultController.getGameResult);

export default router;
