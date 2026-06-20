import { Router } from "express";
import {
  createCategoryController,
  deleteCategoryController,
  getCategoryController,
  listCategoriesController,
  updateCategoryController,
} from "../controllers/category.controller.js";
import { validateRequest } from "../validations/common.validation.js";
import { editorMiddleware } from "../middlewares/editor.middleware.js";
import { categoryValidations } from "../validations/index.js";

export const categoryRouter = Router();

categoryRouter.get("/get", validateRequest(categoryValidations.get), getCategoryController);
categoryRouter.get("/query", validateRequest(categoryValidations.query), listCategoriesController);
categoryRouter.post("/", editorMiddleware, validateRequest(categoryValidations.create), createCategoryController);
categoryRouter.patch("/", editorMiddleware, validateRequest(categoryValidations.update), updateCategoryController);
categoryRouter.delete("/", editorMiddleware, validateRequest(categoryValidations.delete), deleteCategoryController);

export default categoryRouter;
