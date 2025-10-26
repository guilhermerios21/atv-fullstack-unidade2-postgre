import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';

export const authMiddleware = (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.toString().split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Unauthorized' });
    req.user = decoded;
    next();
  });
};

export default authMiddleware;
