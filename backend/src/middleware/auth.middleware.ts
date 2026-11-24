import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/token";

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void {
  const authorization = req.headers.authorization;

  if (!authorization || !/^Bearer\s+/i.test(authorization)) {
    res.status(401).json({
      success: false,
      message: "Authentication required",
    });
    return;
  }

  const token = authorization.slice(7).trim();

  if (!token) {
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
