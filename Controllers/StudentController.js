const asynchandler = require("express-async-handler");
const response = require("../Middleware/responseMiddlewares");
const StudentModel = require("../Model/StudentModel");
const jwt = require("jsonwebtoken");
const { UserDetail } = require("otpless-node-js-auth-sdk");
const clientId = process.env.AUTH_CLIENT_ID || "";
const clientSecret = process.env.AUTH_CLIENT_SECRET || "";
const cloudinary = require("../Middleware/Cloudinary");
const nodemailer = require("nodemailer");
const JobModel = require("../Model/JobModel");
const JobApplyModel = require("../Model/JobApplyModel");
const BookmarkModel = require("../Model/BookmarkModel");
const TestModel = require("../Model/TestModel");
const AITestModel = require("../Model/AITestResult");
const StudentTestResultModel = require("../Model/TestResultofaStudent");
const NotificationCompanyModel = require("../Model/NotificationComModel");
const Notification = require("../Model/NotificationModel");
const CompanyModel = require("../Model/CompanyModel");
const { sendWhatsapp } = require("../Utils/whatsApp");
const { sendMail } = require("../Utils/sendMail");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.Useremail,
    pass: process.env.GmailPass,
  },
});

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

//============================[Register Student  ]===========================//

const RegisterStudent = asynchandler(async (req, res, next) => {
  try {
    const {
      Name,
      Email,
      Number,
      Current_Salary,
      Degree,
      Expected_Salary,
      Experience,
      exprienceIn,
      highestQualification,
      jobTitles,
      locations,
      skills,
      values,
      youare,
    } = req.body;

    if (!Name) {
      return response.validationError(res, "Name is required");
    }
    if (!Email) {
      return response.validationError(res, "Email is required");
    }
    // if (!Number) {
    //   return response.validationError(res, "Number is required");
    // }

    const email = await StudentModel.findOne({ Email: Email });
    if (email) {
      return response.validationError(res, "Email alredy Exist ");
    }
    const number = await StudentModel.findOne({ Number: Number });
    if (number) {
      return response.validationError(res, "Number alredy Exist ");
    }
    const otp = generateOTP();

    let url;

    if (req.files && req.files.image1 && req.files.image1[0]) {
      const uploadedFile = await cloudinary.uploader.upload(
        req.files.image1[0].path,
        {
          folder: "GetHire",
        }
      );
      if (uploadedFile) {
        url = uploadedFile.secure_url;
      }
    }
    let Education = [{ Degree }];
    Student = new StudentModel({
      Name,
      Email,
      Number: `+91${Number}`,
      otp,
      Current_Salary,
      Education,
      Expected_Salary,
      Experience,
      Name,
      Resume: url,
      exprienceIn,
      highestQualification,
      jobTitles,
      locations,
      Skill_Set: skills,
      values,
      youare,
      otp,
    });

    await Student.save();

    const token = jwt.sign({ StudentId: Student._id }, "Student");

    return response.successResponse(
      res,
      { Student: Student, token: token },
      "Student Register Successful"
    );
  } catch (error) {
    console.log(error);
    return response.internalServerError(res, "Internal server error");
  }
});

//========================[Student Login api ]===========================

