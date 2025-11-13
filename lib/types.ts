import { z } from 'zod'

export const PropertyTypeSchema = z.enum([
  'APARTMENT',
  'HOUSE', 
  'VILLA',
  'COMMERCIAL',
  'OFFICE',
  'SHOP',
  'LAND',
  'STUDIO'
])

export const PropertyCategorySchema = z.enum([
  'RENT',
  'SALE',
  'SHORT_TERM'
])

export const SortOptionSchema = z.enum([
  'newest',
  'price-asc',
  'price-desc', 
  'featured'
])

export const SearchFiltersSchema = z.object({
  search: z.string().optional(),
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  propertyTypes: z.array(PropertyTypeSchema).optional(),
  categories: z.array(PropertyCategorySchema).optional(),
  location: z.string().optional(),
  bedrooms: z.union([
    z.coerce.number().int().min(0),
    z.array(z.coerce.number().int().min(0))
  ]).optional(),
  bathrooms: z.union([
    z.coerce.number().int().min(0),
    z.array(z.coerce.number().int().min(0))
  ]).optional(),
  minArea: z.coerce.number().positive().optional(),
  maxArea: z.coerce.number().positive().optional(),
  amenities: z.array(z.string()).optional(),
  featured: z.coerce.boolean().optional(),
  sort: SortOptionSchema.default('newest'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12)
})

export type SearchFilters = z.infer<typeof SearchFiltersSchema>
export type PropertyType = z.infer<typeof PropertyTypeSchema>
export type PropertyCategory = z.infer<typeof PropertyCategorySchema>
export type SortOption = z.infer<typeof SortOptionSchema>

export interface PropertySearchResult {
  data: PropertyWithRelations[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasMore: boolean
  }
}

export interface PropertyWithRelations {
  id: string
  title: string
  description: string
  price: number
  address: string
  location: string
  coordinates?: string | null
  area: number
  bedrooms: number
  bathrooms: number
  propertyType: PropertyType
  category: PropertyCategory
  featured: boolean
  status: string
  createdAt: Date
  updatedAt: Date
  agent: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone?: string | null
    avatar?: string | null
  }
  images: {
    id: string
    url: string
    caption?: string | null
    sortOrder: number
  }[]
  amenities: {
    id: string
    name: string
    description?: string | null
    icon?: string | null
    category?: string | null
  }[]
}

export interface SavedSearch {
  id: string
  name: string
  filters: SearchFilters
  notify: boolean
  createdAt: Date
  updatedAt: Date
}