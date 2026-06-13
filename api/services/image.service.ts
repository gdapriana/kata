import type { UploadApiResponse } from "cloudinary";
import { getCloudinary } from "../../lib/cloudinary.js";
import { prisma } from "../db/db.js";
import type { ImageQueryInput, ImageUpdateInput } from "../validations/image.validation.js";
import type { Prisma } from "../../generated/prisma/client.js";

type ImageLookup = {
  by: "id" | "slug";
  value: string;
};

type ImageUploadInput = {
  name?: string;
  alt?: string;
};

type ImageUploadFile = {
  buffer: Buffer;
  mimetype: string;
  size: number;
  originalname: string;
};

export class ImageServiceError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
  }
}

function lookupWhere(lookup: ImageLookup): Prisma.ImageWhereUniqueInput {
  if (lookup.by === "id") {
    return { id: lookup.value };
  }

  throw new ImageServiceError(400, "VALIDATION_ERROR", "Images can only be looked up by id");
}

function isMissingRecord(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && error.code === "P2025";
}

function createImageWhere(query: ImageQueryInput): Prisma.ImageWhereInput {
  return {
    ...(query.search
      ? {
          OR: [
            { name: { contains: query.search, mode: "insensitive" } },
            { alt: { contains: query.search, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(query.uploaderId ? { uploaderId: query.uploaderId } : {}),
    ...(query.mimeType ? { mimeType: query.mimeType } : {}),
  };
}

function uploadToCloudinary(file: ImageUploadFile): Promise<UploadApiResponse> {
  const cloudinary = getCloudinary();

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "kata",
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed"));
          return;
        }

        resolve(result);
      },
    );

    stream.end(file.buffer);
  });
}

export async function getImage(lookup: ImageLookup) {
  const image = await prisma.image.findUnique({
    where: lookupWhere(lookup),
  });

  if (!image) {
    throw new ImageServiceError(404, "IMAGE_NOT_FOUND", "Image not found");
  }

  return image;
}

export async function listImages(query: ImageQueryInput) {
  const where = createImageWhere(query);
  const skip = (query.page - 1) * query.limit;

  const [images, total] = await prisma.$transaction([
    prisma.image.findMany({
      where,
      orderBy: {
        [query.sort ?? "createdAt"]: query.order,
      },
      skip,
      take: query.limit,
    }),
    prisma.image.count({ where }),
  ]);

  return {
    data: images,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
    },
  };
}

async function persistUploadedImage(
  file: ImageUploadFile,
  uploadResult: UploadApiResponse,
  uploaderId: string,
  input: ImageUploadInput = {},
) {
  return prisma.image.create({
    data: {
      name: input.name ?? file.originalname,
      alt: input.alt,
      url: uploadResult.secure_url,
      cloudinaryPublicId: uploadResult.public_id,
      mimeType: file.mimetype,
      size: file.size,
      width: uploadResult.width,
      height: uploadResult.height,
      uploader: {
        connect: { id: uploaderId },
      },
    },
  });
}

async function rollbackCloudinaryUploads(publicIds: string[]) {
  await Promise.all(publicIds.map((publicId) => getCloudinary().uploader.destroy(publicId).catch(() => undefined)));
}

export async function uploadImage(file: ImageUploadFile, uploaderId: string, input: ImageUploadInput = {}) {
  let uploadResult: UploadApiResponse;

  try {
    uploadResult = await uploadToCloudinary(file);
  } catch {
    throw new ImageServiceError(502, "IMAGE_UPLOAD_FAILED", "Failed to upload image to Cloudinary");
  }

  try {
    return await persistUploadedImage(file, uploadResult, uploaderId, input);
  } catch (error) {
    await rollbackCloudinaryUploads([uploadResult.public_id]);

    if (isMissingRecord(error)) {
      throw new ImageServiceError(400, "IMAGE_UPLOADER_NOT_FOUND", "Uploader does not exist");
    }

    throw error;
  }
}

export async function uploadImages(files: ImageUploadFile[], uploaderId: string) {
  const cloudinaryUploads: { file: ImageUploadFile; result: UploadApiResponse }[] = [];

  try {
    for (const file of files) {
      const result = await uploadToCloudinary(file);
      cloudinaryUploads.push({ file, result });
    }

    return await prisma.$transaction(
      cloudinaryUploads.map(({ file, result }) =>
        prisma.image.create({
          data: {
            name: file.originalname,
            url: result.secure_url,
            cloudinaryPublicId: result.public_id,
            mimeType: file.mimetype,
            size: file.size,
            width: result.width,
            height: result.height,
            uploader: {
              connect: { id: uploaderId },
            },
          },
        }),
      ),
    );
  } catch (error) {
    await rollbackCloudinaryUploads(cloudinaryUploads.map(({ result }) => result.public_id));

    if (isMissingRecord(error)) {
      throw new ImageServiceError(400, "IMAGE_UPLOADER_NOT_FOUND", "Uploader does not exist");
    }

    throw new ImageServiceError(502, "IMAGE_UPLOAD_FAILED", "Failed to upload one or more images to Cloudinary");
  }
}

export async function updateImage(lookup: ImageLookup, input: ImageUpdateInput) {
  try {
    return await prisma.image.update({
      where: lookupWhere(lookup),
      data: {
        name: input.name,
        alt: input.alt,
      },
    });
  } catch (error) {
    if (isMissingRecord(error)) {
      throw new ImageServiceError(404, "IMAGE_NOT_FOUND", "Image not found");
    }

    throw error;
  }
}

export async function deleteImage(lookup: ImageLookup) {
  const image = await prisma.image.findUnique({
    where: lookupWhere(lookup),
  });

  if (!image) {
    throw new ImageServiceError(404, "IMAGE_NOT_FOUND", "Image not found");
  }

  if (image.cloudinaryPublicId) {
    try {
      await getCloudinary().uploader.destroy(image.cloudinaryPublicId);
    } catch {
      throw new ImageServiceError(502, "IMAGE_DELETE_FAILED", "Failed to delete image from Cloudinary");
    }
  }

  await prisma.image.delete({
    where: lookupWhere(lookup),
  });
}
