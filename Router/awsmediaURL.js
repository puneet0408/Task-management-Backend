import express from "express";
import { createPresignedUrlWithClient } from "../controlers/awsmediaupload.js";
import { authenticate, authorized } from "../middleware/auth.js";

const AwsUploadRoutes = express.Router();

AwsUploadRoutes.post(
  "/",
  authenticate,
  authorized,
  createPresignedUrlWithClient
);

export default AwsUploadRoutes;