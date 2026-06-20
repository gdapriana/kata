import { Router } from "express";
import {
  createBlogController,
  deleteBlogController,
  getBlogController,
  listBlogsController,
  updateBlogController,
} from "../controllers/blog.controller.js";
import { authorMiddleware } from "../middlewares/author.middleware.js";
import { validateRequest } from "../validations/common.validation.js";
import { blogValidations } from "../validations/index.js";

export const blogRouter = Router();

blogRouter.get("/get", validateRequest(blogValidations.get), getBlogController);
blogRouter.get("/query", validateRequest(blogValidations.query), listBlogsController);
blogRouter.post("/", authorMiddleware, validateRequest(blogValidations.create), createBlogController);
blogRouter.patch("/", authorMiddleware, validateRequest(blogValidations.update), updateBlogController);
blogRouter.delete("/", authorMiddleware, validateRequest(blogValidations.delete), deleteBlogController);

export default blogRouter;
