import { Prisma } from '@prisma/client'
import { SearchFilters, PropertyType, PropertyCategory, SortOption } from './types'

export function buildWhereClause(filters: SearchFilters): Prisma.PropertyWhereInput {
  const where: Prisma.PropertyWhereInput = {
    status: 'ACTIVE' // Only show active properties
  }

  // Text search in title, description, location
  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search } },
      { description: { contains: filters.search } },
      { location: { contains: filters.search } }
    ]
  }

  // Price range filter
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.price = {}
    if (filters.minPrice !== undefined) {
      where.price.gte = filters.minPrice
    }
    if (filters.maxPrice !== undefined) {
      where.price.lte = filters.maxPrice
    }
  }

  // Property type filter
  if (filters.propertyTypes && filters.propertyTypes.length > 0) {
    where.propertyType = { in: filters.propertyTypes as PropertyType[] }
  }

  // Category filter
  if (filters.categories && filters.categories.length > 0) {
    where.category = { in: filters.categories as PropertyCategory[] }
  }

  // Location filter
  if (filters.location) {
    where.location = { contains: filters.location }
  }

  // Bedrooms filter
  if (filters.bedrooms !== undefined) {
    if (Array.isArray(filters.bedrooms)) {
      where.bedrooms = { in: filters.bedrooms }
    } else {
      where.bedrooms = filters.bedrooms
    }
  }

  // Bathrooms filter
  if (filters.bathrooms !== undefined) {
    if (Array.isArray(filters.bathrooms)) {
      where.bathrooms = { in: filters.bathrooms }
    } else {
      where.bathrooms = filters.bathrooms
    }
  }

  // Area range filter
  if (filters.minArea !== undefined || filters.maxArea !== undefined) {
    where.area = {}
    if (filters.minArea !== undefined) {
      where.area.gte = filters.minArea
    }
    if (filters.maxArea !== undefined) {
      where.area.lte = filters.maxArea
    }
  }

  // Featured filter
  if (filters.featured !== undefined) {
    where.featured = filters.featured
  }

  // Amenities filter - properties that have ALL selected amenities
  if (filters.amenities && filters.amenities.length > 0) {
    where.amenities = {
      every: {
        amenity: {
          id: { in: filters.amenities }
        }
      }
    }
  }

  return where
}

export function buildOrderByClause(sort: SortOption): Prisma.PropertyOrderByWithRelationInput[] {
  switch (sort) {
    case 'price-asc':
      return [{ price: 'asc' }]
    case 'price-desc':
      return [{ price: 'desc' }]
    case 'featured':
      return [{ featured: 'desc' }, { createdAt: 'desc' }]
    case 'newest':
    default:
      return [{ createdAt: 'desc' }]
  }
}

export function calculatePagination(page: number, limit: number, total: number) {
  const totalPages = Math.ceil(total / limit)
  const hasMore = page * limit < total

  return {
    page,
    limit,
    total,
    totalPages,
    hasMore
  }
}

export function formatPriceRange(minPrice?: number, maxPrice?: number): string {
  if (minPrice !== undefined && maxPrice !== undefined) {
    return `$${minPrice.toLocaleString()} - $${maxPrice.toLocaleString()}`
  }
  if (minPrice !== undefined) {
    return `From $${minPrice.toLocaleString()}`
  }
  if (maxPrice !== undefined) {
    return `Up to $${maxPrice.toLocaleString()}`
  }
  return 'Any Price'
}

export function formatAreaRange(minArea?: number, maxArea?: number): string {
  if (minArea !== undefined && maxArea !== undefined) {
    return `${minArea.toLocaleString()} - ${maxArea.toLocaleString()} sqft`
  }
  if (minArea !== undefined) {
    return `From ${minArea.toLocaleString()} sqft`
  }
  if (maxArea !== undefined) {
    return `Up to ${maxArea.toLocaleString()} sqft`
  }
  return 'Any Area'
}