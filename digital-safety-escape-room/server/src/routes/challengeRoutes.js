import express from 'express';
import { challengeController } from '../controllers/challengeController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get('/', challengeController.getAll);
router.get('/:id', challengeController.getById);

// Admin-only challenge endpoints
router.post('/', protect, adminOnly, challengeController.create);
router.put('/:id', protect, adminOnly, challengeController.update);
router.patch('/:id/toggle', protect, adminOnly, challengeController.toggleActive);
router.delete('/:id', protect, adminOnly, challengeController.delete);

export default router;
