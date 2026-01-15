
import express from "express";
import morgan from "morgan";
import CompanyRoutes from "./Router/companyRoutes.js";
import UserRouter from "./Router/userroutes.js";
import ProjectRoutes from "./Router/projectRouters.js";
import SprintRoutes from "./Router/sprintRouters.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import color from "colors";
 let App = express();
App.use(express.json());
App.use(cookieParser());
App.use(cors("*"));

if(process.env.NODE_ENV === "development"){
App.use(morgan('dev'));
}

App.use(express.static("./public"));

// App.use(logger);
App.use((req , res , next)=>{
req.requrestedat = new Date().toISOString()
next();
})


 App.use("/auth/v1/companies",CompanyRoutes);
 App.use("/auth/v1/",UserRouter);
 App.use("/auth/v1/project",ProjectRoutes);
 App.use("/auth/v1/sprint",SprintRoutes);

export  default App;
