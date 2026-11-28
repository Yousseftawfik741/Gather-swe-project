
import { Router } from "express";
import {
  listVenues,
  getVenueById,
  createVenue,
  updateVenue,
  deactivateVenue,
  addVenueImage,
  deleteVenueImage,
} from "../controllers/venue.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import { requireApprovedProvider } from "../middleware/marketplace.middleware";

const router = Router();

router.get("/", listVenues);
router.get("/:venueId", getVenueById);

router.post(
  "/",
  authenticateToken,
  requireApprovedProvider,
  createVenue,
);

router.patch(
  "/:venueId",
  authenticateToken,
  requireApprovedProvider,
  updateVenue,
);

router.delete(
  "/:venueId",
  authenticateToken,
  requireApprovedProvider,
  deactivateVenue,
);

router.post(
  "/:venueId/images",
  authenticateToken,
  requireApprovedProvider,
  addVenueImage,
);

router.delete(
  "/:venueId/images/:imageId",
  authenticateToken,
  requireApprovedProvider,
  deleteVenueImage,
);

export default router;
