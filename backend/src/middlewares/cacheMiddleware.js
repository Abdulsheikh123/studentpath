import { getRedisValue, setRedisValue } from "../utils/redisHelpers.js";

/**
 * Generic caching middleware
 * Use: app.get('/endpoint', cacheMiddleware('cache-key', 3600), controller)
 */
export const cacheMiddleware = (keyPrefix, expiry = 3600) => {
  return async (req, res, next) => {
    const cacheKey = `${keyPrefix}:${JSON.stringify(req.query)}:${JSON.stringify(
      req.params,
    )}`;

    try {
      // Try to get from cache
      const cached = await getRedisValue(cacheKey);
      if (cached) {
        res.set("X-Cache", "HIT");
        return res.json(cached);
      }
    } catch (error) {
      console.warn("Cache read failed, continuing:", error.message);
    }

    // Store original res.json
    const originalJson = res.json.bind(res);

    // Override res.json to cache the response
    res.json = function (data) {
      try {
        setRedisValue(cacheKey, data, expiry).catch((err) =>
          console.warn("Cache write failed:", err.message),
        );
      } catch (error) {
        console.warn("Cache write error:", error.message);
      }

      res.set("X-Cache", "MISS");
      return originalJson(data);
    };

    next();
  };
};

/**
 * Cache invalidation middleware
 * Use: app.post('/endpoint', invalidateCachePattern('cache-pattern:*'), controller)
 */
export const invalidateCachePattern = (pattern) => {
  return async (req, res, next) => {
    res.on("finish", async () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          const keys = await redis.keys(pattern);
          if (keys.length > 0) {
            await redis.del(keys);
            console.log(
              `Invalidated ${keys.length} cache keys matching pattern: ${pattern}`,
            );
          }
        } catch (error) {
          console.warn("Cache invalidation failed:", error.message);
        }
      }
    });
    next();
  };
};

export default cacheMiddleware;