const CreateStudentOtp = asynchandler(async (req, res) => {
  try {
    const channel = req.params.channel;
    const { Number, Email, orderId, hash, expiry, otpLength } = req.body;
    if (!Number && !Email) {
      return res.status(400).send({
        success: false,
        error: "Either mobile or email is required",
      });
    }
    if (!channel) {
      return res.status(400).send({
        success: false,
        error: "Channel is required",
      });
    }
    let Student = await StudentModel.findOne({ Number: Number });
    if (!Student) {
      return res.status(400).send({
        status: false,
        message: "No Account Exist with this Number Please Sign up First",
      });
    }
    try {
      const response = await UserDetail.sendOTP(
        Number,
        Email,
        channel,
        hash,
        orderId,
        expiry,
        otpLength,
        clientId,
        clientSecret
      );
      console.log("Success", response);
      if (response?.errorMessage) {
        return res.status(500).send(response);
      }
      res.status(200).send({
        success: true,
        data: response,
      });
    } catch (error) {
      console.log("Error", error);
      res.status(500).send({
        success: false,
        error: error,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error: error,
    });
  }
});

const CreateStudentOtpforSignup = asynchandler(async (req, res) => {
  try {
    const channel = req.params.channel;
    const { Number, Email, orderId, hash, expiry, otpLength } = req.body;
    if (!Number && !Email) {
      return res.status(400).send({
        success: false,
        error: "Either mobile or email is required",
      });
    }
    if (!channel) {
      return res.status(400).send({
        success: false,
        error: "Channel is required",
      });
    }
    let Student;
    if (Number) {
      Student = await StudentModel.findOne({ Number: Number });
    } else if (Email) {
      Student = await StudentModel.findOne({ Email: Email });
    }
    if (Student) {
      return res.status(400).send({
        status: false,
        message: "Account Exist with this Credentials Please Login",
      });
    }
    try {
      const response = await UserDetail.sendOTP(
        Number,
        Email,
        channel,
        hash,
        orderId,
        expiry,
        otpLength,
        clientId,
        clientSecret
      );
      console.log("Success", response);
      if (response?.errorMessage) {
        return res.status(500).send(response);
      }
      res.status(200).send({
        success: true,
        data: response,
      });
    } catch (error) {
      console.log("Error", error);
      res.status(500).send({
        success: false,
        error: error,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error: error,
    });
  }
});

const verifyotpforsignup = asynchandler(async (req, res) => {
  const { orderId, otp, Number, Email } = req.body;

  if (!orderId || !otp) {
    return res.status(400).send({
      success: false,
      error: "Invalid request - orderId and otp are required",
    });
  }
  if (!Number && !Email) {
    return res.status(400).send({
      success: false,
      error: "Invalid request - mobile or email is required",
    });
  }

  try {
    const response = await UserDetail.verifyOTP(
      Email,
      Number,
      orderId,
      otp,
      clientId,
      clientSecret
    );

    if (response?.errorMessage) {
      return res.status(500).send(response);
    }
    if (response?.isOTPVerified == false) {
      return res.status(500).send(response);
    }
    return res.status(200).send({
      status: true,
      message: "OTP Verified",
    });
  } catch (err) {
    console.log("Error", err);
    res.status(500).send({
      success: false,
      error: err.message,
    });
  }
});

//==============================[Verify otp api]==========================//

const verifyotp = asynchandler(async (req, res) => {
  const { orderId, otp, Number, Email } = req.body;

  if (!orderId || !otp) {
    return res.status(400).send({
      success: false,
      error: "Invalid request - orderId and otp are required",
    });
  }
  if (!Number && !Email) {
    return res.status(400).send({
      success: false,
      error: "Invalid request - mobile or email is required",
    });
  }
  let Student = await StudentModel.findOne({ Number: Number });
  if (!Student) {
    return res.status(400).send({
      status: false,
      message: "No Account Exists with this Number. Please Sign up First",
    });
  }

  try {
    const response = await UserDetail.verifyOTP(
      Email,
      Number,
      orderId,
      otp,
      clientId,
      clientSecret
    );

    if (response?.errorMessage) {
      return res.status(500).send(response);
    }
    if (response?.isOTPVerified == false) {
      return res.status(500).send(response);
    }

    const token = jwt.sign(
      {
        StudentId: Student._id,
      },
      "Student"
    );

    return res.status(200).send({
      status: true,
      message: "Complny login successfull",
      data: Student,
      token: token,
      ...response,
    });
  } catch (err) {
    console.log("Error", err);
    res.status(500).send({
      success: false,
      error: err.message,
    });
  }
});

//========================[Resend Otp]===============================

const Resendotp = asynchandler(async (req, res) => {
  const { orderId } = req.body;
  if (!orderId) {
    return res.status(400).send({
      success: false,
      error: "Order ID is required",
    });
  }
  try {
    const response = await UserDetail.resendOTP(
      orderId,
      clientId,
      clientSecret
    );
    console.log("Success", response);
    if (response?.errorMessage) {
      return res.status(500).send(response);
    }
    res.status(200).send({ success: true, ...response });
  } catch (error) {
    console.log("Error", error);
    res.status(500).send({
      success: false,
      error: error,
    });
  }
});

// =============================[Send Otp To Email ] ==========================

const StudentLogin = asynchandler(async (req, res) => {
  try {
    let data = req.body;
    let { Email } = data;

    let Student = await StudentModel.findOne({ Email: Email });

    if (!Student) {
      return res.status(400).send({
        status: false,
        message: "Email  is Invalid",
      });
    }

    const otp = generateOTP();

    await StudentModel.findOneAndUpdate({ Email }, { otp: otp });

    const mailOptions = {
      to: Email,
      subject: "OTP Verification",
      text: `Your OTP for account verification is: ${otp}`,
    };

    transporter.sendMail(mailOptions, async function (error, info) {
      if (error) {
        console.log(error);
        return response.internalServerError(res, "Error sending OTP");
      } else {
        return res.status(200).send({
          status: true,
          message: "OTP sent to email, please verify.",
        });
      }
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message,
    });
  }
});

// ================================[Verify Mail OTP LOgin]=============================

const StudentEmailOtpLoginVerify = asynchandler(async (req, res) => {
  try {
    const { Email, otp } = req.body;

    let Student = await StudentModel.findOne({ Email: Email });

    if (!Student) {
      return response.notFoundError(res, "Student not found");
    }

    if (Student.otp !== otp) {
      return response.errorResponse(res, "Invalid OTP", 404);
    }

    await StudentModel.findOneAndUpdate({ Email }, { isActive: true, otp: "" });

    const token = jwt.sign({ StudentId: Student._id }, "Student");

    return res.json({ Student, token, message: "Verify successfully" });
  } catch (error) {
    console.log(error);
    return response.internalServerError(res, "Internal server error");
  }
});

//=====================================[Get Student Detail] ===========================

const GetStudentProfile = asynchandler(async (req, res) => {
  try {
    const Studentid = req.StudentId;
    const GetStudent = await StudentModel.findById(Studentid).populate(
      "aiResumes"
    );
    if (!GetStudent) {
      return Response.notFoundError(res, "Student Not Found");
    }

    return response.successResponse(
      res,
      GetStudent,
      "Get Student successfully"
    );
  } catch (error) {
    console.log(error);
    return response.internalServerError(res, "Internal server error");
  }
});

//====================================[Update Student Profile]=======================

const UpdateStudentProfile = asynchandler(async (req, res) => {
  try {
    const Studentid = req.StudentId;
    const {
      Email,
      Number,
      Name,
      Website,
      Gender,
      languages,
      introductionVideo,
      highestQualification,
      Education,
      JobDetails,
      position_of_responsibility,
      Training_details,
      Projects,
      Skill_Set,
      Work_Samples,
      Expected_Salary,
      Current_Salary,
      Experience,
      Joining_Date,
      Additional_Info,
      Address,
      summary,
      gender,
      dob,
      jobTitles,
      locations,
    } = req.body;
    const GetStudent = await StudentModel.findById(Studentid);
    if (!GetStudent) {
      return Response.notFoundError(res, "Student Not Found");
    }
    let uploadImg1;

    if (req.files && req.files.image1 && req.files.image1[0]) {
      const uploadedFile = await cloudinary.uploader.upload(
        req.files.image1[0].path,
        {
          folder: "GetHire",
        }
      );
      if (uploadedFile) {
        uploadImg1 = uploadedFile.secure_url;
      }
    }

    let uploadImg2;

    if (req.files && req.files.image2 && req.files.image2[0]) {
      const uploadedFile = await cloudinary.uploader.upload(
        req.files.image2[0].path,
        {
          folder: "GetHire",
        }
      );
      if (uploadedFile) {
        uploadImg2 = uploadedFile.secure_url;
      }
    }
    let uploadvideo;

    if (req.files && req.files.image3 && req.files.image3[0]) {
      const uploadedFile = await cloudinary.uploader.upload(
        req.files.image3[0].path,
        {
          resource_type: "video",
          folder: "GetHire",
        }
      );
      if (uploadedFile) {
        uploadvideo = uploadedFile.secure_url;
      }
    }

    let Resume;

    if (req.files && req.files.Resume && req.files.Resume[0]) {
      try {
        const uploadedFile = await cloudinary.uploader.upload(
          req.files.Resume[0].path,
          {
            resource_type: "raw",
            format: "pdf", // Add the correct format
            folder: "GetHire", // Optional: Folder in Cloudinary where the file will be stored
          }
        );

        if (uploadedFile) {
          const Resume = uploadedFile.secure_url; // Get the secure URL of the uploaded PDF
          console.log("PDF URL:", Resume); // Log the URL to the console
          // You can also return or save this URL as needed
        }
      } catch (error) {
        console.error("Upload error:", error);
      }
    }

    const fields = {
      Email,
      Number,
      Name,
      dob,
      locations,
      jobTitles,
      gender,
      summary,
      uploadImg1,
      uploadImg2,
      Website,
      Gender,
      languages,
      uploadvideo,
      highestQualification,
      Education,
      JobDetails,
      position_of_responsibility,
      Training_details,
      Projects,
      Skill_Set,
      Work_Samples,
      Expected_Salary,
      Current_Salary,
      Experience,
      Joining_Date,
      Additional_Info,
      Address,
      Resume,
    };
    for (const [key, value] of Object.entries(fields)) {
      if (value) {
        GetStudent[key] = value;
      }
    }

    const UpdatedStudent = await GetStudent.save();
    return response.successResponse(
      res,
      UpdatedStudent,
      "Student updated successfully"
    );
  } catch (error) {
    console.log(error);
    return response.internalServerError(res, "Internal server error");
  }
});

const UpdateStudentSkillScore = asynchandler(async (req, res) => {
  try {
    const studentId = req.StudentId;
    const skillToUpdate = req.body;
    const student = await StudentModel.findById(studentId);

    if (!student) {
      return response.notFoundError(res, "Student Not Found");
    }
    if (!Array.isArray(student?.Skill_Set)) {
      return response.badRequest(res, "Skill_Set is not an array");
    }
    const skillIndex = student.Skill_Set.findIndex(
      (skill) => skill?._id?.toString() === skillToUpdate?._id?.toString()
    );
    if (skillIndex !== -1) {
      student.Skill_Set[skillIndex].score = skillToUpdate.score || 0;
    } else {
      student.Skill_Set.push(skillToUpdate);
    }
    const updatedStudent = await student.save();
    return response.successResponse(
      res,
      updatedStudent,
      "Student updated successfully"
    );
  } catch (error) {
    console.log(error);
    return response.internalServerError(res, "Internal server error");
  }
});

//============================[ReSchedule Interview ]==============================

const ReScheduleInterview = asynchandler(async (req, res) => {
  try {
    const { StudentId, date, Time } = req.body;
    const jobApplication = await JobApplyModel.findById(req.params.id)
      .populate("CompanyId")
      .populate("JobId");

    if (!jobApplication) {
      return response.notFoundError(res, "Job Application not found");
    }

    // const event = {
    //   summary: Interview for ${jobApplication?.JobId?.positionName} is reshcheduled,
    //   description: Interview scheduled by ${jobApplication?.CompanyId?.name} is reshcheduled,
    //   start: {
    //     dateTime: moment(interviewSchedule).format(),
    //     timeZone: "UTC",
    //   },
    //   end: {
    //     dateTime: moment(interviewSchedule).add(1, "hour").format(),
    //     timeZone: "UTC",
    //   },
    //   conferenceData: {
    //     createRequest: {
    //       requestId: meet-${jobApplication._id},
    //       conferenceSolutionKey: {
    //         type: "hangoutsMeet",
    //       },
    //     },
    //   },
    // };
    // const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    // // console.log(calendar);
    // const meeting = await calendar.events.insert({
    //   calendarId: "primary",
    //   resource: event,
    //   conferenceDataVersion: 1,
    // });
    // const meetLink = meeting.data.hangoutLink;
    // console.log(meetLink);

    // jobApplication.interviewSchedule = {
    //   ...jobApplication.interviewSchedule,
    //   date, Time
    // meetLink: meetLink,
    // };

    // Notifications
    await Notification.create({
      CompanyId: StudentId,
      StudentId: jobApplication?.StudentId?._id,
      JobId: jobApplication?.JobId?._id,
      text: `Your interview for ${jobApplication?.JobId?.positionName} has been rescheduled.`,
    });

    await NotificationCompanyModel.create({
      CompanyId: jobApplication?.CompanyId?._id,
      StudentId,
      JobId: jobApplication?.JobId?._id,
      text: `The interview for ${jobApplication?.JobId?.positionName} has been rescheduled by the candidate.`,
    });

    const findStudent = await StudentModel.findById(
      jobApplication?.StudentId?._id
    );

    // Update interview schedule
    jobApplication.interviewSchedule = {
      ...jobApplication.interviewSchedule, // Keep existing properties
      date,
      Time,
      hrAccepted: false,
      canditateAccepted: true,
    };
    jobApplication.isinterviewScheduled = true;
    await jobApplication.save();
    // Send notifications
    sendWhatsapp(
      findStudent.Number,
      `Your interview for ${jobApplication?.JobId?.positionName} has been rescheduled.`
    );
    sendMail(
      findStudent?.Email,
      "Interview Rescheduled",
      `Your interview for ${jobApplication?.JobId?.positionName} has been rescheduled.`
    );
    sendMail(
      jobApplication?.CompanyId?.Email,
      "Interview Rescheduled",
      `The interview for ${jobApplication?.JobId?.positionName} has been rescheduled by the candidate.`
    );

    return response.successResponse(
      res,
      jobApplication,
      "Interview rescheduled successfully"
    );
  } catch (error) {
    console.error("Error:", error);
    return response.internalServerError(res, "Internal server error");
  }
});

//============================[ApplyForJob ]==============================

const ApplyForJob = asynchandler(async (req, res) => {
  try {
    const Studentid = req.StudentId;
    const { JobId, CompanyId, Resume, relocate } = req.body;
    const existingApplication = await JobApplyModel.findOne({
      StudentId: Studentid,
      JobId,
    });
    if (existingApplication) {
      return response.validationError(
        res,
        "You have already applied for this job."
      );
    }
    let rusumeURL;
    if (req.files && req.files.resumeFile && req.files.resumeFile[0]) {
      const uploadedFile = await cloudinary.uploader.upload(
        req.files.resumeFile[0].path,
        {
          folder: "GetHire",
        }
      );
      if (uploadedFile) {
        rusumeURL = uploadedFile.secure_url;
      }
    }
    Job = new JobApplyModel({
      StudentId: Studentid,
      JobId,
      CompanyId,
      Resume: Resume ? Resume : null,
      relocate,
      resumeFile: rusumeURL,
    });
    let findJob = await JobModel.findById(JobId);
    let findCompany = await CompanyModel.findById(CompanyId);
    let notification = await NotificationCompanyModel.create({
      CompanyId: CompanyId,
      StudentId: Studentid,
      JobId: JobId,
      text: `A new Student apply in your posted job for ${findJob?.positionName}.`,
    });
    sendMail(
      findCompany?.Email,
      `A new Student apply in your posted job for ${findJob?.positionName}.`,
      `A new Student apply in your posted job for ${findJob?.positionName}.`
    );
    sendWhatsapp(
      findCompany.Number,
      `1 student apply for your posted job ${findJob?.positionName}`
    );
    const savedjob = await Job.save();
    if (!savedjob) {
      return response.validationError(res, "Not Applied for job");
    }
    return response.successResponse(res, savedjob, "Job Applied completed.");
  } catch (error) {
    console.log(error);
    return response.internalServerError(res, "Internal server error");
  }
});

//=================================[Get all Appied jobs of a user]======================

const GetAllAppiledJobsofaStudent = asynchandler(async (req, res) => {
  try {
    const Studentid = req.StudentId;

    const appliedJobs = await JobApplyModel.find({ StudentId: Studentid })
      .populate("CompanyId")
      .populate("JobId");

    if (!appliedJobs || appliedJobs.length === 0) {
      return response.successResponse(res, [], "No applied jobs found for this student.");
    }

    // Create an array of promises to get the test results
    const appliedJobsWithTests = await Promise.all(
      appliedJobs.map(async (element) => {
        const tests = await AITestModel.findOne({ job: element.JobId._id, student: Studentid });

        return {
          ...element.toObject(),
          videoInterview: !!tests,  // Set to true if tests exist, false otherwise
          videoInterviewDate: tests ? tests.createdAt : null  // Set date if tests exist, otherwise null
        };
      })
    );

    return response.successResponse(res, appliedJobsWithTests, "Applied jobs of student");
  } catch (error) {
    console.error(error);
    return response.internalServerError(res, "Internal server error");
  }
});



//=================================[Get all Appied jobs interview of a user]======================
const GetAllJobinterviewofaStudent = async (req, res) => {
  try {
    const Studentid = req.StudentId;

    const appliedJobs = await JobApplyModel.find({
      StudentId: Studentid,
      isinterviewScheduled: true,
    })
      .populate("CompanyId")
      .populate("JobId");

    return response.successResponse(
      res,
      appliedJobs,
      "Retrieved applied jobs with scheduled interviews successfully."
    );
  } catch (error) {
    console.error(error);
    return response.internalServerError(res, "Internal server error");
  }
};
//======================================[Get Appiled job Ids api ]======================

const GetAllAppiledJobidsofaStudent = asynchandler(async (req, res) => {
  try {
    const StudentId = req.StudentId;

    const appliedJobs = await JobApplyModel.find({ StudentId })
      .populate("CompanyId")
      .populate("JobId");

    if (!appliedJobs || appliedJobs.length === 0) {
      return response.successResponse(
        res,
        [],
        "No applied jobs found for this student."
      );
    }
    const appliedJobIds = appliedJobs.map((job) => job.JobId?._id);
    return response.successResponse(
      res,
      { appliedJobIds },
      "Retrieved applied job IDs successfully."
    );
  } catch (error) {
    // console.log(error);
    return response.internalServerError(res, "Internal server error");
  }
});

//========================================[AddToBookmark] ===============================

const AddToBookmark = asynchandler(async (req, res) => {
  try {
    const Studentid = req.StudentId;
    const { jobId } = req.body;

    const existingBookmark = await BookmarkModel.findOne({
      StudentId: Studentid,
    });

    if (existingBookmark) {
      const isAlreadyBookmarked = existingBookmark.bookmarkedJobs.some(
        (item) => item.jobId.toString() === jobId.toString()
      );

      if (isAlreadyBookmarked) {
        return response.validationError(res, "Job is already bookmarked.");
      }

      existingBookmark.bookmarkedJobs.push({ jobId });
      await existingBookmark.save();

      return response.successResponse(
        res,
        existingBookmark,
        "Job added to bookmarks successfully."
      );
    }

    const newBookmark = new BookmarkModel({
      StudentId: Studentid,
      bookmarkedJobs: [{ jobId }],
    });
    await newBookmark.save();

    return response.successResponse(
      res,
      newBookmark,
      "Job added to bookmarks successfully."
    );
  } catch (error) {
    console.error(error);
    return response.internalServerError(res, "Internal server error");
  }
});

//==========================================[RemoveToBookmark]===========================

const RemovefromBookmark = asynchandler(async (req, res) => {
  try {
    const Studentid = req.StudentId;
    const { jobId } = req.body;

    const userBookmark = await BookmarkModel.findOne({ StudentId: Studentid });

    if (!userBookmark) {
      return response.validationError(res, "No bookmarks found for the user.");
    }

    const indexToRemove = userBookmark.bookmarkedJobs.findIndex(
      (item) => item.jobId.toString() === jobId.toString()
    );

    if (indexToRemove === -1) {
      return response.validationError(
        res,
        "Job is not bookmarked by the user."
      );
    }

    userBookmark.bookmarkedJobs.splice(indexToRemove, 1);
    await userBookmark.save();

    return response.successResponse(
      res,
      userBookmark,
      "Job removed from bookmarks successfully."
    );
  } catch (error) {
    console.error(error);
    return response.internalServerError(res, "Internal server error");
  }
});

//=======================================[Get all bookmarked job array of a stundent]=====================

const getallbookmark = asynchandler(async (req, res) => {
  try {
    const StudentId = req.StudentId;
    const userBookmark = await BookmarkModel.findOne({ StudentId });

    if (!userBookmark) {
      return response.successResponse(
        res,
        { bookmarkedJobs: [] },
        "No bookmarks found for the user."
      );
    }

    const bookmarkedJobIds = userBookmark.bookmarkedJobs.map(
      (job) => job.jobId
    );

    return response.successResponse(
      res,
      { bookmarkedJobs: bookmarkedJobIds },
      "Get all bookmark jobs successfully."
    );
  } catch (error) {
    console.error(error);
    return response.internalServerError(res, "Internal server error");
  }
});

//========================================[Get All Bookmark Jobs of a Student]=================

const GetAllBookmarkjobsofaStudent = asynchandler(async (req, res) => {
  try {
    const Studentid = req.StudentId;

    const userBookmark = await BookmarkModel.findOne({ StudentId: Studentid })
      .populate("bookmarkedJobs.jobId")
      .populate({
        path: "bookmarkedJobs.jobId",
        populate: {
          path: "Company",
          model: "Company",
        },
      });

    if (!userBookmark) {
      return response.validationError(res, "No bookmarks found for the user.");
    }

    return response.successResponse(
      res,
      userBookmark,
      "Get all bookmark jobs successfully."
    );
  } catch (error) {
    console.error(error);
    return response.internalServerError(res, "Internal server error");
  }
});

// ==============================[Test answer api]=======================

const Create_StudentTestResult = asynchandler(async (req, res) => {
  try {
    const studentId = req.StudentId;
    const { testId, answers } = req.body;
    console.log(req.body);
    const test = await TestModel.findById(testId);

    if (!test) {
      return response.notFoundError(res, "Test not found");
    }

    let score = 0;

    const processedAnswers = answers.map((answer) => {
      const question = test.questions.id(answer.questionId);
      const isCorrect = question.correctAnswer === answer.answer;
      if (isCorrect) score += 1;
      return {
        questionId: answer.questionId,
        answer: answer.answer,
        isCorrect: isCorrect,
      };
    });

    const studentTestResult = new StudentTestResultModel({
      student: studentId,
      test: testId,
      answers: processedAnswers,
      score: score,
      scorePercentage: score,
    });

    await studentTestResult.save();

    return response.successResponse(
      res,
      studentTestResult,
      "Student test result created successfully"
    );
  } catch (error) {
    console.log(error);
    return response.internalServerError(res, "Internal Server error");
  }
});

module.exports = {
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
};
