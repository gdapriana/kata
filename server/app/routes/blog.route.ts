import express from "express";
import { BlogController } from "../controller/blog.controller.ts";

const blogRoute = express.Router();
blogRoute.get("/get", BlogController.GetOne);

export default blogRoute;
