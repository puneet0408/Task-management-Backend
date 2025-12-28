import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    company_name: {
      type: String,
      required: [true, "Company name is a required field"],
      unique: true,
      trim: true,
    },
    owner_name  : {
      type: String,
      required: [true, "Owner name is a required field"],
    },
    email: {
      type: String,
      required: [true, "Email is a required field"],
      unique: true,
      lowercase: true,
    },
    no_of_user: {
      type: Number,
      default: 0,
    },
    address: {
      type: String,
    },
    contact_no: {
      type: String,
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
    status: {
      type: String,
      enum: ["active", "inactive"]  ,
      default: "active",
    },
  },
  { timestamps: true }
);

export const CompanyModel = mongoose.model("Company", companySchema);
