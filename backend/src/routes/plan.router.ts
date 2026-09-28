import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/db';
import { requireAuth } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { generateWellnessPlanAI } from '../services/wellness-plan.service';
import { logger } from '../middleware/logger';

export const planRouter = Router();

const db = prisma as any;
const mockPlanStore = new Map<string, any>();

// Helper to gather user context from intake & visual assessment of uploaded photos
async function getUserAnalysisContext(userId: string) {
  const userContext: any = {};
  try {
    if (db.intakeResponse) {
      const intake = await db.intakeResponse.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
      if (intake) {
        userContext.concerns = intake.concerns;
        userContext.diet = intake.dietHabits?.dietType;
      }
    }

    if (db.visualAssessment) {
      const assessment = await db.visualAssessment.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
      if (assessment) {
        userContext.hairDensity = assessment.hairDensity;
        userContext.scalpHealth = assessment.scalpHealth;
        userContext.hairThickness = assessment.hairThickness;
        userContext.signsOfDamage = assessment.signsOfDamage;
        userContext.overallAssessment = assessment.overallAssessment;
        userContext.notableObservations = assessment.notableObservations;
      }
    }
  } catch (err) {}
  return userContext;
}

// 1. POST /api/v1/wellness-plans/generate — Generate Draft Plan
planRouter.post(
  '/wellness-plans/generate',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const userContext = await getUserAnalysisContext(userId);

      // Generate plan via Gemini AI based on photo visual analysis
      const generatedData = await generateWellnessPlanAI(userContext);

      let createdPlan = null;
      const planId = `plan_${Date.now()}`;

      try {
        if (db.wellnessPlan) {
          createdPlan = await db.wellnessPlan.create({
            data: {
              userId,
              version: '1.0',
              status: 'DRAFT',
              summary: generatedData.summary,
              nutrients: generatedData.nutrients,
              recommendedFoods: generatedData.recommendedFoods,
              routineSuggestions: generatedData.routineSuggestions,
              lifestyleHabits: generatedData.lifestyleHabits,
              userAccepted: false,
              disclaimer: generatedData.disclaimer,
            },
          });
        }
      } catch (err) {}

      if (!createdPlan) {
        createdPlan = {
          id: planId,
          userId,
          version: '1.0',
          status: 'DRAFT',
          summary: generatedData.summary,
          nutrients: generatedData.nutrients,
          recommendedFoods: generatedData.recommendedFoods,
          routineSuggestions: generatedData.routineSuggestions,
          lifestyleHabits: generatedData.lifestyleHabits,
          userAccepted: false,
          disclaimer: generatedData.disclaimer,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        mockPlanStore.set(planId, createdPlan);
        mockPlanStore.set(`user_${userId}`, createdPlan);
      }

      res.status(201).json({
        success: true,
        message: 'Personalized wellness plan generated based on photo analysis',
        plan: createdPlan,
      });
    } catch (error) {
      next(error);
    }
  }
);

// 2. GET /api/v1/wellness-plans/current — Get Current Active or Latest Plan
planRouter.get(
  '/wellness-plans/current',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      let plan = null;
      let isDbAvailable = true;

      try {
        if (db.wellnessPlan) {
          plan = await db.wellnessPlan.findFirst({
            where: { userId },
            orderBy: { createdAt: 'desc' },
          });
        }
      } catch (err) {
        isDbAvailable = false;
      }

      if (!isDbAvailable || !plan) {
        plan = mockPlanStore.get(`user_${userId}`) || null;
      }

      if (!plan) {
        const userContext = await getUserAnalysisContext(userId);
        const generatedData = await generateWellnessPlanAI(userContext);
        plan = {
          id: `plan_${Date.now()}`,
          userId,
          version: '1.0',
          status: 'DRAFT',
          summary: generatedData.summary,
          nutrients: generatedData.nutrients,
          recommendedFoods: generatedData.recommendedFoods,
          routineSuggestions: generatedData.routineSuggestions,
          lifestyleHabits: generatedData.lifestyleHabits,
          userAccepted: false,
          disclaimer: generatedData.disclaimer,
          createdAt: new Date().toISOString(),
        };
        mockPlanStore.set(`user_${userId}`, plan);
      }

      res.json({
        success: true,
        plan,
      });
    } catch (error) {
      next(error);
    }
  }
);

// 3. GET /api/v1/wellness-plans/:id — Get Plan By ID
planRouter.get(
  '/wellness-plans/:id',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      let plan = null;
      let isDbAvailable = true;

      try {
        if (db.wellnessPlan) {
          plan = await db.wellnessPlan.findUnique({ where: { id } });
        }
      } catch (err) {
        isDbAvailable = false;
      }

      if (!isDbAvailable || !plan) {
        plan = mockPlanStore.get(id) || null;
      }

      if (!plan) {
        return next(new AppError('Wellness plan not found', 404, 'NOT_FOUND'));
      }

      res.json({
        success: true,
        plan,
      });
    } catch (error) {
      next(error);
    }
  }
);

// 4. POST /api/v1/wellness-plans/:id/accept — User Accept & Activate Plan
planRouter.post(
  '/wellness-plans/:id/accept',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      let isDbAvailable = true;
      let updatedPlan = null;

      try {
        if (db.wellnessPlan) {
          const existing = await db.wellnessPlan.findUnique({ where: { id } });
          if (!existing || existing.userId !== userId) {
            return next(new AppError('Plan not found or access denied', 404, 'NOT_FOUND'));
          }

          updatedPlan = await db.wellnessPlan.update({
            where: { id },
            data: {
              status: 'ACTIVE',
              userAccepted: true,
              acceptedAt: new Date(),
            },
          });
        }
      } catch (err) {
        isDbAvailable = false;
      }

      if (!isDbAvailable || !updatedPlan) {
        const existing = mockPlanStore.get(id) || mockPlanStore.get(`user_${userId}`);
        if (existing) {
          updatedPlan = {
            ...existing,
            status: 'ACTIVE',
            userAccepted: true,
            acceptedAt: new Date().toISOString(),
          };
          mockPlanStore.set(id, updatedPlan);
          mockPlanStore.set(`user_${userId}`, updatedPlan);
        }
      }

      res.json({
        success: true,
        message: 'Plan accepted and activated!',
        plan: updatedPlan,
      });
    } catch (error) {
      next(error);
    }
  }
);

// 5. PATCH /api/v1/wellness-plans/:id — Edit Plan Options
planRouter.patch(
  '/wellness-plans/:id',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const updateData = req.body;

      let isDbAvailable = true;
      let updatedPlan = null;

      try {
        if (db.wellnessPlan) {
          const existing = await db.wellnessPlan.findUnique({ where: { id } });
          if (!existing || existing.userId !== userId) {
            return next(new AppError('Plan not found or access denied', 404, 'NOT_FOUND'));
          }

          updatedPlan = await db.wellnessPlan.update({
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

      if (!isDbAvailable || !updatedPlan) {
        const existing = mockPlanStore.get(id) || mockPlanStore.get(`user_${userId}`);
        if (existing) {
          updatedPlan = {
            ...existing,
            ...updateData,
            updatedAt: new Date().toISOString(),
          };
          mockPlanStore.set(id, updatedPlan);
          mockPlanStore.set(`user_${userId}`, updatedPlan);
        }
      }

      res.json({
        success: true,
        message: 'Wellness plan updated',
        plan: updatedPlan,
      });
    } catch (error) {
      next(error);
    }
  }
);
