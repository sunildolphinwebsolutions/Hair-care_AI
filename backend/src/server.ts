import { app } from './app';
import { env } from './config/env';
import { logger } from './middleware/logger';
import { prisma } from './lib/db';

const server = app.listen(env.PORT, () => {
  logger.info(`🚀 HairCare AI Backend running on http://localhost:${env.PORT}`);
  logger.info(`🏥 Health check endpoint available at http://localhost:${env.PORT}/api/v1/health`);
});

const gracefulShutdown = async (signal: string) => {
  logger.info(`[${signal}] Shutting down server gracefully...`);
  server.close(async () => {
    logger.info('HTTP server closed.');
    await prisma.$disconnect();
    logger.info('Database connection closed.');
    process.exit(0);
  });

  setTimeout(() => {
    logger.error('Forced shutdown due to timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
