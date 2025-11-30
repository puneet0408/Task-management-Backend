import express from "express";

const userRouter = express.Router();
import {UserRegister , userLogin , refreshtoken , logoutUser, logoutAllUser , getprotectedroutes} from "../controlers/usersController.js";
import { authenticate, authorized } from "../middleware/auth.js";
userRouter.post("/register",UserRegister);
userRouter.post("/login",userLogin)
userRouter.post("/refresh",refreshtoken);
userRouter.post("/logout",logoutUser);
userRouter.post("/logout-all",logoutAllUser)
 userRouter.get("/protected",authenticate,authorized,getprotectedroutes);

export default userRouter;