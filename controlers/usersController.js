import { UsersModel } from "../Model/userModel.js";
import nodemailer from "nodemailer";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

export const getAllUsers = async (req, res) => {
  try {
    const {
      dateFrom,
      dateTo,
      searchValue,
      sortFIeld,
      sortDirection,
      limit = 10,
      offset = 0,
    } = req.query;
    let query = {};
    if (req.filterRole) {
      query.role = req.filterRole;
    }
    if (dateFrom && dateTo) {
      query.createdAt = {
        $gte: new Date(dateFrom),
        $lte: new Date(dateTo + "T23:59:59.999Z"),
      };
    }
    if (searchValue) {
      query.$text = { $search: searchValue };
    }
    let mongoQuery = UsersModel.find(query);
    if (sortFIeld) {
      mongoQuery = mongoQuery.sort({
        [sortFIeld]: sortDirection === "asc" ? 1 : -1,
      });
    }
    const fetchusers = await mongoQuery
      .skip(Number(offset))
      .limit(Number(limit));
    const totalCount = await UsersModel.countDocuments(query);
    res.status(200).json({
      status: "success",
      data: {
        length: totalCount,
        users: fetchusers,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      msg: err.message,
    });
  }
};

export const postUsers = async (req, res) => {
  try {
    const fetchusers = new UsersModel({
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
      company_name: req.body.company_name,
    });
    const token = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    fetchusers.resetPasswordToken = hashedToken;
    fetchusers.resetPasswordExpire = Date.now() + 24 * 60 * 60 * 1000;
    await fetchusers.save();
    const resetLink = `http://localhost:5173/createpassword/${token}`;
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: `"My App" <${process.env.EMAIL_USER}>`,
      to: fetchusers.email,
      subject: "Set Your Password",
      html: `
        <div style="font-family: Arial;">
          <h2>Welcome ${fetchusers.name}</h2>
          <p>Please click below to set your password:</p>
          <a href="${resetLink}"
            style="background:#4CAF50;color:#fff;
            padding:10px 20px;
            text-decoration:none;
            border-radius:5px;">
            Set Password
          </a>
          <p>This link expires in 24 hours.</p>
        </div>
      `,
    });

    res.status(200).json({
      msg: "User created & email sent successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Internal server error",
    });
  }
};

export const updateUsers = async (req, res) => {
  try {
    const id = req.params.id;
    const updateUsers = await UsersModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        updateUsers,
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

export const deleteUsers = async (req, res) => {
  try {
    const id = req.params.id;
    const deleteUsers = await UsersModel.findByIdAndDelete(id);
    res.status(200).json({
      status: "success",
      data: {
        status: 201,
        msg: "user delete poperly",
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 400,
      msg: err.message,
    });
  }
};

