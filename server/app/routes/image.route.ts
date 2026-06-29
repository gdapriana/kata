import express from "express";
import multer from "multer";
import { ImageController } from "../controller/image.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const imageRoute = express.Router();
const storage = multer.memoryStorage();

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

imageRoute.post(
  "/upload-single",
  protectRoute(["USER", "ADMIN"]),
  upload.single("file"),
  ImageController.UploadSingle,
);

imageRoute.post(
  "/upload-bulk",
  protectRoute(["USER", "ADMIN"]),
  upload.array("files", 10),
  ImageController.UploadBulk,
);

imageRoute.delete(
  "/:id",
  protectRoute(["USER", "ADMIN"]),
  ImageController.Delete,
);

export default imageRoute;
