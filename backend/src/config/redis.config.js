import { createClient } from "redis";

let redisUrl = process.env.REDIS_URL;

// If REDIS_URL is set, use it directly
if (redisUrl) {
  // Handle both redis:// and redis+socket:// formats
  redisUrl = redisUrl.replace("redis://", "");
}

const redisConfig = redisUrl
  ? {
      url: `redis://${redisUrl}`,
    }
  : {
      host: process.env.REDIS_HOST || "localhost",
      port: parseInt(process.env.REDIS_PORT || "6379"),
      password: process.env.REDIS_PASSWORD || undefined,
    };

const redis = createClient({
  ...redisConfig,
  socket: {
    reconnectStrategy: (retries) => Math.min(retries * 50, 500),
  },
});

redis.on("error", (err) => {
  if (err.message.includes("ECONNREFUSED")) {
    console.error(
      "Redis connection refused. Make sure Redis is running at:",
      redisUrl || `${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    );
  } else {
    console.error("Redis Client Error:", err.message);
  }
});

redis.on("connect", () => {
  const connectionInfo = redisUrl
    ? `redis://${redisUrl}`
    : `${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;
  console.log(`✅ Redis connected successfully at ${connectionInfo}`);
});

redis.on("ready", () => {
  console.log("✅ Redis is ready for commands");
});

redis.on("reconnecting", () => {
  console.log("⏳ Redis reconnecting...");
});

redis.on("end", () => {
  console.log("Redis connection closed");
});

export default redis;
