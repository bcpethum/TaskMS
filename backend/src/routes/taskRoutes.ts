import { Router } from 'express';
import {
  getStats,
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/taskController';
import { authenticateUser } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validateRequest';
import { createTaskSchema, updateTaskSchema } from '../validation/taskValidation';

const router = Router();

// All task routes require authentication
router.use(authenticateUser);

// Dashboard stats
router.get('/stats', getStats);

// Task CRUD
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.post('/', validateRequest(createTaskSchema), createTask);
router.put('/:id', validateRequest(updateTaskSchema), updateTask);
router.delete('/:id', deleteTask);

export default router;
