import { prisma } from "../db/db.js";
import type { CategoryCreateInput, CategoryQueryInput, CategoryUpdateInput } from "../validations/category.validation.js";
import type { Prisma } from "../../generated/prisma/client.js";

type CategoryLookup = {
  by: "id" | "slug";
  value: string;
};

export class CategoryServiceError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
  }
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function lookupWhere(lookup: CategoryLookup): Prisma.CategoryWhereUniqueInput {
  return lookup.by === "id" ? { id: lookup.value } : { slug: lookup.value };
}

function isUniqueConflict(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && error.code === "P2002";
}

function isMissingRecord(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && error.code === "P2025";
}

function createCategoryWhere(query: CategoryQueryInput): Prisma.CategoryWhereInput {
  return {
    ...(query.search
      ? {
          OR: [
            { name: { contains: query.search, mode: "insensitive" } },
            { description: { contains: query.search, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(query.parentId ? { parentId: query.parentId } : {}),
  };
}

export async function getCategory(lookup: CategoryLookup) {
  const category = await prisma.category.findUnique({
    where: lookupWhere(lookup),
  });

  if (!category) {
    throw new CategoryServiceError(404, "CATEGORY_NOT_FOUND", "Category not found");
  }

  return category;
}

export async function listCategories(query: CategoryQueryInput) {
  const where = createCategoryWhere(query);
  const skip = (query.page - 1) * query.limit;

  const [categories, total] = await prisma.$transaction([
    prisma.category.findMany({
      where,
      orderBy: {
        [query.sort ?? "name"]: query.order,
      },
      skip,
      take: query.limit,
    }),
    prisma.category.count({ where }),
  ]);

  return {
    data: categories,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
    },
  };
}

export async function createCategory(input: CategoryCreateInput) {
  try {
    return await prisma.category.create({
      data: {
        name: input.name,
        slug: input.slug ?? slugify(input.name),
        description: input.description,
        parent: input.parentId
          ? {
              connect: { id: input.parentId },
            }
          : undefined,
      },
    });
  } catch (error) {
    if (isUniqueConflict(error)) {
      throw new CategoryServiceError(409, "CATEGORY_SLUG_CONFLICT", "Slug already in use");
    }

    if (isMissingRecord(error)) {
      throw new CategoryServiceError(400, "CATEGORY_PARENT_NOT_FOUND", "Parent category not found");
    }

    throw error;
  }
}

export async function updateCategory(lookup: CategoryLookup, input: CategoryUpdateInput) {
  try {
    return await prisma.category.update({
      where: lookupWhere(lookup),
      data: {
        name: input.name,
        slug: input.slug,
        description: input.description,
        parent: input.parentId
          ? {
              connect: { id: input.parentId },
            }
          : undefined,
      },
    });
  } catch (error) {
    if (isUniqueConflict(error)) {
      throw new CategoryServiceError(409, "CATEGORY_SLUG_CONFLICT", "Slug already in use");
    }

    if (isMissingRecord(error)) {
      throw new CategoryServiceError(404, "CATEGORY_NOT_FOUND", "Category not found");
    }

    throw error;
  }
}

export async function deleteCategory(lookup: CategoryLookup) {
  try {
    await prisma.category.delete({
      where: lookupWhere(lookup),
    });
  } catch (error) {
    if (isMissingRecord(error)) {
      throw new CategoryServiceError(404, "CATEGORY_NOT_FOUND", "Category not found");
    }

    throw error;
  }
}
