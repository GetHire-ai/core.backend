const express = require("express");
const {
  getOnboarding,
  updateOnboarding,
} = require("../Controllers/OnboardingController");
const path = require("path");
const router = express.Router();
const multer = require("multer");


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});
const upload = multer({ storage });
router.get("/:jobId/:studentId/:companyId", getOnboarding);
router.put(
  "/update/:id",
  upload.fields([
    { name: "employmentContract", maxCount: 1 },
    { name: "nda", maxCount: 1 },
    { name: "taxForms", maxCount: 1 },
    { name: "panCard", maxCount: 1 },
    { name: "aadharCard", maxCount: 1 },
    { name: "salarySlip", maxCount: 1 },
    { name: "bankStatement", maxCount: 1 },
  ]),
  updateOnboarding
);

module.exports = router;
