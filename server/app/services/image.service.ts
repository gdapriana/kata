import { prismaClient } from "../database/db.js"
import { uploadToCloudinary, deleteFromCloudinary } from "../lib/cloudinary.js"
import { ResponseError, ErrorResponseMessage } from "../helpers/responses/error.response.js"

export class ImageService {
  static UploadSingle = async (
    file: Express.Multer.File,
    uploaderId: string
  ) => {
    if (!file) {
      throw new ResponseError(ErrorResponseMessage.BAD_REQUEST("No file uploaded"))
    }
    const uploadResult = await uploadToCloudinary(file.buffer, "kata")
    const image = await prismaClient.image.create({
      data: {
        name: file.originalname,
        alt: file.originalname.split(".")[0] || "image",
        url: uploadResult.url,
        cloudinaryPublicId: uploadResult.publicId,
        mimeType: file.mimetype,
        size: file.size,
        width: uploadResult.width,
        height: uploadResult.height,
        uploaderId,
      },
    })

    return image
  }

  static UploadBulk = async (
    files: Express.Multer.File[],
    uploaderId: string
  ) => {
    if (!files || files.length === 0) {
      throw new ResponseError(ErrorResponseMessage.BAD_REQUEST("No files uploaded"))
    }

    const uploadPromises = files.map(async (file) => {
      const uploadResult = await uploadToCloudinary(file.buffer, "kata")

      return prismaClient.image.create({
        data: {
          name: file.originalname,
          alt: file.originalname.split(".")[0] || "image",
          url: uploadResult.url,
          cloudinaryPublicId: uploadResult.publicId,
          mimeType: file.mimetype,
          size: file.size,
          width: uploadResult.width,
          height: uploadResult.height,
          uploaderId,
        },
      })
    })

    const images = await Promise.all(uploadPromises)
    return images
  }

  static Delete = async (imageId: string, userId: string, userRole: string) => {
    const image = await prismaClient.image.findUnique({
      where: { id: imageId },
    })

    if (!image) {
      throw new ResponseError(ErrorResponseMessage.NOT_FOUND("image" as any))
    }

    // Only the uploader or an ADMIN can delete the image
    if (image.uploaderId !== userId && userRole !== "ADMIN") {
      throw new ResponseError(ErrorResponseMessage.FORBIDDEN())
    }

    // Delete from Cloudinary if it has a publicId
    if (image.cloudinaryPublicId) {
      try {
        await deleteFromCloudinary(image.cloudinaryPublicId)
      } catch (err) {
        console.error("Failed to delete image from Cloudinary:", err)
      }
    }

    // Delete from Database
    await prismaClient.image.delete({
      where: { id: imageId },
    })

    return { id: imageId }
  }
}
