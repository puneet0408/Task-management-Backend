import express from "express";
import { getAllCompanies , createCompany  , getCompanybyID , updateCompany , deleteCompany} from "./../controlers/companyColtroler.js";
 const CompanyRoutes = express.Router();
CompanyRoutes.route("/")
  .get(getAllCompanies)
  .post(createCompany);
CompanyRoutes.route("/:id")
  .get(getCompanybyID)
  .patch(updateCompany)
  .delete(deleteCompany);
  export default CompanyRoutes;