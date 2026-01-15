import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project name is a required field"],
      trim: true,
    },
    companyId: {
      type: String,
      required: [true, "Company name is a required field"],
      trim: true,
    },
    sprintId: {
      type: String,
      required: [true, "Sprint name is a required field"],
      trim: true,
    },
    projectId: {
      type: String,
      required: [true, "project name is a required field"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    taskStatus: {
      type: String,
      enum: ["new", "active", "qa", "done", "closed"],
      default: "new",
    },
    assignedTo: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    originalTIme: {
      type: Number,
    },
    RemainingTIme: {
      type: Number,
    },
    CompleteTIme: {
      type: Number,
    },
    priority: {
      type: String,
    },
    createdBy: { type: String },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export const TaskModel = mongoose.model("tasks", TaskSchema);
