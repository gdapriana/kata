import express from "express";
import { BlogController } from "../controller/blog.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const blogRoute = express.Router();
blogRoute.get("/get", BlogController.GetOne);
blogRoute.get("/query", BlogController.GetAll);
blogRoute.post("/like", protectRoute(), BlogController.Like);
blogRoute.post("/bookmark", protectRoute(), BlogController.Bookmark);

export default blogRoute;
