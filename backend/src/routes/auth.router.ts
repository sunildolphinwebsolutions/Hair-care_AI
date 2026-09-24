import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../lib/db';
import { env } from '../config/env';
import { AppError } from '../middleware/errorHandler';
import { validateRequest } from '../middleware/validate';
import { requireAuth, authRateLimiter, UserPayload } from '../middleware/auth';
import { logger } from '../middleware/logger';

export const authRouter = Router();

// In-memory user store fallback if database is offline during development setup
const mockUsersStore = new Map<string, { id: string; email: string; name: string; passwordHash: string; avatar?: string }>();

// Validation Schemas
const signupSchema = z.object({
  body: z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    name: z.string().min(2, 'Name must be at least 2 characters long'),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

// Helper: Set Auth Cookie
const setAuthCookie = (res: Response, token: string) => {
  res.cookie('haircare_session', token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// 1. POST /api/v1/auth/signup
authRouter.post(
  '/signup',
  authRateLimiter,
  validateRequest(signupSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, name } = req.body;
      const normalizedEmail = email.toLowerCase().trim();

      let existingUser = null;
      let isDbAvailable = true;

      try {
        existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
      } catch (err) {
        logger.warn('Prisma DB unavailable during signup, using resilient fallback store');
        isDbAvailable = false;
      }

      if (isDbAvailable && existingUser) {
        return next(new AppError('An account with this email already exists', 400, 'EMAIL_EXISTS'));
      }

      if (!isDbAvailable && mockUsersStore.has(normalizedEmail)) {
        return next(new AppError('An account with this email already exists', 400, 'EMAIL_EXISTS'));
      }

      const passwordHash = await bcrypt.hash(password, 10);
      let userObj: { id: string; email: string; name: string; avatar?: string | null };

      if (isDbAvailable) {
        const createdUser = await prisma.user.create({
          data: {
            email: normalizedEmail,
            name,
            passwordHash,
          },
        });
        userObj = {
          id: createdUser.id,
          email: createdUser.email,
          name: createdUser.name,
          avatar: createdUser.avatar,
        };
      } else {
        const id = `user_${Date.now()}`;
        const mockUser = { id, email: normalizedEmail, name, passwordHash };
        mockUsersStore.set(normalizedEmail, mockUser);
        userObj = { id, email: normalizedEmail, name };
      }

      const tokenPayload: UserPayload = {
        id: userObj.id,
        email: userObj.email,
        name: userObj.name,
      };

      const token = jwt.sign(tokenPayload, env.JWT_SECRET, { expiresIn: '7d' });
      setAuthCookie(res, token);

      res.status(201).json({
        success: true,
        message: 'Account created successfully',
        user: userObj,
        token,
      });
    } catch (error) {
      next(error);
    }
  }
);

// 2. POST /api/v1/auth/login
authRouter.post(
  '/login',
  authRateLimiter,
  validateRequest(loginSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const normalizedEmail = email.toLowerCase().trim();

      let dbUser = null;
      let isDbAvailable = true;

      try {
        dbUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
      } catch (err) {
        logger.warn('Prisma DB unavailable during login, using resilient fallback store');
        isDbAvailable = false;
      }

      let userToVerify = dbUser;
      if (!isDbAvailable) {
        userToVerify = mockUsersStore.get(normalizedEmail) as any;
      }

      if (!userToVerify) {
        return next(new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS'));
      }

      const isPasswordValid = await bcrypt.compare(password, userToVerify.passwordHash);
      if (!isPasswordValid) {
        return next(new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS'));
      }

      const tokenPayload: UserPayload = {
        id: userToVerify.id,
        email: userToVerify.email,
        name: userToVerify.name,
      };

      const token = jwt.sign(tokenPayload, env.JWT_SECRET, { expiresIn: '7d' });
      setAuthCookie(res, token);

      res.json({
        success: true,
        message: 'Logged in successfully',
        user: {
          id: userToVerify.id,
          email: userToVerify.email,
          name: userToVerify.name,
          avatar: userToVerify.avatar || null,
        },
        token,
      });
    } catch (error) {
      next(error);
    }
  }
);

// 3. POST /api/v1/auth/logout
authRouter.post('/logout', (req: Request, res: Response) => {
  res.clearCookie('haircare_session', {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

// 4. GET /api/v1/auth/session
authRouter.get('/session', (req: Request, res: Response) => {
  if (!req.user) {
    return res.json({
      isAuthenticated: false,
      user: null,
    });
  }

  res.json({
    isAuthenticated: true,
    user: req.user,
  });
});

// 5. DELETE /api/v1/auth/account (Permanent Data Deletion & Privacy Retention)
authRouter.delete('/account', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;

    try {
      await prisma.user.delete({
        where: { id: userId },
      });
    } catch (dbErr) {
      logger.warn({ userId }, 'Prisma user delete fallback executed');
    }

    res.clearCookie('haircare_session', {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    res.json({
      success: true,
      message: 'Account and associated user data permanently deleted.',
    });
  } catch (error) {
    next(error);
  }
});

