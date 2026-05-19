// backend/src/controllers/upload.controller.ts
import { Request, Response } from 'express'
import { uploadImage, deleteImage } from '../lib/cloudinary'
import { buildResponse } from '../utils/helpers'

export async function uploadSingle(req: Request, res: Response) {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file provided' })
  }

  const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`
  const result = await uploadImage(base64)

  return res.status(200).json(buildResponse(result, 'Image uploaded successfully'))
}

export async function uploadMultiple(req: Request, res: Response) {
  if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
    return res.status(400).json({ success: false, error: 'No files provided' })
  }

  const uploads = await Promise.all(
    req.files.map((file) => {
      const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`
      return uploadImage(base64)
    })
  )

  return res.status(200).json(buildResponse(uploads, 'Images uploaded successfully'))
}

export async function removeImage(req: Request, res: Response) {
  const { publicId } = req.body

  if (!publicId) {
    return res.status(400).json({ success: false, error: 'publicId is required' })
  }

  await deleteImage(publicId)
  return res.status(200).json(buildResponse(null, 'Image deleted successfully'))
}
