import redis from "../config/redis.config.js";

const DEFAULT_EXPIRY = 60 * 60; // 1 hour

/**
 * Set a key-value pair in Redis with optional expiry
 */
export const setRedisValue = async (key, value, expiry = DEFAULT_EXPIRY) => {
  try {
    if (typeof value === "object") {
      value = JSON.stringify(value);
    }
    await redis.setEx(key, expiry, value);
  } catch (error) {
    console.error(`Redis SET error for key ${key}:`, error);
    throw error;
  }
};

/**
 * Get a value from Redis
 */
export const getRedisValue = async (key) => {
  try {
    const value = await redis.get(key);
    if (!value) return null;

    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  } catch (error) {
    console.error(`Redis GET error for key ${key}:`, error);
    throw error;
  }
};

/**
 * Delete a key from Redis
 */
export const deleteRedisKey = async (key) => {
  try {
    await redis.del(key);
  } catch (error) {
    console.error(`Redis DEL error for key ${key}:`, error);
    throw error;
  }
};

/**
 * Delete multiple keys from Redis
 */
export const deleteRedisKeys = async (keys) => {
  try {
    if (keys.length > 0) {
      await redis.del(keys);
    }
  } catch (error) {
    console.error(`Redis multiple DEL error:`, error);
    throw error;
  }
};

/**
 * Clear all keys matching a pattern
 */
export const clearRedisByPattern = async (pattern) => {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(keys);
    }
  } catch (error) {
    console.error(`Redis SCAN error for pattern ${pattern}:`, error);
    throw error;
  }
};

/**
 * Increment a counter
 */
export const incrementRedisCounter = async (
  key,
  increment = 1,
  expiry = DEFAULT_EXPIRY,
) => {
  try {
    const value = await redis.incrBy(key, increment);
    if (value === increment) {
      // Key just created, set expiry
      await redis.expire(key, expiry);
    }
    return value;
  } catch (error) {
    console.error(`Redis INCR error for key ${key}:`, error);
    throw error;
  }
};

/**
 * Check if key exists
 */
export const redisKeyExists = async (key) => {
  try {
    return (await redis.exists(key)) === 1;
  } catch (error) {
    console.error(`Redis EXISTS error for key ${key}:`, error);
    throw error;
  }
};

/**
 * Get time-to-live for a key
 */
export const getRedisExpiry = async (key) => {
  try {
    return await redis.ttl(key);
  } catch (error) {
    console.error(`Redis TTL error for key ${key}:`, error);
    throw error;
  }
};

/**
 * Cache wrapper - get from cache or fetch and cache
 */
export const cacheOrFetch = async (key, fetchFn, expiry = DEFAULT_EXPIRY) => {
  try {
    // Try to get from cache
    const cached = await getRedisValue(key);
    if (cached !== null) {
      console.log(`Cache HIT for key: ${key}`);
      return cached;
    }

    // Fetch fresh data
    console.log(`Cache MISS for key: ${key}`);
    const data = await fetchFn();

    // Store in cache
    await setRedisValue(key, data, expiry);

    return data;
  } catch (error) {
    console.error(`Cache wrapper error for key ${key}:`, error);
    throw error;
  }
};
