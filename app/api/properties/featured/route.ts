import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createErrorResponse, createSuccessResponse } from '@/lib/api-auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET /api/properties/featured - Return featured properties
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Math.min(Number(searchParams.get('limit') || '10'), 20)

    const featuredProperties = await prisma.property.findMany({
      where: {
        featured: true,
        status: 'ACTIVE',
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
          take: 3, // Limit to first 3 images for featured view
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
          take: 5, // Limit to first 5 amenities for featured view
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
      take: limit,
    })

    return createSuccessResponse({
      properties: featuredProperties,
      count: featuredProperties.length,
    })
  } catch (error) {
    console.error('GET /api/properties/featured error:', error)
    return createErrorResponse('Internal server error', 'INTERNAL_ERROR', 500)
  }
}