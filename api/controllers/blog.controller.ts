import type { NextFunction, Request, Response } from "express";
import {
  createBlog,
  deleteBlog,
  getBlog,
  listBlogs,
  updateBlog,
  BlogServiceError,
} from "../services/blog.service.js";
import type { BlogCreateInput, BlogQueryInput, BlogUpdateInput } from "../validations";

type BlogLookupQuery = {
  by: "id" | "slug";
  value: string;
};

function sendError(res: Response, next: NextFunction, error: unknown) {
  if (error instanceof BlogServiceError) {
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

export async function getBlogController(req: Request, res: Response, next: NextFunction) {
  try {
    const blog = await getBlog(req.query as BlogLookupQuery);
    return res.status(200).json(blog);
  } catch (error) {
    return sendError(res, next, error);
  }
}

export async function listBlogsController(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await listBlogs(req.query as unknown as BlogQueryInput);
    return res.status(200).json(result);
  } catch (error) {
    return sendError(res, next, error);
  }
}

export async function createBlogController(req: Request, res: Response, next: NextFunction) {
  try {
    const blog = await createBlog(req.body as BlogCreateInput);
    return res.status(201).json(blog);
  } catch (error) {
    return sendError(res, next, error);
  }
}

export async function updateBlogController(req: Request, res: Response, next: NextFunction) {
  try {
    const blog = await updateBlog(req.query as BlogLookupQuery, req.body as BlogUpdateInput);
    return res.status(200).json(blog);
  } catch (error) {
    return sendError(res, next, error);
  }
}

export async function deleteBlogController(req: Request, res: Response, next: NextFunction) {
  try {
    await deleteBlog(req.query as BlogLookupQuery);
    return res.status(204).send();
  } catch (error) {
    return sendError(res, next, error);
  }
}
