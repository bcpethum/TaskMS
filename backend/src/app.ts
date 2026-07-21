import express, { Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import { sendError } from './utils/response';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Health Check Endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Backend server is running smoothly!',
    timestamp: new Date().toISOString(),
  });
});

// 404 Route Handler
app.use((req: Request, res: Response) => {
  sendError(res, 404, `Route ${req.originalUrl} not found`);
});

export default app;
