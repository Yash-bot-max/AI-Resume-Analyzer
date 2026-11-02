const express = require("express");
const router = express.Router();

const ResumeController = require("../Controllers/resume");
const { verifyToken, requireAdmin } = require("../middleware/verifyToken");

const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed!"));
    }
  },
});

// Admin can access all resumes
router.get("/get", verifyToken, requireAdmin, ResumeController.getAllResumes);

// Logged-in users can access their resume history
router.get("/get/:id", verifyToken, ResumeController.getUserResumes);

// Logged-in users can analyze resumes
router.post(
  "/addResume",
  verifyToken,
  (req, res, next) => {
    upload.single("resume")(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            success: false,
            message: "Resume size must be less than 5 MB.",
          });
        }
      }

      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }

      next();
    });
  },
  ResumeController.addResume
);

// User can hide their own resume from History
router.patch(
  "/hide-history/:id",
  verifyToken,
  ResumeController.hideResumeFromHistory
);

// Admin can hide any resume from Admin dashboard
router.patch(
  "/hide-admin/:id",
  verifyToken,
  requireAdmin,
  ResumeController.hideResumeFromAdmin
);

// Only Admin can permanently delete resumes
router.delete(
  "/:id",
  verifyToken,
  requireAdmin,
  ResumeController.deleteResume
);

module.exports = router;