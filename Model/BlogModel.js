const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema(
  {
    text: { type: String },
    image: { type: String },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
    comments: [
      {
        comment: { type: String },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
      },
    ],
  },
  { timestamps: true }
);

const BlogModel = mongoose.model("Blog", BlogSchema);

module.exports = BlogModel;
