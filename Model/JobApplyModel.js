const mongoose = require("mongoose");

const JobApplySchema = new mongoose.Schema(
  {
    CompanyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
    JobId: { type: mongoose.Schema.Types.ObjectId, ref: "Jobs" },
    StudentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    resumeFile: { type: String },
    Resume: { type: mongoose.Schema.Types.ObjectId, ref: "AIResume" },
    isinterviewScheduled: { type: Boolean, default: false },
    isInterviewcompleted: { type: Boolean, default: false },
    IsSelectedforjob: { type: Boolean, default: false },
    isshortlisted: { type: Boolean, default: false },
    isrejected: { type: Boolean, default: false },
    Application_stage: { type: String, required: true, default: "Round One" },
    interviewSchedule: {
      canditateAccepted: { type: Boolean },
      hrAccepted: { type: Boolean },
      type: { type: String },
      date: { type: String },
      Time: { type: String },
      location: { type: String },
      notes: { type: String },
      meetLink: { type: String },
    },
    status: {
      type: String,
      enum: ["pending", "shortlisted", "selected", "rejected"],
      default: "pending",
    },
    assessment: [
      {
        Round: { type: String, required: true },
        score: { type: String, required: true },
        scorePercentage: { type: Number, required: true },
        Date: { type: Date, default: Date.now },
        completedstatus: { type: Boolean, default: false },
        Notes: { type: String, required: true },
      },
    ],
    onboardingDocuments: [{ name: { type: String }, url: { type: String } }],
    onboardingDocumentsAvailable: { type: Boolean, default: false },

    appliedAt: { type: Date, default: Date.now },
    shortlistedAt: { type: Date },
    selectedAt: { type: Date },
    rejectedAt: { type: Date },
  },
  { timestamps: true }
);

JobApplySchema.pre("save", function (next) {
  if (this.isshortlisted && !this.shortlistedAt) {
    this.shortlistedAt = Date.now();
  }
  if (this.IsSelectedforjob && !this.selectedAt) {
    this.selectedAt = Date.now();
  }
  if (this.isrejected && !this.rejectedAt) {
    this.rejectedAt = Date.now();
  }
  next();
});

const JobApplyModel = mongoose.model("JobApply", JobApplySchema);
module.exports = JobApplyModel;
