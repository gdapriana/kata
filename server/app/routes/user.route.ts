import { Router } from "express";
import { UserController } from "../controller/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const userRoute = Router();

userRoute.get("/get", UserController.GetOne);
userRoute.get("/query", UserController.GetAll);
userRoute.patch("/edit", protectRoute(), UserController.Update);

export default userRoute;
