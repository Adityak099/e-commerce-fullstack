import Redis from "ioredis";

let redisClient = null;
let hasLoggedConnect = false;
let hasLoggedFailure = false;
let hasWarnedMissingConfig = false;

const buildRedisClient = () => {
  const redisUrl = process.env.REDIS_URL?.trim();

  if (!redisUrl) {
    if (!hasWarnedMissingConfig) {
      console.warn("⚠️ Redis disabled: REDIS_URL is not configured.");
      hasWarnedMissingConfig = true;
    }

    return null;
  }

  const client = new Redis(redisUrl, {
    lazyConnect: true,
    maxRetriesPerRequest: 1,
    connectTimeout: 10000,
    retryStrategy(times) {
      if (times > 2) {
        return null;
      }

      return Math.min(times * 500, 1500);
    },
  });

  client.on("connect", () => {
    if (!hasLoggedConnect) {
      console.log("✅ Cloud Redis Connected (Upstash)");
      hasLoggedConnect = true;
      hasLoggedFailure = false;
    }
  });

  client.on("error", (err) => {
    if (hasLoggedFailure) {
      return;
    }

    const message =
      err?.message ||
      "Redis connection failed. Check REDIS_URL, TLS support, and network access.";

    console.error(`❌ Redis Connection Error: ${message}`);
    hasLoggedFailure = true;
  });

  client.on("end", () => {
    hasLoggedConnect = false;
  });

  return client;
};

export const ensureRedis = async () => {
  if (!redisClient) {
    redisClient = buildRedisClient();
  }

  if (!redisClient) {
    return null;
  }

  if (redisClient.status === "ready" || redisClient.status === "connect") {
    return redisClient;
  }

  try {
    await redisClient.connect();
    return redisClient;
  } catch (error) {
    if (!hasLoggedFailure) {
      const message =
        error?.message ||
        "Redis connection failed. Check REDIS_URL, TLS support, and network access.";
      console.error(`❌ Redis Connection Error: ${message}`);
      hasLoggedFailure = true;
    }

    return null;
  }
};

export { redisClient };
