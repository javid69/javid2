import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, requireRole, createErrorResponse, createSuccessResponse } from '@/lib/api-auth'
import { UpdatePropertySchema } from '@/lib/validations'
import { PropertyStatus } from '@prisma/client'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/properties/[id] - Fetch single property by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        agent: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            phone: true,
            bio: true,
          },
        },
        images: {
          orderBy: {
            displayOrder: 'asc',
          },
        },
        amenities: {
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
        },
        _count: {
          select: {
            inquiries: true,
            viewingSchedules: true,
          },
        },
      },
    })

    if (!property) {
      return createErrorResponse('Property not found', 'PROPERTY_NOT_FOUND', 404)
    }

    // Increment view count
    await prisma.property.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    })

    // Get similar properties (same category, exclude current property)
    const similarProperties = await prisma.property.findMany({
      where: {
        id: {
          not: id,
        },
        category: property.category,
        status: PropertyStatus.ACTIVE,
      },
      include: {
        agent: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        images: {
          orderBy: {
            displayOrder: 'asc',
          },
          take: 1,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 4,
    })

    return createSuccessResponse({
      ...property,
      similarProperties,
    })
  } catch (error) {
    console.error('GET /api/properties/[id] error:', error)
    return createErrorResponse('Internal server error', 'INTERNAL_ERROR', 500)
  }
}

// PUT /api/properties/[id] - Update property
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireAuth(request)
    const { id } = await params

    // Check if property exists
    const existingProperty = await prisma.property.findUnique({
      where: { id },
      select: { agentId: true },
    })

    if (!existingProperty) {
      return createErrorResponse('Property not found', 'PROPERTY_NOT_FOUND', 404)
    }

    // Check authorization: AGENT can update own, ADMIN can update any
    if (user.role !== 'ADMIN' && existingProperty.agentId !== user.id) {
      return createErrorResponse(
        'You can only update your own properties',
        'FORBIDDEN',
        403
      )
    }

    const body = await request.json()
    const validatedData = UpdatePropertySchema.parse(body)

    const updatedProperty = await prisma.property.update({
      where: { id },
      data: validatedData,
      include: {
        agent: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            phone: true,
          },
        },
        images: {
          orderBy: {
            displayOrder: 'asc',
          },
        },
        amenities: {
          include: {
            amenity: {
              select: {
                id: true,
                name: true,
                icon: true,
                category: true,
              },
            },
          },
        },
      },
    })

    return createSuccessResponse(updatedProperty)
  } catch (error: any) {
    console.error('PUT /api/properties/[id] error:', error)

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

    if (error.code === 'P2025') {
      return createErrorResponse('Property not found', 'PROPERTY_NOT_FOUND', 404)
    }

    return createErrorResponse('Internal server error', 'INTERNAL_ERROR', 500)
  }
}

// DELETE /api/properties/[id] - Delete property
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireAuth(request)
    const { id } = await params

    // Check if property exists
    const existingProperty = await prisma.property.findUnique({
      where: { id },
      select: { agentId: true },
    })

    if (!existingProperty) {
      return createErrorResponse('Property not found', 'PROPERTY_NOT_FOUND', 404)
    }

    // Check authorization: AGENT can delete own, ADMIN can delete any
    if (user.role !== 'ADMIN' && existingProperty.agentId !== user.id) {
      return createErrorResponse(
        'You can only delete your own properties',
        'FORBIDDEN',
        403
      )
    }

    // Delete property (cascade deletes will handle related records)
    await prisma.property.delete({
      where: { id },
    })

    return new Response(null, { status: 204 })
  } catch (error: any) {
    console.error('DELETE /api/properties/[id] error:', error)

    if (error.message.includes('Unauthorized') || error.message.includes('Forbidden')) {
      return createErrorResponse(
        error.message,
        error.message.includes('Unauthorized') ? 'UNAUTHORIZED' : 'FORBIDDEN',
        error.message.includes('Unauthorized') ? 401 : 403
      )
    }

    if (error.code === 'P2025') {
      return createErrorResponse('Property not found', 'PROPERTY_NOT_FOUND', 404)
    }

    return createErrorResponse('Internal server error', 'INTERNAL_ERROR', 500)
  }
}