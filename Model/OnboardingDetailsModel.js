const mongoose = require("mongoose");

const OnboardingDetailsSchema = new mongoose.Schema({
  CompanyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  StudentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  JobId: { type: mongoose.Schema.Types.ObjectId, ref: "Jobs" },
  fullName: { type: String },
  contactInformation: { type: String },
  residentialAddress: { type: String },
  jobTitle: { type: String },
  department: { type: String },
  startDate: { type: Date },
  employmentContract: { type: String },
  nda: { type: String },
  taxForms: { type: String },
  panCard: { type: String },
  aadharCard: { type: String },
  salarySlip: { type: String },
  bankStatement: { type: String },
  accessITSetup: {
    emailAccount: { type: String },
    softwareAccess: { type: [String] },
  },
  orientationSchedule: { type: String },
  roleSpecificTraining: { type: String },
  teamIntroduction: { type: String },
  reportingStructure: { type: String },
  employeeHandbook: { type: String },
  offerLetterTemplate: {
    type: String,
    enum: [
      "Standard Offer Letter",
      "Executive Offer Letter",
      "Internship Offer Letter",
      "Contractual Offer Letter",
    ],
  },
  finalChecklist: { type: String },
  confirmation: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const OnboardingDetailsModel = mongoose.model(
  "OnboardingDetails",
  OnboardingDetailsSchema
);

module.exports = OnboardingDetailsModel;
