import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/token";
import { ACCESS_TOKEN_COOKIE } from "../config/auth";

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void {
  const token = req.cookies?.[ACCESS_TOKEN_COOKIE];
  if (typeof token !== "string" || !token) {
    res.status(401).json({
      success: false,
      message: "Authentication required",
    });
    return;
  }

  const userId = verifyAccessToken(token);

  if (!userId) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token",
    });
    return;
  }

  req.userId = userId;
  next();
}
