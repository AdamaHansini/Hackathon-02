import express from 'express';
import { userController } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile', protect, userController.getProfile);
router.put('/profile', protect, userController.updateProfile);
router.get('/history', protect, userController.getHistory);
router.get('/statistics', protect, userController.getStatistics);

export default router;
