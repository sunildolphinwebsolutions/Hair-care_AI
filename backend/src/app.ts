import express from 'express';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { httpLogger } from './middleware/logger';
import { errorHandler, AppError } from './middleware/errorHandler';
import { authenticateToken } from './middleware/auth';
import { healthRouter } from './routes/health.router';
import { authRouter } from './routes/auth.router';
import { intakeRouter } from './routes/intake.router';
import { photoRouter } from './routes/photo.router';
import { analysisRouter } from './routes/analysis.router';
import { planRouter } from './routes/plan.router';
import { routineRouter } from './routes/routine.router';
import { notificationRouter } from './routes/notification.router';
import { progressRouter } from './routes/progress.router';
import { dashboardRouter } from './routes/dashboard.router';

export const app = express();

// Security & Parsing Middlewares
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(httpLogger);

// Global Authentication Token Extractor
app.use(authenticateToken);

// Serve static uploads (for image previews)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// API Routes (Versioned: /api/v1)
const apiV1Router = express.Router();
apiV1Router.use('/', healthRouter);
apiV1Router.use('/auth', authRouter);
apiV1Router.use('/intake', intakeRouter);
apiV1Router.use('/', photoRouter);
apiV1Router.use('/', analysisRouter);
apiV1Router.use('/', planRouter);
apiV1Router.use('/', routineRouter);
apiV1Router.use('/', notificationRouter);
apiV1Router.use('/', progressRouter);
apiV1Router.use('/', dashboardRouter);

app.use('/api/v1', apiV1Router);

// 404 Handler
app.use('*', (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404, 'NOT_FOUND'));
});

// Centralized Error Handler
app.use(errorHandler);
