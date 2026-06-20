import type { NextFunction, Request, Response } from "express";
import { createTag, deleteTag, getTag, listTags, TagServiceError, updateTag } from "../services/tag.service.js";
import type { TagCreateInput, TagQueryInput, TagUpdateInput } from "../validations/tag.validation.js";

type TagLookupQuery = {
  by: "id" | "slug";
  value: string;
};

function sendError(res: Response, next: NextFunction, error: unknown) {
  if (error instanceof TagServiceError) {
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

export async function getTagController(req: Request, res: Response, next: NextFunction) {
  try {
    const tag = await getTag(req.query as TagLookupQuery);
    return res.status(200).json(tag);
  } catch (error) {
    return sendError(res, next, error);
  }
}

export async function listTagsController(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await listTags(req.query as unknown as TagQueryInput);
    return res.status(200).json(result);
  } catch (error) {
    return sendError(res, next, error);
  }
}

export async function createTagController(req: Request, res: Response, next: NextFunction) {
  try {
    const tag = await createTag(req.body as TagCreateInput);
    return res.status(201).json(tag);
  } catch (error) {
    return sendError(res, next, error);
  }
}

export async function updateTagController(req: Request, res: Response, next: NextFunction) {
  try {
    const tag = await updateTag(req.query as TagLookupQuery, req.body as TagUpdateInput);
    return res.status(200).json(tag);
  } catch (error) {
    return sendError(res, next, error);
  }
}

export async function deleteTagController(req: Request, res: Response, next: NextFunction) {
  try {
    await deleteTag(req.query as TagLookupQuery);
    return res.status(204).send();
  } catch (error) {
    return sendError(res, next, error);
  }
}
