import { Router } from "express";
import {
  createProviderProfile,
  getMyProviderProfile,
  updateMyProviderProfile,
  listPendingProviders,
  updateProviderStatus,
  getPublicProvider,
} from "../controllers/provider.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/marketplace.middleware";

const router = Router();

router.post("/", authenticateToken, createProviderProfile);

router.get(
  "/me",
  authenticateToken,
  requireRole("PROVIDER"),
  getMyProviderProfile,
);

router.patch(
  "/me",
  authenticateToken,
  requireRole("PROVIDER"),
  updateMyProviderProfile,
);

router.get(
  "/pending",
  authenticateToken,
  requireRole("ADMIN"),
  listPendingProviders,
);

router.patch(
  "/:providerId/status",
  authenticateToken,
  requireRole("ADMIN"),
  updateProviderStatus,
);

router.get("/:providerId", getPublicProvider);

export default router;
