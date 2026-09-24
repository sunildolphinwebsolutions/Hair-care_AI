import { Router, Request, Response } from 'express';
import { checkDatabaseConnection } from '../lib/db';
import { env } from '../config/env';

export const healthRouter = Router();

healthRouter.get('/health', async (req: Request, res: Response) => {
  const isDbConnected = await checkDatabaseConnection();

  const healthData = {
    status: isDbConnected ? 'ok' : 'degraded',
    service: 'haircare-ai-backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    environment: env.NODE_ENV,
    checks: {
      database: isDbConnected ? 'healthy' : 'unreachable',
    },
  };

  const statusCode = isDbConnected ? 200 : 503;
  res.status(statusCode).json(healthData);
});
