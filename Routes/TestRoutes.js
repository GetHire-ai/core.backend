const express = require("express");
const { StudentverifyToken } = require('../Middleware/VerifyToken')
const {
  createTest,
  getAllTests,
  getTestById,
  getTestsByJobId,
  updateTestById,
  deleteTestById,
  addQuestion,
  updateQuestion,
  addTestResult,
  getResultById,
  getAllTestResultsByMultiId,
} = require("../Controllers/TestController");

const router = express.Router();

router.post("/", createTest);
router.get("/", getAllTests);
router.get("/:id", getTestById);
router.get("/job/:jobId", getTestsByJobId);
router.put("/:id", updateTestById);
router.delete("/:id", deleteTestById);
router.post("/:id/question", addQuestion);
router.put("/:id/question", updateQuestion);
router.get("/result/:id",  getResultById)
router.get("/result/multiid/:id",  getAllTestResultsByMultiId)
router.post("/result", StudentverifyToken, addTestResult)

module.exports = router;
