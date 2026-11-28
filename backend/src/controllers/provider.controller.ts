
import type { Request, Response, NextFunction } from "express";
import { prisma } from "../config/database";
import type { AuthenticatedRequest } from "../middleware/auth.middleware";
import {
  createProviderSchema,
  updateProviderSchema,
  updateProviderStatusSchema,
} from "../validators/provider.validator";

export async function createProviderProfile(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({ success: false, message: "Authentication required" });
      return;
    }

    const parsed = createProviderSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: "Invalid provider data",
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        message: "User account is unavailable",
      });
      return;
    }

    if (user.role !== "CUSTOMER") {
      res.status(409).json({
        success: false,
        message: "This account cannot create another provider profile",
      });
      return;
    }

    const provider = await prisma.$transaction(async (tx) => {
      const created = await tx.provider.create({
        data: {
          userId: req.userId!,
          ...parsed.data,
          status: "PENDING",
        },
      });

      await tx.user.update({
        where: { id: req.userId! },
        data: { role: "PROVIDER" },
      });

      return created;
    });

    res.status(201).json({
      success: true,
      message: "Provider profile submitted for approval",
      data: { provider },
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
        message: "Provider profile already exists",
      });
      return;
    }

    next(error);
  }
}

export async function getMyProviderProfile(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const provider = await prisma.provider.findUnique({
      where: { userId: req.userId! },
      include: {
        _count: {
          select: {
            venues: true,
            services: true,
          },
        },
      },
    });

    if (!provider) {
      res.status(404).json({
        success: false,
        message: "Provider profile not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: { provider },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateMyProviderProfile(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsed = updateProviderSchema.safeParse(req.body);

    if (!parsed.success || Object.keys(parsed.data ?? {}).length === 0) {
      res.status(400).json({
        success: false,
        message: "Valid provider update data is required",
        errors: parsed.success ? undefined : parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const provider = await prisma.provider.update({
      where: { userId: req.userId! },
      data: parsed.data,
    });

    res.status(200).json({
      success: true,
      message: "Provider profile updated",
      data: { provider },
    });
  } catch (error) {
    next(error);
  }
}

export async function listPendingProviders(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const providers = await prisma.provider.findMany({
      where: { status: "PENDING" },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    res.status(200).json({
      success: true,
      data: { providers },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProviderStatus(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsed = updateProviderStatusSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: "Invalid provider status",
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const provider = await prisma.provider.update({
      where: { id: req.params.providerId },
      data: { status: parsed.data.status },
    });

    res.status(200).json({
      success: true,
      message: "Provider status updated",
      data: { provider },
    });
  } catch (error) {
    next(error);
  }
}

export async function getPublicProvider(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const provider = await prisma.provider.findFirst({
      where: {
        id: req.params.providerId,
        status: "APPROVED",
      },
      select: {
        id: true,
        businessName: true,
        description: true,
        phone: true,
        address: true,
        createdAt: true,
        venues: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            city: true,
            type: true,
            price: true,
            currency: true,
          },
        },
        services: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            category: true,
            price: true,
            currency: true,
          },
        },
      },
    });

    if (!provider) {
      res.status(404).json({
        success: false,
        message: "Provider not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: { provider },
    });
  } catch (error) {
    next(error);
  }
}
