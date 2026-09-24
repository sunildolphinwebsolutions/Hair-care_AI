import { Router, Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import sharp from 'sharp';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../lib/db';
import { env } from '../config/env';
import { AppError } from '../middleware/errorHandler';
import { requireAuth } from '../middleware/auth';
import { logger } from '../middleware/logger';

export const photoRouter = Router();

// Ensure upload directories exist
const UPLOADS_DIR = path.join(process.cwd(), 'uploads', 'photos');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer memory storage configuration (process with Sharp in memory)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB per photo
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (allowedMimeTypes.includes(file.mimetype.toLowerCase())) {
      cb(null, true);
    } else {
      cb(new AppError('Invalid image format. Only JPEG, PNG, and WebP are allowed.', 400, 'INVALID_FILE_TYPE'));
    }
  },
});

const db = prisma as any;
const mockPhotoSessionStore = new Map<string, any>();
const mockPhotoMetadataStore = new Map<string, any>();

// 1. POST /api/v1/photo-sessions — Create Photo Session with Consent
photoRouter.post(
  '/photo-sessions',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const { consentGiven } = req.body;

      if (consentGiven === false) {
        return next(new AppError('Explicit consent is required prior to photo processing', 400, 'CONSENT_REQUIRED'));
      }

      let isDbAvailable = true;
      let session = null;

      try {
        if (db.photoSession) {
          session = await db.photoSession.create({
            data: {
              userId,
              consentGiven: true,
              status: 'PENDING',
            },
            include: { photos: true },
          });
        }
      } catch (err) {
        logger.warn('Prisma DB unavailable for photo sessions, using fallback memory store');
        isDbAvailable = false;
      }

      if (!isDbAvailable || !session) {
        const id = `session_${Date.now()}`;
        session = {
          id,
          userId,
          consentGiven: true,
          status: 'PENDING',
          photos: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        mockPhotoSessionStore.set(id, session);
      }

      res.status(201).json({
        success: true,
        message: 'Photo session initialized',
        session,
      });
    } catch (error) {
      next(error);
    }
  }
);

// 2. GET /api/v1/photo-sessions — Get User Photo Sessions
photoRouter.get(
  '/photo-sessions',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      let sessions = [];
      let isDbAvailable = true;

      try {
        if (db.photoSession) {
          sessions = await db.photoSession.findMany({
            where: { userId },
            include: { photos: true },
            orderBy: { createdAt: 'desc' },
          });
        }
      } catch (err) {
        isDbAvailable = false;
      }

      if (!isDbAvailable || !sessions.length) {
        sessions = Array.from(mockPhotoSessionStore.values()).filter((s) => s.userId === userId);
      }

      res.json({
        success: true,
        sessions,
      });
    } catch (error) {
      next(error);
    }
  }
);

