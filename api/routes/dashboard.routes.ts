import { Router } from "express";
import { getDashboardController } from "../controllers/dashboard.controller.js";
import { adminMiddleware } from "../middlewares";

export const dashboardRouter = Router();

dashboardRouter.get("/", adminMiddleware, getDashboardController);

export default dashboardRouter;
