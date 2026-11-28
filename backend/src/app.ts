import express from "express";
import cors from "cors";
import helmet from "helmet";
import eventsRouter from "./routes/events";
const app = express();

// Security middleware
app.use(helmet());

// Frontend communication
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
);

// Parse JSON requests
app.use(express.json());
// Events API
app.use("/api/events", eventsRouter);
// Health check
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Gather backend is running",
  });
});

export default app;