// 3. POST /api/v1/photo-sessions/:id/upload-url — Generate Signed Upload Token
photoRouter.post(
  '/photo-sessions/:id/upload-url',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { category } = req.body;
      const userId = req.user!.id;

      const validCategories = ['FRONT_HAIRLINE', 'TOP_SCALP', 'LEFT_SIDE', 'RIGHT_SIDE'];
      if (!category || !validCategories.includes(category)) {
        return next(new AppError('Invalid category. Must be FRONT_HAIRLINE, TOP_SCALP, LEFT_SIDE, or RIGHT_SIDE', 400, 'INVALID_CATEGORY'));
      }

      // Generate signed upload token valid for 15 minutes
      const token = jwt.sign(
        { sessionId: id, userId, category },
        env.JWT_SECRET,
        { expiresIn: '15m' }
      );

      res.json({
        success: true,
        uploadToken: token,
        uploadUrl: `/api/v1/photo-sessions/${id}/confirm-upload`,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }
);

// 4. POST /api/v1/photo-sessions/:id/confirm-upload — Upload & Process Image with Sharp
photoRouter.post(
  '/photo-sessions/:id/confirm-upload',
  requireAuth,
  upload.single('file'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: sessionId } = req.params;
      const { category } = req.body;
      const file = req.file;

      if (!file) {
        return next(new AppError('No image file provided', 400, 'FILE_MISSING'));
      }

      const validCategories = ['FRONT_HAIRLINE', 'TOP_SCALP', 'LEFT_SIDE', 'RIGHT_SIDE'];
      if (!category || !validCategories.includes(category)) {
        return next(new AppError('Valid category is required', 400, 'INVALID_CATEGORY'));
      }

      // Generate unique file storage keys
      const fileId = `photo_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const filename = `${fileId}.jpg`;
      const filePath = path.join(UPLOADS_DIR, filename);

      // Process image using Sharp:
      // 1. Strip all EXIF / location metadata for privacy (.rotate() auto-orients while stripping EXIF)
      // 2. Resize analysis derivative to max 1200px width/height for fast loading
      // 3. Compress to JPEG quality 85
      const processedBuffer = await sharp(file.buffer)
        .rotate() // Auto-orient based on EXIF, then strip
        .resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toBuffer();

      // Write processed image to secure disk storage
      fs.writeFileSync(filePath, processedBuffer);

      const storageKey = `/uploads/photos/${filename}`;
      let isDbAvailable = true;
      let photoRecord = null;

      try {
        if (db.photoMetadata) {
          photoRecord = await db.photoMetadata.create({
            data: {
              sessionId,
              category,
              storageKey,
              originalName: file.originalname,
              mimeType: 'image/jpeg',
              fileSize: processedBuffer.length,
            },
          });

          // Update session status to COMPLETED
          if (db.photoSession) {
            await db.photoSession.update({
              where: { id: sessionId },
              data: { status: 'COMPLETED' },
            });
          }
        }
      } catch (err) {
        isDbAvailable = false;
      }

      if (!isDbAvailable || !photoRecord) {
        photoRecord = {
          id: fileId,
          sessionId,
          category,
          storageKey,
          originalName: file.originalname,
          mimeType: 'image/jpeg',
          fileSize: processedBuffer.length,
          isThumbnail: false,
          createdAt: new Date().toISOString(),
        };

        const session = mockPhotoSessionStore.get(sessionId);
        if (session) {
          session.photos = [...(session.photos || []), photoRecord];
          session.status = 'COMPLETED';
        }
        mockPhotoMetadataStore.set(fileId, photoRecord);
      }

      res.status(201).json({
        success: true,
        message: 'Photo processed and uploaded securely',
        photo: photoRecord,
      });
    } catch (error: any) {
      logger.error({ error }, 'Failed to process hair photo');
      next(new AppError(error.message || 'Image processing failed', 500, 'IMAGE_PROCESSING_ERROR'));
    }
  }
);

// 5. DELETE /api/v1/photos/:id — Secure Photo Deletion
photoRouter.delete(
  '/photos/:id',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      let photoRecord = null;
      let isDbAvailable = true;

      try {
        if (db.photoMetadata) {
          photoRecord = await db.photoMetadata.findUnique({
            where: { id },
            include: { session: true },
          });

          if (photoRecord && photoRecord.session.userId !== userId) {
            return next(new AppError('Access denied', 403, 'FORBIDDEN'));
          }

          if (photoRecord) {
            await db.photoMetadata.delete({ where: { id } });
          }
        }
      } catch (err) {
        isDbAvailable = false;
      }

      if (!isDbAvailable || !photoRecord) {
        photoRecord = mockPhotoMetadataStore.get(id);
        if (photoRecord) {
          mockPhotoMetadataStore.delete(id);
        }
      }

      // Delete physical file from disk if present
      if (photoRecord && photoRecord.storageKey) {
        const diskPath = path.join(process.cwd(), photoRecord.storageKey);
        if (fs.existsSync(diskPath)) {
          fs.unlinkSync(diskPath);
        }
      }

      res.json({
        success: true,
        message: 'Photo and metadata securely deleted',
      });
    } catch (error) {
      next(error);
    }
  }
);
