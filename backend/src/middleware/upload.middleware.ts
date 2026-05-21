// backend/src/middleware/upload.middleware.ts
import multer from 'multer'
import { Request } from 'express'

const storage = multer.memoryStorage()

/**
 * Validate file by reading its actual magic bytes (file signature),
 * NOT the Content-Type header which can be spoofed by an attacker.
 *
 * Magic bytes reference:
 *   JPEG  → FF D8 FF
 *   PNG   → 89 50 4E 47 0D 0A 1A 0A
 *   WebP  → 52 49 46 46 ... 57 45 42 50
 */
function checkMagicBytes(buffer: Buffer): boolean {
  if (buffer.length < 12) return false

  // JPEG: starts with FF D8 FF
  if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
    return true
  }

  // PNG: starts with 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4E &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0D &&
    buffer[5] === 0x0A &&
    buffer[6] === 0x1A &&
    buffer[7] === 0x0A
  ) {
    return true
  }

  // WebP: RIFF....WEBP
  if (
    buffer[0] === 0x52 && // R
    buffer[1] === 0x49 && // I
    buffer[2] === 0x46 && // F
    buffer[3] === 0x46 && // F
    buffer[8] === 0x57 && // W
    buffer[9] === 0x45 && // E
    buffer[10] === 0x42 && // B
    buffer[11] === 0x50    // P
  ) {
    return true
  }

  return false
}

// Step 1: MIME type allowlist check (first line of defence, fast)
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

function fileFilter(_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'))
  }
  cb(null, true)
}

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 10,
  },
})

/**
 * Step 2: Magic byte validation middleware.
 * Call this AFTER multer has buffered the file into memory.
 * Rejects files whose actual bytes don't match their claimed type.
 *
 * Usage in routes:
 *   router.post('/single', authenticate, requireAdmin,
 *     upload.single('file'), validateFileMagicBytes, uploadSingle)
 */
export function validateFileMagicBytes(
  req: Request,
  res: any,
  next: any
) {
  const files: Express.Multer.File[] = req.file
    ? [req.file]
    : Array.isArray(req.files)
    ? req.files
    : []

  if (files.length === 0) return next()

  for (const file of files) {
    if (!checkMagicBytes(file.buffer)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid file content. File does not match its declared type.',
      })
    }
  }

  next()
}