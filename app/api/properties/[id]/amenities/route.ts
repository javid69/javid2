import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, requireRole, createErrorResponse, createSuccessResponse } from '@/lib/api-auth'
import { CreateAmenitySchema } from '@/lib/validations'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/properties/[id]/amenities - Get all amenities for a property
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const propertyAmenities = await prisma.propertyAmenity.findMany({
      where: { propertyId: id },
      include: {
        amenity: {
          select: {
            id: true,
            name: true,
            icon: true,
            category: true,
            description: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    return createSuccessResponse({
      amenities: propertyAmenities.map(pa => pa.amenity),
    })
  } catch (error) {
    console.error('GET /api/properties/[id]/amenities error:', error)
    return createErrorResponse('Internal server error', 'INTERNAL_ERROR', 500)
  }
}

// POST /api/properties/[id]/amenities - Add amenity to property
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
        'You can only add amenities to your own properties',
        'FORBIDDEN',
        403
      )
    }

    const body = await request.json()
    const { amenityId } = CreateAmenitySchema.parse(body)

    // Check if amenity exists
    const amenity = await prisma.amenity.findUnique({
      where: { id: amenityId },
    })

    if (!amenity) {
      return createErrorResponse('Amenity not found', 'AMENITY_NOT_FOUND', 404)
    }

    // Check if amenity is already added to property
    const existingPropertyAmenity = await prisma.propertyAmenity.findUnique({
      where: {
        propertyId_amenityId: {
          propertyId: id,
          amenityId,
        },
      },
    })

    if (existingPropertyAmenity) {
      return createErrorResponse(
        'Amenity already added to this property',
        'AMENITY_ALREADY_EXISTS',
        400
      )
    }

    // Add amenity to property
    const propertyAmenity = await prisma.propertyAmenity.create({
      data: {
        propertyId: id,
        amenityId,
      },
      include: {
        amenity: {
          select: {
            id: true,
            name: true,
            icon: true,
            category: true,
            description: true,
          },
        },
      },
    })

    return createSuccessResponse(propertyAmenity.amenity, 201)
  } catch (error: any) {
    console.error('POST /api/properties/[id]/amenities error:', error)

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

    if (error.code === 'P2002') {
      return createErrorResponse(
        'Amenity already added to this property',
        'AMENITY_ALREADY_EXISTS',
        400
      )
    }

    return createErrorResponse('Failed to add amenity', 'ADD_AMENITY_ERROR', 500)
  }
}