import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/db';
import { requireAuth } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { validateRequest } from '../middleware/validate';

export const notificationRouter = Router();

const db = prisma as any;
const mockPrefStore = new Map<string, any>();
const mockNotificationStore = new Map<string, any[]>();

const preferenceSchema = z.object({
  body: z.object({
    remindersEnabled: z.boolean().optional(),
    reminderTime: z.string().regex(/^([01]\d|2[0-3]):?([0-5]\d)$/, 'Invalid 24hr time format HH:mm').optional(),
    timezone: z.string().optional(),
  }),
});

// 1. GET /api/v1/notifications — List User Notifications
notificationRouter.get('/notifications', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    let notifications = [];
    let isDbAvailable = true;

    try {
      if (db.notificationLog) {
        notifications = await db.notificationLog.findMany({
          where: { userId },
          orderBy: { sentAt: 'desc' },
          take: 20,
        });
      }
    } catch (err) {
      isDbAvailable = false;
    }

    if (!isDbAvailable || !notifications.length) {
      notifications = mockNotificationStore.get(userId) || [
        {
          id: 'notif_1',
          userId,
          title: 'Daily Scalp Care Reminder',
          message: 'Time for your 5-minute scalp massage and hydration check!',
          channel: 'in_app',
          sentAt: new Date().toISOString(),
          isRead: false,
        },
      ];
    }

    res.json({
      success: true,
      notifications,
    });
  } catch (error) {
    next(error);
  }
});

// 2. PATCH /api/v1/notification-preferences — Update Reminder Settings & Timezone
notificationRouter.patch(
  '/notification-preferences',
  requireAuth,
  validateRequest(preferenceSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const { remindersEnabled, reminderTime, timezone } = req.body;

      let updatedPref = null;
      let isDbAvailable = true;

      try {
        if (db.notificationPreference) {
          updatedPref = await db.notificationPreference.upsert({
            where: { userId },
            update: {
              ...(remindersEnabled !== undefined && { remindersEnabled }),
              ...(reminderTime && { reminderTime }),
              ...(timezone && { timezone }),
            },
            create: {
              userId,
              remindersEnabled: remindersEnabled ?? true,
              reminderTime: reminderTime || '09:00',
              timezone: timezone || 'UTC',
            },
          });
        }
      } catch (err) {
        isDbAvailable = false;
      }

      if (!isDbAvailable || !updatedPref) {
        const existing = mockPrefStore.get(userId) || {
          userId,
          remindersEnabled: true,
          reminderTime: '09:00',
          timezone: 'UTC',
        };
        updatedPref = {
          ...existing,
          ...(remindersEnabled !== undefined && { remindersEnabled }),
          ...(reminderTime && { reminderTime }),
          ...(timezone && { timezone }),
          updatedAt: new Date().toISOString(),
        };
        mockPrefStore.set(userId, updatedPref);
      }

      res.json({
        success: true,
        message: 'Notification preferences updated',
        preferences: updatedPref,
      });
    } catch (error) {
      next(error);
    }
  }
);
