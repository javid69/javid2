import { NextRequest } from 'next/server'
import { requireAuth, createErrorResponse, createSuccessResponse } from '@/lib/api-auth'
import { uploadImage, UploadResult } from '@/lib/cloudinary'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// POST /api/uploads - Upload file to Cloudinary
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)

    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || 'general'

    if (!file) {
      return createErrorResponse('No file provided', 'NO_FILE', 400)
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      return createErrorResponse(
        `Invalid file type: ${file.type}. Only images are allowed`,
        'INVALID_FILE_TYPE',
        400
      )
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return createErrorResponse(
        `File is too large. Maximum size is 5MB`,
        'FILE_TOO_LARGE',
        400
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    const result = await uploadImage(buffer, folder, {
      publicId: `${user.id}_${Date.now()}_${file.name.split('.')[0]}`,
    })

    return createSuccessResponse({
      url: result.url,
      publicId: result.publicId,
      width: result.width,
      height: result.height,
      format: result.format,
      folder,
      uploadedBy: user.id,
    }, 201)
  } catch (error: any) {
    console.error('POST /api/uploads error:', error)

    if (error.message.includes('Unauthorized')) {
      return createErrorResponse(
        error.message,
        'UNAUTHORIZED',
        401
      )
    }

    return createErrorResponse('Failed to upload file', 'UPLOAD_ERROR', 500)
  }
}