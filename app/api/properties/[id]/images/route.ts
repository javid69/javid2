import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, requireRole, createErrorResponse, createSuccessResponse } from '@/lib/api-auth'
import { uploadImage, deleteImage, UploadResult } from '@/lib/cloudinary'
import { CreateImageSchema } from '@/lib/validations'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface RouteParams {
  params: Promise<{ id: string }>
}

// POST /api/properties/[id]/images - Upload multiple images to property
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireRole(request, ['AGENT', 'ADMIN'])
    const { id } = await params

    // Check if property exists and user has permission
    const property = await prisma.property.findUnique({
      where: { id },
      select: { agentId: true },
    })

    if (!property) {
      return createErrorResponse('Property not found', 'PROPERTY_NOT_FOUND', 404)
    }

    if (user.role !== 'ADMIN' && property.agentId !== user.id) {
      return createErrorResponse(
        'You can only add images to your own properties',
        'FORBIDDEN',
        403
      )
    }

    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return createErrorResponse('No files provided', 'NO_FILES', 400)
    }

    // Validate file types and sizes
    const validFiles: { buffer: Buffer; originalName: string }[] = []
    
    for (const file of files) {
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
          `File ${file.name} is too large. Maximum size is 5MB`,
          'FILE_TOO_LARGE',
          400
        )
      }

      const buffer = Buffer.from(await file.arrayBuffer())
      validFiles.push({
        buffer,
        originalName: file.name,
      })
    }

    // Upload images to Cloudinary
    const folder = `properties/${id}`
    const uploadedImages = await Promise.all(
      validFiles.map((file, index) =>
        uploadImage(file.buffer, folder, {
          publicId: `image_${Date.now()}_${index}`,
        })
      )
    )

    // Get current max display order
    const maxOrder = await prisma.propertyImage.aggregate({
      where: { propertyId: id },
      _max: { displayOrder: true },
    })

    let nextOrder = (maxOrder._max.displayOrder ?? -1) + 1

    // Save images to database
    const savedImages = await Promise.all(
      uploadedImages.map((uploadedImage: UploadResult, index) =>
        prisma.propertyImage.create({
          data: {
            propertyId: id,
            url: uploadedImage.url,
            publicId: uploadedImage.publicId,
            displayOrder: nextOrder + index,
          },
        })
      )
    )

    return createSuccessResponse(savedImages, 201)
  } catch (error: any) {
    console.error('POST /api/properties/[id]/images error:', error)

    if (error.message.includes('Unauthorized') || error.message.includes('Forbidden')) {
      return createErrorResponse(
        error.message,
        error.message.includes('Unauthorized') ? 'UNAUTHORIZED' : 'FORBIDDEN',
        error.message.includes('Unauthorized') ? 401 : 403
      )
    }

    return createErrorResponse('Failed to upload images', 'UPLOAD_ERROR', 500)
  }
}

// Alternative POST endpoint for adding image URLs directly
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireRole(request, ['AGENT', 'ADMIN'])
    const { id } = await params

    // Check if property exists and user has permission
    const property = await prisma.property.findUnique({
      where: { id },
      select: { agentId: true },
    })

    if (!property) {
      return createErrorResponse('Property not found', 'PROPERTY_NOT_FOUND', 404)
    }

    if (user.role !== 'ADMIN' && property.agentId !== user.id) {
      return createErrorResponse(
        'You can only add images to your own properties',
        'FORBIDDEN',
        403
      )
    }

    const body = await request.json()
    const validatedData = CreateImageSchema.parse(body)

    // Get current max display order
    const maxOrder = await prisma.propertyImage.aggregate({
      where: { propertyId: id },
      _max: { displayOrder: true },
    })

    const nextOrder = (maxOrder._max.displayOrder ?? -1) + 1

    const image = await prisma.propertyImage.create({
      data: {
        propertyId: id,
        ...validatedData,
        displayOrder: validatedData.displayOrder === 0 ? nextOrder : validatedData.displayOrder,
      },
    })

    return createSuccessResponse(image, 201)
  } catch (error: any) {
    console.error('PUT /api/properties/[id]/images error:', error)

    if (error.name === 'ZodError') {
      return createErrorResponse('Validation failed', 'VALIDATION_ERROR', 400)
    }

    if (error.message.includes('Unauthorized') || error.message.includes('Forbidden')) {
      return createErrorResponse(
        error.message,
        error.message.includes('Unauthorized') ? 'UNAUTHORIZED' : 'FORBIDDEN',
        error.message.includes('Unauthorized') ? 401 : 403
      )
    }

    return createErrorResponse('Failed to add image', 'ADD_IMAGE_ERROR', 500)
  }
}