import express from 'express';
import { z } from 'zod';
import { authGuard } from '../middleware/authGuard.js';
import { validate } from '../middleware/validate.js';
import { 
  createTask, 
  getAllTasks, 
  updateTask, 
  deleteTask 
} from '../controllers/taskController.js';

const router = express.Router();

const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Task title is required').max(200),
    description: z.string().max(2000).optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    dueDate: z.string().min(1, 'Due date is required'),
    status: z.enum(['pending', 'completed']).optional(),
  }),
});

const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().max(2000).optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    dueDate: z.string().optional(),
    status: z.enum(['pending', 'completed']).optional(),
  }),
});

router.post('/tasks', authGuard, validate(createTaskSchema), createTask);
router.get('/tasks', authGuard, getAllTasks);
router.put('/tasks/:taskId', authGuard, validate(updateTaskSchema), updateTask);
router.delete('/tasks/:taskId', authGuard, deleteTask);

export default router;