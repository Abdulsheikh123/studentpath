import express from "express";
import {
  getColleges,
  getCollegeBySlug,
  createCollege,
  updateCollege,
  deleteCollege,
} from "../controllers/collegeController.js";
import anyAdminAuth from "../middlewares/anyAdminAuth.js";
import superAdminAuth from "../middlewares/superAdminAuth.js";

const router = express.Router();

// Public endpoints
router.get("/", getColleges); // Public: List all colleges
router.get("/:slug", getCollegeBySlug); // Public: Get college by slug

// Admin endpoints
router.post("/", superAdminAuth, createCollege); // Create requires super admin
router.put("/:id", anyAdminAuth, updateCollege); // Update requires any admin
router.delete("/:id", superAdminAuth, deleteCollege); // Delete requires super admin

export default router;
