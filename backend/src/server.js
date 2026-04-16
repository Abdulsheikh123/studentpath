import app from "./app.js";
import prisma from "./config/prisma.db.js";
import redis from "./config/redis.config.js";

app.listen(process.env.PORT, "0.0.0.0", async () => {
  try {
    // Connect Redis
    await redis.connect();

    // Connect Prisma
    await prisma.$connect();
    console.log(`Server running on port ${process.env.PORT}`);
    console.log("PostgreSQL connected successfully");
  } catch (error) {
    console.log("Database or Cache connection failed");
    console.log(error.message);
  }
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully...");
  await redis.quit();
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT received, shutting down gracefully...");
  await redis.quit();
  await prisma.$disconnect();
  process.exit(0);
});
