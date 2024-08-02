const express = require("express");
const { StudentverifyToken } = require('../Middleware/VerifyToken')
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
    Create_StudentTestResult
} = require("../Controllers/StudentController")
const upload = require("../Middleware/multer");

const StudentRouter = express.Router();


StudentRouter.post('/RegisterStudent', RegisterStudent);
StudentRouter.post('/CreateStudentOtp/:channel', CreateStudentOtp);
StudentRouter.post('/verifyotp', verifyotp);
StudentRouter.post('/Resendotp', Resendotp);
StudentRouter.post('/StudentLogin', StudentLogin);
StudentRouter.post('/StudentEmailOtpLoginVerify', StudentEmailOtpLoginVerify);
StudentRouter.get('/GetStudentProfile', StudentverifyToken,GetStudentProfile);
StudentRouter.put('/UpdateStudentProfile', StudentverifyToken, upload.fields([
    { name: "image1" },
    { name: "image2" },
    { name: "image3" }
]), UpdateStudentProfile);

StudentRouter.post('/ApplyForJob', StudentverifyToken, upload.fields([
    { name: "image1" },
]), ApplyForJob)

StudentRouter.get('/GetAllAppiledJobsofaStudent', StudentverifyToken, GetAllAppiledJobsofaStudent)
StudentRouter.get('/GetAllJobinterviewofaStudent', StudentverifyToken, GetAllJobinterviewofaStudent)
StudentRouter.get('/GetAllAppiledJobidsofaStudent', StudentverifyToken, GetAllAppiledJobidsofaStudent)
StudentRouter.post('/AddToBookmark', StudentverifyToken, AddToBookmark)
StudentRouter.post('/RemovefromBookmark', StudentverifyToken, RemovefromBookmark)
StudentRouter.get('/GetAllBookmarkjobsofaStudent', StudentverifyToken, GetAllBookmarkjobsofaStudent)
StudentRouter.get('/getallbookmark', StudentverifyToken, getallbookmark)
StudentRouter.post('/Create_StudentTestResult', StudentverifyToken, Create_StudentTestResult)

module.exports = StudentRouter;