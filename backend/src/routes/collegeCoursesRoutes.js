import express from "express";
import {
  getCollegeCourses,
  getCollegeCourseById,
  createCollegeCourse,
  updateCollegeCourse,
  deleteCollegeCourse,
} from "../controllers/collegeCoursesController.js";
import superAdminAuth from "../middlewares/superAdminAuth.js";

const router = express.Router();

// Public endpoints
router.get("/", getCollegeCourses); // Public: List all college courses
router.get("/:id", getCollegeCourseById); // Public: Get college course by ID

// Admin endpoints
router.post("/", superAdminAuth, createCollegeCourse); // Create requires super admin
router.put("/:id", superAdminAuth, updateCollegeCourse); // Update requires super admin
router.delete("/:id", superAdminAuth, deleteCollegeCourse); // Delete requires super admin

export default router;
