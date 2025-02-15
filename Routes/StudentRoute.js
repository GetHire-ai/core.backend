const express = require("express");
const { StudentverifyToken } = require("../Middleware/VerifyToken");
const {
  RegisterStudent,
  CreateStudentOtp,
  verifyotp,
  Resendotp,
  StudentLogin,
  StudentEmailOtpLoginVerify,
  GetStudentProfile,
  UpdateStudentProfile,
  ApplyForJob,
  GetAllAppiledJobsofaStudent,
  GetAllJobinterviewofaStudent,
  GetAllAppiledJobidsofaStudent,
  AddToBookmark,
  RemovefromBookmark,
  GetAllBookmarkjobsofaStudent,
  getallbookmark,
  Create_StudentTestResult,
  CreateStudentOtpforSignup,
  verifyotpforsignup,
  UpdateStudentSkillScore,
  ReScheduleInterview,
} = require("../Controllers/StudentController");
const upload = require("../Middleware/multer");
const {
  getAIResumeAll,
  getAIResumeById,
  createAIResume,
  updateAIResumeById,
  deleteAIResumeById,
} = require("../Controllers/AIResumeController");
const {
  getInvitedJobs,
  acceptInvite,
  rejectInvite,
} = require("../Controllers/JobInvitationController");
const {
  getAllInterviews,
  createInterview,
  updateInterview,
  deleteInterview,
} = require("../Controllers/AIMockInterviewController");

const StudentRouter = express.Router();

StudentRouter.post("/RegisterStudent", upload.fields([{ name: "resume" }]), RegisterStudent);
StudentRouter.post("/CreateStudentOtp/:channel", CreateStudentOtp);
StudentRouter.post(
  "/CreateStudentOtp/signup/:channel",
  CreateStudentOtpforSignup
);
StudentRouter.post("/verifyotp/signup", verifyotpforsignup);
StudentRouter.post("/verifyotp", verifyotp);
StudentRouter.post("/Resendotp", Resendotp);
StudentRouter.post("/StudentLogin", StudentLogin);
StudentRouter.post("/StudentEmailOtpLoginVerify", StudentEmailOtpLoginVerify);
StudentRouter.get("/GetStudentProfile", StudentverifyToken, GetStudentProfile);
StudentRouter.put(
  "/UpdateStudentProfile",
  StudentverifyToken,
  upload.fields([{ name: "image1" }, { name: "image2" }, { name: "image3" }, { name: "Resume" }]),
  UpdateStudentProfile
);
StudentRouter.put(
  "/UpdateStudentProfile/updateskillscore",
  StudentverifyToken,
  UpdateStudentSkillScore
);

StudentRouter.post(
  "/ApplyForJob",
  StudentverifyToken,
  upload.fields([{ name: "resumeFile" }]),
  ApplyForJob
);

StudentRouter.get(
  "/GetAllAppiledJobsofaStudent",
  StudentverifyToken,
  GetAllAppiledJobsofaStudent
);
StudentRouter.get(
  "/GetAllJobinterviewofaStudent",
  StudentverifyToken,
  GetAllJobinterviewofaStudent
);
StudentRouter.get(
  "/GetAllAppiledJobidsofaStudent",
  StudentverifyToken,
  GetAllAppiledJobidsofaStudent
);
StudentRouter.post("/AddToBookmark", StudentverifyToken, AddToBookmark);
StudentRouter.post(
  "/RemovefromBookmark",
  StudentverifyToken,
  RemovefromBookmark
);
StudentRouter.get(
  "/GetAllBookmarkjobsofaStudent",
  StudentverifyToken,
  GetAllBookmarkjobsofaStudent
);
StudentRouter.get("/getallbookmark", StudentverifyToken, getallbookmark);
StudentRouter.post(
  "/Create_StudentTestResult",
  StudentverifyToken,
  Create_StudentTestResult
);

// AI resume

StudentRouter.get("/ai-resume", StudentverifyToken, getAIResumeAll);
StudentRouter.get("/ai-resume/:id", StudentverifyToken, getAIResumeById);
StudentRouter.post("/ai-resume", StudentverifyToken, createAIResume);
StudentRouter.put("/ai-resume/:id", StudentverifyToken, updateAIResumeById);
StudentRouter.delete("/ai-resume/:id", StudentverifyToken, deleteAIResumeById);

// AI Mock Interview

StudentRouter.get("/ai-interview", StudentverifyToken, getAllInterviews);
StudentRouter.post("/ai-interview", StudentverifyToken, createInterview);
StudentRouter.put("/ai-interview/:id", StudentverifyToken, updateInterview);
StudentRouter.delete("/ai-interview/:id", StudentverifyToken, deleteInterview);

// invited jobs
StudentRouter.get("/invitedjobs/all", StudentverifyToken, getInvitedJobs);
StudentRouter.post("/invitedjobs/accept/:id", StudentverifyToken, acceptInvite);
StudentRouter.post("/invitedjobs/reject/:id", StudentverifyToken, rejectInvite);

// Reschedule interview
StudentRouter.post(
  "/interview/reschedule/:id",
  StudentverifyToken,
  ReScheduleInterview
);

module.exports = StudentRouter;
