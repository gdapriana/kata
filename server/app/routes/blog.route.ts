import express from "express";
import { BlogController } from "../controller/blog.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const blogRoute = express.Router();
blogRoute.get("/get", BlogController.GetOne);
blogRoute.get("/query", BlogController.GetAll);
blogRoute.get("/saved", protectRoute(), BlogController.GetSaved);
blogRoute.get("/liked", protectRoute(), BlogController.GetLiked);
blogRoute.post("/like", protectRoute(), BlogController.Like);
blogRoute.post("/bookmark", protectRoute(), BlogController.Bookmark);
blogRoute.post("/create", protectRoute(["USER", "ADMIN"]), BlogController.Create);
blogRoute.delete("/:id", protectRoute(["USER", "ADMIN"]), BlogController.Delete);
blogRoute.patch("/:id", protectRoute(["USER", "ADMIN"]), BlogController.Update);

export default blogRoute;
