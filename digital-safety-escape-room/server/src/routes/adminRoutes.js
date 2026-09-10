import express from 'express';
import { adminController } from '../controllers/adminController.js';
import { challengeController } from '../controllers/challengeController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Role-based protection: ALL routes in this router require valid JWT and admin role
router.use(protect, adminOnly);

// Telemetry & Statistics
router.get('/statistics', adminController.getStatistics);
router.get('/analytics', adminController.getStatistics);

// User Cadets Management
router.get('/users', adminController.getUsers);
router.get('/users/:id/performance', adminController.getUserPerformance);
router.put('/users/:id/role', adminController.updateUserRole);
router.post('/users/:id/reset', adminController.resetUserStats);
router.delete('/users/:id', adminController.deleteUser);

// Challenge Management (CRUD + activation toggle)
router.get('/challenges', challengeController.getAll);
router.post('/challenges', challengeController.create);
router.put('/challenges/:id', challengeController.update);
router.patch('/challenges/:id/toggle', challengeController.toggleActive);
router.delete('/challenges/:id', challengeController.delete);

// AI Scenario Generator
router.post('/generate-challenge', adminController.generateAiChallenge);

export default router;
