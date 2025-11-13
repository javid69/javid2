import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { SearchFiltersSchema, PropertySearchResult } from '@/lib/types'
import { buildWhereClause, buildOrderByClause, calculatePagination } from '@/lib/search-utils'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse and validate query parameters
    const params: Record<string, any> = Object.fromEntries(searchParams.entries())
    
    // Handle array parameters (e.g., propertyTypes=APARTMENT&propertyTypes=HOUSE)
    const arrayParams = ['propertyTypes', 'categories', 'bedrooms', 'bathrooms', 'amenities']
    arrayParams.forEach(param => {
      const values = searchParams.getAll(param)
      if (values.length > 0) {
        // Always convert to array for consistency
        params[param] = values
      }
    })

    const validationResult = SearchFiltersSchema.safeParse(params)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid query parameters',
          details: validationResult.error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      )
    }

    const filters = validationResult.data
    const where = buildWhereClause(filters)
    const orderBy = buildOrderByClause(filters.sort)
    const skip = (filters.page - 1) * filters.limit
    const take = filters.limit

    // Execute queries in parallel for better performance
    const [properties, totalCount] = await Promise.all([
      prisma.property.findMany({
        where,
        orderBy,
        skip,
        take,
        include: {
          agent: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              avatar: true
            }
          },
          images: {
            orderBy: {
              sortOrder: 'asc'
            },
            select: {
              id: true,
              url: true,
              caption: true,
              sortOrder: true
            }
          },
          amenities: {
            include: {
              amenity: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                  icon: true,
                  category: true
                }
              }
            }
          }
        }
      }),
      prisma.property.count({ where })
    ])

    // Transform the amenities data to match the expected interface
    const transformedProperties = properties.map(property => ({
      ...property,
      amenities: property.amenities.map(pa => pa.amenity)
    }))

    const pagination = calculatePagination(filters.page, filters.limit, totalCount)

    const result: PropertySearchResult = {
      data: transformedProperties,
      pagination
    }

    // Add cache headers for better performance
    const response = NextResponse.json(result)
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')
    
    return response

  } catch (error) {
    console.error('Property search error:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to search properties. Please try again later.'
      },
      { status: 500 }
    )
  }
}