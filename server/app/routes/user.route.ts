import { Router } from "express";
import { UserController } from "../controller/user.controller.js";

const userRoute = Router();

userRoute.get("/get", UserController.GetOne);
userRoute.get("/query", UserController.GetAll);

export default userRoute;
