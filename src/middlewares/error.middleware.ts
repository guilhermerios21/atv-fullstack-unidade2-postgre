import { Request, Response, NextFunction } from 'express';

const errorMiddleware = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err?.stack || err);
  res.status(err?.status || 500).json({
    message: err?.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {},
  });
};

export default errorMiddleware;
