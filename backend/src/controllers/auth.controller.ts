import type { Request, Response, NextFunction } from "express";
import { prisma } from "../config/database";
import {
  ACCESS_TOKEN_COOKIE,
  ACCESS_TOKEN_COOKIE_OPTIONS,
} from "../config/auth";
import { hashPassword, verifyPassword } from "../utils/password";
import { generateAccessToken } from "../utils/token";
import { loginSchema, registerSchema } from "../validators/auth.validator";

export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        success: false,
        message: "Invalid registration data",
        errors: result.error.flatten().fieldErrors,
      });
      return;
    }

    const { firstName, lastName, email, password } = result.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
      return;
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        passwordHash,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
      },
    });

    const token = generateAccessToken(user.id);

    res.cookie(ACCESS_TOKEN_COOKIE, token, ACCESS_TOKEN_COOKIE_OPTIONS);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        success: false,
        message: "Invalid login data",
        errors: result.error.flatten().fieldErrors,
      });
      return;
    }

    const { email, password } = result.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    const passwordIsValid = await verifyPassword(user.passwordHash, password);

    if (!passwordIsValid) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    const token = generateAccessToken(user.id);

    res.cookie(ACCESS_TOKEN_COOKIE, token, ACCESS_TOKEN_COOKIE_OPTIONS);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
      return;
    }

    next(error);
  }
}

export function logout(_req: Request, res: Response): void {
  const { maxAge: _maxAge, ...clearOptions } = ACCESS_TOKEN_COOKIE_OPTIONS;

  res.clearCookie(ACCESS_TOKEN_COOKIE, clearOptions);

  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
}

export async function getCurrentUser(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = (req as Request & { userId?: string }).userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      const { maxAge: _maxAge, ...clearOptions } = ACCESS_TOKEN_COOKIE_OPTIONS;

      res.clearCookie(ACCESS_TOKEN_COOKIE, clearOptions);

      res.status(401).json({
        success: false,
        message: "User account is unavailable",
      });
      return;
    }

    const { isActive: _isActive, ...publicUser } = user;

    res.status(200).json({
      success: true,
      data: { user: publicUser },
    });
  } catch (error) {
    next(error);
  }
}
