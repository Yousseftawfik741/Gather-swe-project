
import type { Request, Response, NextFunction } from "express";
import { Prisma } from "../generated/prisma/client";
import { prisma } from "../config/database";
import type { MarketplaceRequest } from "../middleware/marketplace.middleware";
import {
  createVenueSchema,
  updateVenueSchema,
  createVenueImageSchema,
} from "../validators/venue.validator";

export async function listVenues(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 12));
    const search = String(req.query.search || "").trim();
    const city = String(req.query.city || "").trim();
    const type = req.query.type ? String(req.query.type) : undefined;
    const supportedEventType = req.query.supportedEventType
      ? String(req.query.supportedEventType)
      : undefined;

    const validTypes = [
      "HOTEL",
      "WEDDING_HALL",
      "GARDEN",
      "CONFERENCE_HALL",
      "RESTAURANT",
      "OTHER",
    ];

    const validEventTypes = [
      "WEDDING",
      "BIRTHDAY",
      "ENGAGEMENT",
      "BUSINESS",
      "CONFERENCE",
      "GRADUATION",
      "OTHER",
    ];

    if (type && !validTypes.includes(type)) {
      res.status(400).json({
        success: false,
        message: "Invalid venue type",
      });
      return;
    }

    if (supportedEventType && !validEventTypes.includes(supportedEventType)) {
      res.status(400).json({
        success: false,
        message: "Invalid supported event type",
      });
      return;
    }

    const minPrice =
      req.query.minPrice === undefined ? undefined : Number(req.query.minPrice);

    const maxPrice =
      req.query.maxPrice === undefined ? undefined : Number(req.query.maxPrice);

    const minCapacity =
      req.query.minCapacity === undefined
        ? undefined
        : Number(req.query.minCapacity);

    if (
      (minPrice !== undefined &&
        (!Number.isFinite(minPrice) || minPrice < 0)) ||
      (maxPrice !== undefined &&
        (!Number.isFinite(maxPrice) || maxPrice < 0)) ||
      (minCapacity !== undefined &&
        (!Number.isInteger(minCapacity) || minCapacity < 1)) ||
      (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice)
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid venue filters",
      });
      return;
    }

    const where: Prisma.VenueWhereInput = {
      isActive: true,
      provider: { status: "APPROVED" },
      ...(city ? { city: { contains: city, mode: "insensitive" } } : {}),
      ...(type
        ? {
            type: type as
              | "HOTEL"
              | "WEDDING_HALL"
              | "GARDEN"
              | "CONFERENCE_HALL"
              | "RESTAURANT"
              | "OTHER",
          }
        : {}),
      ...(minCapacity !== undefined ? { capacity: { gte: minCapacity } } : {}),
      ...(minPrice !== undefined || maxPrice !== undefined
        ? {
            price: {
              ...(minPrice !== undefined ? { gte: minPrice } : {}),
              ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
            },
          }
        : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
              { city: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(supportedEventType
        ? {
            supportedEventTypes: {
              has: supportedEventType as
                | "WEDDING"
                | "BIRTHDAY"
                | "ENGAGEMENT"
                | "BUSINESS"
                | "CONFERENCE"
                | "GRADUATION"
                | "OTHER",
            },
          }
        : {}),
    };

    const [venues, total] = await prisma.$transaction([
      prisma.venue.findMany({
        where,
        include: {
          images: { orderBy: { sortOrder: "asc" } },
          provider: {
            select: { id: true, businessName: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.venue.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        venues,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getVenueById(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const venue = await prisma.venue.findFirst({
      where: {
        id: req.params.venueId,
        isActive: true,
        provider: { status: "APPROVED" },
      },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        provider: {
          select: {
            id: true,
            businessName: true,
            description: true,
            phone: true,
          },
        },
      },
    });

    if (!venue) {
      res.status(404).json({
        success: false,
        message: "Venue not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: { venue },
    });
  } catch (error) {
    next(error);
  }
}

export async function createVenue(
  req: MarketplaceRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsed = createVenueSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: "Invalid venue data",
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const venue = await prisma.venue.create({
      data: {
        ...parsed.data,
        providerId: req.providerId!,
      },
    });

    res.status(201).json({
      success: true,
      message: "Venue created successfully",
      data: { venue },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateVenue(
  req: MarketplaceRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsed = updateVenueSchema.safeParse(req.body);

    if (!parsed.success || Object.keys(parsed.data ?? {}).length === 0) {
      res.status(400).json({
        success: false,
        message: "Valid venue update data is required",
        errors: parsed.success ? undefined : parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const existing = await prisma.venue.findFirst({
      where: {
        id: req.params.venueId,
        providerId: req.providerId!,
      },
    });

    if (!existing) {
      res.status(404).json({
        success: false,
        message: "Venue not found",
      });
      return;
    }

    const venue = await prisma.venue.update({
      where: { id: existing.id },
      data: parsed.data,
    });

    res.status(200).json({
      success: true,
      message: "Venue updated successfully",
      data: { venue },
    });
  } catch (error) {
    next(error);
  }
}

export async function deactivateVenue(
  req: MarketplaceRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const existing = await prisma.venue.findFirst({
      where: {
        id: req.params.venueId,
        providerId: req.providerId!,
      },
    });

    if (!existing) {
      res.status(404).json({
        success: false,
        message: "Venue not found",
      });
      return;
    }

    const venue = await prisma.venue.update({
      where: { id: existing.id },
      data: { isActive: false },
    });

    res.status(200).json({
      success: true,
      message: "Venue deactivated successfully",
      data: { venue },
    });
  } catch (error) {
    next(error);
  }
}

export async function addVenueImage(
  req: MarketplaceRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsed = createVenueImageSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: "Invalid venue image data",
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const venue = await prisma.venue.findFirst({
      where: {
        id: req.params.venueId,
        providerId: req.providerId!,
        isActive: true,
      },
    });

    if (!venue) {
      res.status(404).json({
        success: false,
        message: "Venue not found",
      });
      return;
    }

    const image = await prisma.venueImage.create({
      data: {
        ...parsed.data,
        venueId: venue.id,
      },
    });

    res.status(201).json({
      success: true,
      message: "Venue image added successfully",
      data: { image },
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteVenueImage(
  req: MarketplaceRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const image = await prisma.venueImage.findFirst({
      where: {
        id: req.params.imageId,
        venueId: req.params.venueId,
        venue: {
          providerId: req.providerId!,
        },
      },
    });

    if (!image) {
      res.status(404).json({
        success: false,
        message: "Venue image not found",
      });
      return;
    }

    await prisma.venueImage.delete({
      where: { id: image.id },
    });

    res.status(200).json({
      success: true,
      message: "Venue image deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}
