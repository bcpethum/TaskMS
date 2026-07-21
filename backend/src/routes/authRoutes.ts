import { Router } from 'express';
import { login, getMe } from '../controllers/authController';
import { validateRequest } from '../middlewares/validateRequest';
import { loginSchema } from '../validation/authValidation';
import { authenticateUser } from '../middlewares/authMiddleware';

const router = Router();

// Public route: Login
router.post('/login', validateRequest(loginSchema), login);

// Protected route: Get Current User Profile
router.get('/me', authenticateUser, getMe);

export default router;
