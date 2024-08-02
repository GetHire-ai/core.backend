const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  Company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  companyName: { type: String },
  // Common
  type: { type: String },
  positionName: { type: String },
  skillsRequired: { type: [String] },
  shift: { type: String },
  location: { type: String },
  openings: { type: Number },
  numOfDays: { type: Number },
  currency: { type: String },
  perks: { type: [String] },
  responsibilities: { type: String },
  videoQuestions: { type: [String] },
  mcqQuestions: [],
  JobActive: { type: Boolean, default: false },
  rounds: [
    {
      Round: { type: Number },
      Assessment: { type: String },
    },
  ],
  // Internship
  internshipType: { type: String },
  internshipStart: { type: String },
  internshipDuration: { type: Number },
  internshipDurationFrequency: { type: String },
  stipendType: { type: String },
  stipend: { type: Number },
  ppo: { type: Boolean },
  // Job
  jobType: { type: String },
  minExp: { type: Number },
  maxExp: { type: Number },
  maxSalary: { type: Number, default: null },
  minSalary: { type: Number, default: null },
  jobFrequency: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const JobModel = mongoose.model("Jobs", JobSchema);
module.exports = JobModel;
