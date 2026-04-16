import express from "express";
import {
  getUniversities,
  getUniversityBySlug,
  createUniversity,
  updateUniversity,
  deleteUniversity,
} from "../controllers/universityController.js";
import anyAdminAuth from "../middlewares/anyAdminAuth.js";
import superAdminAuth from "../middlewares/superAdminAuth.js";

const router = express.Router();

// Public endpoints
router.get("/", getUniversities); // Public: List all universities
router.get("/:slug", getUniversityBySlug); // Public: Get university by slug

// Admin endpoints
router.post("/", superAdminAuth, createUniversity); // Create requires super admin
router.put("/:id", anyAdminAuth, updateUniversity); // Update requires any admin
router.delete("/:id", superAdminAuth, deleteUniversity); // Delete requires super admin

export default router;
