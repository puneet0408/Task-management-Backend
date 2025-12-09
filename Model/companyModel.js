import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  company_name: {
    type: String,
    required: [true, "company name is required Field"],
    unique: true,
  },
  owner_name: {
    type: String,
    required: [true, "Owner Name is required Field"],
  },
  email: {
    type: String,
    required: [true, "Owner Name is required Field"],
    unique: true,
  },
  no_of_user: {
    type: Number,
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
  status: {},
});
export const CompanyModel = mongoose.model("company", companySchema);
