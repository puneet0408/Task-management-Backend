
import mongoose from "mongoose";

 const companySchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Name is required Field"],
        unique:true,
    },
    no_of_user:{
        type:Number,
    },
    address:{
        type:String,
    },
    contact_no:{
        type:Number,
    },
    city:{
        type:String
    },
     state:{
        type:String
    },
     country:{
        type:String
    },
    gst_no:{
      type:Number
    }
 })
export const CompanyModel = mongoose.model("company",companySchema);
  