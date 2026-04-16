import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import superAdminRoutes from "./routes/superAdminRoutes.js";
import institutionAdminRoutes from "./routes/institutionAdminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import citiesRoutes from "./routes/citiesRoutes.js";
import schoolRoutes from "./routes/schoolRoutes.js";
import faqRoutes from "./routes/faqRoutes.js";
import hostelRoutes from "./routes/hostelRoutes.js";
import admissionGuideRoutes from "./routes/admissionGuideRoutes.js";
import contentPageRoutes from "./routes/contentPageRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import examRoutes from "./routes/examRoutes.js";
import schoolAdmissionRoutes from "./routes/schoolAdmissionRoutes.js";
import schoolFeeRoutes from "./routes/schoolFeeRoutes.js";
import examFeeRoutes from "./routes/examFeeRoutes.js";
import examDateRoutes from "./routes/examDateRoutes.js";
import examEligibilityRoutes from "./routes/examEligibilityRouters.js";
import examPatternRoutes from "./routes/examPatternRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
// import contactRequestRoutes from './routes/contactRequestRoutes.js'
import ratingRoutes from "./routes/ratingRoutes.js";
import searchHistoryRoutes from "./routes/searchHistoryRoutes.js";
import universityRoutes from "./routes/universityRoutes.js";
import collegeRoutes from "./routes/collegeRoutes.js";
import collegeCoursesRoutes from "./routes/collegeCoursesRoutes.js";
import collegeExamsRoutes from "./routes/collegeExamsRoutes.js";
import placementsRoutes from "./routes/placementsRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import standaloneInstituteRoutes from "./routes/standaloneInstituteRoutes.js";

const app = express();

const corsOrigin =
  process.env.FRONTEND_URL || process.env.CLIENT_URL || "http://localhost:3000";

app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static(path.resolve("uploads")));

// super admin routes
app.use("/api/super-admin", superAdminRoutes);
// institution admin routes
app.use("/api/institution-admin", institutionAdminRoutes);
// user routes
app.use("/api/users", userRoutes);
// category routes
app.use("/api/categories", categoryRoutes);
// cities routes
app.use("/api/cities", citiesRoutes);
// school routes
app.use("/api/schools", schoolRoutes);
// faq routes
app.use("/api/faqs", faqRoutes);
// hostel routes
app.use("/api/hostels", hostelRoutes);
// admission guide routes
app.use("/api/admission-guides", admissionGuideRoutes);
// content page routes
app.use("/api/content-pages", contentPageRoutes);
// course routes
app.use("/api/courses", courseRoutes);
// exam routes
app.use("/api/exams", examRoutes);
// school admission routes
app.use("/api/school-admissions", schoolAdmissionRoutes);
// school fee routes
app.use("/api/school-fees", schoolFeeRoutes);
// exam fee routes
app.use("/api/exam-fees", examFeeRoutes);
// exam date routes
app.use("/api/exam-dates", examDateRoutes);
// exam eligibility routes
app.use("/api/exam-eligibilities", examEligibilityRoutes);
// exam pattern routes
app.use("/api/exam-patterns", examPatternRoutes);
// comment routes
app.use("/api/comments", commentRoutes);
// contact request routes
// app.use('/api/contact-requests', contactRequestRoutes)
// rating routes
app.use("/api/ratings", ratingRoutes);
// search history routes
app.use("/api/search-history", searchHistoryRoutes);
// university routes
app.use("/api/universities", universityRoutes);
// college routes
app.use("/api/colleges", collegeRoutes);
// college-courses routes
app.use("/api/college-courses", collegeCoursesRoutes);
// college-exams routes
app.use("/api/college-exams", collegeExamsRoutes);
// placements routes
app.use("/api/placements", placementsRoutes);
// location routes
app.use("/api/locations", locationRoutes);
// standalone institute routes
app.use("/api/standalone-institutes", standaloneInstituteRoutes);

app.get("/", (req, res) => {
  res.send("StudentPath API is running on port 5000");
});

export default app;
