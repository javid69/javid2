import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createErrorResponse, createSuccessResponse } from '@/lib/api-auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET /api/amenities - Return all available amenities
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    const whereClause = category ? { category } : {}

    const amenities = await prisma.amenity.findMany({
      where: whereClause,
      orderBy: [
        { category: 'asc' },
        { name: 'asc' },
      ],
      select: {
        id: true,
        name: true,
        icon: true,
        category: true,
        description: true,
      },
    })

    // Group amenities by category for better organization
    const groupedAmenities = amenities.reduce((acc, amenity) => {
      if (!acc[amenity.category]) {
        acc[amenity.category] = []
      }
      acc[amenity.category].push(amenity)
      return acc
    }, {} as Record<string, typeof amenities>)

    return createSuccessResponse({
      amenities,
      grouped: groupedAmenities,
      categories: [...new Set(amenities.map(a => a.category))],
      count: amenities.length,
    })
  } catch (error) {
    console.error('GET /api/amenities error:', error)
    return createErrorResponse('Internal server error', 'INTERNAL_ERROR', 500)
  }
}