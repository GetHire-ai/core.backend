const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  Name: { type: String, require: true, default: "" },
  Email: { type: String, require: true, unique: true, default: "" },
  Number: { type: String, require: true, unique: true, default: "" },
  otp: { type: String },
  Image: { type: String, require: true },
  Website: { type: String, require: true },
  Gender: { type: String, require: true },
  Languages_you_know: { type: [String], required: true },
  introductionVideo: { type: String, require: true },
  Address: { type: String, require: true },
  highestQualification: { type: String, require: true },
  locations: [{ type: String, require: true }],
  jobTitles: [{ type: String, require: true }],
  Education: [
    {
      Class: { type: String, require: true },
      CollegeName: { type: String, require: true },
      StartYear: { type: String, require: true },
      EndYear: { type: String, require: true },
      Degree: { type: String, require: true },
      Stream: { type: String, require: true },
      PerformanceScale: { type: String, require: true },
      Performance: { type: String, require: true },
    },
  ],
  JobDetails: [
    {
      Type: { type: String, require: true },
      Designation: { type: String, require: true },
      Profile: { type: String, require: true },
      Organization: { type: String, require: true },
      Location: { type: String, require: true },
      WorkFromHome: { type: Boolean, require: true },
      NoticePeriod: { type: String, require: true },
      Start_date: { type: String, require: true },
      End_date: { type: String, require: true },
      Currentlyworking: { type: Boolean, require: true },
      Description: { type: String, require: true },
    },
  ],
  position_of_responsibility: { type: String, require: true },
  Training_details: [
    {
      Training_program: { type: String, require: true },
      Certification: { type: Boolean, require: true },
      Organization: { type: String, require: true },
      Online: { type: Boolean, require: true },
      Location: { type: String, require: true },
      Start_date: { type: String, require: true },
      End_date: { type: String, require: true },
      CurrentlyOngoing: { type: Boolean, require: true },
      Description: { type: String, require: true },
    },
  ],
  Projects: [
    {
      Title: { type: String, require: true },
      Start_date: { type: String, require: true },
      End_date: { type: String, require: true },
      CurrentlyOngoing: { type: Boolean, require: true },
      Description: { type: String, require: true },
      Project_link: { type: String, require: true },
    },
  ],
  Skill_Set: [
    {
      Skill: { type: String, required: true },
      Rate: { type: String, required: true, default: "Beginner" },
      score: { type: Number, required: true, default: 0 },
    },
  ],
  Work_Samples: [
    {
      Blog_link: { type: String, required: true },
      GitHub_profile: { type: String, required: true },
      Playstoredeveloperpubliclink: { type: String, required: true },
      Behance_portfolio_link: { type: String, required: true },
      Other_work_sample_link: { type: String, required: true },
    },
  ],
  Additional_Info: { type: String, require: true },
  Expected_Salary: { type: String, require: true },
  Current_Salary: { type: String, require: true },
  Experience: { type: String, require: true },
  exprienceIn: { type: String, require: true },
  Joining_Date: { type: String, require: true },
  Resume: { type: String, require: true },
});

const StudentModel = mongoose.model("Student", StudentSchema);
module.exports = StudentModel;
