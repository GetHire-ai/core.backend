const asynchandler = require("express-async-handler");
const Test = require("../Model/TestModel");
const Job = require("../Model/JobModel");
const Student = require("../Model/StudentModel");
const JobApply = require("../Model/JobApplyModel");
const TestResult = require("../Model/TestResultofaStudent");
const response = require("../Middleware/responseMiddlewares");
const JobApplyModel = require("../Model/JobApplyModel");
const AITestModel = require("../Model/AITestResult");
const TestModel = require("../Model/TestModel");

const addTestResult = asynchandler(async (req, res) => {
  try {
    let { jobId, answers, timeTaken } = req.body;
    let score = 0;
    answers.forEach((ans) => {
      if (ans.isCorrect) {
        score += 1;
      }
    });
    let totalQuestions = answers.length;
    let scorePercentage = ((score / totalQuestions) * 100).toFixed(2);
    let dataToSave = {
      student: req.StudentId,
      answers,
      timeTaken,
      score,
      scorePercentage,
      job: jobId,
    };
    let assessmentData = {
      Round: "Skill Assessment",
      score,
      scorePercentage,
      Date: Date.now(),
      completedstatus: true,
      Notes: "",
    };

    let appliedJob = await JobApplyModel.findOneAndUpdate(
      {
        $and: [{ JobId: jobId }, { StudentId: req.StudentId }],
      },
      {
        $set: { Application_stage: "Skill Assessment" },
        $push: { assessment: assessmentData },
      },
      { new: true }
    );

    // Save the test result
    let savedResult = await TestResult.create(dataToSave);
    response.successResponse(res, savedResult, "Result Saved");
  } catch (error) {
    console.log(error);
    response.internalServerError(res, "internal server error");
  }
});

// Get a single result by ID
const getResultById = asynchandler(async (req, res) => {
  try {
    const result = await TestResult.findById(req.params.id).populate("job");
    if (!result) {
      return response.notFoundError(res, "result not found");
    }
    return response.successResponse(res, result, "result fetched successfully");
  } catch (error) {
    response.internalServerError(res, "internal server error");
  }
});

// Get All Results by multi id

const getAllTestResultsByMultiId = asynchandler(async (req, res) => {
  try {
    const { id } = req.params;
    let results;
    const job = await Job.findById(id);
    const student = await Student.findById(id);
    const test = await Test.findById(id);
    if (job) {
      results = await TestResult.find({ job: id });
    }
    if (student) {
      results = await TestResult.find({ student: id });
    }
    if (test) {
      results = await TestResult.find({ test: id });
    }
    return response.successResponse(
      res,
      results,
      "result fetched successfully"
    );
  } catch (error) {
    response.internalServerError(res, "internal server error");
  }
});

const createAiTestResult = asynchandler(async (req, res) => {
  try {
    let { jobId, score, aiText } = req.body;
    let StudentId = req.StudentId;
    let test = await AITestModel.findOne({ job: jobId, student: StudentId });
    if (test) {
      return response.errorResponse(res, "You Have Already Given Test !");
    }
    let dataToSave = {
      student: StudentId,
      job: jobId,
      score,
      aiText,
    };

    let result = await AITestModel.create(dataToSave);
    return response.successResponse(res, result, "result Create successfully");
  } catch (error) {
    response.internalServerError(res, "internal server error");
  }
});

const getTestResultsByStudentId = asynchandler(async (req, res) => {
  try {
    const { studentId } = req.params;
    const results = await TestModel.find({ student: studentId })
      .populate("job")
      .populate("student");

    if (results.length === 0) {
      return response.successResponse(
        res,
        results,
        "No AI test results found for the given student ID"
      );
    }

    return response.successResponse(
      res,
      results,
      "Test results fetched successfully"
    );
  } catch (error) {
    console.log(error);
    response.internalServerError(res, "Internal server error");
  }
});

const getAITestResultsByStudentId = asynchandler(async (req, res) => {
  try {
    const { studentId } = req.params;
    const results = await AITestModel.find({ student: studentId })
      .populate("job")
      .populate("student");

    if (results.length === 0) {
      return response.successResponse(
        res,
        results,
        "No AI test results found for the given student ID"
      );
    }

    return response.successResponse(
      res,
      results,
      "AI Test results fetched successfully"
    );
  } catch (error) {
    console.log(error);
    response.internalServerError(res, "Internal server error");
  }
});

const getAITestResultsByJobId = asynchandler(async (req, res) => {
  try {
    const { jobId } = req.params;
    const results = await AITestModel.find({ job: jobId })
      .populate("job")
      .populate("student");

    if (results.length === 0) {
      return response.successResponse(
        res,
        results,
        "No AI test results found for the given job ID"
      );
    }

    return response.successResponse(
      res,
      results,
      "AI Test results fetched successfully"
    );
  } catch (error) {
    response.internalServerError(res, "Internal server error");
  }
});

module.exports = {
  addTestResult,
  getResultById,
  getAllTestResultsByMultiId,
  createAiTestResult,
  getTestResultsByStudentId,
  getAITestResultsByJobId,
  getAITestResultsByStudentId,
};
