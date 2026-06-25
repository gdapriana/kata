import { Router } from "express";
import { CategoryController } from "../controller/category.controller.js";

const categoryRoute = Router();

categoryRoute.get("/get", CategoryController.GetOne);
categoryRoute.get("/query", CategoryController.GetAll);

export default categoryRoute;
