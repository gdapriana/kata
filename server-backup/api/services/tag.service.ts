import { prisma } from "../db/db.js";
import type { TagCreateInput, TagQueryInput, TagUpdateInput } from "../validations/tag.validation.js";
import type { Prisma } from "../../generated/prisma/client.js";

type TagLookup = {
  by: "id" | "slug";
  value: string;
};

export class TagServiceError extends Error {
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

function lookupWhere(lookup: TagLookup): Prisma.TagWhereUniqueInput {
  return lookup.by === "id" ? { id: lookup.value } : { slug: lookup.value };
}

function isUniqueConflict(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && error.code === "P2002";
}

function isMissingRecord(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && error.code === "P2025";
}

function createTagWhere(query: TagQueryInput): Prisma.TagWhereInput {
  return {
    ...(query.search
      ? {
          OR: [
            { name: { contains: query.search, mode: "insensitive" } },
            { slug: { contains: query.search, mode: "insensitive" } },
          ],
        }
      : {}),
  };
}

function createTagOrderBy(query: TagQueryInput): Prisma.TagOrderByWithRelationInput {
  if (query.sort === "blogCount") {
    return {
      blogs: {
        _count: query.order,
      },
    };
  }

  return {
    [query.sort ?? "name"]: query.order,
  };
}

export async function getTag(lookup: TagLookup) {
  const tag = await prisma.tag.findUnique({
    where: lookupWhere(lookup),
  });

  if (!tag) {
    throw new TagServiceError(404, "TAG_NOT_FOUND", "Tag not found");
  }

  return tag;
}

export async function listTags(query: TagQueryInput) {
  const where = createTagWhere(query);
  const skip = (query.page - 1) * query.limit;

  const [tags, total] = await prisma.$transaction([
    prisma.tag.findMany({
      where,
      orderBy: createTagOrderBy(query),
      skip,
      take: query.limit,
    }),
    prisma.tag.count({ where }),
  ]);

  return {
    data: tags,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
    },
  };
}

export async function createTag(input: TagCreateInput) {
  try {
    return await prisma.tag.create({
      data: {
        name: input.name,
        slug: input.slug ?? slugify(input.name),
      },
    });
  } catch (error) {
    if (isUniqueConflict(error)) {
      throw new TagServiceError(409, "TAG_SLUG_CONFLICT", "Slug already in use");
    }

    throw error;
  }
}

export async function updateTag(lookup: TagLookup, input: TagUpdateInput) {
  try {
    return await prisma.tag.update({
      where: lookupWhere(lookup),
      data: {
        name: input.name,
        slug: input.slug,
      },
    });
  } catch (error) {
    if (isUniqueConflict(error)) {
      throw new TagServiceError(409, "TAG_SLUG_CONFLICT", "Slug already in use");
    }

    if (isMissingRecord(error)) {
      throw new TagServiceError(404, "TAG_NOT_FOUND", "Tag not found");
    }

    throw error;
  }
}

export async function deleteTag(lookup: TagLookup) {
  try {
    await prisma.tag.delete({
      where: lookupWhere(lookup),
    });
  } catch (error) {
    if (isMissingRecord(error)) {
      throw new TagServiceError(404, "TAG_NOT_FOUND", "Tag not found");
    }

    throw error;
  }
}
