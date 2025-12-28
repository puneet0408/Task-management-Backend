import express from "express";

const userRouter = express.Router();
import {
  getAllUsers,
  deleteUsers,
  postUsers,
  updateUsers,
} from "../controlers/usersController.js";
import {
  UserRegister,
  userLogin,
  refreshtoken,
  logoutUser,
  logoutAllUser,
  createPassword
} from "../controlers/authcontroller.js";
import { authenticate, authorized } from "../middleware/auth.js";
userRouter.post("/register", UserRegister);
userRouter.post("/login", userLogin);
userRouter.post("/refresh", refreshtoken);
userRouter.post("/logout", logoutUser);
userRouter.post("/logout-all", logoutAllUser);
userRouter
  .route("/users")
  .get(authenticate, authorized, getAllUsers)
  .post(authenticate, authorized, postUsers);
  userRouter
  .route("/users/:id")
  .delete(authenticate, authorized, deleteUsers)
  .patch(authenticate, authorized, updateUsers);
  userRouter
  .route("/set_password/:token").patch(createPassword);


export default userRouter;
