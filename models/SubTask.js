const mongoose = require("mongoose");

const SubTaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a task title"],
      maxLength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide task description"],
      maxLength: [1000, "Description cannot be more than 1000 characters"],
    },
    status: {
      type: String,
      enum: ["to-do", "in-progress", "done"],
      default: "to-do",
    },
    member: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide member to do task"],
    },
    project: {
      type: mongoose.Types.ObjectId,
      ref: "Project",
      required: [true, "Please provide project"],
    },
    startDate: {
      type: Date,
    },
    endDate: { type: Date },
    duration: { type: Number },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SubTask", SubTaskSchema);
