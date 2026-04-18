import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => console.error("✗ Redis Client Error:", err));
redisClient.on("connect", () => console.log("✓ Redis connecting..."));
redisClient.on("ready", () =>
  console.log("✓ Redis connected and ready to use"),
);

const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  } catch (error) {
    console.error("✗ Failed to connect to Redis:", error);
    // We don't want to crash the whole app if Redis is down,
    // but we should know about it.
  }
};

export { redisClient, connectRedis };
