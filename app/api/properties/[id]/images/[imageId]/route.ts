import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, requireRole, createErrorResponse } from '@/lib/api-auth'
import { deleteImage } from '@/lib/cloudinary'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface RouteParams {
  params: Promise<{ id: string; imageId: string }>
}

// DELETE /api/properties/[id]/images/[imageId] - Delete specific image
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireAuth(request)
    const { id, imageId } = await params

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
        'You can only delete images from your own properties',
        'FORBIDDEN',
        403
      )
    }

    // Find the image
    const image = await prisma.propertyImage.findUnique({
      where: { id: imageId },
    })

    if (!image) {
      return createErrorResponse('Image not found', 'IMAGE_NOT_FOUND', 404)
    }

    // Verify image belongs to the specified property
    if (image.propertyId !== id) {
      return createErrorResponse(
        'Image does not belong to this property',
        'IMAGE_NOT_BELONG_TO_PROPERTY',
        400
      )
    }

    // Delete from Cloudinary
    try {
      await deleteImage(image.publicId)
    } catch (cloudinaryError) {
      console.error('Failed to delete from Cloudinary:', cloudinaryError)
      // Continue with database deletion even if Cloudinary fails
    }

    // Delete from database
    await prisma.propertyImage.delete({
      where: { id: imageId },
    })

    // Reorder remaining images
    const remainingImages = await prisma.propertyImage.findMany({
      where: { propertyId: id },
      orderBy: { displayOrder: 'asc' },
    })

    // Update display orders
    await Promise.all(
      remainingImages.map((img, index) =>
        prisma.propertyImage.update({
          where: { id: img.id },
          data: { displayOrder: index },
        })
      )
    )

    return new Response(null, { status: 204 })
  } catch (error: any) {
    console.error('DELETE /api/properties/[id]/images/[imageId] error:', error)

    if (error.message.includes('Unauthorized') || error.message.includes('Forbidden')) {
      return createErrorResponse(
        error.message,
        error.message.includes('Unauthorized') ? 'UNAUTHORIZED' : 'FORBIDDEN',
        error.message.includes('Unauthorized') ? 401 : 403
      )
    }

    if (error.code === 'P2025') {
      return createErrorResponse('Image not found', 'IMAGE_NOT_FOUND', 404)
    }

    return createErrorResponse('Failed to delete image', 'DELETE_IMAGE_ERROR', 500)
  }
}