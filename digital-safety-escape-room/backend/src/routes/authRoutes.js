import express from 'express';
import { authController } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateRegister, validateLogin } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.get('/me', protect, authController.getMe);
router.post('/logout', authController.logout);

export default router;
