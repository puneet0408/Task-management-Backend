import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "task name is a required field"],
      trim: true,
    },
    taskid:{
      type:Number
    },
    companyId: {
     type: mongoose.Schema.Types.ObjectId,
      ref: "companies",
      required: [true, "Company name is a required field"],
      trim: true,
    },
    sprintId: {
    type: mongoose.Schema.Types.ObjectId,
      ref: "sprints",
      required: [true, "Sprint name is a required field"],
      trim: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "projects",
      required: [true, "project name is a required field"],
      trim: true,
    },
    parentId: {
       type: mongoose.Schema.Types.ObjectId,
      ref: "tasks",
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    taskStatus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TaskStatus",
      default: "new",
    },
    stage: {
      type: String,
      default: "none",
    },
    type: {
      type: String,
      enum: ["bug", "task", "user_story"],
      default: "task",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
        ref: "users", 
  default: null,  
    },
tags: [
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },
    value: {
      type: String,
      required: true,
      trim: true,
    },
  },
],

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
  { timestamps: true },
);

export const TaskModel = mongoose.model("tasks", TaskSchema);
