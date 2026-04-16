import express from "express";
import {
  getCities,
  getCityById,
  createCity,
  updateCity,
  deleteCity,
} from "../controllers/citiesController.js";
import superAdminAuth from "../middlewares/superAdminAuth.js";

const router = express.Router();

// Public endpoints
router.get("/", getCities); // Public: List all cities
router.get("/:id", getCityById); // Public: Get city by ID

// Admin endpoints
router.post("/", superAdminAuth, createCity); // Create requires super admin
router.put("/:id", superAdminAuth, updateCity); // Update requires super admin
router.delete("/:id", superAdminAuth, deleteCity); // Delete requires super admin

export default router;
