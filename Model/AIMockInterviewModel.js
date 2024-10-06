const mongoose = require("mongoose");

const AIMockInterviewSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    jobTitle: { type: String, required: true },
    experience: { type: Number, required: true, default: 0 },
    skills: [{ type: String }],
    desc: { type: String },
    questions: [
      {
        ques: { type: String },
        aiAns: { type: String },
        userAns: { type: String },
      },
    ],
    aiFeedback: { type: String },
    aiSuggestion: { type: String },
  },
  { strict: false }
);

const AIMockInterviewModel = mongoose.model(
  "AIMockInterview",
  AIMockInterviewSchema
);
module.exports = AIMockInterviewModel;
