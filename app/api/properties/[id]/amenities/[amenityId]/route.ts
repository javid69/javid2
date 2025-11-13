import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, createErrorResponse } from '@/lib/api-auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface RouteParams {
  params: Promise<{ id: string; amenityId: string }>
}

// DELETE /api/properties/[id]/amenities/[amenityId] - Remove amenity from property
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireAuth(request)
    const { id, amenityId } = await params

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
        'You can only remove amenities from your own properties',
        'FORBIDDEN',
        403
      )
    }

    // Check if property amenity exists
    const propertyAmenity = await prisma.propertyAmenity.findUnique({
      where: {
        propertyId_amenityId: {
          propertyId: id,
          amenityId,
        },
      },
    })

    if (!propertyAmenity) {
      return createErrorResponse(
        'Amenity not found in this property',
        'AMENITY_NOT_FOUND',
        404
      )
    }

    // Delete property amenity
    await prisma.propertyAmenity.delete({
      where: {
        propertyId_amenityId: {
          propertyId: id,
          amenityId,
        },
      },
    })

    return new Response(null, { status: 204 })
  } catch (error: any) {
    console.error('DELETE /api/properties/[id]/amenities/[amenityId] error:', error)

    if (error.message.includes('Unauthorized') || error.message.includes('Forbidden')) {
      return createErrorResponse(
        error.message,
        error.message.includes('Unauthorized') ? 'UNAUTHORIZED' : 'FORBIDDEN',
        error.message.includes('Unauthorized') ? 401 : 403
      )
    }

    return createErrorResponse('Failed to remove amenity', 'REMOVE_AMENITY_ERROR', 500)
  }
}