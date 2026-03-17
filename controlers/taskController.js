import { TaskModel } from "../Model/taskModel.js";

export const getAllTask = async (req, res) => {
  try {
      const {
    limit,
    offset,
    sprintId,
    assignedTo,
    status,
    tag,
    priority,
    type,
    searchValue,
    sortFIeld,
    sortDirection,
  } = req.query;
  let matchStage = { isDeleted: false };

  if (sprintId) {
    matchStage.sprintId = sprintId;
  }
  if (assignedTo) {
    const assignedArray = Array.isArray(assignedTo)
      ? assignedTo
      : assignedTo.split(",");
    matchStage.assignedTo = { $in: assignedArray };
  }
  if (tag) {
    const TagArray = Array.isArray(tag) ? tag : tag.split(",");
    matchStage.tag = { $in: TagArray };
  }
  if (status) {
    const statusArray = Array.isArray(status) ? status : status.split(",");
    matchStage.status = { $in: statusArray };
  }
  if (priority) {
    const priorityArray = Array.isArray(priority)
      ? priority
      : priority.split(",");
    matchStage.priority = { $in: priorityArray };
  }
  if (type) {
    const typeArray = Array.isArray(type) ? type : type.split(",");
    matchStage.type = { $in: typeArray };
  }
     const sortStage = sortFIeld
      ? { [sortFIeld]: sortDirection === "asc" ? 1 : -1 }
      : { createdAt: -1 };

   const pipeline = [
      { $match: matchStage },
      { $sort: sortStage },
      { $skip: Number(offset) || 0 },
      { $limit: Number(limit) || 10 }
    ];
      const tasks = await TaskModel.aggregate(pipeline);
     res.status(200).json({
      status: "success",
      data: tasks
    });
  }catch (err) {
    res.status(400).json({
      status: "fail",
      msg: err.message
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
    } = req.body;
    console.log(req.body,"resbody");
    
    if (!companyId) {
      return res.status(400).json({
        data: {
          msg: "company is required",
        },
      });
    }
    console.log(companyId,"companyId");
    
    if (!projectId) {
      return res.status(400).json({
        data: {
          msg: "project is required",
        },
      });
    }
    console.log(projectId,"projectId");
    
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
      assignedTo:assignedTo?.value,
      tags,
      originalTIme,
      RemainingTIme,
      CompleteTIme,
      priority,
      completedAt,
      createdBy,
    };
    console.log(payload,"payload");
    
    const task = await TaskModel.create(payload);
    console.log(task,"tttt");
    
    res.status(201).json({
      task,
      status: 201,
      msg: "task created sucessfully",
    });
  } catch (error) {
    console.log(error,"error");
    
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
    await TaskModel.findByIdAndUpdate(id, req.body);
    resizeTo.status(201).json({
      status: 201,
      msg: "task created sucessfully",
    });
  } catch (error) {
    res.status(400).json({
      status: 401,
      msg: "Internal server error",
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
