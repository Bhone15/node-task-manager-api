const mongoose = require("mongoose");

const TaskSchema = mongoose.Schema(
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
      enum: ["to-do", "done"],
      default: "to-do",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);
