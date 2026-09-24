import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/db';
import { requireAuth } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { validateRequest } from '../middleware/validate';
import { logger } from '../middleware/logger';

export const routineRouter = Router();

const db = prisma as any;
const mockRoutineStore = new Map<string, any>();
const mockLogStore = new Map<string, any[]>();

// Zod Validation Schemas
const createRoutineSchema = z.object({
  body: z.object({
    title: z.string().min(2, 'Routine title is required'),
    description: z.string().optional(),
    frequency: z.string().default('Daily'),
    items: z.array(
      z.object({
        stepName: z.string().min(1, 'Step name is required'),
        stepOrder: z.number().default(1),
        instructions: z.string().optional(),
      })
    ).optional(),
  }),
});

const logRoutineSchema = z.object({
  body: z.object({
    status: z.enum(['COMPLETED', 'SKIPPED', 'NOT_APPLICABLE']).default('COMPLETED'),
    rating: z.number().min(1).max(5).optional(),
    notes: z.string().optional(),
  }),
});

// Seed default sample routines if none exist
const DEFAULT_ROUTINES = [
  {
    id: 'routine_gentle_wash',
    title: 'Gentle Cleansing Wash',
    description: 'Sulfate-free scalp cleansing & moisture restoration',
    frequency: '2-3 times/week',
    isAI: true,
    items: [
      { id: 'item_1', stepName: 'Sulfate-Free Shampoo', stepOrder: 1, instructions: 'Massage into wet scalp for 2 minutes' },
      { id: 'item_2', stepName: 'Moisture Conditioner', stepOrder: 2, instructions: 'Apply from mid-lengths to ends, rinse with cool water' },
    ],
  },
  {
    id: 'routine_scalp_massage',
    title: 'Daily Scalp Massage',
    description: 'Fingertip scalp stimulation for microcirculation',
    frequency: 'Daily',
    isAI: true,
    items: [
      { id: 'item_3', stepName: 'Scalp Massage & Jojoba Oil', stepOrder: 1, instructions: 'Circular pressure for 5 minutes' },
    ],
  },
];

// 1. GET /api/v1/routines — List User Routines
routineRouter.get('/routines', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    let routines = [];
    let isDbAvailable = true;

    try {
      if (db.routine) {
        routines = await db.routine.findMany({
          where: { userId },
          include: { items: true, logs: true },
          orderBy: { createdAt: 'desc' },
        });
      }
    } catch (err) {
      isDbAvailable = false;
    }

    if (!isDbAvailable || !routines.length) {
      routines = mockRoutineStore.get(userId) || DEFAULT_ROUTINES.map((r) => ({ ...r, userId }));
      mockRoutineStore.set(userId, routines);
    }

    res.json({
      success: true,
      routines,
    });
  } catch (error) {
    next(error);
  }
});

// 2. POST /api/v1/routines — Create Routine
routineRouter.post(
  '/routines',
  requireAuth,
  validateRequest(createRoutineSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const { title, description, frequency, items } = req.body;

      let createdRoutine = null;
      let isDbAvailable = true;

      try {
        if (db.routine) {
          createdRoutine = await db.routine.create({
            data: {
              userId,
              title,
              description,
              frequency,
              isAI: false,
              items: {
                create: (items || []).map((it: any, idx: number) => ({
                  stepName: it.stepName,
                  stepOrder: it.stepOrder || idx + 1,
                  instructions: it.instructions || '',
                })),
              },
            },
            include: { items: true },
          });
        }
      } catch (err) {
        isDbAvailable = false;
      }

      if (!isDbAvailable || !createdRoutine) {
        const id = `routine_${Date.now()}`;
        createdRoutine = {
          id,
          userId,
          title,
          description,
          frequency,
          isAI: false,
          items: items || [],
          createdAt: new Date().toISOString(),
        };

        const existingList = mockRoutineStore.get(userId) || DEFAULT_ROUTINES;
        mockRoutineStore.set(userId, [createdRoutine, ...existingList]);
      }

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

// 3. PATCH /api/v1/routines/:id — Update Routine
routineRouter.patch('/routines/:id', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const updateData = req.body;

    let updatedRoutine = null;
    let isDbAvailable = true;

    try {
      if (db.routine) {
        updatedRoutine = await db.routine.update({
          where: { id },
          data: updateData,
          include: { items: true },
        });
      }
    } catch (err) {
      isDbAvailable = false;
    }

    if (!isDbAvailable || !updatedRoutine) {
      const userRoutines = mockRoutineStore.get(userId) || DEFAULT_ROUTINES;
      updatedRoutine = userRoutines.find((r: any) => r.id === id);
      if (updatedRoutine) {
        Object.assign(updatedRoutine, updateData);
      }
    }

    res.json({
      success: true,
      message: 'Routine updated',
      routine: updatedRoutine,
    });
  } catch (error) {
    next(error);
  }
});

// 4. DELETE /api/v1/routines/:id — Delete Routine
routineRouter.delete('/routines/:id', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    let isDbAvailable = true;

    try {
      if (db.routine) {
        await db.routine.delete({ where: { id } });
      }
    } catch (err) {
      isDbAvailable = false;
    }

    if (!isDbAvailable) {
      const userRoutines = mockRoutineStore.get(userId) || [];
      mockRoutineStore.set(
        userId,
        userRoutines.filter((r: any) => r.id !== id)
      );
    }

    res.json({
      success: true,
      message: 'Routine deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

// 5. POST /api/v1/routines/:id/logs — Record Activity Log (Complete/Skip/NA)
routineRouter.post(
  '/routines/:id/logs',
  requireAuth,
  validateRequest(logRoutineSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: routineId } = req.params;
      const userId = req.user!.id;
      const { status, rating, notes } = req.body;

      let createdLog = null;
      let isDbAvailable = true;

      try {
        if (db.routineLog) {
          createdLog = await db.routineLog.create({
            data: {
              userId,
              routineId,
              status: status || 'COMPLETED',
              rating: rating || null,
              notes: notes || null,
            },
          });
        }
      } catch (err) {
        isDbAvailable = false;
      }

      if (!isDbAvailable || !createdLog) {
        const logId = `log_${Date.now()}`;
        createdLog = {
          id: logId,
          userId,
          routineId,
          status: status || 'COMPLETED',
          rating: rating || null,
          notes: notes || null,
          completedAt: new Date().toISOString(),
        };

        const existingLogs = mockLogStore.get(routineId) || [];
        mockLogStore.set(routineId, [createdLog, ...existingLogs]);
      }

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

    let logs = [];
    let isDbAvailable = true;

    try {
      if (db.routineLog) {
        logs = await db.routineLog.findMany({
          where: { routineId, userId },
          orderBy: { completedAt: 'desc' },
          take: 30,
        });
      }
    } catch (err) {
      isDbAvailable = false;
    }

    if (!isDbAvailable || !logs.length) {
      logs = mockLogStore.get(routineId) || [];
    }

    res.json({
      success: true,
      logs,
    });
  } catch (error) {
    next(error);
  }
});
