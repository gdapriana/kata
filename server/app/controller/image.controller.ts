import { type Request, type Response, type NextFunction } from "express"
import { ImageService } from "../services/image.service.js"
import { SuccessResponse } from "../helpers/responses/success.response.js"
import { ResponseError, ErrorResponseMessage } from "../helpers/responses/error.response.js"

export class ImageController {
  static UploadSingle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id
      if (!userId) {
        throw new ResponseError(ErrorResponseMessage.UNAUTHORIZED())
      }
      
      const file = req.file
      if (!file) {
        throw new ResponseError(ErrorResponseMessage.BAD_REQUEST("No file uploaded"))
      }

      const result = await ImageService.UploadSingle(file, userId)
      const response = SuccessResponse.POST("image" as any, result)
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  static UploadBulk = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id
      if (!userId) {
        throw new ResponseError(ErrorResponseMessage.UNAUTHORIZED())
      }

      const files = req.files as Express.Multer.File[]
      if (!files || files.length === 0) {
        throw new ResponseError(ErrorResponseMessage.BAD_REQUEST("No files uploaded"))
      }

      const result = await ImageService.UploadBulk(files, userId)
      const response = SuccessResponse.POST("image" as any, result)
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  static Delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id
      const userRole = req.user?.role
      if (!userId || !userRole) {
        throw new ResponseError(ErrorResponseMessage.UNAUTHORIZED())
      }

      const { id } = req.params
      if (!id) {
        throw new ResponseError(ErrorResponseMessage.BAD_REQUEST("Image id is required"))
      }

      const result = await ImageService.Delete(id as string, userId, userRole)
      const response = SuccessResponse.DELETE("image" as any, result)
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }
}
