import { z } from 'zod'
import { PropertyType, PropertyCategory } from '@prisma/client'

export const CreatePropertySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title must be at most 100 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  price: z.number().positive('Price must be a positive number'),
  bedrooms: z.number().int().min(0, 'Bedrooms must be a non-negative integer'),
  bathrooms: z.number().int().min(0, 'Bathrooms must be a non-negative integer'),
  area: z.number().positive('Area must be a positive number'),
  propertyType: z.nativeEnum(PropertyType, { message: 'Invalid property type' }),
  category: z.nativeEnum(PropertyCategory, { message: 'Invalid category' }),
  location: z.string().min(1, 'Location is required'),
  latitude: z.number().min(-90).max(90, 'Latitude must be between -90 and 90'),
  longitude: z.number().min(-180).max(180, 'Longitude must be between -180 and 180'),
  videoUrl: z.string().url('Video URL must be a valid URL').optional().or(z.literal('')),
  floorPlanUrl: z.string().url('Floor plan URL must be a valid URL').optional().or(z.literal('')),
})

export const UpdatePropertySchema = CreatePropertySchema.partial()

export const CreateImageSchema = z.object({
  url: z.string().url('Image URL must be valid'),
  publicId: z.string().min(1, 'Public ID is required'),
  displayOrder: z.number().int().min(0).default(0),
})

export const CreateAmenitySchema = z.object({
  amenityId: z.string().min(1, 'Amenity ID is required'),
})

export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
})

export type CreatePropertyInput = z.infer<typeof CreatePropertySchema>
export type UpdatePropertyInput = z.infer<typeof UpdatePropertySchema>
export type CreateImageInput = z.infer<typeof CreateImageSchema>
export type CreateAmenityInput = z.infer<typeof CreateAmenitySchema>
export type PaginationInput = z.infer<typeof PaginationSchema>