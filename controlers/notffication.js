import { NotificationModel } from "../Model/notification.js";

import { getIO } from "../socket/socket.js";

export const getAllNotification = async (req, res) => {
  try {
    let query = {};
    const { loginUser } = req;
    if (!loginUser?.preferences?.activeProject?.projectId) {
      return res.status(401).json({
        data: {
          msg: "Unotherized login",
        },
      });
    }

    const notification = await NotificationModel.find(query);
    res.status(200).json({
      status: 200,
        notification,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      msg: err.message,
    });
  }
};

export const createNotification = async (req, res) => {
  try {
    const { userId, title, message, isRead } = req.body;

    if (!userId) {
      return res.status(400).json({
        msg: "UserId is required",
      });
    }

    const notification =
      await NotificationModel.create({
        userId,
        title,
        message,
        isRead,
      });

    const io = getIO();

    io.to(userId.toString()).emit(
      "notification",
      {
        _id: notification._id,
        title: notification.title,
        message: notification.message,
        isRead: notification.isRead,
        createdAt: notification.createdAt,
      }
    );

    res.status(200).json({
      status: "Success",
      data: {
        notification,
        msg: "Notification Created Successfully",
      },
    });

  } catch (err) {
    res.status(400).json({
      status: "Fail",
      msg: err.message,
    });
  }
};
