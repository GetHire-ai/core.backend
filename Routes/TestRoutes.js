const express = require("express");
const { StudentverifyToken } = require("../Middleware/VerifyToken");
const {
  addTestResult,
  getResultById,
  getAllTestResultsByMultiId,
  createAiTestResult,
  getAITestResultsByJobId,
  getAITestResultsByStudentId,
  getTestResultsByStudentId,
} = require("../Controllers/TestController");

const router = express.Router();

router.get("/result/:id", getResultById);
router.get("/result/bystudentid/:id/:jobId", getTestResultsByStudentId);
router.get("/result/multiid/:id", getAllTestResultsByMultiId);
router.post("/result", StudentverifyToken, addTestResult);
router.post("/result/aitestresult", StudentverifyToken, createAiTestResult);
router.get("/result/aitestresult/byjobid/:id", getAITestResultsByJobId);
router.get("/result/aitestresult/bystudentid/:id/:jobId", getAITestResultsByStudentId);

module.exports = router;
