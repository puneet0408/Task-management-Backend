import { TaskModel } from "../Model/taskModel.js";
import mongoose from "mongoose";

export const getAllTask = async (req, res) => {
  try {
    const {
      limit,
      offset,
      sprintId,
      assignedTo,
      taskStatus,
      tag,
      priority,
      type,
      searchValue,
      sortFIeld,
      sortDirection,
    } = req.query;
    let taskFilters = { isDeleted: false };
    if (sprintId) {
      taskFilters.sprintId = new mongoose.Types.ObjectId(sprintId);
    }
    if (assignedTo) {
      const assignedArray = Array.isArray(assignedTo)
        ? assignedTo
        : assignedTo.split(",");

      const assignedObjectIds = assignedArray.map(
        (id) => new mongoose.Types.ObjectId(id)
      );

      taskFilters.assignedTo = { $in: assignedObjectIds };
    }
    if (tag) {
      const tagArray = Array.isArray(tag) ? tag : tag.split(",");
      taskFilters.tags = { $in: tagArray };
    }
    if (taskStatus) {
      const statusArray = Array.isArray(taskStatus)
        ? taskStatus
        : taskStatus.split(",");
      taskFilters.taskStatus = { $in: statusArray };
    }
    if (priority) {
      const priorityArray = Array.isArray(priority)
        ? priority
        : priority.split(",");
      taskFilters.priority = { $in: priorityArray };
    }
    if (type) {
      const typeArray = Array.isArray(type) ? type : type.split(",");
      taskFilters.type = { $in: typeArray };
    }
    const matchStage = {
      $or: [{ type: "story", isDeleted: false }, taskFilters],
    };
    if (searchValue) {
      matchStage.$and = [
        {
          $or: [
            { title: { $regex: searchValue, $options: "i" } },
            { description: { $regex: searchValue, $options: "i" } },
          ],
        },
      ];
    }
    const sortStage = sortFIeld
      ? { [sortFIeld]: sortDirection === "asc" ? 1 : -1 }
      : { createdAt: -1 };
    const pipeline = [
      {
        $lookup: {
          from: "users",
          localField: "assignedTo",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
      { $match: matchStage },
      { $sort: sortStage },
      { $skip: Number(offset) || 0 },
      {
        $project: {
          title: 1,
          sprintId: 1,
          parentId: 1,
          description: 1,
          taskStatus: 1,
          attachment:1,
          type: 1,
          assignedTo: 1,
          tags: 1,
          originalTIme: 1,
          RemainingTIme: 1,
          CompleteTIme: 1,
          priority: 1,
          isDeleted: 1,
          "user.name": 1,
          "user._id": 1,
          createdBy: 1,
          updatedAt: 1,
        },
      },
      ...(limit ? [{ $limit: Number(limit) }] : []),
    ];
    const tasks = await TaskModel.aggregate(pipeline);
    return res.status(200).json({
      status: "success",
      count: tasks.length,
      data: tasks,
    });
  } catch (err) {
    return res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

export const createTask = async (req, res) => {
  try {
    const { loginUser } = req;
    if (!loginUser) {
      return res.status(401).json({
        data: {
          msg: "unothorized",
        },
      });
    }
    const companyId = loginUser?.company_name;
    const projectId = loginUser?.preferences?.activeProject?.projectId;
    const createdBy = loginUser?._id;
    const {
      title,
      parentId,
      sprintId,
      description,
      taskStatus,
      stage,
      type,
      assignedTo,
      tags,
      originalTIme,
      RemainingTIme,
      CompleteTIme,
      priority,
      completedAt,
      attachment,
    } = req.body;
    if (!companyId) {
      return res.status(400).json({
        data: {
          msg: "company is required",
        },
      });
    }
    if (!projectId) {
      return res.status(400).json({
        data: {
          msg: "project is required",
        },
      });
    }
    const payload = {
      title,
      companyId,
      projectId,
      parentId,
      sprintId,
      description,
      taskStatus,
      stage,
      type,
      attachment,
      assignedTo: assignedTo?.value,
      tags,
      originalTIme,
      RemainingTIme,
      CompleteTIme,
      priority,
      completedAt,
      createdBy,
    };
    const task = await TaskModel.create(payload);
    res.status(201).json({
      task,
      status: 201,
      msg: "task created sucessfully",
    });
  } catch (error) {
    res.status(400).json({
      error,
      status: 400,
      msg: "Internal server error",
    });
  }
};

export const updateTask = async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = await TaskModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        updateData,
        status: 201,
        msg: "data get poperly",
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 400,
      msg: err.message,
    });
  }
};

export const DeleteTask = async (req, res) => {
  try {
    const id = req.params.id;
    await TaskModel.findByIdAndUpdate(id, {
      $set: {
        isDeleted: true,
      },
    });
    res.status(200).json({
      status: "success",
      data: {
        msg: "task Deleted Sucessfully",
      },
    });
  } catch (error) {
    res.status(401).json({
      status: "Failed",
      data: {
        msg: "Internal server error",
      },
    });
  }
};
