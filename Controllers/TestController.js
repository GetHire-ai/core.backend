const asynchandler = require("express-async-handler");
const Test = require("../Model/TestModel");
const Job = require("../Model/JobModel");
const Student = require("../Model/StudentModel");
const JobApply = require("../Model/JobApplyModel");
const TestResult = require("../Model/TestResultofaStudent");
const response = require("../Middleware/responseMiddlewares");
const JobApplyModel = require("../Model/JobApplyModel");

// Create a new test
const createTest = asynchandler(async (req, res) => {
  const { job, questions } = req.body;
  const newTest = new Test({ job, questions });
  await newTest.save();
  return response.successResponse(res, newTest, "Test created successfully");
});

// Get all tests
const getAllTests = asynchandler(async (req, res) => {
  const tests = await Test.find().populate("job");
  return response.successResponse(res, tests, "Tests fetched successfully");
});

// Get a single test by ID
const getTestById = asynchandler(async (req, res) => {
  const test = await Test.findById(req.params.id).populate("job");
  if (!test) {
    return response.notFoundError(res, "Test not found");
  }
  return response.successResponse(res, test, "Test fetched successfully");
});

// Get tests by job ID
const getTestsByJobId = asynchandler(async (req, res) => {
  const tests = await Test.find({ job: req.params.jobId }).populate("job");
  if (!tests.length) {
    return response.notFoundError(res, "No tests found for this job");
  }
  return response.successResponse(res, tests, "Tests fetched successfully");
});

// Update a test by ID
const updateTestById = asynchandler(async (req, res) => {
  const { job, questions, completed } = req.body;
  const updatedTest = await Test.findByIdAndUpdate(
    req.params.id,
    { job, questions, completed },
    { new: true }
  );
  if (!updatedTest) {
    return response.notFoundError(res, "Test not found");
  }
  return response.successResponse(
    res,
    updatedTest,
    "Test updated successfully"
  );
});

// Delete a test by ID
const deleteTestById = asynchandler(async (req, res) => {
  const deletedTest = await Test.findByIdAndDelete(req.params.id);
  if (!deletedTest) {
    return response.notFoundError(res, "Test not found");
  }
  return response.successResponse(
    res,
    deletedTest,
    "Test deleted successfully"
  );
});

// Add a question to a test
const addQuestion = asynchandler(async (req, res) => {
  const { questionText, options, correctAnswer } = req.body;
  const test = await Test.findById(req.params.id);
  if (!test) {
    return response.notFoundError(res, "Test not found");
  }
  test.questions.push({ questionText, options, correctAnswer });
  await test.save();
  return response.successResponse(res, test, "Question added successfully");
});

// Update a question in a test
const updateQuestion = asynchandler(async (req, res) => {
  const { questionId, questionText, options, correctAnswer } = req.body;
  const test = await Test.findById(req.params.id);
  if (!test) {
    return response.notFoundError(res, "Test not found");
  }
  const question = test.questions.id(questionId);
  if (!question) {
    return response.notFoundError(res, "Question not found");
  }
  question.questionText = questionText;
  question.options = options;
  question.correctAnswer = correctAnswer;
  await test.save();
  return response.successResponse(res, test, "Question updated successfully");
});

const addTestResult = asynchandler(async (req, res) => {
  try {
    // Destructure input fields from request body
    let { test, answers, timeTaken } = req.body;
    let score = 0;

    // Calculate the score based on correct answers
    answers.forEach((ans) => {
      if (ans.isCorrect) {
        score += 1;
      }
    });

    // Calculate the score percentage
    let totalQuestions = answers.length;
    let scorePercentage = ((score / totalQuestions) * 100).toFixed(2);
    // Find the test details
    let test1 = await Test.findById(test);
    let dataToSave = {
      student: req.StudentId,
      test,
      answers,
      timeTaken,
      score,
      scorePercentage,
      job: test1.job,
    };

    // Prepare assessment data
    let assessmentData = {
      Round: "Skill Assessment",
      score,
      scorePercentage,
      Date: Date.now(),
      completedstatus: true,
      Notes: "",
    };

    // Update the applied job with the new assessment data and application stage
    let appliedJob = await JobApplyModel.findOneAndUpdate(
      {
        $and: [{ JobId: test1.job }, { StudentId: req.StudentId }],
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
    const result = await TestResult.findById(req.params.id).populate({
      path: "test",
      populate: {
        path: "job",
      },
    });
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

module.exports = {
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
};
