import { TaskModel } from "../Model/taskModel.js";
import mongoose from "mongoose";

export const getSummaryWidgets = async (req, res) => {
  try {
    const { loginUser } = req;

    if (!loginUser) {
      return res.status(401).json({
        status: "fail",
        msg: "Unauthorized",
      });
    }

    const { sprintId } = req.query;
     const projectId = loginUser?.preferences?.activeProject?.projectId;

    let matchStage = {
      isDeleted: false,
    };

    if (sprintId) {
      matchStage.sprintId = new mongoose.Types.ObjectId(sprintId);
    }
      if (projectId) {
      matchStage.projectId = new mongoose.Types.ObjectId(projectId);
    }
    // const pipeline = [
    //   { $match: matchStage },

    //   {
    //     $group: {
    //       _id: null,
    //       total: { $sum: 1 },
    //       done: { $sum: { $cond: [{ $eq: ["$taskStatus", "done"] }, 1, 0] } },
    //       todo: { $sum: { $cond: [{ $eq: ["$taskStatus", "New"] }, 1, 0] } },
    //       inProgress: {
    //         $sum: { $cond: [{ $eq: ["$taskStatus", "in_progress"] }, 1, 0] },
    //       },
    //       in_qa: {
    //         $sum: { $cond: [{ $eq: ["$taskStatus", "qa"] }, 1, 0] },
    //       },
    //       live: {
    //         $sum: { $cond: [{ $eq: ["$taskStatus", "live"] }, 1, 0] },
    //       },
    //       closed: {
    //         $sum: { $cond: [{ $eq: ["$taskStatus", "closed"] }, 1, 0] },
    //       },
    //       unassignedTasks: {
    //         $sum: { $cond: [{ $eq: ["$assignedTo", null] }, 1, 0] },
    //       },
    //       overdueTasks: {
    //         $sum: {
    //           $cond: [
    //             {
    //               $and: [
    //                 { $ne: ["$taskStatus", "done"] },
    //                 { $ne: ["$taskStatus", "closed"] },
    //                 { $lt: ["$due_date", new Date()] },
    //                 { $ne: ["$due_date", null] },
    //               ],
    //             },
    //             1,
    //             0,
    //           ],
    //         },
    //       },
    //       taskcount: { $sum: { $cond: [{ $eq: ["$type", "task"] }, 1, 0] } },
    //       bugcount: { $sum: { $cond: [{ $eq: ["$type", "bug"] }, 1, 0] } },
    //       storycount: { $sum: { $cond: [{ $eq: ["$type", "story"] }, 1, 0] } },
    //       highprority: { $sum: { $cond: [{ $eq: ["$priority", "1"] }, 1, 0] } },
    //       mediumprority: { $sum: { $cond: [{ $eq: ["$priority", "2"] }, 1, 0] } },
    //       lowprority: { $sum: { $cond: [{ $eq: ["$priority", "3"] }, 1, 0] } },
    //       totalorignalestimate: { $sum: "$originalTIme" },
    //       totalPending: { $sum: "$RemainingTIme" },
    //       totalComplete: { $sum: "$CompleteTIme" },
    //     },
    //   },
    //   {
    //     $project: {
    //       _id: 0,
    //       total: 1,
    //       done: 1,
    //       todo: 1,
    //       inProgress: 1,
    //       in_qa: 1,
    //       closed: 1,
    //       live: 1,
    //       unassignedTasks:1,
    //       overdueTasks:1,
    //       taskcount:1,
    //       bugcount:1,
    //       storycount:1,
    //       highprority:1,
    //       mediumprority:1,
    //       lowprority:1,
    //       totalorignalestimate:1,
    //       totalPending:1,
    //       totalComplete:1
    //     },
    //   },
    // ];
    const pipeline = [
      {
        $match: matchStage,
      },

      {
        $facet: {
          summary: [
            {
              $group: {
                _id: null,

                total: { $sum: 1 },

                done: {
                  $sum: { $cond: [{ $eq: ["$taskStatus", "done"] }, 1, 0] },
                },

                todo: {
                  $sum: { $cond: [{ $eq: ["$taskStatus", "New"] }, 1, 0] },
                },

                inProgress: {
                  $sum: {
                    $cond: [{ $eq: ["$taskStatus", "in_progress"] }, 1, 0],
                  },
                },

                in_qa: {
                  $sum: { $cond: [{ $eq: ["$taskStatus", "qa"] }, 1, 0] },
                },

                closed: {
                  $sum: { $cond: [{ $eq: ["$taskStatus", "closed"] }, 1, 0] },
                },

                live: {
                  $sum: { $cond: [{ $eq: ["$taskStatus", "live"] }, 1, 0] },
                },
                unassignedTasks: {
                  $sum: { $cond: [{ $eq: ["$assignedTo", null] }, 1, 0] },
                },

                overdue: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $lt: ["$due_date", new Date()] },
                          { $ne: ["$taskStatus", "done"] },
                          { $ne: ["$taskStatus", "closed"] },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
              },
            },
            {
              $project: { _id: 0 },
            },
          ],
          typeStats: [
            {
              $group: {
                _id: "$type",
                count: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                type: "$_id",
                count: 1,
              },
            },
          ],
          priorityStats: [
            {
              $group: {
                _id: "$priority",
                count: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                priority: "$_id",
                count: 1,
              },
            },
          ],
          assigneeStats: [
            {
              $group: {
                _id: "$assignedTo",
                count: { $sum: 1 },
                taskCount: {
                  $sum: { $cond: [{ $eq: ["$type", "task"] }, 1, 0] },
                },
                bugCount: {
                  $sum: { $cond: [{ $eq: ["$type", "bug"] }, 1, 0] },
                },

                done: {
                  $sum: { $cond: [{ $eq: ["$taskStatus", "done"] }, 1, 0] },
                },

                todo: {
                  $sum: { $cond: [{ $eq: ["$taskStatus", "New"] }, 1, 0] },
                },

                inProgress: {
                  $sum: {
                    $cond: [{ $eq: ["$taskStatus", "in_progress"] }, 1, 0],
                  },
                },

                in_qa: {
                  $sum: { $cond: [{ $eq: ["$taskStatus", "qa"] }, 1, 0] },
                },

                closed: {
                  $sum: { $cond: [{ $eq: ["$taskStatus", "closed"] }, 1, 0] },
                },

                live: {
                  $sum: { $cond: [{ $eq: ["$taskStatus", "live"] }, 1, 0] },
                },
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "_id",
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
            {
              $project: {
                _id: 0,
                userId: "$_id",
                name: "$user.name",
                count: 1,
                taskCount: 1,
                bugCount: 1,
                done: 1,
                todo: 1,
                inProgress: 1,
                in_qa: 1,
                closed: 1,
                live: 1,
              },
            },
            {
              $sort: {
                count: -1,
              },
            },
          ],
          BugRateWidget: [
            {
              $group: {
                _id: null,
                totalTasks: { $sum: 1 },
                openbugs: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $in: ["$taskStatus", ["in_progress", "New"]] },
                          { $eq: ["$type", "bug"] },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                closedbugs: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $in: ["$taskStatus", ["live", "closed"]] },
                          { $eq: ["$type", "bug"] },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
              },
            },
          ],
        },
      },
    ];
    const result = await TaskModel.aggregate(pipeline);
    console.log(result, "resultresult");

    const summary = result[0] || {
      totalTasks: 0,
      completed: 0,
      inProgress: 0,
      todo: 0,
    };

    return res.status(200).json({
      status: "success",
      data: summary,
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      msg: error.message,
    });
  }
};
