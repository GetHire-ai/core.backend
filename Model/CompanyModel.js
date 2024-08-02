const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema({
  Email: { type: String, require: true, unique: true, default: "" },
  Number: { type: String, require: true, unique: true, default: "" },
  Name: { type: String, require: true, default: "" },
  otp: { type: String },
  Image: { type: String, require: true },
  BackgroundImage: { type: String, require: true },
  Title: { type: String, require: true },
  Discription: { type: String, require: true },
  Type: { type: String, require: true },
  Location: [{ type: String, require: true }],
  TotalEmployees: { type: String, require: true },
  Onsite: { type: String, require: true },
  ActiveJobs: { type: String, require: true },
  Websitelink: { type: String, require: true },
  Facebooklink: { type: String, require: true },
  Instagramlink: { type: String, require: true },
  About: { type: String, require: true },
  Industry: { type: String, require: true },
  savedCandidates: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  Team: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  ],
  createdAt: { type: Date, default: Date.now },
});

const CompanyModel = mongoose.model("Company", CompanySchema);
module.exports = CompanyModel;
