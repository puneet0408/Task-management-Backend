import express from "express";
import {
  getAllNotification,
  createNotification,
} from "./../controlers/notffication.js";
import { authenticate, authorized } from "../middleware/auth.js";
const NotificationRoutes = express.Router();
NotificationRoutes.route("/")
  .get(authenticate, authorized, getAllNotification)
  .post(authenticate, authorized, createNotification);
export default NotificationRoutes;