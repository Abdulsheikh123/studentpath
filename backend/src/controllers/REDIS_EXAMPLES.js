// Example: How to use Redis in your controllers

import {
  cacheOrFetch,
  deleteRedisKey,
  getRedisValue,
  setRedisValue,
} from "../utils/redisHelpers.js";
import prisma from "../config/prisma.db.js";

/**
 * Example 1: Simple Caching - Get all colleges with caching
 */
export const getCollegesWithCache = async (req, res) => {
  try {
    const colleges = await cacheOrFetch(
      "colleges:all",
      async () => {
        return await prisma.college.findMany({
          include: { category: true, location: true },
        });
      },
      60 * 60, // 1 hour expiry
    );

    res.status(200).json({
      success: true,
      data: colleges,
    });
  } catch (error) {
    console.error("Error fetching colleges:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Example 2: Cache with Query Parameters - Filtered results
 */
export const getSchoolsByCategoryWithCache = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const cacheKey = `schools:category:${categoryId}`;

    const schools = await cacheOrFetch(
      cacheKey,
      async () => {
        return await prisma.school.findMany({
          where: { categoryId: parseInt(categoryId) },
          include: { category: true, admissions: true },
        });
      },
      60 * 30, // 30 minutes expiry
    );

    res.status(200).json({
      success: true,
      data: schools,
    });
  } catch (error) {
    console.error("Error fetching schools:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Example 3: Manual Cache Management - Create with cache invalidation
 */
export const createCollegeWithCache = async (req, res) => {
  try {
    const collegeData = req.body;

    // Create in database
    const newCollege = await prisma.college.create({
      data: collegeData,
      include: { category: true, location: true },
    });

    // Invalidate related caches
    await deleteRedisKey("colleges:all");
    await deleteRedisKey(`colleges:location:${collegeData.locationId}`);

    res.status(201).json({
      success: true,
      data: newCollege,
      message: "College created and cache invalidated",
    });
  } catch (error) {
    console.error("Error creating college:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Example 4: Search History Caching - Track user searches
 */
export const searchExamsWithHistory = async (req, res) => {
  try {
    const { query, userId } = req.query;

    // Cache search results
    const cacheKey = `exam:search:${query}`;

    const results = await cacheOrFetch(
      cacheKey,
      async () => {
        return await prisma.exam.findMany({
          where: {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { code: { contains: query, mode: "insensitive" } },
            ],
          },
          include: { category: true, fees: true },
        });
      },
      60 * 15, // 15 minutes expiry
    );

    if (userId) {
      // Store search in user's search history
      const historyKey = `search:history:${userId}`;
      const history = await getRedisValue(historyKey);
      const updatedHistory = [
        query,
        ...(history || []).filter((q) => q !== query),
      ].slice(0, 20); // Keep last 20 searches
      await setRedisValue(historyKey, updatedHistory, 60 * 60 * 24 * 30);
    }

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error("Error searching exams:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Example 5: Session/Token Blacklist
 */
export const logoutUserWithBlacklist = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (token) {
      // Add token to blacklist for remaining token lifetime
      const TTL = 60 * 60 * 24; // 24 hours
      await setRedisValue(`blacklist:${token}`, true, TTL);
      console.log("Token added to blacklist");
    }

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Error logging out:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Example 6: Rate Limiting
 */
export const checkRateLimit = async (userId, limit = 100, window = 3600) => {
  const key = `ratelimit:${userId}`;
  const current = await incrementRedisCounter(key, 1, window);
  return current <= limit;
};

/**
 * Example 7: Feature Flags/Configurations
 */
export const getFeatureFlags = async (req, res) => {
  try {
    const cacheKey = "config:feature-flags";

    const flags = await cacheOrFetch(
      cacheKey,
      async () => {
        return await prisma.featureFlag.findMany({
          where: { enabled: true },
        });
      },
      60 * 5, // 5 minutes expiry - refresh frequently for dynamic config
    );

    res.status(200).json({
      success: true,
      data: flags,
    });
  } catch (error) {
    console.error("Error fetching feature flags:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export default {
  getCollegesWithCache,
  getSchoolsByCategoryWithCache,
  createCollegeWithCache,
  searchExamsWithHistory,
  logoutUserWithBlacklist,
  checkRateLimit,
  getFeatureFlags,
};
