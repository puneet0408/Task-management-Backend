import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required Field"],
  },
  email: {
    type: String,
    required: [true, "Email is required Field"],
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: [
    {
      token: {
        type: String,
        required: true,
      },
      expiresAt: {
        type: Date,
        required: true,
      },
      createdAT: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  role: {
    type: String,
    enum:["superadmin","admin","manager","employee"],
    default:["employee"]
  },
  address: {
    type: String,
  },
  contact_no: {
    type: Number,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  country: {
    type: String,
  },
});
export const UsersModel =
  mongoose.models.User || mongoose.model("users", UserSchema);
