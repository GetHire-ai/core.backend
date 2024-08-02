const express = require("express");
const { StudentverifyToken } = require("../Middleware/VerifyToken");
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
  createAiTestResult,
  getAITestResultsByJobId,
  getAITestResultsByStudentId,
  getTestResultsByStudentId,
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
router.get("/result/:id", getResultById);
router.get("/result/bystudentid/:id", getTestResultsByStudentId);
router.get("/result/multiid/:id", getAllTestResultsByMultiId);
router.post("/result", StudentverifyToken, addTestResult);
router.post("/result/aitestresult", StudentverifyToken, createAiTestResult);
router.get("/result/aitestresult/byjobid/:id", getAITestResultsByJobId);
router.get("/result/aitestresult/bystudentid/:id", getAITestResultsByStudentId);

module.exports = router;
