/**
 * ErrorMiddleware — Express error handler template.
 *
 * Place after all routes. Never leak stack traces in production responses.
 */

import type { Request, Response, NextFunction } from 'express';
import { logger } from './ProductionLogger';

export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 500,
    public readonly code?: string,
    public readonly isOperational: boolean = true,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const requestId = (req.headers['x-request-id'] as string) ?? undefined;

  if (err instanceof AppError) {
    logger.warn('operational_error', {
      requestId,
      module: 'error_middleware',
      statusCode: err.statusCode,
      code: err.code,
      path: req.path,
    });

    res.status(err.statusCode).json({
      error: {
        message: err.message,
        code: err.code,
      },
      requestId,
    });
    return;
  }

  logger.error('unhandled_error', { requestId, module: 'error_middleware', path: req.path }, err);

  res.status(500).json({
    error: {
      message:
        process.env.NODE_ENV === 'production'
          ? 'Internal server error'
          : err.message,
    },
    requestId,
  });
}