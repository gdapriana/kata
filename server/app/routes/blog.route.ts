import express from "express";
import { BlogController } from "../controller/blog.controller.js";

const blogRoute = express.Router();
blogRoute.get("/get", BlogController.GetOne);

export default blogRoute;
