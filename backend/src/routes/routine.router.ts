import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/db';
import { requireAuth } from '../middleware/auth';
import { validateRequest } from '../middleware/validate';

export const routineRouter = Router();

// Zod Validation Schemas
const createRoutineSchema = z.object({
  body: z.object({
    title: z.string().min(2, 'Routine title is required'),
    description: z.string().optional(),
    frequency: z.string().default('Daily'),
    time: z.string().optional(),
    category: z.string().optional(),
  }),
});

const logRoutineSchema = z.object({
  body: z.object({
    status: z.enum(['COMPLETED', 'SKIPPED', 'NOT_APPLICABLE']).default('COMPLETED'),
    rating: z.number().min(1).max(5).optional(),
    notes: z.string().optional(),
  }),
});

const DEFAULT_INITIAL_ROUTINES = [
  {
    title: 'Sulfate-Free Scalp Wash & Condition',
    description: 'Deep cleansing with lukewarm water followed by moisture locking conditioner.',
    frequency: '2-3 times/week',
    time: '08:30 AM',
    category: 'Wash Routine',
    isAI: true,
  },
  {
    title: '5-Minute Stimulating Scalp Massage',
    description: 'Use fingertips in circular motion with 2 drops of jojoba or rosemary oil to boost micro-circulation.',
    frequency: 'Daily',
    time: '09:00 PM',
    category: 'Scalp Care',
    isAI: true,
  },
  {
    title: 'Biotin & Omega-3 Snack Intake',
    description: 'Consume a handful of walnuts, pumpkin seeds, and green tea for hair follicle nourishment.',
    frequency: 'Daily',
    time: '04:30 PM',
    category: 'Supplements',
    isAI: true,
  },
  {
    title: 'Hydration Target (2.5 Liters)',
    description: 'Ensure 8 full glasses of water throughout the day to keep scalp sebum balance optimal.',
    frequency: 'Daily',
    time: '02:00 PM',
    category: 'Meals',
    isAI: false,
  },
];

// 1. GET /api/v1/routines — List User Routines from PostgreSQL DB
routineRouter.get('/routines', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;

    // Fetch user routines from PostgreSQL database
    let routines = await prisma.routine.findMany({
      where: { userId },
      include: {
        logs: {
          orderBy: { completedAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Check if user has an entry in UserPreference / routine tracker
    const hasInitialized = await prisma.notificationPreference.findUnique({
      where: { userId },
    });

    // Seed initial routines only if brand new user and never initialized
    if (!routines.length && !hasInitialized) {
      for (const def of DEFAULT_INITIAL_ROUTINES) {
        await prisma.routine.create({
          data: {
            userId,
            title: def.title,
            description: def.description,
            frequency: def.frequency,
            time: def.time,
            category: def.category,
            isAI: def.isAI,
          },
        });
      }

      await prisma.notificationPreference.create({
        data: {
          userId,
          remindersEnabled: true,
          reminderTime: '09:00',
        },
      }).catch(() => {});

      routines = await prisma.routine.findMany({
        where: { userId },
        include: {
          logs: {
            orderBy: { completedAt: 'desc' },
            take: 1,
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    res.json({
      success: true,
      routines,
    });
  } catch (error) {
    next(error);
  }
});

// 2. POST /api/v1/routines — Create Routine in Database
routineRouter.post(
  '/routines',
  requireAuth,
  validateRequest(createRoutineSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const { title, description, frequency, time, category } = req.body;

      const createdRoutine = await prisma.routine.create({
        data: {
          userId,
          title,
          description: description || '',
          frequency: frequency || 'Daily',
          time: time || '09:00 AM',
          category: category || 'Scalp Care',
          isAI: false,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Routine created successfully',
        routine: createdRoutine,
      });
    } catch (error) {
      next(error);
    }
  }
);

// 3. PATCH /api/v1/routines/:id — Update Routine in Database
routineRouter.patch('/routines/:id', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const updateData = req.body;

    const updatedRoutine = await prisma.routine.updateMany({
      where: { id, userId },
      data: updateData,
    });

    res.json({
      success: true,
      message: 'Routine updated',
      updatedRoutine,
    });
  } catch (error) {
    next(error);
  }
});

// 4. DELETE /api/v1/routines/:id — Delete Routine from Database
routineRouter.delete('/routines/:id', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    await prisma.routine.deleteMany({
      where: { id, userId },
    });

    res.json({
      success: true,
      message: 'Routine deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

// 5. POST /api/v1/routines/:id/logs — Record Activity Log in Database
routineRouter.post(
  '/routines/:id/logs',
  requireAuth,
  validateRequest(logRoutineSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: routineId } = req.params;
      const userId = req.user!.id;
      const { status, rating, notes } = req.body;

      const createdLog = await prisma.routineLog.create({
        data: {
          userId,
          routineId,
          status: status || 'COMPLETED',
          rating: rating || null,
          notes: notes || null,
        },
      });

      res.status(201).json({
        success: true,
        message: `Activity marked as ${status}`,
        log: createdLog,
      });
    } catch (error) {
      next(error);
    }
  }
);

// 6. GET /api/v1/routines/:id/logs — Get Weekly Log History
routineRouter.get('/routines/:id/logs', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: routineId } = req.params;
    const userId = req.user!.id;

    const logs = await prisma.routineLog.findMany({
      where: { routineId, userId },
      orderBy: { completedAt: 'desc' },
      take: 30,
    });

    res.json({
      success: true,
      logs,
    });
  } catch (error) {
    next(error);
  }
});

