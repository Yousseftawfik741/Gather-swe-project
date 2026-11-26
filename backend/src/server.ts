
import "dotenv/config";
import app from "./app";
import { prisma } from "./config/database";

const PORT = Number(process.env.PORT) || 5000;

async function startServer() {
  try {
    // Connect to PostgreSQL before starting Express
    await prisma.$connect();
    console.log("Database connected successfully");

    const server = app.listen(PORT, () => {
      console.log(`Gather backend running on port ${PORT}`);
    });

    // Gracefully shut down the server and database connection
    const shutdown = (signal: string) => {
      console.log(`${signal} received. Shutting down...`);

      server.close(async (error) => {
        if (error) {
          console.error("Server shutdown error:", error);
          process.exitCode = 1;
        }

        try {
          await prisma.$disconnect();
          console.log("Database disconnected successfully");
        } catch (disconnectError) {
          console.error("Database disconnect error:", disconnectError);
          process.exitCode = 1;
        }
      });
    };

    process.once("SIGINT", () => shutdown("SIGINT"));
    process.once("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    console.error("Failed to start Gather backend:", error);
    await prisma.$disconnect();
    process.exitCode = 1;
  }
}

void startServer();
