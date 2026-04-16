import express from "express";
import {
  getCollegeExams,
  getCollegeExamById,
  createCollegeExam,
  updateCollegeExam,
  deleteCollegeExam,
} from "../controllers/collegeExamsController.js";
import superAdminAuth from "../middlewares/superAdminAuth.js";

const router = express.Router();

// Public endpoints
router.get("/", getCollegeExams); // Public: List all college exams
router.get("/:id", getCollegeExamById); // Public: Get college exam by ID

// Admin endpoints
router.post("/", superAdminAuth, createCollegeExam); // Create requires super admin
router.put("/:id", superAdminAuth, updateCollegeExam); // Update requires super admin
router.delete("/:id", superAdminAuth, deleteCollegeExam); // Delete requires super admin

export default router;
