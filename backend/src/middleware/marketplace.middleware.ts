
import type { NextFunction, Response } from "express";
import { prisma } from "../config/database";
import type { AuthenticatedRequest } from "./auth.middleware";

export interface MarketplaceRequest extends AuthenticatedRequest {
  providerId?: string;
}

export function requireRole(...roles: string[]) {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.userId) {
        res.status(401).json({
          success: false,
          message: "Authentication required",
        });
        return;
      }

      const user = await prisma.user.findUnique({
        where: { id: req.userId },
        select: { role: true, isActive: true },
      });

      if (!user || !user.isActive) {
        res.status(401).json({
          success: false,
          message: "User account is unavailable",
        });
        return;
      }

      if (!roles.includes(user.role)) {
        res.status(403).json({
          success: false,
          message: "You are not authorized to perform this action",
        });
        return;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

export async function requireApprovedProvider(
  req: MarketplaceRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        isActive: true,
        role: true,
      },
    });

    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        message: "User account is unavailable",
      });
      return;
    }

    if (user.role !== "PROVIDER") {
      res.status(403).json({
        success: false,
        message: "Provider access required",
      });
      return;
    }

    const provider = await prisma.provider.findUnique({
      where: { userId: req.userId },
      select: {
        id: true,
        status: true,
      },
    });

    if (!provider) {
      res.status(403).json({
        success: false,
        message: "Provider profile not found",
      });
      return;
    }

    if (provider.status !== "APPROVED") {
      res.status(403).json({
        success: false,
        message: "Your provider account is not approved",
      });
      return;
    }

    req.providerId = provider.id;
    next();
  } catch (error) {
    next(error);
  }
}
