import express, { Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';
import { sendError } from './utils/response';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Health Check & Root welcome route
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Task Management API is running!',
    health: '/api/health',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Backend server is running!',
    timestamp: new Date().toISOString(),
  });
});

// 404 Handler
app.use((req: Request, res: Response) => {
  sendError(res, 404, `Route ${req.originalUrl} not found`);
});

// Global 500 Error Handler
app.use((err: any, _req: Request, res: Response, _next: express.NextFunction) => {
  console.error('Unhandled Server Error:', err);
  sendError(res, 500, err.message || 'An unexpected internal server error occurred');
});

export default app;
