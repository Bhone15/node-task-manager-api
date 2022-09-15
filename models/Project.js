const mongoose = require("mongoose");

const ProjectSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a project name"],
      maxLength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide project description"],
      maxLength: [1000, "Description cannot be more than 1000 characters"],
    },
    startDate: {
      type: Date,
      required: [true, "Please provide the start date"],
    },
    endDate: { type: Date, required: [true, "Please provide the end date"] },
    duration: { type: Number },
    status: {
      type: String,
      enum: ["to-do", "done"],
      default: "to-do",
    },
    members: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: [true, "Project members are required"], //this will prevent a Project model from being saved without a members array.
        // validate: [
        //   notEmpty,
        //   "Please add at least one feature in the members array",
        // ], //this adds custom validation through the function check of notEmpty.
      },
    ],
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", ProjectSchema);
