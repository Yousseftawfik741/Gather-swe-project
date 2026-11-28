
import { Router } from "express";
import {
  register,
  login,
  logout,
  getCurrentUser,
} from "../controllers/auth.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import {
  loginRateLimiter,
  registerRateLimiter,
} from "../middleware/auth-rate-limit.middleware";

const router = Router();

router.post("/register", registerRateLimiter, register);
router.post("/login", loginRateLimiter, login);
router.get("/me", authenticateToken, getCurrentUser);
router.post("/logout", logout);

export default router;
