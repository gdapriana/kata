import express from "express";
import { CommentController } from "../controller/comment.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const commentRoute = express.Router();
commentRoute.get("/query", CommentController.GetAll);
commentRoute.post("/create", protectRoute(), CommentController.Create);
commentRoute.post(
  "/delete/:commentId",
  protectRoute(),
  CommentController.Delete,
);

export default commentRoute;
