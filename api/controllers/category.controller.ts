import type { NextFunction, Request, Response } from "express";
import {
  CategoryServiceError,
  createCategory,
  deleteCategory,
  getCategory,
  listCategories,
  updateCategory,
} from "../services/category.service.js";
import type { CategoryCreateInput, CategoryQueryInput, CategoryUpdateInput } from "../validations";

type CategoryLookupQuery = {
  by: "id" | "slug";
  value: string;
};

function sendError(res: Response, next: NextFunction, error: unknown) {
  if (error instanceof CategoryServiceError) {
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

export async function getCategoryController(req: Request, res: Response, next: NextFunction) {
  try {
    const category = await getCategory(req.query as CategoryLookupQuery);
    return res.status(200).json(category);
  } catch (error) {
    return sendError(res, next, error);
  }
}

export async function listCategoriesController(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await listCategories(req.query as unknown as CategoryQueryInput);
    return res.status(200).json(result);
  } catch (error) {
    return sendError(res, next, error);
  }
}

export async function createCategoryController(req: Request, res: Response, next: NextFunction) {
  try {
    const category = await createCategory(req.body as CategoryCreateInput);
    return res.status(201).json(category);
  } catch (error) {
    return sendError(res, next, error);
  }
}

export async function updateCategoryController(req: Request, res: Response, next: NextFunction) {
  try {
    const category = await updateCategory(req.query as CategoryLookupQuery, req.body as CategoryUpdateInput);
    return res.status(200).json(category);
  } catch (error) {
    return sendError(res, next, error);
  }
}

export async function deleteCategoryController(req: Request, res: Response, next: NextFunction) {
  try {
    await deleteCategory(req.query as CategoryLookupQuery);
    return res.status(204).send();
  } catch (error) {
    return sendError(res, next, error);
  }
}
