import express from "express";

import { getSummaryWidgets } from "../controlers/dashboardController.js";
import { authenticate, authorized } from "../middleware/auth.js";
const dashboardRoutes = express.Router();
dashboardRoutes.route("/summary")
  .get(authenticate, authorized, getSummaryWidgets)
export default dashboardRoutes;