import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { sendError } from '../utils/response';

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(
        res,
        401,
        'Authentication required. Please provide a valid Bearer token.'
      );
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return sendError(res, 401, 'Authentication token is missing.');
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return sendError(
      res,
      401,
      'Invalid or expired authentication token. Please log in again.'
    );
  }
};
