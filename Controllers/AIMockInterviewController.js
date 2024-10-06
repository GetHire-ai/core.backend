const AIMockInterviewModel = require("../Model/AIMockInterviewModel");
const response = require("../Middleware/responseMiddlewares");

createInterview = async (req, res) => {
  try {
    const studentId = req.StudentId;
    const {
      jobTitle,
      experience,
      skills,
      desc,
      questions,
      aiFeedback,
      aiSuggestion,
    } = req.body;
    if (!jobTitle || !experience)
      return response.validationError("Job Title,Experience is required");

    let interview = await AIMockInterviewModel.create({
      student: studentId,
      jobTitle,
      experience,
      skills,
      desc,
      questions,
      aiFeedback,
      aiSuggestion,
    });
    return response.successResponse(
      res,
      interview,
      "AI Mock Interview Created"
    );
  } catch (error) {
    return response.internalServerError(res, "Internal Server error");
  }
};

getAllInterviews = async (req, res) => {
  try {
    const studentId = req.StudentId;
    const interviews = await AIMockInterviewModel.find({
      student: studentId,
    }).populate("student");
    return response.successResponse(
      res,
      interviews,
      "AI Mock Interview Fetched"
    );
  } catch (error) {
    return response.internalServerError(res, "Internal Server error");
  }
};

// Update an AIMockInterview by ID
updateInterview = async (req, res) => {
  try {
    const studentId = req.StudentId;
    const interview = await AIMockInterviewModel.findById(req.params.id);
    if (!interview) {
      return response.notFoundError(res, "Interview not found");
    }
    if (!interview.student.equals(studentId)) {
      return response.errorResponse(res, "Error: Not authorized");
    }
    const updated = await AIMockInterviewModel.findById(studentId);
    if (!updated) return response.notFoundError(res, "Interview not found");
    return response.successResponse(res, updated, "AI Mock Interview Updated");
  } catch (error) {
    return response.internalServerError(res, "Internal Server error");
  }
};

// Delete an AIMockInterview by ID
const deleteInterview = async (req, res) => {
  try {
    const studentId = req.StudentId;
    const interview = await AIMockInterviewModel.findById(req.params.id);
    if (!interview) {
      return response.notFoundError(res, "Interview not found");
    }
    if (!interview.student.equals(studentId)) {
      return response.errorResponse(res, "Error: Not authorized");
    }
    const deleted = await AIMockInterviewModel.findByIdAndDelete(req.params.id);
    return response.successResponse(res, deleted, "AI Mock Interview deleted");
  } catch (error) {
    console.error(error);
    return response.internalServerError(res, "Internal Server error");
  }
};

module.exports = {
  createInterview,
  getAllInterviews,
  updateInterview,
  deleteInterview,
};
