import express from "express";
import {
  getFaqs,
  updateFaq,
  deleteFaq,
  createFAQ,
  getCollegeFAQs,
  getSchoolFAQs,
  getUniversityFAQs,
  getInstituteFAQs,
  getResearchFAQs,
} from "../controllers/faqController.js";

const router = express.Router();

// Generic FAQ endpoints with itemType query parameter
router.get("/", getFaqs); // GET /?itemType=college&itemId=1
router.post("/", createFAQ); // POST / with itemType in body
router.put("/:id/:itemType", updateFaq); // PUT /:id/:itemType
router.delete("/:id/:itemType", deleteFaq); // DELETE /:id/:itemType

// Type-specific endpoints for convenience
router.get("/university/:id", getUniversityFAQs);
router.get("/college/:id", getCollegeFAQs);
router.get("/school/:id", getSchoolFAQs);
router.get("/institute/:id", getInstituteFAQs);
router.get("/research/:id", getResearchFAQs);

export default router;
