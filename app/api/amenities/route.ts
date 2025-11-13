import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    const where = category ? { category } : {}

    const amenities = await prisma.amenity.findMany({
      where,
      orderBy: [
        { category: 'asc' },
        { name: 'asc' }
      ],
      select: {
        id: true,
        name: true,
        description: true,
        icon: true,
        category: true
      }
    })

    // Group amenities by category for better frontend organization
    const groupedAmenities = amenities.reduce((acc, amenity) => {
      const category = amenity.category || 'other'
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(amenity)
      return acc
    }, {} as Record<string, typeof amenities>)

    const response = NextResponse.json({ 
      data: amenities,
      grouped: groupedAmenities
    })

    // Cache amenities for longer period since they rarely change
    response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
    
    return response

  } catch (error) {
    console.error('Get amenities error:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to fetch amenities. Please try again later.'
      },
      { status: 500 }
    )
  }
}