import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole, createErrorResponse, createSuccessResponse } from '@/lib/api-auth'
import { CreatePropertySchema, PaginationSchema } from '@/lib/validations'
import { PropertyStatus } from '@prisma/client'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET /api/properties - Fetch all properties with pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pagination = PaginationSchema.parse({
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '12',
    })

    const status = searchParams.get('status') as PropertyStatus || PropertyStatus.ACTIVE
    
    const skip = (pagination.page - 1) * pagination.limit

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where: {
          status,
        },
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
            select: {
              id: true,
              url: true,
              displayOrder: true,
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
          _count: {
            select: {
              inquiries: true,
              viewingSchedules: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: pagination.limit,
      }),
      prisma.property.count({
        where: {
          status,
        },
      }),
    ])

    const totalPages = Math.ceil(total / pagination.limit)
    const hasMore = pagination.page < totalPages

    return createSuccessResponse({
      properties,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages,
        hasMore,
      },
    })
  } catch (error) {
    console.error('GET /api/properties error:', error)
    return createErrorResponse('Internal server error', 'INTERNAL_ERROR', 500)
  }
}

// POST /api/properties - Create new property (AGENT or ADMIN only)
export async function POST(request: NextRequest) {
  try {
    // Check authorization - only AGENT or ADMIN can create properties
    const user = await requireRole(request, ['AGENT', 'ADMIN'])

    const body = await request.json()
    const validatedData = CreatePropertySchema.parse(body)

    // Create property
    const property = await prisma.property.create({
      data: {
        ...validatedData,
        agentId: user.id,
        status: PropertyStatus.ACTIVE,
      },
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
            amenity: true,
          },
        },
      },
    })

    return createSuccessResponse(property, 201)
  } catch (error: any) {
    console.error('POST /api/properties error:', error)
    
    if (error.name === 'ZodError') {
      return createErrorResponse(
        'Validation failed',
        'VALIDATION_ERROR',
        400
      )
    }

    if (error.message.includes('Unauthorized') || error.message.includes('Forbidden')) {
      return createErrorResponse(
        error.message,
        error.message.includes('Unauthorized') ? 'UNAUTHORIZED' : 'FORBIDDEN',
        error.message.includes('Unauthorized') ? 401 : 403
      )
    }

    return createErrorResponse('Internal server error', 'INTERNAL_ERROR', 500)
  }
}