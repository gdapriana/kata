import type { NextFunction, Request, Response } from "express";
import {
  deleteImage,
  getImage,
  ImageServiceError,
  listImages,
  updateImage,
  uploadImage,
  uploadImages,
} from "../services/image.service.js";
import type { ImageQueryInput, ImageUpdateInput, ImageUploadInput } from "../validations/image.validation.js";

type ImageLookupQuery = {
  by: "id";
  value: string;
};

function sendError(res: Response, next: NextFunction, error: unknown) {
  if (error instanceof ImageServiceError) {
    return res.status(error.status).json({
      error: {
        code: error.code,
        message: error.message,
        ...(error.details ? { details: error.details } : {}),
      },
    });
  }

  return next(error);
}

export async function getImageController(req: Request, res: Response, next: NextFunction) {
  try {
    const image = await getImage(req.query as ImageLookupQuery);
    return res.status(200).json(image);
  } catch (error) {
    return sendError(res, next, error);
  }
}

export async function listImagesController(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await listImages(req.query as unknown as ImageQueryInput);
    return res.status(200).json(result);
  } catch (error) {
    return sendError(res, next, error);
  }
}

export async function uploadImagesController(req: Request, res: Response, next: NextFunction) {
  try {
    const files = req.files;

    if (!Array.isArray(files) || files.length === 0) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "At least one image file is required",
        },
      });
    }

    if (!req.auth?.user.id) {
      return res.status(401).json({
        error: {
          code: "UNAUTHORIZED",
          message: "Missing or invalid bearer token",
        },
      });
    }

    const images = await uploadImages(files, req.auth.user.id);
    return res.status(201).json({ data: images });
  } catch (error) {
    return sendError(res, next, error);
  }
}

export async function uploadImageController(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Image file is required",
        },
      });
    }

    if (!req.auth?.user.id) {
      return res.status(401).json({
        error: {
          code: "UNAUTHORIZED",
          message: "Missing or invalid bearer token",
        },
      });
    }

    const image = await uploadImage(req.file, req.auth.user.id, req.body as ImageUploadInput);
    return res.status(201).json(image);
  } catch (error) {
    return sendError(res, next, error);
  }
}

export async function updateImageController(req: Request, res: Response, next: NextFunction) {
  try {
    const image = await updateImage(req.query as ImageLookupQuery, req.body as ImageUpdateInput);
    return res.status(200).json(image);
  } catch (error) {
    return sendError(res, next, error);
  }
}

export async function deleteImageController(req: Request, res: Response, next: NextFunction) {
  try {
    await deleteImage(req.query as ImageLookupQuery);
    return res.status(204).send();
  } catch (error) {
    return sendError(res, next, error);
  }
}
