import express from "express";
import {
  getPlacements,
  getPlacementById,
  createPlacement,
  updatePlacement,
  deletePlacement,
} from "../controllers/placementsController.js";
import superAdminAuth from "../middlewares/superAdminAuth.js";

const router = express.Router();

// Public endpoints
router.get("/", getPlacements); // Public: List all placements
router.get("/:id", getPlacementById); // Public: Get placement by ID

// Admin endpoints
router.post("/", superAdminAuth, createPlacement); // Create requires super admin
router.put("/:id", superAdminAuth, updatePlacement); // Update requires super admin
router.delete("/:id", superAdminAuth, deletePlacement); // Delete requires super admin

export default router;
