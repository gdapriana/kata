import { Router } from "express";
import {
  createTagController,
  deleteTagController,
  getTagController,
  listTagsController,
  updateTagController,
} from "../controllers/tag.controller.js";
import { validateRequest } from "../validations/common.validation.js";
import { tagValidations } from "../validations/index.js";
import { editorMiddleware } from "../middlewares/editor.middleware.js";

export const tagRouter = Router();

tagRouter.get("/get", validateRequest(tagValidations.get), getTagController);
tagRouter.get("/query", validateRequest(tagValidations.query), listTagsController);
tagRouter.post("/", editorMiddleware, validateRequest(tagValidations.create), createTagController);
tagRouter.patch("/", editorMiddleware, validateRequest(tagValidations.update), updateTagController);
tagRouter.delete("/", editorMiddleware, validateRequest(tagValidations.delete), deleteTagController);

export default tagRouter;
