import { Router, type NextFunction, type Request, type RequestHandler, type Response } from "express";
import {
  deleteImageController,
  getImageController,
  listImagesController,
  updateImageController,
  uploadImageController,
  uploadImagesController,
} from "../controllers/image.controller";
import { authorMiddleware } from "../middlewares";
import { imageUpload, MAX_BULK_FILES } from "../middlewares/upload.middleware";
import { imageValidations, validateRequest } from "../validations";

export const imageRouter = Router();

function handleMulterUpload(upload: RequestHandler, req: Request, res: Response, next: NextFunction) {
  upload(req, res, (error: unknown) => {
    if (!error) {
      return next();
    }

    if (error instanceof Error) {
      if (error.message === "INVALID_IMAGE_TYPE") {
        return res.status(400).json({
          error: {
            code: "VALIDATION_ERROR",
            message: "Only JPEG, PNG, WebP, and GIF images are allowed",
          },
        });
      }

      if ("code" in error && error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          error: {
            code: "VALIDATION_ERROR",
            message: "Each image file must be 10 MB or smaller",
          },
        });
      }

      if ("code" in error && error.code === "LIMIT_FILE_COUNT") {
        return res.status(400).json({
          error: {
            code: "VALIDATION_ERROR",
            message: `A maximum of ${MAX_BULK_FILES} image files is allowed per request`,
          },
        });
      }
    }

    return next(error);
  });
}

imageRouter.get("/get", validateRequest(imageValidations.get), getImageController);
imageRouter.get("/query", validateRequest(imageValidations.query), listImagesController);
imageRouter.post(
  "/bulk",
  authorMiddleware,
  (req, res, next) => handleMulterUpload(imageUpload.array("files", MAX_BULK_FILES), req, res, next),
  uploadImagesController,
);
imageRouter.post(
  "/",
  authorMiddleware,
  (req, res, next) => handleMulterUpload(imageUpload.single("file"), req, res, next),
  validateRequest(imageValidations.upload),
  uploadImageController,
);
imageRouter.patch("/", authorMiddleware, validateRequest(imageValidations.update), updateImageController);
imageRouter.delete("/", authorMiddleware, validateRequest(imageValidations.delete), deleteImageController);

export default imageRouter;
