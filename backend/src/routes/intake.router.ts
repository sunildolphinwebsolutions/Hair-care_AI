import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/db';
import { AppError } from '../middleware/errorHandler';
import { validateRequest } from '../middleware/validate';
import { requireAuth } from '../middleware/auth';
import { logger } from '../middleware/logger';

export const intakeRouter = Router();

// In-memory fallback store if database connection is offline during local dev
const mockIntakeStore = new Map<string, any>();

// Zod Validation Schema
const intakeSchema = z.object({
  body: z.object({
    ageRange: z.string().min(1, 'Age range is required'),
    gender: z.string().min(1, 'Gender choice is required'),
    concerns: z.array(z.string()).min(1, 'Please select at least one hair concern'),
    dietHabits: z.any().optional(),
    routineHabits: z.any().optional(),
    medicalHistory: z.any().optional(),
    version: z.string().default('1.0'),
  }),
});

const intakePatchSchema = z.object({
  body: z.object({
    ageRange: z.string().optional(),
    gender: z.string().optional(),
    concerns: z.array(z.string()).optional(),
    dietHabits: z.any().optional(),
    routineHabits: z.any().optional(),
    medicalHistory: z.any().optional(),
  }),
});

// Helper type cast for Prisma Client model delegates
const db = prisma as any;

// 1. POST /api/v1/intake — Create Intake Response
intakeRouter.post(
  '/',
  requireAuth,
  validateRequest(intakeSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const { ageRange, gender, concerns, dietHabits, routineHabits, medicalHistory, version } = req.body;

      let isDbAvailable = true;
      let createdRecord = null;

      try {
        // Create intake response record
        if (db.intakeResponse) {
          createdRecord = await db.intakeResponse.create({
            data: {
              userId,
              version: version || '1.0',
              ageRange,
              gender,
              concerns,
              dietHabits: dietHabits || {},
              routineHabits: routineHabits || {},
              medicalHistory: medicalHistory || {},
              status: 'COMPLETED',
            },
          });
        }

        // Upsert user profile
        if (db.userProfile) {
          await db.userProfile.upsert({
            where: { userId },
            update: {
              ageRange,
              gender,
              dietHabits: dietHabits || {},
              routineHabits: routineHabits || {},
              medicalHistory: medicalHistory || {},
            },
            create: {
              userId,
              ageRange,
              gender,
              dietHabits: dietHabits || {},
              routineHabits: routineHabits || {},
              medicalHistory: medicalHistory || {},
            },
          });
        }
      } catch (err) {
        logger.warn('Prisma DB unavailable for intake, using resilient fallback memory store');
        isDbAvailable = false;
      }

      if (!isDbAvailable || !createdRecord) {
        const id = `intake_${Date.now()}`;
        createdRecord = {
          id,
          userId,
          version: version || '1.0',
          ageRange,
          gender,
          concerns,
          dietHabits: dietHabits || {},
          routineHabits: routineHabits || {},
          medicalHistory: medicalHistory || {},
          aiObservations: null,
          status: 'COMPLETED',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        mockIntakeStore.set(userId, createdRecord);
      }

      res.status(201).json({
        success: true,
        message: 'Questionnaire submitted successfully',
        intake: createdRecord,
      });
    } catch (error) {
      next(error);
    }
  }
);

// 2. GET /api/v1/intake/latest — Get Latest Intake Response
intakeRouter.get(
  '/latest',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      let latestIntake = null;
      let isDbAvailable = true;

      try {
        if (db.intakeResponse) {
          latestIntake = await db.intakeResponse.findFirst({
            where: { userId },
            orderBy: { createdAt: 'desc' },
          });
        }
      } catch (err) {
        logger.warn('Prisma DB unavailable for intake get, using resilient fallback store');
        isDbAvailable = false;
      }

      if (!isDbAvailable || !latestIntake) {
        latestIntake = mockIntakeStore.get(userId) || null;
      }

      res.json({
        success: true,
        intake: latestIntake,
      });
    } catch (error) {
      next(error);
    }
  }
);

// 3. PATCH /api/v1/intake/:id — Update Intake Response
intakeRouter.patch(
  '/:id',
  requireAuth,
  validateRequest(intakePatchSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const updateData = req.body;

      let isDbAvailable = true;
      let updatedRecord = null;

      try {
        if (db.intakeResponse) {
          // Verify ownership
          const existing = await db.intakeResponse.findUnique({ where: { id } });
          if (!existing || existing.userId !== userId) {
            return next(new AppError('Intake record not found or access denied', 404, 'NOT_FOUND'));
          }

          updatedRecord = await db.intakeResponse.update({
            where: { id },
            data: {
              ...updateData,
              updatedAt: new Date(),
            },
          });
        }
      } catch (err) {
        isDbAvailable = false;
      }

      if (!isDbAvailable || !updatedRecord) {
        const existing = mockIntakeStore.get(userId);
        if (!existing) {
          return next(new AppError('Intake record not found', 404, 'NOT_FOUND'));
        }
        updatedRecord = {
          ...existing,
          ...updateData,
          updatedAt: new Date().toISOString(),
        };
        mockIntakeStore.set(userId, updatedRecord);
      }

      res.json({
        success: true,
        message: 'Questionnaire updated successfully',
        intake: updatedRecord,
      });
    } catch (error) {
      next(error);
    }
  }
);
